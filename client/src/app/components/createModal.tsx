'use client';
import React, { useState, useEffect } from 'react';
import { useRegisterServiceMutation, useUpdateServiceMutation } from '../../../store/features/serviceApi';

type InputOption = {
    label: string;
    value: string;
};

type InputField = {
    name: string;
    type: string;
    value: string;
    required: boolean;
    options?: InputOption[];
};

type ServiceData = {
    name: string;
    inputs: InputField[];
    apiEndpoint?: string;
    image?: File | null;
};

interface ServiceFormModalProps {
    editMode?: boolean;
    newService: ServiceData;
    setNewService: React.Dispatch<React.SetStateAction<ServiceData>>;
    onClose: () => void;
    onSave: (service: ServiceData) => void;
    refetch: () => void; // Added refetch property
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
    editMode = false,
    newService,
    refetch,
    setNewService,
    onClose,
    onSave,
}) => {
    const [localService, setLocalService] = useState<ServiceData>(newService);

    useEffect(() => {
        setLocalService(newService);
    }, [newService]);

    const handleInputChange = (fieldIndex: number, key: keyof InputField, value: any) => {
        const updated = [...localService.inputs];
        (updated[fieldIndex][key] as typeof value) = value;
        setLocalService({ ...localService, inputs: updated });
    };

    const handleOptionChange = (fieldIndex: number, optionIndex: number, key: keyof InputOption, value: string) => {
        const updated = [...localService.inputs];
        const options = updated[fieldIndex].options || [];
        options[optionIndex][key] = value;
        updated[fieldIndex].options = options;
        setLocalService({ ...localService, inputs: updated });
    };

    const addInputField = () => {
        setLocalService(prev => ({
            ...prev,
            inputs: [
                ...prev.inputs,
                {
                    name: '',
                    type: 'text',
                    value: '',
                    required: false,
                    options: [],
                },
            ],
        }));
    };

    const addOption = (fieldIndex: number) => {
        const updated = [...localService.inputs];
        if (!updated[fieldIndex].options) updated[fieldIndex].options = [];
        updated[fieldIndex].options!.push({ label: '', value: '' });
        setLocalService({ ...localService, inputs: updated });
    };
    const [updateService] = useUpdateServiceMutation()
    const [submitService, isLoading] = useRegisterServiceMutation()
    const handleSave = async () => {
        if (!localService.name.trim()) {
            return alert('Service name is required.');
        }

        // Construct FormData
        const formData = new FormData();
        formData.append('name', localService.name);
        if (localService.apiEndpoint) formData.append('apiEndpoint', localService.apiEndpoint);
        if (localService.image) formData.append('image', localService.image);

        // Convert inputs to JSON string
        formData.append('inputs', JSON.stringify(localService.inputs));

        try {
            if (editMode) {
                await updateService(formData).unwrap();
            } else {
                await submitService(formData).unwrap();
            }
            refetch();
            onClose();
        } catch (error) {
            console.error('Service submission failed:', error);
            alert('Failed to save the service.');
        }
    };


    return (
        <div className="fixed text-black inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white max-w-2xl w-full p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh] relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl font-bold"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold mb-4">{editMode ? 'Edit Service' : 'Create New Service'}</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Service Name"
                        value={localService.name}
                        onChange={(e) => setLocalService(prev => ({ ...prev, name: e.target.value }))}
                    />

                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        placeholder="API Endpoint"
                        value={localService.apiEndpoint || ''}
                        onChange={(e) => setLocalService(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        className="w-full border px-3 py-2 rounded"
                        onChange={(e) => setLocalService(prev => ({ ...prev, image: e.target.files?.[0] }))}
                    />

                    {localService.inputs.map((input, index) => (
                        <div key={index} className="p-4 bg-gray-100 border rounded space-y-2">
                            <input
                                type="text"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Input Name"
                                value={input.name}
                                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                            />

                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={input.type}
                                onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="password">Password</option>
                                <option value="selectbox">Selectbox</option>
                                <option value="radio">Radio</option>
                            </select>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={input.required}
                                    onChange={(e) => handleInputChange(index, 'required', e.target.checked)}
                                />
                                Required
                            </label>

                            {(input.type === 'selectbox' || input.type === 'radio') && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => addOption(index)}
                                        className="text-blue-600 underline text-sm"
                                    >
                                        + Add Option
                                    </button>

                                    {input.options?.map((opt, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Label"
                                                className="border px-2 py-1 rounded w-1/2"
                                                value={opt.label}
                                                onChange={(e) => handleOptionChange(index, i, 'label', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                className="border px-2 py-1 rounded w-1/2"
                                                value={opt.value}
                                                onChange={(e) => handleOptionChange(index, i, 'value', e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className="text-blue-600 underline"
                        onClick={addInputField}
                    >
                        + Add Field
                    </button>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            className="px-4 py-2 border border-gray-300 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded"
                            onClick={handleSave}
                        >
                            {editMode ? 'Update Service' : 'Save Service'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceFormModal;

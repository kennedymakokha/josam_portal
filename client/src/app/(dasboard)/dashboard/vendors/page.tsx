'use client'
import { useState } from 'react';
import { useDeleteServiceMutation, useGetServicesQuery, useToggleactiveServiceMutation } from '../../../../../store/features/serviceApi';

interface Service {
    _id?: string; // Add the missing _id property
    name: string;
    inputs: any[];
    apiEndpoint: string;
    image: string | null;
    active?: boolean;
}


import ServiceFormModal from '@/app/components/createModal';
import PreviewModal from '@/app/components/previewModal';
import ConfirmActionModal from '@/app/components/confirmactionModal';
import Image from 'next/image';

export default function ServiceTable() {
    const [submit] = useToggleactiveServiceMutation();
    const [deleteService] = useDeleteServiceMutation();
    const { data, refetch } = useGetServicesQuery(undefined, {
        selectFromResult: (result) => ({
            data: result.data as { services: Service[] } | undefined,
            isSuccess: result.isSuccess,
            isLoading: result.isLoading,
            error: result.error,
        }),
    });
    const [options, setOptions] = useState<any[]>([]);
    const [selectedOption, setSelectedOption] = useState<any | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmDescription, setConfirmDescription] = useState('');
    const [confirmDanger, setConfirmDanger] = useState(false);
    const [newService, setNewService] = useState<any>({
        name: '',
        inputs: [],
        apiEndpoint: '',
        image: null,
    });

    const handleInputChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = (option: Service) => {
        setConfirmTitle(`Delete ${option.name}?`);
        setConfirmDescription('This action cannot be undone.');
        setConfirmDanger(true);
        setConfirmAction(() => async () => {
            try {
                await deleteService(option._id).unwrap();
                refetch(); // Re-fetch data after successful status update
            } catch (error) {
                console.error('Error toggling service status:', error);
            } finally {
                setShowConfirmModal(false); // Close modal whether success or error
            }
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };
    const handleToggleStatus = (option: Service) => {
        const action = option.active ? 'Deactivate' : 'Activate';

        // Set up the confirmation modal text
        setConfirmTitle(`${action} ${option.name}?`);
        setConfirmDescription(`This will ${action.toLowerCase()} the service.`);
        setConfirmDanger(false); // Set to true if you want red-styled modal for destructive actions

        // Define what happens on confirm
        setConfirmAction(() => async () => {
            try {
                await submit(option._id).unwrap();
                refetch(); // Re-fetch data after successful status update
            } catch (error) {
                console.error('Error toggling service status:', error);
            } finally {
                setShowConfirmModal(false); // Close modal whether success or error
            }
        });

        // Show the modal
        setShowConfirmModal(true);
    };



    const handleEdit = (option: Service) => {
        setEditMode(true);
        setNewService(option);
        setShowCreateModal(true);
    };
    const handleSubmit = () => {
        alert(`Submitted form data:\n` + JSON.stringify(formData, null, 2));
        setSelectedOption(null);
    };
    const services = data?.services || options;
    const parsedServices = services.map((option) => {
        const parsedInputs =
            typeof option.inputs?.[0] === 'string'
                ? JSON.parse(option.inputs[0])
                : option.inputs;
        return { ...option, inputs: parsedInputs };
    });

    return (
        <div className="space-y-10 text-black p-4 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Available Services</h1>
                <button
                    onClick={() => {
                        setEditMode(false);
                        setNewService({ name: '', inputs: [], image: null, apiEndpoint: '' });
                        setShowCreateModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    + Add Service
                </button>
            </div>

            {parsedServices.map((option: Service) => (
                <div key={option.name} className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{option.name} Services</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setSelectedOption(option);
                                    setFormData({});
                                }}
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                                Preview
                            </button>
                            <button
                                onClick={() => handleEdit(option)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(option)}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => handleToggleStatus(option)}
                                className={`px-3 py-1 rounded text-white ${option.active ? 'bg-gray-500' : 'bg-green-600'}`}
                            >
                                {option.active ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm">
                        {/* API Endpoint Row */}
                        <div>
                            <strong>API Endpoint:</strong>{' '}
                            <span className="text-gray-700">{option.apiEndpoint || <em className="text-gray-400">N/A</em>}</span>
                        </div>

                        {/* Image Preview Row */}
                        <div>
                            <strong>Service Image:</strong>
                            <div className="mt-2">
                                {option.image ? (
                                    typeof option.image === 'string' ? (
                                        // If it's a URL string (e.g., from backend)
                                        <Image width={100} height={100} src={option.image} alt="Service" className="w-32 h-32 object-cover rounded border" />
                                    ) : (
                                        // If it's a File object (local preview)
                                        <Image height={1000} width={100} src={URL.createObjectURL(option.image)} alt="Preview" className="w-32 h-32 object-cover rounded border" />
                                    )
                                ) : (
                                    <span className="text-gray-400 italic">No image provided</span>
                                )}
                            </div>
                        </div>

                        {/* Inputs Table */}
                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-gray-200 text-black">
                                <tr>
                                    <th className="px-4 py-2 text-left">Input Name</th>
                                    <th className="px-4 py-2 text-left">Type</th>
                                    <th className="px-4 py-2 text-left">Required</th>
                                    <th className="px-4 py-2 text-left">Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {option.inputs.length > 0 ? (
                                    option.inputs.map((input: any, idx: number) => (
                                        <tr key={idx} className="border-t">
                                            <td className="px-4 py-2">{input.name || <em className="text-gray-400">Unnamed</em>}</td>
                                            <td className="px-4 py-2 capitalize">{input.type}</td>
                                            <td className="px-4 py-2">{input.required ? 'Yes' : 'No'}</td>
                                            <td className="px-4 py-2">
                                                {(input.type === 'selectbox' || input.type === 'radio') && input.options?.length ? (
                                                    <ul className="list-disc pl-5">
                                                        {input.options.map((opt: { label: string; value: string }, i: number) => (
                                                            <li key={i}>
                                                                {opt.label || <em className="text-gray-400">No Label</em>}{' '}
                                                                <span className="text-gray-500">({opt.value || 'No Value'})</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="text-gray-400 italic">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-gray-500 italic">
                                            No input fields defined.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            ))}

            {/* Modals */}

            {selectedOption && (
                <PreviewModal
                    service={selectedOption}
                    formData={formData}
                    onChange={handleInputChange}
                    onClose={() => setSelectedOption(null)}
                    onSubmit={handleSubmit}
                />
            )}

            {showCreateModal && (
                <ServiceFormModal
                    editMode={editMode}
                    newService={newService}
                    refetch={async () => await refetch()}
                    setNewService={setNewService}
                    onClose={() => setShowCreateModal(false)}
                    onSave={(service) => {
                        if (editMode) {
                            setOptions((prev) =>
                                prev.map((item) =>
                                    item.name === service.name ? service : item
                                )
                            );
                        } else {
                            setOptions((prev) => [...prev, service]);
                        }
                        setShowCreateModal(false);
                    }}
                />
            )}
            {showConfirmModal && confirmAction && (
                <ConfirmActionModal
                    title={confirmTitle}
                    description={confirmDescription}
                    danger={confirmDanger}
                    onConfirm={confirmAction}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
}

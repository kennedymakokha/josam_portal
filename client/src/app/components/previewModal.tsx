'use client';
import React from 'react';

type InputOption = {
    label: string;
    value: string;
};

type InputField = {
    name: string;
    type: string;
    required: boolean;
    options?: InputOption[];
};

type ServiceData = {
    name: string;
    inputs: InputField[];
};

interface PreviewModalProps {
    service: ServiceData;
    formData: Record<string, string>;
    onChange: (name: string, value: string) => void;
    onClose: () => void;
    onSubmit: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
    service,
    formData,
    onChange,
    onClose,
    onSubmit,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
                <button
                    className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h3 className="text-2xl font-semibold mb-4">{service.name} Form</h3>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    className="space-y-4"
                >
                    {service.inputs.map((input, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                            <label className="font-medium text-gray-700">
                                {input.name}
                                {input.required && <span className="text-red-500">*</span>}
                            </label>

                            {input.type === 'selectbox' ? (
                                <select
                                    required={input.required}
                                    className="border border-gray-300 rounded px-3 py-2"
                                    value={formData[input.name] || ''}
                                    onChange={(e) => onChange(input.name, e.target.value)}
                                >
                                    <option value="">Select {input.name}</option>
                                    {input.options?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            ) : input.type === 'radio' ? (
                                <div className="flex flex-col gap-2 pl-2">
                                    {input.options?.map((opt) => (
                                        <label key={opt.value} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={input.name}
                                                value={opt.value}
                                                required={input.required}
                                                checked={formData[input.name] === opt.value}
                                                onChange={(e) => onChange(input.name, e.target.value)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    type={input.type}
                                    required={input.required}
                                    className="border border-gray-300 rounded px-3 py-2"
                                    value={formData[input.name] || ''}
                                    onChange={(e) => onChange(input.name, e.target.value)}
                                />
                            )}
                        </div>
                    ))}

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PreviewModal;

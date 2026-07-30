
import React, { useState, useEffect } from 'react';
import { PencilIcon, XIcon, CheckIcon } from './icons';

interface EditRecordModalProps {
    record: any;
    onClose: () => void;
    onSave: (updates: Record<string, string>) => Promise<void>;
}

const FIELD_DEFS = [
    {
        key: 'name',
        label: 'Project Name',
        placeholder: 'e.g. Johnson Roof Replacement',
        type: 'text',
    },
    {
        key: 'property_address',
        label: 'Property Address',
        placeholder: 'e.g. 123 Main St, Springfield, IL 62701',
        type: 'text',
    },
    {
        key: 'project_type',
        label: 'Project Type',
        placeholder: 'e.g. Residential, Commercial',
        type: 'text',
    },
    {
        key: 'assigned_name',
        label: 'Assigned Rep',
        placeholder: 'e.g. John Smith',
        type: 'text',
    },
    {
        key: 'notes',
        label: 'Notes',
        placeholder: 'Additional details about this record…',
        type: 'textarea',
    },
] as const;

const EditRecordModal: React.FC<EditRecordModalProps> = ({ record, onClose, onSave }) => {
    const [fields, setFields] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Seed form with existing record values
    useEffect(() => {
        const initial: Record<string, string> = {};
        FIELD_DEFS.forEach(f => {
            initial[f.key] = (record?.[f.key] ?? '').toString();
        });
        setFields(initial);
    }, [record]);

    const handleChange = (key: string, value: string) => {
        setFields(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        await onSave(fields);
        setSaving(false);
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            onClose();
        }, 800);
    };

    const isDirty = FIELD_DEFS.some(f => (record?.[f.key] ?? '').toString() !== fields[f.key]);

    return (
        <div
            id="edit-record-modal-backdrop"
            className="fixed inset-0 z-[300] flex items-center justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

            {/* Panel */}
            <div
                id="edit-record-modal-panel"
                className="relative z-10 w-full max-w-lg mx-4 bg-[#0a0a0a] border border-gray-800 shadow-[0_0_70px_rgba(236,2,139,0.12)] overflow-hidden"
                style={{
                    clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent" />

                {/* Pink chamfer accent — top-left */}
                <svg className="absolute top-0 left-0 w-5 h-5 z-20 overflow-visible pointer-events-none">
                    <line x1="8" y1="12" x2="12" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" />
                </svg>

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#ec028b]/10 border border-[#ec028b]/30 rounded-sm">
                            <PencilIcon className="w-5 h-5 text-[#ec028b]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ec028b] mb-0.5">
                                Pipeline Record
                            </p>
                            <h2 className="text-lg font-black text-white">Edit Record</h2>
                        </div>
                    </div>
                    <button
                        id="edit-record-close-btn"
                        onClick={onClose}
                        aria-label="Close edit modal"
                        className="w-8 h-8 flex items-center justify-center border border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white transition-all rounded-sm"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {FIELD_DEFS.map(f => (
                        <div key={f.key}>
                            <label
                                htmlFor={`edit-field-${f.key}`}
                                className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5"
                            >
                                {f.label}
                            </label>
                            {f.type === 'textarea' ? (
                                <textarea
                                    id={`edit-field-${f.key}`}
                                    value={fields[f.key] ?? ''}
                                    onChange={(e) => handleChange(f.key, e.target.value)}
                                    placeholder={f.placeholder}
                                    rows={3}
                                    className="w-full bg-gray-900/60 border border-gray-800 text-white text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#ec028b]/50 focus:ring-1 focus:ring-[#ec028b]/20 placeholder-gray-700 transition-all resize-none"
                                />
                            ) : (
                                <input
                                    id={`edit-field-${f.key}`}
                                    type="text"
                                    value={fields[f.key] ?? ''}
                                    onChange={(e) => handleChange(f.key, e.target.value)}
                                    placeholder={f.placeholder}
                                    className="w-full bg-gray-900/60 border border-gray-800 text-white text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#ec028b]/50 focus:ring-1 focus:ring-[#ec028b]/20 placeholder-gray-700 transition-all"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-black/30">
                    <p className="text-[10px] text-gray-600 font-mono">
                        ID: {record?.id?.slice(-12) || '—'}
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            id="edit-record-cancel-btn"
                            onClick={onClose}
                            disabled={saving}
                            className="px-5 py-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white border border-gray-800 hover:border-gray-600 transition-all rounded-sm disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            id="edit-record-save-btn"
                            onClick={handleSave}
                            disabled={saving || !isDirty}
                            className={`flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-sm disabled:opacity-40 disabled:pointer-events-none
                                ${saved
                                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                                    : 'bg-[#ec028b]/15 border border-[#ec028b]/50 text-[#ec028b] hover:bg-[#ec028b]/25 hover:border-[#ec028b] hover:shadow-[0_0_20px_rgba(236,2,139,0.2)]'
                                }`}
                        >
                            {saving ? (
                                <div className="w-3 h-3 border border-[#ec028b] border-t-transparent rounded-full animate-spin" />
                            ) : saved ? (
                                <CheckIcon className="w-3.5 h-3.5" />
                            ) : (
                                <PencilIcon className="w-3.5 h-3.5" />
                            )}
                            {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditRecordModal;

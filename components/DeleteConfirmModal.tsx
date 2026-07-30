
import React, { useState } from 'react';
import { TrashIcon, XIcon } from './icons';

interface DeleteConfirmModalProps {
    recordName: string;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ recordName, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm(reason.trim());
        setLoading(false);
    };

    return (
        <div
            id="delete-confirm-modal-backdrop"
            className="fixed inset-0 z-[300] flex items-center justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

            {/* Panel */}
            <div
                id="delete-confirm-modal-panel"
                className="relative z-10 w-full max-w-md mx-4 bg-[#0a0a0a] border border-gray-800 shadow-[0_0_60px_rgba(239,68,68,0.15)] overflow-hidden"
                style={{
                    clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                {/* Pink chamfer accent — top-left */}
                <svg className="absolute top-0 left-0 w-5 h-5 z-20 overflow-visible pointer-events-none">
                    <line x1="8" y1="12" x2="12" y2="8" stroke="#ef4444" strokeWidth="2" strokeLinecap="square" />
                </svg>

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-red-500/10 border border-red-500/30 rounded-sm">
                            <TrashIcon className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mb-0.5">
                                Move to Trash
                            </p>
                            <h2 className="text-lg font-black text-white">Confirm Deletion</h2>
                        </div>
                    </div>
                    <button
                        id="delete-confirm-close-btn"
                        onClick={onClose}
                        aria-label="Close confirmation modal"
                        className="w-8 h-8 flex items-center justify-center border border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white transition-all rounded-sm"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-400 leading-relaxed">
                        <span className="text-white font-bold">{recordName || 'This record'}</span> will be moved to the Trash Bin and hidden from the pipeline. You can restore it at any time from Trash.
                    </p>

                    <div>
                        <label
                            htmlFor="deletion-reason-input"
                            className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2"
                        >
                            Reason for removal <span className="text-gray-700">(optional)</span>
                        </label>
                        <input
                            id="deletion-reason-input"
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Duplicate record, customer withdrew..."
                            maxLength={200}
                            className="w-full bg-gray-900/60 border border-gray-800 text-white text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 placeholder-gray-700 transition-all"
                        />
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-900/40 border border-gray-800/50 rounded-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                            This action will <span className="text-white">not permanently delete</span> the record from the database. It can be fully restored from the Trash Bin page.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 pb-6">
                    <button
                        id="delete-confirm-cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white border border-gray-800 hover:border-gray-600 transition-all rounded-sm disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        id="delete-confirm-submit-btn"
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2 bg-red-600/20 border border-red-600/50 text-red-400 hover:bg-red-600/30 hover:border-red-500 hover:text-red-300 text-xs font-black uppercase tracking-widest transition-all rounded-sm disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <TrashIcon className="w-3.5 h-3.5" />
                        )}
                        {loading ? 'Moving…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;

import React, { useState } from 'react';
import { firestoreService } from '../lib/firebaseService';
import { PhoneIcon, MapPinIcon, CalendarIcon, ClockIcon, XIcon, CheckCircleIcon } from './icons';
import { cn } from '../lib/utils';

export type FollowUpType = 'call' | 'visit';

export interface FollowUpEvent {
    id?: string;
    project_id: string;
    project_name: string;
    type: FollowUpType;
    date: string;       // YYYY-MM-DD
    time: string;       // HH:MM (24h)
    notes: string;
    stage: string;
    created_at?: string;
}

interface FollowUpModalProps {
    project: any;
    onClose: () => void;
    onSaved?: (event: FollowUpEvent) => void;
}

const TYPE_CONFIG: Record<FollowUpType, { label: string; color: string; border: string; bg: string; icon: any }> = {
    call: {
        label: 'Phone Call',
        color: 'text-green-400',
        border: 'border-green-500/50',
        bg: 'bg-green-500/10',
        icon: PhoneIcon,
    },
    visit: {
        label: 'Site Visit',
        color: 'text-purple-400',
        border: 'border-purple-500/50',
        bg: 'bg-purple-500/10',
        icon: MapPinIcon,
    },
};

const FollowUpModal: React.FC<FollowUpModalProps> = ({ project, onClose, onSaved }) => {
    const today = new Date().toISOString().slice(0, 10);
    const [type, setType] = useState<FollowUpType>('call');
    const [date, setDate] = useState(today);
    const [time, setTime] = useState('09:00');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        if (!date || saving) return;
        setSaving(true);
        const event: FollowUpEvent = {
            project_id: project.id,
            project_name: project.name || 'Unnamed Project',
            type,
            date,
            time,
            notes,
            stage: project.current_stage || 'Unknown',
        };
        try {
            await firestoreService.addDocument('followups', event);
            setSaved(true);
            onSaved?.(event);
            setTimeout(() => {
                onClose();
            }, 1200);
        } catch (err) {
            console.error('Failed to save follow-up:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <div
                className="relative z-10 w-full max-w-md mx-4 bg-[#080808] border border-gray-800 rounded-2xl shadow-[0_0_80px_rgba(236,2,139,0.12)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent" />

                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-gray-800">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ec028b] mb-1">
                            Schedule Follow-Up
                        </p>
                        <h2 className="text-lg font-black text-white leading-tight">
                            {project.name || 'Project'}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">
                            {project.current_stage || 'Pipeline Record'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white transition-all shrink-0"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>

                {saved ? (
                    <div className="p-10 flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                            <CheckCircleIcon className="w-8 h-8 text-green-400" />
                        </div>
                        <p className="text-green-400 font-bold text-sm uppercase tracking-widest">Scheduled!</p>
                        <p className="text-gray-500 text-xs text-center">Event added to your calendar.</p>
                    </div>
                ) : (
                    <div className="p-5 space-y-5">
                        {/* Type selector */}
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">
                                Follow-Up Type
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {(Object.entries(TYPE_CONFIG) as [FollowUpType, typeof TYPE_CONFIG['call']][]).map(([key, cfg]) => {
                                    const Icon = cfg.icon;
                                    const isActive = type === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setType(key)}
                                            className={cn(
                                                'flex items-center gap-3 p-3 rounded-xl border transition-all duration-200',
                                                isActive
                                                    ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                                                    : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-600'
                                            )}
                                        >
                                            <Icon className="w-5 h-5 shrink-0" />
                                            <div className="text-left">
                                                <p className="text-xs font-black uppercase tracking-wider">
                                                    {cfg.label}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                                    <CalendarIcon className="w-3 h-3" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    min={today}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ec028b]/60 focus:ring-1 focus:ring-[#ec028b]/20 transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    Time
                                </label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ec028b]/60 focus:ring-1 focus:ring-[#ec028b]/20 transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 block">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Discussion topics, directions, objectives..."
                                rows={3}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/60 focus:ring-1 focus:ring-[#ec028b]/20 transition-all resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-1">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white text-sm font-bold uppercase tracking-widest transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!date || saving}
                                className={cn(
                                    'flex-1 px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300',
                                    'bg-[#ec028b]/10 border border-[#ec028b]/40 text-[#ec028b]',
                                    'hover:bg-[#ec028b]/20 hover:border-[#ec028b]/70 hover:shadow-[0_0_20px_rgba(236,2,139,0.2)]',
                                    'disabled:opacity-40 disabled:pointer-events-none',
                                    'flex items-center justify-center gap-2'
                                )}
                            >
                                {saving ? (
                                    <div className="w-4 h-4 border-2 border-[#ec028b] border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <CalendarIcon className="w-4 h-4" />
                                )}
                                {saving ? 'Saving…' : 'Schedule'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowUpModal;

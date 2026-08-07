
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import { Button } from '../components/ui/button';
import {
    PencilSquareIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    ShieldCheckIcon,
    BriefcaseIcon,
    CheckIcon,
    ArrowLeftIcon,
    MapPinIcon,
    CalendarDaysIcon,
    ClockIcon,
    IdentificationIcon,
    BuildingStorefrontIcon,
} from '../components/icons';
import { userService, userLogService, firestoreService } from '../lib/firebaseService';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { User, UserType } from '../types';
import { cn } from '../lib/utils';

// Only these roles may edit any profile
const EDIT_ALLOWED_ROLES: UserType[] = ['Super Admin', 'Admin'];

// Roles that need Auth to be linked
const INTERNAL_ROLES: UserType[] = ['Admin', 'Super Admin', 'Employee'];

const getRoleBadgeColor = (role: string) => {
    switch (role) {
        case 'Super Admin': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
        case 'Admin':       return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        case 'Employee':    return 'bg-green-500/10 text-green-400 border-green-500/30';
        case 'Customer':    return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
        case 'Contractor':  return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
        case 'Supplier':    return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
        default:            return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
};

const getRoleIcon = (role: string) => {
    if (role === 'Super Admin' || role === 'Admin') return <ShieldCheckIcon className="w-4 h-4" />;
    if (role === 'Employee') return <BriefcaseIcon className="w-4 h-4" />;
    if (role === 'Contractor') return <BuildingStorefrontIcon className="w-4 h-4" />;
    return <UserIcon className="w-4 h-4" />;
};

const formatDate = (iso?: string): string => {
    if (!iso) return '—';
    try {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true,
        }).format(new Date(iso));
    } catch {
        return iso;
    }
};

// ── Small read-only info row ──────────────────────────────────────────────────
const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string; mono?: boolean }> = ({
    icon, label, value, mono = false,
}) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-800/60 last:border-0">
        <div className="w-8 h-8 rounded-lg bg-[#ec028b]/10 border border-[#ec028b]/20 flex items-center justify-center text-[#ec028b] shrink-0 mt-0.5">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-0.5">{label}</p>
            <p className={cn(
                'text-sm text-white leading-snug break-words',
                mono && 'font-mono text-xs',
                !value && 'text-gray-600 italic',
            )}>
                {value || 'Not set'}
            </p>
        </div>
    </div>
);

// ── Editable field ────────────────────────────────────────────────────────────
const EditField: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
}> = ({ label, value, onChange, type = 'text', placeholder, disabled = false }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={cn(
                'w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all',
                disabled && 'opacity-40 cursor-not-allowed',
            )}
            placeholder={placeholder}
        />
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════════════════════════════

const UserProfilePage: React.FC = () => {
    const { currentUser } = useMockDB();
    const { selectedUserId, setSelectedUserId, setActivePageId } = useNavigation();

    const canEdit = EDIT_ALLOWED_ROLES.includes(currentUser?.role as UserType);

    // ── User data ──────────────────────────────────────────────────────────────
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // ── Edit mode state ────────────────────────────────────────────────────────
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    // ── Edit form state ────────────────────────────────────────────────────────
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [editDepartment, setEditDepartment] = useState('');
    const [editRole, setEditRole] = useState<UserType>('Employee');
    const [editAvatarUrl, setEditAvatarUrl] = useState('');


    // ── Load user from Firestore (direct fetch + live subscribe) ───────────────
    useEffect(() => {
        if (!selectedUserId) {
            setLoading(false);
            setNotFound(true);
            return;
        }
        setLoading(true);
        setNotFound(false);

        // 1. Immediately fetch the specific doc — no race condition, no partial-list issue
        firestoreService.getDocument('users', selectedUserId).then((result) => {
            if (result.success && result.data) {
                setUser(result.data as User);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
            setLoading(false);
        }).catch(() => {
            setNotFound(true);
            setLoading(false);
        });

        // 2. Also subscribe for live updates (edits reflect instantly)
        const unsub = userService.subscribe((allUsers: User[]) => {
            const found = allUsers.find(u => u.id === selectedUserId);
            if (found) {
                setUser(found);
                setNotFound(false);
            }
            // NOTE: do NOT set notFound=true here — only the initial fetch does that
            // to avoid the race condition where subscribe fires before the user doc arrives
        });
        return () => unsub();
    }, [selectedUserId]);


    // ── Log page access ────────────────────────────────────────────────────────
    useEffect(() => {
        if (user) {
            userLogService.logAction(
                'PAGE_ACCESSED',
                `User profile for "${user.name}" (${user.role}) accessed by ${currentUser?.name ?? 'Unknown'}`,
                { targetUserId: user.id, accessedBy: currentUser?.id, page: 'UserProfilePage' }
            );
        }
    }, [user?.id]);

    // ── Open / close edit ──────────────────────────────────────────────────────
    const openEdit = () => {
        if (!user) return;
        setEditName(user.name);
        setEditPhone(user.phone || '');
        setEditAddress(user.address || '');
        setEditDepartment(user.department || '');
        setEditRole(user.role);
        setEditAvatarUrl(user.avatarUrl || '');
        setSaveError('');
        setSaveSuccess(false);
        setIsEditing(true);
        userLogService.logAction(
            'EDIT_USER_PROFILE_OPENED',
            `Edit profile panel opened for "${user.name}" by ${currentUser?.name ?? 'Unknown'}`,
            { targetUserId: user.id, openedBy: currentUser?.id }
        );
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setSaveError('');
    };

    // ── Save profile ───────────────────────────────────────────────────────────
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Guard: only Super Admin / Admin may save
        if (!canEdit) {
            setSaveError('You do not have permission to edit profiles.');
            return;
        }

        setSaving(true);
        setSaveError('');

        try {
            const now = new Date().toISOString();
            const payload: Partial<User> = {
                name: editName.trim(),
                phone: editPhone.trim(),
                address: editAddress.trim(),
                department: editDepartment.trim(),
                role: editRole,
                avatarUrl: editAvatarUrl.trim() || undefined,
                // Audit trail — SYSTEM_RULES §7.3
                updated_at: now,
                updated_by: currentUser?.name ?? 'Unknown',
                updated_by_id: currentUser?.id ?? '',
            };

            const result = await userService.update(user.id, payload);

            if (result.success) {
                // Log the action per SYSTEM_RULES §7.1
                userLogService.logAction(
                    'USER_PROFILE_UPDATED',
                    `Profile for "${editName}" (${editRole}) updated by ${currentUser?.name ?? 'Unknown'}`,
                    {
                        recordId: user.id,
                        recordName: editName,
                        collection: 'users',
                        changes: ['name', 'phone', 'address', 'department', 'role', 'avatarUrl'].filter(f => {
                            const old = (user as any)[f];
                            const nw = (payload as any)[f];
                            return old !== nw;
                        }),
                        updatedBy: currentUser?.id,
                        updatedByName: currentUser?.name,
                        updatedByRole: currentUser?.role,
                        updatedAt: now,
                    }
                );
                setSaveSuccess(true);
                setIsEditing(false);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                setSaveError(result.error || 'Update failed. Please try again.');
            }
        } catch (err: any) {
            setSaveError(err?.message || 'An unexpected error occurred.');
        } finally {
            setSaving(false);
        }
    };

    // ── Back to User Management ────────────────────────────────────────────────
    const handleBack = () => {
        setSelectedUserId(null);
        setActivePageId('A-02');
    };

    // ── Avatar initials ────────────────────────────────────────────────────────
    const getInitials = (name: string) =>
        name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    // ══════════════════════════════════════════════════════════════════════════
    // RENDER: Loading / Not Found
    // ══════════════════════════════════════════════════════════════════════════
    if (loading) {
        return (
            <PageContainer title="User Profile" description="Loading profile...">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    <div className="h-64 bg-gray-900/40 border border-gray-800 rounded-2xl" />
                    <div className="md:col-span-2 h-64 bg-gray-900/40 border border-gray-800 rounded-2xl" />
                </div>
            </PageContainer>
        );
    }

    if (notFound || !user) {
        return (
            <PageContainer title="User Profile" description="Profile not found.">
                <div className="text-center py-20">
                    <UserIcon className="w-14 h-14 text-gray-800 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm mb-6">
                        No user selected or the user no longer exists.
                    </p>
                    <Button onClick={handleBack} className="bg-[#ec028b] text-white hover:bg-[#ff039a]">
                        Back to User Management
                    </Button>
                </div>
            </PageContainer>
        );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // RENDER: Main Profile
    // ══════════════════════════════════════════════════════════════════════════
    return (
        <PageContainer
            title="User Profile"
            description=""
            headerAction={
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBack}
                        id="back-to-user-management"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span>User Management</span>
                    </button>
                    {canEdit && !isEditing && (
                        <Button
                            onClick={openEdit}
                            id="edit-profile-btn"
                            className="bg-[#ec028b] hover:bg-[#ff039a] text-white"
                        >
                            <PencilSquareIcon className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    )}
                </div>
            }
        >
            <div className="space-y-6">

                {/* Success banner */}
                {saveSuccess && (
                    <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-3 animate-fade-in">
                        <CheckIcon className="w-4 h-4 text-green-400 shrink-0" />
                        <p className="text-green-400 text-sm font-bold">Profile updated successfully.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── LEFT: Avatar + Identity Card ─────────────────────────── */}
                    <div className="flex flex-col gap-5">

                        {/* Avatar card */}
                        <div className="relative bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
                            {/* Pink glow top accent */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent" />

                            <div className="p-8 flex flex-col items-center text-center gap-4">
                                {/* Avatar */}
                                {user.avatarUrl ? (
                                    <div className="relative">
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            className="w-24 h-24 rounded-2xl object-cover border-2 border-[#ec028b]/40"
                                        />
                                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(236,2,139,0.3)]" />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#ec028b]/20 via-black to-gray-900 border border-[#ec028b]/30 flex items-center justify-center shadow-[0_0_30px_rgba(236,2,139,0.15)]">
                                        <span className="text-3xl font-black text-[#ec028b] select-none">
                                            {getInitials(user.name)}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <h2 className="text-xl font-black text-white leading-tight mb-2">{user.name}</h2>
                                    <span className={cn(
                                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border',
                                        getRoleBadgeColor(user.role)
                                    )}>
                                        {getRoleIcon(user.role)}
                                        {user.role}
                                    </span>
                                </div>

                                {/* Auth status indicator */}
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={cn(
                                        'w-2 h-2 rounded-full',
                                        INTERNAL_ROLES.includes(user.role as UserType)
                                            ? 'bg-[#ec028b] shadow-[0_0_8px_#ec028b]'
                                            : 'bg-green-500 shadow-[0_0_8px_#22c55e]'
                                    )} />
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                                        {INTERNAL_ROLES.includes(user.role as UserType) ? 'Auth Linked' : 'Verified Link'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata card */}
                        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 space-y-0">
                            <p className="text-[9px] font-black text-[#ec028b] uppercase tracking-widest mb-3">System Metadata</p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2.5">
                                    <CalendarDaysIcon className="w-3.5 h-3.5 text-gray-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-wider">Created</p>
                                        <p className="text-[11px] text-gray-400 font-mono">{formatDate(user.created_at)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <ClockIcon className="w-3.5 h-3.5 text-gray-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-wider">Last Updated</p>
                                        <p className="text-[11px] text-gray-400 font-mono">{formatDate(user.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Details + Edit Form ────────────────────────────── */}
                    <div className="lg:col-span-2 flex flex-col gap-5">

                        {/* Contact info card */}
                        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-800 bg-black/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IdentificationIcon className="w-4 h-4 text-[#ec028b]" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Contact Information</span>
                                </div>
                                {/* Read-only permission tag */}
                                {!canEdit && (
                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest border border-gray-800 px-2 py-0.5 rounded">
                                        View Only
                                    </span>
                                )}
                            </div>

                            {/* ── VIEW MODE ── */}
                            {!isEditing && (
                                <div className="p-6">
                                    <InfoRow
                                        icon={<EnvelopeIcon className="w-4 h-4" />}
                                        label="Email Address"
                                        value={user.email}
                                    />
                                    <InfoRow
                                        icon={<PhoneIcon className="w-4 h-4" />}
                                        label="Phone Number"
                                        value={user.phone}
                                    />
                                    <InfoRow
                                        icon={<MapPinIcon className="w-4 h-4" />}
                                        label="Address"
                                        value={user.address}
                                    />
                                    <InfoRow
                                        icon={<BriefcaseIcon className="w-4 h-4" />}
                                        label="Department / Team"
                                        value={user.department}
                                    />
                                    <InfoRow
                                        icon={getRoleIcon(user.role)}
                                        label="System Role"
                                        value={user.role}
                                    />
                                </div>
                            )}

                            {/* ── EDIT MODE ── */}
                            {isEditing && (
                                <form onSubmit={handleSave} className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <EditField
                                            label="Full Name"
                                            value={editName}
                                            onChange={setEditName}
                                            placeholder="Enter display name"
                                        />
                                        <EditField
                                            label="Phone Number"
                                            value={editPhone}
                                            onChange={setEditPhone}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>

                                    <EditField
                                        label="Email Address"
                                        value={user.email || ''}
                                        onChange={() => {}}
                                        type="email"
                                        disabled
                                        placeholder="Email cannot be changed here"
                                    />
                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest -mt-2 ml-1">
                                        Email cannot be changed after registration
                                    </p>

                                    <EditField
                                        label="Address"
                                        value={editAddress}
                                        onChange={setEditAddress}
                                        placeholder="123 Main St, City, State"
                                    />

                                    <EditField
                                        label="Department / Team"
                                        value={editDepartment}
                                        onChange={setEditDepartment}
                                        placeholder="e.g. Sales, Operations, Field"
                                    />

                                    {/* Role select */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">System Role</label>
                                        <div className="relative">
                                            <select
                                                value={editRole}
                                                onChange={(e) => setEditRole(e.target.value as UserType)}
                                                className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <optgroup label="── Internal Staff">
                                                    <option value="Super Admin">Super Admin</option>
                                                    <option value="Admin">Admin</option>
                                                    <option value="Employee">Employee</option>
                                                </optgroup>
                                                <optgroup label="── External Portal">
                                                    <option value="Customer">Customer</option>
                                                    <option value="Contractor">Contractor</option>
                                                    <option value="Supplier">Supplier</option>
                                                </optgroup>
                                            </select>
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <EditField
                                        label="Avatar URL (optional)"
                                        value={editAvatarUrl}
                                        onChange={setEditAvatarUrl}
                                        placeholder="https://..."
                                    />

                                    {saveError && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                                            <p className="text-red-400 text-xs font-bold">{saveError}</p>
                                        </div>
                                    )}

                                    <div className="pt-2 flex gap-3">
                                        <Button
                                            type="button"
                                            onClick={cancelEdit}
                                            disabled={saving}
                                            id="cancel-edit-profile"
                                            className="flex-1 bg-gray-900 border-gray-800 text-gray-500 hover:text-white disabled:opacity-40"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={saving || !editName.trim()}
                                            id="save-profile-btn"
                                            className="flex-[2] bg-[#ec028b] hover:bg-[#ff039a] text-white disabled:opacity-60"
                                        >
                                            {saving ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Saving...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <CheckIcon className="w-4 h-4" />
                                                    Save Changes
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* ── System Info card ──────────────────────────────────── */}
                        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-800 bg-black/20 flex items-center gap-2">
                                <ShieldCheckIcon className="w-4 h-4 text-[#ec028b]" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">System & Security</span>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-0">
                                <InfoRow
                                    icon={<ShieldCheckIcon className="w-4 h-4" />}
                                    label="Password Last Changed"
                                    value={formatDate((user as any).password_updated_at)}
                                />
                                <InfoRow
                                    icon={<CalendarDaysIcon className="w-4 h-4" />}
                                    label="Account Created"
                                    value={formatDate(user.created_at)}
                                />
                                <InfoRow
                                    icon={<ClockIcon className="w-4 h-4" />}
                                    label="Last Modified"
                                    value={formatDate(user.updated_at)}
                                />
                            </div>
                        </div>

                        {/* ── Audit Trail Strip ─────────────────────────────────── */}
                        {user.updated_by && (
                            <div className="bg-black/30 border border-gray-800/60 rounded-xl px-5 py-3 flex items-center gap-3">
                                <ClockIcon className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                                <p className="text-[11px] text-gray-500">
                                    Last edited by{' '}
                                    <span className="text-gray-300 font-bold">{user.updated_by}</span>
                                    {user.updated_at && (
                                        <span className="text-gray-600"> · {formatDate(user.updated_at)}</span>
                                    )}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default UserProfilePage;

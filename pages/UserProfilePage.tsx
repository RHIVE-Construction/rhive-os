
import React, { useState, useEffect, useRef } from 'react';
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
    LockIcon,
    EyeIcon,
    EyeSlashIcon,
    XMarkIcon,
} from '../components/icons';
import { userService, userLogService, firestoreService } from '../lib/firebaseService';
import { hashPassword } from '../lib/utils';
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
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [editDepartment, setEditDepartment] = useState('');
    const [editRole, setEditRole] = useState<UserType>('Employee');
    const [editAvatarUrl, setEditAvatarUrl] = useState('');
    const [avatarFileName, setAvatarFileName] = useState('');
    const photoInputRef = useRef<HTMLInputElement>(null);
    const avatarQuickInputRef = useRef<HTMLInputElement>(null);
    const [quickUploadLoading, setQuickUploadLoading] = useState(false);

    // ── Email confirmation modal state ─────────────────────────────────────────
    const [pendingEmailChange, setPendingEmailChange] = useState<{ oldEmail: string; newEmail: string } | null>(null);

    // ── Change Password modal state ────────────────────────────────────────────
    const [showPwModal, setShowPwModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [pwError, setPwError] = useState('');
    const [pwSubmitting, setPwSubmitting] = useState(false);
    const [pwSuccess, setPwSuccess] = useState(false);


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
        setEditEmail(user.email || '');
        setEditPhone(user.phone || '');
        setEditAddress(user.address || '');
        setEditDepartment(user.department || '');
        setEditRole(user.role);
        setEditAvatarUrl(user.avatarUrl || '');
        setAvatarFileName('');
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

        // If email changed, show confirmation modal first
        const emailChanged = editEmail.trim().toLowerCase() !== (user.email || '').toLowerCase();
        if (emailChanged && user.email) {
            setPendingEmailChange({ oldEmail: user.email, newEmail: editEmail.trim() });
            return;
        }

        await performSave();
    };

    // ── Shared save logic ──────────────────────────────────────────────────────
    const performSave = async () => {
        if (!user) return;
        setSaving(true);
        setSaveError('');

        try {
            const now = new Date().toISOString();
            const payload: Partial<User> = {
                name: editName.trim(),
                email: editEmail.trim(),
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
                userLogService.logAction(
                    'USER_PROFILE_UPDATED',
                    `Profile for "${editName}" (${editRole}) updated by ${currentUser?.name ?? 'Unknown'}`,
                    {
                        recordId: user.id,
                        recordName: editName,
                        collection: 'users',
                        changes: ['name', 'email', 'phone', 'address', 'department', 'role', 'avatarUrl'].filter(f => {
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
                setPendingEmailChange(null);
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

    // ── Confirm email change ───────────────────────────────────────────────────
    const handleConfirmEmailChange = async () => {
        if (!user || !pendingEmailChange) return;
        userLogService.logAction(
            'USER_EMAIL_CHANGED',
            `Email changed for "${user.name}" from ${pendingEmailChange.oldEmail} → ${pendingEmailChange.newEmail} by ${currentUser?.name ?? 'Unknown'}`,
            { targetUserId: user.id, oldEmail: pendingEmailChange.oldEmail, newEmail: pendingEmailChange.newEmail }
        );
        await performSave();
    };

    // ── Password validation ────────────────────────────────────────────────────
    const validatePassword = (pw: string): string | null => {
        if (pw.length < 8)  return 'Password must be at least 8 characters.';
        if (pw.length > 16) return 'Password must be no more than 16 characters.';
        if (!/[a-z]/.test(pw)) return 'Password must contain at least one lowercase letter.';
        if (!/[A-Z]/.test(pw)) return 'Password must contain at least one uppercase letter.';
        if (!/[^a-zA-Z0-9]/.test(pw)) return 'Password must contain at least one symbol (e.g. !@#$%).';
        return null;
    };

    // ── Change Password handler ────────────────────────────────────────────────
    const handleChangePassword = async () => {
        if (!user) return;
        setPwError('');

        const validationError = validatePassword(newPassword);
        if (validationError) { setPwError(validationError); return; }
        if (newPassword !== confirmPassword) { setPwError('Passwords do not match.'); return; }

        // Check against last 5 password hashes
        const history: string[] = (user as any).password_history || [];
        const newHash = await hashPassword(newPassword);
        if (history.includes(newHash) || newHash === user.password_hash) {
            setPwError('This password was used recently. Please choose a different password (cannot reuse last 5).');
            return;
        }

        setPwSubmitting(true);
        try {
            const now = new Date().toISOString();
            // Keep last 5 hashes (push current → drop oldest)
            const updatedHistory = [...history, user.password_hash].filter(Boolean).slice(-5) as string[];

            const result = await userService.update(user.id, {
                password_hash: newHash,
                password_history: updatedHistory,
                password_updated_at: now,
                updated_at: now,
            });

            if (result.success) {
                userLogService.logAction(
                    'USER_PASSWORD_CHANGED',
                    `Password changed for "${user.name}" (${user.role}) by ${currentUser?.name ?? 'Admin'}`,
                    { targetUserId: user.id, changedBy: currentUser?.id, changedByName: currentUser?.name }
                );
                setPwSuccess(true);
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setPwError(result.error || 'Update failed. Please try again.');
            }
        } catch (err: any) {
            setPwError(err?.message || 'An unexpected error occurred.');
        } finally {
            setPwSubmitting(false);
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
        <>
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
                        <>
                        <Button
                            onClick={openEdit}
                            id="edit-profile-btn"
                            className="bg-[#ec028b] hover:bg-[#ff039a] text-white"
                        >
                            <PencilSquareIcon className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                        <Button
                            onClick={() => { setShowPwModal(true); setPwError(''); setPwSuccess(false); setNewPassword(''); setConfirmPassword(''); }}
                            id="change-password-btn"
                            className="bg-gray-900 border-gray-700 text-gray-300 hover:text-white hover:border-[#ec028b]/50"
                        >
                            <LockIcon className="w-4 h-4 mr-2" />
                            Change Password
                        </Button>
                        </>
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
                                {/* Avatar — clickable upload zone for admins */}
                                <div className="relative group">
                                    {user.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            className="w-24 h-24 rounded-2xl object-cover border-2 border-[#ec028b]/40"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#ec028b]/20 via-black to-gray-900 border border-[#ec028b]/30 flex items-center justify-center shadow-[0_0_30px_rgba(236,2,139,0.15)]">
                                            <span className="text-3xl font-black text-[#ec028b] select-none">
                                                {getInitials(user.name)}
                                            </span>
                                        </div>
                                    )}
                                    {/* Upload overlay — visible on hover for admins */}
                                    {canEdit && (
                                        <button
                                            type="button"
                                            id="avatar-upload-overlay"
                                            onClick={() => avatarQuickInputRef.current?.click()}
                                            disabled={quickUploadLoading}
                                            className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer border-2 border-[#ec028b]/60"
                                        >
                                            {quickUploadLoading ? (
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Upload</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                                {/* Hidden quick-upload input */}
                                {canEdit && (
                                    <input
                                        ref={avatarQuickInputRef}
                                        id="avatar-quick-file-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file || !user) return;
                                            setQuickUploadLoading(true);
                                            const reader = new FileReader();
                                            reader.onload = async (ev) => {
                                                const dataUrl = ev.target?.result as string;
                                                const now = new Date().toISOString();
                                                const result = await userService.update(user.id, {
                                                    avatarUrl: dataUrl,
                                                    updated_at: now,
                                                    updated_by: currentUser?.name ?? 'Unknown',
                                                    updated_by_id: currentUser?.id ?? '',
                                                });
                                                if (result.success) {
                                                    userLogService.logAction(
                                                        'USER_PROFILE_UPDATED',
                                                        `Profile photo updated for "${user.name}" by ${currentUser?.name ?? 'Unknown'}`,
                                                        { recordId: user.id, recordName: user.name, collection: 'users', changes: ['avatarUrl'] }
                                                    );
                                                    setSaveSuccess(true);
                                                    setTimeout(() => setSaveSuccess(false), 3000);
                                                } else {
                                                    setSaveError(result.error || 'Photo upload failed.');
                                                    setTimeout(() => setSaveError(''), 4000);
                                                }
                                                setQuickUploadLoading(false);
                                            };
                                            reader.readAsDataURL(file);
                                            e.target.value = '';
                                        }}
                                    />
                                )}
                                {/* Upload Photo button — always visible for admins */}
                                {canEdit && (
                                    <button
                                        type="button"
                                        id="upload-photo-card-btn"
                                        onClick={() => avatarQuickInputRef.current?.click()}
                                        disabled={quickUploadLoading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ec028b]/10 hover:bg-[#ec028b]/20 border border-[#ec028b]/30 hover:border-[#ec028b]/60 text-[#ec028b] text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-200 disabled:opacity-50"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Upload Photo
                                    </button>
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
                                        value={editEmail}
                                        onChange={setEditEmail}
                                        type="email"
                                        placeholder="user@example.com"
                                    />
                                    <p className="text-[9px] text-amber-500/80 font-bold uppercase tracking-widest -mt-2 ml-1">
                                        ⚠ Changing email updates login credentials
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

                                    {/* ── Photo Upload ─────────────────────── */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Profile Photo</p>
                                        <div className="flex items-center gap-4 p-4 bg-black/40 border border-gray-800 rounded-xl">
                                            {/* Preview */}
                                            <div className="flex-shrink-0">
                                                {editAvatarUrl ? (
                                                    <img
                                                        src={editAvatarUrl}
                                                        alt="Preview"
                                                        className="w-16 h-16 rounded-xl object-cover border-2 border-[#ec028b]/40 shadow-[0_0_12px_rgba(236,2,139,0.2)]"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                                                        <UserIcon className="w-7 h-7 text-gray-600" />
                                                    </div>
                                                )}
                                            </div>
                                            {/* Controls */}
                                            <div className="flex-1 min-w-0">
                                                {avatarFileName ? (
                                                    <p className="text-xs text-green-400 font-mono truncate mb-2">{avatarFileName}</p>
                                                ) : (
                                                    <p className="text-xs text-gray-500 mb-2">No photo selected</p>
                                                )}
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        id="upload-photo-btn"
                                                        onClick={() => photoInputRef.current?.click()}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ec028b]/10 hover:bg-[#ec028b]/20 border border-[#ec028b]/30 hover:border-[#ec028b]/60 text-[#ec028b] text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-200"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                        </svg>
                                                        Upload Photo
                                                    </button>
                                                    {editAvatarUrl && (
                                                        <button
                                                            type="button"
                                                            id="remove-photo-btn"
                                                            onClick={() => { setEditAvatarUrl(''); setAvatarFileName(''); }}
                                                            className="px-3 py-1.5 bg-gray-900 hover:bg-red-500/10 border border-gray-800 hover:border-red-500/40 text-gray-500 hover:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-200"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Hidden file input */}
                                        <input
                                            ref={photoInputRef}
                                            id="photo-file-input"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setAvatarFileName(file.name);
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                    setEditAvatarUrl(ev.target?.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                                // Reset input so same file can be re-selected
                                                e.target.value = '';
                                            }}
                                        />
                                    </div>

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

        {/* ── Email Change Confirmation Modal ──────────────────────────────── */}
        {pendingEmailChange && user && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPendingEmailChange(null)} />
                <div className="relative w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Pink top accent */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent" />

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                                <EnvelopeIcon className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-[#ec028b] uppercase tracking-widest">Confirm Change</p>
                                <h3 className="text-base font-black text-white">Update Email Address</h3>
                            </div>
                        </div>

                        {/* User context */}
                        <p className="text-xs text-gray-500 mb-4">
                            You are changing the login email for{' '}
                            <span className="text-white font-bold">{user.name}</span>{' '}
                            <span className="text-[#ec028b] font-bold">({user.role})</span>.
                        </p>

                        {/* Before → After */}
                        <div className="space-y-2 mb-5">
                            <div className="bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-2.5">
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Current Email</p>
                                <p className="text-sm text-gray-400 font-mono">{pendingEmailChange.oldEmail}</p>
                            </div>
                            <div className="flex justify-center">
                                <span className="text-[#ec028b] text-xs font-black">↓ changing to</span>
                            </div>
                            <div className="bg-[#ec028b]/5 border border-[#ec028b]/30 rounded-xl px-4 py-2.5">
                                <p className="text-[9px] font-black text-[#ec028b]/60 uppercase tracking-widest mb-0.5">New Email</p>
                                <p className="text-sm text-white font-mono font-bold">{pendingEmailChange.newEmail}</p>
                            </div>
                        </div>

                        {/* Warning */}
                        <p className="text-[10px] text-amber-500/70 font-bold bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2 mb-5">
                            ⚠ This will update the user's login credentials. The user must sign in with the new email.
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPendingEmailChange(null)}
                                className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmEmailChange}
                                disabled={saving}
                                className="flex-[2] px-4 py-2.5 bg-[#ec028b] hover:bg-[#ff039a] rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                                ) : (
                                    <><CheckIcon className="w-4 h-4" /> Confirm Change</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ── Change Password Modal ─────────────────────────────────────────── */}
        {showPwModal && user && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !pwSubmitting && setShowPwModal(false)} />
                <div className="relative w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent" />

                    {/* Header */}
                    <div className="p-5 border-b border-gray-800 bg-black/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#ec028b]/10 border border-[#ec028b]/30 flex items-center justify-center">
                                <LockIcon className="w-4 h-4 text-[#ec028b]" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-[#ec028b] uppercase tracking-widest">Security</p>
                                <h3 className="text-base font-black text-white">Change Password</h3>
                            </div>
                        </div>
                        <button onClick={() => setShowPwModal(false)} disabled={pwSubmitting} className="text-gray-600 hover:text-white transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* User preview */}
                        <div className="flex items-center gap-3 bg-[#ec028b]/5 border border-[#ec028b]/20 rounded-xl px-3 py-2.5">
                            <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center font-black text-[#ec028b] text-sm">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm leading-none">{user.name}</p>
                                <p className="text-gray-500 text-xs mt-0.5">{user.email || user.role}</p>
                            </div>
                        </div>

                        {pwSuccess ? (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-5 text-center space-y-3">
                                <CheckIcon className="w-8 h-8 text-green-400 mx-auto" />
                                <p className="text-green-400 font-bold text-sm">Password updated successfully!</p>
                                <button onClick={() => setShowPwModal(false)} className="px-6 py-2 bg-gray-800 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* New Password */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                                    <div className="relative">
                                        <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <input
                                            type={showNewPw ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            autoFocus
                                            maxLength={16}
                                            className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl pl-11 pr-11 py-2.5 text-sm text-white outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button type="button" onClick={() => setShowNewPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                                            {showNewPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {/* Strength rules */}
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 ml-1 mt-1.5">
                                        {[
                                            { label: '8–16 chars', ok: newPassword.length >= 8 && newPassword.length <= 16 },
                                            { label: 'Uppercase', ok: /[A-Z]/.test(newPassword) },
                                            { label: 'Lowercase', ok: /[a-z]/.test(newPassword) },
                                            { label: 'Symbol',    ok: /[^a-zA-Z0-9]/.test(newPassword) },
                                        ].map(({ label, ok }) => (
                                            <span key={label} className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${ ok ? 'text-green-400' : 'text-gray-600' }`}>
                                                <span>{ok ? '✓' : '○'}</span>{label}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <input
                                            type={showConfirmPw ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            maxLength={16}
                                            className={`w-full bg-black/60 border focus:border-[#ec028b] rounded-xl pl-11 pr-11 py-2.5 text-sm text-white outline-none transition-all ${
                                                confirmPassword && confirmPassword !== newPassword ? 'border-red-500/60' : 'border-gray-800'
                                            }`}
                                            placeholder="••••••••"
                                        />
                                        <button type="button" onClick={() => setShowConfirmPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                                            {showConfirmPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {confirmPassword && confirmPassword !== newPassword && (
                                        <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest ml-1">Passwords do not match</p>
                                    )}
                                </div>

                                {/* History notice */}
                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <LockIcon className="w-3 h-3" /> Cannot reuse your last 5 passwords
                                </p>

                                {pwError && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                                        <p className="text-red-400 text-xs font-bold">{pwError}</p>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-1">
                                    <Button type="button" onClick={() => setShowPwModal(false)} disabled={pwSubmitting} className="flex-1 bg-gray-900 border-gray-800 text-gray-500 hover:text-white disabled:opacity-40">
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleChangePassword}
                                        disabled={pwSubmitting || !newPassword || !confirmPassword}
                                        className="flex-[2] bg-[#ec028b] hover:bg-[#ff039a] text-white disabled:opacity-50"
                                    >
                                        {pwSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2"><LockIcon className="w-4 h-4" /> Save Password</span>
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}
    </>
    );
};

export default UserProfilePage;

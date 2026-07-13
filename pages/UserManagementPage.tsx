
import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { Button } from '../components/ui/button';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    UserIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    ShieldCheckIcon,
    BriefcaseIcon,
    EnvelopeIcon,
    PhoneIcon,
    LockIcon,
    CalendarIcon
} from '../components/icons';
import { userService, userLogService } from '../lib/firebaseService';
import { User, UserType } from '../types';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { cn, hashPassword } from '../lib/utils';
import {
    syncUserGoogleCalendar,
    isGISLoaded,
    type CalendarSyncResult,
    type RhiveCalendarEvent,
} from '../services/googleCalendarService';

// Internal roles that must register via Firebase Auth
const INTERNAL_ROLES: UserType[] = ['Admin', 'Super Admin', 'Employee'];


const UserManagementPage: React.FC = () => {
    const { currentUser } = useMockDB();
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [submitError, setSubmitError] = useState('');
    // Change Password modal state
    const [pwUser, setPwUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState(false);
    const [pwSubmitting, setPwSubmitting] = useState(false);

    // Calendar Sync modal state
    const [calSyncUser, setCalSyncUser] = useState<User | null>(null);
    const [calSyncing, setCalSyncing] = useState(false);
    const [calSyncResult, setCalSyncResult] = useState<CalendarSyncResult | null>(null);
    const [calSyncError, setCalSyncError] = useState('');
    const [gisReady, setGisReady] = useState(false);


    // Form state
    const [formData, setFormData] = useState({
        name: '',
        role: 'Employee' as UserType,
        email: '',
        phone: '',
        password: ''
    });

    useEffect(() => {
        const unsub = userService.subscribe((data) => {
            setUsers(data as User[]);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Poll for GIS library readiness (loaded async via CDN)
    useEffect(() => {
        if (isGISLoaded()) { setGisReady(true); return; }
        const interval = setInterval(() => {
            if (isGISLoaded()) {
                setGisReady(true);
                clearInterval(interval);
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const openCalendarSync = useCallback((user: User) => {
        setCalSyncUser(user);
        setCalSyncResult(null);
        setCalSyncError('');
    }, []);

    const handleCalendarSync = useCallback(async () => {
        if (!calSyncUser?.email) {
            setCalSyncError('This user has no email address registered. Please add one first.');
            return;
        }
        setCalSyncing(true);
        setCalSyncError('');
        setCalSyncResult(null);

        const result = await syncUserGoogleCalendar(calSyncUser.id, calSyncUser.email);

        if (result.success) {
            setCalSyncResult(result);
            userLogService.logAction(
                'CALENDAR_SYNCED',
                `Google Calendar synced for user "${calSyncUser.name}" — ${result.eventsCount} events imported`,
                { targetUserId: calSyncUser.id, targetUserEmail: calSyncUser.email, eventsCount: result.eventsCount }
            );
        } else {
            setCalSyncError(result.error || 'Calendar sync failed. Please try again.');
        }
        setCalSyncing(false);
    }, [calSyncUser]);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenAdd = () => {
        setEditingUser(null);
        setFormError('');
        setSubmitError('');
        setFormData({ name: '', role: 'Employee', email: '', phone: '', password: '' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setFormError('');
        setSubmitError('');
        setFormData({
            name: user.name,
            role: user.role,
            email: user.email || '',
            phone: user.phone || '',
            password: ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            const targetUser = users.find(u => u.id === id);
            await userService.delete(id);
            userLogService.logAction(
                'USER_DELETED',
                `User "${targetUser?.name ?? id}" (${targetUser?.role ?? 'Unknown'}) was deleted`,
                { deletedUserId: id, deletedUserName: targetUser?.name, deletedUserRole: targetUser?.role, deletedUserEmail: targetUser?.email }
            );
        }
    };

    const openChangePw = (user: User) => {
        setPwUser(user);
        setNewPassword('');
        setPwError('');
        setPwSuccess(false);
    };

    const handleChangePassword = async () => {
        if (!pwUser) return;
        if (newPassword.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
        setPwSubmitting(true);
        setPwError('');
        try {
            const hashed = await hashPassword(newPassword);
            console.log('[ChangePassword] Updating user ID:', pwUser.id, '| hash preview:', hashed.slice(0, 12) + '...');
            const result = await userService.update(pwUser.id, { password_hash: hashed, updated_at: new Date().toISOString() });
            console.log('[ChangePassword] Result:', result);
            if (result.success) {
                setPwSuccess(true);
                userLogService.logAction(
                    'USER_PASSWORD_CHANGED',
                    `Password changed for user "${pwUser.name}" (${pwUser.role})`,
                    { targetUserId: pwUser.id, targetUserName: pwUser.name, targetUserRole: pwUser.role, targetUserEmail: pwUser.email }
                );
            } else {
                setPwError(result.error || 'Firestore update failed. Check console for details.');
            }
        } catch (err: any) {
            console.error('[ChangePassword] Error:', err);
            setPwError(err?.message || 'Failed to update password.');
        } finally {
            setPwSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSubmitError('');
        setSubmitting(true);

        try {
            if (editingUser) {
                // ── EDIT: update Firestore profile ──────────────────────────────
                const payload: any = {
                    name: formData.name,
                    role: formData.role,
                    email: formData.email,
                    phone: formData.phone,
                    updated_at: new Date().toISOString()
                };
                if (formData.password) {
                    payload.password_hash = await hashPassword(formData.password);
                }
                await userService.update(editingUser.id, payload);
                userLogService.logAction(
                    'USER_UPDATED',
                    `User "${formData.name}" (${formData.role}) profile was updated`,
                    {
                        targetUserId: editingUser.id,
                        updatedFields: { name: formData.name, role: formData.role, phone: formData.phone },
                        passwordChanged: !!formData.password
                    }
                );
            } else {
                // ── CREATE: all roles stored in Firestore with password_hash ──
                if (!formData.email || !formData.password) {
                    setSubmitError('Email and password are required.');
                    setSubmitting(false);
                    return;
                }
                const passwordHash = await hashPassword(formData.password);
                await userService.create({
                    name: formData.name,
                    role: formData.role,
                    email: formData.email.toLowerCase().trim(),
                    phone: formData.phone,
                    password_hash: passwordHash,
                    created_at: new Date().toISOString(),
                });
                userLogService.logAction(
                    'USER_CREATED',
                    `New user "${formData.name}" registered with role "${formData.role}"`,
                    { newUserEmail: formData.email.toLowerCase().trim(), newUserRole: formData.role, newUserName: formData.name, newUserPhone: formData.phone }
                );
            }

            setIsModalOpen(false);
        } catch (err: any) {
            const msg = err?.message || 'An error occurred. Please try again.';
            setFormError(msg);
            setSubmitError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Super Admin': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'Admin': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Employee': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getRoleIcon = (role: string) => {
        if (role === 'Super Admin' || role === 'Admin') return <ShieldCheckIcon className="w-4 h-4" />;
        if (role === 'Employee') return <BriefcaseIcon className="w-4 h-4" />;
        if (role === 'Customer') return <UserIcon className="w-4 h-4" />;
        if (role === 'Contractor') return <BriefcaseIcon className="w-4 h-4" />;
        if (role === 'Supplier') return <BriefcaseIcon className="w-4 h-4" />;
        return <UserIcon className="w-4 h-4" />;
    };

    const isInternal = INTERNAL_ROLES.includes(formData.role as UserType);

    return (
        <PageContainer
            title="User Management"
            description="Manage organizational access, security roles, and user credentials from a centralized protocol."
            headerAction={
                <Button onClick={handleOpenAdd} className="bg-[#ec028b] hover:bg-[#ff039a] text-white">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add New User
                </Button>
            }
        >
            <div className="space-y-6">
                {/* Search & Stats */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Filter users by name, email, or role..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/40 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-[#ec028b] outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        <span>{users.filter(u => u.role === 'Admin' || u.role === 'Super Admin').length} Admins</span>
                        <span className="text-gray-800">|</span>
                        <span>{users.filter(u => u.role === 'Employee').length} Employees</span>
                        <span className="text-gray-800">|</span>
                        <span>{users.length} Total</span>
                    </div>
                </div>

                {/* User List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-48 bg-gray-900/40 border border-gray-800 rounded-2xl animate-pulse" />
                        ))
                    ) : filteredUsers.length === 0 ? (
                        <div className="col-span-3 py-16 text-center">
                            <UserIcon className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                            <p className="text-gray-600 text-sm italic">No users found. Add your first user above.</p>
                        </div>
                    ) : filteredUsers.map((user) => (
                        <div key={user.id} className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:border-[#ec028b]/50 transition-all duration-300">
                            {/* Actions Overlay */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenEdit(user)}
                                    className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                                    title="Edit user"
                                >
                                    <PencilSquareIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => openChangePw(user)}
                                    className="p-2 bg-[#ec028b]/10 rounded-lg text-[#ec028b]/60 hover:text-[#ec028b] hover:bg-[#ec028b]/20 transition-all"
                                    title="Change password"
                                >
                                    <LockIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="p-2 bg-red-900/20 rounded-lg text-red-500/70 hover:text-red-500 hover:bg-red-900/40 transition-all"
                                    title="Delete user"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center font-black text-[#ec028b] text-lg uppercase select-none">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold truncate leading-none mb-1">{user.name}</h4>
                                    <span className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border mb-2",
                                        getRoleBadgeColor(user.role)
                                    )}>
                                        {getRoleIcon(user.role)}
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">
                                    <EnvelopeIcon className="w-3.5 h-3.5 text-[#ec028b]/60 shrink-0" />
                                    {user.email || 'No email registered'}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    <PhoneIcon className="w-3.5 h-3.5 text-[#ec028b]/60 shrink-0" />
                                    {user.phone || 'No phone recorded'}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                                <span className="text-[9px] text-gray-600 font-mono italic">ID: {user.id.slice(-8)}</span>
                                <div className="flex items-center gap-1.5">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        INTERNAL_ROLES.includes(user.role as UserType)
                                            ? "bg-[#ec028b] shadow-[0_0_8px_#ec028b]"
                                            : "bg-green-500 shadow-[0_0_8px_#22c55e]"
                                    )} />
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                                        {INTERNAL_ROLES.includes(user.role as UserType) ? 'Auth Linked' : 'Verified Link'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-[#0c0c0e] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
                        <div className="p-6 border-b border-gray-800 bg-black/40 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none mb-1">
                                    {editingUser ? 'Edit Internal User' : 'Register New User'}
                                </h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">RHIVE Security Protocol v2.5</p>
                            </div>
                            <button onClick={() => !submitting && setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Role Dropdown */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">User Role</label>
                                <div className="relative">
                                    <select
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserType })}
                                        className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
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
                                    {/* Dropdown arrow */}
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Role badge preview */}
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border mt-1",
                                    formData.role === 'Super Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                                    formData.role === 'Admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                                    formData.role === 'Employee' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                    formData.role === 'Customer' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                                    formData.role === 'Contractor' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                                    'bg-gray-500/10 text-gray-400 border-gray-500/30'
                                )}>
                                    {getRoleIcon(formData.role)}
                                    <span>{formData.role}</span>
                                    <span className="opacity-50">—</span>
                                    <span>{INTERNAL_ROLES.includes(formData.role as UserType) ? 'Internal Staff' : 'External Portal'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                                        placeholder="Enter display name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    disabled={!!editingUser}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={cn(
                                        "w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all",
                                        editingUser && "opacity-50 cursor-not-allowed"
                                    )}
                                    placeholder="user@rhive.industries"
                                />
                                {editingUser && (
                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest ml-1">Email cannot be changed after registration</p>
                                )}
                            </div>

                            {/* Password: only shown when registering a NEW user */}
                            {!editingUser && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative">
                                        <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none transition-all"
                                            placeholder="••••••••••••"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest ml-1">Minimum 6 characters</p>
                                </div>
                            )}

                            {formError && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                                    <p className="text-red-400 text-xs font-bold">{formError}</p>
                                </div>
                            )}

                            {submitError && (
                                <div className="px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/30">
                                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">{submitError}</p>
                                </div>
                            )}

                            {/* ── Google Calendar Sync (edit mode, own account only) ── */}
                            {editingUser && currentUser && editingUser.id === currentUser.id && (
                                <div className="pt-2 border-t border-gray-800/60">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">Account Integrations</p>
                                    <button
                                        id="edit-modal-cal-sync-btn"
                                        type="button"
                                        onClick={() => { setIsModalOpen(false); openCalendarSync(editingUser); }}
                                        className={cn(
                                            "w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border",
                                            editingUser.googleCalendarLinked
                                                ? "bg-green-900/20 border-green-500/30 text-green-400 hover:bg-green-900/30 hover:border-green-500/50"
                                                : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500/40 hover:text-blue-300 hover:bg-blue-900/10"
                                        )}
                                    >
                                        {/* Google G logo */}
                                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                        </svg>
                                        <span className="flex-1 text-left">
                                            {editingUser.googleCalendarLinked ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
                                                    Google Calendar Linked
                                                    {editingUser.calendarEventCount !== undefined && (
                                                        <span className="opacity-60 font-normal normal-case">· {editingUser.calendarEventCount} events synced</span>
                                                    )}
                                                </span>
                                            ) : (
                                                'Sync Google Calendar'
                                            )}
                                        </span>
                                        <CalendarIcon className="w-3.5 h-3.5 shrink-0 opacity-50" />
                                    </button>
                                </div>
                            )}

                            <div className="pt-4 flex gap-4">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={submitting}
                                    className="flex-1 bg-gray-900 border-gray-800 text-gray-500 hover:text-white disabled:opacity-40"
                                >
                                    Abort
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] bg-[#ec028b] hover:bg-[#ff039a] text-white disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {editingUser ? 'Updating...' : 'Registering...'}
                                        </span>
                                    ) : (
                                        editingUser ? 'Confirm Update' : 'Register User'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Change Password Modal ───────────────────────────────── */}
            {pwUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPwUser(null)} />
                    <div className="relative w-full max-w-md bg-[#0c0c0e] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">

                        {/* Header */}
                        <div className="p-6 border-b border-gray-800 bg-black/40 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none mb-1">Change Password</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Updates Firestore record only</p>
                            </div>
                            <button onClick={() => setPwUser(null)} className="text-gray-500 hover:text-white transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* User preview */}
                            <div className="flex items-center gap-3 bg-[#ec028b]/5 border border-[#ec028b]/20 rounded-xl p-3">
                                <div className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center font-black text-[#ec028b]">
                                    {pwUser.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm leading-none">{pwUser.name}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{pwUser.email || pwUser.role}</p>
                                </div>
                            </div>

                            {pwSuccess ? (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-4 text-center space-y-3">
                                    <p className="text-green-400 font-bold text-sm">✓ Password updated in Firestore!</p>
                                    <button onClick={() => setPwUser(null)} className="px-6 py-2 bg-gray-800 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                                        <div className="relative">
                                            <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none transition-all"
                                                placeholder="••••••••••••"
                                                minLength={6}
                                                autoFocus
                                            />
                                        </div>
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest ml-1">Minimum 6 characters</p>
                                    </div>

                                    {pwError && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                                            <p className="text-red-400 text-xs font-bold">{pwError}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-1">
                                        <Button type="button" onClick={() => setPwUser(null)} className="flex-1 bg-gray-900 border-gray-800 text-gray-500 hover:text-white">
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleChangePassword}
                                            disabled={pwSubmitting || newPassword.length < 6}
                                            className="flex-[2] bg-[#ec028b] hover:bg-[#ff039a] text-white disabled:opacity-50"
                                        >
                                            {pwSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Saving...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2"><LockIcon className="w-4 h-4" />Save Password</span>
                                            )}
                                        </Button>
                                    </div>


                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* ── Google Calendar Sync Modal ───────────────────────────── */}
            {calSyncUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !calSyncing && setCalSyncUser(null)} />
                    <div className="relative w-full max-w-lg bg-[#0c0c0e] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">

                        {/* Header */}
                        <div className="p-6 border-b border-gray-800 bg-black/40 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <CalendarIcon className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none">Sync Google Calendar</h3>
                                </div>
                            </div>
                            <button onClick={() => !calSyncing && setCalSyncUser(null)} className="text-gray-500 hover:text-white transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Target user preview */}
                            <div className="flex items-center gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center font-black text-[#ec028b] text-lg uppercase">
                                    {calSyncUser.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm leading-none truncate">{calSyncUser.name}</p>
                                    <p className="text-gray-400 text-xs mt-0.5 truncate">{calSyncUser.email || 'No email — cannot sync'}</p>
                                </div>
                                {calSyncUser.googleCalendarLinked && (
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-900/20 border border-green-500/30">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
                                        <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Previously synced</span>
                                    </div>
                                )}
                            </div>

                            {calSyncResult?.success ? (
                                /* ── Success State ── */
                                <div className="space-y-4">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center space-y-2">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
                                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-green-400 font-black text-sm uppercase tracking-wide">Sync Successful!</p>
                                        <p className="text-gray-300 text-sm">
                                            <span className="text-green-400 font-bold text-xl">{calSyncResult.eventsCount}</span> events imported from Google Calendar
                                        </p>
                                        <p className="text-[9px] text-gray-500 font-mono">Saved to Firestore · calendar_events collection</p>
                                    </div>

                                    {/* Preview first 5 events */}
                                    {calSyncResult.events.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recent Events Preview</p>
                                            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                                {calSyncResult.events.slice(0, 5).map((ev: RhiveCalendarEvent) => (
                                                    <div key={ev.googleEventId} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-800">
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                                                            ev.status === 'confirmed' ? 'bg-green-400' :
                                                            ev.status === 'tentative' ? 'bg-yellow-400' : 'bg-gray-500'
                                                        )} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white text-xs font-semibold truncate">{ev.title}</p>
                                                            <p className="text-gray-500 text-[10px]">
                                                                {ev.isAllDay ? 'All day' : new Date(ev.startDateTime).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {calSyncResult.events.length > 5 && (
                                                    <p className="text-center text-[10px] text-gray-600 py-1">+{calSyncResult.events.length - 5} more events saved</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="button"
                                        onClick={() => setCalSyncUser(null)}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white"
                                    >
                                        Done
                                    </Button>
                                </div>
                            ) : (
                                /* ── Initial / Error State ── */
                                <>
                                    {/* Info box */}
                                    <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-4 space-y-2">
                                        <p className="text-blue-300 text-xs font-bold flex items-center gap-2">
                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            How it works
                                        </p>
                                        <ol className="text-[11px] text-gray-400 space-y-1 ml-6 list-decimal">
                                            <li>A Google sign-in popup will open</li>
                                            <li>Sign in with <span className="text-white font-semibold">{calSyncUser.email || 'the user\'s Gmail'}</span></li>
                                            <li>Grant calendar read-only access</li>
                                            <li>Events are fetched and saved to Firestore</li>
                                        </ol>
                                    </div>

                                    {/* Previous sync info */}
                                    {calSyncUser.lastCalendarSync && (
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                            <CalendarIcon className="w-3 h-3 text-green-400" />
                                            Last synced: {new Date(calSyncUser.lastCalendarSync).toLocaleString()}
                                            {calSyncUser.calendarEventCount !== undefined && (
                                                <span className="text-gray-600">· {calSyncUser.calendarEventCount} events</span>
                                            )}
                                        </div>
                                    )}

                                    {/* GIS not loaded warning */}
                                    {!gisReady && (
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3">
                                            <p className="text-yellow-400 text-xs font-bold">⚠ Google Identity Services is loading… please wait a moment and try again.</p>
                                        </div>
                                    )}



                                    {/* Error */}
                                    {calSyncError && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 space-y-1.5">
                                            <p className="text-red-400 text-xs font-bold">✕ {calSyncError.split('\n')[0]}</p>
                                            {calSyncError.includes('not configured in Firestore') && (
                                                <p className="text-[10px] text-red-400/70">
                                                    An admin must configure this in{' '}
                                                    <span className="font-mono text-red-300">Admin Settings → Google OAuth</span>.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* No email warning */}
                                    {!calSyncUser.email && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                                            <p className="text-red-400 text-xs font-bold">✕ No email registered for this user. Please add one before syncing.</p>
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-1">
                                        <Button
                                            type="button"
                                            onClick={() => setCalSyncUser(null)}
                                            disabled={calSyncing}
                                            className="flex-1 bg-gray-900 border-gray-800 text-gray-500 hover:text-white disabled:opacity-40"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            id="connect-google-calendar-btn"
                                            type="button"
                                            onClick={handleCalendarSync}
                                            disabled={calSyncing || !calSyncUser.email || !gisReady}
                                            className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {calSyncing ? (
                                                <>
                                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Syncing Calendar...
                                                </>
                                            ) : (
                                                <>
                                                    {/* Google "G" logo */}
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                                    </svg>
                                                    Connect Google Calendar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default UserManagementPage;

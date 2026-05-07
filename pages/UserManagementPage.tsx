
import React, { useState, useEffect } from 'react';
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
    LockIcon
} from '../components/icons';
import { userService, authService } from '../lib/firebaseService';
import { User, UserType } from '../types';
import { cn } from '../lib/utils';

// Internal roles that must register via Firebase Auth
const INTERNAL_ROLES: UserType[] = ['Admin', 'Super Admin', 'Employee'];

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    
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

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenAdd = () => {
        setEditingUser(null);
        setFormError('');
        setFormData({ name: '', role: 'Employee', email: '', phone: '', password: '' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setFormError('');
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
            await userService.delete(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSubmitting(true);

        const isInternal = INTERNAL_ROLES.includes(formData.role as UserType);

        try {
            if (editingUser) {
                // ── EDIT: update Firestore profile only ──────────────────────
                const payload: any = {
                    name: formData.name,
                    role: formData.role,
                    phone: formData.phone,
                    updated_at: new Date().toISOString()
                };
                await userService.update(editingUser.id, payload);
            } else {
                // ── CREATE ────────────────────────────────────────────────────
                if (isInternal) {
                    // 1. Register in Firebase Auth
                    const credential = await authService.signUp(formData.email.toLowerCase().trim(), formData.password);
                    const uid = credential.user.uid;

                    // 2. Write Firestore doc using Auth UID as document ID
                    await userService.createWithId(uid, {
                        name: formData.name,
                        role: formData.role,
                        email: formData.email.toLowerCase().trim(),
                        phone: formData.phone,
                        created_at: new Date().toISOString(),
                        auth_uid: uid,
                    });
                } else {
                    // External roles: just save to Firestore (no Auth)
                    await userService.create({
                        name: formData.name,
                        role: formData.role,
                        email: formData.email.toLowerCase().trim(),
                        phone: formData.phone,
                        created_at: new Date().toISOString(),
                    });
                }
            }

            setIsModalOpen(false);
        } catch (err: any) {
            // Map Firebase Auth error codes to friendly messages
            const msg = err?.code === 'auth/email-already-in-use'
                ? 'That email address is already registered.'
                : err?.code === 'auth/weak-password'
                ? 'Password must be at least 6 characters.'
                : err?.message || 'An error occurred. Please try again.';
            setFormError(msg);
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
                                >
                                    <PencilSquareIcon className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(user.id)}
                                    className="p-2 bg-red-900/20 rounded-lg text-red-500/70 hover:text-red-500 hover:bg-red-900/40 transition-all"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center font-black text-[#ec028b] text-lg bg-gradient-to-br from-gray-800 to-black">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
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

                            <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
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
                            {/* Role Selector — prominent */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">User Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['Employee', 'Admin'] as UserType[]).map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            disabled={!!editingUser}
                                            onClick={() => setFormData({ ...formData, role: r })}
                                            className={cn(
                                                "flex items-center justify-center gap-2 py-3 border rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                                formData.role === r
                                                    ? r === 'Admin'
                                                        ? "bg-blue-500/10 border-blue-500/60 text-blue-400"
                                                        : "bg-green-500/10 border-green-500/60 text-green-400"
                                                    : "bg-black/40 border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-300",
                                                editingUser && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {r === 'Admin' ? <ShieldCheckIcon className="w-4 h-4" /> : <BriefcaseIcon className="w-4 h-4" />}
                                            {r}
                                        </button>
                                    ))}
                                </div>
                                {!editingUser && isInternal && (
                                    <p className="text-[9px] text-blue-400/70 font-bold uppercase tracking-widest ml-1 mt-1 flex items-center gap-1">
                                        <ShieldCheckIcon className="w-3 h-3" />
                                        Will create a Firebase Auth account for login
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                                        placeholder="Enter display name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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

                            {!editingUser && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                        {isInternal ? 'Login Password' : 'Station Security Key'}
                                    </label>
                                    <div className="relative">
                                        <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <input 
                                            type="password" 
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none transition-all"
                                            placeholder="••••••••••••"
                                            required
                                            minLength={isInternal ? 6 : 1}
                                        />
                                    </div>
                                    {isInternal && (
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest ml-1">Min. 6 characters required by Firebase Auth</p>
                                    )}
                                </div>
                            )}

                            {formError && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                                    <p className="text-red-400 text-xs font-bold">{formError}</p>
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
        </PageContainer>
    );
};

export default UserManagementPage;


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
import { cn, hashPassword } from '../lib/utils';

const INTERNAL_ROLES: UserType[] = ['Employee', 'Admin', 'Super Admin'];

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
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
        setSubmitError('');
        setFormData({ name: '', role: 'Employee', email: '', phone: '', password: '' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setSubmitError('');
        setFormData({ 
            name: user.name, 
            role: user.role, 
            email: user.email || '', 
            phone: user.phone || '', 
            password: '' // Don't show hash
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
        setSubmitError('');
        setSubmitting(true);
        
        try {
            const isInternalRole = INTERNAL_ROLES.includes(formData.role);

            if (editingUser) {
                // Update existing user in Firestore
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
            } else {
                // --- Create new user ---
                if (isInternalRole) {
                    // For Employee/Admin/Super Admin: create Firebase Auth account + Firestore doc
                    if (!formData.email || !formData.password) {
                        setSubmitError('Email and password are required for internal accounts.');
                        setSubmitting(false);
                        return;
                    }
                    try {
                        const credential = await authService.signUp(formData.email.trim().toLowerCase(), formData.password);
                        const uid = credential.user.uid;
                        const passwordHash = await hashPassword(formData.password);
                        await userService.createWithId(uid, {
                            name: formData.name,
                            role: formData.role,
                            email: formData.email.trim().toLowerCase(),
                            phone: formData.phone,
                            password_hash: passwordHash,
                            auth_uid: uid,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });
                    } catch (authErr: any) {
                        // If Firebase Auth fails (e.g. email already in use), surface the error
                        const msg = authErr?.code === 'auth/email-already-in-use'
                            ? 'An account with this email already exists.'
                            : authErr?.message || 'Failed to create account.';
                        setSubmitError(msg);
                        setSubmitting(false);
                        return;
                    }
                } else {
                    // For external roles (Customer, Contractor, Supplier): Firestore only
                    const passwordHash = formData.password ? await hashPassword(formData.password) : undefined;
                    await userService.create({
                        name: formData.name,
                        role: formData.role,
                        email: formData.email.trim().toLowerCase(),
                        phone: formData.phone,
                        ...(passwordHash ? { password_hash: passwordHash } : {}),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
                }
            }

            setIsModalOpen(false);
        } catch (err: any) {
            setSubmitError(err?.message || 'An unexpected error occurred.');
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
                </div>

                {/* User List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-48 bg-gray-900/40 border border-gray-800 rounded-2xl animate-pulse" />
                        ))
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
                                        "inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border mb-2",
                                        getRoleBadgeColor(user.role)
                                    )}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">
                                    <EnvelopeIcon className="w-3.5 h-3.5 text-[#ec028b]/60" />
                                    {user.email || 'No email registered'}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    <PhoneIcon className="w-3.5 h-3.5 text-[#ec028b]/60" />
                                    {user.phone || 'No phone recorded'}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                                <span className="text-[9px] text-gray-600 font-mono italic">ID: {user.id.slice(-8)}</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Verified Link</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-[#0c0c0e] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
                        <div className="p-6 border-b border-gray-800 bg-black/40 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none mb-1">
                                    {editingUser ? 'Edit Internal User' : 'Register New User'}
                                </h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">RHIVE Security Protocol v2.5</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Account Type</label>
                                    <select 
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value as UserType})}
                                        className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none"
                                    >
                                        <optgroup label="— Internal (Firebase Auth)">
                                            <option value="Employee">Employee</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Super Admin">Super Admin</option>
                                        </optgroup>
                                        <optgroup label="— External (Portal)">
                                            <option value="Customer">Customer</option>
                                            <option value="Contractor">Contractor</option>
                                            <option value="Supplier">Supplier</option>
                                        </optgroup>
                                    </select>
                                    {!editingUser && (
                                        <p className="text-[9px] text-gray-600 ml-1">
                                            {INTERNAL_ROLES.includes(formData.role)
                                                ? '⚡ Internal account — registers in Firebase Auth for secure login'
                                                : '🔗 External portal account — stored in Firestore only'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                                    placeholder="user@rhive.industries"
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

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                    {editingUser ? 'Reset Password (Leave empty to keep)' : 'Password'}
                                </label>
                                <div className="relative">
                                    <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <input 
                                        type="password" 
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none transition-all"
                                        placeholder="Min. 6 characters"
                                        required={!editingUser}
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {submitError && (
                                <div className="px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/30">
                                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">{submitError}</p>
                                </div>
                            )}

                            <div className="pt-4 flex gap-4">
                                <Button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-gray-900 border-gray-800 text-gray-500 hover:text-white"
                                    disabled={submitting}
                                >
                                    Abort
                                </Button>
                                <Button 
                                    type="submit"
                                    className="flex-[2] bg-[#ec028b] hover:bg-[#ff039a] text-white disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Registering…' : editingUser ? 'Save Changes' : 'Register User'}
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

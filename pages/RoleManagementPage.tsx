
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import { userService } from '../lib/firebaseService';
import { User, UserType } from '../types';
import { 
    ShieldCheckIcon, 
    ArrowPathIcon,
    ExclamationTriangleIcon
} from '../components/icons';
import { cn } from '../lib/utils';
import Button from '../components/Button';

const ROLE_OPTIONS: UserType[] = [
    'Super Admin',
    'Admin',
    'Employee',
    'Customer',
    'Contractor',
    'Supplier',
    'Public'
];

const RoleManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = userService.subscribe((data) => {
            setUsers(data as User[]);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleRoleChange = async (userId: string, newRole: UserType) => {
        setUpdatingId(userId);
        try {
            await userService.update(userId, { role: newRole });
        } catch (error) {
            console.error('Failed to update role:', error);
            alert('Failed to update role. Check console.');
        } finally {
            setUpdatingId(null);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Super Admin': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'Admin': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Employee': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Customer': return 'text-[#ec028b] bg-[#ec028b]/10 border-[#ec028b]/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <PageContainer 
            title="System Role Management" 
            description="Manage global access permissions and elevate user authority levels across the Quantum OS environment."
        >
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20">
                        <div className="flex items-center gap-3">
                            <ShieldCheckIcon className="w-6 h-6 text-[#ec028b]" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-wider">User Directory</h2>
                        </div>
                        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                            Total Records: {users.length}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/40 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">
                                    <th className="px-6 py-4">Identity</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4 text-center">Current Role</th>
                                    <th className="px-6 py-4 text-right">Access Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <ArrowPathIcon className="w-10 h-10 text-[#ec028b] animate-spin" />
                                                <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Decrypting User Matrix...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center font-black text-[#ec028b] text-sm uppercase select-none overflow-hidden shadow-inner group-hover:border-[#ec028b]/50 transition-colors">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-[#ec028b] transition-colors">{user.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-mono uppercase">UID: {user.id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-400 space-y-0.5">
                                                <p>{user.email}</p>
                                                <p className="text-gray-600 italic">{user.phone || 'No phone recorded'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                                getRoleColor(user.role)
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <select 
                                                    className="bg-gray-900 border border-gray-700 text-xs text-white rounded-lg px-3 py-1.5 focus:border-[#ec028b] outline-none transition-all appearance-none cursor-pointer hover:bg-black pr-8 relative"
                                                    value={user.role}
                                                    disabled={updatingId === user.id}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserType)}
                                                    style={{
                                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'right 0.5rem center',
                                                        backgroundSize: '1rem'
                                                    }}
                                                >
                                                    {ROLE_OPTIONS.map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                                {updatingId === user.id && (
                                                    <ArrowPathIcon className="w-4 h-4 text-[#ec028b] animate-spin" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-[#ec028b]/5 border border-[#ec028b]/20 rounded-2xl p-6 flex items-start gap-4">
                    <div className="p-2 bg-[#ec028b]/10 rounded-lg">
                        <ExclamationTriangleIcon className="w-5 h-5 text-[#ec028b]" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Administrative Security Protocol</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Changes to user roles are persistent and synchronized via real-time satellite data link (Firestore). 
                            Elevating a user to <span className="text-purple-400 font-bold">Super Admin</span> grants complete override authority 
                            over all system modules and record hierarchies. Proceed with caution.
                        </p>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default RoleManagementPage;

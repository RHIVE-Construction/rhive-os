import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { useMockDB } from '../contexts/MockDatabaseContext';
import Button from '../components/Button';
import { cn } from '../lib/utils';
import { UserIcon } from '../components/icons';

const AdminSettingsPage: React.FC = () => {
    const { users, currentUser } = useMockDB();
    const [editableUsers, setEditableUsers] = useState(users);

    const handleRoleChange = (userId: string, newRole: any) => {
        setEditableUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, role: newRole } : u
        ));
    };

    return (
        <PageContainer 
            title="System Configuration" 
            description="Manage user authorizations and operational role assignments for platform access."
        >
            <Card title="User Authorization Matrix">
                <p className="text-xs text-gray-400 mb-6">Modify operational roles and credentials for internal and external platform access.</p>
                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-12 text-[10px] font-black uppercase tracking-wider text-gray-500 px-3 pb-2 border-b border-gray-800">
                        <div className="md:col-span-4">Operator Name</div>
                        <div className="md:col-span-4">Identity / Caching Email</div>
                        <div className="md:col-span-3">Role Authorization</div>
                        <div className="md:col-span-1 text-right">Status</div>
                    </div>
                    {editableUsers.map(user => (
                        <div 
                            key={user.id} 
                            className="grid grid-cols-1 md:grid-cols-12 items-center p-3 bg-gray-900/30 border border-gray-800/40 rounded-xl hover:bg-gray-800/20 transition-all gap-2 md:gap-0"
                        >
                            <div className="md:col-span-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#ec028b]/15 text-white flex items-center justify-center font-bold text-xs">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{user.name}</p>
                                </div>
                            </div>
                            <div className="md:col-span-4 text-xs font-mono text-gray-400 truncate pr-2">
                                {user.email || 'N/A'}
                            </div>
                            <div className="md:col-span-3">
                                {user.id === currentUser?.id ? (
                                    <span className="text-xs bg-[#ec028b]/10 border border-[#ec028b]/30 text-[#ec028b] px-3 py-1 rounded-full font-bold">
                                        {user.role} (You)
                                    </span>
                                ) : (
                                    <select 
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                                        className="bg-black border border-gray-800 rounded-lg text-xs px-3 py-1 text-gray-300 focus:outline-none focus:border-[#ec028b] cursor-pointer"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Employee">Employee</option>
                                        <option value="Customer">Customer</option>
                                        <option value="Contractor">Contractor</option>
                                        <option value="Supplier">Supplier</option>
                                    </select>
                                )}
                            </div>
                            <div className="md:col-span-1 text-right">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-900/35 border border-green-800 text-green-400">
                                    Active
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </PageContainer>
    );
};

export default AdminSettingsPage;

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { useNavigation } from '../contexts/NavigationContext';
import { firestoreService } from '../lib/firebaseService';
import { UserIcon, ChevronRightIcon, PlusIcon, MailIcon, PhoneIcon, MapPinIcon, XIcon } from '../components/icons';
import { cn } from '../lib/utils';

/** Derive a display label from the contact record (role, contactType, leadSource, etc.) */
const getContactLabel = (c: any): string => {
    return c.role || c.contactType || c.contactIs || c.leadSource || '';
};

const labelColor = (label: string) => {
    const r = label.toLowerCase();
    if (r.includes('customer')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (r.includes('primary')) return 'bg-[#ec028b]/10 text-[#ec028b] border-[#ec028b]/30';
    if (r.includes('owner')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (r.includes('webform') || r.includes('web')) return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (r.includes('facebook') || r.includes('social')) return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    if (r.includes('referral') || r.includes('referr')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-gray-800 text-gray-400 border-gray-700';
};

const ContactsListPage: React.FC = () => {
    const { setActivePageId, setSelectedContactId } = useNavigation();

    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterLabel, setFilterLabel] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        role: 'Property Owner',
        address: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterLabel]);

    useEffect(() => {
        const unsub = firestoreService.subscribeToDocuments('contacts', (data: any[]) => {
            setContacts(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleSelectContact = (id: string) => {
        setSelectedContactId(id);
        setActivePageId('E-10');
    };

    // Build unique filter labels from role / contactType / leadSource
    const allLabels = Array.from(
        new Set(contacts.map(c => getContactLabel(c)).filter(Boolean))
    ).sort();
    const filterOptions = ['All', ...allLabels];

    const filtered = contacts
        .filter(c => {
            if (filterLabel === 'All') return true;
            return getContactLabel(c) === filterLabel;
        })
        .filter(c => {
            if (!search) return true;
            
            const safeString = (val: any) => (val !== undefined && val !== null) ? String(val).toLowerCase() : '';
            
            const firstName = safeString(c.first_name);
            const lastName = safeString(c.last_name);
            const fullName = safeString(c.full_name);
            const name = safeString(c.name);
            
            const email = safeString(c.email);
            
            const phone = safeString(c.phone);
            const mobile = safeString(c.mobile);
            
            const mailingCity = safeString(c.mailingCity);
            const projectCity = safeString(c.projectCity);
            const billingCity = safeString(c.billingCity);
            
            const address = safeString(c.address);
            const mailingAddress = safeString(c.mailingAddress);
            const billingAddress = safeString(c.billingAddress);
            const projectAddress = safeString(c.projectAddress);
            const mailingStreet = safeString(c.mailingStreet);
            const street = safeString(c.street);
            
            const searchLower = search.toLowerCase();
            
            return (
                firstName.includes(searchLower) ||
                lastName.includes(searchLower) ||
                fullName.includes(searchLower) ||
                name.includes(searchLower) ||
                email.includes(searchLower) ||
                phone.includes(searchLower) ||
                mobile.includes(searchLower) ||
                mailingCity.includes(searchLower) ||
                projectCity.includes(searchLower) ||
                billingCity.includes(searchLower) ||
                address.includes(searchLower) ||
                mailingAddress.includes(searchLower) ||
                billingAddress.includes(searchLower) ||
                projectAddress.includes(searchLower) ||
                mailingStreet.includes(searchLower) ||
                street.includes(searchLower)
            );
        })
        .sort((a, b) => {
            const nameA = (a.first_name || a.last_name ? `${a.first_name || ''} ${a.last_name || ''}`.trim() : a.full_name || a.name || 'Unknown Contact').toLowerCase();
            const nameB = (b.first_name || b.last_name ? `${b.first_name || ''} ${b.last_name || ''}`.trim() : b.full_name || b.name || 'Unknown Contact').toLowerCase();
            return nameA.localeCompare(nameB);
        });

    const totalPages = Math.ceil(filtered.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filtered.slice(startIndex, endIndex);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (loading) {
        return (
            <PageContainer title="Contacts" description="Loading contact records...">
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#ec028b] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="Contacts"
            description={`${contacts.length} contact${contacts.length !== 1 ? 's' : ''} synced from Firestore`}
        >
            {/* Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search name, email, phone, city..."
                            className="w-72 pl-4 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/50 transition"
                        />
                    </div>
                    <div className="flex gap-1 flex-wrap">
                        {filterOptions.slice(0, 6).map(label => (
                            <button
                                key={label}
                                onClick={() => setFilterLabel(label)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all",
                                    filterLabel === label
                                        ? 'bg-[#ec028b]/20 text-[#ec028b] border-[#ec028b]/40'
                                        : 'bg-gray-900/50 text-gray-500 border-gray-800 hover:text-white'
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 border-l border-gray-800 pl-4 h-6">
                        <span className="text-gray-500 text-xs font-mono whitespace-nowrap">
                            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
                            <span className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">Show:</span>
                            {[20, 50, 100].map(size => (
                                <button
                                    key={size}
                                    onClick={() => {
                                        setPageSize(size);
                                        setCurrentPage(1);
                                    }}
                                    className={cn(
                                        "px-2 py-0.5 rounded border transition-all text-[10px]",
                                        pageSize === size
                                            ? "border-[#ec028b]/50 text-[#ec028b] bg-[#ec028b]/10 font-black"
                                            : "border-gray-800 text-gray-400 hover:text-white bg-gray-900/30"
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        console.log("Add Contact button clicked. Opening modal...");
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#ec028b] text-white hover:bg-pink-600 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(236,2,139,0.3)] hover:shadow-[0_0_25px_rgba(236,2,139,0.5)] flex-shrink-0 whitespace-nowrap active:scale-95"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Contact
                </button>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
                    <UserIcon className="w-16 h-16 text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-lg">No Contacts Found</p>
                    <p className="text-gray-500 text-sm mt-2 text-center max-w-sm">
                        {search
                            ? `No contacts matching "${search}".`
                            : 'No contacts in Firestore yet. Import contacts using the import script.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginated.map(contact => {
                        const name = contact.first_name || contact.last_name
                            ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                            : contact.full_name || contact.name || 'Unknown Contact';
                        const initials = name.split(' ').map((n: string) => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2);

                        const phone = contact.phone || contact.mobile || '';
                        const city = contact.mailingCity || contact.projectCity || contact.billingCity || '';
                        const state = contact.mailingState || contact.projectState || contact.billingState || '';
                        const location = [city, state].filter(Boolean).join(', ');
                        const label = getContactLabel(contact);

                        return (
                            <div
                                key={contact.id}
                                onClick={() => handleSelectContact(contact.id)}
                                className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-[#ec028b]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,2,139,0.1)] overflow-hidden"
                            >
                                {/* Hover top-line accent */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#ec028b]/20 to-black border border-[#ec028b]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#ec028b] font-black text-sm">{initials || '?'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-[#ec028b] transition-colors">
                                            {name}
                                        </h3>
                                        {label && (
                                            <span className={cn(
                                                'text-[9px] px-2 py-0.5 rounded border font-black uppercase tracking-widest',
                                                labelColor(label)
                                            )}>
                                                {label}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Info rows */}
                                <div className="space-y-2">
                                    {contact.email && (
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <MailIcon className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{contact.email}</span>
                                        </div>
                                    )}
                                    {phone && (
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <PhoneIcon className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{phone}</span>
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <MapPinIcon className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-600 font-mono">
                                        {contact.autoNumber
                                            ? `# ${contact.autoNumber}`
                                            : contact.customerSince
                                            ? `Since ${String(contact.customerSince).slice(0, 10)}`
                                            : contact.createdTime
                                            ? String(contact.createdTime).slice(0, 10)
                                            : 'Imported'}
                                    </span>
                                    <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 group-hover:border-[#ec028b] group-hover:text-[#ec028b] group-hover:bg-[#ec028b]/10 transition-colors">
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && filtered.length > 0 && totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-gray-800/30 pt-6 animate-fade-in">
                    <div className="text-xs font-mono text-gray-500">
                        Showing <span className="text-white font-bold">{startIndex + 1}</span> to <span className="text-white font-bold">{Math.min(endIndex, filtered.length)}</span> of <span className="text-[#ec028b] font-bold">{filtered.length}</span> records
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900/30 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:border-[#ec028b]/30 transition-all duration-300"
                        >
                            Prev
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {getPageNumbers().map(pageNum => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg border text-xs font-mono transition-all flex items-center justify-center",
                                        currentPage === pageNum
                                            ? "border-[#ec028b]/50 text-white bg-gradient-to-br from-[#ec028b]/20 to-black font-black shadow-[0_0_10px_rgba(236,2,139,0.2)]"
                                            : "border-gray-800 text-gray-400 hover:text-white bg-gray-900/30 hover:border-[#ec028b]/30"
                                    )}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900/30 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:border-[#ec028b]/30 transition-all duration-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div 
                        className="bg-black border border-gray-800 w-full max-w-lg shadow-[0_0_50px_rgba(236,2,139,0.15)] overflow-hidden flex flex-col rounded-[24px]"
                        style={{ clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)" }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-800 bg-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-[#ec028b]" />
                                <h3 className="text-white font-bold text-base uppercase tracking-wider">Add New Contact</h3>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">First Name *</label>
                                    <input 
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        className="bg-black/50 border border-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Last Name *</label>
                                    <input 
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        className="bg-black/50 border border-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Phone Number *</label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="(000) 000-0000"
                                        value={formData.phone}
                                        onChange={e => {
                                            let v = e.target.value.replace(/\D/g, '');
                                            if (v.length > 0) v = '(' + v.substring(0, 3) + (v.length > 3 ? ') ' + v.substring(3, 6) : '') + (v.length > 6 ? '-' + v.substring(6, 10) : '');
                                            setFormData({ ...formData, phone: v });
                                        }}
                                        className="bg-black/50 border border-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Email Address</label>
                                    <input 
                                        type="email"
                                        placeholder="example@domain.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-black/50 border border-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Project Role / Type</label>
                                <select 
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="bg-black/50 border border-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors cursor-pointer"
                                >
                                    <option value="Property Owner">Property Owner</option>
                                    <option value="Property Manager">Property Manager</option>
                                    <option value="Landlord">Landlord</option>
                                    <option value="Tenant">Tenant</option>
                                    <option value="Contractor">Contractor</option>
                                    <option value="Supplier">Supplier</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Address</label>
                                <input 
                                    type="text"
                                    placeholder="123 Main St, City, State Zip"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="bg-black/50 border border-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                />
                            </div>

                            {/* Duplicate Warning */}
                            {(() => {
                                const matchByName = contacts.find(c => {
                                    if (!c) return false;
                                    const cFirst = (c.first_name || c.firstName || '').toLowerCase().trim();
                                    const cLast = (c.last_name || c.lastName || '').toLowerCase().trim();
                                    const inputFirst = (formData.firstName || '').toLowerCase().trim();
                                    const inputLast = (formData.lastName || '').toLowerCase().trim();
                                    return inputFirst && inputLast && cFirst === inputFirst && cLast === inputLast;
                                });

                                const matchByPhone = contacts.find(c => {
                                    if (!c) return false;
                                    const inputPhone = String(formData.phone || '').replace(/\D/g, '');
                                    if (!inputPhone || inputPhone.length < 7) return false;

                                    const phones = [c.phone, c.mobile, c.homePhone, c.otherPhone]
                                        .map(p => String(p || '').replace(/\D/g, ''))
                                        .filter(p => p.length >= 7);

                                    return phones.some(p => p.includes(inputPhone) || inputPhone.includes(p));
                                });

                                if (!matchByName && !matchByPhone) return null;

                                return (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 text-xs font-mono space-y-1.5 animate-pulse" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                                        <p className="font-bold uppercase tracking-widest flex items-center gap-1.5 text-yellow-500">
                                            ⚠️ Warning: Duplicate Contact
                                        </p>
                                        <p>
                                            {matchByName && `A contact named "${matchByName.first_name || matchByName.firstName || ''} ${matchByName.last_name || matchByName.lastName || ''}" already exists.`}
                                            {matchByName && matchByPhone && " And "}
                                            {matchByPhone && `A contact with phone/mobile number "${matchByPhone.phone || matchByPhone.mobile || ''}" already exists.`}
                                        </p>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-800 bg-white/5 flex justify-end gap-3">
                            <Button 
                                variant="secondary"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={async () => {
                                    if (!formData.firstName || !formData.lastName || !formData.phone) {
                                        alert("First Name, Last Name, and Phone Number are required.");
                                        return;
                                    }
                                    setIsSaving(true);
                                    try {
                                        const now = new Date().toISOString();
                                        const res = await firestoreService.addDocument('contacts', {
                                            first_name: formData.firstName,
                                            last_name: formData.lastName,
                                            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
                                            phone: formData.phone,
                                            email: formData.email || `${formData.phone.replace(/\D/g, '')}@justcall.io`,
                                            address: formData.address,
                                            role: formData.role,
                                            created_at: now,
                                            updated_at: now,
                                            _source: 'manual-entry',
                                            recordStatus: 'Available',
                                            projectRole: 'Owner'
                                        });
                                        if (res.success) {
                                            setIsModalOpen(false);
                                            setFormData({
                                                firstName: '',
                                                lastName: '',
                                                phone: '',
                                                email: '',
                                                role: 'Property Owner',
                                                address: ''
                                            });
                                        } else {
                                            alert(`Failed to save: ${res.error}`);
                                        }
                                    } catch (err: any) {
                                        alert(`Error: ${err.message}`);
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                                disabled={isSaving}
                                className="shadow-[0_0_15px_rgba(236,2,139,0.3)] bg-[#ec028b] hover:bg-pink-600"
                            >
                                {isSaving ? "Saving..." : "Save Contact"}
                            </Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </PageContainer>
    );
};

export default ContactsListPage;

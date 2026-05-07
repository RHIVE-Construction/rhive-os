
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CollapsibleSection from '../components/CollapsibleSection';
import { MapPinIcon, BriefcaseIcon, UserIcon, BuildingStorefrontIcon } from '../components/icons';
import { useNavigation } from '../contexts/NavigationContext';
import { propertyService, contactService, projectService } from '../lib/firebaseService';
import { cn } from '../lib/utils';
import PropertyPage from './PropertyPage';
import { getMapsApiKey } from '../lib/mapsConfig';

const stageBadgeColor = (stage?: string) => {
    const s = (stage || '').toLowerCase();
    if (s.includes('lead')) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    if (s.includes('estimate')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (s.includes('quote')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    if (s.includes('sign')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (s.includes('schedule')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (s.includes('install')) return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    if (s.includes('invoic')) return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (s.includes('complet') || s.includes('past')) return 'bg-gray-500/10 text-gray-300 border-gray-600/30';
    return 'bg-gray-800 text-gray-400 border-gray-700';
};

const PropertyProfilePage: React.FC = () => {
    const { selectedPropertyId, setActivePageId, setSelectedContactId, setSelectedProjectId } = useNavigation();

    const handleContactClick = (contactId: string) => {
        setSelectedContactId(contactId);
        setActivePageId('E-10'); // Redirect to Contact Vendor Profile Page
    };

    const [property, setProperty] = useState<any>(null);
    const [contacts, setContacts] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [allProperties, setAllProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mapsKey, setMapsKey] = useState('');

    useEffect(() => { getMapsApiKey().then(setMapsKey); }, []);

    // Load all properties and subscribe to updates
    useEffect(() => {
        setLoading(true);
        const unsubProperties = propertyService.subscribe((data: any[]) => {
            setAllProperties(data);
            setLoading(false);
        });
        return () => unsubProperties();
    }, []);

    // Resolve the active property (selected or fallback to most recent)
    useEffect(() => {
        if (allProperties.length === 0) return;
        if (selectedPropertyId) {
            const found = allProperties.find(p => p.id === selectedPropertyId);
            setProperty(found || null);
        } else {
            setProperty(null);
        }
    }, [allProperties, selectedPropertyId]);

    // Load contacts & projects linked to this property
    useEffect(() => {
        if (!property) return;

        // Filter contacts by property_id
        const unsubContacts = contactService.getAll().then(res => {
            if (res.success) {
                const filtered = (res.data as any[]).filter(
                    c => c.property_id === property.id || c.project_id === property.id
                );
                setContacts(filtered);
            }
        });

        // Subscribe to projects and filter by property_id
        const unsubProjects = projectService.subscribe((data: any[]) => {
            const filtered = data.filter(p => p.property_id === property.id);
            setProjects(filtered);
        });

        return () => unsubProjects();
    }, [property]);

    const addressForMap = property?.address_full || property?.property_address;
    
    const satUrl = (property?.latitude && property?.longitude)
        ? `https://maps.googleapis.com/maps/api/staticmap?center=${property.latitude},${property.longitude}&zoom=18&size=800x400&maptype=satellite&markers=color:red%7C${property.latitude},${property.longitude}&key=${mapsKey}`
        : addressForMap
            ? `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(addressForMap)}&zoom=18&size=800x400&maptype=satellite&markers=color:red%7C${encodeURIComponent(addressForMap)}&key=${mapsKey}`
            : null;

    if (loading) {
        return (
            <PageContainer title="Property" description="Loading property data from Firebase...">
                <div className="space-y-6 animate-pulse">
                    <div className="h-80 bg-gray-900 rounded-xl" />
                    <div className="grid grid-cols-3 gap-6">
                        <div className="h-40 bg-gray-900 rounded-xl" />
                        <div className="h-40 bg-gray-900 rounded-xl" />
                        <div className="h-40 bg-gray-900 rounded-xl" />
                    </div>
                </div>
            </PageContainer>
        );
    }

    if (!selectedPropertyId || !property) {
        return <PropertyPage />;
    }

    const addressTitle = property.address_full || [property.property_address, property.city, property.state, property.zip].filter(Boolean).join(', ') || 'Unknown Address';

    return (
        <PageContainer
            title={addressTitle}
            description={`${property.type || 'Property'} Details • Live from Firebase`}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Satellite Map */}
                <div className="lg:col-span-2">
                    <Card title="Location">
                        <div className="relative h-80 bg-gray-900 rounded-lg overflow-hidden">
                            {satUrl ? (
                                <div className="w-full h-full">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://www.google.com/maps/embed/v1/view?key=${mapsKey}&center=${property?.latitude || 33.3286},${property?.longitude || -115.8434}&zoom=15&maptype=satellite`}
                                    ></iframe>
                                    {/* Floating Address Label over Pin (Since we use view, we center the label) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20px] pointer-events-none z-10">
                                        <div className="bg-black/90 backdrop-blur-lg border border-[#ec028b] px-3 py-1.5 rounded shadow-[0_0_20px_rgba(236,2,139,0.4)] flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                            <p className="text-white font-black text-[10px] whitespace-nowrap uppercase tracking-tighter">
                                                {addressTitle}
                                            </p>
                                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#ec028b]"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <MapPinIcon className="w-16 h-16 text-gray-700" />
                                    <p className="absolute text-gray-500 text-sm">No coordinates on file</p>
                                </div>
                            )}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md border border-gray-700 px-4 py-3 rounded-lg"
                                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                                <p className="text-[9px] text-[#ec028b] font-black uppercase tracking-widest mb-0.5">Property Address</p>
                                <p className="text-white font-bold text-sm">{addressTitle}</p>
                                {property.latitude && property.longitude && (
                                    <p className="text-gray-500 text-[10px] font-mono mt-1">
                                        {Number(property.latitude).toFixed(4)}, {Number(property.longitude).toFixed(4)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Property Details */}
                <div className="space-y-6">
                    <Card title="Property Details">
                        <div className="space-y-4">
                            {[
                                { label: 'Type', value: property.type },
                                { label: 'City', value: property.city },
                                { label: 'State', value: property.state },
                                { label: 'ZIP', value: property.zip },
                            ].map(({ label, value }) => value ? (
                                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-800/50 last:border-0">
                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{label}</span>
                                    <span className="text-white font-bold text-sm">{value}</span>
                                </div>
                            ) : null)}
                            {property.features && property.features.length > 0 && (
                                <div>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Features</p>
                                    <div className="flex flex-wrap gap-2">
                                        {property.features.map((f: string) => (
                                            <span key={f} className="text-[9px] bg-gray-900 border border-gray-800 px-2 py-1 rounded text-gray-400 uppercase font-black tracking-tight">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Associated Contacts */}
                    <Card title="Associated Contacts">
                        {contacts.length === 0 ? (
                            <div className="py-6 text-center">
                                <UserIcon className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                                <p className="text-gray-600 text-xs italic">No contacts linked yet</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {contacts.map((c: any) => (
                                    <li 
                                        key={c.id} 
                                        onClick={() => handleContactClick(c.id)}
                                        className="flex items-center gap-3 p-3 bg-gray-900/40 border border-gray-800/50 rounded-lg cursor-pointer hover:border-[#ec028b]/50 hover:bg-gray-900/60 transition-all group"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-[#ec028b] font-black text-sm shrink-0 group-hover:border-[#ec028b]/50 transition-all">
                                            {(c.first_name || c.name || '?')[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">
                                                {c.first_name || ''} {c.last_name || c.name || ''}
                                            </p>
                                            <p className="text-gray-500 text-[10px] uppercase tracking-wider">{c.role || 'Contact'}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>

                {/* Project History */}
                <div className="lg:col-span-3">
                    <CollapsibleSection title={`Project History (${projects.length})`}>
                        {projects.length === 0 ? (
                            <div className="py-8 text-center text-gray-600 italic text-sm">
                                No projects found for this property in Firebase.
                            </div>
                        ) : (
                            <div className="space-y-3 p-4">
                                {projects.map((proj: any) => (
                                    <div key={proj.id}
                                        onClick={() => {
                                            setSelectedProjectId(proj.id);
                                            setActivePageId('E-15'); // Go to Project details
                                        }}
                                        className="flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800/50 rounded-xl hover:border-[#ec028b]/30 transition-all group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-[#ec028b] group-hover:border-[#ec028b]/50 transition-all">
                                                <BriefcaseIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{proj.name || 'Unnamed Project'}</p>
                                                <p className="text-gray-500 text-xs font-mono mt-0.5">
                                                    {proj.project_type || ''} • {proj.id.slice(-8)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {proj.current_stage && (
                                                <span className={cn(
                                                    'text-[10px] px-2 py-1 rounded border font-black uppercase tracking-widest',
                                                    stageBadgeColor(proj.current_stage)
                                                )}>
                                                    {proj.current_stage}
                                                </span>
                                            )}
                                            {proj.quote?.total && (
                                                <span className="font-mono text-sm font-bold text-[#ec028b]">
                                                    ${proj.quote.total.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CollapsibleSection>
                </div>
            </div>
        </PageContainer>
    );
};

export default PropertyProfilePage;
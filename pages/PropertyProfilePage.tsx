
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
import { useMockDB } from '../contexts/MockDatabaseContext';
import Button from '../components/Button';
import { X, Check } from 'lucide-react';

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
    const { properties: allProperties, projects: allProjects, updateProperty } = useMockDB();

    const handleContactClick = (contactId: string) => {
        setSelectedContactId(contactId);
        setActivePageId('E-10'); // Redirect to Contact Vendor Profile Page
    };

    const [property, setProperty] = useState<any>(null);
    const [contacts, setContacts] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mapsKey, setMapsKey] = useState('');
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    useEffect(() => { getMapsApiKey().then(setMapsKey); }, []);

    // Resolve the active property and projects
    useEffect(() => {
        if (allProperties.length === 0) {
            setLoading(false);
            return;
        }
        if (selectedPropertyId) {
            const found = allProperties.find(p => p._id === selectedPropertyId || p.id === selectedPropertyId);
            setProperty(found || null);
            if (found) {
                const filteredProjects = allProjects.filter(p => p.property_id === found._id || p.property_id === found.id);
                setProjects(filteredProjects);
            }
        } else {
            setProperty(null);
            setProjects([]);
        }
        setLoading(false);
    }, [allProperties, allProjects, selectedPropertyId]);

    // Load contacts linked to this property
    useEffect(() => {
        if (!property) return;

        contactService.getAll().then(res => {
            if (res.success) {
                const filtered = (res.data as any[]).filter(
                    c => c.property_id === property._id || c.property_id === property.id || c.project_id === property._id || c.project_id === property.id
                );
                setContacts(filtered);
            }
        });
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
                            <button
                                id="btn-manage-buildings"
                                onClick={() => setIsManageModalOpen(true)}
                                className="w-full mt-4 bg-[#ec028b] hover:bg-[#ec028b]/80 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-all shadow-[0_0_15px_rgba(236,2,139,0.3)] hover:shadow-[0_0_25px_rgba(236,2,139,0.5)] text-sm"
                            >
                                <BuildingStorefrontIcon className="w-5 h-5 mr-2" />
                                Manage Buildings
                            </button>
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
                                {projects.map((proj: any) => {
                                    const projId = proj._id || proj.id || '';
                                    return (
                                        <div key={projId}
                                            onClick={() => {
                                                setSelectedProjectId(projId);
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
                                                        {proj.project_type || ''} • {projId.slice(-8)}
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
                                    );
                                })}
                            </div>
                        )}
                    </CollapsibleSection>
                </div>
            </div>

            {isManageModalOpen && (
                <ManageBuildingsModal
                    property={property}
                    isOpen={isManageModalOpen}
                    onClose={() => setIsManageModalOpen(false)}
                    onSave={async (newBuildings) => {
                        const pId = property._id || property.id;
                        const bldgs = newBuildings.map(b => ({
                            id: b.id,
                            name: b.name,
                            coordinates: b.coordinates || { lat: property.latitude || 40.0, lng: property.longitude || -105.0 }
                        }));
                        
                        updateProperty(pId, { buildings: bldgs });
                        
                        try {
                            await propertyService.update(pId, { buildings: bldgs });
                        } catch (e) {
                            console.warn("Failed to sync updated buildings to Firestore:", e);
                        }
                        setIsManageModalOpen(false);
                    }}
                    mapsKey={mapsKey}
                />
            )}
        </PageContainer>
    );
};

interface ManageBuildingsModalProps {
    property: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: (buildings: any[]) => void;
    mapsKey: string;
}

const ManageBuildingsModal: React.FC<ManageBuildingsModalProps> = ({
    property,
    isOpen,
    onClose,
    onSave,
    mapsKey
}) => {
    const [buildings, setBuildings] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && property) {
            setBuildings(property.buildings || [{
                id: `BLDG-${Date.now()}-1`,
                name: 'Building 1',
                coordinates: { lat: property.latitude || 40.0, lng: property.longitude || -105.0 }
            }]);
        }
    }, [isOpen, property]);

    if (!isOpen || !property) return null;

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setBuildings(prev => {
            const nextIndex = prev.length + 1;
            const newBldg = {
                id: `BLDG-${Date.now()}-${nextIndex}-${Math.random().toString(36).substr(2, 5)}`,
                name: `Building ${nextIndex}`,
                coordinates: { lat: property.latitude || 40.0, lng: property.longitude || -105.0 },
                x,
                y
            };
            return [...prev, newBldg];
        });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 z-10">
                    <div>
                        <h3 className="text-white font-bold text-lg">Manage Buildings</h3>
                        <p className="text-gray-400 text-xs">Tap the map to add building targets</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-auto">
                    {/* Interactive Map */}
                    <div 
                        id="manage-google-map"
                        className="h-96 md:h-[400px] bg-black rounded-lg overflow-hidden relative cursor-crosshair border border-gray-800"
                        onClick={handleMapClick}
                    >
                        <img 
                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${property.latitude || 40.0},${property.longitude || -105.0}&zoom=19&size=640x640&maptype=satellite&key=${mapsKey}`} 
                            className="w-full h-full object-cover select-none pointer-events-none" 
                            alt="Satellite View"
                        />
                        {/* Pins overlay */}
                        {buildings.map((b, idx) => {
                            const x = b.x ?? (50 + (idx * 35) % 250);
                            const y = b.y ?? (50 + Math.floor(idx / 8) * 45);
                            return (
                                <div 
                                    key={b.id}
                                    className="absolute w-6 h-6 -ml-3 -mt-6 pointer-events-none"
                                    style={{ left: x, top: y }}
                                >
                                    <div className="w-3 h-3 rounded-full bg-[#ec028b] border-2 border-white shadow-[0_0_8px_rgba(236,2,139,0.8)] animate-bounce" />
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/85 border border-[#ec028b] px-1.5 py-0.5 rounded text-[8px] font-bold text-white whitespace-nowrap">
                                        {b.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Building List Inputs */}
                    <div className="flex flex-col h-full justify-between">
                        <div className="space-y-3 overflow-y-auto max-h-80 pr-2">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Building Designations</h4>
                            {buildings.map((b, idx) => (
                                <div key={b.id} className="flex items-center gap-2 bg-black/30 p-2 rounded border border-gray-800/80">
                                    <span className="text-xs text-gray-500 font-mono w-16">#{idx + 1}</span>
                                    <input
                                        type="text"
                                        value={b.name}
                                        onChange={(e) => {
                                            const newName = e.target.value;
                                            setBuildings(prev => prev.map(item => 
                                                item.id === b.id ? { ...item, name: newName } : item
                                            ));
                                        }}
                                        className="flex-1 bg-black/50 border border-gray-700 rounded px-2.5 py-1 text-white text-sm focus:border-[#ec028b] focus:outline-none"
                                    />
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setBuildings(prev => prev.filter(item => item.id !== b.id));
                                        }}
                                        className="text-gray-500 hover:text-red-500 p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-gray-800 flex justify-end gap-3 shrink-0">
                            <button 
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-800 text-white rounded font-bold hover:bg-gray-700 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => onSave(buildings)}
                                className="px-4 py-2 bg-[#ec028b] text-white rounded font-bold hover:bg-[#ec028b]/80 transition-all text-sm shadow-[0_0_15px_rgba(236,2,139,0.3)]"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyProfilePage;
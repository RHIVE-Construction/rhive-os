
import React, { useState, useEffect, useRef } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CollapsibleSection from '../components/CollapsibleSection';
import { MapPinIcon, BriefcaseIcon, UserIcon, BuildingStorefrontIcon, PencilSquareIcon, CheckIcon, XIcon } from '../components/icons';
import { useNavigation } from '../contexts/NavigationContext';
import { propertyService, contactService, projectService } from '../lib/firebaseService';
import { cn } from '../lib/utils';
import PropertyPage from './PropertyPage';
import { getMapsApiKey } from '../lib/mapsConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AddressInput } from '../components/AddressInput';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';

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
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmSave, setShowConfirmSave] = useState(false);
    
    const isApiReady = useGoogleMapsApi();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    const getFormValue = (key: string, legacyKey?: string) => {
        if (legacyKey && editForm[legacyKey] !== undefined) return editForm[legacyKey];
        return editForm[key] || '';
    };

    const setFormValue = (key: string, legacyKey: string | undefined, val: any) => {
        setEditForm((prev: any) => {
            const updated = { ...prev };
            if (legacyKey && legacyKey in updated) {
                updated[legacyKey] = val;
            } else {
                updated[key] = val;
            }
            return updated;
        });
    };

    const handlePlaceSelected = (place: any) => {
        setEditForm((prev: any) => {
            const updated = { ...prev };
            
            // 1. Update coordinates
            updated.latitude = place.latitude;
            updated.longitude = place.longitude;
            updated.address_full = place.address;
            
            if ('Property_Name' in updated) updated.Property_Name = place.address;
            if ('name' in updated) updated.name = place.address;

            // 2. Parse address parts
            const parts = place.address.split(',');
            if (parts.length >= 3) {
                const street = parts[0].trim();
                const city = parts[1].trim();
                const stateZipParts = parts[2].trim().split(/\s+/);
                const state = stateZipParts[0] || '';
                const zip = stateZipParts[1] || '';

                if ('Property_Street' in updated) updated.Property_Street = street;
                else updated.property_address = street;

                if ('Property_City' in updated) updated.Property_City = city;
                else updated.city = city;

                if ('Property_State' in updated) updated.Property_State = state;
                else updated.state = state;

                if ('Property_Zip' in updated) updated.Property_Zip = zip;
                else updated.zip = zip;
            } else {
                if ('Property_Street' in updated) updated.Property_Street = place.address;
                else updated.property_address = place.address;
            }

            return updated;
        });
    };

    const handleEditClick = () => {
        setEditForm({ ...property });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({});
        mapInstanceRef.current = null;
        markerRef.current = null;
    };

    const handleSaveInitiate = () => {
        setShowConfirmSave(true);
    };

    const handleSaveConfirm = async () => {
        if (!selectedPropertyId) return;
        setIsSaving(true);
        setShowConfirmSave(false);
        try {
            await updateDoc(doc(db, 'properties', selectedPropertyId), editForm);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating property:", err);
            alert("Failed to save updates.");
        } finally {
            setIsSaving(false);
        }
    };

    // Map initialization for the Edit Modal
    useEffect(() => {
        if (isEditing && isApiReady && mapRef.current && !mapInstanceRef.current) {
            const currentLat = Number(editForm.latitude);
            const currentLng = Number(editForm.longitude);
            const defaultLoc = (currentLat && currentLng) 
                ? { lat: currentLat, lng: currentLng } 
                : { lat: 33.3286, lng: -115.8434 }; // Fallback coords
            
            const map = new window.google.maps.Map(mapRef.current, {
                center: defaultLoc,
                zoom: (currentLat && currentLng) ? 18 : 12,
                mapTypeId: 'satellite',
                disableDefaultUI: true,
                zoomControl: true,
            });
            
            mapInstanceRef.current = map;

            const marker = new window.google.maps.Marker({
                position: defaultLoc,
                map: map,
                draggable: true,
                animation: window.google.maps.Animation.DROP,
            });
            
            markerRef.current = marker;

            const updateLocation = (pos: any) => {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: pos }, (results: any, status: any) => {
                    if (status === 'OK' && results[0]) {
                        handlePlaceSelected({
                            address: results[0].formatted_address,
                            latitude: pos.lat(),
                            longitude: pos.lng()
                        });
                    }
                });
            };

            window.google.maps.event.addListener(marker, 'dragend', () => {
                updateLocation(marker.getPosition());
            });

            window.google.maps.event.addListener(map, 'click', (event: any) => {
                marker.setPosition(event.latLng);
                updateLocation(event.latLng);
            });
        }
        
        if (!isEditing) {
            mapInstanceRef.current = null;
            markerRef.current = null;
        }
    }, [isEditing, isApiReady]);

    // Update map when address autocomplete changes coordinates
    useEffect(() => {
        if (mapInstanceRef.current && markerRef.current && editForm.latitude && editForm.longitude) {
            const loc = { lat: Number(editForm.latitude), lng: Number(editForm.longitude) };
            mapInstanceRef.current.panTo(loc);
            mapInstanceRef.current.setZoom(18);
            markerRef.current.setPosition(loc);
        }
    }, [editForm.latitude, editForm.longitude]);

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
                        <div className="flex justify-end mb-4 border-b border-gray-800/50 pb-3">
                            <button onClick={handleEditClick} className="text-[#ec028b] hover:text-white transition-colors flex items-center text-xs font-bold uppercase tracking-widest">
                                <PencilSquareIcon className="w-3.5 h-3.5 mr-1" /> Edit Property
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Type', value: property.type || property.Property_Type },
                                { label: 'Classification', value: property.commercial_or_residential || property.Commercial_or_Residential },
                                { label: 'Owner Type', value: property.owner_type || property.Property_Owner_Type },
                                { label: 'Roof Style', value: property.roof_style || property.Roof_Style },
                                { label: 'Condition', value: property.condition || property.Property_Condition },
                                { label: 'Street', value: property.property_address || property.Property_Street },
                                { label: 'City', value: property.city || property.Property_City },
                                { label: 'State', value: property.state || property.Property_State },
                                { label: 'ZIP', value: property.zip || property.Property_Zip || property.Property_Code },
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

            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-[0_0_40px_rgba(236,2,139,0.15)] max-w-3xl w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-black/40 flex-shrink-0">
                            <h3 className="text-white font-bold tracking-widest uppercase text-sm flex items-center">
                                <PencilSquareIcon className="w-4 h-4 mr-2 text-[#ec028b]" /> Edit Property Profile
                            </h3>
                            <button onClick={handleCancelEdit} disabled={isSaving} className="text-gray-500 hover:text-white transition-colors">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Scrollable Body */}
                        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-grow text-gray-300">
                            
                            {/* Section 1: Address Autocomplete & Map */}
                            <div className="flex flex-col">
                                <label className="text-[10px] text-[#ec028b] mb-2 uppercase font-black tracking-wider flex items-center">
                                    <MapPinIcon className="w-3.5 h-3.5 mr-1" /> Address & Location
                                </label>
                                <AddressInput 
                                    initialValue={editForm.address_full || ''}
                                    onPlaceSelected={handlePlaceSelected}
                                    onInputChange={(e) => setFormValue('address_full', undefined, e.target.value)}
                                    placeholder="Search via Google Maps..."
                                    containerClassName="group relative flex w-full items-center rounded-lg border bg-black/50 border-gray-700 transition-all duration-300 ease-in-out focus-within:border-[#ec028b] mb-3"
                                    inputClassName="py-2.5 px-4 text-sm rounded-lg text-white"
                                />
                                
                                {isApiReady ? (
                                    <div 
                                        ref={mapRef} 
                                        className="w-full h-56 bg-gray-800 rounded-lg border border-gray-700 shadow-inner overflow-hidden"
                                    />
                                ) : (
                                    <div className="w-full h-56 bg-gray-800/50 rounded-lg border border-gray-700 flex flex-col items-center justify-center text-gray-500">
                                        <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                        <p className="text-xs uppercase tracking-widest font-bold">Loading Maps Engine...</p>
                                    </div>
                                )}
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-2 text-center">
                                    Drag the pin or click on the map to manually set the exact coordinates.
                                </p>
                            </div>

                            {/* Section 2: Address Breakdowns */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-800">
                                <div className="flex flex-col md:col-span-2">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Street Address</label>
                                    <input 
                                        value={getFormValue('property_address', 'Property_Street')} 
                                        onChange={e => setFormValue('property_address', 'Property_Street', e.target.value)}
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">City</label>
                                    <input 
                                        value={getFormValue('city', 'Property_City')} 
                                        onChange={e => setFormValue('city', 'Property_City', e.target.value)}
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">State</label>
                                    <input 
                                        value={getFormValue('state', 'Property_State')} 
                                        onChange={e => setFormValue('state', 'Property_State', e.target.value)}
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">ZIP Code</label>
                                    <input 
                                        value={getFormValue('zip', 'Property_Zip')} 
                                        onChange={e => setFormValue('zip', 'Property_Zip', e.target.value)}
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Section 3: Classification & Roof Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-800">
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Property Type</label>
                                    <select 
                                        value={getFormValue('type', 'Property_Type')} 
                                        onChange={e => setFormValue('type', 'Property_Type', e.target.value)}
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Industrial">Industrial</option>
                                        <option value="Government">Government</option>
                                        <option value="Multi-Family">Multi-Family</option>
                                        <option value="Property">Other / Generic</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Classification</label>
                                    <select 
                                        value={getFormValue('commercial_or_residential', 'Commercial_or_Residential')} 
                                        onChange={e => setFormValue('commercial_or_residential', 'Commercial_or_Residential', e.target.value)}
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    >
                                        <option value="">Select Classification</option>
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Owner Type</label>
                                    <input 
                                        value={getFormValue('owner_type', 'Property_Owner_Type')} 
                                        onChange={e => setFormValue('owner_type', 'Property_Owner_Type', e.target.value)}
                                        placeholder="e.g. HOA Board, Residential Owner"
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Roof Style</label>
                                    <input 
                                        value={getFormValue('roof_style', 'Roof_Style')} 
                                        onChange={e => setFormValue('roof_style', 'Roof_Style', e.target.value)}
                                        placeholder="e.g. Shingle, Flat, Metal"
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Condition</label>
                                    <select 
                                        value={getFormValue('condition', 'Property_Condition')} 
                                        onChange={e => setFormValue('condition', 'Property_Condition', e.target.value)}
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    >
                                        <option value="">Select Condition</option>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Features (comma-separated)</label>
                                    <input 
                                        value={editForm.features ? editForm.features.join(', ') : ''} 
                                        onChange={e => setEditForm({ ...editForm, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                        placeholder="e.g. Solar, Flat, Shingle"
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-800 bg-black/40 flex justify-end gap-3 flex-shrink-0 rounded-b-xl">
                            <button onClick={handleCancelEdit} disabled={isSaving} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSaveInitiate} disabled={isSaving} className="px-5 py-2 bg-[#ec028b] hover:bg-pink-600 text-white text-xs font-bold rounded-lg uppercase tracking-widest transition-colors flex items-center shadow-[0_0_15px_rgba(236,2,139,0.3)]">
                                <CheckIcon className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Verification Confirmation Popup */}
            {showConfirmSave && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-gray-900 border-2 border-[#ec028b]/50 rounded-xl shadow-[0_0_50px_rgba(236,2,139,0.3)] max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col p-6 text-gray-200 relative">
                        {/* Tech design accents */}
                        <div className="absolute top-0 left-0 w-8 h-[2px] bg-[#ec028b]" />
                        <div className="absolute top-0 left-0 w-[2px] h-8 bg-[#ec028b]" />
                        <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-[#ec028b]" />
                        <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#ec028b]" />

                        <h4 className="text-white font-black text-sm uppercase tracking-widest mb-3 text-center flex items-center justify-center gap-2">
                            <MapPinIcon className="w-5 h-5 text-[#ec028b]" /> Confirm Profile Changes
                        </h4>
                        
                        <p className="text-gray-400 text-xs leading-relaxed text-center mb-6">
                            Are you absolutely sure you want to write these modifications to this property profile record? Live Firestore updates will sync to all connected clients.
                        </p>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowConfirmSave(false)} 
                                className="flex-1 py-3 text-center text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest border border-gray-800 rounded-lg hover:bg-gray-800/40 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveConfirm} 
                                className="flex-1 py-3 bg-[#ec028b] hover:bg-pink-600 text-white text-xs font-bold rounded-lg uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(236,2,139,0.2)]"
                            >
                                Confirm & Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default PropertyProfilePage;
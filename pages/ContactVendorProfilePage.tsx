import React, { useState, useEffect, useRef } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CollapsibleSection from '../components/CollapsibleSection';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { DocumentTextIcon, ArrowPathIcon, ShareIcon, PencilSquareIcon, CheckIcon, XIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';
import { useNavigation } from '../contexts/NavigationContext';
import { firestoreService } from '../lib/firebaseService';
import { doc, onSnapshot, collection, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MapPinIcon } from '../components/icons';
import ContactsListPage from './ContactsListPage';
import { getMapsApiKey } from '../lib/mapsConfig';
import { AddressInput } from '../components/AddressInput';
import { useGoogleMapsApi } from '../hooks/useGoogleMapsApi';

const ContactVendorProfilePage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-10');
    const { selectedContactId } = useNavigation();

    const [contactData, setContactData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [communications, setCommunications] = useState<any>({ texts: [], calls: [], loading: false, error: null });
    const [emails, setEmails] = useState<any[]>([]);
    const [emailsLoading, setEmailsLoading] = useState(true);
    const [mapsKey, setMapsKey] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);
    
    const isApiReady = useGoogleMapsApi();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    // Map initialization
    useEffect(() => {
        if (isEditing && isApiReady && mapRef.current && !mapInstanceRef.current) {
            const defaultLoc = { lat: editForm.lat || 40.7128, lng: editForm.lng || -74.0060 };
            
            const map = new window.google.maps.Map(mapRef.current, {
                center: defaultLoc,
                zoom: editForm.lat ? 18 : 12,
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
                        setEditForm((prev: any) => ({
                            ...prev,
                            address: results[0].formatted_address,
                            lat: pos.lat(),
                            lng: pos.lng()
                        }));
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

    // Update map when address input changes the coords
    useEffect(() => {
        if (mapInstanceRef.current && markerRef.current && editForm.lat && editForm.lng) {
            const loc = { lat: editForm.lat, lng: editForm.lng };
            mapInstanceRef.current.panTo(loc);
            mapInstanceRef.current.setZoom(18);
            markerRef.current.setPosition(loc);
        }
    }, [editForm.lat, editForm.lng]);

    const handleEditClick = () => {
        setEditForm({ ...contactData });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({});
        mapInstanceRef.current = null;
        markerRef.current = null;
    };

    const handleSave = async () => {
        if (!selectedContactId) return;
        setIsSaving(true);
        try {
            await updateDoc(doc(db, 'contacts', selectedContactId), editForm);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating record:", err);
            alert("Failed to save updates.");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        getMapsApiKey().then(setMapsKey);
    }, []);

    useEffect(() => {
        if (!selectedContactId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'contacts', selectedContactId);
        const unsub = onSnapshot(
            docRef, 
            (snap) => {
                if (snap.exists()) {
                    setContactData({ id: snap.id, ...snap.data() });
                } else {
                    setContactData(null);
                }
                setLoading(false);
            },
            (err) => {
                console.warn("⚠️ [RHIVE QOS] Contacts Firestore listener failed (offline/mock):", err);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [selectedContactId]);

    const contractor = {
        name: contactData ? (contactData.first_name || contactData.last_name ? `${contactData.first_name || ''} ${contactData.last_name || ''}`.trim() : contactData.name || 'Unknown Contact') : 'Unknown Contact',
        type: contactData?.role || 'Contact',
        address: contactData?.address || '',
        phone: contactData?.phone || '',
        email: contactData?.email || '',
        contacts: contactData?.contacts || [],
        documents: contactData?.documents || [],
        projects: contactData?.projects || []
    };

    const satUrl = mapsKey && contractor.address
        ? `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(contractor.address)}&zoom=18&size=800x400&maptype=satellite&markers=color:red%7C${encodeURIComponent(contractor.address)}&key=${mapsKey}`
        : null;

    useEffect(() => {
        if (contractor.phone && !loading && contactData) {
            setCommunications(prev => ({ ...prev, loading: true }));
            fetch(`https://us-central1-rhive-os.cloudfunctions.net/getJustCallCommunications?phone=${encodeURIComponent(contractor.phone)}`)
                .then(res => res.json())
                .then(data => {
                    setCommunications({ texts: data.texts || [], calls: data.calls || [], loading: false, error: null });
                })
                .catch(err => {
                    setCommunications({ texts: [], calls: [], loading: false, error: err.message });
                });
        }
    }, [contractor.phone, loading]);

    useEffect(() => {
        if (!selectedContactId || !contractor.email) {
            setEmailsLoading(false);
            return;
        }
        
        const q = query(
            collection(db, 'emails'), 
            where('contact_email', '==', contractor.email)
        );
        
        const unsub = onSnapshot(q, (snap) => {
            const ems = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            ems.sort((a: any, b: any) => {
                const dA = a.timestamp?.toMillis ? a.timestamp.toMillis() : new Date(a.date || a.timestamp || 0).getTime();
                const dB = b.timestamp?.toMillis ? b.timestamp.toMillis() : new Date(b.date || b.timestamp || 0).getTime();
                return dB - dA;
            });
            setEmails(ems);
            setEmailsLoading(false);
        });

        return () => unsub();
    }, [selectedContactId, contractor.email]);

    if (!selectedContactId) {
        return <ContactsListPage />;
    }

    if (loading) {
        return (
            <PageContainer title="Loading Contact Data..." description="Fetching data from Firebase">
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#ec028b] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageContainer>
        );
    }

    return (
         <PageContainer title={contractor.name} description={contractor.type}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact Info Column */}
                <div className="md:col-span-1 space-y-8">
                    <Card title="Contact Information">
                        <div className="flex justify-end mb-4 border-b border-gray-800/50 pb-3">
                            <button onClick={handleEditClick} className="text-[#ec028b] hover:text-white transition-colors flex items-center text-xs font-bold uppercase tracking-widest">
                                <PencilSquareIcon className="w-3.5 h-3.5 mr-1" /> Edit
                            </button>
                        </div>
                        <div className="space-y-4 text-gray-300">
                            <div>
                                <p className="text-sm text-gray-400">Payment Address</p>
                                <p>{contractor.address || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Phone</p>
                                <p>{contractor.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-[#ec028b] break-all">{contractor.email || 'N/A'}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Satellite Map Column */}
                <div className="md:col-span-2">
                    <Card title="Location">
                        <div className="relative h-64 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                            {satUrl ? (
                                <div className="w-full h-full">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${encodeURIComponent(contractor.address)}&maptype=satellite&zoom=15`}
                                    ></iframe>
                                    {/* Floating Address Label over Pin */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40px] pointer-events-none z-10">
                                        <div className="bg-black/90 backdrop-blur-lg border border-[#ec028b] px-3 py-1.5 rounded shadow-[0_0_20px_rgba(236,2,139,0.4)] flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                            <p className="text-white font-black text-[10px] whitespace-nowrap uppercase tracking-tighter">
                                                {contractor.address}
                                            </p>
                                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#ec028b]"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <MapPinIcon className="w-16 h-16 text-gray-700" />
                                    <p className="absolute text-gray-500 text-sm">No address on file</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="mt-8 space-y-8">
                <CollapsibleSection title="Communication History (Texts & Calls)">
                    {communications.loading ? (
                        <div className="text-gray-400">Loading history...</div>
                    ) : communications.error ? (
                        <div className="text-red-400">Error: {communications.error}</div>
                    ) : (
                        <div className="space-y-4">
                            <h4 className="text-white font-semibold">Text Messages</h4>
                            {Array.isArray(communications.texts) && communications.texts.length > 0 ? communications.texts.map((text: any, i: number) => {
                                const direction = text.direction || text.sms_info?.direction || 'unknown';
                                const isIncoming = direction.toLowerCase() === 'inbound' || direction.toLowerCase() === 'incoming';
                                const dateStr = text.created_at || text.date || (text.sms_date ? `${text.sms_date}T${text.sms_time || '00:00:00'}` : null);
                                const content = text.sms_info?.body || text.body || text.content || text.message || '';
                                return (
                                <div key={text.id || i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-semibold text-gray-300">{isIncoming ? '↓ Received' : '↑ Sent'}</p>
                                        <p className="text-xs text-gray-400">{dateStr ? new Date(dateStr).toLocaleString() : new Date().toLocaleString()}</p>
                                    </div>
                                    <p className="text-white whitespace-pre-wrap">{content}</p>
                                </div>
                                );
                            }) : <p className="text-gray-500 text-sm">No text messages found.</p>}
                            
                            <h4 className="text-white font-semibold mt-6">Call Logs</h4>
                            {Array.isArray(communications.calls) && communications.calls.length > 0 ? communications.calls.map((call: any, i: number) => {
                                const direction = call.direction || call.call_info?.direction || 'unknown';
                                const isIncoming = direction.toLowerCase() === 'inbound' || direction.toLowerCase() === 'incoming';
                                const dateStr = call.created_at || call.call_date || (call.call_date ? `${call.call_date}T${call.call_time || '00:00:00'}` : null);
                                const status = call.status || call.call_info?.type || call.call_type || 'completed';
                                const duration = call.duration || call.call_duration?.total_duration || call.call_duration?.conversation_time || 0;
                                const recording = call.recording_url || call.recording || call.call_info?.recording;
                                return (
                                <div key={call.id || i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-semibold text-gray-300">{isIncoming ? '↓ Inbound Call' : '↑ Outbound Call'}</p>
                                        <p className="text-xs text-gray-400">{dateStr ? new Date(dateStr).toLocaleString() : new Date().toLocaleString()}</p>
                                    </div>
                                    <p className="text-white">Status: <span className="capitalize">{status}</span> • Duration: {duration}s</p>
                                    {recording && (
                                        <a href={recording} target="_blank" rel="noreferrer" className="text-xs text-[#ec028b] hover:underline mt-2 inline-block">
                                            Listen to Recording
                                        </a>
                                    )}
                                </div>
                                );
                            }) : <p className="text-gray-500 text-sm">No call logs found.</p>}
                        </div>
                    )}
                </CollapsibleSection>

                <CollapsibleSection title="Email Exchanges">
                    {emailsLoading ? (
                        <div className="text-gray-400">Loading emails...</div>
                    ) : emails.length > 0 ? (
                        <div className="space-y-4">
                            {emails.map((email: any, i: number) => {
                                const isIncoming = email.direction === 'inbound' || email.direction === 'incoming';
                                const dateStr = email.timestamp?.toDate ? email.timestamp.toDate().toLocaleString() : new Date(email.date || email.timestamp || Date.now()).toLocaleString();
                                const sender = isIncoming ? contractor.email : email.agent_email || email.agent_name || 'RHIVE Staff';
                                
                                return (
                                <div key={email.id || i} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 shadow-md">
                                    <div className="flex justify-between items-start mb-3 border-b border-gray-700/50 pb-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isIncoming ? 'bg-blue-500/20 text-blue-400' : 'bg-[#ec028b]/20 text-[#ec028b]'}`}>
                                                    {isIncoming ? '↓ Received' : '↑ Sent'}
                                                </span>
                                                <span className="text-sm text-gray-300">
                                                    {isIncoming ? 'from ' : 'by '}
                                                    <span className="font-semibold text-white">{sender}</span>
                                                </span>
                                            </div>
                                            <p className="text-white font-medium">{email.subject || 'No Subject'}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 whitespace-nowrap ml-4">{dateStr}</p>
                                    </div>
                                    <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                        {email.body || email.content || email.message}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 bg-gray-900/30 rounded-lg border border-gray-800">
                            <p className="text-gray-500 text-sm mb-2">No email exchanges found for this contact.</p>
                            {contractor.email && (
                                <p className="text-xs text-gray-600 font-mono">{contractor.email}</p>
                            )}
                        </div>
                    )}
                </CollapsibleSection>

                <CollapsibleSection title="Required Documents">
                    <ul className="space-y-3">
                        {contractor.documents.map(doc => (
                            <li key={doc.name} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                <div className="flex items-center">
                                    <DocumentTextIcon className="w-6 h-6 mr-3 text-gray-400" />
                                    <span className="font-medium text-white">{doc.name}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <StatusBadge status={doc.status as any} />
                                    <Button variant="secondary" size="sm">
                                        <ArrowPathIcon className="w-4 h-4 mr-2" />
                                        Request Update
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CollapsibleSection>

                <CollapsibleSection title="Recent Projects">
                    <div className="space-y-6">
                        {contractor.projects.map(project => (
                             <Card key={project.name} className="bg-gray-900/40">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg text-white">{project.name}</h4>
                                        <p className="text-sm text-gray-400">{project.address}</p>
                                        <p className="mt-2 text-gray-300">{project.description}</p>
                                    </div>
                                    <p className="font-bold text-xl text-[#ec028b] whitespace-nowrap">{project.price}</p>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-semibold mb-2 text-gray-200">Project Gallery</p>
                                    <div className="flex flex-wrap gap-3">
                                        {project.galleries.map((galleryName, index) => (
                                            <Button key={galleryName} variant={index === 0 ? 'primary' : 'secondary'}>
                                                {galleryName}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Services & Pricing">
                    <p className="text-gray-400">This section will contain details about the services offered by this vendor and their pricing structure.</p>
                </CollapsibleSection>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-[0_0_40px_rgba(236,2,139,0.15)] max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-black/40 flex-shrink-0">
                            <h3 className="text-white font-bold tracking-widest uppercase text-sm flex items-center">
                                <PencilSquareIcon className="w-4 h-4 mr-2 text-[#ec028b]" /> Edit Contact Info
                            </h3>
                            <button onClick={handleCancelEdit} disabled={isSaving} className="text-gray-500 hover:text-white transition-colors">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-grow">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">First Name</label>
                                    <input 
                                        value={editForm.first_name || ''} 
                                        onChange={e => setEditForm({...editForm, first_name: e.target.value})}
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Last Name</label>
                                    <input 
                                        value={editForm.last_name || ''} 
                                        onChange={e => setEditForm({...editForm, last_name: e.target.value})}
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Phone</label>
                                    <input 
                                        value={editForm.phone || ''} 
                                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Email</label>
                                    <input 
                                        value={editForm.email || ''} 
                                        onChange={e => setEditForm({...editForm, email: e.target.value})}
                                        className="bg-black/50 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#ec028b] outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-col mt-4 pt-4 border-t border-gray-800">
                                <label className="text-[10px] text-[#ec028b] mb-2 uppercase font-black tracking-wider flex items-center">
                                    <MapPinIcon className="w-3 h-3 mr-1" /> Address & Location
                                </label>
                                <AddressInput 
                                    initialValue={editForm.address || ''}
                                    onPlaceSelected={(place) => setEditForm({
                                        ...editForm, 
                                        address: place.address,
                                        lat: place.latitude,
                                        lng: place.longitude
                                    })}
                                    onInputChange={(e) => setEditForm({...editForm, address: e.target.value})}
                                    placeholder="Search via Google Maps..."
                                    containerClassName="group relative flex w-full items-center rounded-lg border bg-black/50 border-gray-700 transition-all duration-300 ease-in-out focus-within:border-[#ec028b] mb-3"
                                    inputClassName="py-2 px-3 text-sm rounded-lg"
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
                                    Drag the pin or click on the map to manually set the exact location.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-800 bg-black/40 flex justify-end gap-3 flex-shrink-0 rounded-b-xl">
                            <button onClick={handleCancelEdit} disabled={isSaving} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 bg-[#ec028b] hover:bg-pink-600 text-white text-xs font-bold rounded-lg uppercase tracking-widest transition-colors flex items-center shadow-[0_0_15px_rgba(236,2,139,0.3)]">
                                <CheckIcon className="w-4 h-4 mr-2" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default ContactVendorProfilePage;

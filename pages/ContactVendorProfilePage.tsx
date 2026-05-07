import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CollapsibleSection from '../components/CollapsibleSection';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { DocumentTextIcon, ArrowPathIcon, ShareIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';
import { useNavigation } from '../contexts/NavigationContext';
import { firestoreService } from '../lib/firebaseService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MapPinIcon } from '../components/icons';
import ContactsListPage from './ContactsListPage';
import { getMapsApiKey } from '../lib/mapsConfig';

const ContactVendorProfilePage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-10');
    const { selectedContactId } = useNavigation();

    const [contactData, setContactData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mapsKey, setMapsKey] = useState('');

    useEffect(() => {
        getMapsApiKey().then(setMapsKey);
    }, []);

    useEffect(() => {
        if (!selectedContactId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'contacts', selectedContactId);
        const unsub = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                setContactData({ id: snap.id, ...snap.data() });
            } else {
                setContactData(null);
            }
            setLoading(false);
        });

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
                        <div className="space-y-3 text-gray-300">
                            <div>
                                <p className="text-sm text-gray-400">Payment Address</p>
                                <p>{contractor.address}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Phone</p>
                                <p>{contractor.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-[#ec028b] break-all">{contractor.email}</p>
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
        </PageContainer>
    );
};

export default ContactVendorProfilePage;

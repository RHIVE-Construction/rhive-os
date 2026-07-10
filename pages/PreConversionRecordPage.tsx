import React, { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigation } from '../contexts/NavigationContext';
import { firestoreService } from '../lib/firebaseService';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BriefcaseIcon, MapPinIcon, UserIcon, ArrowLeftIcon, PencilSquareIcon, CheckIcon, XIcon } from '../components/icons';

const PreConversionRecordPage: React.FC = () => {
    const { selectedPropertyId, selectedContactId, setActivePageId } = useNavigation();
    const [data, setData] = useState<any>(null);
    const [type, setType] = useState<'property' | 'contact' | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchRecord = async () => {
            if (selectedPropertyId) {
                setType('property');
                const d = await getDoc(doc(db, 'properties', selectedPropertyId));
                if (d.exists()) setData({ id: d.id, ...d.data() });
            } else if (selectedContactId) {
                setType('contact');
                const d = await getDoc(doc(db, 'contacts', selectedContactId));
                if (d.exists()) setData({ id: d.id, ...d.data() });
            }
        };
        fetchRecord();
    }, [selectedPropertyId, selectedContactId]);

    const handleEditClick = () => {
        setEditForm({ ...data });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({});
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const collectionName = type === 'property' ? 'properties' : 'contacts';
            
            // For properties, update address_full if editing individual fields
            if (type === 'property') {
                editForm.address_full = `${editForm.property_address || ''} ${editForm.city || ''} ${editForm.state || ''} ${editForm.zip || ''}`.trim();
            }

            await updateDoc(doc(db, collectionName, data.id), editForm);
            setData({ ...data, ...editForm });
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating record:", err);
            alert("Failed to save updates.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!data) {
        return (
            <PageContainer title="Loading Record" description="Fetching pre-conversion data...">
                <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-t-rhive-pink border-rhive-pink/30 animate-spin" /></div>
            </PageContainer>
        );
    }

    const title = type === 'property' 
        ? data.address_full || data.property_address || 'Unnamed Property'
        : data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unnamed Contact';

    return (
        <PageContainer 
            title={title} 
            description={`Unconverted ${type === 'property' ? 'Property' : 'Contact'} Record`}
            headerAction={
                <Button variant="secondary" onClick={() => setActivePageId('E-15')}>
                    <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Search
                </Button>
            }
        >
            <div className="max-w-3xl mx-auto mt-10">
                <Card className="p-10 text-center bg-gray-900/40 border-dashed border-gray-700 relative">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 border-2 border-rhive-pink/50 flex items-center justify-center text-rhive-pink mb-6">
                        {type === 'property' ? <MapPinIcon className="w-10 h-10" /> : <UserIcon className="w-10 h-10" />}
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Pre-Conversion Record</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        This {type} was discovered via global search but is currently linked only to <strong className="text-white">Lead-stage</strong> projects. 
                        It will automatically graduate to a full Profile Page once its associated project is converted to Stage 2 (Estimate) or beyond.
                    </p>
                    
                    <div className="bg-black/50 border border-gray-800 rounded-xl p-6 text-left inline-block min-w-[400px] w-full max-w-lg mx-auto relative">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                            <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Record Details</h4>
                            {!isEditing ? (
                                <button onClick={handleEditClick} className="text-[#ec028b] hover:text-white transition-colors flex items-center text-xs">
                                    <PencilSquareIcon className="w-3.5 h-3.5 mr-1" /> Edit
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={handleCancelEdit} disabled={isSaving} className="text-gray-400 hover:text-white transition-colors flex items-center text-xs">
                                        <XIcon className="w-3.5 h-3.5 mr-1" /> Cancel
                                    </button>
                                    <button onClick={handleSave} disabled={isSaving} className="text-green-500 hover:text-green-400 transition-colors flex items-center text-xs font-bold">
                                        <CheckIcon className="w-3.5 h-3.5 mr-1" /> {isSaving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {type === 'property' ? (
                                <>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-xs mb-1">Street Address:</span>
                                        {isEditing ? (
                                            <input 
                                                value={editForm.property_address || ''} 
                                                onChange={e => setEditForm({...editForm, property_address: e.target.value})}
                                                className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1.5 text-sm focus:border-[#ec028b] outline-none"
                                            />
                                        ) : (
                                            <span className="text-white text-sm">{data.property_address || data.address_full}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex flex-col flex-1">
                                            <span className="text-gray-500 text-xs mb-1">City:</span>
                                            {isEditing ? (
                                                <input 
                                                    value={editForm.city || ''} 
                                                    onChange={e => setEditForm({...editForm, city: e.target.value})}
                                                    className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1.5 text-sm focus:border-[#ec028b] outline-none"
                                                />
                                            ) : (
                                                <span className="text-white text-sm">{data.city || 'N/A'}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col w-24">
                                            <span className="text-gray-500 text-xs mb-1">State:</span>
                                            {isEditing ? (
                                                <input 
                                                    value={editForm.state || ''} 
                                                    onChange={e => setEditForm({...editForm, state: e.target.value})}
                                                    className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1.5 text-sm focus:border-[#ec028b] outline-none uppercase"
                                                />
                                            ) : (
                                                <span className="text-white text-sm">{data.state || 'N/A'}</span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-4">
                                        <div className="flex flex-col flex-1">
                                            <span className="text-gray-500 text-xs mb-1">First Name:</span>
                                            {isEditing ? (
                                                <input 
                                                    value={editForm.first_name || ''} 
                                                    onChange={e => setEditForm({...editForm, first_name: e.target.value})}
                                                    className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1.5 text-sm focus:border-[#ec028b] outline-none"
                                                />
                                            ) : (
                                                <span className="text-white text-sm">{data.first_name || 'N/A'}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="text-gray-500 text-xs mb-1">Last Name:</span>
                                            {isEditing ? (
                                                <input 
                                                    value={editForm.last_name || ''} 
                                                    onChange={e => setEditForm({...editForm, last_name: e.target.value})}
                                                    className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1.5 text-sm focus:border-[#ec028b] outline-none"
                                                />
                                            ) : (
                                                <span className="text-white text-sm">{data.last_name || 'N/A'}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-xs mb-1">Email:</span>
                                        {isEditing ? (
                                            <input 
                                                value={editForm.email || ''} 
                                                onChange={e => setEditForm({...editForm, email: e.target.value})}
                                                className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1.5 text-sm focus:border-[#ec028b] outline-none"
                                            />
                                        ) : (
                                            <span className="text-white text-sm">{data.email || 'N/A'}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-xs mb-1">Phone:</span>
                                        {isEditing ? (
                                            <input 
                                                value={editForm.phone || ''} 
                                                onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                                className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-1.5 text-sm focus:border-[#ec028b] outline-none"
                                            />
                                        ) : (
                                            <span className="text-white text-sm">{data.phone || 'N/A'}</span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800">
                        <Button 
                            onClick={() => setActivePageId('E-26')}
                            className="bg-rhive-pink/10 text-rhive-pink border border-rhive-pink/30 hover:bg-rhive-pink hover:text-white"
                        >
                            <BriefcaseIcon className="w-4 h-4 mr-2" />
                            View Leads Pipeline
                        </Button>
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
};

export default PreConversionRecordPage;


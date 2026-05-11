
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import { useNavigation } from '../contexts/NavigationContext';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { firestoreService } from '../lib/firebaseService';
import { MapPinIcon, BuildingStorefrontIcon, ChevronRightIcon, PlusIcon } from '../components/icons';
import { cn } from '../lib/utils';

const PropertyPage: React.FC = () => {
    const { setActivePageId, setSelectedPropertyId } = useNavigation();
    const { currentUser } = useMockDB();

    const [allProperties, setAllProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');

    // Subscribe directly to Firestore 'properties' collection (real-time)
    useEffect(() => {
        const unsub = firestoreService.subscribeToDocuments('properties', (data: any[]) => {
            setAllProperties(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Helper: read the first matching key that has a non-empty value
    const getField = (prop: any, ...keys: string[]) => {
        for (const k of keys) {
            if (prop[k] !== undefined && prop[k] !== null && prop[k] !== '') return String(prop[k]);
        }
        return '';
    };

    // Accessors for both imported (underscore) and legacy (space/snake_case) field names
    const getName    = (p: any) => getField(p, 'Property_Name', 'name') || getAddress(p);
    const getAddress = (p: any) =>
        getField(p, 'Property_Street', 'property_address', 'address_full') ||
        [getField(p, 'Property_Street'), getField(p, 'Property_City')].filter(Boolean).join(', ') ||
        'Unknown Address';
    const getCity      = (p: any) => getField(p, 'Property_City', 'city');
    const getState     = (p: any) => getField(p, 'Property_State', 'state');
    const getZip       = (p: any) => getField(p, 'Property_Zip', 'zip', 'Property_Code');
    const getType      = (p: any) => getField(p, 'Property_Type', 'type') || 'Property';
    const getOwnerType = (p: any) => getField(p, 'Property_Owner_Type', 'owner_type');
    const getComRes    = (p: any) => getField(p, 'Commercial_or_Residential', 'commercial_or_residential');
    const getRoofStyle = (p: any) => getField(p, 'Roof_Style', 'roof_style');
    const getCondition = (p: any) => getField(p, 'Property_Condition', 'condition');

    // Build unique type filter chips
    const allTypes = Array.from(
        new Set(allProperties.map(p => getType(p)).filter(Boolean))
    ).sort();
    const filterOptions = ['All', ...allTypes];

    // Role-based visibility
    const roleFiltered = (() => {
        if (!currentUser) return [];
        const role = currentUser.role;
        if (role === 'Admin' || role === 'Super Admin' || role === 'Employee') {
            return allProperties;
        }
        // Non-admin: show properties where email matches
        return allProperties.filter(p =>
            (getField(p, 'Email') || '').toLowerCase() === (currentUser.email || '').toLowerCase()
        );
    })();

    // Apply type filter + search
    const filtered = roleFiltered
        .filter(p => filterType === 'All' || getType(p) === filterType)
        .filter(p => {
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                getName(p).toLowerCase().includes(q) ||
                getAddress(p).toLowerCase().includes(q) ||
                getCity(p).toLowerCase().includes(q) ||
                getState(p).toLowerCase().includes(q) ||
                getZip(p).toLowerCase().includes(q) ||
                getType(p).toLowerCase().includes(q)
            );
        });

    const handleSelectProperty = (id: string) => {
        setSelectedPropertyId(id);
        setActivePageId('E-12');
    };

    const typeColor = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('residential')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        if (t.includes('commercial'))  return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        if (t.includes('industrial'))  return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
        return 'bg-gray-800 text-gray-400 border-gray-700';
    };

    if (loading) {
        return (
            <PageContainer title="Properties" description="Loading property records...">
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#ec028b] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageContainer>
        );
    }

    const pageTitle =
        currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin' || currentUser?.role === 'Employee'
            ? 'All Properties'
            : 'My Properties';

    return (
        <PageContainer
            title={pageTitle}
            description={`${allProperties.length} propert${allProperties.length !== 1 ? 'ies' : 'y'} synced from Firestore`}
        >
            {/* Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        id="property-search"
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search name, address, city, type..."
                        className="w-72 pl-4 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/50 transition"
                    />
                    <div className="flex gap-1 flex-wrap">
                        {filterOptions.slice(0, 6).map(label => (
                            <button
                                key={label}
                                onClick={() => setFilterType(label)}
                                className={cn(
                                    'px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all',
                                    filterType === label
                                        ? 'bg-[#ec028b]/20 text-[#ec028b] border-[#ec028b]/40'
                                        : 'bg-gray-900/50 text-gray-500 border-gray-800 hover:text-white'
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <span className="text-gray-500 text-sm font-mono">
                        {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <Button className="flex items-center gap-2 shadow-[0_0_15px_rgba(236,2,139,0.2)]">
                    <PlusIcon className="w-4 h-4" />
                    Add Property
                </Button>
            </div>

            {/* Empty state */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
                    <BuildingStorefrontIcon className="w-16 h-16 text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-lg">No Properties Found</p>
                    <p className="text-gray-500 text-sm mt-2 text-center max-w-sm">
                        {search
                            ? `No properties matching "${search}".`
                            : 'No properties in Firestore yet. Run the import script to sync from Google Sheets.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map(property => {
                        const name      = getName(property);
                        const street    = getField(property, 'Property_Street', 'property_address') || name;
                        const city      = getCity(property);
                        const state     = getState(property);
                        const zip       = getZip(property);
                        const type      = getType(property);
                        const ownerType = getOwnerType(property);
                        const comRes    = getComRes(property);
                        const roofStyle = getRoofStyle(property);
                        const condition = getCondition(property);
                        const cityStateZip = [city, state, zip].filter(Boolean).join(', ');

                        return (
                            <div
                                key={property.id}
                                onClick={() => handleSelectProperty(property.id)}
                                className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-[#ec028b]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,2,139,0.1)] overflow-hidden"
                            >
                                {/* Hover accent line */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Header row */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-black border border-gray-800 rounded-xl flex items-center justify-center group-hover:bg-[#ec028b]/10 group-hover:border-[#ec028b]/30 transition-colors flex-shrink-0">
                                        <MapPinIcon className="w-6 h-6 text-gray-400 group-hover:text-[#ec028b] transition-colors" />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {comRes && (
                                            <span className={cn(
                                                'text-[9px] px-2 py-0.5 rounded border font-black uppercase tracking-widest',
                                                comRes.toLowerCase().includes('commercial')
                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                            )}>
                                                {comRes}
                                            </span>
                                        )}
                                        <span className={cn(
                                            'text-[9px] px-2 py-0.5 rounded border font-black uppercase tracking-widest',
                                            typeColor(type)
                                        )}>
                                            {type}
                                        </span>
                                    </div>
                                </div>

                                {/* Name + Address */}
                                <div className="space-y-0.5 mb-4">
                                    <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-[#ec028b] transition-colors">
                                        {name}
                                    </h3>
                                    {street !== name && (
                                        <p className="text-gray-400 text-xs line-clamp-1">{street}</p>
                                    )}
                                    {cityStateZip && (
                                        <p className="text-gray-500 text-xs">{cityStateZip}</p>
                                    )}
                                </div>

                                {/* Info pills */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {ownerType && (
                                        <span className="text-[10px] bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-full text-gray-400">
                                            {ownerType}
                                        </span>
                                    )}
                                    {roofStyle && (
                                        <span className="text-[10px] bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-full text-gray-400">
                                            {roofStyle}
                                        </span>
                                    )}
                                    {condition && (
                                        <span className="text-[10px] bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-full text-gray-400">
                                            {condition}
                                        </span>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="pt-4 border-t border-gray-800/50 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-600 font-mono">
                                        {property.APN
                                            ? `APN: ${property.APN}`
                                            : property.Record_Id
                                            ? `ID: ${property.Record_Id}`
                                            : property.created_at
                                            ? String(property.created_at).slice(0, 10)
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
        </PageContainer>
    );
};

export default PropertyPage;

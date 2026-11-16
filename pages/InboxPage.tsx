import React, { useState, useEffect, useMemo, useRef } from 'react';
import PageContainer from '../components/PageContainer';
import Button from '../components/Button';
import CircuitryCard from '../components/CircuitryCard';
import { useNavigation } from '../contexts/NavigationContext';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { 
    InboxIcon, 
    MailIcon, 
    PhoneIcon, 
    ChatBubbleLeftRightIcon,
    SearchIcon, 
    ChevronDownIcon, 
    PlusIcon, 
    Check, 
    ClockIcon, 
    UserIcon, 
    BuildingStorefrontIcon, 
    ArrowRightIcon,
    XIcon,
    ArrowLeftIcon
} from '../components/icons';
import { cn } from '../lib/utils';
import { crmInboxService } from '../lib/firebaseService';
import type { CrmMessage, MessageChannel, InboxFolder } from '../types';

// Seed messages showcasing Email, SMS (Text), and Call logs linked to customers
const SEED_MESSAGES: CrmMessage[] = [
    {
        id: 'MSG-001',
        channel: 'email',
        folder: 'inbox',
        senderName: 'Dan Corkill',
        senderEmail: 'dcorkill@unphc.org',
        senderPhone: '801-555-0192',
        recipientName: 'Kara',
        subject: 'UNPHC Smith Apartments - Building B Roof Replacement Review',
        body: 'Hi Kara, thanks for the updated estimate on Building B. Our board reviewed the Owens Corning Duration specs and we would like to proceed with the contract signing next Tuesday. Can you confirm the target installation window?',
        timestamp: '10:42 AM',
        unread: true,
        client_id: 'CLI-UNPHC',
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_id: 'CAMP-UNPHC-1',
        campus_name: 'Smith Apartments Campus',
        assigned_to: 'Kara'
    },
    {
        id: 'MSG-002',
        channel: 'text',
        folder: 'inbox',
        senderName: 'Brad Baird',
        senderEmail: 'bbaird@gmail.com',
        senderPhone: '801-633-6901',
        recipientName: 'Chad Evenhuis',
        body: 'Hey Chad, our crew is ready on site at the residential re-roof. What time is the city building inspector arriving today?',
        timestamp: '9:15 AM',
        unread: true,
        client_id: 'CLI-BAIRD',
        client_name: 'Brad Baird',
        campus_name: 'Baird Residence',
        assigned_to: 'Chad Evenhuis'
    },
    {
        id: 'MSG-003',
        channel: 'call',
        folder: 'inbox',
        senderName: 'Anthony & Chelsea Cox',
        senderPhone: '469-502-0499',
        recipientName: 'Victor',
        subject: 'Inbound Call - Warranty & Gutters Inquiry',
        body: 'Spoke with Anthony regarding ice damming prevention and heat trace cables along the north eave. Confirmed appointment for Wednesday at 2 PM with Kara.',
        timestamp: 'Yesterday',
        unread: false,
        client_id: 'CLI-COX',
        client_name: 'Anthony & Chelsea Cox',
        campus_name: 'Cox Estate',
        call_duration: '4m 18s',
        call_outcome: 'Connected - Scheduled Follow Up',
        assigned_to: 'Kara'
    },
    {
        id: 'MSG-004',
        channel: 'text',
        folder: 'inbox',
        senderName: 'Blair & Linda Nelson',
        senderPhone: '801-968-5200',
        recipientName: 'Kara',
        body: 'Kara, we received the insurance scope approval from State Farm! Deductible check is ready whenever you need it.',
        timestamp: 'Yesterday',
        unread: false,
        client_id: 'CLI-NELSON',
        client_name: 'Blair & Linda Nelson',
        campus_name: 'Nelson Family Property',
        assigned_to: 'Kara'
    },
    {
        id: 'MSG-005',
        channel: 'email',
        folder: 'sent',
        senderName: 'Kara',
        senderEmail: 'kara@rhiveconstruction.com',
        recipientName: 'Dan Corkill',
        subject: 'Re: UNPHC Smith Apartments - Building B Roof Replacement Review',
        body: 'Hi Dan, wonderful news! I have prepared the digital agreement in Stage 4: SIGN & VERIFY. The target install date is set for the first week of next month.',
        timestamp: 'Nov 14',
        unread: false,
        client_id: 'CLI-UNPHC',
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        assigned_to: 'Kara'
    },
    {
        id: 'MSG-006',
        channel: 'call',
        folder: 'closed',
        senderName: 'Apex Roofing Supplier',
        senderPhone: '801-222-9900',
        recipientName: 'Chad Evenhuis',
        subject: 'Supplier Check - Shingle Delivery',
        body: 'Confirmed delivery of 120 bundles of Owens Corning TruDefinition Duration shingles for Monday 7:00 AM dispatch.',
        timestamp: 'Nov 12',
        unread: false,
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        call_duration: '2m 45s',
        call_outcome: 'Connected - Delivery Confirmed',
        assigned_to: 'Chad Evenhuis'
    }
];

export const InboxPage: React.FC = () => {
    const { setActivePageId, setSelectedAccountId } = useNavigation();
    const { currentUser } = useMockDB();

    // Messages state backed by Firestore + localStorage
    const [messages, setMessages] = useState<CrmMessage[]>(() => {
        try {
            const saved = localStorage.getItem('rhive_crm_inbox');
            if (saved) return JSON.parse(saved);
        } catch { /* ignore */ }
        return SEED_MESSAGES;
    });

    const [isSending, setIsSending] = useState(false);

    // Real-time Firestore sync
    useEffect(() => {
        const unsubscribe = crmInboxService.subscribeToMessages((firestoreMsgs) => {
            if (firestoreMsgs && firestoreMsgs.length > 0) {
                setMessages(prev => {
                    const firestoreIds = new Set(firestoreMsgs.map(m => m.id));
                    const remainingPrev = prev.filter(m => !firestoreIds.has(m.id));
                    return [...firestoreMsgs, ...remainingPrev];
                });
            }
        });
        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('rhive_crm_inbox', JSON.stringify(messages));
        } catch { /* ignore */ }
    }, [messages]);

    // Active Folder & Filters
    const [activeFolder, setActiveFolder] = useState<InboxFolder>('inbox');
    const [readFilter, setReadFilter] = useState<'all' | 'unread'>('all');
    const [channelFilter, setChannelFilter] = useState<'all' | MessageChannel>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(messages[0]?.id || null);

    // Channel Filter Dropdown
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const filterDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
                setIsFilterDropdownOpen(false);
            }
        };
        if (isFilterDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isFilterDropdownOpen]);

    // Reply Box state
    const [replyTab, setReplyTab] = useState<'email' | 'text' | 'call'>('text');
    const [replyText, setReplyText] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [callOutcome, setCallOutcome] = useState('Connected');
    const [callDuration, setCallDuration] = useState('3m 15s');

    // New Message Modal
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [newMessageRecipient, setNewMessageRecipient] = useState('');
    const [newMessagePhone, setNewMessagePhone] = useState('');
    const [newMessageEmail, setNewMessageEmail] = useState('');
    const [newMessageChannel, setNewMessageChannel] = useState<MessageChannel>('text');
    const [newMessageSubject, setNewMessageSubject] = useState('');
    const [newMessageBody, setNewMessageBody] = useState('');
    const [newMessageCustomer, setNewMessageCustomer] = useState('UNPHC (Utah Non-Profit Housing Corp)');

    // Unread count
    const unreadCount = useMemo(() => {
        return messages.filter(m => m.unread && m.folder === 'inbox').length;
    }, [messages]);

    // Filtered Messages
    const filteredMessages = useMemo(() => {
        return messages.filter(m => {
            // Folder filter
            if (m.folder !== activeFolder) return false;

            // Read / Unread filter
            if (readFilter === 'unread' && !m.unread) return false;

            // Channel filter
            if (channelFilter !== 'all' && m.channel !== channelFilter) return false;

            // Search query
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesSender = m.senderName.toLowerCase().includes(q);
                const matchesSubject = (m.subject || '').toLowerCase().includes(q);
                const matchesBody = m.body.toLowerCase().includes(q);
                const matchesCustomer = (m.client_name || '').toLowerCase().includes(q);
                return matchesSender || matchesSubject || matchesBody || matchesCustomer;
            }

            return true;
        });
    }, [messages, activeFolder, readFilter, channelFilter, searchQuery]);

    // Active selected message
    const activeMessage = useMemo(() => {
        return messages.find(m => m.id === selectedMessageId) || filteredMessages[0] || null;
    }, [messages, selectedMessageId, filteredMessages]);

    // Mark active message read when opened
    useEffect(() => {
        if (activeMessage && activeMessage.unread) {
            setMessages(prev => prev.map(m => m.id === activeMessage.id ? { ...m, unread: false } : m));
            crmInboxService.toggleReadStatus(activeMessage.id, false);
        }
    }, [activeMessage?.id]);

    // Handle Send Reply (Using RHIVE line (435) 417-6637 via JustCall API)
    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() && replyTab !== 'call') return;
        setIsSending(true);

        const recipientPhone = activeMessage?.senderPhone || activeMessage?.recipientPhone || '';
        const recipientEmail = activeMessage?.senderEmail || activeMessage?.recipientEmail || '';

        try {
            const result = await crmInboxService.sendMessage({
                channel: replyTab,
                recipientPhone,
                recipientEmail,
                recipientName: activeMessage?.senderName || 'Customer',
                messageBody: replyText,
                subject: replyTab === 'email' ? (emailSubject || `Re: ${activeMessage?.subject || 'Update'}`) : undefined,
                senderName: currentUser?.name || 'Kara',
                clientId: activeMessage?.client_id,
                clientName: activeMessage?.client_name,
                campusName: activeMessage?.campus_name,
                assignedTo: currentUser?.name || 'Kara',
                callDuration: replyTab === 'call' ? callDuration : undefined,
                callOutcome: replyTab === 'call' ? callOutcome : undefined
            });

            if (result.success && result.data) {
                setMessages(prev => [result.data, ...prev]);
            }
        } catch (err) {
            console.error('Failed to send reply:', err);
        } finally {
            setIsSending(false);
            setReplyText('');
            setEmailSubject('');
        }
    };

    // Handle Quick Actions
    const handleToggleReadStatus = (id: string) => {
        const msg = messages.find(m => m.id === id);
        if (!msg) return;
        const newStatus = !msg.unread;
        setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: newStatus } : m));
        crmInboxService.toggleReadStatus(id, newStatus);
    };

    const handleMoveFolder = (id: string, folder: InboxFolder) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, folder } : m));
        crmInboxService.moveToFolder(id, folder);
    };

    // Handle Compose New (Dispatches via (435) 417-6637)
    const handleSendNewMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessageBody.trim() && newMessageChannel !== 'call') return;
        setIsSending(true);

        try {
            const result = await crmInboxService.sendMessage({
                channel: newMessageChannel,
                recipientPhone: newMessagePhone,
                recipientEmail: newMessageEmail,
                recipientName: newMessageRecipient || 'Customer',
                messageBody: newMessageBody,
                subject: newMessageSubject || undefined,
                senderName: currentUser?.name || 'Kara',
                clientName: newMessageCustomer,
                assignedTo: currentUser?.name || 'Kara'
            });

            if (result.success && result.data) {
                setMessages(prev => [result.data, ...prev]);
                setSelectedMessageId(result.data.id);
            }
        } catch (err) {
            console.error('Failed to send new message:', err);
        } finally {
            setIsSending(false);
            setIsComposeOpen(false);
            setNewMessageRecipient('');
            setNewMessagePhone('');
            setNewMessageEmail('');
            setNewMessageSubject('');
            setNewMessageBody('');
        }
    };

    return (
        <PageContainer 
            title="Unified Inbox" 
            subtitle="Communications hub for customer emails, SMS texts, and phone calls"
        >
            <div className="space-y-4">
                {/* ── TOP HEADER ACTION BAR ─────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-black/60 border border-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-rhive-pink/10 border border-rhive-pink/20 rounded-lg text-rhive-pink">
                            <InboxIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-white">
                                    Communications Inbox
                                </h2>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-rhive-pink text-white rounded-full">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400 font-mono">
                                    Standalone RHIVE Messaging
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    Live Line: (435) 417-6637
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => setIsComposeOpen(true)}
                            className="flex items-center gap-1.5"
                        >
                            <PlusIcon className="w-4 h-4" />
                            New Message
                        </Button>
                    </div>
                </div>

                {/* ── MAIN WORKSPACE: 3 COLUMNS (FOLDERS, LIST, THREAD) ───────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[680px]">
                    
                    {/* 1. LEFT SIDEBAR: FOLDERS & STATUS ─────────────────────────── */}
                    <div className="lg:col-span-3 bg-black/70 border border-gray-800 rounded-lg p-3 space-y-4">
                        <div>
                            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-500 font-black">
                                My Inbox
                            </div>
                            <div className="space-y-1 mt-1 font-mono text-xs">
                                <button
                                    onClick={() => setActiveFolder('inbox')}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all text-left",
                                        activeFolder === 'inbox' 
                                            ? "bg-rhive-pink text-white shadow-[0_0_8px_rgba(236,2,139,0.3)]" 
                                            : "text-gray-300 hover:bg-gray-900 hover:text-white"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <InboxIcon className="w-4 h-4" />
                                        Inbox
                                    </span>
                                    {unreadCount > 0 && (
                                        <span className={cn(
                                            "px-1.5 py-0.5 rounded-full text-[10px]",
                                            activeFolder === 'inbox' ? "bg-white text-rhive-pink" : "bg-rhive-pink text-white"
                                        )}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => setActiveFolder('assigned')}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all text-left",
                                        activeFolder === 'assigned' 
                                            ? "bg-rhive-pink text-white shadow-[0_0_8px_rgba(236,2,139,0.3)]" 
                                            : "text-gray-300 hover:bg-gray-900 hover:text-white"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <UserIcon className="w-4 h-4" />
                                        Assigned to Me
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveFolder('sent')}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all text-left",
                                        activeFolder === 'sent' 
                                            ? "bg-rhive-pink text-white shadow-[0_0_8px_rgba(236,2,139,0.3)]" 
                                            : "text-gray-300 hover:bg-gray-900 hover:text-white"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <ArrowRightIcon className="w-4 h-4" />
                                        Sent
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveFolder('closed')}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all text-left",
                                        activeFolder === 'closed' 
                                            ? "bg-rhive-pink text-white shadow-[0_0_8px_rgba(236,2,139,0.3)]" 
                                            : "text-gray-300 hover:bg-gray-900 hover:text-white"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <Check className="w-4 h-4" />
                                        Closed
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Channel Breakdown Filter Shortcuts */}
                        <div className="pt-3 border-t border-gray-800">
                            <div className="flex items-center justify-between px-3 py-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-black">
                                    Channel Breakdown
                                </span>
                                {channelFilter !== 'all' && (
                                    <button 
                                        onClick={() => setChannelFilter('all')}
                                        className="text-[10px] font-mono text-rhive-pink hover:underline"
                                    >
                                        Clear Filter
                                    </button>
                                )}
                            </div>
                            <div className="mt-2 space-y-1 text-xs font-mono">
                                <button
                                    type="button"
                                    onClick={() => setChannelFilter(prev => prev === 'email' ? 'all' : 'email')}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left",
                                        channelFilter === 'email' 
                                            ? "bg-blue-500/15 border border-blue-500/40 text-blue-300 font-bold shadow-[0_0_8px_rgba(59,130,246,0.2)]" 
                                            : "text-gray-400 hover:bg-gray-900/60 hover:text-white"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <MailIcon className={cn("w-4 h-4", channelFilter === 'email' ? "text-blue-400" : "text-blue-400/80")} />
                                        Emails
                                    </span>
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                        channelFilter === 'email' ? "bg-blue-500 text-white" : "bg-gray-900 text-gray-300"
                                    )}>
                                        {messages.filter(m => m.channel === 'email').length}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setChannelFilter(prev => prev === 'text' ? 'all' : 'text')}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left",
                                        channelFilter === 'text' 
                                            ? "bg-green-500/15 border border-green-500/40 text-green-300 font-bold shadow-[0_0_8px_rgba(34,197,94,0.2)]" 
                                            : "text-gray-400 hover:bg-gray-900/60 hover:text-white"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <ChatBubbleLeftRightIcon className={cn("w-4 h-4", channelFilter === 'text' ? "text-green-400" : "text-green-400/80")} />
                                        Texts (SMS)
                                    </span>
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                        channelFilter === 'text' ? "bg-green-500 text-white" : "bg-gray-900 text-gray-300"
                                    )}>
                                        {messages.filter(m => m.channel === 'text').length}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setChannelFilter(prev => prev === 'call' ? 'all' : 'call')}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left",
                                        channelFilter === 'call' 
                                            ? "bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)]" 
                                            : "text-gray-400 hover:bg-gray-900/60 hover:text-white"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <PhoneIcon className={cn("w-4 h-4", channelFilter === 'call' ? "text-amber-400" : "text-amber-400/80")} />
                                        Calls
                                    </span>
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                        channelFilter === 'call' ? "bg-amber-500 text-white" : "bg-gray-900 text-gray-300"
                                    )}>
                                        {messages.filter(m => m.channel === 'call').length}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. MIDDLE COLUMN: MESSAGE LIST WITH FILTERS ───────────────── */}
                    <div className="lg:col-span-4 bg-black/70 border border-gray-800 rounded-lg flex flex-col overflow-hidden">
                        
                        {/* Filters Bar (All / Unread + Channel Dropdown) */}
                        <div className="p-3 border-b border-gray-800 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                {/* All / Unread Toggle */}
                                <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg p-0.5 font-mono text-xs">
                                    <button
                                        onClick={() => setReadFilter('all')}
                                        className={cn(
                                            "px-3 py-1 rounded font-bold transition-all",
                                            readFilter === 'all' ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
                                        )}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setReadFilter('unread')}
                                        className={cn(
                                            "px-3 py-1 rounded font-bold transition-all",
                                            readFilter === 'unread' ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
                                        )}
                                    >
                                        Unread
                                    </button>
                                </div>

                                {/* Channel Filter Dropdown (All, Emails, Texts, Calls) */}
                                <div className="relative" ref={filterDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                        className="px-2.5 py-1 bg-gray-950 border border-gray-800 hover:border-gray-700 rounded-lg text-xs font-mono font-bold text-white flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <span>
                                            {channelFilter === 'all' && 'Filter: All Types'}
                                            {channelFilter === 'email' && 'Filter: Emails'}
                                            {channelFilter === 'text' && 'Filter: Texts'}
                                            {channelFilter === 'call' && 'Filter: Calls'}
                                        </span>
                                        <ChevronDownIcon className={cn("w-3.5 h-3.5 transition-transform", isFilterDropdownOpen && "rotate-180")} />
                                    </button>

                                    {isFilterDropdownOpen && (
                                        <div className="absolute right-0 mt-1 w-44 bg-gray-950/95 border border-gray-700 rounded-lg shadow-xl z-50 p-1 font-mono text-xs backdrop-blur-xl">
                                            {[
                                                { id: 'all', label: 'All types', icon: null },
                                                { id: 'email', label: 'Emails', icon: <MailIcon className="w-3.5 h-3.5 text-blue-400" /> },
                                                { id: 'text', label: 'Texts', icon: <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-green-400" /> },
                                                { id: 'call', label: 'Calls', icon: <PhoneIcon className="w-3.5 h-3.5 text-amber-400" /> },
                                            ].map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => {
                                                        setChannelFilter(opt.id as any);
                                                        setIsFilterDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left",
                                                        channelFilter === opt.id ? "bg-gray-800 text-white font-bold" : "text-gray-300 hover:bg-gray-900"
                                                    )}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {opt.icon}
                                                        {opt.label}
                                                    </span>
                                                    {channelFilter === opt.id && <Check className="w-3.5 h-3.5 text-rhive-pink" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Search bar */}
                            <div className="relative">
                                <SearchIcon className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="text"
                                    placeholder="Search messages, contacts, customers..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/60 border border-gray-800 pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-gray-600 rounded-lg focus:outline-none focus:border-rhive-pink"
                                />
                            </div>
                        </div>

                        {/* List of Messages */}
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-800/60 max-h-[580px]">
                            {filteredMessages.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 font-mono text-xs">
                                    <InboxIcon className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-600" />
                                    Inbox is empty, nice work!
                                </div>
                            ) : (
                                filteredMessages.map(msg => {
                                    const isSelected = activeMessage?.id === msg.id;
                                    return (
                                        <div
                                            key={msg.id}
                                            onClick={() => setSelectedMessageId(msg.id)}
                                            className={cn(
                                                "p-3 cursor-pointer transition-colors text-left relative",
                                                isSelected ? "bg-gray-900/90 border-l-2 border-rhive-pink" : "hover:bg-gray-900/40",
                                                msg.unread && "font-bold text-white bg-rhive-pink/5"
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-1.5 truncate">
                                                    {/* Channel Badge */}
                                                    <span className={cn(
                                                        "p-1 rounded text-[10px]",
                                                        msg.channel === 'email' && "bg-blue-500/10 text-blue-400 border border-blue-500/30",
                                                        msg.channel === 'text' && "bg-green-500/10 text-green-400 border border-green-500/30",
                                                        msg.channel === 'call' && "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                                    )}>
                                                        {msg.channel === 'email' && <MailIcon className="w-3 h-3" />}
                                                        {msg.channel === 'text' && <ChatBubbleLeftRightIcon className="w-3 h-3" />}
                                                        {msg.channel === 'call' && <PhoneIcon className="w-3 h-3" />}
                                                    </span>

                                                    <span className="font-bold text-sm text-white truncate font-sans">
                                                        {msg.senderName}
                                                    </span>
                                                </div>

                                                <span className="text-[10px] font-mono text-gray-500 shrink-0">
                                                    {msg.timestamp}
                                                </span>
                                            </div>

                                            {/* Customer Tag */}
                                            {msg.client_name && (
                                                <div className="text-[10px] font-mono text-rhive-pink truncate mb-1">
                                                    🏢 {msg.client_name}
                                                </div>
                                            )}

                                            {/* Subject or Preview */}
                                            {msg.subject && (
                                                <div className="text-xs text-gray-200 font-medium truncate mb-0.5">
                                                    {msg.subject}
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-400 font-mono line-clamp-2">
                                                {msg.body}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* 3. RIGHT COLUMN: MESSAGE THREAD & RESPONSE COMPOSER ────────── */}
                    <div className="lg:col-span-5 bg-black/70 border border-gray-800 rounded-lg flex flex-col overflow-hidden">
                        {activeMessage ? (
                            <div className="flex flex-col h-full">
                                {/* Thread Header: Contact Info & Linked Customer */}
                                <div className="p-4 border-b border-gray-800 bg-gray-950/80">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-rhive-pink/20 border border-rhive-pink/40 flex items-center justify-center font-bold text-xs text-rhive-pink font-mono">
                                                    {activeMessage.senderName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-base text-white font-sans">
                                                        {activeMessage.senderName}
                                                    </h3>
                                                    <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
                                                        {activeMessage.senderPhone && <span>📞 {activeMessage.senderPhone}</span>}
                                                        {activeMessage.senderEmail && <span>✉️ {activeMessage.senderEmail}</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Linked Customer Hierarchy Breadcrumb */}
                                            {activeMessage.client_name && (
                                                <div className="mt-2.5 p-2 bg-gray-900/60 rounded border border-gray-800 text-xs font-mono flex items-center justify-between">
                                                    <div className="truncate">
                                                        <span className="text-gray-500 text-[10px] block uppercase">Linked Customer</span>
                                                        <span className="text-white font-bold truncate">
                                                            {activeMessage.client_name}
                                                        </span>
                                                        {activeMessage.campus_name && (
                                                            <span className="text-gray-400 text-[11px] block truncate">
                                                                📍 {activeMessage.campus_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {activeMessage.client_id && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedAccountId(activeMessage.client_id!);
                                                                setActivePageId('E-CUSTOMERS');
                                                            }}
                                                            className="text-xs text-rhive-pink hover:text-white font-bold ml-2 underline shrink-0"
                                                        >
                                                            View Client ↗
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions: Mark unread, close */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={() => handleToggleReadStatus(activeMessage.id)}
                                                title="Toggle Unread"
                                                className="p-1.5 rounded bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white text-xs border border-gray-800"
                                            >
                                                Mark Unread
                                            </button>
                                            <button
                                                onClick={() => handleMoveFolder(activeMessage.id, activeMessage.folder === 'closed' ? 'inbox' : 'closed')}
                                                className="p-1.5 rounded bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white text-xs border border-gray-800"
                                            >
                                                {activeMessage.folder === 'closed' ? 'Reopen' : 'Close'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Thread History Stream */}
                                <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[380px]">
                                    {/* Inbound Message Bubble */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-xs text-gray-300 font-mono shrink-0">
                                            {activeMessage.senderName.charAt(0)}
                                        </div>
                                        <div className="flex-1 bg-gray-900/80 border border-gray-800 p-3.5 rounded-lg text-left">
                                            <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-1.5">
                                                <span className="font-bold text-gray-300">{activeMessage.senderName}</span>
                                                <span>{activeMessage.timestamp}</span>
                                            </div>

                                            {activeMessage.subject && (
                                                <div className="font-bold text-sm text-white mb-2 font-sans">
                                                    {activeMessage.subject}
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                                                {activeMessage.body}
                                            </p>

                                            {activeMessage.channel === 'call' && (
                                                <div className="mt-3 pt-2 border-t border-gray-800 flex items-center gap-4 text-xs font-mono text-gray-400">
                                                    {activeMessage.call_duration && <span>Duration: <strong className="text-white">{activeMessage.call_duration}</strong></span>}
                                                    {activeMessage.call_outcome && <span>Outcome: <strong className="text-green-400">{activeMessage.call_outcome}</strong></span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Response Composer: Tabbed for Email / SMS / Log Call */}
                                <div className="p-3 border-t border-gray-800 bg-gray-950/90">
                                    <div className="flex items-center gap-1.5 mb-2 border-b border-gray-800 pb-2">
                                        <button
                                            type="button"
                                            onClick={() => setReplyTab('text')}
                                            className={cn(
                                                "px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all",
                                                replyTab === 'text' 
                                                    ? "bg-green-500/20 text-green-400 border border-green-500/40 shadow-sm" 
                                                    : "text-gray-400 hover:text-white"
                                            )}
                                        >
                                            <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                                            Send SMS (Text)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setReplyTab('email')}
                                            className={cn(
                                                "px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all",
                                                replyTab === 'email' 
                                                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm" 
                                                    : "text-gray-400 hover:text-white"
                                            )}
                                        >
                                            <MailIcon className="w-3.5 h-3.5" />
                                            Send Email
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setReplyTab('call')}
                                            className={cn(
                                                "px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all",
                                                replyTab === 'call' 
                                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm" 
                                                    : "text-gray-400 hover:text-white"
                                            )}
                                        >
                                            <PhoneIcon className="w-3.5 h-3.5" />
                                            Log Call
                                        </button>
                                    </div>

                                    <form onSubmit={handleSendReply} className="space-y-2">
                                        {replyTab === 'text' && (
                                            <div className="flex items-center justify-between text-[11px] font-mono px-1 py-1 bg-black/40 rounded border border-gray-800/60 text-gray-400">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-gray-500">From:</span>
                                                    <span className="text-white font-bold">(435) 417-6637</span>
                                                    <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.2 rounded border border-green-500/30">Official RHIVE Line</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-gray-500">To:</span>
                                                    <span className="text-white font-bold">{activeMessage.senderPhone || activeMessage.senderName}</span>
                                                </div>
                                            </div>
                                        )}

                                        {replyTab === 'email' && (
                                            <input 
                                                type="text"
                                                placeholder="Email Subject..."
                                                value={emailSubject}
                                                onChange={e => setEmailSubject(e.target.value)}
                                                className="w-full bg-black/60 border border-gray-800 px-3 py-1.5 text-xs font-mono text-white placeholder-gray-600 rounded focus:outline-none focus:border-rhive-pink"
                                            />
                                        )}

                                        {replyTab === 'call' && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">Call Outcome</label>
                                                    <select
                                                        value={callOutcome}
                                                        onChange={e => setCallOutcome(e.target.value)}
                                                        className="w-full bg-black/60 border border-gray-800 px-2 py-1 text-xs font-mono text-white rounded"
                                                    >
                                                        <option value="Connected - Follow Up Scheduled">Connected - Follow Up Scheduled</option>
                                                        <option value="Left Voicemail">Left Voicemail</option>
                                                        <option value="No Answer / Busy">No Answer / Busy</option>
                                                        <option value="Wrong Number">Wrong Number</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">Duration</label>
                                                    <input 
                                                        type="text"
                                                        value={callDuration}
                                                        onChange={e => setCallDuration(e.target.value)}
                                                        className="w-full bg-black/60 border border-gray-800 px-2 py-1 text-xs font-mono text-white rounded"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <textarea
                                            rows={3}
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            placeholder={
                                                replyTab === 'email' ? 'Compose email reply...' :
                                                replyTab === 'text' ? `Text message to ${activeMessage.senderPhone || activeMessage.senderName}...` :
                                                'Enter call notes and discussion highlights...'
                                            }
                                            className="w-full bg-black/60 border border-gray-800 p-2.5 text-xs font-mono text-white placeholder-gray-600 rounded-lg focus:outline-none focus:border-rhive-pink resize-none"
                                        />

                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono text-gray-500">
                                                {replyTab === 'text' && `${replyText.length}/160 characters (1 SMS segment)`}
                                            </span>

                                            <Button 
                                                type="submit"
                                                variant="primary" 
                                                size="sm"
                                                disabled={isSending}
                                                className="px-4 py-1.5 text-xs font-mono"
                                            >
                                                {isSending ? 'Sending...' : (
                                                    replyTab === 'email' ? 'Send Email' :
                                                    replyTab === 'text' ? 'Send SMS via (435) 417-6637' :
                                                    'Log Call'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500 font-mono text-xs flex flex-col items-center justify-center h-full">
                                <InboxIcon className="w-10 h-10 mb-3 opacity-30 text-gray-600" />
                                Select a conversation thread to read and reply.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── COMPOSE NEW MESSAGE MODAL ─────────────────────────────────────── */}
            {isComposeOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-950 border border-gray-700 rounded-xl w-full max-w-lg p-6 shadow-2xl relative">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <PlusIcon className="w-5 h-5 text-rhive-pink" />
                                New Message
                            </h3>
                            <button onClick={() => setIsComposeOpen(false)} className="text-gray-400 hover:text-white">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSendNewMessage} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">Channel</label>
                                <div className="flex gap-2">
                                    {(['text', 'email', 'call'] as MessageChannel[]).map(ch => (
                                        <button
                                            key={ch}
                                            type="button"
                                            onClick={() => setNewMessageChannel(ch)}
                                            className={cn(
                                                "flex-1 py-1.5 rounded text-xs font-mono font-bold capitalize border transition-all",
                                                newMessageChannel === ch 
                                                    ? "bg-rhive-pink text-white border-rhive-pink shadow-[0_0_8px_rgba(236,2,139,0.3)]" 
                                                    : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
                                            )}
                                        >
                                            {ch === 'text' && 'SMS Text'}
                                            {ch === 'email' && 'Email'}
                                            {ch === 'call' && 'Log Call'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">Recipient Name</label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="e.g. Dan Corkill"
                                    value={newMessageRecipient}
                                    onChange={e => setNewMessageRecipient(e.target.value)}
                                    className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded focus:outline-none focus:border-rhive-pink"
                                />
                            </div>

                            {newMessageChannel === 'text' && (
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 mb-1">Recipient Mobile Phone (SMS)</label>
                                    <input 
                                        type="tel"
                                        required
                                        placeholder="e.g. (801) 633-6901"
                                        value={newMessagePhone}
                                        onChange={e => setNewMessagePhone(e.target.value)}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded focus:outline-none focus:border-rhive-pink"
                                    />
                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-gray-400">
                                        <span className="text-gray-500">Sender Line:</span>
                                        <span className="text-white font-bold">(435) 417-6637</span>
                                        <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.2 rounded border border-green-500/30">Live SMS Gateway</span>
                                    </div>
                                </div>
                            )}

                            {newMessageChannel === 'email' && (
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 mb-1">Recipient Email</label>
                                    <input 
                                        type="email"
                                        required
                                        placeholder="e.g. client@example.com"
                                        value={newMessageEmail}
                                        onChange={e => setNewMessageEmail(e.target.value)}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded focus:outline-none focus:border-rhive-pink"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">Customer Client (Tier 1)</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. UNPHC (Utah Non-Profit Housing Corp)"
                                    value={newMessageCustomer}
                                    onChange={e => setNewMessageCustomer(e.target.value)}
                                    className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded focus:outline-none focus:border-rhive-pink"
                                />
                            </div>

                            {newMessageChannel === 'email' && (
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 mb-1">Subject</label>
                                    <input 
                                        type="text"
                                        placeholder="Project estimate follow up..."
                                        value={newMessageSubject}
                                        onChange={e => setNewMessageSubject(e.target.value)}
                                        className="w-full bg-black/60 border border-gray-800 px-3 py-2 text-xs font-mono text-white rounded focus:outline-none focus:border-rhive-pink"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">Message Content / Call Notes</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Type message text..."
                                    value={newMessageBody}
                                    onChange={e => setNewMessageBody(e.target.value)}
                                    className="w-full bg-black/60 border border-gray-800 p-3 text-xs font-mono text-white rounded focus:outline-none focus:border-rhive-pink resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
                                <Button type="button" variant="secondary" size="sm" onClick={() => setIsComposeOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" size="sm" disabled={isSending}>
                                    {isSending ? 'Sending...' : (newMessageChannel === 'text' ? 'Send SMS via (435) 417-6637' : 'Send')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default InboxPage;

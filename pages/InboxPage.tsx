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
    ArrowLeftIcon,
    MegaphoneIcon,
    SparklesIcon,
    PaperAirplaneIcon,
    UsersIcon
} from '../components/icons';
import { cn } from '../lib/utils';
import { crmInboxService, contactService } from '../lib/firebaseService';
import type { CrmMessage, MessageChannel, InboxFolder, EmailCampaign } from '../types';
import ConnectEmailCard from '../components/ConnectEmailCard';

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

// ── Batch Campaign Templates & Audience Models ──────────────────────────────
export interface CampaignRecipient {
    id: string;
    name: string;
    email: string;
    client_id?: string;
    client_name: string;
    campus_name?: string;
    stage: string;
    tier: 'Commercial' | 'Government' | 'Residential';
}

export interface CampaignTemplate {
    id: string;
    title: string;
    description: string;
    recommendedStage: string;
    recommendedTier: string;
    subject: string;
    body: string;
}

const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
    {
        id: 'tpl-capex-commercial',
        title: 'Commercial CapEx 2026 Roof Assessment',
        description: 'Target commercial facility managers with proactive moisture scans and budgeting reviews.',
        recommendedStage: 'Estimate',
        recommendedTier: 'Commercial',
        subject: '{{client_name}} — Complimentary 2026 Commercial CapEx Roof Assessment',
        body: `Hi {{first_name}},

With Utah's winter freeze-thaw cycles underway, proactive commercial roof health assessments are critical to prevent catastrophic membrane failure and unbudgeted capital expenses.

Our certified engineering team is currently scheduling complimentary 2026 CapEx moisture scans and thermal drone inspections across {{campus_name}}.

Key Assessment Highlights:
• Core membrane integrity evaluation (.060mil TPO / EPDM)
• Parapet coping and flashing wind-uplift verification
• Comprehensive photographic documentation for capital reserve planning

Would next Tuesday or Thursday work for a quick 20-minute on-site assessment with our senior estimator?

Best regards,
Kara | RHIVE Commercial Operations
Direct Line: (435) 417-6637`
    },
    {
        id: 'tpl-storm-drone',
        title: 'Post-Storm Thermal Drone Inspection',
        description: 'Deploy rapid high-resolution aerial scans after recent wind and hail activity.',
        recommendedStage: 'Lead',
        recommendedTier: 'All',
        subject: 'High-Resolution Drone Roof Inspection Available for {{client_name}}',
        body: `Hi {{first_name}},

Following recent wind and hail activity across the Wasatch Front, RHIVE is deploying thermal sensor-equipped drone inspections at zero out-of-pocket cost for {{campus_name}}.

We provide a full high-resolution digital twin, wind-shear impact scoring, and shingle granule loss analysis within 24 hours.

Reply directly to this email or call our team at (435) 417-6637 to reserve your drone flight window this week.

Warmly,
Chad Evenhuis | Field Operations Director
RHIVE Construction • Official Line: (435) 417-6637`
    },
    {
        id: 'tpl-quote-followup',
        title: 'Proposal Follow-up & Material Specs',
        description: 'Re-engage active quotes and estimates with manufacturer rebate deadlines.',
        recommendedStage: 'Quote',
        recommendedTier: 'All',
        subject: 'Update on your Roofing Proposal for {{client_name}}',
        body: `Hi {{first_name}},

I hope your week is off to a great start. I wanted to follow up on the custom roof specifications we prepared for {{campus_name}}.

Our team has reserved manufacturer rebate allocations for your Owens Corning Duration architectural shingles and enhanced ice-and-water underlayment. We can lock in this pricing before next month's material price adjustment.

You can review your full itemized breakdown and interactive options right in your RHIVE Project Portal.

Let me know if you would like to hop on a quick 5-minute call or if you have any questions on the warranty coverage.

Best,
Kara | Client Services
RHIVE Construction • (435) 417-6637`
    },
    {
        id: 'tpl-past-customer-referral',
        title: 'Past Customer Referral ($250 Reward) + Annual Check',
        description: 'Reward past clients and offer free annual gutter & flashing warranty sweeps.',
        recommendedStage: 'Past Customer',
        recommendedTier: 'Residential',
        subject: '{{first_name}}, claim your $250 RHIVE Referral Reward + Free Annual Health Check',
        body: `Hi {{first_name}},

It's been a privilege protecting your roof at {{campus_name}}. As part of the RHIVE Lifetime Craftsmanship pledge, your installation qualifies for a complimentary annual gutter and flashing inspection before the snow season.

Plus, our 2026 Community Referral Program is now live: every neighbor or colleague you refer who books a qualifying roof replacement earns you a $250 direct cash card, and saves them $500 on their project!

Simply share this note or have them mention your name when calling (435) 417-6637.

Thank you for being a valued part of the RHIVE family!

Best regards,
Victor & The RHIVE Team
RHIVE Construction • (435) 417-6637`
    },
    {
        id: 'tpl-custom',
        title: 'Custom Blank Campaign',
        description: 'Draft your own personalized email campaign from scratch.',
        recommendedStage: 'All',
        recommendedTier: 'All',
        subject: 'Notice regarding {{client_name}} — RHIVE Operations',
        body: `Hi {{first_name}},

We are writing with an update regarding {{campus_name}}.

Please let us know if you have any questions or if our project team can assist.

Sincerely,
The RHIVE Construction Team
(435) 417-6637`
    }
];

const SEED_CAMPAIGN_RECIPIENTS: CampaignRecipient[] = [
    {
        id: 'rec-1',
        name: 'Dan Corkill',
        email: 'dcorkill@unphc.org',
        client_id: 'CLI-UNPHC',
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_name: 'Smith Apartments Campus',
        stage: 'Estimate',
        tier: 'Commercial'
    },
    {
        id: 'rec-2',
        name: 'Sarah Jenkins',
        email: 'sjenkins@unphc.com',
        client_id: 'CLI-UNPHC',
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_name: 'Escalante Park Campus',
        stage: 'Lead',
        tier: 'Commercial'
    },
    {
        id: 'rec-3',
        name: 'Marcus Vance',
        email: 'mvance@unphc-escalante.com',
        client_id: 'CLI-UNPHC',
        client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
        campus_name: 'Escalante Park Campus',
        stage: 'In Progress',
        tier: 'Commercial'
    },
    {
        id: 'rec-4',
        name: 'David Reynolds',
        email: 'david.reynolds@slcgov.com',
        client_id: 'CLI-SLC-GOV',
        client_name: 'City of Salt Lake City',
        campus_name: 'Municipal Fleet Maintenance Campus',
        stage: 'Lead',
        tier: 'Government'
    },
    {
        id: 'rec-5',
        name: 'Elena Rostova',
        email: 'elena.rostova@slcgov.com',
        client_id: 'CLI-SLC-GOV',
        client_name: 'City of Salt Lake City',
        campus_name: 'Public Works Complex',
        stage: 'Estimate',
        tier: 'Government'
    },
    {
        id: 'rec-6',
        name: 'Brad Baird',
        email: 'bbaird@gmail.com',
        client_id: 'CLI-BAIRD',
        client_name: 'Brad Baird',
        campus_name: 'Baird Residence',
        stage: 'Quote',
        tier: 'Residential'
    },
    {
        id: 'rec-7',
        name: 'Anthony Cox',
        email: 'anthony.cox@gmail.com',
        client_id: 'CLI-COX',
        client_name: 'Anthony & Chelsea Cox',
        campus_name: 'Cox Estate',
        stage: 'Lead',
        tier: 'Residential'
    },
    {
        id: 'rec-8',
        name: 'Blair Nelson',
        email: 'bnelson@slc-law.com',
        client_id: 'CLI-NELSON',
        client_name: 'Blair & Linda Nelson',
        campus_name: 'Nelson Family Property',
        stage: 'Sign & Verify',
        tier: 'Residential'
    },
    {
        id: 'rec-9',
        name: 'Willow Park HOA Board',
        email: 'board@willowpark.com',
        client_id: 'CLI-WILLOW',
        client_name: 'Willow Park HOA',
        campus_name: 'Willow Park Commons',
        stage: 'Past Customer',
        tier: 'Commercial'
    },
    {
        id: 'rec-10',
        name: 'Megaplex Facilities Team',
        email: 'facilities@megaplextheatres.com',
        client_id: 'CLI-MEGA',
        client_name: 'Megaplex Theatres',
        campus_name: 'South Jordan Megaplex',
        stage: 'Past Customer',
        tier: 'Commercial'
    },
    {
        id: 'rec-11',
        name: 'Sheena L (RHIVE Test)',
        email: 'sheena.l@rhiveconstruction.com',
        client_id: 'CLI-RHIVE-TEST',
        client_name: 'RHIVE Internal Test',
        campus_name: 'RHIVE HQ',
        stage: 'Lead',
        tier: 'Commercial'
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
    const [isSyncingEmails, setIsSyncingEmails] = useState(false);
    const [syncStatusText, setSyncStatusText] = useState<string | null>(null);
    const [isConnectEmailOpen, setIsConnectEmailOpen] = useState(false);

    const handleSyncEmails = async (silent = false) => {
        if (isSyncingEmails) return;
        setIsSyncingEmails(true);
        if (!silent) setSyncStatusText(null);
        try {
            const res = await crmInboxService.syncInboundEmails(20);
            if (!silent) {
                if (res.success) {
                    setSyncStatusText(res.importedCount > 0 ? `Synced ${res.importedCount} new email(s)` : 'Inbox up to date');
                } else {
                    setSyncStatusText(`Sync error: ${res.error || 'Failed'}`);
                }
                setTimeout(() => setSyncStatusText(null), 5000);
            }
        } finally {
            setIsSyncingEmails(false);
        }
    };

    // Real-time Firestore sync + silent inbound Gmail sync on open
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
        handleSyncEmails(true);
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

    // ── Email Campaign Hub State ──────────────────────────────────────────────
    const [campaignSubView, setCampaignSubView] = useState<'compose' | 'history'>('compose');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-capex-commercial');
    const [campaignName, setCampaignName] = useState<string>('Q1 2026 Commercial CapEx Outreach');
    const [campaignSubject, setCampaignSubject] = useState<string>(CAMPAIGN_TEMPLATES[0].subject);
    const [campaignBody, setCampaignBody] = useState<string>(CAMPAIGN_TEMPLATES[0].body);
    const [campaignBodyMode, setCampaignBodyMode] = useState<'text' | 'html'>('text');
    const [targetStageFilter, setTargetStageFilter] = useState<string>('all');
    const [targetTierFilter, setTargetTierFilter] = useState<string>('all');
    const [audienceSearch, setAudienceSearch] = useState<string>('');
    const [customRecipientName, setCustomRecipientName] = useState<string>('');
    const [customRecipientEmail, setCustomRecipientEmail] = useState<string>('');
    const [recipients, setRecipients] = useState<CampaignRecipient[]>(SEED_CAMPAIGN_RECIPIENTS);
    const [selectedRecipientEmails, setSelectedRecipientEmails] = useState<Set<string>>(() => {
        return new Set(SEED_CAMPAIGN_RECIPIENTS.map(r => r.email));
    });
    const [pastCampaigns, setPastCampaigns] = useState<any[]>([]);
    const [isDispatching, setIsDispatching] = useState<boolean>(false);
    const [dispatchFeedback, setDispatchFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Sync campaigns and live contacts from Firestore
    useEffect(() => {
        const unsubCampaigns = crmInboxService.subscribeToCampaigns((camps) => {
            if (camps) setPastCampaigns(camps);
        });

        // Pull any additional contacts from contacts collection
        contactService.getAll().then((res: any) => {
            if (res.success && res.data && res.data.length > 0) {
                const liveRecipients: CampaignRecipient[] = res.data
                    .filter((c: any) => c.email && c.email.includes('@'))
                    .map((c: any, idx: number) => ({
                        id: c.id || `live-${idx}`,
                        name: c.name || c.full_name || 'Contact',
                        email: c.email.toLowerCase().trim(),
                        client_id: c.client_id || c.account_id,
                        client_name: c.company || c.client_name || c.name || 'Valued Client',
                        campus_name: c.property_address || c.address || 'Property Location',
                        stage: c.stage || 'Lead',
                        tier: (c.type === 'Commercial' || c.tier === 'Commercial') ? 'Commercial' : (c.tier === 'Government' ? 'Government' : 'Residential')
                    }));

                if (liveRecipients.length > 0) {
                    setRecipients(prev => {
                        const existingEmails = new Set(prev.map(p => p.email.toLowerCase()));
                        const uniqueLive = liveRecipients.filter(r => !existingEmails.has(r.email.toLowerCase()));
                        return [...prev, ...uniqueLive];
                    });
                }
            }
        }).catch(() => { /* best-effort */ });

        return () => {
            if (typeof unsubCampaigns === 'function') unsubCampaigns();
        };
    }, []);

    // When template changes, update subject & body
    const handleSelectTemplate = (tplId: string) => {
        setSelectedTemplateId(tplId);
        const tpl = CAMPAIGN_TEMPLATES.find(t => t.id === tplId);
        if (tpl) {
            setCampaignBodyMode('text');
            setCampaignSubject(tpl.subject);
            setCampaignBody(tpl.body);
            setCampaignName(`${tpl.title} - ${new Date().toLocaleDateString()}`);
            setTargetStageFilter(tpl.recommendedStage.toLowerCase() === 'all' ? 'all' : tpl.recommendedStage);
            setTargetTierFilter(tpl.recommendedTier.toLowerCase() === 'all' ? 'all' : (tpl.recommendedTier as any));
        }
    };

    // Auto-detect pasted full HTML document and switch to HTML mode seamlessly
    const handleCampaignBodyChange = (val: string) => {
        setCampaignBody(val);
        if (
            campaignBodyMode === 'text' &&
            /^\s*(<!doctype\s+html|<html[\s>]|<table[\s>]|<div[\s>]|<body[\s>])/i.test(val)
        ) {
            setCampaignBodyMode('html');
        }
    };

    const handleLoadSampleHtml = () => {
        setCampaignBodyMode('html');
        setCampaignBody(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:24px;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#f3f4f6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#111827;border:1px solid #374151;border-radius:10px;overflow:hidden;">
    <tr>
      <td style="padding:24px 28px;background:#000000;border-bottom:2px solid #ec028b;">
        <div style="font-size:20px;font-weight:900;letter-spacing:2px;color:#ec028b;">RHIVE CONSTRUCTION</div>
        <div style="font-size:11px;color:#9ca3af;margin-top:4px;">Utah Commercial &amp; Residential Roofing Engineering</div>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;">
        <h2 style="margin:0 0 14px;color:#ffffff;font-size:18px;">Hello {{first_name}},</h2>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#d1d5db;">
          We have prepared a custom roof health overview for <strong>{{client_name}}</strong> at <strong>{{campus_name}}</strong>.
        </p>
        <div style="text-align:center;margin:26px 0;">
          <a href="https://app.rhiveconstruction.com" style="display:inline-block;background:#ec028b;color:#ffffff;text-decoration:none;font-weight:bold;font-size:13px;padding:12px 24px;border-radius:6px;letter-spacing:1px;">
            OPEN CLIENT PORTAL &rarr;
          </a>
        </div>
        <p style="margin:0;font-size:12px;color:#9ca3af;">
          Questions? Call our live dispatch line at <strong>(435) 417-6637</strong>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`);
    };

    // Filtered recipients according to selected filters
    const filteredRecipients = useMemo(() => {
        return recipients.filter(r => {
            if (targetStageFilter !== 'all' && !r.stage.toLowerCase().includes(targetStageFilter.toLowerCase())) return false;
            if (targetTierFilter !== 'all' && r.tier.toLowerCase() !== targetTierFilter.toLowerCase()) return false;
            if (audienceSearch) {
                const q = audienceSearch.toLowerCase();
                const matchName = r.name.toLowerCase().includes(q);
                const matchEmail = r.email.toLowerCase().includes(q);
                const matchCompany = r.client_name.toLowerCase().includes(q);
                return matchName || matchEmail || matchCompany;
            }
            return true;
        });
    }, [recipients, targetStageFilter, targetTierFilter, audienceSearch]);

    // Recipient selection toggles (STRICT NO CHECKBOXES RULE: uses custom switch / pill)
    const toggleRecipient = (email: string) => {
        setSelectedRecipientEmails(prev => {
            const next = new Set(prev);
            if (next.has(email)) {
                next.delete(email);
            } else {
                next.add(email);
            }
            return next;
        });
    };

    const handleSelectAllFiltered = () => {
        setSelectedRecipientEmails(prev => {
            const next = new Set(prev);
            filteredRecipients.forEach(r => next.add(r.email));
            return next;
        });
    };

    const handleDeselectAllFiltered = () => {
        setSelectedRecipientEmails(prev => {
            const next = new Set(prev);
            filteredRecipients.forEach(r => next.delete(r.email));
            return next;
        });
    };

    // Selected recipients list for sending (filtered audience that are toggled on)
    const activeSelectedRecipients = useMemo(() => {
        return filteredRecipients.filter(r => selectedRecipientEmails.has(r.email));
    }, [filteredRecipients, selectedRecipientEmails]);

    // Live preview recipient (first selected recipient, or fallback)
    const previewRecipient = useMemo(() => {
        return activeSelectedRecipients[0] || recipients[0] || {
            name: 'Dan Corkill',
            email: 'dcorkill@unphc.org',
            client_name: 'UNPHC (Utah Non-Profit Housing Corp)',
            campus_name: 'Smith Apartments Campus'
        };
    }, [activeSelectedRecipients, recipients]);

    // Personalized preview calculation
    const previewSubject = useMemo(() => {
        const firstName = (previewRecipient.name || 'Valued Client').split(' ')[0];
        return campaignSubject
            .replace(/\{\{first_name\}\}/gi, firstName)
            .replace(/\{\{client_name\}\}/gi, previewRecipient.client_name || 'Valued Client')
            .replace(/\{\{campus_name\}\}/gi, previewRecipient.campus_name || 'Your Property');
    }, [campaignSubject, previewRecipient]);

    const previewBody = useMemo(() => {
        const firstName = (previewRecipient.name || 'Valued Client').split(' ')[0];
        return campaignBody
            .replace(/\{\{first_name\}\}/gi, firstName)
            .replace(/\{\{client_name\}\}/gi, previewRecipient.client_name || 'Valued Client')
            .replace(/\{\{campus_name\}\}/gi, previewRecipient.campus_name || 'Your Property');
    }, [campaignBody, previewRecipient]);

    // Token insertion helper
    const handleInsertToken = (token: string, target: 'subject' | 'body') => {
        if (target === 'subject') {
            setCampaignSubject(prev => `${prev} ${token}`);
        } else {
            setCampaignBody(prev => `${prev} ${token}`);
        }
    };

    const handleAddCustomRecipient = () => {
        const email = customRecipientEmail.trim().toLowerCase();
        if (!email || !email.includes('@')) return;
        const name = customRecipientName.trim() || email.split('@')[0];
        const newRec: CampaignRecipient = {
            id: `custom-${Date.now()}`,
            name,
            email,
            client_name: name,
            campus_name: 'Direct Recipient',
            stage: targetStageFilter === 'all' ? 'Lead' : targetStageFilter,
            tier: (targetTierFilter === 'all' ? 'Commercial' : targetTierFilter) as any
        };
        setRecipients(prev => {
            if (prev.some(r => r.email.toLowerCase() === email)) return prev;
            return [newRec, ...prev];
        });
        setSelectedRecipientEmails(prev => {
            const next = new Set(prev);
            next.add(email);
            return next;
        });
        setCustomRecipientName('');
        setCustomRecipientEmail('');
    };

    // Dispatch Batch Campaign
    const handleDispatchCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (activeSelectedRecipients.length === 0) {
            setDispatchFeedback({ type: 'error', message: 'Please select at least one recipient to launch this batch campaign.' });
            return;
        }
        if (!campaignSubject.trim() || !campaignBody.trim()) {
            setDispatchFeedback({ type: 'error', message: 'Subject and message body cannot be empty.' });
            return;
        }

        setIsDispatching(true);
        setDispatchFeedback(null);

        try {
            const res = await crmInboxService.sendBatchCampaign({
                campaignName,
                subject: campaignSubject,
                body: campaignBody,
                isHtml: campaignBodyMode === 'html',
                recipients: activeSelectedRecipients.map(r => ({
                    name: r.name,
                    email: r.email,
                    client_id: r.client_id,
                    client_name: r.client_name,
                    campus_name: r.campus_name,
                    stage: r.stage
                })),
                senderName: currentUser?.name || 'Kara',
                senderEmail: currentUser?.email || 'kara@rhiveconstruction.com'
            });

            if (res.sentMessages && res.sentMessages.length > 0) {
                setMessages(prev => {
                    const existingIds = new Set(prev.map(m => m.id));
                    const fresh = res.sentMessages.filter((m: any) => !existingIds.has(m.id));
                    return [...fresh, ...prev];
                });
            }
            if (res.campaignLog) {
                setPastCampaigns(prev => [res.campaignLog, ...prev]);
            }

            if (res.success) {
                setDispatchFeedback({
                    type: 'success',
                    message: `Successfully launched "${campaignName}"! Queued ${res.queuedCount} personalized email(s) into mail_outbox and synced to the Sent folder.`
                });
            } else {
                setDispatchFeedback({
                    type: 'error',
                    message: `Email delivery blocked: ${res.error || 'Could not write to mail_outbox.'} (Check Firestore rules / Cloud Functions deployment.)`
                });
            }
        } catch (err: any) {
            setDispatchFeedback({ type: 'error', message: err.message || 'Error executing batch send.' });
        } finally {
            setIsDispatching(false);
        }
    };

    // Filtered Messages
    const filteredMessages = useMemo(() => {
        return messages.filter(m => {
            // Respect per-user "Share your emails" setting
            if ((m as any).is_shared === false && (m as any).owner_user_id && (m as any).owner_user_id !== currentUser?.id) {
                return false;
            }

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

                    <div className="flex flex-wrap items-center gap-2">
                        {syncStatusText && (
                            <span className="text-[11px] font-mono text-green-400 bg-green-500/10 border border-green-500/30 px-2.5 py-1 rounded-lg">
                                {syncStatusText}
                            </span>
                        )}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsConnectEmailOpen(true)}
                            className="flex items-center gap-1.5 text-xs font-mono"
                        >
                            <UserIcon className="w-4 h-4 text-rhive-gold" />
                            Connect Email
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={isSyncingEmails}
                            onClick={() => handleSyncEmails(false)}
                            className="flex items-center gap-1.5 text-xs font-mono"
                        >
                            <MailIcon className={cn("w-4 h-4 text-blue-400", isSyncingEmails && "animate-pulse")} />
                            {isSyncingEmails ? 'Syncing...' : 'Sync Emails'}
                        </Button>
                        <Button 
                            variant={activeFolder === 'campaigns' ? 'primary' : 'secondary'} 
                            size="sm"
                            onClick={() => {
                                setActiveFolder('campaigns');
                                setCampaignSubView('compose');
                            }}
                            className="flex items-center gap-1.5 text-xs font-mono"
                        >
                            <MegaphoneIcon className="w-4 h-4 text-rhive-pink" />
                            Batch Campaign
                        </Button>
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

                                <div className="pt-2 mt-2 border-t border-gray-800/80">
                                    <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-gray-500 font-black">
                                        Marketing & Outreach
                                    </div>
                                    <button
                                        onClick={() => {
                                            setActiveFolder('campaigns');
                                            setCampaignSubView('compose');
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold transition-all text-left mt-1",
                                            activeFolder === 'campaigns' 
                                                ? "bg-rhive-pink text-white shadow-[0_0_8px_rgba(236,2,139,0.3)]" 
                                                : "text-gray-300 hover:bg-gray-900 hover:text-white"
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <MegaphoneIcon className="w-4 h-4" />
                                            Email Campaigns
                                        </span>
                                        <span className={cn(
                                            "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold",
                                            activeFolder === 'campaigns' ? "bg-white text-rhive-pink" : "bg-rhive-pink/20 text-rhive-pink border border-rhive-pink/30"
                                        )}>
                                            Batch
                                        </span>
                                    </button>
                                </div>
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
                                        {messages.filter(m => m.channel === 'email' && (activeFolder === 'campaigns' || m.folder === activeFolder)).length}
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
                                        {messages.filter(m => m.channel === 'text' && (activeFolder === 'campaigns' || m.folder === activeFolder)).length}
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
                                        {messages.filter(m => m.channel === 'call' && (activeFolder === 'campaigns' || m.folder === activeFolder)).length}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. MIDDLE & RIGHT COLUMNS OR BATCH CAMPAIGNS HUB ───────────────── */}
                    {activeFolder === 'campaigns' ? (
                        <div className="lg:col-span-9 bg-black/70 border border-gray-800 rounded-lg p-5 flex flex-col space-y-6">
                            {/* Hub Header & Sub-Navigation */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="p-2 bg-rhive-pink/15 border border-rhive-pink/30 rounded-lg text-rhive-pink">
                                            <MegaphoneIcon className="w-5 h-5" />
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-black text-white tracking-wide">
                                                RHIVE Email Campaigns & Batch Dispatch
                                            </h3>
                                            <p className="text-xs text-gray-400 font-mono">
                                                Direct SMTP delivery via Google Workspace (Office@RhiveConstruction.com) • Real-time CRM Sync
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sub-view switcher */}
                                <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg p-0.5 font-mono text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setCampaignSubView('compose')}
                                        className={cn(
                                            "px-3.5 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5",
                                            campaignSubView === 'compose' ? "bg-rhive-pink text-white shadow-sm" : "text-gray-400 hover:text-white"
                                        )}
                                    >
                                        <SparklesIcon className="w-3.5 h-3.5" />
                                        New Campaign
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCampaignSubView('history')}
                                        className={cn(
                                            "px-3.5 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5",
                                            campaignSubView === 'history' ? "bg-rhive-pink text-white shadow-sm" : "text-gray-400 hover:text-white"
                                        )}
                                    >
                                        <ClockIcon className="w-3.5 h-3.5" />
                                        Campaign History ({pastCampaigns.length})
                                    </button>
                                </div>
                            </div>

                            {/* Feedback Alert Banner */}
                            {dispatchFeedback && (
                                <div className={cn(
                                    "p-3.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-all",
                                    dispatchFeedback.type === 'success' 
                                        ? "bg-green-500/10 border-green-500/30 text-green-300"
                                        : "bg-red-500/10 border-red-500/30 text-red-300"
                                )}>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{dispatchFeedback.type === 'success' ? '✅' : '⚠️'}</span>
                                        <span>{dispatchFeedback.message}</span>
                                    </div>
                                    <button 
                                        onClick={() => setDispatchFeedback(null)}
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            {campaignSubView === 'compose' ? (
                                <div className="space-y-6">
                                    {/* 1. TEMPLATE SELECTOR */}
                                    <div className="bg-gray-950/80 border border-gray-800/80 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                                <SparklesIcon className="w-4 h-4 text-rhive-pink" />
                                                1. Select Roofing Campaign Strategy
                                            </label>
                                            <span className="text-[11px] font-mono text-gray-500">
                                                Auto-loads tested commercial & residential copy
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                            {CAMPAIGN_TEMPLATES.map(tpl => {
                                                const isSelected = selectedTemplateId === tpl.id;
                                                return (
                                                    <button
                                                        key={tpl.id}
                                                        type="button"
                                                        onClick={() => handleSelectTemplate(tpl.id)}
                                                        className={cn(
                                                            "p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between",
                                                            isSelected 
                                                                ? "bg-rhive-pink/10 border-rhive-pink text-white shadow-[0_0_12px_rgba(236,2,139,0.25)]" 
                                                                : "bg-black/40 border-gray-800/90 text-gray-300 hover:border-gray-700 hover:bg-gray-900/40"
                                                        )}
                                                    >
                                                        <div>
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="font-bold text-xs truncate text-white">{tpl.title}</span>
                                                                {isSelected && <span className="w-2 h-2 rounded-full bg-rhive-pink animate-pulse" />}
                                                            </div>
                                                            <p className="text-[11px] text-gray-400 font-mono line-clamp-2 leading-relaxed">
                                                                {tpl.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-gray-800/60 text-[10px] font-mono text-gray-500">
                                                            <span>Target:</span>
                                                            <span className="text-rhive-gold font-bold">{tpl.recommendedStage}</span>
                                                            <span>•</span>
                                                            <span className="text-gray-400">{tpl.recommendedTier}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 2. AUDIENCE TARGETING & RECIPIENT SWITCHES */}
                                    <div className="bg-gray-950/80 border border-gray-800/80 rounded-lg p-4 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                                            <div>
                                                <label className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                                    <UsersIcon className="w-4 h-4 text-rhive-pink" />
                                                    2. Audience Segmentation & Selection
                                                </label>
                                                <span className="text-[11px] font-mono text-gray-500">
                                                    Filter by pipeline stage and customer tier. Switch toggles to include/exclude recipients.
                                                </span>
                                            </div>

                                            {/* Recipient count and quick toggles */}
                                            <div className="flex items-center gap-2 font-mono text-xs">
                                                <span className="px-2.5 py-1 rounded bg-rhive-pink/15 border border-rhive-pink/30 text-rhive-pink font-bold">
                                                    {activeSelectedRecipients.length} / {recipients.length} Selected
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={handleSelectAllFiltered}
                                                    className="px-2.5 py-1 rounded bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-[11px] font-bold transition-all"
                                                >
                                                    Select All Filtered
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleDeselectAllFiltered}
                                                    className="px-2.5 py-1 rounded bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-[11px] font-bold transition-all"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>

                                        {/* Filter Pills: Stage & Tier */}
                                        <div className="flex flex-col md:flex-row gap-3">
                                            {/* Stage Pills */}
                                            <div className="flex-1 space-y-1.5">
                                                <span className="text-[10px] font-mono uppercase text-gray-500 font-bold block">
                                                    Pipeline Stage
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {[
                                                        { id: 'all', label: 'All Stages' },
                                                        { id: 'Lead', label: 'Stage 1: Lead' },
                                                        { id: 'Estimate', label: 'Stage 2: Estimate' },
                                                        { id: 'Quote', label: 'Stage 3: Quote' },
                                                        { id: 'Sign & Verify', label: 'Stage 4: Sign & Verify' },
                                                        { id: 'In Progress', label: 'Stage 7: In Progress' },
                                                        { id: 'Past Customer', label: 'Stage 11: Past Customer' },
                                                    ].map(stg => (
                                                        <button
                                                            key={stg.id}
                                                            type="button"
                                                            data-stage-pill={stg.id}
                                                            onClick={() => setTargetStageFilter(stg.id)}
                                                            className={cn(
                                                                "px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all border",
                                                                targetStageFilter === stg.id 
                                                                    ? "bg-rhive-pink text-white border-rhive-pink shadow-sm" 
                                                                    : "bg-black/40 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                                                            )}
                                                        >
                                                            {stg.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Customer Tier Pills */}
                                            <div className="md:w-64 space-y-1.5">
                                                <span className="text-[10px] font-mono uppercase text-gray-500 font-bold block">
                                                    Customer Tier
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {[
                                                        { id: 'all', label: 'All Tiers' },
                                                        { id: 'Commercial', label: 'Commercial' },
                                                        { id: 'Government', label: 'Government' },
                                                        { id: 'Residential', label: 'Residential' },
                                                    ].map(tier => (
                                                        <button
                                                            key={tier.id}
                                                            type="button"
                                                            data-tier-pill={tier.id}
                                                            onClick={() => setTargetTierFilter(tier.id)}
                                                            className={cn(
                                                                "px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all border",
                                                                targetTierFilter === tier.id 
                                                                    ? "bg-rhive-gold text-black border-rhive-gold shadow-sm" 
                                                                    : "bg-black/40 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                                                            )}
                                                        >
                                                            {tier.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Search + Quick Add Custom / Test Recipient */}
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                            <div className="md:col-span-5 relative">
                                                <SearchIcon className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    placeholder="Search recipients by name, company or email..."
                                                    value={audienceSearch}
                                                    onChange={e => setAudienceSearch(e.target.value)}
                                                    className="w-full bg-black/60 border border-gray-800 pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-gray-600 rounded-lg focus:outline-none focus:border-rhive-pink"
                                                />
                                            </div>
                                            <div className="md:col-span-7 flex items-center gap-1.5">
                                                <input
                                                    type="text"
                                                    placeholder="Name (optional)"
                                                    value={customRecipientName}
                                                    onChange={e => setCustomRecipientName(e.target.value)}
                                                    className="w-32 bg-black/60 border border-gray-800 px-2.5 py-1.5 text-xs font-mono text-white placeholder-gray-600 rounded-lg focus:outline-none focus:border-rhive-pink"
                                                />
                                                <input
                                                    type="email"
                                                    placeholder="Add test / custom email (e.g. you@rhiveconstruction.com)..."
                                                    value={customRecipientEmail}
                                                    onChange={e => setCustomRecipientEmail(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleAddCustomRecipient();
                                                        }
                                                    }}
                                                    className="flex-1 bg-black/60 border border-gray-800 px-2.5 py-1.5 text-xs font-mono text-white placeholder-gray-600 rounded-lg focus:outline-none focus:border-rhive-pink"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddCustomRecipient}
                                                    className="px-3 py-1.5 rounded-lg bg-rhive-pink/20 border border-rhive-pink/40 text-rhive-pink hover:bg-rhive-pink hover:text-white text-xs font-mono font-bold transition-all shrink-0"
                                                >
                                                    + Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* Recipient Rows List (NO CHECKBOXES - Uses custom Switch Toggles) */}
                                        <div className="border border-gray-800/80 rounded-lg max-h-56 overflow-y-auto divide-y divide-gray-800/50 bg-black/30">
                                            {filteredRecipients.length === 0 ? (
                                                <div className="p-6 text-center text-gray-500 font-mono text-xs">
                                                    No recipients match the selected stage and tier filters.
                                                </div>
                                            ) : (
                                                filteredRecipients.map(r => {
                                                    const isSelected = selectedRecipientEmails.has(r.email);
                                                    return (
                                                        <div 
                                                            key={r.email}
                                                            className={cn(
                                                                "p-2.5 flex items-center justify-between gap-3 text-xs font-mono transition-colors",
                                                                isSelected ? "bg-rhive-pink/5" : "hover:bg-gray-900/30"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-3 truncate">
                                                                {/* Quantum Switch Component (NO HTML CHECKBOX) */}
                                                                <button
                                                                    type="button"
                                                                    role="switch"
                                                                    aria-checked={isSelected}
                                                                    onClick={() => toggleRecipient(r.email)}
                                                                    className={cn(
                                                                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                                                        isSelected ? "bg-rhive-pink shadow-[0_0_8px_rgba(236,2,139,0.5)]" : "bg-gray-800"
                                                                    )}
                                                                >
                                                                    <span
                                                                        className={cn(
                                                                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                                                            isSelected ? "translate-x-4" : "translate-x-0"
                                                                        )}
                                                                    />
                                                                </button>

                                                                <div className="truncate">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-bold text-white truncate font-sans text-sm">
                                                                            {r.name}
                                                                        </span>
                                                                        <span className="text-gray-400 font-mono text-[11px] truncate">
                                                                            &lt;{r.email}&gt;
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-[11px] text-gray-400 truncate flex items-center gap-2 mt-0.5">
                                                                        <span className="text-gray-300">🏢 {r.client_name}</span>
                                                                        {r.campus_name && <span className="text-gray-500">• {r.campus_name}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <span className={cn(
                                                                    "px-2 py-0.5 rounded text-[10px] font-bold border",
                                                                    r.tier === 'Commercial' ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                                                                    r.tier === 'Government' ? "bg-purple-500/10 text-purple-400 border-purple-500/30" :
                                                                    "bg-green-500/10 text-green-400 border-green-500/30"
                                                                )}>
                                                                    {r.tier}
                                                                </span>
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-900 border border-gray-700 text-gray-300">
                                                                    {r.stage}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* 3. CAMPAIGN EDITOR & LIVE BRANDED PREVIEW (2 COLUMNS) */}
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                        {/* Left 6 cols: Inputs */}
                                        <div className="lg:col-span-6 bg-gray-950/80 border border-gray-800/80 rounded-lg p-4 space-y-4">
                                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2">
                                                <label className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                                                    3. Campaign Message & Personalization
                                                </label>
                                                {/* Plain Text vs Raw HTML Mode Toggle */}
                                                <div className="flex items-center bg-black/70 border border-gray-800 rounded-lg p-0.5 font-mono text-[11px]">
                                                    <button
                                                        type="button"
                                                        data-body-mode="text"
                                                        onClick={() => setCampaignBodyMode('text')}
                                                        className={cn(
                                                            "px-2.5 py-1 rounded font-bold transition-all",
                                                            campaignBodyMode === 'text'
                                                                ? "bg-rhive-pink text-white shadow-sm"
                                                                : "text-gray-400 hover:text-white"
                                                        )}
                                                    >
                                                        Plain Text
                                                    </button>
                                                    <button
                                                        type="button"
                                                        data-body-mode="html"
                                                        onClick={() => setCampaignBodyMode('html')}
                                                        className={cn(
                                                            "px-2.5 py-1 rounded font-bold transition-all",
                                                            campaignBodyMode === 'html'
                                                                ? "bg-rhive-pink text-white shadow-sm"
                                                                : "text-gray-400 hover:text-white"
                                                        )}
                                                    >
                                                        &lt;/&gt; Raw HTML
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Internal Campaign Name */}
                                            <div>
                                                <label className="block text-[11px] font-mono text-gray-400 mb-1">
                                                    Internal Campaign Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={campaignName}
                                                    onChange={e => setCampaignName(e.target.value)}
                                                    placeholder="e.g. Q1 2026 Commercial CapEx Outreach"
                                                    className="w-full bg-black/60 border border-gray-800 px-3 py-1.5 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-rhive-pink"
                                                />
                                            </div>

                                            {/* Subject Line & Quick Tag Helpers */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="text-[11px] font-mono text-gray-400">
                                                        Email Subject Line
                                                    </label>
                                                    <div className="flex items-center gap-1">
                                                        {['{{first_name}}', '{{client_name}}'].map(tok => (
                                                            <button
                                                                key={tok}
                                                                type="button"
                                                                onClick={() => handleInsertToken(tok, 'subject')}
                                                                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-900 text-rhive-pink hover:bg-gray-800 border border-gray-800 transition-colors"
                                                            >
                                                                + {tok}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={campaignSubject}
                                                    onChange={e => setCampaignSubject(e.target.value)}
                                                    placeholder="Email Subject with merge tags..."
                                                    className="w-full bg-black/60 border border-gray-800 px-3 py-1.5 text-xs font-mono text-white rounded-lg focus:outline-none focus:border-rhive-pink"
                                                />
                                            </div>

                                            {/* Email Body & Merge Tags */}
                                            <div>
                                                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                                                    <label className="text-[11px] font-mono text-gray-400">
                                                        {campaignBodyMode === 'html'
                                                            ? 'Raw HTML Email Source (Paste Full HTML)'
                                                            : 'Email Body (Plain Text — or paste full HTML)'}
                                                    </label>
                                                    <div className="flex items-center gap-1">
                                                        {campaignBodyMode === 'html' && (
                                                            <button
                                                                type="button"
                                                                onClick={handleLoadSampleHtml}
                                                                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rhive-pink/15 text-rhive-pink hover:bg-rhive-pink/25 border border-rhive-pink/30 transition-colors"
                                                            >
                                                                Load Sample HTML
                                                            </button>
                                                        )}
                                                        {['{{first_name}}', '{{client_name}}', '{{campus_name}}'].map(tok => (
                                                            <button
                                                                key={tok}
                                                                type="button"
                                                                onClick={() => handleInsertToken(tok, 'body')}
                                                                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-900 text-rhive-gold hover:bg-gray-800 border border-gray-800 transition-colors"
                                                            >
                                                                + {tok}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea
                                                    rows={campaignBodyMode === 'html' ? 12 : 9}
                                                    spellCheck={campaignBodyMode !== 'html'}
                                                    value={campaignBody}
                                                    onChange={e => handleCampaignBodyChange(e.target.value)}
                                                    placeholder={
                                                        campaignBodyMode === 'html'
                                                            ? 'Paste your complete HTML email code here (e.g. <!DOCTYPE html><html>...</html>). Merge tags like {{first_name}} still work!'
                                                            : 'Compose email content with {{first_name}}, {{client_name}}, and {{campus_name}} — or paste full HTML directly...'
                                                    }
                                                    className="w-full bg-black/60 border border-gray-800 p-3 text-xs font-mono text-white placeholder-gray-600 rounded-lg focus:outline-none focus:border-rhive-pink resize-none leading-relaxed"
                                                />
                                                {campaignBodyMode === 'html' && (
                                                    <p className="mt-1.5 text-[10px] font-mono text-gray-500">
                                                        Sent as your exact HTML (no wrapper added). Plain-text fallback is auto-generated for email clients.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right 6 cols: Live Branded HTML Email Preview */}
                                        <div className="lg:col-span-6 bg-gray-950/80 border border-gray-800/80 rounded-lg p-4 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
                                                    <label className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                                        <MailIcon className="w-4 h-4 text-rhive-pink" />
                                                        Live Recipient Inbox Preview
                                                    </label>
                                                    <div className="flex items-center gap-1.5">
                                                        {campaignBodyMode === 'html' && (
                                                            <span className="text-[10px] font-mono text-rhive-pink bg-rhive-pink/10 px-2 py-0.5 rounded border border-rhive-pink/30 font-bold">
                                                                HTML Render
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/30">
                                                            Previewing: {previewRecipient.name}
                                                        </span>
                                                    </div>
                                                </div>

                                                {campaignBodyMode === 'html' ? (
                                                    <div className="bg-[#050505] border border-gray-800 rounded-lg p-3 space-y-2.5 shadow-xl">
                                                        <div className="space-y-1">
                                                            <div className="text-[10px] font-mono text-gray-400">
                                                                To: <strong className="text-white">{previewRecipient.name}</strong> &lt;{previewRecipient.email}&gt;
                                                            </div>
                                                            <div className="text-xs font-bold text-white bg-gray-900/60 px-2.5 py-1.5 rounded border border-gray-800 font-sans">
                                                                {previewSubject || 'No Subject'}
                                                            </div>
                                                        </div>
                                                        <iframe
                                                            title="HTML Email Live Preview"
                                                            sandbox=""
                                                            srcDoc={previewBody}
                                                            className="w-full h-[360px] bg-white rounded-md border border-gray-800"
                                                        />
                                                    </div>
                                                ) : (
                                                    /* Branded Email Container Shell */
                                                    <div className="bg-[#050505] border border-gray-800 rounded-lg p-4 font-sans text-xs text-gray-200 space-y-3.5 shadow-xl">
                                                        {/* Header bar */}
                                                        <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-rhive-pink font-black tracking-widest text-sm">
                                                                    RHIVE
                                                                </span>
                                                                <span className="text-[10px] font-mono text-gray-400">
                                                                    CONSTRUCTION
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] font-mono text-gray-500">
                                                                Official Client Notification
                                                            </span>
                                                        </div>

                                                        {/* Subject & Header info */}
                                                        <div>
                                                            <div className="text-[10px] font-mono text-gray-400 mb-1">
                                                                To: <strong className="text-white">{previewRecipient.name}</strong> &lt;{previewRecipient.email}&gt;
                                                            </div>
                                                            <div className="text-xs font-bold text-white bg-gray-900/60 p-2 rounded border border-gray-800 font-sans">
                                                                {previewSubject || 'No Subject'}
                                                            </div>
                                                        </div>

                                                        {/* Body with merged tokens */}
                                                        <div className="bg-black/40 border border-gray-900 p-3 rounded text-gray-300 font-sans leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto text-[11px]">
                                                            {previewBody}
                                                        </div>

                                                        {/* Call to action button */}
                                                        <div className="text-center pt-1">
                                                            <span className="inline-block bg-rhive-pink text-white font-bold px-4 py-2 rounded text-xs tracking-wider uppercase shadow-pink-glow-sm">
                                                                VIEW PROJECT PORTAL →
                                                            </span>
                                                        </div>

                                                        {/* Official Footer */}
                                                        <div className="pt-2 border-t border-gray-900 text-[10px] font-mono text-gray-500 text-center leading-normal">
                                                            RHIVE Construction • Official Communications • Salt Lake City, Utah<br/>
                                                            Phone: (435) 417-6637 • Email: support@rhiveconstruction.com
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Dispatch Button Bar */}
                                            <div className="pt-4 mt-4 border-t border-gray-800 flex items-center justify-between">
                                                <div className="text-xs font-mono text-gray-400">
                                                    Ready to deliver to <strong className="text-white">{activeSelectedRecipients.length}</strong> recipients
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    size="md"
                                                    disabled={isDispatching || activeSelectedRecipients.length === 0}
                                                    onClick={handleDispatchCampaign}
                                                    className="flex items-center gap-2 px-6 font-mono font-bold"
                                                >
                                                    <PaperAirplaneIcon className="w-4 h-4" />
                                                    {isDispatching ? 'Sending...' : 'Send Campaign'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* 4. PAST CAMPAIGNS LOG VIEW */
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                                        <div>
                                            <h4 className="text-sm font-bold text-white font-sans">
                                                Dispatched Campaigns History
                                            </h4>
                                            <p className="text-xs text-gray-400 font-mono">
                                                Audit trail of batch email operations, recipient metrics, and timestamps
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setCampaignSubView('compose')}
                                            className="font-mono text-xs"
                                        >
                                            + Create New Campaign
                                        </Button>
                                    </div>

                                    {pastCampaigns.length === 0 ? (
                                        <div className="p-12 text-center text-gray-500 font-mono text-xs border border-gray-800 rounded-lg">
                                            <MegaphoneIcon className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-600" />
                                            No past campaigns recorded yet. Launch your first batch campaign above!
                                        </div>
                                    ) : (
                                        <div className="border border-gray-800 rounded-lg divide-y divide-gray-800 bg-black/40 overflow-hidden">
                                            {pastCampaigns.map(camp => (
                                                <div key={camp.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-bold text-white font-sans">
                                                                {camp.title || 'Email Campaign'}
                                                            </span>
                                                            {camp.is_html && (
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rhive-pink/15 text-rhive-pink border border-rhive-pink/30">
                                                                    HTML
                                                                </span>
                                                            )}
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/30">
                                                                {camp.status || 'Completed'}
                                                            </span>
                                                        </div>
                                                        <div className="text-gray-400 line-clamp-1 mb-1">
                                                            Subject: <strong className="text-gray-200">{camp.subject}</strong>
                                                        </div>
                                                        <div className="text-[11px] text-gray-500 flex items-center gap-3">
                                                            <span>Sent by: <strong className="text-gray-300">{camp.sender_name || 'Kara'}</strong></span>
                                                            <span>•</span>
                                                            <span>Dispatched: {camp.sent_at ? new Date(camp.sent_at).toLocaleString() : 'Recent'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <span className="px-3 py-1 rounded bg-rhive-pink/15 text-rhive-pink font-bold border border-rhive-pink/30 text-xs">
                                                            {camp.recipient_count || 0} Recipients
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (camp.subject) setCampaignSubject(camp.subject);
                                                                if (camp.body) setCampaignBody(camp.body);
                                                                if (camp.title) setCampaignName(`Copy of ${camp.title}`);
                                                                setCampaignBodyMode(camp.is_html ? 'html' : 'text');
                                                                setCampaignSubView('compose');
                                                            }}
                                                            className="px-2.5 py-1 rounded bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 text-xs font-bold transition-all"
                                                        >
                                                            Reuse Copy
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
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
                                                        {msg.folder === 'sent'
                                                            ? `To: ${msg.recipientName || msg.recipientEmail || msg.senderName}`
                                                            : msg.senderName}
                                                    </span>
                                                </div>

                                                <span className="text-[10px] font-mono text-gray-500 shrink-0">
                                                    {msg.timestamp}
                                                </span>
                                            </div>

                                            {/* Recipient email when viewing Sent */}
                                            {msg.folder === 'sent' && msg.recipientEmail && (
                                                <div className="text-[10px] font-mono text-gray-400 truncate mb-0.5">
                                                    ✉️ {msg.recipientEmail}
                                                </div>
                                            )}

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
                    </>
                    )}
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

            {/* ── PER-USER CONNECT EMAIL MODAL ─────────────────────────────────── */}
            {isConnectEmailOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-950 border border-gray-700 rounded-xl w-full max-w-xl p-5 shadow-2xl relative space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <MailIcon className="w-5 h-5 text-rhive-pink" />
                                    Email Connection Settings
                                </h3>
                                <p className="text-[11px] font-mono text-gray-400">
                                    Account: {currentUser?.name || 'Admin'} ({currentUser?.email || 'Org User'})
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsConnectEmailOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <ConnectEmailCard
                            userId={currentUser?.id || 'U-ADMIN-DEFAULT'}
                            userEmail={currentUser?.email}
                            compact
                        />

                        <div className="flex justify-end pt-1">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => setIsConnectEmailOpen(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default InboxPage;

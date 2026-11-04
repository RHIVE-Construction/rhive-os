import React, { useState, useEffect } from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import FollowUpModal from '../components/FollowUpModal';
import { ClockIcon, CalendarIcon, PlusIcon, MegaphoneIcon, CheckCircleIcon } from '../components/icons';
import { projectService, userLogService } from '../lib/firebaseService';
import { useNavigation } from '../contexts/NavigationContext';
import { getStagePageId, cn } from '../lib/utils';

const PastCustomerContent: React.FC<{ project: any }> = ({ project }) => {
    const { setActivePageId, setSelectedProjectId } = useNavigation();
    const [siblingProjects, setSiblingProjects] = useState<any[]>([]);
    const [showFollowUp, setShowFollowUp] = useState(false);
    const [banner, setBanner] = useState('');
    const [enrolled, setEnrolled] = useState<boolean>(!!project?.abundance_network?.enrolled);
    const [referralsCount, setReferralsCount] = useState<number>(Number(project?.abundance_network?.referralsCount || 0));

    useEffect(() => {
        setEnrolled(!!project?.abundance_network?.enrolled);
        setReferralsCount(Number(project?.abundance_network?.referralsCount || 0));
    }, [project?.id]);

    useEffect(() => {
        const unsub = projectService.subscribe((all) => {
            const related = all.filter((p) => {
                if (p.id === project.id) return true;
                if (project.account_id && p.account_id === project.account_id) return true;
                if (project.property_id && p.property_id === project.property_id) return true;
                if (project.property_address && p.property_address && p.property_address === project.property_address) return true;
                return false;
            });
            setSiblingProjects(related);
        });
        return () => unsub();
    }, [project?.id, project?.account_id, project?.property_id, project?.property_address]);

    const referralSlug = (project?.name || 'rhive-vip')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 20);
    const referralCode = project?.abundance_network?.referralCode || `RHIVE-${referralSlug.toUpperCase()}`;

    const handleSendReferralInvite = async () => {
        if (!project?.id) return;
        const nextAbundance = {
            enrolled: true,
            referralCode,
            referralsCount,
            rewardPerRoof: 500,
            reviewRequestedAt: new Date().toISOString(),
        };
        setEnrolled(true);
        await projectService.updateRecord(
            project.id,
            { abundance_network: nextAbundance },
            project._source
        );
        await userLogService.logAction(
            'EDIT_RECORD',
            `Enrolled ${project.name || 'Customer'} in Abundance Network ($500 Referral & Review Invite)`,
            {
                recordId: project.id,
                recordName: project.name || 'Project',
                collection: project._source || 'projects',
                stage: 'Past Customer',
                changes: ['abundance_network'],
            }
        );
        setBanner(`Abundance Network active (${referralCode}) — $500 referral & review invite logged.`);
    };

    const handleCreateRepeatProject = () => {
        try {
            sessionStorage.setItem(
                'rhive_prefill_intake',
                JSON.stringify({
                    accountId: project.account_id || '',
                    propertyId: project.property_id || '',
                    address: project.property_address || '',
                    customerName: project.contact_name || project.name || '',
                    email: project.contact_email || project.contact?.email || '',
                    phone: project.contact_phone || project.contact?.phone || '',
                })
            );
        } catch {
            // sessionStorage unavailable
        }
        setActivePageId('E-02a');
    };

    const historyList = siblingProjects.length > 0 ? siblingProjects : [project];

    return (
        <div className="p-6 md:p-8 space-y-6">
            {showFollowUp && (
                <FollowUpModal
                    project={project}
                    onClose={() => setShowFollowUp(false)}
                    onSaved={() => {
                        setShowFollowUp(false);
                        setBanner('Annual Roof Maintenance Inspection scheduled.');
                    }}
                />
            )}

            {banner && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 flex-none" />
                    <span>{banner}</span>
                </div>
            )}

            <Card title={`Lifetime Account & Warranty History — ${project.name}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card title={`Account Projects (${historyList.length})`} className="shadow-none border border-gray-800 bg-gray-900/40">
                            <ul className="space-y-3">
                                {historyList.map((item) => (
                                    <li
                                        key={item.id}
                                        onClick={() => {
                                            setSelectedProjectId(item.id);
                                            setActivePageId(getStagePageId(item.current_stage || 'Past Customer'));
                                        }}
                                        className={cn(
                                            'flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                                            item.id === project.id
                                                ? 'border-[#ec028b] bg-[#ec028b]/10 shadow-[0_0_15px_rgba(236,2,139,0.15)]'
                                                : 'bg-black/50 border-gray-800 hover:border-[#ec028b]/40'
                                        )}
                                    >
                                        <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-none" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-white text-sm truncate">
                                                {item.name || item.project_type || 'Roofing Project'}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                                {item.property_address || 'Verified Property'}
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">
                                                {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Completed'}
                                            </p>
                                        </div>
                                        <div className="ml-auto text-right self-center shrink-0">
                                            <p className="text-[#ec028b] font-mono text-sm font-bold">
                                                ${Number(item.quote?.total || 15000).toLocaleString()}
                                            </p>
                                            <p className="text-[9px] uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1 border border-emerald-500/30">
                                                {item.current_stage || 'Past Customer'}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card title="RHIVE Abundance Network ($500 Referral & Fundraising)">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/50 border border-gray-800 mb-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Partner Code</p>
                                    <p className="text-lg font-mono font-bold text-[#ec028b] mt-0.5">{referralCode}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {enrolled
                                            ? `Enrolled in Client Portal · ${referralsCount} Referrals Logged ($500/completed roof)`
                                            : 'Enroll client to unlock $500 roof referral rewards & charity fundraising tracking in their portal.'}
                                    </p>
                                </div>
                                <span className={cn(
                                    'text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border shrink-0 self-start sm:self-center',
                                    enrolled
                                        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                                        : 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                                )}>
                                    {enrolled ? 'Enrolled' : 'Not Enrolled'}
                                </span>
                            </div>

                            <Button
                                id="past-send-referral-btn"
                                onClick={handleSendReferralInvite}
                                className="w-full flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(236,2,139,0.15)]"
                            >
                                <MegaphoneIcon className="w-4 h-4" />
                                <span>Send Referral & Review Invite</span>
                            </Button>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card title="Relationship & Lifetime Care" className="bg-gradient-to-br from-black to-gray-900 border border-gray-800">
                            <div className="space-y-3">
                                <Button
                                    id="past-create-project-btn"
                                    variant="secondary"
                                    onClick={handleCreateRepeatProject}
                                    className="w-full flex items-center gap-2 justify-center"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    <span>Create New Project</span>
                                </Button>
                                <Button
                                    id="past-schedule-inspection-btn"
                                    variant="secondary"
                                    onClick={() => setShowFollowUp(true)}
                                    className="w-full flex items-center gap-2 justify-center"
                                >
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>Schedule Annual Inspection</span>
                                </Button>

                                <div className="p-4 border border-dashed border-gray-700 bg-black/40 rounded-lg mt-4 text-center">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">
                                        Warranty Care Cycle
                                    </p>
                                    <p className="text-white text-sm font-bold">
                                        Annual Envelope & Gutter Check
                                    </p>
                                    <p className="text-[#ec028b] text-xs font-mono mt-2">
                                        Active RHIVE Protection
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const PastCustomerPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Past Customer" stagePageId="E-37">
        {(project) => <PastCustomerContent project={project} />}
    </ProjectStageLayout>
);

export default PastCustomerPage;

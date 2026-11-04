
import React, { useState } from 'react';
import CollapsibleSection from '../components/CollapsibleSection';
import Button from '../components/Button';
import { PAGE_GROUPS } from '../constants';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { RhiveLogo } from '../components/icons';

const QuoteBuilderToolPage: React.FC = () => {
    const { currentProjectId, getProject, saveQuote } = useMockDB();
    const project = currentProjectId ? getProject(currentProjectId) : null;

    const [activeTab, setActiveTab] = useState('Project Details');
    const [quoteTotal, setQuoteTotal] = useState(14500);
    
    const handleSendQuote = () => {
        if (project) {
            saveQuote(project._id, quoteTotal, [
                { name: 'Materials', cost: 8500 }, 
                { name: 'Labor', cost: 4000 },
                { name: 'Overhead', cost: 2000 }
            ]);
            alert(`Quote sent to portal for ${project.name}. Now log in as Customer to approve.`);
        }
    };

    if (!project) {
        return <div className="p-10 text-white">Please select a project from Global Search first.</div>;
    }

    return (
        <div className="flex h-full text-gray-200">
            {/* Left Sidebar */}
            <aside className="w-64 bg-black/60 flex-shrink-0 p-4 border-r border-gray-800 backdrop-blur-md flex flex-col">
                <div className="flex items-center mb-6">
                     <RhiveLogo className="h-8 w-auto mr-3" />
                     <h2 className="text-xl font-bold text-white">Quote Builder</h2>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
                    <h3 className="text-sm font-bold text-white mb-1">Active Project</h3>
                    <p className="text-xs text-[#ec028b] break-words">{project.name}</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                 <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Build Quote: {project.name}</h1>
                        <p className="text-sm text-gray-400">Stage: <span className="text-[#ec028b] font-bold">{project.current_stage}</span></p>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <CollapsibleSection title="Line Items" isOpen={true}>
                        <div className="space-y-4">
                            <div className="flex justify-between p-3 bg-gray-800/50 rounded">
                                <span>Asphalt Shingles (Owens Corning)</span>
                                <span className="font-mono">$8,500.00</span>
                            </div>
                             <div className="flex justify-between p-3 bg-gray-800/50 rounded">
                                <span>Labor (Tear off & Install)</span>
                                <span className="font-mono">$4,000.00</span>
                            </div>
                             <div className="flex justify-between p-3 bg-gray-800/50 rounded">
                                <span>Project Management & Overhead</span>
                                <span className="font-mono">$2,000.00</span>
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>

                 <footer className="flex items-center justify-between p-4 border-t border-gray-800 bg-black/80 backdrop-blur-md flex-shrink-0">
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Total Project Value</p>
                        <p className="text-2xl font-bold text-white">${quoteTotal.toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-3">
                         <Button variant="secondary">Save Draft</Button>
                         <Button onClick={handleSendQuote}>Publish to Customer Portal</Button>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default QuoteBuilderToolPage;

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

interface PageContainerProps {
    title: string;
    description: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, description, children, headerAction }) => {
    return (
        <div className="p-6 md:p-10 h-full overflow-y-auto animate-fade-in relative bg-[var(--rhive-bg)] transition-colors duration-500">
            <header className="mb-8 pb-4 border-b border-[var(--rhive-border)] flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-[var(--rhive-text)] uppercase font-display italic transition-colors duration-500">{title}</h1>
                    <p className="mt-2 max-w-3xl text-[var(--rhive-text-muted)] font-serif italic transition-colors duration-500">{description}</p>
                </div>
                {headerAction && (
                    <div className="flex-shrink-0">
                        {headerAction}
                    </div>
                )}
            </header>
            <div className="space-y-6 pb-10">
                {children}
            </div>
        </div>
    );
};

export default PageContainer;
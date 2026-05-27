import React from 'react';

interface StatusBadgeProps {
  status: 'on-file' | 'expired' | 'not-requested' | 'pending' | 'new' | 'in-progress';
}

const statusStyles: Record<StatusBadgeProps['status'], string> = {
    'on-file': 'bg-green-500/20 text-green-300 border-green-500/30',
    'expired': 'bg-red-500/20 text-red-300 border-red-500/30',
    'not-requested': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    'pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'new': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    'in-progress': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
};

const statusText: Record<StatusBadgeProps['status'], string> = {
    'on-file': 'On File',
    'expired': 'Expired',
    'not-requested': 'Not Requested',
    'pending': 'Pending',
    'new': 'New',
    'in-progress': 'In Progress'
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`px-3 py-1 text-base font-semibold rounded-full border ${statusStyles[status]}`}>
      {statusText[status]}
    </span>
  );
};

export default StatusBadge;
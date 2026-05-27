import React from 'react';
import { HailIcon, WindIcon, SnowflakeIcon, CloudArrowUpIcon } from './icons';
import { cn } from '../lib/utils';

// Mock data, to be replaced by real API data in the future
// Updated with time information as requested by the user
const mockEvents = [
  { date: '2023-08-15', time: '2:34 PM', intensity: 'Heavy', type: 'Hail (1.75")', location: 'Direct Hit', icon: HailIcon },
  { date: '2023-06-22', time: '11:12 AM', intensity: 'Moderate', type: 'Wind (65 mph)', location: '0.2 miles', icon: WindIcon },
  { date: '2021-07-03', time: '5:45 PM', intensity: 'Severe', type: 'Hail (2.5")', location: 'Direct Hit', icon: HailIcon },
];

interface WeatherReportProps {
    onDateSelect?: (date: string) => void;
}

export const WeatherReport: React.FC<WeatherReportProps> = ({ onDateSelect }) => {
  return (
    <div className="bg-black/40 border border-gray-800 rounded-[20px] overflow-hidden backdrop-blur-md shadow-2xl">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/40">
        <h3 className="text-base font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
          <CloudArrowUpIcon className="w-4 h-4" color="url(#blue-white-grad)" />
          Verified Storm History Feed
        </h3>
        <span className="text-base text-gray-500 font-bold uppercase tracking-tight">DATA SOURCE: NWS / NOAA</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-base">
          <thead className="bg-black/60 text-gray-400 font-black uppercase tracking-tighter border-b border-gray-800">
            <tr>
              <th className="px-5 py-4">Date & Time</th>
              <th className="px-5 py-4">Event Type</th>
              <th className="px-5 py-4">Intensity</th>
              <th className="px-5 py-4">Location</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {mockEvents.map((event, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors group">
                <td className="px-5 py-5">
                    <div className="flex flex-col">
                        <span className="text-white font-mono font-bold tracking-tight text-base">
                            {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-base text-gray-500 font-black uppercase mt-0.5 tracking-widest">{event.time} MST</span>
                    </div>
                </td>
                <td className="px-5 py-5">
                    <div className="flex items-center gap-2">
                        <event.icon className={cn("w-4 h-4", event.type.includes('Hail') ? "text-pink-400" : "text-yellow-400")} />
                        <span className={cn(
                            "px-2 py-0.5 rounded-sm text-base font-black uppercase tracking-widest border",
                            event.type.includes('Hail') ? "bg-pink-500/10 text-pink-400 border-pink-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        )}>
                            {event.type}
                        </span>
                    </div>
                </td>
                <td className="px-5 py-5 text-gray-300 font-bold uppercase tracking-tighter">{event.intensity}</td>
                <td className="px-5 py-5">
                    <span className="text-gray-500 font-black text-base uppercase tracking-widest">{event.location}</span>
                </td>
                <td className="px-5 py-5 text-right">
                  <button
                    type="button"
                    onClick={() => onDateSelect?.(event.date)}
                    className="text-base font-black text-[#ec028b] uppercase tracking-[0.2em] border border-[#ec028b]/30 px-4 py-2 rounded-lg hover:bg-[#ec028b] hover:text-white transition-all shadow-xl shadow-pink-500/10"
                    style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                  >
                    SELECT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-black/60 border-t border-gray-800 flex items-center justify-center">
        <p className="text-base text-gray-600 font-black uppercase tracking-[0.15em] italic">Precision Weather Verification System: RHIVE-OS V1.0</p>
      </div>
    </div>
  );
};

import React from 'react';
import { Lap } from '../types';

interface LapListProps {
  laps: Lap[];
}

const LapList: React.FC<LapListProps> = ({ laps }) => {
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  if (laps.length === 0) return null;

  return (
    <div className="w-full max-w-md mt-8 bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
      <div className="bg-gray-800 px-4 py-3 flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <span>Lap No.</span>
        <span>Split</span>
        <span>Total</span>
      </div>
      <div className="max-h-64 overflow-y-auto divide-y divide-gray-800">
        {[...laps].reverse().map((lap, index) => {
          // Calculate actual index based on reverse mapping or just use lap.id
          const isFastest = false; // Could implement stats
          const isSlowest = false; 

          return (
            <div key={lap.id} className="flex justify-between px-4 py-3 text-sm hover:bg-gray-800/50 transition-colors">
              <span className="text-gray-500 font-mono w-16">#{lap.id}</span>
              <span className={`font-mono w-24 ${isFastest ? 'text-green-400' : isSlowest ? 'text-red-400' : 'text-gray-300'}`}>
                {formatTime(lap.split)}
              </span>
              <span className="font-mono text-gray-100 w-24 text-right">
                {formatTime(lap.time)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LapList;
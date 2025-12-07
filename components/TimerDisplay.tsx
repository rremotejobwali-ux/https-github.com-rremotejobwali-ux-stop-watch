import React from 'react';

interface TimerDisplayProps {
  timeMs: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeMs }) => {
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10); // Display 2 digits

    const pad = (n: number) => n.toString().padStart(2, '0');

    return {
      min: pad(minutes),
      sec: pad(seconds),
      ms: pad(milliseconds)
    };
  };

  const { min, sec, ms } = formatTime(timeMs);

  return (
    <div className="flex items-baseline justify-center font-mono select-none text-white tracking-tighter">
      <div className="flex flex-col items-center">
        <span className="text-6xl md:text-8xl font-bold">{min}</span>
        <span className="text-xs text-gray-500 uppercase mt-2">Min</span>
      </div>
      <span className="text-6xl md:text-8xl font-thin text-gray-600 mx-2 -mt-4">:</span>
      <div className="flex flex-col items-center">
        <span className="text-6xl md:text-8xl font-bold">{sec}</span>
        <span className="text-xs text-gray-500 uppercase mt-2">Sec</span>
      </div>
      <span className="text-6xl md:text-8xl font-thin text-gray-600 mx-2 -mt-4">.</span>
      <div className="flex flex-col items-center">
        <span className="text-6xl md:text-8xl font-bold text-blue-400">{ms}</span>
        <span className="text-xs text-blue-400/70 uppercase mt-2">Ms</span>
      </div>
    </div>
  );
};

export default TimerDisplay;
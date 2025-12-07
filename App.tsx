import React, { useState, useEffect, useRef, useCallback } from 'react';
import TimerDisplay from './components/TimerDisplay';
import Button from './components/Button';
import LapList from './components/LapList';
import { Lap } from './types';
import { generateDurationFact } from './services/geminiService';

const App: React.FC = () => {
  // Timer State
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  // AI State
  const [aiFact, setAiFact] = useState<string | null>(null);
  const [isLoadingFact, setIsLoadingFact] = useState<boolean>(false);

  // Refs for accurate timing
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  // Handlers
  const startTimer = useCallback(() => {
    setIsRunning(true);
    setAiFact(null); // Clear previous facts when restarting
    startTimeRef.current = Date.now() - time;
    
    intervalRef.current = window.setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
  }, [time]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTime(0);
    setLaps([]);
    setAiFact(null);
  }, []);

  const recordLap = useCallback(() => {
    const newLap: Lap = {
      id: laps.length + 1,
      time: time,
      split: laps.length > 0 ? time - laps[laps.length - 1].time : time,
      timestamp: new Date()
    };
    setLaps((prev) => [...prev, newLap]);
  }, [laps, time]);

  const handleGetFact = async () => {
    const seconds = Math.floor(time / 1000);
    if (seconds < 1) return;
    
    setIsLoadingFact(true);
    const fact = await generateDurationFact(seconds);
    setAiFact(fact);
    setIsLoadingFact(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <h1 className="text-xl font-bold tracking-tight text-gray-200">ChronoGen AI</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl flex flex-col items-center z-0 mt-10 md:mt-0">
        
        {/* Timer Container */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
          <TimerDisplay timeMs={time} />
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8 w-full max-w-sm justify-center">
          {!isRunning ? (
             // Start / Resume
            <Button onClick={startTimer} variant="primary" className="flex-1">
              {time === 0 ? 'Start' : 'Resume'}
            </Button>
          ) : (
            // Stop / Lap
            <>
              <Button onClick={stopTimer} variant="secondary" className="flex-1 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 text-red-200">
                Stop
              </Button>
              <Button onClick={recordLap} variant="secondary" className="flex-1">
                Lap
              </Button>
            </>
          )}

          {/* Reset (only visible if stopped and has time) */}
          {!isRunning && time > 0 && (
            <Button onClick={resetTimer} variant="danger">
              Reset
            </Button>
          )}
        </div>

        {/* AI Insight Section - Visible when stopped and duration > 1s */}
        {!isRunning && time > 1000 && (
          <div className="w-full max-w-md mb-8 animate-fade-in-up">
            {!aiFact ? (
              <Button 
                onClick={handleGetFact} 
                variant="ghost" 
                fullWidth 
                disabled={isLoadingFact}
                className="border border-blue-500/20 text-blue-300 hover:bg-blue-500/10"
              >
                {isLoadingFact ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Insight...
                  </span>
                ) : (
                  "✨ What is significant about this duration?"
                )}
              </Button>
            ) : (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-blue-500/20 shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                 <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">AI Insight</h3>
                 <p className="text-gray-300 leading-relaxed text-sm">
                   {aiFact}
                 </p>
                 <button 
                  onClick={() => setAiFact(null)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-white"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                   </svg>
                 </button>
              </div>
            )}
          </div>
        )}

        {/* Laps List */}
        <LapList laps={laps} />

      </main>
    </div>
  );
};

export default App;
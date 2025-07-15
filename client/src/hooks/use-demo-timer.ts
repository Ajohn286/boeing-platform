import { useState, useEffect, useCallback } from 'react';

interface DemoEvent {
  time: number;
  id: string;
  triggered: boolean;
}

interface DemoTimerHook {
  currentTime: number;
  isEventTriggered: (eventId: string) => boolean;
  registerEvent: (eventId: string, time: number) => void;
  resetTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  isPaused: boolean;
}

// Global state for the demo timer
let globalCurrentTime = 0;
let globalEvents: DemoEvent[] = [];
let globalListeners: ((time: number, events: DemoEvent[]) => void)[] = [];
let globalTimer: NodeJS.Timeout | null = null;
let globalIsPaused = false;

// Start the global timer immediately when the module loads
function startGlobalTimer() {
  if (globalTimer) {
    clearInterval(globalTimer);
  }
  
  globalCurrentTime = 0;
  globalEvents = globalEvents.map(event => ({ ...event, triggered: false }));
  
  globalTimer = setInterval(() => {
    if (globalIsPaused) return;
    
    globalCurrentTime += 1;
    
    // Check and trigger events
    globalEvents.forEach(event => {
      if (globalCurrentTime >= event.time && !event.triggered) {
        event.triggered = true;
        console.log(`Demo event triggered: ${event.id} at ${globalCurrentTime}s`);
      }
    });
    
    // Notify all listeners
    globalListeners.forEach(listener => {
      listener(globalCurrentTime, [...globalEvents]);
    });
  }, 1000);
}

// Initialize timer on module load
startGlobalTimer();

export function useDemoTimer(): DemoTimerHook {
  const [currentTime, setCurrentTime] = useState(globalCurrentTime);
  const [events, setEvents] = useState<DemoEvent[]>([...globalEvents]);

  useEffect(() => {
    const listener = (time: number, updatedEvents: DemoEvent[]) => {
      setCurrentTime(time);
      setEvents([...updatedEvents]);
    };

    globalListeners.push(listener);

    return () => {
      const index = globalListeners.indexOf(listener);
      if (index > -1) {
        globalListeners.splice(index, 1);
      }
    };
  }, []);

  const registerEvent = useCallback((eventId: string, time: number) => {
    const existingEvent = globalEvents.find(e => e.id === eventId);
    if (!existingEvent) {
      globalEvents.push({ id: eventId, time, triggered: false });
      console.log(`Demo event registered: ${eventId} at ${time}s`);
    }
  }, []);

  const isEventTriggered = useCallback((eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.triggered : false;
  }, [events]);

  const resetTimer = useCallback(() => {
    console.log('Demo timer reset');
    startGlobalTimer();
  }, []);

  const pauseTimer = useCallback(() => {
    globalIsPaused = true;
    console.log('Demo timer paused');
  }, []);

  const resumeTimer = useCallback(() => {
    globalIsPaused = false;
    console.log('Demo timer resumed');
  }, []);

  return {
    currentTime,
    isEventTriggered,
    registerEvent,
    resetTimer,
    pauseTimer,
    resumeTimer,
    isPaused: globalIsPaused,
  };
}
import { useState } from 'react';

export type SuspectTrackerState = '?' | 'พูดจริง' | 'โกหก';

export function useSuspectTracker() {
  const [trackerState, setTrackerState] = useState<Record<number, SuspectTrackerState>>({});

  const toggleSuspectState = (index: number) => {
    setTrackerState((prev) => {
      const currentState = prev[index] || '?';
      let nextState: SuspectTrackerState = '?';

      if (currentState === '?') {
        nextState = 'พูดจริง';
      } else if (currentState === 'พูดจริง') {
        nextState = 'โกหก';
      } else {
        nextState = '?';
      }

      return { ...prev, [index]: nextState };
    });
  };

  const getSuspectState = (index: number): SuspectTrackerState => {
    return trackerState[index] || '?';
  };

  const resetTracker = () => {
    setTrackerState({});
  }

  return {
    toggleSuspectState,
    getSuspectState,
    resetTracker
  };
}

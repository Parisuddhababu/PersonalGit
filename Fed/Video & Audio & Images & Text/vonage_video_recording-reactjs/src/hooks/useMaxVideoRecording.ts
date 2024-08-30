import { useEffect, useState } from 'react';

const useMaxVideoRecording = () => {
  const [autoSaveVideoCounter, setAutoSaveVideoCounter] = useState(-1);
  const [stopAutoSaveCounter, setStopAutoSaveCounter] =
    useState(false);
  const [initializeRecorderCounter] =
    useState('Wait a moment');

  useEffect(() => {
    if (autoSaveVideoCounter < 0 || stopAutoSaveCounter) {
      setStopAutoSaveCounter(true);
      return;
    }
    if (autoSaveVideoCounter > 0 && !stopAutoSaveCounter) {
      setTimeout(() => setAutoSaveVideoCounter(autoSaveVideoCounter - 1), 1000);
    }
  }, [autoSaveVideoCounter, stopAutoSaveCounter]);

  /**
   * Start Video recording
   */
  const startTimerVideoRec = () => {
    setStopAutoSaveCounter(false);
    setAutoSaveVideoCounter(300);
  };

  return {
    autoSaveVideoCounter,
    initializeRecorderCounter,
    startTimerVideoRec,
    setAutoSaveVideoCounter,
    setStopAutoSaveCounter
  };
};

export default useMaxVideoRecording;

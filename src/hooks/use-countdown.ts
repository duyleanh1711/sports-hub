import { useCallback, useEffect, useState } from "react";

export function useCountdown(duration = 60) {
  const [seconds, setSeconds] = useState(0);

  const start = useCallback(() => {
    setSeconds(duration);
  }, [duration]);

  const reset = useCallback(() => {
    setSeconds(0);
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  return {
    seconds,
    isCounting: seconds > 0,
    start,
    reset,
  };
}

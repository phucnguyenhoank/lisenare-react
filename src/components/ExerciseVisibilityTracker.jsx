import { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";

export default function ExerciseVisibilityTracker({ onView, onSkip }) {
  const { ref: viewRef, inView } = useInView({ threshold: 0 });
  const dwellRef = useRef(0);
  const timerRef = useRef(null);
  const [hasLoggedView, setHasLoggedView] = useState(false);
  const [hasLoggedSkip, setHasLoggedSkip] = useState(false);

  const reset = useCallback(() => {
    setHasLoggedView(false);
    setHasLoggedSkip(false);
    dwellRef.current = 0;
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (inView) {
      setHasLoggedSkip(false);
      const start = Date.now();
      timerRef.current = setInterval(() => {
        dwellRef.current = Date.now() - start;
        if (dwellRef.current >= 3000 && !hasLoggedView) {
          onView();
          setHasLoggedView(true);
        }
      }, 150);
    } else {
      if (!hasLoggedView && dwellRef.current > 0 && !hasLoggedSkip) {
        onSkip(dwellRef.current);
        setHasLoggedSkip(true);
      }
      clearInterval(timerRef.current);
      dwellRef.current = 0;
    }
    return () => clearInterval(timerRef.current);
  }, [inView, hasLoggedView, hasLoggedSkip, onView, onSkip]);

  return { viewRef, dwellRef, reset };
}

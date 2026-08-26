import { useEffect, useRef, useState } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children }) {
  const [refreshing, setRefreshing] = useState(false);
  const [pull, setPull] = useState(0);
  const startY = useRef(0);
  const pulling = useRef(false);
  const dist = useRef(0);
  const refreshingRef = useRef(false);
  const cb = useRef(onRefresh);
  cb.current = onRefresh;

  useEffect(() => {
    const onStart = (e) => {
      if (window.scrollY <= 0 && !refreshingRef.current) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      } else {
        pulling.current = false;
      }
    };
    const onMove = (e) => {
      if (!pulling.current) return;
      const d = e.touches[0].clientY - startY.current;
      if (d > 0) {
        dist.current = Math.min(d * 0.5, 80);
        setPull(dist.current);
      }
    };
    const onEnd = async () => {
      if (pulling.current && dist.current > 60) {
        refreshingRef.current = true;
        setRefreshing(true);
        try { await cb.current(); } finally {
          refreshingRef.current = false;
          setRefreshing(false);
        }
      }
      pulling.current = false;
      dist.current = 0;
      setPull(0);
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  const show = pull > 0 || refreshing;
  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-[60] flex justify-center pointer-events-none transition-opacity duration-150"
        style={{ opacity: show ? 1 : 0, transform: `translateY(${Math.max(pull - 36, refreshing ? 8 : -40)}px)` }}
      >
        <div className="w-9 h-9 rounded-full bg-card border border-border shadow-md flex items-center justify-center">
          {refreshing ? <Loader2 size={18} className="animate-spin text-primary" /> : <ArrowDown size={18} className="text-muted-foreground" />}
        </div>
      </div>
      {children}
    </>
  );
}
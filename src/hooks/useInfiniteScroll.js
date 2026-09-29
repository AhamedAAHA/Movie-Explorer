// Infinite-scroll helper: calls `onLoadMore` when sentinel scrolls into view.
import { useEffect, useRef } from 'react';

export default function useInfiniteScroll(onLoadMore, hasMore, loading) {
  const ref = useRef(null);
  useEffect(() => {
    if (!hasMore || loading) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) onLoadMore(); },
      { rootMargin: '400px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onLoadMore, hasMore, loading]);
  return ref;
}

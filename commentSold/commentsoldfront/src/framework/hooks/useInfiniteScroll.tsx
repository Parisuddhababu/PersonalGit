import { useEffect, useRef } from "react";

const useInfiniteScroll = (callback: () => void) => {
  const lastItemRef = useRef(null);

  const handleIntersection: IntersectionObserverCallback = ([entry]) => {
    if (entry.isIntersecting) {
      callback();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      if (lastItemRef.current) {
        observer.unobserve(lastItemRef.current);
      }
    };
  }, [callback]);

  return { lastItemRef };
};

export default useInfiniteScroll;
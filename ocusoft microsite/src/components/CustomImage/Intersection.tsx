import { useEffect } from "react";

const listenerCallbacks = new WeakMap();

let observer: any;

function handleIntersections(entries: any) {
  entries.forEach((entry: any) => {
    if (listenerCallbacks.has(entry.target)) {
      const cb = listenerCallbacks.get(entry.target);

      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        observer.unobserve(entry.target);
        listenerCallbacks.delete(entry.target);
        cb();
      }
    }
  });
}

function getIntersectionObserver() {
  if (!observer) {
    observer = new IntersectionObserver(handleIntersections, {
      rootMargin: "100px",
      threshold: 0.15,
    });
  }
  return observer;
}

export function useIntersection(elem: any, callback: () => void) {
  useEffect(() => {
    const target = elem.current;
    const observerNew = getIntersectionObserver();
    listenerCallbacks.set(target, callback);
    observerNew.observe(target);

    return () => {
      listenerCallbacks.delete(target);
      observerNew.unobserve(target);
    };
  }, []);
}

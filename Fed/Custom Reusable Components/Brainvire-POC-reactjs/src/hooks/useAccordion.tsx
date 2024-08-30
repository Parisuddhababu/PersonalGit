export const useAccordion = () => {
  const smoothScrollEffect = (scrollTo: number, duration: number): void => {
    const start:number = window.scrollY;
    const distance:number = scrollTo - start;
    const startTime:number = performance.now();

    function scrollStep(timestamp: number): void {
      const currentTime:number = timestamp - startTime;
      const easeInOutCubic:number = Math.pow(currentTime / duration, 3);

      if (currentTime < duration) {
        window.scrollTo(0, start + distance * easeInOutCubic);
        requestAnimationFrame(scrollStep);
      } else {
        window.scrollTo(0, scrollTo);
      }
    }

    requestAnimationFrame(scrollStep);
  };
  return (target: string, TopHight: number):void => {
    const targetElement:HTMLElement = document.getElementById(target);

    if (targetElement) {
      const targetDivRect:DOMRect = targetElement.getBoundingClientRect();
      if (targetDivRect.bottom > window.innerHeight) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      const scrollTop:number = window.scrollY + targetDivRect.top - targetDivRect.height / TopHight;

      smoothScrollEffect(scrollTop, 1000);
    }
  };
};

import { useEffect, useState } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Update isMobile state based on the screen width
      setIsMobile(window.innerWidth <= 1024); // You can adjust the threshold based on your design
    };

    // Initial check on mount
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array to run the effect only on mount and unmount

  return isMobile;
};

export default useIsMobile;

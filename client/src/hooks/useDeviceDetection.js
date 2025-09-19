import { useState, useEffect } from 'react';

const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouch: false,
    screenSize: 'lg',
    orientation: 'portrait'
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Screen size detection
      let screenSize = 'lg';
      if (width < 640) screenSize = 'sm';
      else if (width < 768) screenSize = 'md';
      else if (width < 1024) screenSize = 'lg';
      else screenSize = 'xl';

      // Device type detection
      const isMobile = width < 768 || /mobile|android|iphone|ipad|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = width >= 768 && width < 1024 && /tablet|ipad/i.test(userAgent);
      const isDesktop = width >= 1024 && !/mobile|tablet|android|iphone|ipad/i.test(userAgent);
      
      // Touch capability detection
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Orientation detection
      const orientation = height > width ? 'portrait' : 'landscape';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouch,
        screenSize,
        orientation,
        width,
        height
      });
    };

    // Initial detection
    detectDevice();

    // Listen for resize events
    const handleResize = () => {
      detectDevice();
    };

    // Listen for orientation changes
    const handleOrientationChange = () => {
      setTimeout(detectDevice, 100); // Small delay for orientation change
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
};

export default useDeviceDetection;

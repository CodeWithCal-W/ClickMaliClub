import React, { useState, useEffect } from 'react';
import useDeviceDetection from '../../hooks/useDeviceDetection';

const MobileOptimization = ({ children }) => {
  const device = useDeviceDetection();
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // PWA Installation Detection
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if app is running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone === true;
    setIsFullscreen(isStandalone);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Add mobile-specific CSS classes and optimizations
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    // Device classes
    if (device.isMobile) {
      body.classList.add('mobile-view');
      body.classList.remove('tablet-view', 'desktop-view');
    } else if (device.isTablet) {
      body.classList.add('tablet-view');
      body.classList.remove('mobile-view', 'desktop-view');
    } else {
      body.classList.add('desktop-view');
      body.classList.remove('mobile-view', 'tablet-view');
    }

    // Orientation classes
    body.classList.toggle('landscape', device.orientation === 'landscape');
    body.classList.toggle('portrait', device.orientation === 'portrait');

    // Touch device optimizations
    if (device.isTouch) {
      body.classList.add('touch-device');
      // Better touch scrolling
      body.style.webkitOverflowScrolling = 'touch';
    } else {
      body.classList.remove('touch-device');
    }

    // PWA fullscreen mode
    body.classList.toggle('pwa-fullscreen', isFullscreen);

    // Safe area support for notched devices
    if (device.isMobile) {
      html.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
      html.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
      html.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      html.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
    }

    return () => {
      body.classList.remove(
        'mobile-view', 'tablet-view', 'desktop-view', 
        'landscape', 'portrait', 'touch-device', 'pwa-fullscreen'
      );
    };
  }, [device, isFullscreen]);

  // Mobile performance optimizations
  useEffect(() => {
    if (device.isMobile) {
      // Disable hover effects on mobile to improve performance
      const hoverStyles = document.createElement('style');
      hoverStyles.innerHTML = `
        @media (hover: none) and (pointer: coarse) {
          *:hover {
            /* Reset hover styles on touch devices */
          }
        }
      `;
      document.head.appendChild(hoverStyles);

      // Optimize scroll performance
      const style = document.createElement('style');
      style.innerHTML = `
        * {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Smooth scrolling for mobile */
        html {
          scroll-behavior: smooth;
        }
        
        /* Improve tap highlighting */
        * {
          -webkit-tap-highlight-color: rgba(54, 179, 126, 0.2);
        }
        
        /* Safe area support */
        .pb-safe {
          padding-bottom: calc(1rem + env(safe-area-inset-bottom));
        }
        
        .pt-safe {
          padding-top: calc(1rem + env(safe-area-inset-top));
        }
        
        /* Mobile app-like styling */
        .pwa-fullscreen .main-content {
          padding-top: env(safe-area-inset-top);
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(hoverStyles);
        document.head.removeChild(style);
      };
    }
  }, [device.isMobile]);

  // PWA Install Handler
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div 
      className={`mobile-optimized ${device.isMobile ? 'mobile' : ''} ${device.isTablet ? 'tablet' : ''} ${device.orientation}`}
      data-device={device.isMobile ? 'mobile' : device.isTablet ? 'tablet' : 'desktop'}
      data-orientation={device.orientation}
      data-touch={device.isTouch}
      data-pwa-mode={isFullscreen}
    >
      {/* PWA Install Banner for Mobile */}
      {isInstallable && device.isMobile && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-primary-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium">Install ClickMaliClub App</p>
            <p className="text-xs opacity-90">Get the full app experience</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsInstallable(false)}
              className="text-white/70 hover:text-white text-sm"
            >
              Later
            </button>
            <button
              onClick={handleInstallClick}
              className="bg-white text-primary-600 px-3 py-1 rounded text-sm font-medium"
            >
              Install
            </button>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default MobileOptimization;

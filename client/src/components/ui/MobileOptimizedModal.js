import React from 'react';
import useDeviceDetection from '../../hooks/useDeviceDetection';

const MobileOptimizedModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'default',
  showCloseButton = true 
}) => {
  const device = useDeviceDetection();

  if (!isOpen) return null;

  // Mobile-first modal styling
  const modalClasses = device.isMobile
    ? 'fixed inset-0 z-50 overflow-y-auto'
    : 'fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4';

  const contentClasses = device.isMobile
    ? 'min-h-screen bg-white dark:bg-gray-900'
    : `bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-${size === 'large' ? '4xl' : size === 'small' ? 'md' : '2xl'} w-full max-h-[90vh] overflow-hidden`;

  return (
    <div className={modalClasses}>
      {/* Desktop backdrop */}
      {!device.isMobile && (
        <div 
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        />
      )}
      
      <div className={contentClasses}>
        {/* Mobile header */}
        {device.isMobile && (
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Desktop header */}
        {!device.isMobile && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={device.isMobile ? 'p-4 pb-safe' : 'p-6 overflow-y-auto max-h-[70vh]'}>
          {children}
        </div>

        {/* Mobile safe area for buttons */}
        {device.isMobile && (
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 pb-safe">
            {/* Buttons will be rendered here by children */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileOptimizedModal;

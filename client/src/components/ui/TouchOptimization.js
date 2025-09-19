import React from 'react';

const TouchOptimization = ({ children, className = '', onTap, onSwipe }) => {
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    e.target.setAttribute('data-touch-start-x', touch.clientX);
    e.target.setAttribute('data-touch-start-y', touch.clientY);
    e.target.setAttribute('data-touch-start-time', Date.now());
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const startX = parseFloat(e.target.getAttribute('data-touch-start-x')) || 0;
    const startY = parseFloat(e.target.getAttribute('data-touch-start-y')) || 0;
    const startTime = parseFloat(e.target.getAttribute('data-touch-start-time')) || 0;
    
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Tap detection (short time, small movement)
    if (deltaTime < 300 && distance < 10 && onTap) {
      onTap(e);
    }
    
    // Swipe detection (longer distance, quick movement)
    if (distance > 50 && deltaTime < 300 && onSwipe) {
      const direction = Math.abs(deltaX) > Math.abs(deltaY) 
        ? (deltaX > 0 ? 'right' : 'left')
        : (deltaY > 0 ? 'down' : 'up');
      
      onSwipe(direction, e);
    }
  };

  return (
    <div 
      className={`touch-optimized ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {children}
    </div>
  );
};

export default TouchOptimization;

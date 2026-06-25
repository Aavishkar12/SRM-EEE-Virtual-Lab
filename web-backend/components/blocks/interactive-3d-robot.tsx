'use client';

import { useState } from 'react';

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert "https://prod.spline.design/kZCBH4hL4yD8P315/scene.splinecode" 
  // to "https://my.spline.design/kZCBH4hL4yD8P315/"
  const iframeSrc = scene
    .replace('prod.spline.design', 'my.spline.design')
    .replace('/scene.splinecode', '/');

  return (
    <div className={`w-full h-full relative ${className || ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-white z-10">
          <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
          </svg>
          <span className="text-sm font-medium text-neutral-400">Loading 3D Assistant...</span>
        </div>
      )}
      <iframe 
        src={iframeSrc} 
        onLoad={() => setIsLoading(false)}
        className="absolute top-0 left-0 w-full h-full border-none z-0"
        title="Interactive 3D AI Assistant"
        allow="fullscreen"
      />
    </div>
  );
}

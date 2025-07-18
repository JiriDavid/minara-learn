"use client";

import { useEffect, useState } from 'react';

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    apiCalls: 0,
    cacheHits: 0,
  });

  useEffect(() => {
    // Monitor page load time
    const startTime = performance.now();
    
    const updateMetrics = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime }));
    };

    // Use requestIdleCallback or setTimeout as fallback
    if (window.requestIdleCallback) {
      window.requestIdleCallback(updateMetrics);
    } else {
      setTimeout(updateMetrics, 0);
    }

    // Monitor navigation
    const handleNavigationStart = () => {
      console.log('Navigation started at:', performance.now());
    };

    const handleNavigationEnd = () => {
      console.log('Navigation ended at:', performance.now());
    };

    window.addEventListener('beforeunload', handleNavigationStart);
    window.addEventListener('load', handleNavigationEnd);

    return () => {
      window.removeEventListener('beforeunload', handleNavigationStart);
      window.removeEventListener('load', handleNavigationEnd);
    };
  }, []);

  return metrics;
}

// Performance overlay for development
export function PerformanceOverlay() {
  const metrics = usePerformanceMonitor();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 backdrop-blur-sm">
      <div className="mb-2 font-bold">Performance Metrics</div>
      <div>Load Time: {metrics.loadTime.toFixed(2)}ms</div>
      <div>Render Time: {metrics.renderTime.toFixed(2)}ms</div>
      <div>API Calls: {metrics.apiCalls}</div>
      <div>Cache Hits: {metrics.cacheHits}</div>
      <div className="mt-2 text-xs text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}

// Performance-optimized component wrapper
export function withPerformance(Component, displayName) {
  const WrappedComponent = (props) => {
    const startTime = performance.now();
    
    useEffect(() => {
      const endTime = performance.now();
      console.log(`${displayName} rendered in ${endTime - startTime}ms`);
    });

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPerformance(${displayName})`;
  return WrappedComponent;
}

import { memo } from 'react';

const LoadingSpinner = memo(({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-blue-600 border-t-transparent ${sizes[size]} ${className}`}>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

const PageLoader = memo(({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-slate-600 dark:text-slate-400 animate-pulse">{message}</p>
      </div>
    </div>
  );
});

PageLoader.displayName = 'PageLoader';

const SectionLoader = memo(({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <LoadingSpinner size="lg" />
    </div>
  );
});

SectionLoader.displayName = 'SectionLoader';

const CardSkeleton = memo(({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-6">
        <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-5/6"></div>
      </div>
    </div>
  );
});

CardSkeleton.displayName = 'CardSkeleton';

const TableSkeleton = memo(({ rows = 5 }) => {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded mb-2"></div>
      ))}
    </div>
  );
});

TableSkeleton.displayName = 'TableSkeleton';

// Default export for backward compatibility
const Loading = memo(() => {
  return (
    <div className="flex justify-center items-center p-8">
      <LoadingSpinner size="lg" />
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;

export { 
  LoadingSpinner, 
  PageLoader, 
  SectionLoader, 
  CardSkeleton, 
  TableSkeleton 
};

'use client';

interface LoadingGridProps {
  count?: number;
}

export default function LoadingGrid({ count = 6 }: LoadingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
          
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          {/* Progress skeleton */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
          </div>
          
          {/* Footer skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          
          {/* Tags skeleton */}
          <div className="flex gap-1">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

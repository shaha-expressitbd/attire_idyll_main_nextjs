import React from 'react';

interface SkeletonComponentProps {
  type?: 'card' | 'image' | 'video' | 'text';
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonComponent: React.FC<SkeletonComponentProps> = ({
  type = 'card',
  width = 'w-full',
  height = 'h-64',
  className = '',
}) => {
  const baseClasses = 'relative overflow-hidden bg-pink-100 dark:bg-gray-700 rounded-lg';

  return (
    <div className={`${baseClasses} ${width} ${height} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100 to-transparent animate-light-up-down bg-[length:100%_200%]"></div>

      {type === 'image' && (
        <div className="w-full h-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
      )}

      {type === 'video' && (
        <div className="w-full h-full flex items-center justify-center relative">
          <svg
            className="w-16 h-16 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.752 11.168l-3.197-2.2A1 1 0 0010 9.8v4.4a1 1 0 001.555.832l3.197-2.2a1 1 0 000-1.664z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div className="absolute bottom-4 left-4 h-2 w-1/3 bg-gray-400 rounded animate-pulse"></div>
          <div className="absolute bottom-4 right-4 h-2 w-1/4 bg-gray-400 rounded animate-pulse"></div>
        </div>
      )}

      {type === 'card' && (
        <div className="p-4">
          <div className="h-4 bg-gray-400 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-400 rounded w-1/2 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-400 rounded w-1/4 animate-pulse"></div>
        </div>
      )}

      {type === 'text' && (
        <div className="w-full h-full flex items-center justify-start">
          <div className="h-full bg-gray-400 rounded w-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default SkeletonComponent;
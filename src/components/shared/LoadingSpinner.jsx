// src/components/shared/LoadingSpinner/index.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4 border-2',
      md: 'w-6 h-6 border-2',
      lg: 'w-8 h-8 border-3'
    };
  
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-full border-slate-200/20 border-t-sky-500 animate-spin`} />
    );
  };

export default LoadingSpinner;
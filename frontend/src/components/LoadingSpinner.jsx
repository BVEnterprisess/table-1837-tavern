import React from 'react';
import { Wine } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Wine className="w-8 h-8 text-primary animate-pulse" />
        <div className="absolute inset-0 w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="text-sm text-muted-foreground">Loading cocktails...</p>
    </div>
  );
};

export default LoadingSpinner;


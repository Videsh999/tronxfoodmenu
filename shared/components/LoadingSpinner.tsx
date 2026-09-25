import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  label = "Preparing Culinary Experience...",
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-14 h-14 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-[#602E31]/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-t-[#602E31] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border border-b-[#C2674F] border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="font-serif text-sm tracking-widest text-[#602E31] uppercase font-bold animate-pulse">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#FFF5EC]/90 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

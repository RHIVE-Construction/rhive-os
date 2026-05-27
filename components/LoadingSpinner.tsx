import React, { useState, useEffect } from 'react';

const messages = [
  "Analyzing satellite imagery...",
  "Constructing 3D roof model...",
  "Calculating precise measurements...",
  "Compiling your report...",
];

export const LoadingSpinner: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-lg">
      <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <div className="mt-4 h-12 flex flex-col justify-center">
         <p className="text-lg font-semibold text-slate-700 transition-opacity duration-500 ease-in-out" key={currentMessageIndex}>
            {messages[currentMessageIndex]}
         </p>
      </div>
      <p className="text-base text-slate-500">This may take a few moments. Please wait.</p>
    </div>
  );
};
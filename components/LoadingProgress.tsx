import React, { useState, useEffect } from 'react';

interface LoadingProgressProps {
  mainMessage: string;
  subMessages: string[];
}

const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-[#3A60F8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ mainMessage, subMessages }) => {
    const [completedIndex, setCompletedIndex] = useState(-1);

    useEffect(() => {
        if (subMessages.length === 0) return;

        setCompletedIndex(-1); // Reset on new messages

        const totalDuration = 8000; // Simulate a process
        const interval = totalDuration / subMessages.length;

        const timeouts = subMessages.map((_, index) => {
            return setTimeout(() => {
                setCompletedIndex(index);
            }, interval * (index + 1));
        });

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, [subMessages]);

    return (
        <div className="text-center py-10 px-4 sm:px-0">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-[#3A60F8] rounded-full animate-spin mx-auto"></div>
            <p className="mt-6 text-lg text-gray-800 font-semibold">{mainMessage}</p>
            <p className="mt-2 text-gray-500">AI가 최상의 결과물을 만들기 위해 분석하고 있습니다. 잠시만 기다려주세요.</p>

            {subMessages.length > 0 && (
                <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded-lg border border-gray-200">
                    <ul className="space-y-4 text-left">
                        {subMessages.map((message, index) => (
                            <li key={index} className="flex items-center text-gray-700 transition-colors duration-300">
                                <div className="w-6 h-6 flex items-center justify-center mr-3">
                                    {index < completedIndex ? (
                                        <CheckIcon />
                                    ) : index === completedIndex ? (
                                        <SpinnerIcon />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                    )}
                                </div>
                                <span className={index <= completedIndex ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                                    {message}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


import React from 'react';

interface Step {
  number: number;
  title: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div>
      <h2 className="sr-only">Steps</h2>
      
      {/* This container handles the circles and the connecting line */}
      <div className="relative after:absolute after:inset-x-0 after:top-4 after:block after:h-0.5 after:rounded-lg after:bg-gray-200">
        <ol className="relative z-10 flex justify-between">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <li key={step.number} className="flex-1">
                <div className="flex justify-center">
                  <span
                    className={`flex items-center justify-center h-8 w-8 rounded-full border-2 ${
                      isCompleted ? 'bg-[#3A60F8] border-[#3A60F8] text-white' : 
                      isCurrent ? 'border-[#3A60F8] bg-white text-[#3A60F8]' : 
                      'border-gray-300 bg-white'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                      <span className="font-medium">{step.number}</span>
                    )}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* This container handles the step titles separately to ensure alignment */}
      <ol className="mt-2 flex justify-between text-sm text-gray-500">
        {steps.map((step) => {
          const isCurrent = currentStep === step.number;
          return (
            <li key={step.number} className="flex-1 px-1 text-center">
              <span className={`inline-grid h-12 place-items-center text-xs sm:text-sm whitespace-nowrap ${isCurrent ? 'font-bold text-[#3A60F8]' : ''}`}>
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
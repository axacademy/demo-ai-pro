
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { StepContent } from './components/StepContent';
import { ActionButton } from './components/ActionButton';
import { generateStepContent, generateUiImages, generatePromptsFromUx } from './services/geminiService';
import type { StepResult } from './types';
import { STEPS } from './constants';
import { SAMPLE_PROJECT_IDEA, SAMPLE_RESULTS } from './sampleData';
import { IntroScreen } from './components/IntroScreen';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [projectIdea, setProjectIdea] = useState<string>('');
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isSingleSampleView, setIsSingleSampleView] = useState<boolean>(false);

  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setProjectIdea('');
    setStepResults([]);
    setError(null);
    setIsLoading(false);
    setIsStarted(false);
    setIsSingleSampleView(false);
  }, []);

  const handleViewSample = useCallback(() => {
    setProjectIdea(SAMPLE_PROJECT_IDEA);
    setStepResults(SAMPLE_RESULTS);
    setCurrentStep(STEPS.length + 1); // Go to completed state to view all
    setError(null);
    setIsLoading(false);
    setIsStarted(true);
    setIsSingleSampleView(false);
  }, []);

  const handleViewSingleStepSample = useCallback(() => {
    setIsStarted(true);
    setIsSingleSampleView(true);
    setCurrentStep(2);
    setProjectIdea(SAMPLE_PROJECT_IDEA);
    setStepResults(SAMPLE_RESULTS.filter(r => r.step <= 2));
    setError(null);
    setIsLoading(false);
  }, []);


  const handleNextStep = useCallback(async () => {
    const nextStep = currentStep + 1;

    // Go to completed state after the last step
    if (nextStep > STEPS.length) {
      setCurrentStep(nextStep);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result: string | string[];
      if (nextStep === 6) { // Step 6: Image Generation
        const step5Result = stepResults.find(r => r.step === 5);
        if (!step5Result || typeof step5Result.content !== 'string') {
          throw new Error('5단계의 UX 설계 내용이 없습니다.');
        }
        
        const prompts = await generatePromptsFromUx(step5Result.content);
        result = await generateUiImages(prompts);
      } else { // Steps 2-5 & 7 for text generation
        result = await generateStepContent(nextStep, projectIdea, stepResults);
      }
      
      setStepResults(prev => [...prev, { step: nextStep, content: result }]);
      setCurrentStep(nextStep);
    } catch (e) {
      console.error(e);
      let errorMessage = '알 수 없는 오류가 발생했습니다.';
      if (e instanceof Error) {
          if (e.message.includes('429') || e.message.toLowerCase().includes('resource_exhausted')) {
              errorMessage = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도하거나 플랜을 확인해주세요.';
          } else {
              errorMessage = `오류가 발생했습니다: ${e.message}`;
          }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentStep, projectIdea, stepResults]);

  const handleStart = useCallback(async () => {
    if (!projectIdea.trim()) {
      setError('프로젝트 아이디어를 입력해주세요.');
      return;
    }
    setStepResults([{ step: 1, content: projectIdea }]);
    // Directly call handleNextStep to process step 2 after starting
    const nextStep = 2;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateStepContent(nextStep, projectIdea, [{ step: 1, content: projectIdea }]);
      setStepResults(prev => [...prev, { step: nextStep, content: result }]);
      setCurrentStep(nextStep);
    } catch (e) {
      console.error(e);
      let errorMessage = '알 수 없는 오류가 발생했습니다.';
      if (e instanceof Error) {
          if (e.message.includes('429') || e.message.toLowerCase().includes('resource_exhausted')) {
              errorMessage = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도하거나 플랜을 확인해주세요.';
          } else {
              errorMessage = `오류가 발생했습니다: ${e.message}`;
          }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [projectIdea]);


  if (!isStarted) {
    return <IntroScreen onViewSample={handleViewSample} onViewSingleStepSample={handleViewSingleStepSample} />;
  }

  const isCompleted = currentStep > STEPS.length;

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#1F2358]">
      <Header 
        isCompleted={isCompleted}
        onReset={handleReset}
      />
      <main className="max-w-6xl mx-auto p-4 sm:p-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
          <StepIndicator currentStep={currentStep} steps={STEPS} />
          
          <div className="mt-8">
            <StepContent
              currentStep={currentStep}
              projectIdea={projectIdea}
              setProjectIdea={setProjectIdea}
              stepResults={stepResults}
              isLoading={isLoading}
              error={error}
              onReset={handleReset}
            />
          </div>

          {isSingleSampleView ? (
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center gap-4">
               <button 
                 onClick={handleReset} 
                 className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-[#3A60F8] text-base font-medium rounded-md text-[#3A60F8] bg-white hover:bg-blue-50 transition-colors"
               >
                 처음으로 돌아가기
               </button>
               <button 
                 onClick={handleViewSample} 
                 className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#3A60F8] hover:bg-blue-700 transition-colors"
               >
                 전체 샘플 리포트 보기
               </button>
            </div>
          ) : !isCompleted && (
            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
                <ActionButton
                  currentStep={currentStep}
                  isLoading={isLoading}
                  onStart={handleStart}
                  onNext={handleNextStep}
                  isDisabled={isLoading || (currentStep === 1 && !projectIdea.trim())}
                />
            </div>
          )}
        </div>
      </main>
       <footer className="text-center p-4 text-gray-500 text-sm">
          <p>Powered by AI Transformation Academy</p>
       </footer>
    </div>
  );
};

export default App;

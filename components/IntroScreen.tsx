
import React from 'react';

interface IntroScreenProps {
  onViewSample: () => void;
  onViewSingleStepSample: () => void;
}

const StepIcon: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
    <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#3A60F8] text-white flex items-center justify-center font-bold">
            {icon}
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
);


export const IntroScreen: React.FC<IntroScreenProps> = ({ onViewSample, onViewSingleStepSample }) => {
  const steps = [
    { icon: '1', label: '프로젝트 주제' },
    { icon: '2', label: 'AI 활용 이유 분석' },
    { icon: '3', label: '비즈니스 기회 도출' },
    { icon: '4', label: '프로젝트 실행 전략' },
    { icon: '5', label: 'UX 상세 설계' },
    { icon: '6', label: 'UI 프로토타입 제작' },
    { icon: '7', label: '최종 프로젝트 기획' },
  ];

  const coreValues = [
    { title: '원스톱 플로우', description: '아이디어 발상부터 전략, UX/UI 설계, 최종 프로토타입까지 모든 과정을 한 곳에서 해결합니다.' },
    { title: '검증 기반 실행안', description: '시장성과 기술 타당성을 데이터와 스토리로 증명하여 설득력 있는 결과물을 만듭니다.' },
    { title: '즉시 활용 가능한 결과물', description: '투자자 보고, 내부 공유용 문서와 인터랙티브 프로토타입을 즉시 받아볼 수 있습니다.' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="py-6">
          <h1 className="text-2xl font-bold text-[#1F2358]">
            🚀 AI프로젝트 기획 서비스
          </h1>
        </header>

        {/* Hero Section */}
        <main>
          <section className="py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1F2358] tracking-tight">
                  AI 프로젝트, 기획부터 <br />프로토타입까지 원스톱.
                </h2>
                <p className="mt-5 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                  AI를 활용한 비즈니스 아이디어를 실제로 구현하고 검증할 수 있도록, <br />
                  단계별 분석과 설계를 통해 설득력 있는 결과물을 도출합니다.
                </p>
                <div className="mt-10">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button
                      onClick={onViewSingleStepSample}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#3A60F8] hover:bg-blue-700 transition-colors"
                    >
                      AI프로젝트 기획 체험하기
                    </button>
                    <button
                      onClick={onViewSample}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-[#3A60F8] text-base font-medium rounded-md text-[#3A60F8] bg-white hover:bg-blue-50 transition-colors"
                    >
                      결과 리포트 샘플보기
                    </button>
                  </div>
                   <div className="mt-6 text-center lg:text-left">
                     <a 
                       href="https://digitaltransformation.co.kr/ax-contact/" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="text-base font-bold text-gray-700 hover:text-[#3A60F8] transition-colors"
                     >
                       AI프로젝트 기획 서비스 문의하기
                     </a>
                   </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-lg font-bold text-center text-[#1F2358] mb-6">프로젝트 기획 플로우</h3>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" aria-hidden="true"></div>
                  
                  <div className="space-y-5">
                    {steps.map((step) => (
                      <div key={step.label} className="relative pl-2">
                        <StepIcon icon={step.icon} label={step.label} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="py-16 sm:py-24">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-[#1F2358]">결과물로 말합니다</h2>
                <p className="mt-3 text-gray-600">AI프로젝트 기획 서비스는 다음과 같은 핵심 가치를 제공합니다.</p>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
                {coreValues.map(value => (
                    <div key={value.title} className="bg-white p-8 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold text-[#1F2358]">{value.title}</h3>
                        <p className="mt-3 text-gray-600">{value.description}</p>
                    </div>
                ))}
            </div>
          </section>

          {/* Target Audience Section */}
          <section className="py-16">
             <div className="bg-white rounded-2xl p-10 grid md:grid-cols-2 gap-8 items-center shadow-lg">
                <div>
                   <h2 className="text-3xl font-bold text-[#1F2358]">이런 분에게 적합합니다</h2>
                </div>
                <div>
                    <ul className="space-y-4 text-gray-700">
                        <li className="flex items-start"><span className="text-[#3A60F8] font-bold mr-3 pt-1">›</span>신규 BM/AI 전환을 모색하는 스타트업 대표, PO/PM</li>
                        <li className="flex items-start"><span className="text-[#3A60F8] font-bold mr-3 pt-1">›</span>내부 설득 자료와 구체적인 실행 계획이 필요한 기업 혁신팀</li>
                         <li className="flex items-start"><span className="text-[#3A60F8] font-bold mr-3 pt-1">›</span>아이디어는 있지만 어떻게 구체화할지 막막한 예비 창업가</li>
                    </ul>
                </div>
             </div>
          </section>
        </main>
        
        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>Powered by AI Transformation Academy</p>
        </footer>
      </div>
    </div>
  );
};

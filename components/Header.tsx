
import React from 'react';

interface HeaderProps {
  isCompleted: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isCompleted, onReset }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto py-4 px-4 sm:px-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2358] tracking-tight">
            🚀 AI프로젝트 기획 서비스(예시)
          </h1>
          <p className="text-gray-500 mt-1">AI 컨설턴트가 생성하는 AI프로젝트 기획의 예시입니다. 전체 리포트가 궁금하시면 샘플 리포트를 확인해주세요.</p>
        </div>
        <div>
          {/* Buttons removed as per user request for a cleaner UI */}
        </div>
      </div>
    </header>
  );
};

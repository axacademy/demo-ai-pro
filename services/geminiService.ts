
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import type { StepResult } from '../types';

// FIX: Initialize GoogleGenAI with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';
const imageModel = 'imagen-4.0-generate-001';

// Helper function to add a delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getSystemInstruction = () => {
  return `
    #Role
    당신은 AI 기반 서비스 기획 및 프로젝트 개발 전문가입니다.
    사용자가 AI를 활용한 비즈니스 아이디어를 실제로 구현하고 검증할 수 있도록, 단계별 분석과 설계를 통해 설득력 있는 결과물을 도출하는 데 도움을 줄 것입니다.
    목표는 사용자의 변화된 라이프스타일을 반영한 AI 활용 아이디어를 구체화하고, 시장성과 기술적 타당성을 입증하여 투자자 및 이해관계자들을 납득시킬 수 있는 AI 프로젝트 실행안을 만드는 것입니다.
    
    #Instruction
    - 반드시 사용자가 입력한 프로젝트 아이디어와 이전 단계의 결과물을 기반으로 현재 단계의 결과물을 생성합니다.
    - 각 단계의 결과물은 명확하고 구조화된 형태로 제공해주세요. Markdown을 활용하여 가독성을 높여주세요.
    - 웹 검색을 사용하는 경우, 신뢰할 수 있는 출처를 활용하고, 본문 내에 (저자, 연도) 또는 (기관, 연도) 형식으로 출처를 반드시 표기해주세요. 자료는 최근 6개월 이내의 것을 우선적으로 사용합니다.
    `;
};


const generatePrompt = (step: number, projectIdea: string, previousResults: StepResult[]): string => {
    const previousContext = previousResults.map(r => `
---
[Step ${r.step} Result]
${typeof r.content === 'string' ? r.content : 'Image content'}
---
    `).join('\n');

    const prompts: { [key: number]: string } = {
        2: `
            사용자의 프로젝트 아이디어는 "${projectIdea}" 입니다.
            이 주제를 기반으로 ‘AI를 왜 활용해야 하는가’를 심도 있게 분석해주세요.
            - 변화된 시장 환경, 사용자 니즈, 기술 흐름 등을 고려하여 AI의 필요성을 도출합니다. (웹 검색 활용)
            - 사용자 행동 예측, 효율성 향상, 맞춤화 등 AI 적용의 구체적 효과와 타당성을 설명합니다.
            - 투자자와 이해관계자를 설득할 수 있는 사용자 시나리오 또는 미니 프로토타입 방향성을 제안합니다.
            - 마켓(사용자) 및 기술에서 증명된 데이터를 기반으로 새로운 형태의 비즈니스 모델의 가능성을 유추합니다. (웹 검색 활용)
        `,
        3: `
            프로젝트 주제 "${projectIdea}"와 이전 분석 결과를 바탕으로, ‘AI로 설계 가능한 비즈니스/서비스 기회’를 구체적으로 도출해주세요.
            - 고객 여정(End-to-End) 상에서 AI가 개입할 수 있는 지점을 구조적으로 분석합니다.
            - 최신 AI 기술 흐름을 반영하여 차별화된 사용자 경험과 서비스 가치를 정의합니다. (웹 검색 활용)
            - AI를 통한 자동화, 예측, 생성, 개인화 등 핵심 가치 요소를 중심으로 구체적 기회를 설계합니다.
            - 실현 가능성을 검토하고, 실험 또는 PoC(Proof of Concept) 구성을 제안합니다.
        `,
        4: `
            지금까지의 분석을 종합하여, 프로젝트 "${projectIdea}"의 ‘AI 프로젝트 구상과 실행 전략’을 구성해주세요.
            - 도출된 비즈니스 기회를 바탕으로 AI 중심의 사용자 경험을 설계합니다.
            - 인터페이스, 기능 흐름, AI 알고리즘 요소 등을 통합하여 프로젝트 형태로 구체화합니다.
            - 실제 작동하는 프로토타입이나 사용자 시뮬레이션 흐름을 구성하고, 검증 포인트(데이터, 사용성, 정량적 효과)를 제안합니다.
            - “AI가 만든 새로운 경험”이라는 핵심 가치를 중심으로 메시지화합니다.
        `,
        5: `
            프로젝트 "${projectIdea}"의 AI 프로젝트 UX를 구체적으로 설계해주세요.
            - 핵심 UX 컨셉을 정의합니다.
            - 주요 사용자 유형 (Persona)을 2~3가지 구성합니다.
            - 주요 화면 흐름 (User Flow)을 단계별로 상세하게 구성합니다.
            - 핵심 UI 요소를 설계합니다.
            - 디자인 톤 & 무드를 제안합니다.
            - UX 검증 전략 (실험 방향)을 제안합니다.
        `,
        7: `
            지금까지 진행된 모든 단계의 결과물을 종합하여, 이해관계자(투자자, 팀원)에게 바로 공유할 수 있는 최종 AI 프로젝트 기획서를 작성해주세요.
            
            # 최종 프로젝트 기획서 구성要素
            1.  **프로젝트 개요 (Executive Summary):**
                - 프로젝트 명: "${projectIdea}"
                - 핵심 목표 및 비전
                - 해결하고자 하는 문제와 AI의 역할
                - 기대 효과 (요약)
            
            2.  **시장 분석 및 기회:**
                - AI 도입의 필요성 (시장/기술 트렌드 기반)
                - 타겟 고객 및 핵심 문제점
                - AI를 통해 창출할 수 있는 차별화된 비즈니스/서비스 기회
            
            3.  **프로젝트 전략:**
                - 프로젝트 컨셉 및 핵심 기능
                - AI 중심의 사용자 경험(UX) 전략
                - 주요 사용자 페르소나 및 핵심 시나리오
            
            4.  **실행 및 검증 계획:**
                - 프로토타입 또는 PoC를 통한 초기 검증 방안
                - 성공 측정 지표 (KPIs)
            
            5.  **결론 및 제언:**
                - 프로젝트의 장기적인 비전과 확장 가능성
                - 다음 단계(Next Step) 제안
            
            각 항목은 전문적이고 설득력 있는 톤으로 작성되어야 하며, 전체적으로 하나의 완성된 문서 형태를 갖추어야 합니다.
            이전 단계들의 내용을 단순히 나열하는 것이 아니라, 유기적으로 연결하고 종합하여 체계적인 기획서로 재구성해주세요.
        `,
    };

    return `
    ${previousContext}
    
    [Current Task]
    Step ${step}을 진행합니다.
    ${prompts[step]}
    `;
};


export const generateStepContent = async (step: number, projectIdea: string, previousResults: StepResult[]): Promise<string> => {
    const prompt = generatePrompt(step, projectIdea, previousResults);
    
    const useWebSearch = step === 2 || step === 3;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: getSystemInstruction(),
            ...(useWebSearch && { tools: [{ googleSearch: {} }] }),
        },
    });

    const text = response.text;
    if (!text) {
        throw new Error('API로부터 응답을 받지 못했습니다.');
    }
    return text;
};

export const generatePromptsFromUx = async (uxDescription: string): Promise<string[]> => {
    const prompt = `
        Based on the detailed UX design document provided below, identify the key user-facing screens described in the "주요 화면 흐름 (User Flow)" section. For each screen, create a concise, descriptive prompt in English for an image generation AI. These prompts should be suitable for creating high-fidelity UI mockups.

        Return the result as a JSON array of strings inside a markdown code block. Do not include any other text or explanations. Your entire response should be only the JSON markdown block.

        Example output format:
        \`\`\`json
        [
          "A modern, welcoming login screen for a travel planning app, featuring a beautiful background image and social login options.",
          "The main user dashboard, with a clean layout, displaying personalized travel suggestions in a card-based interface.",
          "A screen showing a detailed itinerary for a trip to Paris, including a map view, daily schedule, and booking details."
        ]
        \`\`\`

        UX Design Document:
        ---
        ${uxDescription}
        ---
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
        }
    });

    const text = response.text.trim();
    if (!text) {
        throw new Error('API did not return prompts from UX description.');
    }
    
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    const jsonString = match ? match[1] : text;

    try {
        const prompts = JSON.parse(jsonString);
        if (Array.isArray(prompts) && prompts.every(p => typeof p === 'string')) {
            return prompts;
        }
        throw new Error('Parsed JSON is not an array of strings.');
    } catch (e) {
        console.error("Failed to parse JSON from response:", text);
        if (e instanceof Error) {
            throw new Error(`Failed to parse prompts from the generated text: ${e.message}`);
        }
        throw new Error('Failed to parse prompts from the generated text.');
    }
};

export const generateUiImages = async (prompts: string[]): Promise<string[]> => {
    const imageUrls: string[] = [];

    for (const prompt of prompts) {
        // Process one prompt at a time to avoid rate limiting
        const response = await ai.models.generateImages({
            model: imageModel,
            prompt: `UX wireframe, mockup, UI design for a web application. ${prompt}. Clean, modern, high-fidelity.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '16:9',
            },
        });
        
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        imageUrls.push(`data:image/png;base64,${base64ImageBytes}`);
        
        // Add a 10-second delay between image generation requests. This is a conservative delay to avoid hitting API rate limits on free-tier plans.
        await delay(10000);
    }

    return imageUrls;
};

import OpenAI from 'openai';
import { AnalysisType, AnalysisResult } from '../types';

interface OpenAIError {
  isError: true;
  message: string;
}

let openaiInstance: OpenAI | OpenAIError;

const initializeOpenAI = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return {
      isError: true,
      message: 'OpenAI API key is not configured. Please add your API key to the .env file.'
    } as OpenAIError;
  }

  try {
    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
    return {
      isError: true,
      message: 'Failed to initialize OpenAI client. Please check your API key.'
    } as OpenAIError;
  }
};

openaiInstance = initializeOpenAI();

const isOpenAIError = (instance: OpenAI | OpenAIError): instance is OpenAIError => {
  return 'isError' in instance;
};

const getOpenAIClient = () => {
  if (isOpenAIError(openaiInstance)) {
    throw new Error(openaiInstance.message);
  }
  return openaiInstance;
};

const analyzeWithGPT4Vision = async (base64Image: string, prompt: string) => {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: base64Image
            }
          }
        ]
      }
    ],
    max_tokens: 500
  });

  return response.choices[0].message.content;
};

const videoAnalysis = async (file: File): Promise<AnalysisResult> => {
  const videoFrame = await extractVideoFrame(file);
  const base64Image = await fileToBase64(videoFrame);
  
  const prompt = `Analyze this pet video frame. Focus on:
  1. Movement patterns and gait
  2. Body language and posture
  3. Signs of distress or discomfort
  4. Overall activity level
  
  Provide findings and recommendations in a structured format.`;

  const analysis = await analyzeWithGPT4Vision(base64Image, prompt);
  
  const { findings, recommendations } = parseGPTResponse(analysis);

  return {
    type: 'video',
    timestamp: new Date().toISOString(),
    findings,
    recommendations,
    confidence: 0.92
  };
};

const audioAnalysis = async (blob: Blob): Promise<AnalysisResult> => {
  const openai = getOpenAIClient();
  const transcript = await openai.audio.transcriptions.create({
    file: new File([blob], "audio.wav"),
    model: "whisper-1"
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a veterinary expert analyzing pet vocalizations and sounds."
      },
      {
        role: "user",
        content: `Analyze these pet sounds (transcribed): ${transcript.text}`
      }
    ]
  });

  const { findings, recommendations } = parseGPTResponse(response.choices[0].message.content);

  return {
    type: 'audio',
    timestamp: new Date().toISOString(),
    findings,
    recommendations,
    confidence: 0.88
  };
};

const photoAnalysis = async (file: File): Promise<AnalysisResult> => {
  const base64Image = await fileToBase64(file);
  
  const prompt = `Analyze this pet photo. Focus on:
  1. Physical appearance and condition
  2. Body posture and expression
  3. Any visible health concerns
  4. Overall wellbeing indicators
  
  Provide findings and recommendations in a structured format.`;

  const analysis = await analyzeWithGPT4Vision(base64Image, prompt);
  const { findings, recommendations } = parseGPTResponse(analysis);

  return {
    type: 'photo',
    timestamp: new Date().toISOString(),
    findings,
    recommendations,
    confidence: 0.95
  };
};

const textAnalysis = async (text: string): Promise<AnalysisResult> => {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a veterinary expert analyzing pet behavior descriptions."
      },
      {
        role: "user",
        content: `Analyze this pet behavior description: ${text}`
      }
    ]
  });

  const { findings, recommendations } = parseGPTResponse(response.choices[0].message.content);

  return {
    type: 'text',
    timestamp: new Date().toISOString(),
    findings,
    recommendations,
    confidence: 0.85
  };
};

const extractVideoFrame = async (videoFile: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    video.onloadeddata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to extract video frame'));
      }, 'image/jpeg');
    };

    video.src = URL.createObjectURL(videoFile);
  });
};

const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const parseGPTResponse = (response: string | null): { 
  findings: string[], 
  recommendations: string[] 
} => {
  if (!response) {
    return {
      findings: ['No analysis available'],
      recommendations: ['Please try again']
    };
  }

  const findings = response
    .split('\n')
    .filter(line => line.includes('Finding:') || line.includes('•'))
    .map(line => line.replace(/^(Finding:|•)\s*/, ''))
    .filter(line => line.length > 0)
    .slice(0, 4);

  const recommendations = response
    .split('\n')
    .filter(line => line.includes('Recommendation:') || line.includes('*'))
    .map(line => line.replace(/^(Recommendation:|\*)\s*/, ''))
    .filter(line => line.length > 0)
    .slice(0, 3);

  return {
    findings: findings.length > 0 ? findings : ['Analysis completed'],
    recommendations: recommendations.length > 0 ? recommendations : ['No specific recommendations']
  };
};

export const analyzeInput = async (
  type: AnalysisType,
  data: File | Blob | string
): Promise<AnalysisResult> => {
  try {
    switch (type) {
      case 'video':
        return videoAnalysis(data as File);
      case 'audio':
        return audioAnalysis(data as Blob);
      case 'photo':
        return photoAnalysis(data as File);
      case 'text':
        return textAnalysis(data as string);
      default:
        throw new Error('Unsupported analysis type');
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        type,
        timestamp: new Date().toISOString(),
        findings: ['Error during analysis'],
        recommendations: [error.message],
        confidence: 0
      };
    }
    return {
      type,
      timestamp: new Date().toISOString(),
      findings: ['Error during analysis'],
      recommendations: ['An unexpected error occurred'],
      confidence: 0
    };
  }
};
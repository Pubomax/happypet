import React, { useState, useRef } from 'react';
import { Upload, Mic, Camera, MessageSquare, AlertCircle, X } from 'lucide-react';
import { AnalysisType, AnalysisResult } from '../types';
import { analyzeInput } from '../services/ai-analysis';

const BehaviorAnalyzer = () => {
  const [activeInput, setActiveInput] = useState<AnalysisType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [behaviorText, setBehaviorText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentFileRef = useRef<File | null>(null);
  const currentBlobRef = useRef<Blob | null>(null);

  const handleInputSelect = (type: AnalysisType) => {
    setActiveInput(type);
    setMediaPreview(null);
    setBehaviorText('');
    setError(null);
    setResult(null);
    
    if (type === 'video' || type === 'photo') {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    currentFileRef.current = file;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        currentBlobRef.current = audioBlob;
        const audioUrl = URL.createObjectURL(audioBlob);
        setMediaPreview(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (error) {
      setError('Error accessing microphone. Please ensure microphone permissions are granted.');
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      let analysisData: File | Blob | string;
      
      switch (activeInput) {
        case 'video':
        case 'photo':
          if (!currentFileRef.current) throw new Error('No file selected');
          analysisData = currentFileRef.current;
          break;
        case 'audio':
          if (!currentBlobRef.current) throw new Error('No recording available');
          analysisData = currentBlobRef.current;
          break;
        case 'text':
          if (!behaviorText.trim()) throw new Error('Please enter behavior description');
          analysisData = behaviorText;
          break;
        default:
          throw new Error('Invalid input type');
      }

      const analysisResult = await analyzeInput(activeInput!, analysisData);
      
      if (analysisResult.confidence === 0) {
        setError(analysisResult.recommendations[0]);
      } else {
        setResult(analysisResult);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetInput = () => {
    setActiveInput(null);
    setMediaPreview(null);
    setBehaviorText('');
    setResult(null);
    setError(null);
    currentFileRef.current = null;
    currentBlobRef.current = null;
  };

  const inputOptions = [
    { type: 'video' as AnalysisType, icon: Upload, label: 'Upload Video' },
    { type: 'audio' as AnalysisType, icon: Mic, label: 'Record Audio' },
    { type: 'photo' as AnalysisType, icon: Camera, label: 'Take Photo' },
    { type: 'text' as AnalysisType, icon: MessageSquare, label: 'Log Behavior' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pet Behavior Analyzer</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {inputOptions.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => handleInputSelect(type)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                ${activeInput === type 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
            >
              <Icon className="w-8 h-8 mb-2 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </button>
          ))}
        </div>

        {activeInput && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-end mb-4">
                <button
                  onClick={resetInput}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {(activeInput === 'video' || activeInput === 'photo') && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept={activeInput === 'video' ? 'video/*' : 'image/*'}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {mediaPreview ? (
                    <div className="mb-4">
                      {activeInput === 'video' ? (
                        <video
                          src={mediaPreview}
                          controls
                          className="w-full rounded-lg"
                        />
                      ) : (
                        <img
                          src={mediaPreview}
                          alt="Preview"
                          className="w-full rounded-lg"
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer text-center p-8 bg-gray-50 rounded-lg"
                    >
                      <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-gray-600">
                        Click to {activeInput === 'video' ? 'upload video' : 'take photo'}
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeInput === 'audio' && (
                <div className="text-center">
                  {mediaPreview ? (
                    <audio src={mediaPreview} controls className="w-full mb-4" />
                  ) : (
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`px-6 py-3 rounded-full ${
                        isRecording
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white transition-colors`}
                    >
                      {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                  )}
                </div>
              )}

              {activeInput === 'text' && (
                <textarea
                  value={behaviorText}
                  onChange={(e) => setBehaviorText(e.target.value)}
                  placeholder="Describe your pet's behavior..."
                  className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}

              {(mediaPreview || (activeInput === 'text' && behaviorText)) && (
                <button
                  onClick={handleAnalyze}
                  className="w-full mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 
                    transition-colors disabled:bg-gray-400"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </button>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Findings:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.findings.map((finding, index) => (
                    <li key={index} className="text-gray-600">{finding}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Recommendations:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-gray-600">{recommendation}</li>
                  ))}
                </ul>
              </div>
              <div className="text-sm text-gray-500">
                Confidence Score: {(result.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorAnalyzer;
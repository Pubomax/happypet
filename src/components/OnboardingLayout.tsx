import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Logo } from './Logo';

export const OnboardingLayout: React.FC = () => {
  const { isAuthenticated, onboarding } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (onboarding.isComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  const steps = [
    { path: '/onboarding/pet-profile', label: 'Pet Profile' },
    { path: '/onboarding/health-info', label: 'Health Info' },
    { path: '/onboarding/preferences', label: 'Preferences' }
  ];

  const currentStepIndex = steps.findIndex(step => step.path === location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Logo size="large" className="mb-8" />
          
          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <nav className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.path}>
                  {index > 0 && (
                    <div className={`h-1 w-12 ${
                      index <= currentStepIndex ? 'bg-blue-500' : 'bg-gray-200'
                    }`} />
                  )}
                  <div className={`flex flex-col items-center ${
                    index === currentStepIndex ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      index === currentStepIndex 
                        ? 'border-blue-500 bg-blue-50' 
                        : index < currentStepIndex
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-200 bg-white'
                    }`}>
                      {index < currentStepIndex ? '✓' : index + 1}
                    </div>
                    <span className="text-xs mt-1">{step.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
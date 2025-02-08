// Add to existing types
export type OnboardingStep = 'pet-profile' | 'health-info' | 'preferences' | 'complete';

export interface OnboardingState {
  currentStep: OnboardingStep;
  isComplete: boolean;
}

// Update AuthState interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboarding: OnboardingState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateOnboarding: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  updateUserPets: (pets: Pet[]) => void;
}
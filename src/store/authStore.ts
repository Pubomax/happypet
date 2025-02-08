import { create } from 'zustand';
import { AuthState, OnboardingStep, Pet } from '../types';
import { registerUser, loginUser, logoutUser } from '../services/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  onboarding: {
    currentStep: 'pet-profile',
    isComplete: false
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const user = await loginUser(email, password);
      set({ 
        user, 
        isAuthenticated: true,
        onboarding: {
          currentStep: user.pets.length > 0 ? 'complete' : 'pet-profile',
          isComplete: user.pets.length > 0
        }
      });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      const user = await registerUser(email, password, name);
      set({ 
        user, 
        isAuthenticated: true,
        onboarding: {
          currentStep: 'pet-profile',
          isComplete: false
        }
      });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } finally {
      set({ 
        user: null, 
        isAuthenticated: false,
        onboarding: {
          currentStep: 'pet-profile',
          isComplete: false
        }
      });
    }
  },

  updateOnboarding: (step: OnboardingStep) => {
    set(state => ({
      onboarding: {
        ...state.onboarding,
        currentStep: step
      }
    }));
  },

  completeOnboarding: () => {
    set({
      onboarding: {
        currentStep: 'complete',
        isComplete: true
      }
    });
  },

  updateUserPets: (pets: Pet[]) => {
    set(state => ({
      user: state.user ? {
        ...state.user,
        pets
      } : null
    }));
  }
}));
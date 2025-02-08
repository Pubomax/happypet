import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { updatePetProfile } from '../../services/api';
import { Heart, Activity, Weight, Ruler } from 'lucide-react';

export const HealthInfo: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateOnboarding, updateUserPets } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    weight: '',
    height: '',
    temperature: '',
    heart_rate: '',
    activity_level: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.pets[0]) {
      setError('No pet profile found. Please go back and create a pet profile first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedPet = await updatePetProfile(user.pets[0].id, {
        weight: form.weight ? parseFloat(form.weight) : null,
        height: form.height ? parseFloat(form.height) : null,
        temperature: form.temperature ? parseFloat(form.temperature) : null,
        heart_rate: form.heart_rate ? parseInt(form.heart_rate) : null,
        activity_level: form.activity_level || null,
      });

      // Update the pets array in the global state
      updateUserPets([updatedPet]);
      
      updateOnboarding('preferences');
      navigate('/onboarding/preferences');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update health information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Health Information</h2>
          <p className="mt-2 text-gray-600">
            Help us understand your pet's health needs
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Weight (lbs)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Weight className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                id="weight"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="pl-10 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter weight"
              />
            </div>
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
              Height (inches)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ruler className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                id="height"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                className="pl-10 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter height"
              />
            </div>
          </div>

          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
              Temperature (°F)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                id="temperature"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                className="pl-10 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter temperature"
              />
            </div>
          </div>

          <div>
            <label htmlFor="heart_rate" className="block text-sm font-medium text-gray-700">
              Heart Rate (bpm)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Heart className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="0"
                id="heart_rate"
                value={form.heart_rate}
                onChange={(e) => setForm({ ...form, heart_rate: e.target.value })}
                className="pl-10 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter heart rate"
              />
            </div>
          </div>

          <div>
            <label htmlFor="activity_level" className="block text-sm font-medium text-gray-700">
              Activity Level
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="activity_level"
                value={form.activity_level}
                onChange={(e) => setForm({ ...form, activity_level: e.target.value })}
                className="pl-10 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select activity level</option>
                <option value="low">Low (0-2 hours daily)</option>
                <option value="moderate">Moderate (2-4 hours daily)</option>
                <option value="high">High (4+ hours daily)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};
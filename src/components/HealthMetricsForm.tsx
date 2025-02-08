import React, { useState } from 'react';
import { Ruler, Weight, Activity, Thermometer, Save, X } from 'lucide-react';
import { updatePetProfile } from '../services/api';
import { Pet } from '../types';

interface HealthMetricsFormProps {
  pet: Pet;
  onUpdate: (updatedPet: Pet) => void;
  onClose: () => void;
}

export const HealthMetricsForm: React.FC<HealthMetricsFormProps> = ({
  pet,
  onUpdate,
  onClose
}) => {
  const [metrics, setMetrics] = useState({
    height: pet.height || '',
    weight: pet.weight || '',
    temperature: pet.temperature || '',
    heartRate: pet.heart_rate || '',
    activityLevel: pet.activity_level || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updatedPet = await updatePetProfile(pet.id, {
        height: metrics.height ? parseFloat(metrics.height.toString()) : null,
        weight: metrics.weight ? parseFloat(metrics.weight.toString()) : null,
        temperature: metrics.temperature ? parseFloat(metrics.temperature.toString()) : null,
        heart_rate: metrics.heartRate ? parseInt(metrics.heartRate.toString()) : null,
        activity_level: metrics.activityLevel
      });
      onUpdate(updatedPet);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update health metrics');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Update Health Metrics</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Ruler className="w-4 h-4 mr-2" />
              Height (inches)
            </label>
            <input
              type="number"
              step="0.1"
              value={metrics.height}
              onChange={(e) => setMetrics({ ...metrics, height: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter height"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Weight className="w-4 h-4 mr-2" />
              Weight (lbs)
            </label>
            <input
              type="number"
              step="0.1"
              value={metrics.weight}
              onChange={(e) => setMetrics({ ...metrics, weight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter weight"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Thermometer className="w-4 h-4 mr-2" />
              Temperature (°F)
            </label>
            <input
              type="number"
              step="0.1"
              value={metrics.temperature}
              onChange={(e) => setMetrics({ ...metrics, temperature: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter temperature"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              value={metrics.heartRate}
              onChange={(e) => setMetrics({ ...metrics, heartRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter heart rate"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Activity className="w-4 h-4 mr-2" />
              Daily Activity Level
            </label>
            <select
              value={metrics.activityLevel}
              onChange={(e) => setMetrics({ ...metrics, activityLevel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select activity level</option>
              <option value="low">Low (0-2 hours)</option>
              <option value="moderate">Moderate (2-4 hours)</option>
              <option value="high">High (4+ hours)</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Metrics'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
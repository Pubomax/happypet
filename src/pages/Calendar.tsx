import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';

export const Calendar: React.FC = () => {
  const { user } = useAuthStore();
  const pet = user?.pets[0];

  if (!pet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No pet information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Calendar view coming soon</p>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { useAuthStore } from '../store/authStore';
import { AppointmentList } from '../components/AppointmentList';
import { Stethoscope, Plus } from 'lucide-react';

export const Care: React.FC = () => {
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
        <h1 className="text-2xl font-bold text-gray-900">Pet Care</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          <AppointmentList
            appointments={[]}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>

        {/* Medications Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Current Medications</h2>
          <div className="text-center py-8 text-gray-500">
            No medications added yet
          </div>
        </div>
      </div>
    </div>
  );
};
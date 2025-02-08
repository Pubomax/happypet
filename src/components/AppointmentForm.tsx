import React, { useState } from 'react';
import { Calendar, Clock, X, Save, MapPin, Phone, User, Building2, FileText } from 'lucide-react';
import { Appointment } from '../types';
import { createAppointment, updateAppointment } from '../services/api';

interface AppointmentFormProps {
  petId: string;
  appointment?: Appointment;
  onSave: (appointment: Appointment) => void;
  onClose: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  petId,
  appointment,
  onSave,
  onClose
}) => {
  const [form, setForm] = useState({
    title: appointment?.title || '',
    type: appointment?.type || 'checkup',
    date: appointment?.date || '',
    time: appointment?.time || '',
    duration: appointment?.duration || 30,
    notes: appointment?.notes || '',
    reminder: appointment?.reminder || true,
    vet_name: appointment?.vet_name || '',
    clinic_name: appointment?.clinic_name || '',
    clinic_address: appointment?.clinic_address || '',
    clinic_phone: appointment?.clinic_phone || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const appointmentData = {
        ...form,
        pet_id: petId,
        status: 'scheduled'
      };

      const savedAppointment = appointment
        ? await updateAppointment(appointment.id, appointmentData)
        : await createAppointment(appointmentData);

      onSave(savedAppointment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {appointment ? 'Edit Appointment' : 'Schedule New Appointment'}
          </h3>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Annual Checkup"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Appointment['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="checkup">Regular Checkup</option>
              <option value="vaccination">Vaccination</option>
              <option value="grooming">Grooming</option>
              <option value="emergency">Emergency</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                Date
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 mr-2" />
                Time
              </label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <select
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 mr-2" />
              Veterinarian Name
            </label>
            <input
              type="text"
              value={form.vet_name}
              onChange={(e) => setForm({ ...form, vet_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Dr. Smith"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Building2 className="w-4 h-4 mr-2" />
              Clinic Name
            </label>
            <input
              type="text"
              value={form.clinic_name}
              onChange={(e) => setForm({ ...form, clinic_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Happy Pets Veterinary Clinic"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <MapPin className="w-4 h-4 mr-2" />
              Clinic Address
            </label>
            <input
              type="text"
              value={form.clinic_address}
              onChange={(e) => setForm({ ...form, clinic_address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="123 Main St, City, State"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <Phone className="w-4 h-4 mr-2" />
              Clinic Phone
            </label>
            <input
              type="tel"
              value={form.clinic_phone}
              onChange={(e) => setForm({ ...form, clinic_phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Any special instructions or notes"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="reminder"
              checked={form.reminder}
              onChange={(e) => setForm({ ...form, reminder: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="reminder" className="ml-2 block text-sm text-gray-700">
              Send me a reminder
            </label>
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
              {isLoading ? 'Saving...' : 'Save Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
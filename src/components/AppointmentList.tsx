import React from 'react';
import { Calendar, Clock, MapPin, Phone, User, Building2, AlertCircle, Check, X, Pencil, AlertTriangle, Scissors } from 'lucide-react';
import { Appointment } from '../types';
import { format } from 'date-fns';

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Appointment['type']) => {
    switch (type) {
      case 'checkup':
        return <User className="w-5 h-5" />;
      case 'vaccination':
        return <AlertCircle className="w-5 h-5" />;
      case 'grooming':
        return <Scissors className="w-5 h-5" />;
      case 'emergency':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No appointments scheduled</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${
                appointment.type === 'emergency' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {getTypeIcon(appointment.type)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(appointment.date), 'MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    {appointment.time} ({appointment.duration} minutes)
                  </div>
                  {appointment.vet_name && (
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-2" />
                      {appointment.vet_name}
                    </div>
                  )}
                  {appointment.clinic_name && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Building2 className="w-4 h-4 mr-2" />
                      {appointment.clinic_name}
                    </div>
                  )}
                  {appointment.clinic_address && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {appointment.clinic_address}
                    </div>
                  )}
                  {appointment.clinic_phone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-2" />
                      {appointment.clinic_phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
              <button
                onClick={() => onEdit(appointment)}
                className="p-1 text-gray-400 hover:text-gray-500"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(appointment.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {appointment.notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">{appointment.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
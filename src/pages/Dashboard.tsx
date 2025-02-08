import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Timeline } from '../components/Timeline';
import { AddTimelineEventForm } from '../components/AddTimelineEventForm';
import { getTimelineEvents, getHealthHistory } from '../services/api';
import { TimelineEvent, HealthMetric } from '../types';
import { 
  Activity, Heart, Syringe, Brain, 
  Pill, Phone, AlertTriangle, Apple,
  ChevronRight, Plus, Calendar, Ruler,
  Thermometer, X
} from 'lucide-react';
import { AppointmentForm } from '../components/AppointmentForm';
import { AppointmentList } from '../components/AppointmentList';
import { getAppointments, deleteAppointment } from '../services/api';
import { Appointment } from '../types';
import { HealthHistory } from '../components/HealthHistory';
import { MobileFeatures } from '../components/MobileFeatures';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const pet = user?.pets[0];
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState(new Date().toISOString());

  useEffect(() => {
    if (pet?.id) {
      loadAppointments();
      loadTimelineEvents();
      loadHealthMetrics();
    }
  }, [pet?.id]);

  const loadTimelineEvents = async () => {
    if (!pet?.id) return;
    try {
      const events = await getTimelineEvents(pet.id);
      setTimelineEvents(events);
    } catch (error) {
      console.error('Failed to load timeline events:', error);
    }
  };

  const loadAppointments = async () => {
    if (!pet?.id) return;
    try {
      const data = await getAppointments(pet.id);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    }
  };

  const loadHealthMetrics = async () => {
    if (!pet?.id) return;
    try {
      const metrics = await getHealthHistory(pet.id);
      setHealthMetrics(metrics);
    } catch (error) {
      console.error('Failed to load health metrics:', error);
    }
  };

  const handleAppointmentSave = (appointment: Appointment) => {
    setAppointments(prev => {
      const index = prev.findIndex(a => a.id === appointment.id);
      if (index >= 0) {
        return [...prev.slice(0, index), appointment, ...prev.slice(index + 1)];
      }
      return [...prev, appointment];
    });
    setShowAppointmentForm(false);
    setSelectedAppointment(undefined);
  };

  const handleAppointmentDelete = async (appointmentId: string) => {
    try {
      await deleteAppointment(appointmentId);
      setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  };

  const formatMetric = (value: number | undefined | null, unit: string) => {
    if (value === undefined || value === null) return 'Not recorded';
    return `${value} ${unit}`;
  };

  const getMetricStatus = (value: number | undefined | null) => {
    if (value === undefined || value === null) return 'no-data';
    return 'normal'; // In a real app, we would have logic to determine status based on normal ranges
  };

  const healthMetricsDisplay = pet ? [
    { 
      label: 'Heart Rate', 
      value: formatMetric(pet.heart_rate, 'bpm'), 
      status: getMetricStatus(pet.heart_rate),
      icon: Heart
    },
    { 
      label: 'Weight', 
      value: formatMetric(pet.weight, 'lbs'), 
      status: getMetricStatus(pet.weight),
      icon: Activity
    },
    { 
      label: 'Temperature', 
      value: formatMetric(pet.temperature, '°F'), 
      status: getMetricStatus(pet.temperature),
      icon: Thermometer
    },
    { 
      label: 'Activity', 
      value: pet.activity_level || 'Not recorded', 
      status: pet.activity_level ? 'normal' : 'no-data',
      icon: Activity
    }
  ] : [];

  if (!pet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No pet information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Timeline
        events={timelineEvents}
        onAddEvent={() => setShowAddEventForm(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <HealthHistory metrics={healthMetrics} />
          
          {/* Health Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Heart className="w-5 h-5 text-red-500 mr-2" />
                Health Overview
              </h2>
              <Link 
                to="/profile" 
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                Update Metrics
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {healthMetricsDisplay.map((metric) => (
                <div key={metric.label} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <metric.icon className={`w-5 h-5 ${
                      metric.status === 'normal' ? 'text-green-500' :
                      metric.status === 'warning' ? 'text-yellow-500' :
                      metric.status === 'alert' ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <p className="text-sm text-gray-500">{metric.label}</p>
                  </div>
                  <p className="text-lg font-semibold mt-1">{metric.value}</p>
                  {metric.status !== 'no-data' && (
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      metric.status === 'normal' ? 'bg-green-100 text-green-800' :
                      metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {metric.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                Upcoming Appointments
              </h2>
              <button
                onClick={() => setShowAppointmentForm(true)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Schedule Visit
              </button>
            </div>
            
            <AppointmentList
              appointments={appointments}
              onEdit={(appointment) => {
                setSelectedAppointment(appointment);
                setShowAppointmentForm(true);
              }}
              onDelete={handleAppointmentDelete}
            />
          </div>
        </div>
      </div>

      {showAddEventForm && pet && (
        <AddTimelineEventForm
          petId={pet.id}
          onSave={(event) => {
            setTimelineEvents(prev => [event, ...prev]);
            setShowAddEventForm(false);
          }}
          onClose={() => setShowAddEventForm(false)}
        />
      )}

      {/* Appointment Form Modal */}
      {showAppointmentForm && pet && (
        <AppointmentForm
          petId={pet.id}
          appointment={selectedAppointment}
          onSave={handleAppointmentSave}
          onClose={() => {
            setShowAppointmentForm(false);
            setSelectedAppointment(undefined);
          }}
        />
      )}
    </div>
  );
};
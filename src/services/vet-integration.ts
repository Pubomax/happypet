import { supabase } from '../lib/supabase';
import { VetClinic, AvailableSlot, ClinicService } from '../types';

// Supported practice management systems
const SUPPORTED_PMS = {
  IDEXX: 'idexx',
  EZYVET: 'ezyvet',
  COVETRUS: 'covetrus',
  VETTER: 'vetter'
} as const;

interface BookingRequest {
  clinic_id: string;
  service_id: string;
  pet_id: string;
  start_time: string;
  notes?: string;
}

export const getConnectedClinics = async (): Promise<VetClinic[]> => {
  const { data, error } = await supabase
    .from('vet_clinics')
    .select('*')
    .eq('status', 'active');

  if (error) throw error;
  return data || [];
};

export const getClinicServices = async (clinicId: string): Promise<ClinicService[]> => {
  const { data, error } = await supabase
    .from('clinic_services')
    .select('*')
    .eq('clinic_id', clinicId);

  if (error) throw error;
  return data || [];
};

export const getAvailableSlots = async (
  clinicId: string,
  serviceId: string,
  date: string
): Promise<AvailableSlot[]> => {
  // First, get the clinic's integration type
  const { data: clinic } = await supabase
    .from('vet_clinics')
    .select('integration_type, integration_id')
    .eq('id', clinicId)
    .single();

  if (!clinic) throw new Error('Clinic not found');

  // For direct integrations, fetch from the clinic's API
  if (clinic.integration_type === 'direct') {
    return fetchDirectAvailability(clinic.integration_id!, serviceId, date);
  }

  // For manual integrations, fetch from our database
  const { data, error } = await supabase
    .from('clinic_availability')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('service_id', serviceId)
    .gte('start_time', `${date}T00:00:00`)
    .lte('start_time', `${date}T23:59:59`)
    .eq('status', 'available');

  if (error) throw error;
  return data || [];
};

const fetchDirectAvailability = async (
  integrationId: string,
  serviceId: string,
  date: string
): Promise<AvailableSlot[]> => {
  // This would be replaced with actual API calls to different PMS systems
  const baseUrl = import.meta.env.VITE_VET_INTEGRATION_API_URL;
  
  try {
    const response = await fetch(`${baseUrl}/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_VET_INTEGRATION_API_KEY}`
      },
      body: JSON.stringify({
        integration_id: integrationId,
        service_id: serviceId,
        date
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch availability');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching direct availability:', error);
    throw error;
  }
};

export const bookAppointment = async (request: BookingRequest): Promise<void> => {
  // Get clinic integration details
  const { data: clinic } = await supabase
    .from('vet_clinics')
    .select('integration_type, integration_id')
    .eq('id', request.clinic_id)
    .single();

  if (!clinic) throw new Error('Clinic not found');

  // For direct integrations, book through the clinic's API
  if (clinic.integration_type === 'direct') {
    await bookDirectAppointment(clinic.integration_id!, request);
  }

  // Create the appointment in our system
  const { error } = await supabase
    .from('appointments')
    .insert([{
      pet_id: request.pet_id,
      clinic_id: request.clinic_id,
      service_id: request.service_id,
      start_time: request.start_time,
      notes: request.notes,
      status: 'scheduled'
    }]);

  if (error) throw error;
};

const bookDirectAppointment = async (
  integrationId: string,
  request: BookingRequest
): Promise<void> => {
  const baseUrl = import.meta.env.VITE_VET_INTEGRATION_API_URL;

  const response = await fetch(`${baseUrl}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_VET_INTEGRATION_API_KEY}`
    },
    body: JSON.stringify({
      integration_id: integrationId,
      ...request
    })
  });

  if (!response.ok) {
    throw new Error('Failed to book appointment with clinic');
  }
};
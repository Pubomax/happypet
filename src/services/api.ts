import { supabase } from '../lib/supabase';
import { Pet, Profile, MedicalRecord, Appointment, TimelineEvent } from '../types';

export const createPet = async (data: {
  owner_id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  height?: number;
  activity_level?: string;
}): Promise<Pet> => {
  // First get the profile ID for the current user
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .single();

  if (profileError) throw profileError;
  if (!profile) throw new Error('Profile not found');

  // Create pet using the profile ID as owner_id
  const { data: pet, error } = await supabase
    .from('pets')
    .insert([{ ...data, owner_id: profile.id }])
    .select('*')
    .single();

  if (error) throw error;
  if (!pet) throw new Error('Failed to create pet');

  return pet;
};

export const updatePetProfile = async (
  petId: string,
  data: Partial<Pet>
): Promise<Pet> => {
  // Ensure all numeric fields are properly typed
  const sanitizedData = {
    ...data,
    weight: data.weight ? Number(data.weight) : undefined,
    height: data.height ? Number(data.height) : undefined,
    temperature: data.temperature ? Number(data.temperature) : undefined,
    heart_rate: data.heart_rate ? Number(data.heart_rate) : undefined,
    updated_at: new Date().toISOString()
  };

  const { data: updatedPet, error } = await supabase
    .from('pets')
    .update(sanitizedData)
    .eq('id', petId)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating pet profile:', error);
    throw error;
  }
  
  if (!updatedPet) {
    throw new Error('Failed to update pet profile');
  }

  return updatedPet;
};

export const addMedicalRecord = async (
  petId: string,
  type: string,
  date: string,
  details: string
): Promise<MedicalRecord> => {
  const { data, error } = await supabase
    .from('medical_records')
    .insert([{ pet_id: petId, type, date, details }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getMedicalRecords = async (petId: string): Promise<MedicalRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('pet_id', petId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching medical records:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return [];
  }
};

export const uploadPetImage = async (
  file: File,
  path: string
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('pet-images')
    .upload(path, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('pet-images')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const createAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return appointment;
};

export const updateAppointment = async (
  id: string,
  data: Partial<Appointment>
): Promise<Appointment> => {
  const { data: appointment, error } = await supabase
    .from('appointments')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return appointment;
};

export const getAppointments = async (petId: string): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('pet_id', petId)
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const deleteAppointment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getHealthHistory = async (petId: string): Promise<HealthMetric[]> => {
  const { data, error } = await supabase
    .from('health_metrics')
    .select('*')
    .eq('pet_id', petId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getTimelineEvents = async (petId: string): Promise<TimelineEvent[]> => {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('pet_id', petId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addTimelineEvent = async (
  data: Omit<TimelineEvent, 'id' | 'created_at'>
): Promise<TimelineEvent> => {
  const { data: event, error } = await supabase
    .from('timeline_events')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return event;
};
import { supabase } from '../lib/supabase';
import { User } from '../types';

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error('Failed to create user account');
  }

  try {
    // 2. Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        user_id: authData.user.id,
        name: name,
      }])
      .select()
      .single();

    if (profileError) throw new Error('Failed to create user profile');
    if (!profileData) throw new Error('Profile data is missing');

    return {
      id: authData.user.id,
      email: authData.user.email!,
      name: profileData.name,
      pets: [],
      createdAt: profileData.created_at,
    };
  } catch (error) {
    // Cleanup on any error
    await supabase.auth.signOut();
    throw error;
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  // 1. Sign in user
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    throw new Error('Invalid email or password');
  }

  if (!authData.user) {
    throw new Error('Login failed');
  }

  try {
    // 2. Get profile data with pets in a single query
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        pets:pets(*)
      `)
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) throw new Error('Failed to fetch user profile');
    if (!profiles) throw new Error('Profile not found');

    return {
      id: authData.user.id,
      email: authData.user.email!,
      name: profiles.name,
      pets: profiles.pets || [],
      createdAt: profiles.created_at,
    };
  } catch (error) {
    // Cleanup on any error
    await supabase.auth.signOut();
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error('Failed to log out');
  }
};
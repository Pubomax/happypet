import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PawPrint, Heart, Shield, UserPlus } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ownerName: '',
    email: '',
    password: '',
  });
  const { register, isLoading } = useAuthStore();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form.email, form.password, form.ownerName);
      navigate('/onboarding/pet-profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Welcome to HappyPet
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our premium pet care community and give your furry family member the
            exceptional care they deserve.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Information */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
              <div className="flex items-center space-x-3 mb-8">
                <PawPrint className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Create your account</h2>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-pink-300" />
                  <p>Premium pet care tracking and monitoring</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-300" />
                  <p>24/7 veterinary consultation access</p>
                </div>
                <div className="flex items-center space-x-3">
                  <PawPrint className="w-5 h-5 text-yellow-300" />
                  <p>Personalized care recommendations</p>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-lg font-medium mb-4">What's next?</p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">1</div>
                    <p>Create your account</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">2</div>
                    <p>Set up your pet's profile</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">3</div>
                    <p>Add health information</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">4</div>
                    <p>Customize your preferences</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="p-8">
              <div className="max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                      Your name
                    </label>
                    <input
                      id="ownerName"
                      type="text"
                      required
                      value={form.ownerName}
                      onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    {isLoading ? 'Creating your account...' : 'Get Started'}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
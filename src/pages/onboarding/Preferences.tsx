import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Bell, Shield, Settings } from 'lucide-react';

export const Preferences: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuthStore();
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      reminders: true
    },
    privacy: {
      profileVisibility: 'friends',
      shareLocation: false,
      shareAnalytics: true
    },
    features: {
      autoSync: true,
      darkMode: false,
      offlineAccess: true
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Customize Your Experience</h2>
          <p className="mt-2 text-gray-600">
            Set up your preferences for the best experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Notifications */}
          <div>
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.notifications.email}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    notifications: {
                      ...preferences.notifications,
                      email: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Email notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.notifications.push}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    notifications: {
                      ...preferences.notifications,
                      push: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Push notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.notifications.reminders}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    notifications: {
                      ...preferences.notifications,
                      reminders: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Care reminders</span>
              </label>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Privacy</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Profile Visibility</label>
                <select
                  value={preferences.privacy.profileVisibility}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    privacy: {
                      ...preferences.privacy,
                      profileVisibility: e.target.value
                    }
                  })}
                  className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.privacy.shareLocation}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    privacy: {
                      ...preferences.privacy,
                      shareLocation: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Share location data</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.privacy.shareAnalytics}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    privacy: {
                      ...preferences.privacy,
                      shareAnalytics: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Share analytics data</span>
              </label>
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Features</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.features.autoSync}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    features: {
                      ...preferences.features,
                      autoSync: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Automatic data sync</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.features.darkMode}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    features: {
                      ...preferences.features,
                      darkMode: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Dark mode</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.features.offlineAccess}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    features: {
                      ...preferences.features,
                      offlineAccess: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Offline access</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
};
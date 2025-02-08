import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  HelpCircle,
  Lock,
  Eye,
  Share2,
  Globe,
  Users,
  Key,
  Smartphone,
  AlertTriangle,
  History
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'account');

  // Example privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'friends',
    locationSharing: false,
    dataCollection: true,
    thirdPartySharing: false,
    activityVisibility: 'private',
    analyticsConsent: true
  });

  // Example security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    deviceHistory: true,
    dataEncryption: true
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please sign in to access settings</p>
      </div>
    );
  }

  const settingsSections = [
    {
      id: 'account',
      title: 'Account',
      icon: User,
      items: [
        { name: 'Profile Information', description: 'Update your personal details' },
        { name: 'Email & Password', description: 'Manage your login credentials' },
        { name: 'Connected Accounts', description: 'Manage linked services and apps' }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        { name: 'Email Notifications', description: 'Configure email alert preferences' },
        { name: 'Push Notifications', description: 'Manage app notification settings' },
        { name: 'Reminders', description: 'Set up care and medication reminders' }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: Shield,
      items: [
        { 
          name: 'Profile Visibility',
          description: 'Control who can see your profile',
          type: 'select',
          options: ['public', 'friends', 'private'],
          value: privacySettings.profileVisibility,
          onChange: (value: string) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))
        },
        {
          name: 'Location Sharing',
          description: 'Manage location data sharing preferences',
          type: 'toggle',
          value: privacySettings.locationSharing,
          onChange: () => setPrivacySettings(prev => ({ ...prev, locationSharing: !prev.locationSharing }))
        },
        {
          name: 'Data Collection',
          description: 'Control how we collect and use your data',
          type: 'toggle',
          value: privacySettings.dataCollection,
          onChange: () => setPrivacySettings(prev => ({ ...prev, dataCollection: !prev.dataCollection }))
        },
        {
          name: 'Third-Party Sharing',
          description: 'Manage data sharing with partners',
          type: 'toggle',
          value: privacySettings.thirdPartySharing,
          onChange: () => setPrivacySettings(prev => ({ ...prev, thirdPartySharing: !prev.thirdPartySharing }))
        },
        {
          name: 'Activity Visibility',
          description: 'Control who can see your pet\'s activities',
          type: 'select',
          options: ['public', 'friends', 'private'],
          value: privacySettings.activityVisibility,
          onChange: (value: string) => setPrivacySettings(prev => ({ ...prev, activityVisibility: value }))
        },
        {
          name: 'Analytics Consent',
          description: 'Allow anonymous data collection for service improvement',
          type: 'toggle',
          value: privacySettings.analyticsConsent,
          onChange: () => setPrivacySettings(prev => ({ ...prev, analyticsConsent: !prev.analyticsConsent }))
        }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: Lock,
      items: [
        {
          name: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle',
          value: securitySettings.twoFactorAuth,
          onChange: () => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))
        },
        {
          name: 'Login Alerts',
          description: 'Get notified of new sign-ins to your account',
          type: 'toggle',
          value: securitySettings.loginAlerts,
          onChange: () => setSecuritySettings(prev => ({ ...prev, loginAlerts: !prev.loginAlerts }))
        },
        {
          name: 'Device History',
          description: 'View and manage devices that have accessed your account',
          type: 'toggle',
          value: securitySettings.deviceHistory,
          onChange: () => setSecuritySettings(prev => ({ ...prev, deviceHistory: !prev.deviceHistory }))
        },
        {
          name: 'Data Encryption',
          description: 'Enable end-to-end encryption for sensitive data',
          type: 'toggle',
          value: securitySettings.dataEncryption,
          onChange: () => setSecuritySettings(prev => ({ ...prev, dataEncryption: !prev.dataEncryption }))
        }
      ]
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      items: [
        { name: 'Documentation', description: 'View guides and tutorials' },
        { name: 'Contact Support', description: 'Get help with any issues' },
        { name: 'FAQs', description: 'Find answers to common questions' }
      ]
    }
  ];

  const activeSection = settingsSections.find(section => section.id === activeTab) || settingsSections[0];

  const renderSettingControl = (item: any) => {
    switch (item.type) {
      case 'select':
        return (
          <select
            value={item.value}
            onChange={(e) => item.onChange(e.target.value)}
            className="mt-1 block w-40 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            {item.options.map((option: string) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );
      case 'toggle':
        return (
          <button
            onClick={() => item.onChange()}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              item.value ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                item.value ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <SettingsIcon className="w-6 h-6 text-gray-900 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Settings tabs">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                    activeTab === section.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {section.title}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {activeSection.items.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                {renderSettingControl(item)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
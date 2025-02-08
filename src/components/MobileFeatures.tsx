import React, { useState } from 'react';
import { 
  Bell, 
  Camera, 
  Wifi, 
  WifiOff, 
  Map, 
  Navigation, 
  Clock,
  Pill,
  Upload,
  Check,
  AlertTriangle
} from 'lucide-react';

interface WalkData {
  date: string;
  duration: number;
  distance: number;
  route: string[];
}

interface MobileFeaturesProps {
  isOnline: boolean;
  lastSync: string;
  pendingNotifications: number;
  walkHistory: WalkData[];
  onPhotoCapture: () => void;
  onVideoCapture: () => void;
}

export const MobileFeatures: React.FC<MobileFeaturesProps> = ({
  isOnline,
  lastSync,
  pendingNotifications,
  walkHistory,
  onPhotoCapture,
  onVideoCapture
}) => {
  const [showOfflineData, setShowOfflineData] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Mobile Features</h2>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm text-gray-500">
              Last sync: {new Date(lastSync).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Capture */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Capture</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onPhotoCapture}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors"
            >
              <Camera className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Take Photo</span>
            </button>
            <button
              onClick={onVideoCapture}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors"
            >
              <Upload className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Record Video</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            {pendingNotifications > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {pendingNotifications} pending
              </span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center">
                <Pill className="w-5 h-5 text-purple-500 mr-3" />
                <span className="text-sm text-gray-700">Medication Reminders</span>
              </div>
              <Check className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-sm text-gray-700">Walk Time Alerts</span>
              </div>
              <Check className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        {/* Offline Access */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Offline Access</h3>
            <button
              onClick={() => setShowOfflineData(!showOfflineData)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showOfflineData ? 'Hide' : 'Show'} data
            </button>
          </div>
          {showOfflineData && (
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Medical Records</span>
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-xs text-gray-500">Last 3 months available offline</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Emergency Info</span>
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-xs text-gray-500">Always available offline</p>
              </div>
            </div>
          )}
        </div>

        {/* Walk Tracking */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Walk Tracking</h3>
          <div className="space-y-3">
            {walkHistory.map((walk, index) => (
              <div key={index} className="p-3 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(walk.date).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {walk.duration} mins • {walk.distance} km
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Map className="w-4 h-4 mr-1" />
                  <span>Route saved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isOnline && (
        <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-100">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">
              You're offline. Some features may be limited.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
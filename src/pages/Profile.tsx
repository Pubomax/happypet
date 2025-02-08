import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Camera, Weight, Calendar, Heart, PawPrint, Pencil, Plus, Save, X, Activity, Ruler, Thermometer } from 'lucide-react';
import { updatePetProfile, addMedicalRecord, getMedicalRecords, uploadPetImage } from '../services/api';
import { Pet, MedicalRecord } from '../types';
import { HealthMetricsForm } from '../components/HealthMetricsForm';

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [pet, setPet] = useState<Pet | null>(user?.pets[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: pet?.name || '',
    species: pet?.species || '',
    breed: pet?.breed || '',
    age: pet?.age || 0,
    weight: pet?.weight || 0
  });
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHealthMetrics, setShowHealthMetrics] = useState(false);

  useEffect(() => {
    if (pet?.id) {
      loadMedicalRecords();
    }
  }, [pet?.id]);

  const loadMedicalRecords = async () => {
    try {
      if (!pet?.id) return;
      const records = await getMedicalRecords(pet.id);
      setMedicalRecords(records);
    } catch (err) {
      setError('Failed to load medical records');
    }
  };

  const handleEditSubmit = async () => {
    try {
      setIsLoading(true);
      if (!pet?.id) return;

      const updatedPet = await updatePetProfile(pet.id, editForm);
      setPet(updatedPet);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update pet profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    try {
      const file = event.target.files?.[0];
      if (!file || !pet?.id) return;

      const path = `${pet.id}/${type}-${Date.now()}`;
      const publicUrl = await uploadPetImage(file, path);

      const field = type === 'avatar' ? 'avatar_url' : 'cover_url';
      const updatedPet = await updatePetProfile(pet.id, { [field]: publicUrl });
      setPet(updatedPet);
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  const getHealthStatus = (pet: Pet) => {
    if (!pet.temperature && !pet.heart_rate && !pet.weight) {
      return 'No data';
    }
    return 'Healthy';
  };

  const formatMetric = (value: number | undefined | null, unit: string) => {
    if (value === undefined || value === null) return 'Not recorded';
    return `${value} ${unit}`;
  };

  const healthMetrics = [
    { 
      label: 'Height', 
      value: formatMetric(pet?.height, 'in'), 
      icon: Ruler,
      status: pet?.height ? 'normal' : 'no-data'
    },
    { 
      label: 'Weight', 
      value: formatMetric(pet?.weight, 'lbs'), 
      icon: Weight,
      status: pet?.weight ? 'normal' : 'no-data'
    },
    { 
      label: 'Temperature', 
      value: formatMetric(pet?.temperature, '°F'), 
      icon: Thermometer,
      status: pet?.temperature ? 'normal' : 'no-data'
    },
    { 
      label: 'Heart Rate', 
      value: formatMetric(pet?.heart_rate, 'bpm'), 
      icon: Heart,
      status: pet?.heart_rate ? 'normal' : 'no-data'
    },
    { 
      label: 'Activity Level', 
      value: pet?.activity_level || 'Not recorded', 
      icon: Activity,
      status: pet?.activity_level ? 'normal' : 'no-data'
    }
  ];

  if (!pet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No pet information available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            className="absolute top-0 right-0 p-4"
            onClick={() => setError(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pet Header with Cover Photo */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="relative h-60">
          <img
            src={pet.cover_url || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <label className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'cover')}
            />
            <Camera className="w-5 h-5" />
          </label>
        </div>

        {/* Profile Section */}
        <div className="relative px-6 pb-6">
          <div className="flex justify-between items-end -mt-16">
            <div className="flex items-end space-x-5">
              <div className="relative">
                <img
                  src={pet.avatar_url || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400"}
                  alt={pet.name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
                <label className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-sm cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                  />
                  <Camera className="w-4 h-4 text-gray-600" />
                </label>
              </div>
              <div className="pb-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-3xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.breed}
                    onChange={(e) => setEditForm({ ...editForm, breed: e.target.value })}
                    className="text-gray-600 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-600">{pet.breed || 'Add Breed'}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Health Overview */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Health Overview</h2>
          <button
            onClick={() => setShowHealthMetrics(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Update Metrics
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {healthMetrics.map(({ label, value, icon: Icon, status }) => (
            <div key={label} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Icon className={`w-5 h-5 ${
                  status === 'normal' ? 'text-green-500' :
                  status === 'warning' ? 'text-yellow-500' :
                  status === 'alert' ? 'text-red-500' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-base font-medium text-gray-900">{value}</p>
                {status !== 'no-data' && (
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    status === 'normal' ? 'bg-green-100 text-green-800' :
                    status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Metrics Modal */}
      {showHealthMetrics && pet && (
        <HealthMetricsForm
          pet={pet}
          onUpdate={(updatedPet) => {
            setPet(updatedPet);
            setShowHealthMetrics(false);
          }}
          onClose={() => setShowHealthMetrics(false)}
        />
      )}

      {/* Medical Records */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Medical Records</h2>
          <button className="flex items-center text-blue-600 hover:text-blue-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Record
          </button>
        </div>
        <div className="space-y-6">
          {medicalRecords.map((record) => (
            <div key={record.id} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
              <div className="flex-shrink-0 w-16">
                <p className="text-sm font-medium text-gray-900">
                  {new Date(record.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-base font-medium text-gray-900">{record.type}</p>
                <p className="text-sm text-gray-500 mt-1">{record.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Care Instructions */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Care Instructions</h2>
          {isEditing && (
            <button className="text-blue-600 hover:text-blue-700">
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="prose max-w-none">
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Feed twice daily - Morning (7 AM) and Evening (6 PM)</li>
            <li>Daily exercise - 30 minutes walk in the morning, 20 minutes play in the evening</li>
            <li>Brush teeth weekly</li>
            <li>Monthly grooming appointment</li>
            <li>Keep fresh water available at all times</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
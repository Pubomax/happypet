import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { createPet } from '../../services/api';
import { PawPrint } from 'lucide-react';

export const PetProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateOnboarding, updateUserPets } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const pet = await createPet({
        owner_id: user.id,
        name: form.name,
        species: form.species,
        breed: form.breed || undefined,
        age: form.age ? parseInt(form.age) : undefined,
      });

      // Update the user's pets array in the global state
      updateUserPets([pet]);
      
      updateOnboarding('health-info');
      navigate('/onboarding/health-info');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pet profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <PawPrint className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Tell us about your pet</h2>
          <p className="mt-2 text-gray-600">
            Let's start with the basics about your furry friend
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Pet's Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="What's your pet's name?"
            />
          </div>

          <div>
            <label htmlFor="species" className="block text-sm font-medium text-gray-700">
              Species
            </label>
            <select
              id="species"
              required
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="dog">Dog 🐕</option>
              <option value="cat">Cat 🐱</option>
              <option value="bird">Bird 🦜</option>
              <option value="rabbit">Rabbit 🐰</option>
              <option value="hamster">Hamster 🐹</option>
              <option value="fish">Fish 🐠</option>
              <option value="other">Other Pet</option>
            </select>
          </div>

          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
              Breed (Optional)
            </label>
            <input
              id="breed"
              type="text"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="What breed is your pet?"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age (Optional)
            </label>
            <input
              id="age"
              type="number"
              min="0"
              max="30"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="How old is your pet?"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Profile...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};
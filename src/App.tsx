import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './components/AuthLayout';
import { ProtectedLayout } from './components/ProtectedLayout';
import { OnboardingLayout } from './components/OnboardingLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Health } from './pages/Health';
import { Care } from './pages/Care';
import { Calendar } from './pages/Calendar';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { PetProfile } from './pages/onboarding/PetProfile';
import { HealthInfo } from './pages/onboarding/HealthInfo';
import { Preferences } from './pages/onboarding/Preferences';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<OnboardingLayout />}>
          <Route path="/onboarding/pet-profile" element={<PetProfile />} />
          <Route path="/onboarding/health-info" element={<HealthInfo />} />
          <Route path="/onboarding/preferences" element={<Preferences />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/health" element={<Health />} />
          <Route path="/care" element={<Care />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
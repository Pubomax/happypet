import React from 'react';
import logo from '../assets/logo.svg';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-32',
    medium: 'w-48',
    large: 'w-64'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={logo} 
        alt="HAPPY pet" 
        className={`${sizeClasses[size]} h-auto`} 
      />
      <p className={`text-gray-600 mt-2 text-center ${
        size === 'large' ? 'text-lg' : 'text-sm'
      }`}>
        YOUR PET'S HEALTH, SIMPLIFIED!
      </p>
    </div>
  );
};
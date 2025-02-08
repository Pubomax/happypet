import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { HealthHistory } from '../components/HealthHistory';
import { HealthInsights } from '../components/HealthInsights';
import { DocumentManager } from '../components/DocumentManager';
import { AdvancedAnalytics } from '../components/AdvancedAnalytics';
import BehaviorAnalyzer from '../components/BehaviorAnalyzer';
import { Activity, Plus } from 'lucide-react';

export const Health: React.FC = () => {
  const { user } = useAuthStore();
  const pet = user?.pets[0];

  // Example analytics data
  const analyticsData = {
    healthScore: {
      overall: 85,
      activity: 90,
      nutrition: 82,
      medical: 88,
      wellness: 80
    },
    predictiveAlerts: [
      {
        type: 'Dental Check',
        description: 'Based on age and breed, dental cleaning may be needed soon',
        probability: 0.75,
        suggestedAction: 'Schedule dental exam',
        timeframe: 'Next 2 months'
      },
      {
        type: 'Weight Trend',
        description: 'Slight increase in weight detected',
        probability: 0.65,
        suggestedAction: 'Review diet plan',
        timeframe: 'Monitor weekly'
      }
    ],
    costMetrics: [
      {
        category: 'Veterinary Care',
        amount: 450,
        trend: 'stable' as const,
        percentage: 0
      },
      {
        category: 'Medications',
        amount: 120,
        trend: 'down' as const,
        percentage: 15
      },
      {
        category: 'Nutrition',
        amount: 200,
        trend: 'up' as const,
        percentage: 8
      }
    ],
    wellnessMetrics: [
      {
        category: 'Exercise Routine',
        status: 'optimal' as const,
        recommendation: 'Maintain current activity level of 45 mins daily'
      },
      {
        category: 'Diet Balance',
        status: 'good' as const,
        recommendation: 'Consider adding omega-3 supplements'
      },
      {
        category: 'Preventive Care',
        status: 'attention' as const,
        recommendation: 'Vaccination boosters due in 3 weeks'
      }
    ]
  };

  // Example insights data
  const insights = [
    {
      type: 'trend' as const,
      title: 'Activity Level Increasing',
      description: 'Weekly activity levels have increased by 15% over the past month.',
      timestamp: '2 hours ago',
      metrics: [
        { label: 'Daily Activity', value: '45 mins', trend: 'up' as const },
        { label: 'Rest Periods', value: '6.5 hrs', trend: 'stable' as const },
        { label: 'Energy Level', value: 'High', trend: 'up' as const }
      ]
    },
    {
      type: 'alert' as const,
      title: 'Seasonal Allergy Alert',
      description: 'Pollen levels are high in your area. Monitor for symptoms.',
      severity: 'medium' as const,
      timestamp: '1 day ago'
    }
  ];

  // Example documents data
  const documents = [
    {
      id: '1',
      title: 'Annual Checkup Report',
      type: 'veterinary' as const,
      date: '2024-02-15',
      fileUrl: '#',
      fileSize: '2.4 MB',
      tags: ['checkup', '2024']
    },
    {
      id: '2',
      title: 'Insurance Policy',
      type: 'insurance' as const,
      date: '2024-01-01',
      fileUrl: '#',
      fileSize: '1.8 MB',
      tags: ['insurance', 'policy']
    }
  ];

  const handleDocumentUpload = async (
    file: File,
    type: string,
    title: string,
    tags: string[]
  ) => {
    console.log('Uploading document:', { file, type, title, tags });
  };

  const handleDocumentDelete = async (documentId: string) => {
    console.log('Deleting document:', documentId);
  };

  if (!pet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No pet information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Health Record
        </button>
      </div>

      <BehaviorAnalyzer />

      <AdvancedAnalytics {...analyticsData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthInsights insights={insights} />
        <HealthHistory metrics={[]} />
      </div>

      <DocumentManager
        documents={documents}
        onUpload={handleDocumentUpload}
        onDelete={handleDocumentDelete}
      />
    </div>
  );
};
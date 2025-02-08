import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Leaf, Activity, Heart } from 'lucide-react';

interface HealthInsight {
  type: 'trend' | 'alert' | 'recommendation' | 'seasonal';
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  timestamp: string;
  metrics?: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

interface HealthInsightsProps {
  insights: HealthInsight[];
}

export const HealthInsights: React.FC<HealthInsightsProps> = ({ insights }) => {
  const getInsightIcon = (type: HealthInsight['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'recommendation':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'seasonal':
        return <Leaf className="w-5 h-5 text-green-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: HealthInsight['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      case 'stable':
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">AI Health Insights</h2>
          </div>
          <span className="text-sm text-gray-500">Updated daily</span>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {insights.map((insight, index) => (
          <div key={index} className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-gray-900">{insight.title}</p>
                  <span className="text-sm text-gray-500">{insight.timestamp}</span>
                </div>
                <p className="mt-1 text-gray-600">{insight.description}</p>
                
                {insight.metrics && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {insight.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{metric.label}</span>
                          {getTrendIcon(metric.trend)}
                        </div>
                        <p className="mt-1 text-lg font-medium">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {insight.severity && (
                  <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(insight.severity)}`}>
                    {insight.severity === 'high' ? 'High Priority' : 
                     insight.severity === 'medium' ? 'Moderate Priority' : 
                     'Low Priority'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {insights.length === 0 && (
          <div className="p-6 text-center">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No health insights available</p>
          </div>
        )}
      </div>
    </div>
  );
};
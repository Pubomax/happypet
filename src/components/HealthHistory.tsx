import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Heart,
  Activity,
  Thermometer,
  Ruler,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface HealthMetric {
  date: string;
  weight?: number;
  height?: number;
  temperature?: number;
  heart_rate?: number;
  activity_level?: string;
}

interface HealthHistoryProps {
  metrics: HealthMetric[];
}

export const HealthHistory: React.FC<HealthHistoryProps> = ({ metrics }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const sortedMetrics = [...metrics].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getMetricTrend = (current: number | undefined, previous: number | undefined) => {
    if (!current || !previous) return null;
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'same';
  };

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'same':
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getActivityLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'text-green-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'low':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Health History</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sortedMetrics.map((metric, index) => {
          const previousMetric = sortedMetrics[index + 1];
          const isExpanded = expandedDate === metric.date;

          return (
            <div key={metric.date} className="px-6 py-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedDate(isExpanded ? null : metric.date)}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">
                    {format(new Date(metric.date), 'MMM d, yyyy')}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>

                <div className="flex items-center space-x-6">
                  {metric.weight && (
                    <div className="flex items-center space-x-1">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{metric.weight} lbs</span>
                      {getTrendIcon(getMetricTrend(metric.weight, previousMetric?.weight))}
                    </div>
                  )}
                  
                  {metric.heart_rate && (
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium">{metric.heart_rate} bpm</span>
                      {getTrendIcon(getMetricTrend(metric.heart_rate, previousMetric?.heart_rate))}
                    </div>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      {metric.weight && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-500">Weight</span>
                          </div>
                          <span className="text-sm font-medium">{metric.weight} lbs</span>
                        </div>
                      )}

                      {metric.height && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Ruler className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-gray-500">Height</span>
                          </div>
                          <span className="text-sm font-medium">{metric.height} in</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      {metric.heart_rate && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-gray-500">Heart Rate</span>
                          </div>
                          <span className="text-sm font-medium">{metric.heart_rate} bpm</span>
                        </div>
                      )}

                      {metric.temperature && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-500">Temperature</span>
                          </div>
                          <span className="text-sm font-medium">{metric.temperature}°F</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {metric.activity_level && (
                    <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-500">Activity Level</span>
                        </div>
                        <span className={`text-sm font-medium ${getActivityLevelColor(metric.activity_level)}`}>
                          {metric.activity_level}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {metrics.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No health records available</p>
        </div>
      )}
    </div>
  );
};
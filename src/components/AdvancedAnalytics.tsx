import React from 'react';
import { 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Heart, 
  Brain,
  Zap,
  Calendar,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface HealthScore {
  overall: number;
  activity: number;
  nutrition: number;
  medical: number;
  wellness: number;
}

interface PredictiveAlert {
  type: string;
  description: string;
  probability: number;
  suggestedAction: string;
  timeframe: string;
}

interface CostMetric {
  category: string;
  amount: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

interface WellnessMetric {
  category: string;
  status: 'optimal' | 'good' | 'attention' | 'critical';
  recommendation: string;
}

interface AdvancedAnalyticsProps {
  healthScore: HealthScore;
  predictiveAlerts: PredictiveAlert[];
  costMetrics: CostMetric[];
  wellnessMetrics: WellnessMetric[];
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  healthScore,
  predictiveAlerts,
  costMetrics,
  wellnessMetrics
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: WellnessMetric['status']) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Advanced Analytics</h2>
          </div>
          <span className="text-sm text-gray-500">Real-time analysis</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Health Score</h3>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className={`text-3xl font-bold ${getScoreColor(healthScore.overall)}`}>
                {healthScore.overall}
              </div>
              <div className="text-sm text-gray-500 mt-1">Overall Score</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Activity</span>
                <span className={`font-medium ${getScoreColor(healthScore.activity)}`}>
                  {healthScore.activity}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Nutrition</span>
                <span className={`font-medium ${getScoreColor(healthScore.nutrition)}`}>
                  {healthScore.nutrition}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Medical</span>
                <span className={`font-medium ${getScoreColor(healthScore.medical)}`}>
                  {healthScore.medical}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Wellness</span>
                <span className={`font-medium ${getScoreColor(healthScore.wellness)}`}>
                  {healthScore.wellness}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Analytics */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Predictive Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {predictiveAlerts.map((alert, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.type}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {Math.round(alert.probability * 100)}%
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">{alert.timeframe}</span>
                  <span className="text-blue-600">{alert.suggestedAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Analytics */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Cost Analytics</h3>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {costMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{metric.category}</div>
                  <div className="text-sm text-gray-500">${metric.amount}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-red-500' :
                    metric.trend === 'down' ? 'text-green-500' :
                    'text-blue-500'
                  }`}>
                    {metric.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wellness Recommendations */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Wellness Insights</h3>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-4">
            {wellnessMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{metric.category}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{metric.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
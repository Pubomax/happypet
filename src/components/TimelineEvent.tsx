import React from 'react';
import { TimelineEvent as TimelineEventType } from '../types';
import {
  Star,
  Stethoscope,
  Syringe,
  Scissors,
  Brain,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';

interface TimelineEventProps {
  event: TimelineEventType;
  isLast?: boolean;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({ event, isLast }) => {
  const getEventIcon = (type: TimelineEventType['event_type']) => {
    switch (type) {
      case 'milestone':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'medical':
        return <Stethoscope className="w-5 h-5 text-red-500" />;
      case 'vaccination':
        return <Syringe className="w-5 h-5 text-blue-500" />;
      case 'grooming':
        return <Scissors className="w-5 h-5 text-purple-500" />;
      case 'behavior':
        return <Brain className="w-5 h-5 text-green-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute top-6 left-4 -bottom-6 w-0.5 bg-gray-200" />
      )}

      <div className="relative flex items-start space-x-4">
        {/* Icon */}
        <div className="relative">
          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-gray-200">
            {getEventIcon(event.event_type)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {format(new Date(event.date), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <p className="mt-2 text-gray-600">{event.description}</p>

            {event.media_url && (
              <div className="mt-3">
                <img
                  src={event.media_url}
                  alt={event.title}
                  className="rounded-lg max-h-48 w-auto"
                />
              </div>
            )}

            {event.tags && event.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
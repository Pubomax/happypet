import React, { useState } from 'react';
import { TimelineEvent } from './TimelineEvent';
import { TimelineEvent as TimelineEventType } from '../types';
import { Plus, Filter, Calendar } from 'lucide-react';

interface TimelineProps {
  events: TimelineEventType[];
  onAddEvent: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({ events, onAddEvent }) => {
  const [filter, setFilter] = useState<TimelineEventType['event_type'] | 'all'>('all');

  const filteredEvents = events.filter(
    event => filter === 'all' || event.event_type === filter
  );

  const eventTypes: { value: TimelineEventType['event_type'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All Events' },
    { value: 'milestone', label: 'Milestones' },
    { value: 'medical', label: 'Medical' },
    { value: 'vaccination', label: 'Vaccinations' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'behavior', label: 'Behavior' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Pet Care Timeline</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as TimelineEventType['event_type'] | 'all')}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onAddEvent}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Event
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No events to display</p>
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <TimelineEvent
              key={event.id}
              event={event}
              isLast={index === filteredEvents.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
};
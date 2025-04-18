import React from 'react';
import { isSameDay, format } from 'date-fns';
import useStore from '@/lib/store';

interface CalendarDayProps {
  date: Date;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ date }) => {
  const { events, eventsLoading } = useStore();

  if (eventsLoading) {
    return <div className="relative w-full h-full">
      {/* Simple loading indicator or just the date */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-sm">
        {format(date, 'd')}
      </div>
    </div>;
  }

  const dayEvents = Array.isArray(events) 
    ? events.filter(event => isSameDay(new Date(event.start), date))
    : [];

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-sm text-gray-800 dark:text-gray-200">
        {format(date, 'd')}
      </div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
        {dayEvents.slice(0, 3).map((event, idx) => (
          <div
            key={idx}
            className="w-2 h-2 rounded-full shadow-sm"
            style={{
              backgroundColor: event.color || 
                            (event.category && useStore.getState().categories.find(c => c.id === event.category)?.color) || 
                            '#3b82f6'
            }}
          />
        ))}
        {dayEvents.length > 3 && (
          <div className="w-2 h-2 rounded-full bg-gray-400 shadow-sm" />
        )}
      </div>
    </div>
  );
};

export default CalendarDay;

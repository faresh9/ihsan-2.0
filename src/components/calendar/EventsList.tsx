import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CalendarEvent, Category } from '@/lib/types';
import EventItem from './EventItem';

interface EventsListProps {
  selectedDate?: Date;
  events: CalendarEvent[];
  categories: Category[];
  onAddEvent: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

const EventsList: React.FC<EventsListProps> = ({ 
  selectedDate, 
  events, 
  categories,
  onAddEvent,
  onSelectEvent
}) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700 shadow-lg p-4 md:p-6 w-full md:w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200">
          {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
        </h2>
        <Button 
          size="sm" 
          onClick={onAddEvent}
          className="bg-primary/90 hover:bg-primary text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </div>
      
      <div className="space-y-3 mt-4">
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-6 italic dark:text-gray-400">No events for this date</p>
        ) : (
          events.map((event) => (
            <EventItem 
              key={event.id} 
              event={event} 
              categories={categories}
              onClick={() => onSelectEvent(event)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EventsList;


import React from 'react';
import { CalendarEvent, Category } from '@/lib/types';
import { Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface EventItemProps {
  event: CalendarEvent;
  categories: Category[];
  onClick: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, categories, onClick }) => {
  const getEventDot = () => {
    const color = event.color || 
                (event.category && categories.find(c => c.id === event.category)?.color) || 
                '#3b82f6';
    
    return (
      <div 
        className="w-2 h-2 rounded-full mr-2" 
        style={{ backgroundColor: color }}
      />
    );
  };

  return (
    <div
      className="p-3 rounded-lg bg-white/60 hover:bg-white/80 border border-white/30 shadow-sm hover:shadow transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        {getEventDot()}
        <span className="font-medium text-gray-800">{event.title}</span>
      </div>
      
      {event.allDay ? (
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>All day</span>
        </div>
      ) : (
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>
            {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
          </span>
        </div>
      )}
      
      {event.location && (
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{event.location}</span>
        </div>
      )}
    </div>
  );
};

export default EventItem;

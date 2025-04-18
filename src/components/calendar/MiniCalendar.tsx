import React from 'react';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { isSameDay } from 'date-fns';
import useStore from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent } from '@/lib/types';

const MiniCalendar: React.FC = () => {
  const { events } = useStore();
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  // Get today's events
  const eventsOnSelectedDate = React.useMemo(() => {
    if (!Array.isArray(events)) return [];
    return events.filter(event => 
      isSameDay(new Date(event.start), selectedDate)
    );
  }, [events, selectedDate]);

  // Custom day rendering to show event indicators
  const DayContent = React.useCallback(({ date }: { date: Date }) => {
    if (!Array.isArray(events)) return <div>{date.getDate()}</div>;
    
    const dayEvents = events.filter(event => 
      isSameDay(new Date(event.start), date)
    );
    
    return (
      <div className="relative">
        <div>{date.getDate()}</div>
        {dayEvents.length > 0 && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="h-1 w-1 bg-primary rounded-full" />
          </div>
        )}
      </div>
    );
  }, [events]);

  return (
    <div className="space-y-4">
      <CalendarUI
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md"
        components={{
          DayContent
        }}
      />
      
      {eventsOnSelectedDate.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Events on {selectedDate.toLocaleDateString()}</h3>
          <div className="space-y-1">
            {eventsOnSelectedDate.slice(0, 3).map((event: CalendarEvent) => (
              <div key={event.id} className="text-xs bg-muted p-2 rounded-md">
                <div className="font-medium">{event.title}</div>
                {!event.allDay && (
                  <div className="text-muted-foreground">
                    {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            ))}
            {eventsOnSelectedDate.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{eventsOnSelectedDate.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCalendar;
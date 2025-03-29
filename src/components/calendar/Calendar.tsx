import React, { useState } from 'react';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { CalendarEvent } from '@/lib/types';
import useStore from '@/lib/store';
import { isSameDay } from 'date-fns';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import CalendarDay from './CalendarDay';
import EventsList from './EventsList';
import AddEventDialog from './AddEventDialog';
import ViewEventDialog from './ViewEventDialog';

const CalendarView: React.FC = () => {
  const { events, categories, addEvent, updateEvent, deleteEvent } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    allDay: false,
    location: '',
    category: '',
    color: '',
  });
  const isMobile = useIsMobile();

  // Functions remain unchanged
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setNewEvent({
        ...newEvent,
        start: date,
        end: date,
      });
    }
  };

  const eventsForSelectedDate = selectedDate
    ? events.filter((event) => isSameDay(new Date(event.start), selectedDate))
    : [];

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      addEvent({
        title: newEvent.title,
        description: newEvent.description || '',
        start: newEvent.start,
        end: newEvent.end,
        allDay: newEvent.allDay || false,
        location: newEvent.location || '',
        category: newEvent.category || '',
        color: newEvent.color || '',
      });

      setNewEvent({
        title: '',
        description: '',
        start: selectedDate,
        end: selectedDate,
        allDay: false,
        location: '',
        category: '',
        color: '',
      });
      setIsAddEventOpen(false);
      toast.success('Event added');
    }
  };

  const handleUpdateEvent = () => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, selectedEvent);
      setSelectedEvent(null);
      setIsViewEventOpen(false);
      toast.success('Event updated');
    }
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setSelectedEvent(null);
    setIsViewEventOpen(false);
    toast.success('Event deleted');
  };

  const handleOpenAddEvent = () => {
    setNewEvent({
      title: '',
      description: '',
      start: selectedDate,
      end: selectedDate,
      allDay: false,
      location: '',
      category: '',
      color: '',
    });
    setIsAddEventOpen(true);
  };

  const handleViewEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewEventOpen(true);
  };

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-card backdrop-blur-sm rounded-xl border border-border shadow-lg p-4 md:p-6 md:w-1/2">
          <CalendarUI
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="pointer-events-auto"
            components={{
              DayContent: ({ date }) => <CalendarDay date={date} />
            }}
          />
        </div>
        
        <div className="bg-card backdrop-blur-sm rounded-xl border border-border shadow-lg p-4 md:p-6 md:w-1/2 flex flex-col">
          <div className="flex-1 overflow-auto">
            <EventsList
              selectedDate={selectedDate}
              events={eventsForSelectedDate}
              categories={categories}
              onAddEvent={handleOpenAddEvent}
              onSelectEvent={handleViewEvent}
            />
          </div>
        </div>
      </div>
      
      <AddEventDialog
        open={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        categories={categories}
        selectedDate={selectedDate}
      />
      
      <ViewEventDialog
        open={isViewEventOpen}
        onOpenChange={setIsViewEventOpen}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent}
        categories={categories}
      />
    </div>
  );
};

export default CalendarView;

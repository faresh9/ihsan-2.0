import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarEvent, Category } from '@/lib/types';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newEvent: Partial<CalendarEvent>;
  setNewEvent: (event: Partial<CalendarEvent>) => void;
  handleAddEvent: () => void;
  categories: Category[];
  selectedDate?: Date;
}

const AddEventDialog: React.FC<AddEventDialogProps> = ({
  open,
  onOpenChange,
  newEvent,
  setNewEvent,
  handleAddEvent,
  categories,
  selectedDate
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-gray-800 backdrop-blur-md border border-white/30 dark:border-gray-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-gray-200">Add New Event</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Create a new event for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'the selected date'}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <Input
              value={newEvent.title || ''}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Event title"
              className="bg-white/80 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <Textarea
              value={newEvent.description || ''}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Event description"
              rows={3}
              className="bg-white/80 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <Input
              value={newEvent.location || ''}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              placeholder="Event location"
              className="bg-white/80 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <Select
              value={newEvent.category || 'none'}
              onValueChange={(value) => setNewEvent({ 
                ...newEvent, 
                category: value === 'none' ? undefined : value 
              })}
            >
              <SelectTrigger className="bg-white/80 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allDay"
              checked={newEvent.allDay || false}
              onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600 text-primary h-4 w-4"
            />
            <label htmlFor="allDay" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              All day event
            </label>
          </div>
          
          {!newEvent.allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                <Input
                  type="time"
                  value={newEvent.start ? format(new Date(newEvent.start), 'HH:mm') : ''}
                  onChange={(e) => {
                    if (newEvent.start) {
                      const date = new Date(newEvent.start);
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      date.setHours(hours, minutes);
                      setNewEvent({ ...newEvent, start: date });
                    }
                  }}
                  className="bg-white/80 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
                <Input
                  type="time"
                  value={newEvent.end ? format(new Date(newEvent.end), 'HH:mm') : ''}
                  onChange={(e) => {
                    if (newEvent.end) {
                      const date = new Date(newEvent.end);
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      date.setHours(hours, minutes);
                      setNewEvent({ ...newEvent, end: date });
                    }
                  }}
                  className="bg-white/80 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-200 dark:border-gray-600">
            Cancel
          </Button>
          <Button onClick={handleAddEvent} className="bg-primary/90 hover:bg-primary text-white">
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;

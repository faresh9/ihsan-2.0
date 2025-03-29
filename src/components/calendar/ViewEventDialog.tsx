
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
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
import { Trash } from 'lucide-react';

interface ViewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  handleUpdateEvent: () => void;
  handleDeleteEvent: (id: string) => void;
  categories: Category[];
}

const ViewEventDialog: React.FC<ViewEventDialogProps> = ({
  open,
  onOpenChange,
  selectedEvent,
  setSelectedEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  categories,
}) => {
  if (!selectedEvent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-md border border-white/30 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Event Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <Input
              value={selectedEvent.title}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
              className="bg-white/80 border-gray-200"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Textarea
              value={selectedEvent.description || ''}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
              rows={3}
              className="bg-white/80 border-gray-200"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <Input
              value={selectedEvent.location || ''}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
              className="bg-white/80 border-gray-200"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <Select
              value={selectedEvent.category || 'none'}
              onValueChange={(value) => setSelectedEvent({ 
                ...selectedEvent, 
                category: value === 'none' ? undefined : value 
              })}
            >
              <SelectTrigger className="bg-white/80 border-gray-200">
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
              id="viewAllDay"
              checked={selectedEvent.allDay || false}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, allDay: e.target.checked })}
              className="rounded border-gray-300 text-primary h-4 w-4"
            />
            <label htmlFor="viewAllDay" className="text-sm font-medium text-gray-700">
              All day event
            </label>
          </div>
          
          {!selectedEvent.allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Start Time</label>
                <Input
                  type="time"
                  value={format(new Date(selectedEvent.start), 'HH:mm')}
                  onChange={(e) => {
                    const date = new Date(selectedEvent.start);
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    date.setHours(hours, minutes);
                    setSelectedEvent({ ...selectedEvent, start: date });
                  }}
                  className="bg-white/80 border-gray-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">End Time</label>
                <Input
                  type="time"
                  value={format(new Date(selectedEvent.end), 'HH:mm')}
                  onChange={(e) => {
                    const date = new Date(selectedEvent.end);
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    date.setHours(hours, minutes);
                    setSelectedEvent({ ...selectedEvent, end: date });
                  }}
                  className="bg-white/80 border-gray-200"
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="destructive" 
            onClick={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
            className="mr-auto bg-red-500/80 hover:bg-red-500"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-200">
            Cancel
          </Button>
          <Button onClick={handleUpdateEvent} className="bg-primary/90 hover:bg-primary text-white">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEventDialog;

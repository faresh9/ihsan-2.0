
import React, { useState } from 'react';
import { Plus, Check, X, CalendarPlus, ListTodo, StickyNote } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import useStore from '@/lib/store';

const QuickAdd = () => {
  const { toast } = useToast();
  const { addTask, addNote } = useStore();
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      addTask({
        title: taskTitle,
        completed: false,
        dueDate: undefined,
        priority: 'medium',
        category: ''
      });
      setTaskTitle('');
      setShowTaskDialog(false);
      toast({
        title: 'Task added',
        description: 'Your task has been added successfully',
      });
    }
  };

  const handleAddNote = () => {
    if (noteTitle.trim()) {
      addNote({
        title: noteTitle,
        content: noteContent,
        category: ''
      });
      setNoteTitle('');
      setNoteContent('');
      setShowNoteDialog(false);
      toast({
        title: 'Note added',
        description: 'Your note has been added successfully',
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full h-12 w-12 shadow-lg fixed bottom-6 right-6 z-50">
            <Plus className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end">
          <DropdownMenuItem onClick={() => setShowTaskDialog(true)}>
            <ListTodo className="mr-2 h-4 w-4" />
            New Task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowNoteDialog(true)}>
            <StickyNote className="mr-2 h-4 w-4" />
            New Note
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.href = '/calendar'}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            New Event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quick Add Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              Quickly add a new task to your list
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleAddTask}>
              <Check className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Create a new note to capture your thoughts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Note title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full"
            />
            <Textarea
              placeholder="Note content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleAddNote}>
              <Check className="mr-2 h-4 w-4" /> Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickAdd;

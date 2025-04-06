import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, Note, CalendarEvent, PomodoroSettings, PrayerTime, Category, LifeBalanceArea } from './types';
import { Activity, BookHeart, BrainCircuit, Heart, Users, Briefcase, Sparkles } from 'lucide-react';
import React from 'react';
import { 
  getTasks, createTask, updateTask as updateTaskAPI, deleteTask as deleteTaskAPI,
  getNotes, createNote, updateNote as updateNoteAPI, deleteNote as deleteNoteAPI,
  getEvents, createEvent, updateEvent as updateEventAPI, deleteEvent as deleteEventAPI
} from './api';
import { toast } from 'sonner';

interface AppState {
  tasks: Task[];
  notes: Note[];
  events: CalendarEvent[];
  prayerTimes: PrayerTime[];
  categories: Category[];
  lifeBalanceAreas: LifeBalanceArea[];
  pomodoroSettings: PomodoroSettings;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  
  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Event actions
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  
  // Pomodoro actions
  updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Life Balance actions
  updateLifeBalanceArea: (id: string, area: Partial<LifeBalanceArea>) => void;

  // Add loading states
  tasksLoading: boolean;
  notesLoading: boolean;
  eventsLoading: boolean;
  
  // Add fetch functions
  fetchTasks: () => Promise<void>;
  fetchNotes: () => Promise<void>;
  fetchEvents: () => Promise<void>;
}

// Default prayer times (to be replaced with actual API data)
const defaultPrayerTimes: PrayerTime[] = [
  { name: 'Fajr', arabicName: 'الفجر', time: new Date(new Date().setHours(5, 30, 0, 0)) },
  { name: 'Sunrise', arabicName: 'الشروق', time: new Date(new Date().setHours(6, 45, 0, 0)) },
  { name: 'Dhuhr', arabicName: 'الظهر', time: new Date(new Date().setHours(12, 15, 0, 0)) },
  { name: 'Asr', arabicName: 'العصر', time: new Date(new Date().setHours(15, 30, 0, 0)) },
  { name: 'Maghrib', arabicName: 'المغرب', time: new Date(new Date().setHours(18, 0, 0, 0)) },
  { name: 'Isha', arabicName: 'العشاء', time: new Date(new Date().setHours(19, 30, 0, 0)) },
];

// Default categories
const defaultCategories: Category[] = [
  { id: uuidv4(), name: 'Personal', color: '#3b82f6' },
  { id: uuidv4(), name: 'Work', color: '#10b981' },
  { id: uuidv4(), name: 'Study', color: '#8b5cf6' },
  { id: uuidv4(), name: 'Health', color: '#ef4444' },
  { id: uuidv4(), name: 'Finance', color: '#f59e0b' },
];

// Default life balance areas with icons added
const defaultLifeBalanceAreas: LifeBalanceArea[] = [
  { 
    id: uuidv4(), 
    name: 'Physical Health', 
    value: 7, 
    color: '#F97316', 
    description: 'Exercise, nutrition, sleep',
    icon: React.createElement(Activity, { className: "h-5 w-5" })
  },
  { 
    id: uuidv4(), 
    name: 'Mental Wellbeing', 
    value: 6, 
    color: '#D946EF', 
    description: 'Mindfulness, stress management',
    icon: React.createElement(BrainCircuit, { className: "h-5 w-5" })
  },
  { 
    id: uuidv4(), 
    name: 'Relationships', 
    value: 8, 
    color: '#8B5CF6', 
    description: 'Family, friends, community',
    icon: React.createElement(Users, { className: "h-5 w-5" })
  },
  { 
    id: uuidv4(), 
    name: 'Career', 
    value: 7, 
    color: '#0EA5E9', 
    description: 'Work, skills, achievements',
    icon: React.createElement(Briefcase, { className: "h-5 w-5" })
  },
  { 
    id: uuidv4(), 
    name: 'Personal Growth', 
    value: 5, 
    color: '#10b981', 
    description: 'Learning, creativity, hobbies',
    icon: React.createElement(Sparkles, { className: "h-5 w-5" })
  },
  { 
    id: uuidv4(), 
    name: 'Spiritual', 
    value: 6, 
    color: '#f59e0b', 
    description: 'Purpose, values, faith',
    icon: React.createElement(BookHeart, { className: "h-5 w-5" })
  },
];

// Default pomodoro settings
const defaultPomodoroSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
};

const useStore = create((set) => ({
  tasks: [], // Initialize as empty array, not null or undefined
  notes: [],
  events: [],
  // ...other store properties and methods
}));

const useStorePersisted = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      notes: [],
      events: [],
      prayerTimes: defaultPrayerTimes,
      categories: defaultCategories,
      lifeBalanceAreas: defaultLifeBalanceAreas,
      pomodoroSettings: defaultPomodoroSettings,
      tasksLoading: false,
      notesLoading: false,
      eventsLoading: false,
      
      // Fetch functions
      fetchTasks: async () => {
        set({ tasksLoading: true });
        try {
          const tasks = await getTasks();
          set({ tasks, tasksLoading: false });
        } catch (error) {
          console.error('Error fetching tasks:', error);
          set({ tasksLoading: false });
        }
      },
      
      fetchNotes: async () => {
        set({ notesLoading: true });
        try {
          const notes = await getNotes();
          set({ notes, notesLoading: false });
        } catch (error) {
          console.error('Error fetching notes:', error);
          set({ notesLoading: false });
        }
      },
      
      fetchEvents: async () => {
        set({ eventsLoading: true });
        try {
          const events = await getEvents();
          set({ events, eventsLoading: false });
        } catch (error) {
          console.error('Error fetching events:', error);
          set({ eventsLoading: false });
        }
      },
      
      // Task actions
      addTask: async (task) => {
        // Create a temporary ID for optimistic updates
        const tempId = uuidv4();
        const newTask = {
          id: tempId,
          createdAt: new Date(),
          completed: false,
          ...task
        };
        
        // Optimistically update UI first
        set(state => ({ tasks: [...state.tasks, newTask] }));
        
        try {
          // Then try API call
          const savedTask = await createTask(task);
          
          // Replace temp task with saved task from API
          set(state => ({
            tasks: state.tasks.map(t => 
              t.id === tempId ? { ...savedTask } : t
            )
          }));
        } catch (error) {
          console.error('Error creating task:', error);
          toast.error('Failed to save task to server. Changes saved locally.');
          // Task already added to local state with temporary ID
        }
      },
      
      updateTask: async (id, updatedTask) => {
        // Optimistically update local state first
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, ...updatedTask } : task
          )
        }));
        
        try {
          // Then try API call
          await updateTaskAPI(id, updatedTask);
        } catch (error) {
          console.error('Error updating task:', error);
          toast.error('Failed to update task on server. Changes saved locally.');
          // Changes already applied to local state
        }
      },
      
      deleteTask: async (id) => {
        // Keep a copy of the task in case we need to restore it
        const taskToDelete = get().tasks.find(task => task.id === id);
        
        // Optimistically update local state first
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
        
        try {
          // Then try API call
          await deleteTaskAPI(id);
        } catch (error) {
          console.error('Error deleting task:', error);
          toast.error('Failed to delete task on server. Restoring task locally.');
          
          // Restore the task if API call fails
          if (taskToDelete) {
            set(state => ({
              tasks: [...state.tasks, taskToDelete]
            }));
          }
        }
      },
      
      completeTask: async (id) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;
        
        const completed = !task.completed;
        
        // Optimistically update UI
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, completed } : task
          )
        }));
        
        try {
          // Try API call to update completion status
          await updateTaskAPI(id, { completed });
        } catch (error) {
          console.error('Error updating task completion:', error);
          toast.error('Failed to update task status on server. Changes saved locally.');
        }
      },
      
      // Note actions - Apply similar pattern for optimistic updates
      addNote: async (note) => {
        const tempId = uuidv4();
        const now = new Date();
        const newNote = {
          id: tempId,
          createdAt: now,
          updatedAt: now,
          ...note
        };
        
        // Optimistic update
        set(state => ({ notes: [...state.notes, newNote] }));
        
        try {
          const savedNote = await createNote(note);
          set(state => ({
            notes: state.notes.map(n => 
              n.id === tempId ? { ...savedNote } : n
            )
          }));
        } catch (error) {
          console.error('Error creating note:', error);
          toast.error('Failed to save note to server. Changes saved locally.');
        }
      },
      
      // Similar patterns for updateNote and deleteNote
      updateNote: async (id, updatedNote) => {
        // Optimistically update local state first
        set(state => ({
          notes: state.notes.map(note =>
            note.id === id ? { ...note, ...updatedNote, updatedAt: new Date() } : note
          )
        }));
        
        try {
          // Then try API call
          await updateNoteAPI(id, updatedNote);
        } catch (error) {
          console.error('Error updating note:', error);
          toast.error('Failed to update note on server. Changes saved locally.');
          // Changes already applied to local state
        }
      },
      
      deleteNote: async (id) => {
        // Keep a copy of the note in case we need to restore it
        const noteToDelete = get().notes.find(note => note.id === id);
        
        // Optimistically update local state first
        set(state => ({
          notes: state.notes.filter(note => note.id !== id)
        }));
        
        try {
          // Then try API call
          await deleteNoteAPI(id);
        } catch (error) {
          console.error('Error deleting note:', error);
          toast.error('Failed to delete note on server. Restoring note locally.');
          
          // Restore the note if API call fails
          if (noteToDelete) {
            set(state => ({
              notes: [...state.notes, noteToDelete]
            }));
          }
        }
      },
      
      // Event actions - Apply similar pattern for optimistic updates
      addEvent: async (event) => {
        const tempId = uuidv4();
        const newEvent = {
          id: tempId,
          ...event
        };
        
        // Optimistic update
        set(state => ({ events: [...state.events, newEvent] }));
        
        try {
          const savedEvent = await createEvent(event);
          set(state => ({
            events: state.events.map(e => 
              e.id === tempId ? { ...savedEvent } : e
            )
          }));
        } catch (error) {
          console.error('Error creating event:', error);
          toast.error('Failed to save event to server. Changes saved locally.');
        }
      },
      
      // Similar patterns for updateEvent and deleteEvent
      updateEvent: async (id, updatedEvent) => {
        // Optimistically update local state first
        set(state => ({
          events: state.events.map(event =>
            event.id === id ? { ...event, ...updatedEvent } : event
          )
        }));
        
        try {
          // Then try API call
          await updateEventAPI(id, updatedEvent);
        } catch (error) {
          console.error('Error updating event:', error);
          toast.error('Failed to update event on server. Changes saved locally.');
          // Changes already applied to local state
        }
      },
      
      deleteEvent: async (id) => {
        // Keep a copy of the event in case we need to restore it
        const eventToDelete = get().events.find(event => event.id === id);
        
        // Optimistically update local state first
        set(state => ({
          events: state.events.filter(event => event.id !== id)
        }));
        
        try {
          // Then try API call
          await deleteEventAPI(id);
        } catch (error) {
          console.error('Error deleting event:', error);
          toast.error('Failed to delete event on server. Restoring event locally.');
          
          // Restore the event if API call fails
          if (eventToDelete) {
            set(state => ({
              events: [...state.events, eventToDelete]
            }));
          }
        }
      },
      
      // Pomodoro actions
      updatePomodoroSettings: (settings) => set((state) => ({
        pomodoroSettings: { ...state.pomodoroSettings, ...settings }
      })),
      
      // Category actions
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, { ...category, id: uuidv4() }]
      })),
      updateCategory: (id, updatedCategory) => set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? { ...category, ...updatedCategory } : category
        )
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((category) => category.id !== id)
      })),
      
      // Life Balance actions
      updateLifeBalanceArea: (id, updatedArea) => set((state) => ({
        lifeBalanceAreas: state.lifeBalanceAreas.map((area) =>
          area.id === id ? { ...area, ...updatedArea } : area
        )
      })),
    }),
    {
      name: 'life-dashboard-storage',
    }
  )
);

export default useStorePersisted;

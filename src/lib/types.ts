
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  category?: string;
}

export interface PrayerTime {
  name: string;
  time: Date;
  arabicName?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location?: string;
  category?: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number;
}

export interface LifeBalanceArea {
  id: string;
  name: string;
  value: number; // 1-10 scale
  color: string;
  description: string;
  icon?: React.ReactNode; // Add the icon property which is optional for backward compatibility
}

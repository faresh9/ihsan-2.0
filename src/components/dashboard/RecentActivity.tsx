import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, FileText, Calendar } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import useStore from '@/lib/store';
import { cn } from '@/lib/utils';

// Define types for our activity items
interface BaseActivity {
  type: string;
  id: string;
  title: string;
  date: Date;
}

interface TaskActivity extends BaseActivity {
  type: 'task';
  completed: boolean;
}

interface NoteActivity extends BaseActivity {
  type: 'note';
}

interface EventActivity extends BaseActivity {
  type: 'event';
  end: Date;
}

type Activity = TaskActivity | NoteActivity | EventActivity;

const RecentActivity = () => {
  const { tasks, notes, events } = useStore();
  
  // Get recent items (last 7 days)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const recentTasks = Array.isArray(tasks)
    ? tasks
      .filter(task => new Date(task.createdAt) > lastWeek)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    : [];
    
  const recentNotes = Array.isArray(notes)
    ? notes
      .filter(note => new Date(note.createdAt) > lastWeek)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    : [];
    
  const upcomingEvents = Array.isArray(events)
    ? events
      .filter(event => !isPast(new Date(event.end)) || isToday(new Date(event.end)))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5)
    : [];
  
  // Combine and sort by date
  const activities: Activity[] = [
    ...recentTasks.map(task => ({
      type: 'task' as const,
      id: task.id,
      title: task.title,
      date: task.createdAt,
      completed: task.completed
    })),
    ...recentNotes.map(note => ({
      type: 'note' as const,
      id: note.id,
      title: note.title,
      date: note.createdAt
    })),
    ...upcomingEvents.map(event => ({
      type: 'event' as const,
      id: event.id,
      title: event.title,
      date: event.start,
      end: event.end
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 10);
  
  if (activities.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recent tasks, notes, and upcoming events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={`${activity.type}-${activity.id}`}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {activity.type === 'task' && (
                  activity.completed ? 
                    <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                    <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                
                {activity.type === 'note' && (
                  <FileText className="h-5 w-5 text-blue-500" />
                )}
                
                {activity.type === 'event' && (
                  <Calendar className="h-5 w-5 text-purple-500" />
                )}
                
                <div>
                  <p className={cn(
                    "font-medium",
                    activity.type === 'task' && (activity as TaskActivity).completed && "line-through text-muted-foreground"
                  )}>
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.type === 'event' 
                      ? `${format(new Date(activity.date), 'MMM d, h:mm a')}`
                      : `${format(new Date(activity.date), 'MMM d')}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="text-xs font-medium rounded-full px-2 py-1 bg-muted">
                {activity.type === 'task' ? 'Task' : 
                 activity.type === 'note' ? 'Note' : 'Event'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

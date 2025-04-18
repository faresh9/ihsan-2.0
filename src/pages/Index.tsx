import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/Dashboard';
import TaskList from '@/components/tasks/TaskList';
import PomodoroTimer from '@/components/timer/PomodoroTimer';
import PrayerTimes from '@/components/prayer/PrayerTimes';
import CalendarView from '@/components/calendar/Calendar';
import MiniCalendar from '@/components/calendar/MiniCalendar';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickAdd from '@/components/dashboard/QuickAdd';
import LifeBalanceHexagon from '@/components/dashboard/LifeBalanceHexagon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckSquare, Clock, FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '@/lib/store';

const Index = () => {
  const navigate = useNavigate();
  const { tasks, notes, events, fetchTasks, fetchNotes, fetchEvents } = useStore();
  
  // Fetch data on component mount
  useEffect(() => {
    if (typeof fetchTasks === 'function') fetchTasks();
    if (typeof fetchNotes === 'function') fetchNotes();
    if (typeof fetchEvents === 'function') fetchEvents();
  }, []);
  
  // Get incomplete tasks with null check
  const incompleteTasks = Array.isArray(tasks) ? tasks.filter(task => !task.completed) : [];
  
  // Get today's events with null check
  const today = new Date();
  const todaysEvents = Array.isArray(events) ? events.filter(event => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  }) : [];
  
  return (
    <DashboardLayout>
      <WelcomeMessage />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Organize your life in one place</p>
      </div>
      
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="glass card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CheckSquare className="mr-2 h-5 w-5 text-primary" />
              Tasks
            </CardTitle>
            <CardDescription>Remaining tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{incompleteTasks.length}</div>
            <Button variant="ghost" className="mt-2 p-0 h-auto" onClick={() => navigate('/tasks')}>
              View all tasks
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Notes
            </CardTitle>
            <CardDescription>Total notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{notes.length}</div>
            <Button variant="ghost" className="mt-2 p-0 h-auto" onClick={() => navigate('/notes')}>
              View all notes
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Events
            </CardTitle>
            <CardDescription>Today's events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todaysEvents.length}</div>
            <Button variant="ghost" className="mt-2 p-0 h-auto" onClick={() => navigate('/calendar')}>
              View calendar
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-1">
          {/* Quick Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Quick Tasks</CardTitle>
                <CardDescription>Add and manage your tasks</CardDescription>
              </div>
              <Button size="sm" onClick={() => navigate('/tasks')}>View All</Button>
            </CardHeader>
            <CardContent>
              <TaskList />
            </CardContent>
          </Card>
          
          {/* Pomodoro Timer */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Pomodoro Timer
                </CardTitle>
                <CardDescription>Stay focused and productive</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <PomodoroTimer />
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <RecentActivity />
        </div>
        
        {/* Middle Column */}
        <div className="space-y-8 lg:col-span-1">
          {/* Life Balance Hexagon */}
          <LifeBalanceHexagon />
          
          {/* Prayer Times */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Prayer Times</CardTitle>
              <CardDescription>Today's prayer schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <PrayerTimes />
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8 lg:col-span-1">
          {/* Quick Calendar */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Upcoming events</CardDescription>
              </div>
              <Button size="sm" onClick={() => navigate('/calendar')}>View Full</Button>
            </CardHeader>
            <CardContent>
              <MiniCalendar />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Quick Add Floating Button */}
      <QuickAdd />
    </DashboardLayout>
  );
};

export default Index;

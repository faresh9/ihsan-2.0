
import React from 'react';
import DashboardLayout from '@/components/layout/Dashboard';
import CalendarView from '@/components/calendar/Calendar';

const Calendar = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground mt-1">Manage your schedule and events</p>
      </div>
      <CalendarView />
    </DashboardLayout>
  );
};

export default Calendar;

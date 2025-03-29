
import React from 'react';
import DashboardLayout from '@/components/layout/Dashboard';
import TaskList from '@/components/tasks/TaskList';

const Tasks = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground mt-1">Manage your tasks and to-dos</p>
      </div>
      <TaskList />
    </DashboardLayout>
  );
};

export default Tasks;

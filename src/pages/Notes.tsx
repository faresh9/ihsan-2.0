
import React from 'react';
import DashboardLayout from '@/components/layout/Dashboard';
import NotesList from '@/components/notes/NotesList';

const Notes = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notes</h1>
        <p className="text-muted-foreground mt-1">Capture and organize your thoughts</p>
      </div>
      <NotesList />
    </DashboardLayout>
  );
};

export default Notes;

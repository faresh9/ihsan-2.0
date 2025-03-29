import React, { ReactNode, useEffect } from 'react';
import Header from './Header';
import useStore from '@/lib/store';
import { useAuth } from '@/lib/auth';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { fetchTasks, fetchNotes, fetchEvents } = useStore();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      // Load data from backend when user is authenticated
      fetchTasks();
      fetchNotes();
      fetchEvents();
    }
  }, [user, fetchTasks, fetchNotes, fetchEvents]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <div className="absolute inset-0 w-full h-full grid-pattern"></div>
      <Header />
      <main className="pt-16 relative z-10 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass rounded-xl p-6 shadow-xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

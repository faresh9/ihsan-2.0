
import React from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomeMessage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="glass rounded-xl p-6 mb-8 border border-primary/10 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-2">
        {greeting()}, {user.firstName || 'there'}!
      </h2>
      <p className="text-muted-foreground mb-4">
        Welcome to ihsan 2.0, your personal productivity and spiritual companion.
      </p>
      
      <div className="flex flex-wrap gap-3 mt-4">
        <Button 
          variant="outline" 
          className="group" 
          onClick={() => navigate('/tasks')}
        >
          Manage Tasks
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        
        <Button 
          variant="outline" 
          className="group" 
          onClick={() => navigate('/notes')}
        >
          View Notes
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        
        <Button 
          variant="outline" 
          className="group" 
          onClick={() => navigate('/calendar')}
        >
          Calendar
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeMessage;

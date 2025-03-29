
import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Pause, Play, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useStore from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type TimerState = 'work' | 'shortBreak' | 'longBreak';

const PomodoroTimer: React.FC = () => {
  const { pomodoroSettings, updatePomodoroSettings } = useStore();
  const [timerState, setTimerState] = useState<TimerState>('work');
  const [timeRemaining, setTimeRemaining] = useState(pomodoroSettings.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(pomodoroSettings);
  
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Reset timer when timer state changes
  useEffect(() => {
    let duration = 0;
    
    switch (timerState) {
      case 'work':
        duration = pomodoroSettings.workDuration * 60;
        break;
      case 'shortBreak':
        duration = pomodoroSettings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        duration = pomodoroSettings.longBreakDuration * 60;
        break;
    }
    
    setTimeRemaining(duration);
    setIsActive(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [timerState, pomodoroSettings]);
  
  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            // Timer finished
            clearInterval(timerRef.current!);
            timerRef.current = null;
            setIsActive(false);
            audioRef.current?.play();
            
            if (timerState === 'work') {
              const newCompletedSessions = completedSessions + 1;
              setCompletedSessions(newCompletedSessions);
              
              // Show notification
              toast.success(
                `Work session completed! ${
                  newCompletedSessions % pomodoroSettings.sessionsUntilLongBreak === 0
                    ? "Time for a long break!"
                    : "Time for a short break!"
                }`
              );
              
              // Determine next timer state
              if (newCompletedSessions % pomodoroSettings.sessionsUntilLongBreak === 0) {
                setTimerState('longBreak');
              } else {
                setTimerState('shortBreak');
              }
            } else {
              // Break timer finished
              toast.success("Break finished! Ready to work?");
              setTimerState('work');
            }
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, timerState, completedSessions, pomodoroSettings]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    let duration = 0;
    
    switch (timerState) {
      case 'work':
        duration = pomodoroSettings.workDuration * 60;
        break;
      case 'shortBreak':
        duration = pomodoroSettings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        duration = pomodoroSettings.longBreakDuration * 60;
        break;
    }
    
    setTimeRemaining(duration);
    setIsActive(false);
  };
  
  const saveSettings = () => {
    updatePomodoroSettings(localSettings);
    setIsSettingsOpen(false);
    toast.success('Settings updated');
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = (() => {
    let totalSeconds = 0;
    
    switch (timerState) {
      case 'work':
        totalSeconds = pomodoroSettings.workDuration * 60;
        break;
      case 'shortBreak':
        totalSeconds = pomodoroSettings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        totalSeconds = pomodoroSettings.longBreakDuration * 60;
        break;
    }
    
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  })();
  
  return (
    <div className="max-w-md mx-auto space-y-6 animate-slide-up">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2 mb-8">
          <Button
            variant={timerState === 'work' ? 'default' : 'outline'}
            onClick={() => setTimerState('work')}
            className="w-28"
          >
            Work
          </Button>
          <Button
            variant={timerState === 'shortBreak' ? 'default' : 'outline'}
            onClick={() => setTimerState('shortBreak')}
            className="w-28"
          >
            Short Break
          </Button>
          <Button
            variant={timerState === 'longBreak' ? 'default' : 'outline'}
            onClick={() => setTimerState('longBreak')}
            className="w-28"
          >
            Long Break
          </Button>
        </div>
        
        <div className="relative w-64 h-64 mb-4">
          {/* Progress Ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="4"
              stroke="hsl(var(--muted))"
              className="opacity-20"
            />
            
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="4"
              stroke="hsl(var(--primary))"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
              className="transition-all duration-500"
            />
          </svg>
          
          {/* Timer text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-semibold">{formatTime(timeRemaining)}</span>
            <span className="text-sm text-muted-foreground mt-2 capitalize">
              {timerState === 'work' ? 'Focus Time' : (timerState === 'shortBreak' ? 'Short Break' : 'Long Break')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="h-12 w-12 rounded-full"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={toggleTimer}
            size="icon"
            className={cn(
              "h-14 w-14 rounded-full",
              isActive ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
            )}
          >
            {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="h-12 w-12 rounded-full"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Completed: {completedSessions} {completedSessions === 1 ? 'session' : 'sessions'}
          </p>
        </div>
      </div>
      
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Timer Settings</DialogTitle>
            <DialogDescription>
              Customize your Pomodoro timer settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workDuration" className="text-right">
                Work
              </Label>
              <Input
                id="workDuration"
                type="number"
                min="1"
                max="60"
                value={localSettings.workDuration}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    workDuration: parseInt(e.target.value) || 25,
                  })
                }
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shortBreakDuration" className="text-right">
                Short Break
              </Label>
              <Input
                id="shortBreakDuration"
                type="number"
                min="1"
                max="30"
                value={localSettings.shortBreakDuration}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    shortBreakDuration: parseInt(e.target.value) || 5,
                  })
                }
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longBreakDuration" className="text-right">
                Long Break
              </Label>
              <Input
                id="longBreakDuration"
                type="number"
                min="1"
                max="60"
                value={localSettings.longBreakDuration}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    longBreakDuration: parseInt(e.target.value) || 15,
                  })
                }
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sessionsUntilLongBreak" className="text-right">
                Sessions
              </Label>
              <Input
                id="sessionsUntilLongBreak"
                type="number"
                min="1"
                max="10"
                value={localSettings.sessionsUntilLongBreak}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    sessionsUntilLongBreak: parseInt(e.target.value) || 4,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          
          <div className="flex items-center p-4 border border-border bg-muted/20 rounded-lg">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
            <p className="text-sm text-muted-foreground">
              All times are in minutes. Changes will apply after the current timer completes.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSettings}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PomodoroTimer;

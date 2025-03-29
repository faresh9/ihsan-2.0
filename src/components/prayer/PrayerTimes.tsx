
import React, { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { PrayerTime } from '@/lib/types';
import useStore from '@/lib/store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

const PrayerTimes: React.FC = () => {
  const { prayerTimes } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState<string>('');
  
  // Update time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Calculate next prayer and time until it
  useEffect(() => {
    const findNextPrayer = () => {
      const now = new Date();
      
      // Create a copy of prayerTimes with today's date
      const todaysPrayerTimes = prayerTimes.map(prayer => {
        const prayerDate = new Date(prayer.time);
        const today = new Date();
        today.setHours(prayerDate.getHours(), prayerDate.getMinutes(), 0, 0);
        return { ...prayer, time: today };
      });
      
      // Sort prayer times
      const sortedPrayers = [...todaysPrayerTimes].sort((a, b) => 
        new Date(a.time).getTime() - new Date(b.time).getTime()
      );
      
      // Find the next prayer
      let next = sortedPrayers.find(prayer => 
        new Date(prayer.time).getTime() > now.getTime()
      );
      
      // If no prayer found for today, use the first prayer for tomorrow
      if (!next && sortedPrayers.length > 0) {
        next = sortedPrayers[0];
        // Adjust to tomorrow
        const tomorrow = new Date(next.time);
        tomorrow.setDate(tomorrow.getDate() + 1);
        next = { ...next, time: tomorrow };
      }
      
      setNextPrayer(next || null);
    };
    
    findNextPrayer();
    
    // Update every minute
    const intervalId = setInterval(findNextPrayer, 60000);
    
    return () => clearInterval(intervalId);
  }, [prayerTimes]);
  
  // Calculate and format time until next prayer
  useEffect(() => {
    if (!nextPrayer) return;
    
    const calculateTimeUntil = () => {
      const now = new Date();
      const prayerTime = new Date(nextPrayer.time);
      
      let diff = prayerTime.getTime() - now.getTime();
      
      if (diff < 0) return;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      
      const mins = Math.floor(diff / (1000 * 60));
      diff -= mins * (1000 * 60);
      
      const secs = Math.floor(diff / 1000);
      
      if (hours > 0) {
        return `${hours}h ${mins}m ${secs}s`;
      } else {
        return `${mins}m ${secs}s`;
      }
    };
    
    const timeUntil = calculateTimeUntil();
    setTimeUntilNextPrayer(timeUntil || '');
    
    const intervalId = setInterval(() => {
      const timeUntil = calculateTimeUntil();
      setTimeUntilNextPrayer(timeUntil || '');
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [nextPrayer, currentTime]);
  
  return (
    <div className="glass rounded-lg border border-border p-6 animate-slide-up">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold">Prayer Times</h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>Local</span>
        </div>
      </div>
      
      {nextPrayer && (
        <div className="mb-6 bg-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Next Prayer</p>
              <h3 className="text-xl font-medium mt-1 flex items-center gap-2">
                {nextPrayer.name}
                <span className="text-base font-normal text-muted-foreground">
                  ({format(new Date(nextPrayer.time), 'h:mm a')})
                </span>
              </h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Time Remaining</p>
              <p className="text-lg font-medium text-primary mt-1">{timeUntilNextPrayer}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {prayerTimes.map((prayer, index) => {
          const prayerTime = new Date(prayer.time);
          const isNextPrayer = nextPrayer?.name === prayer.name;
          const isPassed = prayerTime.getTime() < currentTime.getTime();
          
          return (
            <div 
              key={index}
              className={cn(
                "flex justify-between items-center p-3 rounded-md transition-colors",
                isNextPrayer ? "bg-primary/10" : isPassed ? "opacity-70" : ""
              )}
            >
              <div className="flex items-center">
                <div 
                  className={cn(
                    "w-2 h-2 rounded-full mr-3",
                    isNextPrayer ? "bg-primary" : isPassed ? "bg-muted-foreground" : "bg-muted-foreground/50"
                  )}
                />
                <div>
                  <h4 className="font-medium">{prayer.name}</h4>
                  {prayer.arabicName && (
                    <p className="text-xs text-muted-foreground">{prayer.arabicName}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className={cn(isNextPrayer ? "text-primary font-medium" : "")}>
                  {format(prayerTime, 'h:mm a')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrayerTimes;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Activity, BookHeart, BrainCircuit, Heart, Users, Briefcase, Sparkles } from 'lucide-react';
import { ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import useStore from '@/lib/store';
import { LifeBalanceArea } from '@/lib/types';

const LifeBalanceHexagon = () => {
  const { lifeBalanceAreas, updateLifeBalanceArea } = useStore();
  
  // Map of icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    "Activity": <Activity className="h-5 w-5" />,
    "BrainCircuit": <BrainCircuit className="h-5 w-5" />,
    "Users": <Users className="h-5 w-5" />,
    "Briefcase": <Briefcase className="h-5 w-5" />,
    "Sparkles": <Sparkles className="h-5 w-5" />,
    "BookHeart": <BookHeart className="h-5 w-5" />,
  };
  
  // Use icon names instead of React elements
  const defaultAreas: LifeBalanceArea[] = [
    {
      id: '1',
      name: 'Physical Health',
      color: '#F97316', // Bright Orange
      iconName: 'Activity', // Store name instead of element
      description: 'Exercise, nutrition, sleep',
      value: 7
    },
    {
      id: '2',
      name: 'Mental Wellbeing',
      color: '#D946EF', // Magenta Pink
      iconName: 'BrainCircuit',
      description: 'Mindfulness, stress management',
      value: 6
    },
    {
      id: '3',
      name: 'Relationships',
      color: '#8B5CF6', // Vivid Purple
      iconName: 'Users',
      description: 'Family, friends, community',
      value: 8
    },
    {
      id: '4',
      name: 'Career',
      color: '#0EA5E9', // Ocean Blue
      iconName: 'Briefcase',
      description: 'Work, skills, achievements',
      value: 7
    },
    {
      id: '5',
      name: 'Personal Growth',
      color: '#10b981', // Green
      iconName: 'Sparkles',
      description: 'Learning, creativity, hobbies',
      value: 5
    },
    {
      id: '6',
      name: 'Spiritual',
      color: '#f59e0b', // Yellow
      iconName: 'BookHeart',
      description: 'Purpose, values, faith',
      value: 6
    },
  ];
  
  const [areas, setAreas] = useState<LifeBalanceArea[]>(
    lifeBalanceAreas?.length ? lifeBalanceAreas : defaultAreas
  );
  
  // Handle value change
  const handleValueChange = (id: string, value: number) => {
    const newAreas = areas.map(area => 
      area.id === id ? { ...area, value } : area
    );
    setAreas(newAreas);
    
    // Update store if implemented
    if (updateLifeBalanceArea) {
      updateLifeBalanceArea(id, { value });
    }
  };
  
  // Calculate coordinates for hexagon
  const calculateCoordinates = (index: number, value: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = (value / 10) * 90; // 90% of the available space
    const x = 100 + Math.cos(angle) * radius;
    const y = 100 + Math.sin(angle) * radius;
    return { x, y };
  };
  
  // Generate points for the polygon
  const generatePolygonPoints = () => {
    return areas.map((area, index) => {
      const { x, y } = calculateCoordinates(index, area.value, areas.length);
      return `${x},${y}`;
    }).join(' ');
  };
  
  // Generate axis lines
  const generateAxisLines = () => {
    return areas.map((area, index) => {
      const { x, y } = calculateCoordinates(index, 10, areas.length); // Max value is 10
      return (
        <line 
          key={`axis-${area.id}`}
          x1="100" 
          y1="100" 
          x2={x} 
          y2={y} 
          stroke="#8E9196" 
          strokeWidth="1" 
          strokeDasharray="2,2" 
        />
      );
    });
  };
  
  // Generate area labels
  const generateAreaLabels = () => {
    return areas.map((area, index) => {
      const { x, y } = calculateCoordinates(index, 11, areas.length); // Slightly beyond max for labels
      const textAnchor = x > 100 ? "start" : x < 100 ? "end" : "middle";
      const dy = y > 100 ? "0.5em" : y < 100 ? "-0.5em" : "0";
      
      return (
        <text 
          key={`label-${area.id}`}
          x={x} 
          y={y} 
          textAnchor={textAnchor} 
          dy={dy}
          fontSize="9" 
          fill="#403E43"
          className="text-xs font-medium"
        >
          {area.name}
        </text>
      );
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Life Balance</CardTitle>
        <CardDescription>Rate different areas of your life from 1-10</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hexagon Visualization */}
        <div className="flex justify-center mb-6">
          <div className="relative w-[250px] h-[250px]">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Axis lines */}
              {generateAxisLines()}
              
              {/* Filled hexagon */}
              <polygon 
                points={generatePolygonPoints()} 
                fill="rgba(139, 92, 246, 0.2)" 
                stroke="#8B5CF6" 
                strokeWidth="2" 
              />
              
              {/* Center point */}
              <circle cx="100" cy="100" r="2" fill="#403E43" />
              
              {/* Area points */}
              {areas.map((area, index) => {
                const { x, y } = calculateCoordinates(index, area.value, areas.length);
                return (
                  <circle 
                    key={`point-${area.id}`}
                    cx={x} 
                    cy={y} 
                    r="3" 
                    fill={area.color}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                );
              })}
              
              {/* Area labels */}
              {generateAreaLabels()}
            </svg>
          </div>
        </div>
        
        {/* Area sliders */}
        <div className="grid gap-4">
          {areas.map((area) => (
            <div key={area.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${area.color}20` }}>
                    <div className="text-primary" style={{ color: area.color }}>
                      {/* Render icon based on name */}
                      {iconMap[area.iconName] || <Activity className="h-5 w-5" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium leading-none">{area.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{area.description}</p>
                  </div>
                </div>
                <span className="font-medium text-sm">{area.value}/10</span>
              </div>
              <Slider
                value={[area.value]} 
                min={1} 
                max={10} 
                step={1}
                onValueChange={(value) => handleValueChange(area.id, value[0])}
                className="cursor-pointer"
              />
            </div>
          ))}
        </div>
        
        <Button className="w-full" variant="outline">
          Download Balance Chart
        </Button>
      </CardContent>
    </Card>
  );
};

export default LifeBalanceHexagon;

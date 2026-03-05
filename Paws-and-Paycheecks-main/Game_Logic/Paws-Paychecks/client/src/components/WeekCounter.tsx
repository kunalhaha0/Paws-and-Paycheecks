import { TOTAL_WEEKS } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface WeekCounterProps {
  currentWeek: number;
}

export function WeekCounter({ currentWeek }: WeekCounterProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20">
        <Calendar className="w-6 h-6 text-accent" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Week</span>
        <span className="text-2xl font-bold text-foreground" data-testid="text-week-counter">
          {currentWeek} <span className="text-base font-normal text-muted-foreground">/ {TOTAL_WEEKS}</span>
        </span>
      </div>
    </div>
  );
}

export function WeekProgressBar({ currentWeek }: WeekCounterProps) {
  const progress = (currentWeek / TOTAL_WEEKS) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Game Progress</span>
        <span className="font-medium">Week {currentWeek} of {TOTAL_WEEKS}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between">
        {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
          <div 
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i + 1 <= currentWeek ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}

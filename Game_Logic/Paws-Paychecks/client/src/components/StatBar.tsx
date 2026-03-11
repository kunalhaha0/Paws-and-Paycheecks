import { cn } from "@/lib/utils";
import { getStatColor } from "@/lib/gameLogic";
import { Heart, Smile } from "lucide-react";

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  type?: "health" | "happiness";
  showChange?: number;
}

export function StatBar({ label, value, maxValue = 100, type, showChange }: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const color = getStatColor(value);

  const getIcon = () => {
    if (type === "health") return <Heart className="w-4 h-4 text-red-500" />;
    if (type === "happiness") return <Smile className="w-4 h-4 text-yellow-500" />;
    return null;
  };

  return (
    <div className="space-y-1.5" data-testid={`stat-bar-${type || label.toLowerCase()}`}>
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-foreground flex items-center gap-1.5">
          {getIcon()}
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-semibold" style={{ color }}>
            {Math.round(value)}/{maxValue}
          </span>
          {showChange !== undefined && showChange !== 0 && (
            <span className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded pop-in",
              showChange > 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {showChange > 0 ? "+" : ""}{showChange}
            </span>
          )}
        </div>
      </div>
      <div className="stat-bar">
        <div 
          className="stat-bar-fill"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}

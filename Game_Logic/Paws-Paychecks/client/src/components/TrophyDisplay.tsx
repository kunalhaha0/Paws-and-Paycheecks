import { TrophyType, TROPHIES } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface TrophyDisplayProps {
  trophy: TrophyType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function TrophyDisplay({ trophy, size = "md", showLabel = true }: TrophyDisplayProps) {
  if (trophy === "none") {
    return (
      <div className="flex flex-col items-center gap-2 opacity-50">
        <div className={cn(
          "rounded-full bg-muted flex items-center justify-center",
          size === "sm" ? "w-10 h-10" : size === "md" ? "w-16 h-16" : "w-24 h-24"
        )}>
          <Trophy className={cn(
            "text-muted-foreground",
            size === "sm" ? "w-5 h-5" : size === "md" ? "w-8 h-8" : "w-12 h-12"
          )} />
        </div>
        {showLabel && <span className="text-sm text-muted-foreground">No Trophy</span>}
      </div>
    );
  }

  const trophyInfo = TROPHIES.find(t => t.type === trophy);
  
  const colors = {
    bronze: { bg: "from-amber-600 to-amber-800", glow: "shadow-amber-500/30" },
    silver: { bg: "from-slate-300 to-slate-500", glow: "shadow-slate-400/30" },
    gold: { bg: "from-yellow-400 to-yellow-600", glow: "shadow-yellow-500/40" },
    platinum: { bg: "from-cyan-200 via-white to-cyan-300", glow: "shadow-cyan-400/50" }
  };

  const style = colors[trophy];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg",
        style.bg, style.glow,
        size === "sm" ? "w-10 h-10" : size === "md" ? "w-16 h-16" : "w-24 h-24",
        trophy === "platinum" && "pulse-glow"
      )}>
        <Trophy className={cn(
          trophy === "platinum" ? "text-cyan-700" : "text-white drop-shadow",
          size === "sm" ? "w-5 h-5" : size === "md" ? "w-8 h-8" : "w-12 h-12"
        )} />
      </div>
      {showLabel && trophyInfo && (
        <div className="text-center">
          <div className="font-semibold text-foreground">{trophyInfo.name}</div>
          <div className="text-xs text-muted-foreground">{trophyInfo.description}</div>
        </div>
      )}
    </div>
  );
}

type EarnedTrophyType = "platinum" | "gold" | "silver" | "bronze";

export function TrophyShelf({ trophies }: { trophies: TrophyType[] }) {
  const counts: Record<EarnedTrophyType, number> = {
    platinum: trophies.filter(t => t === "platinum").length,
    gold: trophies.filter(t => t === "gold").length,
    silver: trophies.filter(t => t === "silver").length,
    bronze: trophies.filter(t => t === "bronze").length
  };

  const earnedTypes: EarnedTrophyType[] = ["platinum", "gold", "silver", "bronze"];

  return (
    <div className="grid grid-cols-4 gap-4">
      {earnedTypes.map(type => (
        <div 
          key={type}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-lg",
            counts[type] > 0 ? "bg-card" : "bg-muted/50 opacity-50"
          )}
        >
          <TrophyDisplay trophy={counts[type] > 0 ? type : "none"} size="md" showLabel={false} />
          <span className="font-bold text-lg">{counts[type]}</span>
          <span className="text-xs text-muted-foreground capitalize">{type}</span>
        </div>
      ))}
    </div>
  );
}

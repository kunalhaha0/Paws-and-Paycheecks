import { TrophyType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface TrophyBookshelfProps {
  trophies: TrophyType[];
}

function PhysicalTrophy({ type, size = "md" }: { type: TrophyType; size?: "sm" | "md" | "lg" }) {
  if (type === "none") return null;

  const sizeClasses = {
    sm: { cup: "w-6 h-8", base: "w-8 h-2", handles: "w-8 h-4" },
    md: { cup: "w-10 h-14", base: "w-14 h-3", handles: "w-14 h-6" },
    lg: { cup: "w-14 h-20", base: "w-16 h-4", handles: "w-16 h-8" }
  };

  const colors = {
    bronze: {
      main: "from-amber-600 via-amber-500 to-amber-700",
      shine: "from-amber-300/60 to-transparent",
      base: "bg-amber-800",
      shadow: "shadow-amber-900/50"
    },
    silver: {
      main: "from-slate-300 via-white to-slate-400",
      shine: "from-white/80 to-transparent",
      base: "bg-slate-600",
      shadow: "shadow-slate-700/50"
    },
    gold: {
      main: "from-yellow-400 via-yellow-300 to-yellow-500",
      shine: "from-yellow-100/80 to-transparent",
      base: "bg-yellow-700",
      shadow: "shadow-yellow-800/50"
    },
    platinum: {
      main: "from-cyan-200 via-white to-cyan-300",
      shine: "from-white/90 to-transparent",
      base: "bg-cyan-700",
      shadow: "shadow-cyan-800/50"
    }
  };

  const color = colors[type];
  const sizes = sizeClasses[size];

  return (
    <div className="relative flex flex-col items-center" data-testid={`trophy-${type}`}>
      <div className="relative">
        <div className={cn(sizes.handles, "absolute -top-1 left-1/2 -translate-x-1/2 flex justify-between px-0.5")}>
          <div className={cn(
            "w-1.5 h-full rounded-full bg-gradient-to-b",
            color.main,
            "transform -rotate-12 origin-bottom"
          )} />
          <div className={cn(
            "w-1.5 h-full rounded-full bg-gradient-to-b",
            color.main,
            "transform rotate-12 origin-bottom"
          )} />
        </div>
        
        <div className={cn(
          sizes.cup,
          "relative rounded-t-full rounded-b-lg bg-gradient-to-br overflow-hidden",
          color.main,
          color.shadow,
          "shadow-lg"
        )}>
          <div className={cn(
            "absolute top-1 left-1 w-1/3 h-1/3 rounded-full bg-gradient-to-br",
            color.shine
          )} />
          
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-white/20 rounded-full" />
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-white/20 rounded-full" />
        </div>
        
        <div className={cn(
          "w-2 mx-auto bg-gradient-to-b",
          color.main,
          size === "sm" ? "h-2" : size === "md" ? "h-3" : "h-4"
        )} />
        
        <div className={cn(
          sizes.base,
          "rounded-sm bg-gradient-to-b mx-auto",
          color.main,
          "shadow-md"
        )}>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-sm" />
        </div>
      </div>
      
      <span className={cn(
        "mt-1 font-semibold capitalize",
        size === "sm" ? "text-xs" : "text-sm",
        type === "platinum" ? "text-cyan-600 dark:text-cyan-400" :
        type === "gold" ? "text-yellow-600 dark:text-yellow-400" :
        type === "silver" ? "text-slate-500 dark:text-slate-400" :
        "text-amber-700 dark:text-amber-500"
      )}>
        {type}
      </span>
    </div>
  );
}

export function TrophyBookshelf({ trophies }: TrophyBookshelfProps) {
  const earnedTypes: ("platinum" | "gold" | "silver" | "bronze")[] = ["platinum", "gold", "silver", "bronze"];
  
  const counts: Record<string, number> = {
    platinum: trophies.filter(t => t === "platinum").length,
    gold: trophies.filter(t => t === "gold").length,
    silver: trophies.filter(t => t === "silver").length,
    bronze: trophies.filter(t => t === "bronze").length
  };

  const totalTrophies = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="relative" data-testid="trophy-bookshelf">
      <div className="bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 rounded-lg p-4 shadow-2xl border-4 border-amber-700">
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-4 right-4 h-1 bg-amber-600/50 rounded-full" />
          <div className="absolute left-1 top-4 bottom-4 w-1 bg-amber-600/30 rounded-full" />
          <div className="absolute right-1 top-4 bottom-4 w-1 bg-amber-600/30 rounded-full" />
        </div>
        
        <div className="relative space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {earnedTypes.map(type => (
              <div 
                key={type} 
                className={cn(
                  "relative p-3 rounded-md flex flex-col items-center gap-2 min-h-[100px]",
                  "bg-gradient-to-b from-amber-950/80 to-amber-950/40",
                  "border-b-4 border-amber-600/50"
                )}
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-700/80 shadow-inner" />
                
                {counts[type] > 0 ? (
                  <>
                    <PhysicalTrophy type={type} size="md" />
                    {counts[type] > 1 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {counts[type]}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-30">
                    <div className="w-8 h-12 rounded-t-full rounded-b-sm border-2 border-dashed border-amber-500/50" />
                    <span className="text-xs text-amber-500/50 mt-1">Empty</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center pt-2 border-t border-amber-700/50">
            <span className="text-amber-200/80 text-sm font-medium">
              {totalTrophies > 0 
                ? `${totalTrophies} ${totalTrophies === 1 ? "Trophy" : "Trophies"} Earned`
                : "No Trophies Yet"
              }
            </span>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-amber-950 rounded-b-lg shadow-lg" />
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-2 bg-amber-950/50 rounded-b-lg" />
    </div>
  );
}

export function MiniTrophyDisplay({ type }: { type: TrophyType }) {
  if (type === "none") {
    return (
      <div className="w-6 h-8 rounded-t-full rounded-b-sm border-2 border-dashed border-muted-foreground/30 opacity-50" />
    );
  }
  return <PhysicalTrophy type={type} size="sm" />;
}

export function LargeTrophyDisplay({ type }: { type: TrophyType }) {
  if (type === "none") {
    return (
      <div className="flex flex-col items-center gap-2 opacity-50">
        <div className="w-14 h-20 rounded-t-full rounded-b-lg border-4 border-dashed border-muted-foreground/30" />
        <span className="text-sm text-muted-foreground">No Trophy</span>
      </div>
    );
  }
  return <PhysicalTrophy type={type} size="lg" />;
}

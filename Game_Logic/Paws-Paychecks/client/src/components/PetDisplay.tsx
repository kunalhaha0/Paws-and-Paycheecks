import { getPetMood } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";
import { Heart, Frown, Meh, Smile, Sparkles, Pill, Droplet, Dog, Cat, Rabbit, Bird } from "lucide-react";
import { PetType } from "@shared/schema";

interface PetDisplayProps {
  health: number;
  happiness: number;
  petName: string;
  petType?: PetType;
  size?: "sm" | "md" | "lg";
  showStats?: boolean;
}

export function PetDisplay({ 
  health, 
  happiness, 
  petName, 
  petType = "dog",
  size = "md", 
  showStats = true 
}: PetDisplayProps) {
  const mood = getPetMood(health, happiness);
  
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-56 h-56"
  };

  const getPetColor = () => {
    switch (mood) {
      case "sick": return "from-green-200 to-green-300 dark:from-green-800 dark:to-green-900";
      case "sad": return "from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-900";
      case "neutral": return "from-amber-200 to-amber-300 dark:from-amber-800 dark:to-amber-900";
      case "happy": return "from-orange-200 to-orange-300 dark:from-orange-800 dark:to-orange-900";
      case "ecstatic": return "from-pink-200 to-pink-300 dark:from-pink-800 dark:to-pink-900";
    }
  };

  const getPetIcon = () => {
    switch (petType) {
      case "dog": return Dog;
      case "cat": return Cat;
      case "rabbit": return Rabbit;
      case "hamster": return Dog;
      case "bird": return Bird;
      default: return Dog;
    }
  };

  const getMoodIcon = () => {
    switch (mood) {
      case "sick": return Frown;
      case "sad": return Frown;
      case "neutral": return Meh;
      case "happy": return Smile;
      case "ecstatic": return Smile;
    }
  };

  const PetIcon = getPetIcon();
  const MoodIcon = getMoodIcon();
  
  const animationClass = {
    sick: "shake",
    sad: "",
    neutral: "",
    happy: "bounce-subtle",
    ecstatic: "float"
  }[mood];

  const petIconSize = size === "sm" ? "w-10 h-10" : size === "md" ? "w-16 h-16" : "w-20 h-20";
  const moodIconSize = size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8";

  const getEarStyle = () => {
    switch (petType) {
      case "dog":
        return (
          <>
            <div className="absolute -top-1 left-[20%] w-5 h-7 rounded-t-full bg-inherit rotate-[-15deg]" />
            <div className="absolute -top-1 right-[20%] w-5 h-7 rounded-t-full bg-inherit rotate-[15deg]" />
          </>
        );
      case "cat":
        return (
          <>
            <div className="absolute -top-3 left-[15%] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-transparent border-b-inherit rotate-[-10deg]" style={{ borderBottomColor: 'inherit' }} />
            <div className="absolute -top-3 right-[15%] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-transparent border-b-inherit rotate-[10deg]" style={{ borderBottomColor: 'inherit' }} />
          </>
        );
      case "rabbit":
        return (
          <>
            <div className="absolute -top-8 left-[25%] w-4 h-12 rounded-t-full bg-inherit rotate-[-5deg]" />
            <div className="absolute -top-8 right-[25%] w-4 h-12 rounded-t-full bg-inherit rotate-[5deg]" />
          </>
        );
      case "hamster":
        return (
          <>
            <div className="absolute -top-1 left-[18%] w-4 h-4 rounded-full bg-inherit" />
            <div className="absolute -top-1 right-[18%] w-4 h-4 rounded-full bg-inherit" />
          </>
        );
      case "bird":
        return (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-5 rounded-t-full bg-amber-400 dark:bg-amber-600" />
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className={cn(
          sizeClasses[size],
          "relative rounded-full bg-gradient-to-br flex items-center justify-center",
          getPetColor(),
          animationClass,
          "shadow-lg border-4 border-white/50 dark:border-white/20"
        )}
        data-testid="pet-display"
      >
        {getEarStyle()}
        
        <div className="flex flex-col items-center gap-1">
          <PetIcon className={cn(petIconSize, "text-gray-700 dark:text-gray-300")} />
          <MoodIcon className={cn(moodIconSize, "text-gray-600 dark:text-gray-400")} />
        </div>
        
        {mood === "ecstatic" && (
          <>
            <Sparkles className="absolute -top-4 -left-2 w-5 h-5 text-yellow-500" />
            <Sparkles className="absolute -top-2 -right-4 w-5 h-5 text-yellow-500" />
            <Heart className="absolute -bottom-2 left-0 w-5 h-5 text-pink-500" />
          </>
        )}
        {mood === "sick" && (
          <Pill className="absolute -top-4 right-0 w-5 h-5 text-red-500" />
        )}
        {mood === "sad" && (
          <Droplet className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 text-blue-500" />
        )}
      </div>
      
      <span className={cn(
        "font-semibold text-foreground",
        size === "sm" ? "text-sm" : size === "md" ? "text-lg" : "text-xl"
      )} data-testid="text-pet-name">
        {petName}
      </span>
      
      {showStats && (
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1" data-testid="stat-health-mini">
            <Heart className="w-4 h-4 text-red-500" />
            <span className={cn(
              health < 40 ? "text-destructive" : health < 70 ? "text-amber-500" : "text-green-600 dark:text-green-400"
            )}>
              {health}
            </span>
          </div>
          <div className="flex items-center gap-1" data-testid="stat-happiness-mini">
            <Smile className="w-4 h-4 text-yellow-500" />
            <span className={cn(
              happiness < 40 ? "text-destructive" : happiness < 70 ? "text-amber-500" : "text-green-600 dark:text-green-400"
            )}>
              {happiness}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

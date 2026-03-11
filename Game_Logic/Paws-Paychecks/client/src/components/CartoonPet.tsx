import { getPetMood } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";
import { PetType } from "@shared/schema";

interface CartoonPetProps {
  health: number;
  happiness: number;
  petName: string;
  petType?: PetType;
  size?: "sm" | "md" | "lg";
  showStats?: boolean;
}

export function CartoonPet({ 
  health, 
  happiness, 
  petName, 
  petType = "dog",
  size = "md", 
  showStats = true 
}: CartoonPetProps) {
  const mood = getPetMood(health, happiness);
  
  const sizeMap = {
    sm: { width: 100, height: 110 },
    md: { width: 160, height: 175 },
    lg: { width: 220, height: 240 }
  };

  const dimensions = sizeMap[size];

  const animationClass = {
    sick: "animate-pulse",
    sad: "",
    neutral: "",
    happy: "animate-bounce-subtle",
    ecstatic: "animate-bounce-subtle"
  }[mood];

  const getPetSVG = () => {
    switch (petType) {
      case "dog":
        return <DogIcon mood={mood} />;
      case "cat":
        return <CatIcon mood={mood} />;
      case "rabbit":
        return <RabbitIcon mood={mood} />;
      case "hamster":
        return <HamsterIcon mood={mood} />;
      case "bird":
        return <BirdIcon mood={mood} />;
      default:
        return <DogIcon mood={mood} />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className={cn("relative", animationClass)}
        style={{ width: dimensions.width, height: dimensions.height }}
        data-testid="cartoon-pet-display"
      >
        {getPetSVG()}
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
            <span className={cn(
              "w-3 h-3 rounded-full",
              health < 40 ? "bg-red-500" : health < 70 ? "bg-amber-500" : "bg-green-500"
            )} />
            <span className={cn(
              health < 40 ? "text-destructive" : health < 70 ? "text-amber-500" : "text-green-600 dark:text-green-400"
            )}>
              {health}
            </span>
          </div>
          <div className="flex items-center gap-1" data-testid="stat-happiness-mini">
            <span className={cn(
              "w-3 h-3 rounded-full",
              happiness < 40 ? "bg-red-500" : happiness < 70 ? "bg-amber-500" : "bg-yellow-500"
            )} />
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

type MoodType = "sick" | "sad" | "neutral" | "happy" | "ecstatic";

function DogIcon({ mood }: { mood: MoodType }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M8 35 C6 25 10 15 18 18 C24 20 26 28 26 38 C26 48 22 58 18 62 C14 66 8 62 6 55 C4 48 6 42 8 35" 
            fill="#F5A623" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 32 C12 26 14 22 18 22 C20 24 20 30 18 40 C16 48 14 52 12 48 C10 44 10 38 12 32" 
            fill="#D4881E"/>
      
      <path d="M92 35 C94 25 90 15 82 18 C76 20 74 28 74 38 C74 48 78 58 82 62 C86 66 92 62 94 55 C96 48 94 42 92 35" 
            fill="#F5A623" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M88 32 C88 26 86 22 82 22 C80 24 80 30 82 40 C84 48 86 52 88 48 C90 44 90 38 88 32" 
            fill="#D4881E"/>
      
      <ellipse cx="50" cy="55" rx="38" ry="40" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="2.5"/>
      
      <path d="M20 40 C22 32 30 28 38 32 C42 36 40 48 34 56 C28 60 20 58 18 52 C16 48 18 44 20 40" 
            fill="#F5A623" stroke="#2D2D2D" strokeWidth="2"/>
      <path d="M80 40 C78 32 70 28 62 32 C58 36 60 48 66 56 C72 60 80 58 82 52 C84 48 82 44 80 40" 
            fill="#F5A623" stroke="#2D2D2D" strokeWidth="2"/>
      
      {mood === "sick" ? (
        <g className="sick-eyes">
          <path d="M30 42 L40 52 M40 42 L30 52" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round"/>
          <path d="M60 42 L70 52 M70 42 L60 52" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round"/>
        </g>
      ) : mood === "sad" ? (
        <g className="sad-eyes">
          <ellipse cx="35" cy="48" rx="6" ry="7" fill="#2D2D2D"/>
          <ellipse cx="65" cy="48" rx="6" ry="7" fill="#2D2D2D"/>
          <circle cx="36" cy="46" r="2" fill="#FFFFFF"/>
          <circle cx="66" cy="46" r="2" fill="#FFFFFF"/>
          <path d="M26 40 C30 46 40 46 44 40" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M56 40 C60 46 70 46 74 40" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
      ) : mood === "ecstatic" ? (
        <g className="ecstatic-eyes">
          <path d="M28 48 C32 40 38 40 42 48" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M58 48 C62 40 68 40 72 48" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </g>
      ) : (
        <g className="normal-eyes">
          <ellipse cx="35" cy="46" rx="7" ry="8" fill="#2D2D2D"/>
          <ellipse cx="65" cy="46" rx="7" ry="8" fill="#2D2D2D"/>
          <circle cx="37" cy="44" r="2.5" fill="#FFFFFF"/>
          <circle cx="67" cy="44" r="2.5" fill="#FFFFFF"/>
        </g>
      )}
      
      <ellipse cx="50" cy="64" rx="8" ry="6" fill="#2D2D2D"/>
      
      {mood === "sick" ? (
        <path d="M38 78 C44 72 56 72 62 78" stroke="#2D2D2D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      ) : mood === "sad" ? (
        <path d="M38 82 C44 74 56 74 62 82" stroke="#2D2D2D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      ) : (
        <g className="happy-mouth">
          <path d="M32 72 C40 90 60 90 68 72" stroke="#2D2D2D" strokeWidth="2.5" fill="#FFFFFF" strokeLinecap="round"/>
        </g>
      )}
      
      {(mood === "happy" || mood === "ecstatic") && (
        <g className="blush">
          <ellipse cx="20" cy="58" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
          <ellipse cx="80" cy="58" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
        </g>
      )}
    </svg>
  );
}

function CatIcon({ mood }: { mood: MoodType }) {
  return (
    <svg viewBox="0 0 100 95" className="w-full h-full">
      <path d="M20 45 C18 30 22 12 28 8 C32 6 36 14 34 28 C32 38 28 46 24 48 C22 48 20 47 20 45" 
            fill="#FF9F43" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24 40 C26 28 28 18 28 14 C28 20 26 32 24 40" fill="#FFB6C1"/>
      
      <path d="M80 45 C82 30 78 12 72 8 C68 6 64 14 66 28 C68 38 72 46 76 48 C78 48 80 47 80 45" 
            fill="#FF9F43" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M76 40 C74 28 72 18 72 14 C72 20 74 32 76 40" fill="#FFB6C1"/>
      
      <ellipse cx="50" cy="55" rx="34" ry="30" fill="#FF9F43" stroke="#2D2D2D" strokeWidth="2.5"/>
      
      <ellipse cx="50" cy="68" rx="16" ry="12" fill="#FFFFFF"/>
      
      {mood === "sick" ? (
        <g className="sick-eyes">
          <path d="M30 45 L40 55 M40 45 L30 55" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round"/>
          <path d="M60 45 L70 55 M70 45 L60 55" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round"/>
        </g>
      ) : mood === "sad" ? (
        <g className="sad-eyes">
          <ellipse cx="35" cy="50" rx="7" ry="9" fill="#2D2D2D"/>
          <ellipse cx="65" cy="50" rx="7" ry="9" fill="#2D2D2D"/>
          <ellipse cx="36" cy="47" r="2.5" fill="#FFFFFF"/>
          <ellipse cx="66" cy="47" r="2.5" fill="#FFFFFF"/>
          <path d="M26 40 C30 46 40 46 44 40" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M56 40 C60 46 70 46 74 40" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
      ) : mood === "ecstatic" ? (
        <g className="ecstatic-eyes">
          <path d="M28 50 C32 42 38 42 42 50" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M58 50 C62 42 68 42 72 50" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </g>
      ) : (
        <g className="normal-eyes">
          <ellipse cx="35" cy="48" rx="8" ry="10" fill="#2D2D2D"/>
          <ellipse cx="65" cy="48" rx="8" ry="10" fill="#2D2D2D"/>
          <circle cx="37" cy="45" r="3" fill="#FFFFFF"/>
          <circle cx="67" cy="45" r="3" fill="#FFFFFF"/>
        </g>
      )}
      
      <ellipse cx="50" cy="65" rx="4" ry="3" fill="#FFB6C1" stroke="#2D2D2D" strokeWidth="1"/>
      
      {mood === "sick" ? (
        <path d="M42 76 C46 72 54 72 58 76" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      ) : mood === "sad" ? (
        <path d="M42 78 C46 72 54 72 58 78" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      ) : (
        <g className="cat-mouth">
          <path d="M50 68 L50 74" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
          <path d="M42 74 C46 80 54 80 58 74" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
      )}
      
      <g className="whiskers" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round">
        <path d="M10 58 C18 60 24 62 28 64"/>
        <path d="M10 66 C18 66 24 66 28 66"/>
        <path d="M10 74 C18 72 24 70 28 68"/>
        <path d="M90 58 C82 60 76 62 72 64"/>
        <path d="M90 66 C82 66 76 66 72 66"/>
        <path d="M90 74 C82 72 76 70 72 68"/>
      </g>
      
      {(mood === "happy" || mood === "ecstatic") && (
        <g className="blush">
          <ellipse cx="22" cy="58" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
          <ellipse cx="78" cy="58" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
        </g>
      )}
    </svg>
  );
}

function RabbitIcon({ mood }: { mood: MoodType }) {
  return (
    <svg viewBox="0 0 100 105" className="w-full h-full">
      <path d="M32 50 C28 45 26 20 28 8 C30 2 34 2 36 8 C40 20 40 45 38 52 C36 54 34 54 32 50" 
            fill="#E8E8E8" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M33 45 C32 35 32 18 33 10 C34 18 34 35 34 45" fill="#FFB6C1" opacity="0.8"/>
      
      <path d="M68 50 C72 45 74 20 72 8 C70 2 66 2 64 8 C60 20 60 45 62 52 C64 54 66 54 68 50" 
            fill="#E8E8E8" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M67 45 C68 35 68 18 67 10 C66 18 66 35 66 45" fill="#FFB6C1" opacity="0.8"/>
      
      <ellipse cx="50" cy="68" rx="32" ry="28" fill="#E8E8E8" stroke="#2D2D2D" strokeWidth="2.5"/>
      
      <ellipse cx="50" cy="80" rx="14" ry="10" fill="#FFFFFF"/>
      
      {mood === "sick" ? (
        <g className="sick-eyes">
          <path d="M32 58 L42 68 M42 58 L32 68" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round"/>
          <path d="M58 58 L68 68 M68 58 L58 68" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round"/>
        </g>
      ) : mood === "sad" ? (
        <g className="sad-eyes">
          <ellipse cx="37" cy="62" rx="6" ry="8" fill="#2D2D2D"/>
          <ellipse cx="63" cy="62" rx="6" ry="8" fill="#2D2D2D"/>
          <circle cx="38" cy="60" r="2" fill="#FFFFFF"/>
          <circle cx="64" cy="60" r="2" fill="#FFFFFF"/>
          <path d="M28 54 C33 60 41 60 46 54" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M54 54 C59 60 67 60 72 54" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
      ) : mood === "ecstatic" ? (
        <g className="ecstatic-eyes">
          <path d="M30 62 C34 54 40 54 44 62" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M56 62 C60 54 66 54 70 62" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </g>
      ) : (
        <g className="normal-eyes">
          <ellipse cx="37" cy="60" rx="7" ry="9" fill="#2D2D2D"/>
          <ellipse cx="63" cy="60" rx="7" ry="9" fill="#2D2D2D"/>
          <circle cx="39" cy="57" r="2.5" fill="#FFFFFF"/>
          <circle cx="65" cy="57" r="2.5" fill="#FFFFFF"/>
        </g>
      )}
      
      <ellipse cx="50" cy="76" rx="5" ry="4" fill="#FFB6C1" stroke="#2D2D2D" strokeWidth="1"/>
      
      {mood === "sick" ? (
        <path d="M42 86 C46 82 54 82 58 86" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      ) : mood === "sad" ? (
        <path d="M42 88 C46 82 54 82 58 88" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      ) : (
        <g className="rabbit-mouth">
          <path d="M50 80 L50 85" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
          <path d="M43 85 C47 90 53 90 57 85" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
      )}
      
      {(mood === "happy" || mood === "ecstatic") && (
        <g className="blush">
          <ellipse cx="24" cy="70" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
          <ellipse cx="76" cy="70" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
        </g>
      )}
      
      <g className="teeth">
        <path d="M46 90 L46 96 C46 98 48 99 50 99 C52 99 54 98 54 96 L54 90" fill="#FFFFFF" stroke="#2D2D2D" strokeWidth="1.5"/>
        <line x1="50" y1="90" x2="50" y2="98" stroke="#2D2D2D" strokeWidth="1"/>
      </g>
    </svg>
  );
}

function HamsterIcon({ mood }: { mood: MoodType }) {
  return (
    <svg viewBox="0 0 100 90" className="w-full h-full">
      <circle cx="22" cy="18" r="10" fill="#F5A623" stroke="#2D2D2D" strokeWidth="2.5"/>
      <circle cx="22" cy="18" r="5" fill="#FFB6C1"/>
      
      <circle cx="78" cy="18" r="10" fill="#F5A623" stroke="#2D2D2D" strokeWidth="2.5"/>
      <circle cx="78" cy="18" r="5" fill="#FFB6C1"/>
      
      <ellipse cx="50" cy="50" rx="38" ry="32" fill="#F5A623" stroke="#2D2D2D" strokeWidth="2.5"/>
      
      <ellipse cx="50" cy="62" rx="18" ry="14" fill="#FFF5E6"/>
      
      <ellipse cx="24" cy="50" rx="10" ry="8" fill="#FFB6C1" opacity="0.6"/>
      <ellipse cx="76" cy="50" rx="10" ry="8" fill="#FFB6C1" opacity="0.6"/>
      
      {mood === "sick" ? (
        <g className="sick-eyes">
          <path d="M32 38 L42 48 M42 38 L32 48" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round"/>
          <path d="M58 38 L68 48 M68 38 L58 48" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round"/>
        </g>
      ) : mood === "sad" ? (
        <g className="sad-eyes">
          <ellipse cx="37" cy="42" rx="5" ry="6" fill="#2D2D2D"/>
          <ellipse cx="63" cy="42" rx="5" ry="6" fill="#2D2D2D"/>
          <circle cx="38" cy="40" r="1.5" fill="#FFFFFF"/>
          <circle cx="64" cy="40" r="1.5" fill="#FFFFFF"/>
          <path d="M28 34 C33 40 41 40 46 34" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M54 34 C59 40 67 40 72 34" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
      ) : mood === "ecstatic" ? (
        <g className="ecstatic-eyes">
          <path d="M30 42 C34 34 40 34 44 42" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M56 42 C60 34 66 34 70 42" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </g>
      ) : (
        <g className="normal-eyes">
          <ellipse cx="37" cy="40" rx="6" ry="7" fill="#2D2D2D"/>
          <ellipse cx="63" cy="40" rx="6" ry="7" fill="#2D2D2D"/>
          <circle cx="39" cy="38" r="2" fill="#FFFFFF"/>
          <circle cx="65" cy="38" r="2" fill="#FFFFFF"/>
        </g>
      )}
      
      <ellipse cx="50" cy="55" rx="5" ry="4" fill="#2D2D2D"/>
      
      {mood === "sick" ? (
        <path d="M42 68 C46 64 54 64 58 68" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      ) : mood === "sad" ? (
        <path d="M42 70 C46 64 54 64 58 70" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      ) : (
        <g className="hamster-mouth">
          <path d="M40 64 C45 74 55 74 60 64" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
      )}
      
      <g className="whiskers" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 45 C18 47 22 49 26 51"/>
        <path d="M12 53 C18 53 22 53 26 53"/>
        <path d="M12 61 C18 59 22 57 26 55"/>
        <path d="M88 45 C82 47 78 49 74 51"/>
        <path d="M88 53 C82 53 78 53 74 53"/>
        <path d="M88 61 C82 59 78 57 74 55"/>
      </g>
    </svg>
  );
}

function BirdIcon({ mood }: { mood: MoodType }) {
  return (
    <svg viewBox="0 0 100 95" className="w-full h-full">
      <g className="crest">
        <path d="M50 18 C48 8 50 2 52 2 C54 2 56 8 54 18 C52 22 50 22 50 18" fill="#FF6B8A" stroke="#2D2D2D" strokeWidth="2"/>
        <path d="M42 22 C38 14 38 8 42 6 C44 6 48 12 46 22 C44 26 42 26 42 22" fill="#FF6B8A" stroke="#2D2D2D" strokeWidth="2"/>
        <path d="M58 22 C62 14 62 8 58 6 C56 6 52 12 54 22 C56 26 58 26 58 22" fill="#FF6B8A" stroke="#2D2D2D" strokeWidth="2"/>
      </g>
      
      <ellipse cx="50" cy="55" rx="34" ry="32" fill="#4FC3F7" stroke="#2D2D2D" strokeWidth="2.5"/>
      
      <ellipse cx="50" cy="68" rx="18" ry="16" fill="#FFFFFF"/>
      
      {mood === "sick" ? (
        <g className="sick-eyes">
          <path d="M32 42 L42 52 M42 42 L32 52" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round"/>
          <path d="M58 42 L68 52 M68 42 L58 52" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round"/>
        </g>
      ) : mood === "sad" ? (
        <g className="sad-eyes">
          <ellipse cx="37" cy="46" rx="6" ry="7" fill="#2D2D2D"/>
          <ellipse cx="63" cy="46" rx="6" ry="7" fill="#2D2D2D"/>
          <circle cx="38" cy="44" r="2" fill="#FFFFFF"/>
          <circle cx="64" cy="44" r="2" fill="#FFFFFF"/>
          <path d="M28 38 C33 44 41 44 46 38" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M54 38 C59 44 67 44 72 38" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
      ) : mood === "ecstatic" ? (
        <g className="ecstatic-eyes">
          <path d="M30 46 C34 38 40 38 44 46" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M56 46 C60 38 66 38 70 46" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </g>
      ) : (
        <g className="normal-eyes">
          <ellipse cx="37" cy="44" rx="7" ry="8" fill="#2D2D2D"/>
          <ellipse cx="63" cy="44" rx="7" ry="8" fill="#2D2D2D"/>
          <circle cx="39" cy="42" r="2.5" fill="#FFFFFF"/>
          <circle cx="65" cy="42" r="2.5" fill="#FFFFFF"/>
        </g>
      )}
      
      <path d="M50 56 C44 56 40 62 44 68 C46 70 54 70 56 68 C60 62 56 56 50 56" 
            fill="#FF9F43" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      
      {(mood === "happy" || mood === "ecstatic") && (
        <g className="blush">
          <ellipse cx="24" cy="54" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
          <ellipse cx="76" cy="54" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
        </g>
      )}
      
      <path d="M18 55 C8 50 4 60 8 72 C12 80 18 82 22 78 C26 74 24 62 18 55" 
            fill="#4FC3F7" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 62 C12 60 10 65 12 70 C14 74 18 74 18 70" fill="#29B6F6"/>
      
      <path d="M82 55 C92 50 96 60 92 72 C88 80 82 82 78 78 C74 74 76 62 82 55" 
            fill="#4FC3F7" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
      <path d="M84 62 C88 60 90 65 88 70 C86 74 82 74 82 70" fill="#29B6F6"/>
    </svg>
  );
}

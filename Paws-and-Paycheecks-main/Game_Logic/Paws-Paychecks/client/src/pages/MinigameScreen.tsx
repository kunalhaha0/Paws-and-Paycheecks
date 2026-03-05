import { JobType } from "@shared/schema";
import { getMinigameForWeek } from "@/components/minigames/MinigameRegistry";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { useMemo } from "react";

interface MinigameScreenProps {
  jobType: JobType;
  week: number;
  onComplete: (score: number) => void;
  gameSeed?: string;
}

export function MinigameScreen({ jobType, week, onComplete, gameSeed }: MinigameScreenProps) {
  const minigame = useMemo(() => getMinigameForWeek(jobType, week, gameSeed), [jobType, week, gameSeed]);
  
  const getJobTitle = () => {
    switch (jobType) {
      case "office": return "Office Work";
      case "chef": return "Kitchen Duty";
      case "engineer": return "Engineering Lab";
      case "teacher": return "Classroom";
      case "artist": return "Art Studio";
    }
  };

  const MinigameComponent = minigame.component;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-accent/5" data-testid="screen-minigame">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="secondary" className="text-sm" data-testid="badge-week-job">
            <Briefcase className="w-3 h-3 mr-1" />
            Week {week} - {getJobTitle()}
          </Badge>
          <p className="text-lg font-medium text-foreground" data-testid="text-minigame-name">{minigame.name}</p>
        </div>

        <MinigameComponent onComplete={onComplete} />
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CartoonPet } from "@/components/CartoonPet";
import { cn } from "@/lib/utils";
import { Play, Trophy, HelpCircle, Sparkles, PawPrint, Dog, Cat, Rabbit } from "lucide-react";
import { PetType, PET_TYPES } from "@shared/schema";

interface HomeScreenProps {
  playerName: string;
  onStartGame: (name: string, petName: string, petType: PetType, hardMode: boolean) => void;
  onViewTrophies: () => void;
}

export function HomeScreen({ playerName, onStartGame, onViewTrophies }: HomeScreenProps) {
  const [name, setName] = useState(playerName);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState<PetType>("dog");
  const [hardMode, setHardMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const getPetTypeIcon = (type: PetType) => {
    switch (type) {
      case "dog": return Dog;
      case "cat": return Cat;
      case "rabbit": return Rabbit;
      case "hamster": return PawPrint;
      case "bird": return PawPrint;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/5 animate-pulse" />
        <div className="absolute top-32 right-16 w-12 h-12 rounded-full bg-amber-500/10" />
        <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-green-500/10 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 right-10 w-24 h-24 rounded-full bg-primary/5" />
        <div className="absolute top-1/2 left-5 w-8 h-8 rounded-full bg-pink-500/10 animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-20 left-1/3 w-6 h-6 rounded-full bg-amber-400/15" />
        <div className="absolute bottom-32 right-1/3 w-10 h-10 rounded-full bg-blue-400/10" />
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center space-y-4 slide-up">
          <div className="bounce-subtle inline-block">
            <PawPrint className="w-16 h-16 text-primary mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight" data-testid="text-game-title">
            Paws & Paychecks
          </h1>
          <p className="text-muted-foreground text-lg">
            Adopt a pet, manage your money, and become the best pet parent!
          </p>
        </div>

        <Card className="p-6 space-y-6 pop-in">
          <div className="space-y-3">
            <Label htmlFor="playerName" className="text-base font-medium">
              What's your name?
            </Label>
            <Input
              id="playerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="text-lg"
              maxLength={20}
              data-testid="input-player-name"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="petName" className="text-base font-medium">
              Name your pet
            </Label>
            <Input
              id="petName"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Enter pet name..."
              className="text-lg"
              maxLength={15}
              data-testid="input-pet-name"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Choose your pet</Label>
            <div className="grid grid-cols-5 gap-2">
              {PET_TYPES.map(({ type, name: typeName }) => {
                const IconComponent = getPetTypeIcon(type);
                return (
                  <button
                    key={type}
                    onClick={() => setPetType(type)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all hover-elevate",
                      petType === type 
                        ? "border-primary bg-primary/10 ring-2 ring-primary" 
                        : "border-border bg-card"
                    )}
                    data-testid={`button-pet-type-${type}`}
                  >
                    <IconComponent className={cn(
                      "w-6 h-6",
                      petType === type ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-xs font-medium",
                      petType === type ? "text-primary" : "text-muted-foreground"
                    )}>
                      {typeName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="space-y-1">
              <div className="font-medium flex items-center gap-2 text-foreground">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Hard Mode
              </div>
              <p className="text-sm text-muted-foreground">
                Less money, harder events
              </p>
            </div>
            <Switch
              checked={hardMode}
              onCheckedChange={setHardMode}
              data-testid="switch-hard-mode"
            />
          </div>

          <Button
            onClick={() => onStartGame(name || "Player", petName || "Buddy", petType, hardMode)}
            size="lg"
            className="w-full text-lg"
            disabled={!name.trim()}
            data-testid="button-start-game"
          >
            <Play className="w-5 h-5 mr-2" />
            Start New Game
          </Button>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={onViewTrophies}
            className="h-auto py-4"
            data-testid="button-view-trophies"
          >
            <div className="flex flex-col items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span>Trophy Bookshelf</span>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowHelp(!showHelp)}
            className="h-auto py-4"
            data-testid="button-help"
          >
            <div className="flex flex-col items-center gap-2">
              <HelpCircle className="w-6 h-6 text-accent" />
              <span>How to Play</span>
            </div>
          </Button>
        </div>

        {showHelp && (
          <Card className="p-6 space-y-4 slide-up" data-testid="card-help">
            <h3 className="font-bold text-lg text-foreground">How to Play</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">1. Take the Quiz:</strong> Answer 5 questions to find your perfect job.
              </p>
              <p>
                <strong className="text-foreground">2. Play Minigames:</strong> Each week, complete a job-related minigame to earn money.
              </p>
              <p>
                <strong className="text-foreground">3. Care for Your Pet:</strong> Buy food, toys, and healthcare to keep your pet healthy and happy.
              </p>
              <p>
                <strong className="text-foreground">4. Handle Events:</strong> Random events will test your finances - some good, some challenging!
              </p>
              <p>
                <strong className="text-foreground">5. Earn Trophies:</strong> After 12 weeks, earn a trophy based on your pet care and financial skills!
              </p>
            </div>
          </Card>
        )}

        <div className="flex justify-center">
          <CartoonPet 
            health={85} 
            happiness={90} 
            petName={petName || "Your pet"} 
            petType={petType}
            size="sm" 
            showStats={false} 
          />
        </div>
      </div>
    </div>
  );
}

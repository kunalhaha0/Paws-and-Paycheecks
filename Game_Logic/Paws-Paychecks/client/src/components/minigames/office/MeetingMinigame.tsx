import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Users, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const NOTES = [
  { topic: "Budget Review", keywords: ["expenses", "revenue", "forecast"] },
  { topic: "Project Update", keywords: ["timeline", "milestones", "blockers"] },
  { topic: "Team Building", keywords: ["activities", "morale", "collaboration"] },
  { topic: "Client Meeting", keywords: ["requirements", "feedback", "deliverables"] },
  { topic: "Training Session", keywords: ["skills", "development", "learning"] },
];

export function MeetingMinigame({ onComplete }: Props) {
  const [notes, setNotes] = useState<typeof NOTES>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"memorize" | "recall">("memorize");
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [memoryTime, setMemoryTime] = useState(5);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...NOTES].sort(() => Math.random() - 0.5).slice(0, 4);
    setNotes(shuffled);
  }, []);

  useEffect(() => {
    if (!started || finished || phase !== "memorize") return;
    const timer = setInterval(() => {
      setMemoryTime(prev => { if (prev <= 1) { setPhase("recall"); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished, phase]);

  useEffect(() => {
    if (phase === "recall" && notes.length > 0 && currentIndex < notes.length) {
      const correct = notes[currentIndex].topic;
      const others = NOTES.map(n => n.topic).filter(t => t !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
      setOptions([correct, ...others].sort(() => Math.random() - 0.5));
    }
  }, [phase, currentIndex, notes]);

  useEffect(() => {
    if (finished && !completedRef.current && notes.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / notes.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, notes.length, onComplete]);

  const handleSelect = useCallback((topic: string) => {
    if (topic === notes[currentIndex].topic) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= notes.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [notes, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Meeting Notes</h2>
          <p className="text-muted-foreground">Memorize the keywords and match them to topics!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Meeting</Button>
      </Card>
    );
  }

  if (finished) {
    const score = notes.length > 0 ? Math.round((correctCount / notes.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Meeting Over!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} notes matched correctly</p>
        </div>
      </Card>
    );
  }

  if (phase === "memorize") {
    return (
      <Card className="p-8 space-y-6" data-testid="card-minigame-active">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Memorize in {memoryTime}s...</p>
        </div>
        <div className="space-y-3">
          {notes.map((note, i) => (
            <div key={i} className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-foreground">{note.topic}</p>
              <p className="text-sm text-muted-foreground">{note.keywords.join(", ")}</p>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const current = notes[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="text-sm text-muted-foreground text-center">Note {currentIndex + 1} of {notes.length}</div>
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground mb-2">Which topic had these keywords?</p>
        <p className="text-xl font-medium text-foreground">{current?.keywords.join(", ")}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <Button key={i} variant="outline" onClick={() => handleSelect(opt)} className="h-14" data-testid={`topic-${i}`}>
            {opt}
          </Button>
        ))}
      </div>
    </Card>
  );
}

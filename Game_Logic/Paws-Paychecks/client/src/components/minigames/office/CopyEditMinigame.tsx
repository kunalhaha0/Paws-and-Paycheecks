import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PenTool, Trophy, CheckCircle, AlertCircle, Check, X } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const SENTENCES = [
  { text: "The meeting is scheduled for tommorrow.", hasError: true },
  { text: "Please review the attached document.", hasError: false },
  { text: "The project deadline was moved to Wenesday.", hasError: true },
  { text: "All team members attended the conference.", hasError: false },
  { text: "The buget report needs your approval.", hasError: true },
  { text: "Client feedback was overwhelmingly positive.", hasError: false },
  { text: "We need to scedule a follow-up meeting.", hasError: true },
  { text: "The quarterly results exceeded expectations.", hasError: false },
];

export function CopyEditMinigame({ onComplete }: Props) {
  const [sentences, setSentences] = useState<typeof SENTENCES>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...SENTENCES].sort(() => Math.random() - 0.5).slice(0, 8);
    setSentences(shuffled);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && sentences.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / sentences.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, sentences.length, onComplete]);

  const handleAnswer = useCallback((hasError: boolean) => {
    if (sentences[currentIndex].hasError === hasError) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= sentences.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [sentences, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Proofreading</h2>
          <p className="text-muted-foreground">Find the spelling errors in each sentence!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <PenTool className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Editing</Button>
      </Card>
    );
  }

  if (finished) {
    const score = sentences.length > 0 ? Math.round((correctCount / sentences.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Editing Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} sentences checked correctly</p>
        </div>
      </Card>
    );
  }

  const current = sentences[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Sentence {currentIndex + 1} of {sentences.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="p-6 bg-muted/50 rounded-lg text-center">
        <p className="text-xl text-foreground leading-relaxed">{current?.text}</p>
      </div>
      <p className="text-center text-muted-foreground">Does this sentence have a spelling error?</p>
      <div className="flex gap-4 justify-center">
        <Button size="lg" onClick={() => handleAnswer(true)} className="w-32 h-14 bg-red-500 hover:bg-red-600" data-testid="button-has-error">
          <X className="w-6 h-6 mr-2" />Error
        </Button>
        <Button size="lg" onClick={() => handleAnswer(false)} className="w-32 h-14 bg-green-500 hover:bg-green-600" data-testid="button-no-error">
          <Check className="w-6 h-6 mr-2" />Correct
        </Button>
      </div>
    </Card>
  );
}

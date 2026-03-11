import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpen, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type SpellingQuestion = { word: string; options: string[]; correct: number; };

const WORDS: SpellingQuestion[] = [
  { word: "necessary", options: ["necesary", "necessary", "neccessary"], correct: 1 },
  { word: "accommodate", options: ["accommodate", "accomodate", "acommodate"], correct: 0 },
  { word: "definitely", options: ["definately", "definitly", "definitely"], correct: 2 },
  { word: "separate", options: ["seperate", "separate", "seperete"], correct: 1 },
  { word: "occurrence", options: ["occurence", "occurance", "occurrence"], correct: 2 },
  { word: "embarrass", options: ["embarass", "embarrass", "embarras"], correct: 1 },
  { word: "rhythm", options: ["rythm", "rhythem", "rhythm"], correct: 2 },
  { word: "privilege", options: ["privilege", "privelege", "priviledge"], correct: 0 },
  { word: "conscience", options: ["concience", "conscience", "consience"], correct: 1 },
  { word: "calendar", options: ["calender", "calander", "calendar"], correct: 2 },
];

export function SpellingMinigame({ onComplete }: Props) {
  const [questions, setQuestions] = useState<SpellingQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(shuffled);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && questions.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / questions.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, questions.length, onComplete]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (optionIndex === questions[currentIndex].correct) {
      setCorrectCount(prev => prev + 1);
    }
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [questions, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Spelling Bee</h2>
          <p className="text-muted-foreground">Pick the correct spelling of each word!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Spelling</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Spelling Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} / {questions.length} spelled correctly</p>
        </div>
      </Card>
    );
  }

  const current = questions[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Word {currentIndex + 1} of {questions.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center space-y-6">
        <p className="text-lg text-muted-foreground">Select the correct spelling:</p>
        <div className="flex flex-col gap-3">
          {current?.options.map((option, i) => (
            <Button key={i} onClick={() => handleAnswer(i)} variant="outline" size="lg" className="text-xl font-mono" data-testid={`button-option-${i}`}>
              {option}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}

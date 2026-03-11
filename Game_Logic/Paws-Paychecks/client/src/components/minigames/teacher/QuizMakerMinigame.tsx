import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClipboardList, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type QuizQuestion = { question: string; correctType: string; };

const QUESTIONS: QuizQuestion[] = [
  { question: "What is the capital of France?", correctType: "Multiple Choice" },
  { question: "Explain the water cycle in your own words.", correctType: "Essay" },
  { question: "Is the Earth flat?", correctType: "True/False" },
  { question: "List three types of rocks.", correctType: "Short Answer" },
  { question: "Which planet is closest to the sun?", correctType: "Multiple Choice" },
  { question: "Describe photosynthesis.", correctType: "Essay" },
  { question: "Mammals are warm-blooded.", correctType: "True/False" },
  { question: "Name the author of Romeo and Juliet.", correctType: "Short Answer" },
  { question: "What causes earthquakes?", correctType: "Essay" },
  { question: "5 + 7 = 12", correctType: "True/False" },
];

const ANSWER_TYPES = ["Multiple Choice", "True/False", "Short Answer", "Essay"];

export function QuizMakerMinigame({ onComplete }: Props) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 8);
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

  const handleAnswer = useCallback((answerType: string) => {
    if (answerType === questions[currentIndex].correctType) {
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
          <h2 className="text-2xl font-bold text-foreground">Quiz Maker</h2>
          <p className="text-muted-foreground">Match questions to the best answer type!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <ClipboardList className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Quiz Making</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Quiz Created!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} / {questions.length} matched correctly</p>
        </div>
      </Card>
    );
  }

  const current = questions[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center space-y-6">
        <div className="p-6 bg-muted/50 rounded-lg">
          <p className="text-lg font-medium text-foreground" data-testid="text-question">{current?.question}</p>
        </div>
        <p className="text-muted-foreground">What answer type fits best?</p>
        <div className="grid grid-cols-2 gap-3">
          {ANSWER_TYPES.map(type => (
            <Button key={type} onClick={() => handleAnswer(type)} variant="outline" className="h-auto py-3" data-testid={`button-type-${type.toLowerCase().replace(/\s+/g, "-")}`}>
              {type}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}

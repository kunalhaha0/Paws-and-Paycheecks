import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, X, BookOpen, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface MatchingMinigameProps {
  onComplete: (score: number) => void;
}

type Question = {
  id: number;
  question: string;
  answer: boolean;
};

const QUESTIONS: Question[] = [
  { id: 1, question: "5 + 3 = 8", answer: true },
  { id: 2, question: "12 - 7 = 4", answer: false },
  { id: 3, question: "6 x 4 = 24", answer: true },
  { id: 4, question: "15 / 3 = 6", answer: false },
  { id: 5, question: "9 + 6 = 15", answer: true },
  { id: 6, question: "8 x 7 = 54", answer: false },
  { id: 7, question: "20 - 8 = 12", answer: true },
  { id: 8, question: "7 x 8 = 56", answer: true },
  { id: 9, question: "45 / 9 = 6", answer: false },
  { id: 10, question: "11 + 9 = 20", answer: true },
];

export function MatchingMinigame({ onComplete }: MatchingMinigameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 8));
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
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

  const handleAnswer = useCallback((answer: boolean) => {
    const current = questions[currentIndex];
    const isCorrect = current.answer === answer;
    
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 >= questions.length) {
        setFinished(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 500);
  }, [questions, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Quick Grading</h2>
          <p className="text-muted-foreground">Is the equation correct? Grade as fast as you can!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Grading
        </Button>
      </Card>
    );
  }

  if (finished) {
    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Grading Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : 
           score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : 
           <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">
            {correctCount} / {questions.length} graded correctly
          </p>
        </div>
      </Card>
    );
  }

  const current = questions[currentIndex];

  return (
    <Card className={cn(
      "p-8 space-y-6 transition-colors",
      feedback === "correct" && "bg-green-50 dark:bg-green-900/20",
      feedback === "wrong" && "bg-red-50 dark:bg-red-900/20"
    )} data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground" data-testid="text-question-progress">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className={cn(
          "text-2xl font-bold",
          timeLeft <= 10 ? "text-destructive shake" : "text-foreground"
        )} data-testid="text-time-left">
          {timeLeft}s
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full",
              i < currentIndex ? "bg-primary" : i === currentIndex ? "bg-primary animate-pulse" : "bg-muted"
            )}
            data-testid={`question-indicator-${i}`}
          />
        ))}
      </div>

      <div className="text-center py-8">
        <div className="text-5xl font-bold font-mono text-foreground mb-4" data-testid="text-equation">
          {current.question}
        </div>
        <p className="text-muted-foreground">Is this equation correct?</p>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          size="lg"
          onClick={() => handleAnswer(true)}
          className="w-32 h-16 text-xl bg-green-500 hover:bg-green-600"
          disabled={feedback !== null}
          data-testid="button-answer-correct"
        >
          <Check className="w-8 h-8 mr-2" />
          Yes
        </Button>
        <Button
          size="lg"
          onClick={() => handleAnswer(false)}
          className="w-32 h-16 text-xl bg-red-500 hover:bg-red-600"
          disabled={feedback !== null}
          data-testid="button-answer-wrong"
        >
          <X className="w-8 h-8 mr-2" />
          No
        </Button>
      </div>
    </Card>
  );
}

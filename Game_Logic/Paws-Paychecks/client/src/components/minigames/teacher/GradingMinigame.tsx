import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type Paper = { id: number; studentName: string; score: number; correctGrade: string; };

const STUDENT_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Blake", "Drew"];

const getGrade = (score: number): string => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

const generatePapers = (): Paper[] => {
  const shuffledNames = [...STUDENT_NAMES].sort(() => Math.random() - 0.5);
  return shuffledNames.slice(0, 8).map((name, i) => {
    const score = Math.floor(Math.random() * 50) + 50;
    return { id: i, studentName: name, score, correctGrade: getGrade(score) };
  });
};

export function GradingMinigame({ onComplete }: Props) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    setPapers(generatePapers());
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && papers.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / papers.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, papers.length, onComplete]);

  const handleGrade = useCallback((grade: string) => {
    if (grade === papers[currentIndex].correctGrade) {
      setCorrectCount(prev => prev + 1);
    }
    if (currentIndex + 1 >= papers.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [papers, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Grade Papers</h2>
          <p className="text-muted-foreground">Assign the correct letter grade based on the score!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <FileText className="w-10 h-10 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">
          <p>A: 90-100 | B: 80-89 | C: 70-79 | D: 60-69 | F: Below 60</p>
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Grading</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / papers.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Papers Graded!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} / {papers.length} graded correctly</p>
        </div>
      </Card>
    );
  }

  const current = papers[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Paper {currentIndex + 1} of {papers.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center space-y-4">
        <div className="p-6 bg-muted/50 rounded-lg">
          <p className="text-lg text-muted-foreground mb-2">{current?.studentName}'s Test</p>
          <div className="text-5xl font-bold text-foreground" data-testid="text-score">{current?.score}%</div>
        </div>
        <p className="text-muted-foreground">What grade does this paper deserve?</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {["A", "B", "C", "D", "F"].map(grade => (
            <Button key={grade} onClick={() => handleGrade(grade)} variant="outline" size="lg" className="w-14 h-14 text-xl font-bold" data-testid={`button-grade-${grade}`}>
              {grade}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}

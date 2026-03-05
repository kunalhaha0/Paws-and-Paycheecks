import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Users, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type Student = { id: number; name: string; isPresent: boolean; };

const STUDENT_NAMES = ["Emma Johnson", "Liam Smith", "Olivia Brown", "Noah Davis", "Ava Wilson", "Ethan Taylor", "Sophia Martinez", "Mason Anderson", "Isabella Thomas", "William Garcia"];

const generateStudents = (): Student[] => {
  const shuffled = [...STUDENT_NAMES].sort(() => Math.random() - 0.5).slice(0, 8);
  return shuffled.map((name, i) => ({
    id: i,
    name,
    isPresent: Math.random() > 0.3,
  }));
};

export function AttendanceMinigame({ onComplete }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    setStudents(generateStudents());
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && students.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / students.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, students.length, onComplete]);

  const handleMark = useCallback((markPresent: boolean) => {
    if (markPresent === students[currentIndex].isPresent) {
      setCorrectCount(prev => prev + 1);
    }
    if (currentIndex + 1 >= students.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [students, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Roll Call</h2>
          <p className="text-muted-foreground">Mark students as PRESENT or ABSENT!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-10 h-10 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">If the seat is filled, mark Present. If empty, mark Absent.</p>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Roll Call</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / students.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Roll Call Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} / {students.length} marked correctly</p>
        </div>
      </Card>
    );
  }

  const current = students[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Student {currentIndex + 1} of {students.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center space-y-6">
        <div className="p-6 bg-muted/50 rounded-lg">
          <p className="text-lg text-muted-foreground mb-2">Calling:</p>
          <p className="text-2xl font-bold text-foreground" data-testid="text-student-name">{current?.name}</p>
        </div>
        <div className={cn("w-24 h-24 mx-auto rounded-lg flex items-center justify-center text-4xl", current?.isPresent ? "bg-green-100 dark:bg-green-900/30" : "bg-muted")} data-testid="visual-seat">
          {current?.isPresent ? <Users className="w-12 h-12 text-green-600" /> : <span className="text-muted-foreground">?</span>}
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => handleMark(true)} size="lg" variant="outline" className="px-6" data-testid="button-present">Present</Button>
          <Button onClick={() => handleMark(false)} size="lg" variant="outline" className="px-6" data-testid="button-absent">Absent</Button>
        </div>
      </div>
    </Card>
  );
}

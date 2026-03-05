import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Mail, Trash2, Star, Archive, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type Email = { id: number; subject: string; type: "important" | "spam" | "archive"; };

const EMAILS: Email[] = [
  { id: 1, subject: "Urgent: Project deadline", type: "important" },
  { id: 2, subject: "Win a free vacation!", type: "spam" },
  { id: 3, subject: "Meeting notes from last week", type: "archive" },
  { id: 4, subject: "Client contract review", type: "important" },
  { id: 5, subject: "You've won $1,000,000!", type: "spam" },
  { id: 6, subject: "Old invoice records", type: "archive" },
  { id: 7, subject: "Boss: Please call me ASAP", type: "important" },
  { id: 8, subject: "Limited time offer!!!", type: "spam" },
  { id: 9, subject: "Completed task summary", type: "archive" },
  { id: 10, subject: "Budget approval needed", type: "important" },
  { id: 11, subject: "Free gift card inside!", type: "spam" },
  { id: 12, subject: "Annual report backup", type: "archive" },
];

export function EmailSortMinigame({ onComplete }: Props) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...EMAILS].sort(() => Math.random() - 0.5).slice(0, 9);
    setEmails(shuffled);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && emails.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / emails.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, emails.length, onComplete]);

  const handleSort = useCallback((action: "important" | "spam" | "archive") => {
    const current = emails[currentIndex];
    const isCorrect = current.type === action;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setCorrectCount(prev => prev + 1);
    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 >= emails.length) setFinished(true);
      else setCurrentIndex(prev => prev + 1);
    }, 400);
  }, [emails, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Email Sorting</h2>
          <p className="text-muted-foreground">Sort emails: Star important, trash spam, archive the rest!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Sorting</Button>
      </Card>
    );
  }

  if (finished) {
    const score = emails.length > 0 ? Math.round((correctCount / emails.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Inbox Cleared!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} emails sorted correctly</p>
        </div>
      </Card>
    );
  }

  const current = emails[currentIndex];

  return (
    <Card className={cn("p-8 space-y-6", feedback === "correct" && "bg-green-50 dark:bg-green-900/20", feedback === "wrong" && "bg-red-50 dark:bg-red-900/20")} data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Email {currentIndex + 1} of {emails.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="p-6 bg-card border rounded-lg">
        <div className="flex items-start gap-3">
          <Mail className="w-6 h-6 text-muted-foreground mt-1" />
          <div>
            <p className="font-medium text-lg text-foreground">{current?.subject}</p>
            <p className="text-sm text-muted-foreground">From: sender@email.com</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <Button size="lg" onClick={() => handleSort("important")} className="bg-yellow-500 hover:bg-yellow-600" disabled={feedback !== null} data-testid="button-important">
          <Star className="w-5 h-5 mr-2" />Important
        </Button>
        <Button size="lg" onClick={() => handleSort("spam")} className="bg-red-500 hover:bg-red-600" disabled={feedback !== null} data-testid="button-spam">
          <Trash2 className="w-5 h-5 mr-2" />Spam
        </Button>
        <Button size="lg" onClick={() => handleSort("archive")} className="bg-blue-500 hover:bg-blue-600" disabled={feedback !== null} data-testid="button-archive">
          <Archive className="w-5 h-5 mr-2" />Archive
        </Button>
      </div>
    </Card>
  );
}

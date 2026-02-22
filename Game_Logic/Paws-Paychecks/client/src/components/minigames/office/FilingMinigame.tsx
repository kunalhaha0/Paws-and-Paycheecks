import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FolderOpen, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type File = { id: number; name: string; category: "finance" | "hr" | "legal" | "marketing"; };

const FILES: File[] = [
  { id: 1, name: "Invoice_2024.pdf", category: "finance" },
  { id: 2, name: "Employee_Review.doc", category: "hr" },
  { id: 3, name: "Contract_Draft.pdf", category: "legal" },
  { id: 4, name: "Campaign_Plan.ppt", category: "marketing" },
  { id: 5, name: "Budget_Report.xlsx", category: "finance" },
  { id: 6, name: "Hiring_Form.doc", category: "hr" },
  { id: 7, name: "NDA_Template.pdf", category: "legal" },
  { id: 8, name: "Brand_Guide.pdf", category: "marketing" },
  { id: 9, name: "Expense_Claims.xlsx", category: "finance" },
  { id: 10, name: "Leave_Request.doc", category: "hr" },
];

const FOLDERS = [
  { id: "finance", name: "Finance", color: "bg-green-500" },
  { id: "hr", name: "HR", color: "bg-blue-500" },
  { id: "legal", name: "Legal", color: "bg-purple-500" },
  { id: "marketing", name: "Marketing", color: "bg-orange-500" },
];

export function FilingMinigame({ onComplete }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...FILES].sort(() => Math.random() - 0.5).slice(0, 8);
    setFiles(shuffled);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && files.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / files.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, files.length, onComplete]);

  const handleFile = useCallback((folder: string) => {
    const current = files[currentIndex];
    if (current.category === folder) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= files.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [files, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">File Organization</h2>
          <p className="text-muted-foreground">Sort files into the correct folders!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <FolderOpen className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Filing</Button>
      </Card>
    );
  }

  if (finished) {
    const score = files.length > 0 ? Math.round((correctCount / files.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Filing Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} files sorted correctly</p>
        </div>
      </Card>
    );
  }

  const current = files[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">File {currentIndex + 1} of {files.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <FolderOpen className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-xl font-medium text-foreground">{current?.name}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {FOLDERS.map(folder => (
          <Button key={folder.id} onClick={() => handleFile(folder.id)} className={cn("h-16", folder.color)} data-testid={`button-folder-${folder.id}`}>
            <FolderOpen className="w-5 h-5 mr-2" />{folder.name}
          </Button>
        ))}
      </div>
    </Card>
  );
}

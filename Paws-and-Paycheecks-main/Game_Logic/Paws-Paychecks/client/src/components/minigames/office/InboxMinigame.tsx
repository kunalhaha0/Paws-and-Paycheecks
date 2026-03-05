import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Inbox, Trophy, CheckCircle, AlertCircle, Check } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type Task = { id: number; text: string; priority: "high" | "medium" | "low"; };

const TASKS: Task[] = [
  { id: 1, text: "Reply to client email", priority: "high" },
  { id: 2, text: "Update project timeline", priority: "high" },
  { id: 3, text: "Schedule team meeting", priority: "medium" },
  { id: 4, text: "Review documentation", priority: "medium" },
  { id: 5, text: "Organize files", priority: "low" },
  { id: 6, text: "Clean up downloads", priority: "low" },
  { id: 7, text: "Urgent: Boss needs report", priority: "high" },
  { id: 8, text: "Water office plant", priority: "low" },
  { id: 9, text: "Prepare presentation", priority: "medium" },
];

export function InboxMinigame({ onComplete }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...TASKS].sort(() => Math.random() - 0.5).slice(0, 6);
    setTasks(shuffled);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (started && completed.length === tasks.length && tasks.length > 0) {
      setFinished(true);
    }
  }, [completed.length, tasks.length, started]);

  useEffect(() => {
    if (finished && !completedRef.current && tasks.length > 0) {
      completedRef.current = true;
      const highPriority = tasks.filter(t => t.priority === "high").map(t => t.id);
      const firstThree = completed.slice(0, highPriority.length);
      const correctOrder = highPriority.filter(id => firstThree.includes(id)).length;
      const score = Math.round((correctOrder / highPriority.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, completed, tasks, onComplete]);

  const handleComplete = useCallback((taskId: number) => {
    if (!completed.includes(taskId)) {
      setCompleted(prev => [...prev, taskId]);
    }
  }, [completed]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Inbox Zero</h2>
          <p className="text-muted-foreground">Complete HIGH priority tasks first!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Inbox className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Clearing</Button>
      </Card>
    );
  }

  if (finished) {
    const highPriority = tasks.filter(t => t.priority === "high").map(t => t.id);
    const firstThree = completed.slice(0, highPriority.length);
    const correctOrder = highPriority.filter(id => firstThree.includes(id)).length;
    const score = Math.round((correctOrder / Math.max(highPriority.length, 1)) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Inbox Cleared!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">Prioritization score</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{tasks.length - completed.length} tasks left</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 5 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <p className="text-center text-sm text-muted-foreground">Complete HIGH priority tasks first!</p>
      <div className="space-y-2">
        {tasks.map(task => (
          <button key={task.id} onClick={() => handleComplete(task.id)} disabled={completed.includes(task.id)} className={cn("w-full p-3 rounded-lg border flex justify-between items-center transition-all", completed.includes(task.id) ? "bg-muted/50 opacity-50" : "hover-elevate", task.priority === "high" && "border-red-300", task.priority === "medium" && "border-yellow-300", task.priority === "low" && "border-green-300")} data-testid={`task-${task.id}`}>
            <span className={cn("font-medium", completed.includes(task.id) && "line-through")}>{task.text}</span>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs px-2 py-1 rounded", task.priority === "high" && "bg-red-100 text-red-700", task.priority === "medium" && "bg-yellow-100 text-yellow-700", task.priority === "low" && "bg-green-100 text-green-700")}>{task.priority}</span>
              {completed.includes(task.id) && <Check className="w-5 h-5 text-green-500" />}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

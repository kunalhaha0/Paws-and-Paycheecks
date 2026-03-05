import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type Meeting = { id: number; name: string; time: string; slot: number; };

const MEETINGS: Meeting[] = [
  { id: 1, name: "Team Standup", time: "9:00 AM", slot: 1 },
  { id: 2, name: "Client Call", time: "10:30 AM", slot: 2 },
  { id: 3, name: "Lunch Break", time: "12:00 PM", slot: 3 },
  { id: 4, name: "Project Review", time: "2:00 PM", slot: 4 },
  { id: 5, name: "Training Session", time: "4:00 PM", slot: 5 },
];

export function ScheduleMinigame({ onComplete }: Props) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [placed, setPlaced] = useState<(Meeting | null)[]>([null, null, null, null, null]);
  const [selected, setSelected] = useState<Meeting | null>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...MEETINGS].sort(() => Math.random() - 0.5);
    setMeetings(shuffled);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (started && meetings.length === 0 && placed.filter(p => p !== null).length === 5) {
      setFinished(true);
    }
  }, [meetings.length, started, placed]);

  useEffect(() => {
    if (finished && !completedRef.current) {
      completedRef.current = true;
      let correct = 0;
      placed.forEach((m, i) => { if (m && m.slot === i + 1) correct++; });
      const score = Math.round((correct / 5) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, placed, onComplete]);

  const handleMeetingClick = useCallback((meeting: Meeting) => {
    setSelected(meeting);
  }, []);

  const handleSlotClick = useCallback((slotIndex: number) => {
    if (!selected || placed[slotIndex]) return;
    const newPlaced = [...placed];
    newPlaced[slotIndex] = selected;
    setPlaced(newPlaced);
    setMeetings(prev => prev.filter(m => m.id !== selected.id));
    setSelected(null);
  }, [selected, placed]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Schedule Management</h2>
          <p className="text-muted-foreground">Place meetings in the correct time slots!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Calendar className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Scheduling</Button>
      </Card>
    );
  }

  if (finished) {
    let correct = 0;
    placed.forEach((m, i) => { if (m && m.slot === i + 1) correct++; });
    const score = Math.round((correct / 5) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Schedule Set!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correct} meetings scheduled correctly</p>
        </div>
      </Card>
    );
  }

  const TIMES = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

  return (
    <Card className="p-6 space-y-4" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{meetings.length} meetings left</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-muted/50 rounded-lg">
        {meetings.map(m => (
          <button key={m.id} onClick={() => handleMeetingClick(m)} className={cn("px-3 py-2 rounded-lg bg-card border text-sm", selected?.id === m.id && "ring-2 ring-primary")} data-testid={`meeting-${m.id}`}>
            {m.name}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {TIMES.map((time, i) => (
          <button key={i} onClick={() => handleSlotClick(i)} className={cn("w-full p-3 rounded-lg border-2 border-dashed flex justify-between items-center", placed[i] ? "bg-primary/10 border-primary" : "hover:border-primary")} disabled={!!placed[i]} data-testid={`slot-${i}`}>
            <span className="font-medium">{time}</span>
            <span className="text-muted-foreground">{placed[i]?.name || "Empty"}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

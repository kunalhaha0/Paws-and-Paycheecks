import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Key, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function PasswordMinigame({ onComplete }: Props) {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const [showPassword, setShowPassword] = useState(true);
  const completedRef = useRef(false);

  useEffect(() => {
    setPasswords(Array.from({ length: 6 }, generatePassword));
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    if (showPassword) {
      const timer = setTimeout(() => setShowPassword(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [started, finished, showPassword, currentIndex]);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && passwords.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / passwords.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, passwords.length, onComplete]);

  const handleSubmit = useCallback(() => {
    if (input.toUpperCase() === passwords[currentIndex]) setCorrectCount(prev => prev + 1);
    setInput("");
    if (currentIndex + 1 >= passwords.length) setFinished(true);
    else {
      setCurrentIndex(prev => prev + 1);
      setShowPassword(true);
    }
  }, [input, passwords, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Password Match</h2>
          <p className="text-muted-foreground">Memorize and type the password before it disappears!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Key className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Matching</Button>
      </Card>
    );
  }

  if (finished) {
    const score = passwords.length > 0 ? Math.round((correctCount / passwords.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Passwords Set!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} passwords matched</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Password {currentIndex + 1} of {passwords.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center py-8">
        {showPassword ? (
          <>
            <p className="text-muted-foreground mb-2">Memorize this password:</p>
            <div className="text-4xl font-mono font-bold tracking-[0.3em] text-primary">{passwords[currentIndex]}</div>
          </>
        ) : (
          <>
            <p className="text-muted-foreground mb-4">Type the password:</p>
            <input type="text" value={input} onChange={e => setInput(e.target.value.toUpperCase())} maxLength={6} autoFocus className="w-full max-w-xs mx-auto px-4 py-3 text-2xl text-center font-mono tracking-[0.2em] border-2 rounded-lg focus:outline-none focus:border-primary bg-background" onKeyDown={e => e.key === "Enter" && handleSubmit()} data-testid="input-password" />
          </>
        )}
      </div>
      {!showPassword && <Button onClick={handleSubmit} className="w-full" size="lg" data-testid="button-submit">Submit</Button>}
    </Card>
  );
}

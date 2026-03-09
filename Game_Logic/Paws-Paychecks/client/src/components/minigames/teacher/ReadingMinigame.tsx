import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpenCheck, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type ReadingItem = { paragraph: string; summary: string; wrongSummaries: string[]; };

const READINGS: ReadingItem[] = [
  { paragraph: "The sun provides energy for plants through photosynthesis. Plants convert sunlight into food, which helps them grow.", summary: "Plants use sunlight to make food and grow.", wrongSummaries: ["Plants don't need sunlight.", "The sun is harmful to plants."] },
  { paragraph: "Water exists in three states: solid, liquid, and gas. Ice is solid water, while steam is water in its gas form.", summary: "Water can be solid, liquid, or gas.", wrongSummaries: ["Water is always liquid.", "Ice is not made of water."] },
  { paragraph: "The moon orbits Earth once every 28 days. This orbit causes the phases of the moon we see in the sky.", summary: "The moon's orbit causes its phases.", wrongSummaries: ["The moon never moves.", "Earth orbits the moon."] },
  { paragraph: "Recycling helps protect the environment by reducing waste. When we recycle, materials can be used again instead of going to landfills.", summary: "Recycling reduces waste and helps the environment.", wrongSummaries: ["Recycling creates more waste.", "Landfills are the best option."] },
  { paragraph: "Bees are important pollinators. They carry pollen from flower to flower, helping plants reproduce and grow fruits.", summary: "Bees help plants reproduce through pollination.", wrongSummaries: ["Bees harm flowers.", "Flowers don't need bees."] },
  { paragraph: "Exercise keeps the heart healthy and strong. Regular physical activity helps blood flow better throughout the body.", summary: "Exercise improves heart health and blood flow.", wrongSummaries: ["Exercise weakens the heart.", "Blood flow doesn't matter."] },
];

type Question = { paragraph: string; options: string[]; correct: number; };

const generateQuestions = (): Question[] => {
  const shuffled = [...READINGS].sort(() => Math.random() - 0.5).slice(0, 6);
  return shuffled.map(item => {
    const options = [item.summary, ...item.wrongSummaries].sort(() => Math.random() - 0.5);
    return { paragraph: item.paragraph, options, correct: options.indexOf(item.summary) };
  });
};

export function ReadingMinigame({ onComplete }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    setQuestions(generateQuestions());
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
          <h2 className="text-2xl font-bold text-foreground">Reading Comprehension</h2>
          <p className="text-muted-foreground">Match each paragraph to its best summary!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpenCheck className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Reading</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Reading Complete!</h2>
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
        <div className="text-sm text-muted-foreground">Passage {currentIndex + 1} of {questions.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg text-left">
          <p className="text-foreground leading-relaxed" data-testid="text-paragraph">{current?.paragraph}</p>
        </div>
        <p className="text-muted-foreground">Which summary best describes this paragraph?</p>
        <div className="flex flex-col gap-3">
          {current?.options.map((option, i) => (
            <Button key={i} onClick={() => handleAnswer(i)} variant="outline" className="text-left h-auto py-3 px-4 whitespace-normal" data-testid={`button-option-${i}`}>
              {option}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}

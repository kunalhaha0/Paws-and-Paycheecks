import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Brush, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

type StyleQuestion = {
  description: string;
  characteristics: string[];
  correctStyle: string;
  options: string[];
};

const STYLE_QUESTIONS: StyleQuestion[] = [
  {
    description: "Dreamlike scenes with melting clocks and surreal imagery",
    characteristics: ["Bizarre juxtapositions", "Dreamscapes", "Unexpected objects"],
    correctStyle: "Surrealism",
    options: ["Surrealism", "Impressionism", "Cubism", "Pop Art"],
  },
  {
    description: "Light, visible brushstrokes capturing moments and atmosphere",
    characteristics: ["Outdoor scenes", "Light effects", "Soft edges"],
    correctStyle: "Impressionism",
    options: ["Baroque", "Impressionism", "Minimalism", "Expressionism"],
  },
  {
    description: "Multiple perspectives and geometric shapes in one image",
    characteristics: ["Fragmented forms", "Abstract shapes", "Multiple viewpoints"],
    correctStyle: "Cubism",
    options: ["Realism", "Surrealism", "Cubism", "Art Nouveau"],
  },
  {
    description: "Bold colors, commercial imagery, and celebrity culture",
    characteristics: ["Consumer products", "Bright colors", "Mass media"],
    correctStyle: "Pop Art",
    options: ["Pop Art", "Dadaism", "Romanticism", "Gothic"],
  },
  {
    description: "Emotional intensity through distorted forms and vivid colors",
    characteristics: ["Raw emotion", "Distortion", "Bold brushwork"],
    correctStyle: "Expressionism",
    options: ["Classicism", "Expressionism", "Minimalism", "Rococo"],
  },
  {
    description: "Precise detail and accurate representation of subjects",
    characteristics: ["Lifelike accuracy", "Fine detail", "Traditional techniques"],
    correctStyle: "Realism",
    options: ["Abstract", "Realism", "Fauvism", "Constructivism"],
  },
];

export function StyleMinigame({ onComplete }: Props) {
  const [questions, setQuestions] = useState<StyleQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...STYLE_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
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
      const finalScore = Math.round((score / questions.length) * 100);
      setTimeout(() => onComplete(finalScore), 1500);
    }
  }, [finished, score, questions.length, onComplete]);

  const handleStyleSelect = useCallback((style: string) => {
    if (feedback) return;
    const current = questions[currentQuestion];
    const isCorrect = style === current.correctStyle;

    setFeedback(style);
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestion + 1 >= questions.length) {
        setFinished(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 700);
  }, [questions, currentQuestion, feedback]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Art Style Quiz</h2>
          <p className="text-muted-foreground">Identify the art movement from the description!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Brush className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Quiz
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Art Expert!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {finalScore >= 70 ? (
            <Trophy className="w-10 h-10 text-yellow-500" />
          ) : finalScore >= 40 ? (
            <CheckCircle className="w-10 h-10 text-green-500" />
          ) : (
            <AlertCircle className="w-10 h-10 text-amber-500" />
          )}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">
            {finalScore}%
          </div>
          <p className="text-muted-foreground">
            {score} / {questions.length} styles identified
          </p>
        </div>
      </Card>
    );
  }

  const current = questions[currentQuestion];

  return (
    <Card className="p-6 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
          {timeLeft}s
        </div>
      </div>

      <div className="p-4 bg-muted/30 rounded-xl space-y-3">
        <p className="text-lg font-medium text-center">{current?.description}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {current?.characteristics.map((char, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-primary/10 rounded-full text-xs font-medium"
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Which art style is this?
      </p>

      <div className="grid grid-cols-2 gap-3">
        {current?.options.map((style, i) => (
          <button
            key={style}
            onClick={() => handleStyleSelect(style)}
            disabled={!!feedback}
            className={cn(
              "p-4 rounded-xl border-2 font-medium transition-all",
              feedback && style === current.correctStyle && "border-green-500 bg-green-500/10",
              feedback === style && style !== current.correctStyle && "border-red-500 bg-red-500/10",
              !feedback && "hover:border-primary hover:bg-primary/5"
            )}
            data-testid={`style-option-${i}`}
          >
            {style}
          </button>
        ))}
      </div>
    </Card>
  );
}

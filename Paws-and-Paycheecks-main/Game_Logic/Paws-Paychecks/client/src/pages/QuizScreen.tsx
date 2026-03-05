import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { APTITUDE_QUIZ, JobType, JOBS } from "@shared/schema";
import { calculateJobFromQuiz } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";
import { ArrowRight, Briefcase, Building2, ChefHat, Wrench, GraduationCap, Palette } from "lucide-react";

interface QuizScreenProps {
  onComplete: (job: JobType) => void;
}

const JOB_ICONS = {
  office: Building2,
  chef: ChefHat,
  engineer: Wrench,
  teacher: GraduationCap,
  artist: Palette
};

export function QuizScreen({ onComplete }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultJob, setResultJob] = useState<JobType | null>(null);

  const question = APTITUDE_QUIZ[currentQuestion];
  const progress = ((currentQuestion + 1) / APTITUDE_QUIZ.length) * 100;

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion + 1 >= APTITUDE_QUIZ.length) {
      const job = calculateJobFromQuiz(newAnswers);
      setResultJob(job);
      setShowResult(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  if (showResult && resultJob) {
    const job = JOBS[resultJob];
    const JobIcon = JOB_ICONS[resultJob];
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-green-500/10 animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-primary/10" />
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-amber-400/15" />
        </div>
        <Card className="max-w-md w-full p-8 text-center space-y-6 pop-in relative z-10" data-testid="card-job-result">
          <div className="space-y-2">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <JobIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground" data-testid="text-job-title">
              You're a {job.title}!
            </h2>
            <p className="text-muted-foreground text-lg" data-testid="text-job-description">
              {job.description}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Weekly Salary:</span>
              <span className="font-bold text-xl text-green-600 dark:text-green-400" data-testid="text-job-salary">
                ${job.baseSalary}
              </span>
            </div>
          </div>

          <Button
            onClick={() => onComplete(resultJob)}
            size="lg"
            className="w-full text-lg"
            data-testid="button-start-job"
          >
            <Briefcase className="w-5 h-5 mr-2" />
            Start Your New Job
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-accent/5 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-accent/10" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-primary/5" />
        <div className="absolute top-1/2 right-10 w-8 h-8 rounded-full bg-amber-400/20 animate-pulse" />
        <div className="absolute bottom-1/4 left-16 w-6 h-6 rounded-full bg-green-400/15" />
        <svg className="absolute top-0 left-0 right-0 h-24 text-accent/5 rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,0 600,120 900,60 C1050,30 1150,90 1200,60 L1200,0 L0,0 Z" fill="currentColor" />
        </svg>
      </div>
      
      <div className="max-w-lg w-full space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-quiz-title">Job Aptitude Quiz</h1>
          <p className="text-muted-foreground">Find the perfect job for you!</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span data-testid="text-question-number">Question {currentQuestion + 1} of {APTITUDE_QUIZ.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-6 space-y-6 slide-up" key={currentQuestion} data-testid="card-quiz-question">
          <h2 className="text-xl font-semibold text-foreground text-center" data-testid="text-question">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all",
                  "hover-elevate",
                  selectedAnswer === index
                    ? "border-primary bg-primary/10 ring-2 ring-primary"
                    : "border-border bg-card hover:border-primary/50"
                )}
                data-testid={`button-answer-${index}`}
              >
                <span className="font-medium text-foreground">{option.text}</span>
              </button>
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            size="lg"
            className="w-full"
            data-testid="button-next-question"
          >
            {currentQuestion + 1 >= APTITUDE_QUIZ.length ? "See My Job" : "Next Question"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>

        <div className="flex justify-center gap-2">
          {APTITUDE_QUIZ.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                i < currentQuestion ? "bg-primary" : 
                i === currentQuestion ? "bg-primary animate-pulse" : 
                "bg-muted"
              )}
              data-testid={`quiz-progress-dot-${i}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

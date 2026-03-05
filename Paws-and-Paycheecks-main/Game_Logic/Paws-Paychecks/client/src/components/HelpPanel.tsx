import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: "gameplay",
    question: "How do I play the game?",
    answer: "Complete minigames each week to earn money based on your job. Your earnings vary depending on your minigame performance. Manage your wallet carefully to keep your pet healthy and happy!"
  },
  {
    id: "jobs",
    question: "What do the different jobs do?",
    answer: "Each job has a different base salary. Answer the career quiz at the start of the game to find the job that matches your answers. Different jobs offer different weekly income rates."
  },
  {
    id: "minigames",
    question: "How do minigames work?",
    answer: "Each job has unique minigames. Your score on the minigame determines your weekly income. A higher score means more money earned! Practice to improve your skills."
  },
  {
    id: "pets",
    question: "How do I care for my pet?",
    answer: "Your pet has Health and Happiness stats shown on the dashboard. Use the shop to buy items that boost these stats. Weekly events can also affect your pet's condition. Keep both stats high for a happy pet!"
  },
  {
    id: "money",
    question: "Why is my money decreasing?",
    answer: "You pay weekly living expenses for rent and utilities. Random events may also cost money. Visit the shop to buy items for your pet, which also costs money. Manage your spending wisely!"
  },
  {
    id: "events",
    question: "What are random events?",
    answer: "Each week, a random event occurs that can affect your wallet, pet's health, or happiness. Events can be positive (bonuses) or negative (expenses). Some events happen more often in hard mode."
  },
  {
    id: "hardmode",
    question: "What is hard mode?",
    answer: "Hard mode increases living expenses, making it harder to manage your money. It's a challenge for experienced players! You choose the difficulty when you start a new game."
  },
  {
    id: "shop",
    question: "What should I buy from the shop?",
    answer: "Buy items based on what your pet needs. If health is low, buy healthy items. If happiness is low, buy fun items. Balance your purchases with your available money."
  },
  {
    id: "score",
    question: "How is my final score calculated?",
    answer: "Your final score depends on multiple factors: your pet's final health and happiness stats, your final wallet balance, and your job performance throughout the game. Try to keep all stats high!"
  },
  {
    id: "trophies",
    question: "How do I earn trophies?",
    answer: "Achieve high final scores to earn trophies. Different trophy levels are awarded based on your score. Play multiple times to collect all the trophies!"
  }
];

interface HelpPanelProps {
  isGameActive?: boolean;
}

export function HelpPanel({ isGameActive = true }: HelpPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Help Icon Button - Fixed on right side */}
      <div className="fixed right-4 bottom-4 z-40">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="lg"
          className={cn(
            "rounded-full w-14 h-14 p-0 transition-all duration-300",
            isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          title="Help (Click for FAQ)"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Help Panel - Expandable overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />

          {/* Panel Card */}
          <Card className={cn(
            "relative w-full sm:w-full sm:max-w-2xl h-[90vh] sm:h-[80vh] rounded-t-2xl sm:rounded-2xl flex flex-col transition-all duration-300",
            "bg-white dark:bg-slate-950 border-t sm:border shadow-xl sm:shadow-2xl"
          )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              </div>
              <Button
                onClick={() => setIsExpanded(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-b-0">
                    <AccordionTrigger className="hover:no-underline py-4 text-left text-base font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Footer */}
            <div className="border-t p-4 sm:p-6 bg-slate-50 dark:bg-slate-900">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                💡 Tip: Click any question above to expand its answer!
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

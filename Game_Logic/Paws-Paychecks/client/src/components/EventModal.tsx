import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GameEvent } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Stethoscope, Package, DollarSign, Receipt, Thermometer, Gift, Sun } from "lucide-react";

interface EventModalProps {
  event: GameEvent | null;
  open: boolean;
  onContinue: () => void;
}

export function EventModal({ event, open, onContinue }: EventModalProps) {
  if (!event) return null;

  const getEventIcon = () => {
    switch (event.type) {
      case "vet_emergency": return Stethoscope;
      case "broken_toy": return Package;
      case "work_bonus": return DollarSign;
      case "tax_refund": return Receipt;
      case "minor_illness": return Thermometer;
      case "friend_gift": return Gift;
      case "normal_week": return Sun;
    }
  };

  const IconComponent = getEventIcon();
  const balanceChange = event.balanceEffect[0];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className={cn(
        "sm:max-w-md pop-in",
        event.isPositive ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"
      )} data-testid="modal-event">
        <DialogHeader className="text-center space-y-4">
          <div className={cn(
            "mx-auto p-4 rounded-full",
            event.isPositive ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
          )}>
            <IconComponent className={cn(
              "w-12 h-12",
              event.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )} />
          </div>
          <DialogTitle className="text-2xl" data-testid="text-event-name">{event.name}</DialogTitle>
          <DialogDescription className="text-base" data-testid="text-event-description">
            {event.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          {balanceChange !== 0 && (
            <div className={cn(
              "flex justify-between items-center p-3 rounded-lg",
              balanceChange > 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
            )} data-testid="event-balance-effect">
              <span className="font-medium">Wallet</span>
              <span className={cn(
                "font-bold text-lg",
                balanceChange > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {balanceChange > 0 ? "+" : ""}{balanceChange}
              </span>
            </div>
          )}
          
          {event.healthEffect !== 0 && (
            <div className={cn(
              "flex justify-between items-center p-3 rounded-lg",
              event.healthEffect > 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
            )} data-testid="event-health-effect">
              <span className="font-medium">Pet Health</span>
              <span className={cn(
                "font-bold text-lg",
                event.healthEffect > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {event.healthEffect > 0 ? "+" : ""}{event.healthEffect}
              </span>
            </div>
          )}
          
          {event.happinessEffect !== 0 && (
            <div className={cn(
              "flex justify-between items-center p-3 rounded-lg",
              event.happinessEffect > 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
            )} data-testid="event-happiness-effect">
              <span className="font-medium">Pet Happiness</span>
              <span className={cn(
                "font-bold text-lg",
                event.happinessEffect > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {event.happinessEffect > 0 ? "+" : ""}{event.happinessEffect}
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onContinue} className="w-full" size="lg" data-testid="button-event-continue">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

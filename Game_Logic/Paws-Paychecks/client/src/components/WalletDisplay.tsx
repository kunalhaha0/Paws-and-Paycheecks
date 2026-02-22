import { cn } from "@/lib/utils";
import { getWalletColor } from "@/lib/gameLogic";
import { Wallet } from "lucide-react";

interface WalletDisplayProps {
  balance: number;
  showChange?: number;
  size?: "sm" | "md" | "lg";
}

export function WalletDisplay({ balance, showChange, size = "md" }: WalletDisplayProps) {
  const color = getWalletColor(balance);
  
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  return (
    <div className="flex items-center gap-3">
      <div 
        className={cn(
          "flex items-center justify-center rounded-full",
          size === "sm" ? "w-8 h-8" : size === "md" ? "w-12 h-12" : "w-16 h-16",
          balance < 0 ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"
        )}
      >
        <Wallet 
          className={cn(
            size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"
          )}
          style={{ color }}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Balance</span>
        <div className="flex items-center gap-2">
          <span 
            className={cn("font-bold", sizeClasses[size])}
            style={{ color }}
            data-testid="text-wallet-balance"
          >
            ${balance}
          </span>
          {showChange !== undefined && showChange !== 0 && (
            <span className={cn(
              "text-sm font-medium px-2 py-0.5 rounded pop-in",
              showChange > 0 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {showChange > 0 ? "+" : ""}{showChange}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

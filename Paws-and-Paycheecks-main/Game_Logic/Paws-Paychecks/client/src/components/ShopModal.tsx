import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SHOP_ITEMS, ShopItem } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Heart, Smile, ShoppingCart, Utensils, Stethoscope, Gamepad2, Home } from "lucide-react";

interface ShopModalProps {
  open: boolean;
  wallet: number;
  onPurchase: (item: ShopItem) => void;
  onClose: () => void;
}

const CATEGORY_INFO = {
  food: { icon: Utensils, label: "Food" },
  healthcare: { icon: Stethoscope, label: "Healthcare" },
  toys: { icon: Gamepad2, label: "Toys" },
  housing: { icon: Home, label: "Housing" }
};

export function ShopModal({ open, wallet, onPurchase, onClose }: ShopModalProps) {
  const categories = ["food", "healthcare", "toys", "housing"] as const;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh]" data-testid="modal-shop">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <ShoppingCart className="w-6 h-6" />
            Pet Shop
          </DialogTitle>
          <DialogDescription>
            Buy supplies to keep your pet healthy and happy!
          </DialogDescription>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Your wallet:</span>
            <Badge variant={wallet < 20 ? "destructive" : "secondary"} className="text-lg px-3 py-1" data-testid="text-shop-wallet">
              ${wallet}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {categories.map(category => {
              const CategoryIcon = CATEGORY_INFO[category].icon;
              return (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2 text-lg text-foreground">
                    <CategoryIcon className="w-5 h-5" />
                    {CATEGORY_INFO[category].label}
                  </h3>
                  <div className="grid gap-3">
                    {SHOP_ITEMS.filter(item => item.category === category).map(item => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border bg-card",
                          wallet < item.cost && "opacity-50"
                        )}
                        data-testid={`shop-item-${item.id}`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="font-medium text-foreground">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                          <div className="flex gap-3 pt-1">
                            {item.healthBonus !== 0 && (
                              <span className={cn(
                                "text-xs flex items-center gap-1",
                                item.healthBonus > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"
                              )}>
                                <Heart className="w-3 h-3" />
                                {item.healthBonus > 0 ? "+" : ""}{item.healthBonus}
                              </span>
                            )}
                            {item.happinessBonus !== 0 && (
                              <span className={cn(
                                "text-xs flex items-center gap-1",
                                item.happinessBonus > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"
                              )}>
                                <Smile className="w-3 h-3" />
                                {item.happinessBonus > 0 ? "+" : ""}{item.happinessBonus}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => onPurchase(item)}
                          disabled={wallet < item.cost}
                          size="sm"
                          data-testid={`button-buy-${item.id}`}
                        >
                          ${item.cost}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full" data-testid="button-close-shop">
            Done Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

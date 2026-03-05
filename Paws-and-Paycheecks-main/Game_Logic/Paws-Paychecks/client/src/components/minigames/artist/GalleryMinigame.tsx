import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Image, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

type Artwork = {
  id: string;
  title: string;
  style: "abstract" | "portrait" | "landscape" | "still-life";
  description: string;
};

const ARTWORKS: Artwork[] = [
  { id: "1", title: "Swirling Colors", style: "abstract", description: "Bold shapes and vibrant colors" },
  { id: "2", title: "Mountain Vista", style: "landscape", description: "Majestic peaks at sunset" },
  { id: "3", title: "Lady in Blue", style: "portrait", description: "Elegant woman in formal attire" },
  { id: "4", title: "Fruit Bowl", style: "still-life", description: "Apples and oranges on table" },
  { id: "5", title: "Geometric Dreams", style: "abstract", description: "Triangles and circles dancing" },
  { id: "6", title: "Ocean Cliffs", style: "landscape", description: "Waves crashing on rocky shore" },
  { id: "7", title: "The Scholar", style: "portrait", description: "Wise man with glasses" },
  { id: "8", title: "Vase with Flowers", style: "still-life", description: "Roses in ceramic vase" },
];

const STYLES = [
  { id: "abstract", name: "Abstract", color: "bg-purple-500" },
  { id: "portrait", name: "Portrait", color: "bg-blue-500" },
  { id: "landscape", name: "Landscape", color: "bg-green-500" },
  { id: "still-life", name: "Still Life", color: "bg-amber-500" },
];

export function GalleryMinigame({ onComplete }: Props) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [sorted, setSorted] = useState<Record<string, Artwork[]>>({
    abstract: [],
    portrait: [],
    landscape: [],
    "still-life": [],
  });
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [totalArtworks, setTotalArtworks] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...ARTWORKS].sort(() => Math.random() - 0.5).slice(0, 6);
    setArtworks(shuffled);
    setTotalArtworks(shuffled.length);
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
    if (started && artworks.length === 0 && totalArtworks > 0) {
      setFinished(true);
    }
  }, [artworks.length, started, totalArtworks]);

  useEffect(() => {
    if (finished && !completedRef.current && totalArtworks > 0) {
      completedRef.current = true;
      let correct = 0;
      Object.entries(sorted).forEach(([style, items]) => {
        items.forEach(item => {
          if (item.style === style) correct++;
        });
      });
      setScore(correct);
      const finalScore = Math.round((correct / totalArtworks) * 100);
      setTimeout(() => onComplete(finalScore), 1500);
    }
  }, [finished, sorted, totalArtworks, onComplete]);

  const handleArtworkClick = useCallback((artwork: Artwork) => {
    setSelected(artwork);
  }, []);

  const handleStyleClick = useCallback((style: string) => {
    if (!selected) return;
    setSorted(prev => ({
      ...prev,
      [style]: [...prev[style], selected],
    }));
    setArtworks(prev => prev.filter(a => a.id !== selected.id));
    setSelected(null);
  }, [selected]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Gallery Curator</h2>
          <p className="text-muted-foreground">Sort artworks into correct style categories!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Image className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Curating
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = totalArtworks > 0 ? Math.round((score / totalArtworks) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Gallery Sorted!</h2>
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
            {score} artworks correctly sorted
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{artworks.length} artworks left</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
          {timeLeft}s
        </div>
      </div>

      <div className="space-y-3 min-h-[100px]">
        {artworks.map(artwork => (
          <button
            key={artwork.id}
            onClick={() => handleArtworkClick(artwork)}
            className={cn(
              "w-full p-3 rounded-lg bg-card border text-left transition-all",
              selected?.id === artwork.id && "ring-2 ring-primary"
            )}
            data-testid={`artwork-${artwork.id}`}
          >
            <div className="font-medium">{artwork.title}</div>
            <div className="text-sm text-muted-foreground">{artwork.description}</div>
          </button>
        ))}
      </div>

      {selected && (
        <p className="text-center text-sm text-muted-foreground">
          Sort "<span className="font-medium">{selected.title}</span>" into a category:
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {STYLES.map(style => (
          <button
            key={style.id}
            onClick={() => handleStyleClick(style.id)}
            disabled={!selected}
            className={cn(
              "p-4 rounded-lg border-2 border-dashed flex flex-col items-center gap-1",
              selected ? "hover:border-primary hover:bg-primary/5" : "opacity-70"
            )}
            data-testid={`style-${style.id}`}
          >
            <div className={cn("w-4 h-4 rounded-full", style.color)} />
            <span className="font-medium">{style.name}</span>
            <span className="text-xs text-muted-foreground">
              {sorted[style.id].length} items
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

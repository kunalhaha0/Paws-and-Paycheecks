import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Zap, Lightbulb, Settings, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface PuzzleMinigameProps {
  onComplete: (score: number) => void;
}

type Node = {
  id: number;
  x: number;
  y: number;
  type: "source" | "target" | "junction";
};

type Connection = {
  from: number;
  to: number;
};

export function PuzzleMinigame({ onComplete }: PuzzleMinigameProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [correctPuzzles, setCorrectPuzzles] = useState(0);
  const completedRef = useRef(false);

  const generatePuzzle = useCallback(() => {
    const newNodes: Node[] = [
      { id: 0, x: 50, y: 20, type: "source" },
      { id: 1, x: 25, y: 50, type: "junction" },
      { id: 2, x: 75, y: 50, type: "junction" },
      { id: 3, x: 50, y: 80, type: "target" },
    ];
    setNodes(newNodes);
    setConnections([]);
    setSelectedNode(null);
  }, []);

  useEffect(() => {
    generatePuzzle();
  }, [generatePuzzle]);

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
    if (connections.length >= 2 && started && !finished) {
      const hasSourceConnection = connections.some(c => c.from === 0 || c.to === 0);
      const hasTargetConnection = connections.some(c => c.from === 3 || c.to === 3);
      
      if (hasSourceConnection && hasTargetConnection) {
        setCorrectPuzzles(prev => prev + 1);
        if (puzzleIndex < 2) {
          setTimeout(() => {
            setPuzzleIndex(prev => prev + 1);
            generatePuzzle();
          }, 500);
        } else {
          setTimeout(() => setFinished(true), 500);
        }
      }
    }
  }, [connections, puzzleIndex, generatePuzzle, started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current) {
      completedRef.current = true;
      const score = Math.round((correctPuzzles / 3) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctPuzzles, onComplete]);

  const handleNodeClick = useCallback((nodeId: number) => {
    if (selectedNode === null) {
      setSelectedNode(nodeId);
    } else if (selectedNode === nodeId) {
      setSelectedNode(null);
    } else {
      const exists = connections.some(c => 
        (c.from === selectedNode && c.to === nodeId) ||
        (c.from === nodeId && c.to === selectedNode)
      );
      
      if (!exists) {
        setConnections(prev => [...prev, { from: selectedNode, to: nodeId }]);
      }
      setSelectedNode(null);
    }
  }, [selectedNode, connections]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Circuit Connection</h2>
          <p className="text-muted-foreground">Connect the power source to the light bulb!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Zap className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Building
        </Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctPuzzles / 3) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Circuits Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : 
           score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : 
           <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">
            {correctPuzzles} / 3 circuits connected
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground" data-testid="text-puzzle-progress">
          Circuit {puzzleIndex + 1} of 3
        </div>
        <div className={cn(
          "text-2xl font-bold",
          timeLeft <= 15 ? "text-destructive shake" : "text-foreground"
        )} data-testid="text-time-left">
          {timeLeft}s
        </div>
      </div>

      <div className="relative w-full h-64 bg-muted/50 rounded-lg" data-testid="puzzle-board">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, i) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            return (
              <line
                key={i}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <button
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all",
              node.type === "source" && "bg-yellow-400 border-2 border-yellow-600",
              node.type === "target" && "bg-blue-400 border-2 border-blue-600",
              node.type === "junction" && "bg-gray-400 border-2 border-gray-600",
              selectedNode === node.id && "ring-4 ring-primary scale-110"
            )}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            data-testid={`button-node-${node.id}`}
          >
            {node.type === "source" && <Zap className="w-6 h-6 text-yellow-800" />}
            {node.type === "target" && <Lightbulb className="w-6 h-6 text-blue-800" />}
            {node.type === "junction" && <Settings className="w-6 h-6 text-gray-700" />}
          </button>
        ))}
      </div>

      <p className="text-sm text-center text-muted-foreground">
        Click nodes to connect them. Power the light bulb!
      </p>

      <Button 
        variant="outline" 
        onClick={generatePuzzle}
        className="w-full"
        data-testid="button-reset-puzzle"
      >
        Reset Circuit
      </Button>
    </Card>
  );
}

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GameCanvas from "@/game/GameCanvas";
import {
  createInitialState,
  rollDice,
  getMovablePieces,
  movePiece,
  getNextTeam,
  TEAM_LABELS,
  TEAM_EMOJIS,
  TEAM_HEX,
  TEAMS,
  type GameState,
  type TeamColor,
} from "@/game/gameLogic";
import {
  playDiceRollTick,
  playDiceResult,
  playPieceMove,
  playPieceOut,
  playVictory,
  playNoMove,
  playTurnChange,
} from "@/game/sounds";

const ENVIRONMENTS = [
  { id: "park", label: "🌳 Park", desc: "Ludo on grass" },
  { id: "living_room", label: "🛋️ Living Room", desc: "Carpet style board" },
  { id: "mall", label: "🏬 Shopping Mall", desc: "Center floor" },
  { id: "event_hall", label: "🏛️ Event Hall", desc: "Grand stage" },
  { id: "wedding", label: "💒 Wedding Lawn", desc: "Decorative board" },
  { id: "festival", label: "🎪 Festival Ground", desc: "Open air fun" },
];

const PlayPage = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [environment, setEnvironment] = useState("park");
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [showEndScreen, setShowEndScreen] = useState(false);

  const handleRollDice = useCallback(() => {
    if (gameState.rolling || gameState.gameOver) return;

    setGameState(prev => ({ ...prev, rolling: true }));

    // Animate rolling
    let count = 0;
    const interval = setInterval(() => {
      setGameState(prev => ({ ...prev, diceValue: rollDice() }));
      count++;
      if (count > 12) {
        clearInterval(interval);
        const finalValue = rollDice();
        setGameState(prev => {
          const newState = { ...prev, diceValue: finalValue, rolling: false };
          const movable = getMovablePieces(newState, finalValue);

          // If no movable pieces, skip to next team
          if (movable.length === 0) {
            return { ...newState, currentTeam: getNextTeam(prev.currentTeam) };
          }

          // For AI teams, auto-move after delay
          if (prev.currentTeam !== "red") {
            setTimeout(() => {
              setGameState(s => {
                const m = getMovablePieces(s, finalValue);
                if (m.length > 0) {
                  const randomPiece = m[Math.floor(Math.random() * m.length)];
                  return movePiece(s, randomPiece, finalValue);
                }
                return { ...s, currentTeam: getNextTeam(s.currentTeam) };
              });
            }, 800);
          }

          return newState;
        });
      }
    }, 70);
  }, [gameState.rolling, gameState.gameOver]);

  const handleMovePiece = useCallback((idx: number) => {
    if (gameState.rolling || !gameState.diceValue) return;
    setGameState(prev => movePiece(prev, idx, prev.diceValue!));
  }, [gameState.rolling, gameState.diceValue]);

  // Auto-roll for AI teams
  useEffect(() => {
    if (gameStarted && gameState.currentTeam !== "red" && !gameState.rolling && !gameState.gameOver) {
      const timeout = setTimeout(() => {
        handleRollDice();
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [gameState.currentTeam, gameStarted, gameState.rolling, gameState.gameOver, handleRollDice]);

  // Check for game over
  useEffect(() => {
    if (gameState.gameOver && !showEndScreen) {
      setTimeout(() => setShowEndScreen(true), 1500);
    }
  }, [gameState.gameOver, showEndScreen]);

  const resetGame = () => {
    setGameState(createInitialState());
    setShowEndScreen(false);
  };

  // Setup screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
              🎲 Play <span className="text-gradient-ludo">Human Ludo</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose your environment and step into the game!
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 mb-6">
            <h3 className="font-display font-bold text-lg mb-4">Choose Your Arena</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ENVIRONMENTS.map(env => (
                <button
                  key={env.id}
                  onClick={() => setEnvironment(env.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    environment === env.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl block mb-1">{env.label.split(" ")[0]}</span>
                  <span className="font-display font-bold text-sm block">{env.label.split(" ").slice(1).join(" ")}</span>
                  <span className="text-muted-foreground text-xs">{env.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 mb-6">
            <h3 className="font-display font-bold text-lg mb-3">Teams</h3>
            <div className="grid grid-cols-4 gap-3">
              {TEAMS.map(team => (
                <div
                  key={team}
                  className="text-center p-3 rounded-xl"
                  style={{ backgroundColor: TEAM_HEX[team] + "20" }}
                >
                  <span className="text-2xl block">{TEAM_EMOJIS[team]}</span>
                  <span className="text-xs font-bold capitalize">{team}</span>
                  <span className="text-[10px] text-muted-foreground block">
                    {team === "red" ? "You" : "AI"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="heroOutline" size="lg" className="flex-1" onClick={() => navigate("/")}>
              ← Back
            </Button>
            <Button variant="hero" size="xl" className="flex-[2]" onClick={() => setGameStarted(true)}>
              🎮 Start Game
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* 3D Game View */}
      <div className="flex-1 relative">
        <GameCanvas
          gameState={gameState}
          environment={environment}
          onRollDice={handleRollDice}
          onMovePiece={handleMovePiece}
        />

        {/* Dice overlay for 2D display */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          {gameState.currentTeam === "red" && !gameState.rolling && !gameState.diceValue && (
            <Button variant="hero" size="xl" onClick={handleRollDice}>
              🎲 Roll Dice
            </Button>
          )}
          {gameState.diceValue && (
            <motion.div
              key={gameState.diceValue}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-xl bg-foreground flex items-center justify-center text-background text-3xl font-black shadow-lg"
            >
              {gameState.diceValue}
            </motion.div>
          )}
        </div>
      </div>

      {/* Side panel */}
      <div className="w-full lg:w-80 p-4 lg:p-6 flex flex-col gap-4 lg:border-l border-border bg-card/50 backdrop-blur overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl">🎲 Ludo</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>✕</Button>
        </div>

        {/* Current turn */}
        <div
          className="rounded-xl p-4 text-center border-2"
          style={{ borderColor: TEAM_HEX[gameState.currentTeam] }}
        >
          <p className="text-muted-foreground text-xs mb-1">Current Turn</p>
          <p className="font-display font-bold text-lg">
            {TEAM_EMOJIS[gameState.currentTeam]} {TEAM_LABELS[gameState.currentTeam]}
            {gameState.currentTeam === "red" ? " (You)" : " (AI)"}
          </p>
          {gameState.rolling && <p className="text-primary text-sm animate-pulse">Rolling...</p>}
        </div>

        {/* Scoreboard */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-display font-bold mb-3">Scoreboard</h3>
          <div className="space-y-2">
            {TEAMS.map(team => (
              <div
                key={team}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  gameState.currentTeam === team ? "bg-secondary" : ""
                }`}
              >
                <span className="text-sm">
                  {TEAM_EMOJIS[team]} {TEAM_LABELS[team]}
                </span>
                <span className="font-bold">{gameState.scores[team]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Environment info */}
        <div className="text-center text-xs text-muted-foreground">
          📍 {ENVIRONMENTS.find(e => e.id === environment)?.label}
        </div>

        {/* Controls */}
        <div className="mt-auto space-y-2">
          <Button variant="heroOutline" size="sm" className="w-full" onClick={resetGame}>
            🔄 Restart
          </Button>
          <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
        </div>
      </div>

      {/* End screen overlay */}
      <AnimatePresence>
        {showEndScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-lg flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card rounded-3xl p-10 max-w-lg w-full text-center"
            >
              <span className="text-6xl block mb-4">🏆</span>
              <h2 className="text-3xl md:text-4xl font-display font-black mb-2">
                {TEAM_EMOJIS[gameState.winner!]} {TEAM_LABELS[gameState.winner!]} Wins!
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                What an incredible game!
              </p>

              <div className="glass-card rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-display font-bold mb-2 text-gradient-ludo">
                  Want to experience this in real life?
                </h3>
                <p className="text-muted-foreground">
                  Bring the Human Size Ludo to your next event!
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button variant="hero" size="xl" onClick={() => navigate("/#booking")}>
                  🎯 Book The Real Human Ludo Event
                </Button>
                <Button
                  variant="heroOutline"
                  size="lg"
                  onClick={() => {
                    window.open(
                      "https://wa.me/91XXXXXXXXXX?text=Hi!%20I%20just%20played%20Human%20Ludo%20online%20and%20loved%20it!%20I%20want%20to%20book%20the%20real%20experience!",
                      "_blank"
                    );
                  }}
                >
                  💬 Contact on WhatsApp
                </Button>
                <Button variant="ghost" size="lg" onClick={resetGame}>
                  🔄 Play Again
                </Button>
              </div>

              {/* Share buttons */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Share your victory!</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const text = `🏆 I just won Human Ludo as ${TEAM_LABELS[gameState.winner!]}! Try it yourself:`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + window.location.href)}`, "_blank");
                    }}
                  >
                    📱 WhatsApp
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                  >
                    🔗 Copy Link
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayPage;

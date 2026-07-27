import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import diceImage from "@/assets/dice.png";
import { trackEvent } from "@/lib/analytics";

const BOARD_SIZE = 10;
const TEAM_COLORS = ["ludo-red", "ludo-blue", "ludo-green", "ludo-yellow"];
const TEAM_NAMES = ["Red", "Blue", "Green", "Yellow"];
const TEAM_EMOJIS = ["🔴", "🔵", "🟢", "🟡"];

// Simple linear path for demo (positions 0-39 around the board)
const getPathPosition = (step: number): { row: number; col: number } => {
  // Simplified path around the perimeter
  const path = [
    // Bottom row left to right (6,0) to (6,5)
    { row: 8, col: 1 }, { row: 8, col: 2 }, { row: 8, col: 3 }, { row: 8, col: 4 }, { row: 8, col: 5 },
    // Up (5,6) to (0,6)
    { row: 7, col: 5 }, { row: 6, col: 5 }, { row: 5, col: 5 }, { row: 4, col: 5 }, { row: 3, col: 5 },
    // Top row right (0,6) to (0,9)
    { row: 2, col: 5 }, { row: 2, col: 6 }, { row: 2, col: 7 }, { row: 2, col: 8 },
    // Down right
    { row: 3, col: 8 }, { row: 4, col: 8 }, { row: 5, col: 8 }, { row: 6, col: 8 }, { row: 7, col: 8 },
    // Bottom right
    { row: 8, col: 8 }, { row: 8, col: 7 }, { row: 8, col: 6 },
    // Finish area
    { row: 5, col: 5 },
  ];
  return path[Math.min(step, path.length - 1)];
};

const DiceFace = ({ value }: { value: number }) => {
  const dotPositions: Record<number, string[]> = {
    1: ["col-start-2 row-start-2"],
    2: ["col-start-1 row-start-1", "col-start-3 row-start-3"],
    3: ["col-start-1 row-start-1", "col-start-2 row-start-2", "col-start-3 row-start-3"],
    4: ["col-start-1 row-start-1", "col-start-3 row-start-1", "col-start-1 row-start-3", "col-start-3 row-start-3"],
    5: ["col-start-1 row-start-1", "col-start-3 row-start-1", "col-start-2 row-start-2", "col-start-1 row-start-3", "col-start-3 row-start-3"],
    6: ["col-start-1 row-start-1", "col-start-3 row-start-1", "col-start-1 row-start-2", "col-start-3 row-start-2", "col-start-1 row-start-3", "col-start-3 row-start-3"],
  };

  return (
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-foreground grid grid-cols-3 grid-rows-3 gap-1 p-3">
      {dotPositions[value]?.map((pos, i) => (
        <div key={i} className={`w-3 h-3 md:w-4 md:h-4 rounded-full bg-background ${pos} place-self-center`} />
      ))}
    </div>
  );
};

const LudoDemo = () => {
  const [positions, setPositions] = useState([0, 0, 0, 0]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [scores, setScores] = useState([0, 0, 0, 0]);

  const rollDice = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    trackEvent("demo_played", { placement: "homepage_demo" });

    // Animate dice
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);

        // Move piece
        setPositions(prev => {
          const newPos = [...prev];
          newPos[currentTeam] = Math.min(prev[currentTeam] + finalValue, 22);
          return newPos;
        });

        setScores(prev => {
          const newScores = [...prev];
          newScores[currentTeam] += finalValue;
          return newScores;
        });

        setCurrentTeam(prev => (prev + 1) % 4);
        setRolling(false);
      }
    }, 80);
  }, [rolling, currentTeam]);

  const resetGame = () => {
    setPositions([0, 0, 0, 0]);
    setScores([0, 0, 0, 0]);
    setCurrentTeam(0);
    setDiceValue(1);
  };

  return (
    <section className="py-16 md:py-24 px-4" id="demo">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Try The <span className="text-gradient-ludo">Demo</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">Click the dice to roll and watch your piece move!</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Mini Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-card rounded-2xl p-3 sm:p-4 md:p-6"
          >
            <div className="grid grid-cols-10 grid-rows-10 gap-0.5 aspect-square max-w-md mx-auto">
              {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, idx) => {
                const row = Math.floor(idx / BOARD_SIZE);
                const col = idx % BOARD_SIZE;

                // Color quadrants
                let cellColor = "bg-secondary/50";
                if (row < 4 && col < 4) cellColor = "bg-ludo-red/20";
                else if (row < 4 && col >= 6) cellColor = "bg-ludo-blue/20";
                else if (row >= 6 && col < 4) cellColor = "bg-ludo-green/20";
                else if (row >= 6 && col >= 6) cellColor = "bg-ludo-yellow/20";
                else if (row >= 4 && row <= 5 && col >= 4 && col <= 5) cellColor = "bg-primary/20";

                // Check if any piece is here
                const piecesHere = positions
                  .map((pos, teamIdx) => ({ teamIdx, pos }))
                  .filter(({ pos }) => {
                    const p = getPathPosition(pos);
                    return p.row === row && p.col === col;
                  });

                return (
                  <div
                    key={idx}
                    className={`${cellColor} rounded-sm relative flex items-center justify-center text-xs`}
                  >
                    <AnimatePresence>
                      {piecesHere.map(({ teamIdx }) => (
                        <motion.div
                          key={teamIdx}
                          layoutId={`piece-${teamIdx}`}
                          className={`absolute w-3/4 h-3/4 rounded-full bg-${TEAM_COLORS[teamIdx]} flex items-center justify-center text-[8px] md:text-[10px] font-bold shadow-lg`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {TEAM_EMOJIS[teamIdx]}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Controls */}
          <div className="space-y-4 sm:space-y-6">
            {/* Current turn */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 text-center">
              <p className="text-muted-foreground text-sm mb-2">Current Turn</p>
              <p className="font-display font-bold text-xl sm:text-2xl">
                {TEAM_EMOJIS[currentTeam]} {TEAM_NAMES[currentTeam]} Team
              </p>
            </div>

            {/* Dice */}
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4">
              <motion.button
                onClick={rollDice}
                disabled={rolling}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={rolling ? { rotate: [0, 360] } : {}}
                transition={rolling ? { duration: 0.3, repeat: Infinity } : {}}
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                <DiceFace value={diceValue} />
              </motion.button>
              <p className="text-muted-foreground text-sm">
                {rolling ? "Rolling..." : "Tap dice to roll!"}
              </p>
            </div>

            {/* Scoreboard */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg mb-4 text-center">Scoreboard</h3>
              <div className="space-y-3">
                {TEAM_NAMES.map((name, i) => (
                  <div
                    key={name}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      currentTeam === i ? "bg-secondary" : ""
                    }`}
                  >
                    <span className="font-body">
                      {TEAM_EMOJIS[i]} {name}
                    </span>
                    <span className="font-display font-bold">{scores[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="heroOutline" size="lg" className="w-full" onClick={resetGame}>
              🔄 Reset Game
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LudoDemo;

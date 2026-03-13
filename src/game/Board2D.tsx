import { motion } from "framer-motion";
import ludoBoard from "@/assets/ludo-board.jpeg";
import {
  type GameState,
  type TeamColor,
  getMovablePieces,
  TEAM_HEX,
  START_POSITIONS,
} from "@/game/gameLogic";

interface Board2DProps {
  gameState: GameState;
  onRollDice: () => void;
  onMovePiece: (idx: number) => void;
}

// Map each of the 52 board positions to percentage coordinates on the board image
// The board is a standard Ludo layout: Red(top-left), Green(top-right), Blue(bottom-left), Yellow(bottom-right)
// Positions go clockwise starting from Red's start

const CELL_SIZE = 6.25; // ~1/16 of the board in %

// Helper to create coordinates as [left%, top%]
// The board grid is roughly 15x15. Each cell ≈ 6.25%
// Row/col references (0-indexed from top-left)
const g = (col: number, row: number): [number, number] => [
  3.5 + col * 6.15,
  3.5 + row * 6.15,
];

// 52 positions around the board path, starting from Red's entry (col 6, row 13) going up
const BOARD_PATH: [number, number][] = [
  // Red start (pos 0): column 6, row 12 going UP (positions 0-4)
  g(6, 12), // 0
  g(6, 11), // 1
  g(6, 10), // 2
  g(6, 9),  // 3
  g(6, 8),  // 4
  // Turn right at top of red column (positions 5-10)
  g(5, 7),  // 5 - safe
  g(4, 7),  // 6
  g(3, 7),  // 7
  g(2, 7),  // 8
  g(1, 7),  // 9
  g(0, 7),  // 10
  // Turn down into green territory (positions 11-12)
  g(0, 6),  // 11
  g(0, 5),  // 12
  // Green start (pos 13): row 5, going RIGHT (positions 13-17)
  g(1, 5),  // 13
  g(2, 5),  // 14
  g(3, 5),  // 15
  g(4, 5),  // 16
  g(5, 5),  // 17
  // Turn down (positions 18-23)
  g(5, 4),  // 18 - safe
  g(5, 3),  // 19
  g(5, 2),  // 20
  g(5, 1),  // 21
  g(5, 0),  // 22 - adjusted
  g(6, 0),  // 23
  // Turn right (positions 24-25)
  g(7, 0),  // 24
  g(7, 1),  // 25
  // Blue start (pos 26): col 7 going DOWN (positions 26-30)
  g(7, 2),  // 26
  g(7, 3),  // 27
  g(7, 4),  // 28
  g(7, 5),  // 29
  g(8, 5),  // 30
  // Turn right (positions 31-36)
  g(8, 6),  // 31 - safe
  g(9, 6),  // 32 - adjusted
  g(10, 6), // 33 - adjusted  
  g(11, 6), // 34
  g(12, 6), // 35
  g(12, 7), // 36 - adjusted
  // Turn down (positions 37-38)
  g(12, 7), // 37
  g(12, 8), // 38
  // Yellow start (pos 39): going LEFT (positions 39-43)
  g(11, 7), // 39
  g(10, 7), // 40
  g(9, 7),  // 41
  g(8, 7),  // 42
  g(7, 7),  // 43
  // Turn up (positions 44-49)
  g(7, 8),  // 44 - safe
  g(7, 9),  // 45
  g(7, 10), // 46
  g(7, 11), // 47
  g(7, 12), // 48
  g(6, 13), // 49 - adjusted
  // Back to start area (positions 50-51)
  g(6, 13), // 50
  g(6, 13), // 51
];

// Home base positions for pieces still at home (4 pieces per team)
const HOME_POSITIONS: Record<TeamColor, [number, number][]> = {
  red: [g(2, 2), g(4, 2), g(2, 4), g(4, 4)],
  green: [g(9, 2), g(11, 2), g(9, 4), g(11, 4)],
  yellow: [g(9, 9), g(11, 9), g(9, 11), g(11, 11)],
  blue: [g(2, 9), g(4, 9), g(2, 11), g(4, 11)],
};

// Final stretch positions (going toward center)
const FINAL_POSITIONS: Record<TeamColor, [number, number][]> = {
  red: [g(6, 11), g(6, 10), g(6, 9), g(6, 8), g(6, 7)],
  green: [g(1, 6), g(2, 6), g(3, 6), g(4, 6), g(5, 6)],
  blue: [g(7, 1), g(7, 2), g(7, 3), g(7, 4), g(7, 5)],
  yellow: [g(11, 6), g(10, 6), g(9, 6), g(8, 6), g(7, 6)],
};

const getPieceScreenPos = (
  piece: { team: TeamColor; position: number; id: number }
): [number, number] => {
  if (piece.position === -1) {
    return HOME_POSITIONS[piece.team][piece.id] || HOME_POSITIONS[piece.team][0];
  }
  if (piece.position >= 57) {
    return g(6.5, 6.5); // center
  }
  if (piece.position >= 52) {
    const idx = piece.position - 52;
    const finals = FINAL_POSITIONS[piece.team];
    return finals[Math.min(idx, finals.length - 1)];
  }
  const startOffset = START_POSITIONS[piece.team];
  const actualPos = (piece.position + startOffset) % 52;
  return BOARD_PATH[actualPos] || g(6.5, 6.5);
};

const PIECE_COLORS: Record<TeamColor, string> = {
  red: "#dc2626",
  green: "#16a34a",
  blue: "#2563eb",
  yellow: "#eab308",
};

const Board2D = ({ gameState, onRollDice, onMovePiece }: Board2DProps) => {
  const movable = gameState.diceValue
    ? getMovablePieces(gameState, gameState.diceValue)
    : [];

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-background">
      <div className="relative aspect-square max-h-[85vh] max-w-[85vh] w-full">
        {/* Board image */}
        <img
          src={ludoBoard}
          alt="Ludo Board"
          className="w-full h-full object-contain rounded-2xl shadow-2xl"
          draggable={false}
        />

        {/* Pieces overlay */}
        {gameState.pieces.map((piece, idx) => {
          const [left, top] = getPieceScreenPos(piece);
          const isMovable = movable.includes(idx);
          const isFinished = piece.position >= 57;

          if (isFinished) return null;

          return (
            <motion.div
              key={`${piece.team}-${piece.id}`}
              animate={{ left: `${left}%`, top: `${top}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: isMovable ? 20 : 10 }}
            >
              <button
                onClick={isMovable ? () => onMovePiece(idx) : undefined}
                disabled={!isMovable}
                className={`
                  w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full border-2 border-white shadow-lg
                  flex items-center justify-center text-white text-[8px] sm:text-[10px] font-bold
                  transition-transform
                  ${isMovable ? "cursor-pointer ring-2 ring-white animate-pulse scale-125 hover:scale-150" : "cursor-default"}
                `}
                style={{
                  backgroundColor: PIECE_COLORS[piece.team],
                  boxShadow: isMovable
                    ? `0 0 12px ${PIECE_COLORS[piece.team]}`
                    : `0 2px 4px rgba(0,0,0,0.3)`,
                }}
              >
                {piece.id + 1}
              </button>
            </motion.div>
          );
        })}

        {/* Dice in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={
              gameState.currentTeam === "red" && !gameState.rolling
                ? onRollDice
                : undefined
            }
            className={`
              w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-white shadow-xl
              flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-black
              border-2 transition-all
              ${gameState.currentTeam === "red" && !gameState.rolling
                ? "cursor-pointer border-primary hover:shadow-2xl"
                : "cursor-default border-muted"
              }
              ${gameState.rolling ? "animate-spin" : ""}
            `}
            style={{ color: TEAM_HEX[gameState.currentTeam] }}
          >
            {gameState.diceValue || "🎲"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Board2D;

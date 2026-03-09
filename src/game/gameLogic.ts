// Ludo game logic and types

export type TeamColor = "red" | "blue" | "green" | "yellow";

export interface GamePiece {
  team: TeamColor;
  position: number; // -1 = home, 0-51 = board, 52-56 = final stretch, 57 = finished
  id: number;
}

export interface GameState {
  pieces: GamePiece[];
  currentTeam: TeamColor;
  diceValue: number | null;
  rolling: boolean;
  gameOver: boolean;
  winner: TeamColor | null;
  scores: Record<TeamColor, number>;
}

export const TEAMS: TeamColor[] = ["red", "blue", "green", "yellow"];

export const TEAM_LABELS: Record<TeamColor, string> = {
  red: "Team Red",
  blue: "Team Blue",
  green: "Team Green",
  yellow: "Team Yellow",
};

export const TEAM_HEX: Record<TeamColor, string> = {
  red: "#e04040",
  blue: "#4080e0",
  green: "#40a040",
  yellow: "#e0c030",
};

export const TEAM_EMOJIS: Record<TeamColor, string> = {
  red: "🔴",
  blue: "🔵",
  green: "🟢",
  yellow: "🟡",
};

// Starting positions for each team on the main track
export const START_POSITIONS: Record<TeamColor, number> = {
  red: 0,
  blue: 13,
  green: 26,
  yellow: 39,
};

// Board path coordinates (x, z) for 52 positions around the board
// The board is 15x15 grid, center at 0,0
const S = 0.8; // spacing

export const getBoardPosition = (pos: number): [number, number] => {
  // 52-position path around the board
  const path: [number, number][] = [];
  
  // Bottom-left to top-left (red side going up)
  for (let i = 0; i < 6; i++) path.push([-1 * S, (6 - i) * S]);
  // Top-left corner going right
  for (let i = 0; i < 6; i++) path.push([(-1 + i + 1) * S, 0]);
  path.push([6 * S, -1 * S]);
  
  // Top going right then down (blue side)
  for (let i = 0; i < 6; i++) path.push([6 * S + S, -(-1 + i + 1) * S]);
  path.push([6 * S, -7 * S]);
  for (let i = 0; i < 5; i++) path.push([(6 - i - 1) * S, -7 * S]);
  path.push([0, -7 * S - S]);
  
  // Right side going down (green start)
  for (let i = 0; i < 6; i++) path.push([-1 * S, (-7 - 1 - i) * S]);
  path.push([-2 * S, -7 * S]);
  for (let i = 0; i < 5; i++) path.push([(-2 - i - 1) * S, -7 * S]);
  path.push([-7 * S - S, -6 * S]);
  
  // Left going up (yellow)
  for (let i = 0; i < 6; i++) path.push([(-7 - 1) * S, (-6 + i + 1) * S]);
  path.push([-7 * S, 0]);
  for (let i = 0; i < 5; i++) path.push([(-7 + i + 1) * S, 0]);
  
  const idx = ((pos % 52) + 52) % 52;
  if (idx < path.length) return path[idx];
  return [0, 0];
};

// Simplified: map position to 3D coordinates on a flat board
export const getPosition3D = (piece: GamePiece): [number, number, number] => {
  if (piece.position === -1) {
    // Home positions
    const homeOffsets: Record<TeamColor, [number, number]> = {
      red: [-3, 3],
      blue: [3, 3],
      green: [3, -3],
      yellow: [-3, -3],
    };
    const offset = homeOffsets[piece.team];
    const pieceOffset = (piece.id % 2 === 0 ? -0.4 : 0.4);
    const pieceOffset2 = (piece.id < 2 ? -0.4 : 0.4);
    return [offset[0] + pieceOffset, 0.3, offset[1] + pieceOffset2];
  }
  
  if (piece.position >= 57) {
    // Finished - center
    return [0, 0.3, 0];
  }

  // Simple circular path
  const totalSteps = 52;
  const startOffset = START_POSITIONS[piece.team];
  const actualPos = (piece.position + startOffset) % totalSteps;
  
  const angle = (actualPos / totalSteps) * Math.PI * 2 - Math.PI / 2;
  const radius = 4;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  
  return [x, 0.3, z];
};

export const createInitialState = (): GameState => {
  const pieces: GamePiece[] = [];
  for (const team of TEAMS) {
    for (let i = 0; i < 4; i++) {
      pieces.push({ team, position: -1, id: i });
    }
  }
  return {
    pieces,
    currentTeam: "red",
    diceValue: null,
    rolling: false,
    gameOver: false,
    winner: null,
    scores: { red: 0, blue: 0, green: 0, yellow: 0 },
  };
};

export const rollDice = (): number => Math.floor(Math.random() * 6) + 1;

export const getNextTeam = (current: TeamColor): TeamColor => {
  const idx = TEAMS.indexOf(current);
  return TEAMS[(idx + 1) % 4];
};

export const getMovablePieces = (state: GameState, diceValue: number): number[] => {
  const movable: number[] = [];
  state.pieces.forEach((piece, idx) => {
    if (piece.team !== state.currentTeam) return;
    if (piece.position === -1 && diceValue === 6) movable.push(idx);
    if (piece.position >= 0 && piece.position < 57) movable.push(idx);
  });
  return movable;
};

export const movePiece = (state: GameState, pieceIdx: number, diceValue: number): GameState => {
  const newPieces = [...state.pieces.map(p => ({ ...p }))];
  const piece = newPieces[pieceIdx];
  
  if (piece.position === -1 && diceValue === 6) {
    piece.position = 0;
  } else if (piece.position >= 0) {
    piece.position = Math.min(piece.position + diceValue, 57);
  }

  const newScores = { ...state.scores };
  newScores[piece.team] = newPieces
    .filter(p => p.team === piece.team)
    .reduce((sum, p) => sum + Math.max(0, p.position), 0);

  const finished = newPieces.filter(p => p.team === piece.team && p.position >= 57).length;
  const gameOver = finished === 4;

  return {
    ...state,
    pieces: newPieces,
    scores: newScores,
    gameOver,
    winner: gameOver ? piece.team : null,
    currentTeam: diceValue === 6 ? state.currentTeam : getNextTeam(state.currentTeam),
    diceValue,
    rolling: false,
  };
};

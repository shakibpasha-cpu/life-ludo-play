// Web Audio API sound effects for the Ludo game
let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

const playTone = (freq: number, duration: number, type: OscillatorType = "square", volume = 0.15) => {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
};

export const playDiceRollTick = () => {
  playTone(300 + Math.random() * 400, 0.05, "square", 0.08);
};

export const playDiceResult = () => {
  playTone(600, 0.15, "triangle", 0.2);
  setTimeout(() => playTone(800, 0.1, "triangle", 0.15), 100);
};

export const playPieceMove = () => {
  playTone(440, 0.1, "sine", 0.12);
};

export const playPieceOut = () => {
  // "Pop" sound for piece leaving home
  playTone(523, 0.08, "sine", 0.2);
  setTimeout(() => playTone(659, 0.08, "sine", 0.2), 80);
  setTimeout(() => playTone(784, 0.12, "sine", 0.2), 160);
};

export const playCapture = () => {
  playTone(200, 0.15, "sawtooth", 0.15);
  setTimeout(() => playTone(150, 0.2, "sawtooth", 0.12), 120);
};

export const playVictory = () => {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, "triangle", 0.2), i * 150);
  });
};

export const playTurnChange = () => {
  playTone(350, 0.08, "sine", 0.08);
};

export const playNoMove = () => {
  playTone(200, 0.2, "sine", 0.1);
  setTimeout(() => playTone(180, 0.25, "sine", 0.08), 150);
};

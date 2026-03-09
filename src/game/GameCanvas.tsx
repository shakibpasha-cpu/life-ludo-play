import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Text, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { LudoBoard, GamePiece3D, Dice3D, EnvironmentGround } from "@/game/Board3D";
import { type GameState, getPosition3D, getMovablePieces, TEAM_HEX } from "@/game/gameLogic";

interface GameCanvasProps {
  gameState: GameState;
  environment: string;
  onRollDice: () => void;
  onMovePiece: (idx: number) => void;
}

const GameCanvas = ({ gameState, environment, onRollDice, onMovePiece }: GameCanvasProps) => {
  const movable = gameState.diceValue ? getMovablePieces(gameState, gameState.diceValue) : [];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 12, 8], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 15, 10]} intensity={1} castShadow shadow-mapSize={1024} />
          <pointLight position={[-5, 10, -5]} intensity={0.5} color="#e0c030" />

          {/* Environment */}
          <EnvironmentGround environment={environment} />
          <Environment preset="sunset" background={false} />
          <fog attach="fog" args={["#0a0a14", 20, 50]} />

          {/* Board */}
          <LudoBoard />

          {/* Contact shadows under the board */}
          <ContactShadows position={[0, -0.19, 0]} opacity={0.4} scale={15} blur={2} />

          {/* Game Pieces */}
          {gameState.pieces.map((piece, idx) => {
            const pos = getPosition3D(piece);
            const isMovable = movable.includes(idx);
            return (
              <GamePiece3D
                key={`${piece.team}-${piece.id}`}
                position={pos}
                team={piece.team}
                isActive={isMovable}
                onClick={isMovable ? () => onMovePiece(idx) : undefined}
              />
            );
          })}

          {/* 3D Dice */}
          <Dice3D
            value={gameState.diceValue || 1}
            rolling={gameState.rolling}
            onClick={onRollDice}
          />

          {/* Current team indicator text */}
          <Text
            position={[0, 0.5, -6.5]}
            fontSize={0.4}
            color={TEAM_HEX[gameState.currentTeam]}
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {gameState.rolling ? "Rolling..." : `${gameState.currentTeam.toUpperCase()}'s Turn`}
          </Text>

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.5}
            minDistance={8}
            maxDistance={20}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default GameCanvas;

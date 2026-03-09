import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TEAM_HEX, type TeamColor } from "@/game/gameLogic";

// 3D Board
export const LudoBoard = () => {
  return (
    <group>
      {/* Main board */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[12, 12, 0.3]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Color quadrants */}
      <Quadrant position={[-3, 0.16, 3]} color="#e04040" /> {/* Red - top left */}
      <Quadrant position={[3, 0.16, 3]} color="#4080e0" /> {/* Blue - top right */}
      <Quadrant position={[3, 0.16, -3]} color="#40a040" /> {/* Green - bottom right */}
      <Quadrant position={[-3, 0.16, -3]} color="#e0c030" /> {/* Yellow - bottom left */}

      {/* Center star */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.17, 0]}>
        <circleGeometry args={[1.2, 6]} />
        <meshStandardMaterial color="#e0c030" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, Math.PI / 6, 0]} position={[0, 0.18, 0]}>
        <circleGeometry args={[1, 6]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Path tiles around the board */}
      <PathTiles />

      {/* Board border glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[5.8, 6.2, 4]} />
        <meshStandardMaterial color="#e0c030" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

const Quadrant = ({ position, color }: { position: [number, number, number]; color: string }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
    <planeGeometry args={[4.8, 4.8]} />
    <meshStandardMaterial color={color} transparent opacity={0.25} />
  </mesh>
);

const PathTiles = () => {
  const tiles = useMemo(() => {
    const result: { pos: [number, number, number]; color: string }[] = [];
    const totalSteps = 52;
    const radius = 4;
    
    for (let i = 0; i < totalSteps; i++) {
      const angle = (i / totalSteps) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      let color = "#2a2a4a";
      if (i < 13) color = "#e0404040";
      else if (i < 26) color = "#4080e040";
      else if (i < 39) color = "#40a04040";
      else color = "#e0c03040";
      
      result.push({ pos: [x, 0.16, z], color });
    }
    return result;
  }, []);

  return (
    <>
      {tiles.map((tile, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={tile.pos}>
          <circleGeometry args={[0.3, 8]} />
          <meshStandardMaterial color={tile.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </>
  );
};

// 3D Game Piece (human-like pawn)
export const GamePiece3D = ({ 
  position, 
  team, 
  isActive,
  onClick 
}: { 
  position: [number, number, number]; 
  team: TeamColor; 
  isActive: boolean;
  onClick?: () => void;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const color = TEAM_HEX[team];

  useFrame((state) => {
    if (meshRef.current) {
      if (isActive) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      } else {
        meshRef.current.position.y = position[1];
      }
    }
  });

  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.3, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.1, 16]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Glow ring for active */}
      {isActive && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.28, 0.35, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.6} emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
      )}
    </group>
  );
};

// 3D Dice
export const Dice3D = ({ 
  value, 
  rolling, 
  onClick 
}: { 
  value: number; 
  rolling: boolean; 
  onClick: () => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (rolling) {
        meshRef.current.rotation.x += 0.3;
        meshRef.current.rotation.y += 0.2;
        meshRef.current.rotation.z += 0.1;
      } else {
        meshRef.current.rotation.x += (0 - meshRef.current.rotation.x) * 0.05;
        meshRef.current.rotation.z += (0 - meshRef.current.rotation.z) * 0.05;
        meshRef.current.position.y = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 2, 0]} onClick={onClick} castShadow>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#f5f5f0" metalness={0.1} roughness={0.3} />
      {/* Dots would need textures - we use a text overlay in 2D UI instead */}
    </mesh>
  );
};

// Environment ground planes
export const EnvironmentGround = ({ environment }: { environment: string }) => {
  const colorMap: Record<string, string> = {
    park: "#2d5a27",
    living_room: "#8b6f47",
    mall: "#c0c0c0",
    event_hall: "#4a3728",
    wedding: "#3a5a2a",
    festival: "#c2956b",
  };
  
  const color = colorMap[environment] || "#2d5a27";

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

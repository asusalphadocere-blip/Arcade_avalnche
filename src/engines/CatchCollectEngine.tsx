import React, { useRef, useEffect, useState } from 'react';
import { VersionedGameConfig } from '../types/arcade';
import { Sparkles, Trophy, Heart, Flame, Zap, ArrowLeft, ArrowRight } from 'lucide-react';

interface CatchCollectEngineProps {
  config: VersionedGameConfig;
  onGameOver: (score: number, stats: { itemsCollected: number; obstaclesHit: number; accuracy: number }) => void;
  isKioskMode?: boolean;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  isObstacle: boolean;
  value: number;
  symbol: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  life: number;
}

export const CatchCollectEngine: React.FC<CatchCollectEngineProps> = ({
  config,
  onGameOver,
  isKioskMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.game.durationSeconds || 30);
  const [combo, setCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [itemsCollected, setItemsCollected] = useState(0);
  const [obstaclesHit, setObstaclesHit] = useState(0);

  const gameState = useRef({
    playerX: 180,
    playerWidth: 64,
    playerHeight: 20,
    items: [] as FallingItem[],
    particles: [] as Particle[],
    isLeftPressed: false,
    isRightPressed: false,
    isRunning: true,
    score: 0,
    itemsCollected: 0,
    obstaclesHit: 0,
    combo: 1,
    lives: 3,
  });

  const { colors, title } = config.brand;
  const pointsPerItem = config.game.scoring.collectItem ?? 10;
  const penaltyPerObstacle = config.game.scoring.penaltyObstacle ?? 15;

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameState.current.isLeftPressed = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameState.current.isRightPressed = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameState.current.isLeftPressed = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameState.current.isRightPressed = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          gameState.current.isRunning = false;
          const finalScore = gameState.current.score;
          const totalCatches = gameState.current.itemsCollected + gameState.current.obstaclesHit;
          const accuracy = totalCatches > 0 ? Math.round((gameState.current.itemsCollected / totalCatches) * 100) : 100;
          onGameOver(finalScore, {
            itemsCollected: gameState.current.itemsCollected,
            obstaclesHit: gameState.current.obstaclesHit,
            accuracy,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onGameOver]);

  // Touch and drag controls
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const relativeX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    gameState.current.playerX = Math.max(
      gameState.current.playerWidth / 2,
      Math.min(canvas.width - gameState.current.playerWidth / 2, relativeX)
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) * (canvas.width / rect.width);
    gameState.current.playerX = Math.max(
      gameState.current.playerWidth / 2,
      Math.min(canvas.width - gameState.current.playerWidth / 2, relativeX)
    );
  };

  // Main game animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastSpawnTime = performance.now();
    const spawnInterval = config.game.difficulty === 'hard' ? 450 : config.game.difficulty === 'easy' ? 800 : 600;

    const createExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        gameState.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          life: 0.9,
        });
      }
    };

    const render = (time: number) => {
      if (!gameState.current.isRunning) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear with brand background
      ctx.fillStyle = colors.background || '#0B0E14';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid or arena lines
      ctx.strokeStyle = colors.secondary || '#1F2937';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Move player with keys
      const playerSpeed = 7;
      if (gameState.current.isLeftPressed) {
        gameState.current.playerX = Math.max(
          gameState.current.playerWidth / 2,
          gameState.current.playerX - playerSpeed
        );
      }
      if (gameState.current.isRightPressed) {
        gameState.current.playerX = Math.min(
          width - gameState.current.playerWidth / 2,
          gameState.current.playerX + playerSpeed
        );
      }

      // Spawn items
      if (time - lastSpawnTime > spawnInterval) {
        lastSpawnTime = time;
        const isObstacle = Math.random() < (config.game.difficulty === 'hard' ? 0.4 : 0.25);
        const itemSize = 24;
        gameState.current.items.push({
          id: Math.random(),
          x: Math.random() * (width - 40) + 20,
          y: -itemSize,
          size: itemSize,
          speed: (Math.random() * 2 + 3) * (config.game.difficulty === 'hard' ? 1.3 : 1),
          isObstacle,
          value: isObstacle ? -penaltyPerObstacle : pointsPerItem,
          symbol: isObstacle ? '✕' : '▲',
        });
      }

      // Update & Draw Items
      const playerY = height - 40;
      const playerLeft = gameState.current.playerX - gameState.current.playerWidth / 2;
      const playerRight = gameState.current.playerX + gameState.current.playerWidth / 2;

      for (let i = gameState.current.items.length - 1; i >= 0; i--) {
        const item = gameState.current.items[i];
        item.y += item.speed;

        // Collision Check with Player
        if (
          item.y + item.size / 2 >= playerY - gameState.current.playerHeight / 2 &&
          item.y - item.size / 2 <= playerY + gameState.current.playerHeight / 2 &&
          item.x >= playerLeft &&
          item.x <= playerRight
        ) {
          if (item.isObstacle) {
            // Obstacle hit
            gameState.current.score = Math.max(0, gameState.current.score - penaltyPerObstacle);
            gameState.current.combo = 1;
            gameState.current.obstaclesHit += 1;
            createExplosion(item.x, item.y, '#EF4444');
          } else {
            // Collectible caught
            const bonus = gameState.current.combo > 1 ? gameState.current.combo * 2 : 0;
            gameState.current.score += pointsPerItem + bonus;
            gameState.current.combo = Math.min(5, gameState.current.combo + 1);
            gameState.current.itemsCollected += 1;
            createExplosion(item.x, item.y, colors.primary || '#E84142');
          }

          setScore(gameState.current.score);
          setCombo(gameState.current.combo);
          setItemsCollected(gameState.current.itemsCollected);
          setObstaclesHit(gameState.current.obstaclesHit);
          gameState.current.items.splice(i, 1);
          continue;
        }

        // Drop below screen
        if (item.y > height + item.size) {
          if (!item.isObstacle) {
            // Dropped positive item resets combo
            gameState.current.combo = 1;
            setCombo(1);
          }
          gameState.current.items.splice(i, 1);
          continue;
        }

        // Draw 8-Bit Pixel Art Item
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const halfSize = item.size / 2;

        if (item.isObstacle) {
          // 8-Bit Pixel Obstacle: Red Spike Glitch Mine
          ctx.fillStyle = '#EF4444';
          // Pixel cross & body
          ctx.fillRect(item.x - 4, item.y - halfSize, 8, item.size);
          ctx.fillRect(item.x - halfSize, item.y - 4, item.size, 8);
          // Corner pixels
          ctx.fillRect(item.x - 8, item.y - 8, 4, 4);
          ctx.fillRect(item.x + 4, item.y - 8, 4, 4);
          ctx.fillRect(item.x - 8, item.y + 4, 4, 4);
          ctx.fillRect(item.x + 4, item.y + 4, 4, 4);

          // Center dark skull eye pixels
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(item.x - 4, item.y - 2, 3, 3);
          ctx.fillRect(item.x + 1, item.y - 2, 3, 3);
          ctx.fillRect(item.x - 2, item.y + 3, 4, 2);
        } else {
          // 8-Bit Pixel Collectible: Avalanche Crimson Gem
          const pCol = colors.primary || '#E84142';
          ctx.fillStyle = pCol;
          // Stepped diamond pixel rows
          ctx.fillRect(item.x - 2, item.y - 12, 4, 3);
          ctx.fillRect(item.x - 6, item.y - 9, 12, 4);
          ctx.fillRect(item.x - 10, item.y - 5, 20, 10);
          ctx.fillRect(item.x - 6, item.y + 5, 12, 4);
          ctx.fillRect(item.x - 2, item.y + 9, 4, 3);

          // Pixel Highlights (white reflection)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(item.x - 4, item.y - 6, 3, 3);
          ctx.fillRect(item.x - 2, item.y - 3, 4, 2);
          ctx.fillRect(item.x - 1, item.y + 1, 2, 4);

          // Pixel Avalanche White Triangle Emblem
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(item.x, item.y - 2, 2, 2);
          ctx.fillRect(item.x - 2, item.y, 6, 2);
          ctx.fillRect(item.x - 4, item.y + 2, 10, 2);
        }
        ctx.restore();
      }

      // Update & Draw 8-Bit Pixel Particles
      for (let p = gameState.current.particles.length - 1; p >= 0; p--) {
        const particle = gameState.current.particles[p];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha *= particle.life;

        ctx.fillStyle = particle.color;
        ctx.globalAlpha = Math.max(0, particle.alpha);
        // Square 4x4 pixel chunks
        ctx.fillRect(Math.floor(particle.x), Math.floor(particle.y), 4, 4);
        ctx.globalAlpha = 1.0;

        if (particle.alpha < 0.05) {
          gameState.current.particles.splice(p, 1);
        }
      }

      // Draw 8-Bit Retro Pixel Arcade Spaceship
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      const px = Math.floor(gameState.current.playerX - gameState.current.playerWidth / 2);
      const py = Math.floor(playerY - gameState.current.playerHeight / 2);
      const pw = gameState.current.playerWidth;

      // Base Hull (Dark slate with red armor trim)
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(px, py + 4, pw, 12);

      // Neon Top Wings
      ctx.fillStyle = colors.primary || '#E84142';
      ctx.fillRect(px + 4, py + 2, pw - 8, 4);
      ctx.fillRect(px, py + 6, 6, 10);
      ctx.fillRect(px + pw - 6, py + 6, 6, 10);

      // Center Cockpit Dome (Cyan / Gold)
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(px + pw / 2 - 6, py, 12, 6);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(px + pw / 2 - 3, py + 1, 3, 2); // Cockpit pixel gleam

      // Thruster Neon Flames (Pulsing 8-bit fire)
      const flameHeight = Math.floor(Math.random() * 4) + 4;
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(px + 10, py + 16, 6, flameHeight);
      ctx.fillRect(px + pw - 16, py + 16, 6, flameHeight);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(px + 12, py + 16, 2, flameHeight + 2);
      ctx.fillRect(px + pw - 14, py + 16, 2, flameHeight + 2);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [colors, config.game.difficulty, penaltyPerObstacle, pointsPerItem]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none">
      {/* Top Game HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur-md border-b border-slate-800 text-xs font-mono text-white z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-base text-amber-400">{score}</span>
            <span className="text-[10px] text-slate-400">PTS</span>
          </div>

          {combo > 1 && (
            <span className="px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500 text-red-300 text-[10px] font-bold animate-pulse">
              {combo}x COMBO!
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Tiempo:</span>
            <span className={`font-bold ${timeLeft <= 5 ? 'text-red-500 animate-ping' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={360}
          height={480}
          onTouchMove={handleTouchMove}
          onMouseMove={handleMouseMove}
          className="w-full h-full object-contain cursor-ew-resize touch-none"
        />

        {/* On-screen controls for mobile touch buttons */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between pointer-events-none sm:hidden">
          <button
            onTouchStart={() => (gameState.current.isLeftPressed = true)}
            onTouchEnd={() => (gameState.current.isLeftPressed = false)}
            className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center pointer-events-auto active:bg-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onTouchStart={() => (gameState.current.isRightPressed = true)}
            onTouchEnd={() => (gameState.current.isRightPressed = false)}
            className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center pointer-events-auto active:bg-white/30"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="w-full text-center py-1.5 bg-black/40 text-[10px] text-slate-400 font-mono">
        Arrastra el dedo o usa las flechas ← / → para moverte
      </div>
    </div>
  );
};

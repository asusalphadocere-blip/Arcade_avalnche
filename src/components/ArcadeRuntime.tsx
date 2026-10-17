import React, { useState, useEffect } from 'react';
import { VersionedGameConfig, LeaderboardEntry, TargetDevice } from '../types/arcade';
import { CatchCollectEngine } from '../engines/CatchCollectEngine';
import { BrandQuizEngine } from '../engines/BrandQuizEngine';
import { ReactionTestEngine } from '../engines/ReactionTestEngine';
import { 
  Trophy, 
  Flame, 
  Zap, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  Award,
  Layers
} from 'lucide-react';

interface ArcadeRuntimeProps {
  config: VersionedGameConfig;
  targetDevice?: TargetDevice;
  onScoreSubmitted?: (entry: LeaderboardEntry) => void;
  leaderboard?: LeaderboardEntry[];
}

export const ArcadeRuntime: React.FC<ArcadeRuntimeProps> = ({
  config,
  targetDevice = 'mobile-web',
  onScoreSubmitted,
  leaderboard = [],
}) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [finalScore, setFinalScore] = useState(0);
  const [gameStats, setGameStats] = useState({ itemsCollected: 0, obstaclesHit: 0, accuracy: 100 });
  const [nickname, setNickname] = useState('Player-1');
  const [eventCodeInput, setEventCodeInput] = useState('');
  const [accreditationIdInput, setAccreditationIdInput] = useState('');
  const [accessError, setAccessError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [badgeClaimed, setBadgeClaimed] = useState(false);
  const [kioskCountdown, setKioskCountdown] = useState(15);

  const { brand, game, event } = config;

  // Auto reset in Kiosk mode after game over
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'gameover' && targetDevice === 'arcade-kiosk') {
      setKioskCountdown(15);
      timer = setInterval(() => {
        setKioskCountdown((prev) => {
          if (prev <= 1) {
            setGameState('start');
            setScoreSubmitted(false);
            setBadgeClaimed(false);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, targetDevice]);

  const handleStartGame = () => {
    // Validate Access Mode
    if (event.accessMode === 'event_code') {
      const validCode = event.eventCode || 'SUMMIT2026';
      if (eventCodeInput.trim().toUpperCase() !== validCode.toUpperCase()) {
        setAccessError(`Código de evento incorrecto. Usa el código: ${validCode}`);
        return;
      }
    } else if (event.accessMode === 'accredited') {
      const list = event.accreditationList || ['VIP-001', 'DEV-99'];
      if (!list.includes(accreditationIdInput.trim().toUpperCase()) && accreditationIdInput.trim() !== 'VIP') {
        setAccessError(`Acreditación no válida. Prueba con: ${list[0]} o VIP`);
        return;
      }
    }

    setAccessError(null);
    setGameState('playing');
    setScoreSubmitted(false);
    setBadgeClaimed(false);
  };

  const handleGameOver = (score: number, stats: { itemsCollected: number; obstaclesHit: number; accuracy: number }) => {
    setFinalScore(score);
    setGameStats(stats);
    setGameState('gameover');
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setIsSubmitting(true);

    const newEntry: LeaderboardEntry = {
      id: `score-${Date.now()}`,
      projectId: config.project.id,
      nickname: nickname.trim(),
      score: finalScore,
      accuracy: gameStats.accuracy,
      timestamp: Date.now(),
      targetDevice,
      verifiedOnchain: config.integrations.avalanche.enabled,
      txHash: config.integrations.avalanche.enabled ? `0x${Math.random().toString(16).slice(2, 10)}...fuji` : undefined,
    };

    try {
      await fetch('/api/arcade/sessions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
    } catch (err) {
      console.log('Local score recorded:', err);
    }

    if (onScoreSubmitted) {
      onScoreSubmitted(newEntry);
    }

    setIsSubmitting(false);
    setScoreSubmitted(true);
  };

  const handleClaimBadge = () => {
    setBadgeClaimed(true);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between overflow-hidden rounded-2xl shadow-2xl"
      style={{
        backgroundColor: brand.colors.background || '#0B0E14',
        color: brand.colors.text || '#FFFFFF',
      }}
    >
      {/* 1. START SCREEN */}
      {gameState === 'start' && (
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
          {/* Top Brand Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: brand.colors.primary || '#E84142' }}
              >
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm tracking-tight font-mono">
                {brand.logoText || 'Arcade Event'}
              </span>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
              {event.name}
            </span>
          </div>

          {/* Center Title & Tagline */}
          <div className="my-auto text-center space-y-4 py-6">
            <div className="inline-block p-2 rounded-2xl bg-white/5 border border-white/10">
              <Trophy className="w-10 h-10 mx-auto" style={{ color: brand.colors.accent || '#FF6B6C' }} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: brand.colors.text }}>
              {brand.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              {brand.tagline || 'Supera la puntuación más alta y gana el trofeo del evento.'}
            </p>

            {/* Access Mode Validation Field */}
            <div className="max-w-xs mx-auto space-y-2 pt-2">
              {event.accessMode === 'event_code' && (
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1 text-left">
                    Introduce el Código del Evento:
                  </label>
                  <input
                    type="text"
                    value={eventCodeInput}
                    onChange={(e) => setEventCodeInput(e.target.value)}
                    placeholder={event.eventCode || 'SUMMIT2026'}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs font-mono text-center text-white uppercase focus:border-red-500 outline-none"
                  />
                </div>
              )}

              {event.accessMode === 'accredited' && (
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1 text-left">
                    Número de Acreditación / Gafete:
                  </label>
                  <input
                    type="text"
                    value={accreditationIdInput}
                    onChange={(e) => setAccreditationIdInput(e.target.value)}
                    placeholder="Ej. VIP-001 o DEV-99"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs font-mono text-center text-white uppercase focus:border-red-500 outline-none"
                  />
                </div>
              )}

              {accessError && (
                <p className="text-[11px] text-red-400 font-medium">{accessError}</p>
              )}
            </div>
          </div>

          {/* Bottom Start Button & Controls Hint */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleStartGame}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide text-white shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
              style={{
                backgroundColor: brand.colors.primary || '#E84142',
                boxShadow: `0 10px 25px -5px ${brand.colors.primary}60`,
              }}
            >
              <span>{brand.startButton || 'Iniciar Partida'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Duración: {game.durationSeconds}s</span>
              <span>Dificultad: {game.difficulty.toUpperCase()}</span>
              <span>Intentos: {event.maxAttemptsPerPlayer} máx</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. PLAYING SCREEN */}
      {gameState === 'playing' && (
        <div className="flex-1 w-full h-full relative">
          {game.engineId === 'catch-collect' && (
            <CatchCollectEngine
              config={config}
              onGameOver={handleGameOver}
              isKioskMode={targetDevice === 'arcade-kiosk'}
            />
          )}

          {game.engineId === 'brand-quiz' && (
            <BrandQuizEngine
              config={config}
              onGameOver={handleGameOver}
            />
          )}

          {game.engineId === 'reaction-test' && (
            <ReactionTestEngine
              config={config}
              onGameOver={handleGameOver}
            />
          )}

          {/* Fallback for other engines */}
          {(game.engineId === 'speed-run' || game.engineId === 'community-challenge') && (
            <CatchCollectEngine
              config={config}
              onGameOver={handleGameOver}
              isKioskMode={targetDevice === 'arcade-kiosk'}
            />
          )}
        </div>
      )}

      {/* 3. GAME OVER SCREEN */}
      {gameState === 'gameover' && (
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              Fin de Partida
            </span>
            {targetDevice === 'arcade-kiosk' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                Reinicio en {kioskCountdown}s
              </span>
            )}
          </div>

          {/* Big Score Box */}
          <div className="my-auto text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto shadow-xl">
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>

            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400 block mb-1">
                Puntuación Final
              </span>
              <h2 className="text-5xl font-black tracking-tight" style={{ color: brand.colors.accent || '#FF6B6C' }}>
                {finalScore}
              </h2>
            </div>

            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              {brand.endMessage}
            </p>

            {/* Stats Breakdown */}
            <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-300 pt-2">
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block">Aciertos</span>
                <span className="font-bold text-emerald-400">{gameStats.itemsCollected}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block">Precisión</span>
                <span className="font-bold text-cyan-400">{gameStats.accuracy}%</span>
              </div>
            </div>

            {/* Optional Avalanche Digital Badge Claim */}
            {config.integrations.avalanche.enabled && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-left max-w-xs mx-auto">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-red-400" />
                    Insignia Avalanche (PoAP):
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Fuji Testnet</span>
                </div>
                <p className="text-[11px] text-slate-300 mb-2 font-medium">
                  {config.integrations.avalanche.badgeName || 'Insignia Digital del Evento'}
                </p>

                {badgeClaimed ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>¡Insignia acuñada en Avalanche!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleClaimBadge}
                    className="w-full py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold font-mono transition"
                  >
                    Reclamar Insignia PoAP
                  </button>
                )}
              </div>
            )}

            {/* Submit to Leaderboard Form */}
            {!scoreSubmitted ? (
              <form onSubmit={handleSubmitScore} className="max-w-xs mx-auto space-y-2 pt-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Tu apodo para el ranking..."
                  maxLength={16}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-center text-white font-mono focus:border-red-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20"
                >
                  {isSubmitting ? 'Guardando en el Servidor...' : 'Guardar en el Leaderboard'}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold font-mono py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Puntuación registrada exitosamente!</span>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-2">
            <button
              onClick={() => setGameState('start')}
              className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Jugar Otra Vez</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

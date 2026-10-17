import React, { useState, useEffect, useRef } from 'react';
import { VersionedGameConfig } from '../types/arcade';
import { Zap, Trophy, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

interface ReactionTestEngineProps {
  config: VersionedGameConfig;
  onGameOver: (score: number, stats: { itemsCollected: number; obstaclesHit: number; accuracy: number }) => void;
}

type Stage = 'waiting_to_start' | 'waiting_for_green' | 'ready_to_click' | 'false_start' | 'round_result' | 'finished';

export const ReactionTestEngine: React.FC<ReactionTestEngineProps> = ({ config, onGameOver }) => {
  const [stage, setStage] = useState<Stage>('waiting_to_start');
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 3;
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [lastReaction, setLastReaction] = useState<number | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const { colors } = config.brand;

  const startRound = () => {
    setStage('waiting_for_green');
    const delay = Math.random() * 2500 + 1500; // 1.5s to 4s random delay

    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setStage('ready_to_click');
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClickArena = () => {
    if (stage === 'waiting_to_start') {
      startRound();
    } else if (stage === 'waiting_for_green') {
      // False start!
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStage('false_start');
    } else if (stage === 'ready_to_click') {
      // Successful reaction
      const diff = Math.round(performance.now() - startTimeRef.current);
      setLastReaction(diff);
      const updatedTimes = [...reactionTimes, diff];
      setReactionTimes(updatedTimes);

      if (currentRound < totalRounds) {
        setStage('round_result');
      } else {
        // All rounds complete
        setStage('finished');
        const avgMs = Math.round(updatedTimes.reduce((a, b) => a + b, 0) / updatedTimes.length);
        const finalScore = Math.max(10, Math.round((1000 - avgMs) * 1.5));
        onGameOver(finalScore, {
          itemsCollected: totalRounds,
          obstaclesHit: 0,
          accuracy: avgMs < 300 ? 98 : avgMs < 450 ? 85 : 70,
        });
      }
    } else if (stage === 'false_start' || stage === 'round_result') {
      if (stage === 'round_result') {
        setCurrentRound((prev) => prev + 1);
      }
      startRound();
    }
  };

  return (
    <div
      onClick={handleClickArena}
      className={`relative w-full h-full flex flex-col justify-between p-6 select-none cursor-pointer transition-colors duration-200 ${
        stage === 'waiting_for_green'
          ? 'bg-rose-950/80 text-rose-200'
          : stage === 'ready_to_click'
          ? 'bg-emerald-600 text-white animate-pulse'
          : stage === 'false_start'
          ? 'bg-amber-950/90 text-amber-200'
          : 'bg-[#0B0E14] text-white'
      }`}
    >
      {/* HUD Header */}
      <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-bold">
            Ronda {Math.min(currentRound, totalRounds)} de {totalRounds}
          </span>
        </div>

        {reactionTimes.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <span>Último:</span>
            <span className="font-bold text-white">{reactionTimes[reactionTimes.length - 1]}ms</span>
          </div>
        )}
      </div>

      {/* Main Signal Display */}
      <div className="my-auto text-center py-8">
        {stage === 'waiting_to_start' && (
          <div className="space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto shadow-2xl">
              <Zap className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-white">Prueba de Reflejos</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Cuando la pantalla cambie de color a <span className="text-emerald-400 font-bold">VERDE</span>, pulsa lo más rápido posible.
            </p>
            <div className="pt-2">
              <span className="inline-block px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-600/30">
                Toca la pantalla para comenzar
              </span>
            </div>
          </div>
        )}

        {stage === 'waiting_for_green' && (
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-400 animate-ping mx-auto" />
            <h3 className="text-3xl font-black text-rose-300">¡ESPERA!</h3>
            <p className="text-xs text-rose-200/80 font-mono">No toques todavía...</p>
          </div>
        )}

        {stage === 'ready_to_click' && (
          <div className="space-y-2">
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              ¡PULSA YA!
            </h2>
            <p className="text-sm font-bold text-white/90">¡TOCA LA PANTALLA!</p>
          </div>
        )}

        {stage === 'false_start' && (
          <div className="space-y-3">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-2xl font-black text-white">¡Demasiado pronto!</h3>
            <p className="text-xs text-amber-200/90">
              Pulsaste antes de que la pantalla cambiara a verde.
            </p>
            <span className="inline-block text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-black/40">
              Toca para reintentar la ronda
            </span>
          </div>
        )}

        {stage === 'round_result' && (
          <div className="space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-4xl font-black text-white">{lastReaction} ms</h3>
            <p className="text-xs text-slate-300">
              {lastReaction && lastReaction < 230
                ? '⚡ ¡Velocidad sobrehumana! Reflejos de nivel profesional.'
                : lastReaction && lastReaction < 320
                ? '👍 ¡Excelente tiempo de reacción!'
                : '👌 Buen intento. ¡Puedes mejorar en la siguiente!'}
            </p>
            <span className="inline-block text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-red-600">
              Toca para la siguiente ronda ({currentRound + 1}/{totalRounds})
            </span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] text-white/60 font-mono border-t border-white/10 pt-3">
        Engine 04 — Reaction Test · Optimizado para sub-second precision
      </div>
    </div>
  );
};

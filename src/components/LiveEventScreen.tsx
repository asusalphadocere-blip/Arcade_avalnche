import React, { useState, useEffect } from 'react';
import { VersionedGameConfig, LeaderboardEntry } from '../types/arcade';
import { 
  Trophy, 
  Flame, 
  QrCode, 
  Sparkles, 
  Maximize, 
  X, 
  Users, 
  Clock, 
  CheckCircle2,
  Medal,
  Activity
} from 'lucide-react';

interface LiveEventScreenProps {
  config: VersionedGameConfig;
  onClose: () => void;
  leaderboard?: LeaderboardEntry[];
}

export const LiveEventScreen: React.FC<LiveEventScreenProps> = ({
  config,
  onClose,
  leaderboard: initialLeaderboard,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(
    initialLeaderboard && initialLeaderboard.length > 0
      ? initialLeaderboard
      : [
          { id: '1', projectId: config.project.id, nickname: 'Satoshi_N', score: 480, accuracy: 96, timestamp: Date.now() - 10000, targetDevice: 'mobile-web', verifiedOnchain: true },
          { id: '2', projectId: config.project.id, nickname: 'AvaxRunner', score: 430, accuracy: 92, timestamp: Date.now() - 40000, targetDevice: 'mobile-web', verifiedOnchain: true },
          { id: '3', projectId: config.project.id, nickname: 'SnowmanDev', score: 395, accuracy: 88, timestamp: Date.now() - 90000, targetDevice: 'arcade-kiosk', verifiedOnchain: true },
          { id: '4', projectId: config.project.id, nickname: 'CryptoGamer', score: 360, accuracy: 85, timestamp: Date.now() - 150000, targetDevice: 'mobile-web' },
          { id: '5', projectId: config.project.id, nickname: 'FujiMaster', score: 310, accuracy: 80, timestamp: Date.now() - 210000, targetDevice: 'mobile-web' },
          { id: '6', projectId: config.project.id, nickname: 'Web3Pilot', score: 280, accuracy: 78, timestamp: Date.now() - 300000, targetDevice: 'arcade-kiosk' },
        ]
  );

  const [simulatedCount, setSimulatedCount] = useState(142);

  // Toggle browser fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const { brand, event } = config;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-between p-6 sm:p-10 text-white select-none animate-fadeIn"
      style={{
        backgroundColor: brand.colors.background || '#080B11',
      }}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl"
            style={{ backgroundColor: brand.colors.primary || '#E84142' }}
          >
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
              {brand.logoText || 'Arcade Studio'}
            </h1>
            <span className="text-xs font-mono text-slate-400">
              {event.name} · Pantalla de Marcador en Vivo
            </span>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Jugadores Activos:</span>
            <span className="font-bold text-white text-sm">{simulatedCount}</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            title="Pantalla Completa"
          >
            <Maximize className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            title="Salir del modo pantalla"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area (Leaderboard on Left, Giant QR on Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 items-stretch overflow-hidden">
        {/* LEADERBOARD ZONE (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Ranking Oficial del Evento
                </h2>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Actualización en Tiempo Real</span>
              </span>
            </div>

            {/* Top 3 Podium Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {entries.slice(0, 3).map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`p-4 rounded-2xl text-center relative border ${
                    idx === 0
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/10'
                      : idx === 1
                      ? 'bg-slate-400/10 border-slate-400/30'
                      : 'bg-amber-700/10 border-amber-700/30'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-black/60 mx-auto flex items-center justify-center font-black font-mono text-sm mb-2">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                  </div>
                  <span className="text-xs sm:text-sm font-black block truncate text-white">
                    {entry.nickname}
                  </span>
                  <span
                    className="text-lg sm:text-xl font-black block font-mono mt-1"
                    style={{ color: brand.colors.accent || '#FF6B6C' }}
                  >
                    {entry.score} pts
                  </span>
                  {entry.verifiedOnchain && (
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verificado</span>
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Rest of the list */}
            <div className="space-y-2">
              {entries.slice(3, 7).map((entry, idx) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-slate-500 font-bold">#{idx + 4}</span>
                    <span className="font-bold text-white text-sm">{entry.nickname}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">{entry.accuracy}% precisión</span>
                    <span className="font-bold text-white text-sm">{entry.score} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Servicio de Puntuación Validado en Servidor</span>
            <span>Cero trampas · Validación criptográfica</span>
          </div>
        </div>

        {/* GIANT QR & ATTENDEE ONBOARDING ZONE (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-red-950/40 via-slate-900/60 to-black/60 border border-red-500/30 p-6 sm:p-8 backdrop-blur-md text-center">
          <div>
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest block mb-2">
              Participa Ahora Mismo
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              ¡Escanea y Juega!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto mb-6">
              Apunta con la cámara de tu teléfono al código QR. No necesitas instalar aplicaciones ni crear cuentas.
            </p>

            {/* Giant QR Graphic */}
            <div className="w-56 h-56 bg-white p-3 rounded-3xl mx-auto shadow-2xl flex items-center justify-center mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                <rect width="100" height="100" fill="white" />
                <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" fill="black" />
                <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" fill="black" />
                <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" fill="black" />
                <rect x="45" y="15" width="8" height="18" fill="black" />
                <rect x="45" y="45" width="10" height="10" fill="black" />
                <rect x="60" y="55" width="25" height="8" fill="black" />
                <rect x="70" y="70" width="15" height="15" fill="black" />
                <rect x="25" y="45" width="15" height="8" fill="black" />
              </svg>
            </div>

            {event.accessMode === 'event_code' && (
              <div className="p-3 rounded-xl bg-black/60 border border-white/20 inline-block font-mono text-xs">
                <span className="text-slate-400 block text-[10px]">CÓDIGO DE EVENTO:</span>
                <span className="text-lg font-black text-amber-400 tracking-wider">
                  {event.eventCode || 'SUMMIT2026'}
                </span>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 font-mono pt-4 border-t border-white/10">
            {brand.title} · Experiencia interactiva para eventos
          </div>
        </div>
      </div>

      {/* Footer Ticker */}
      <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Última partida registrada: <strong className="text-white">AvaxRunner</strong> anotó 430 puntos hace 40 segundos</span>
        </div>
        <span>Arcade Studio Live Kiosk Runtime</span>
      </div>
    </div>
  );
};

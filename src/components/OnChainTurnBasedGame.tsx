import React, { useState, useEffect, useRef } from 'react';
import { VersionedGameConfig, AttendeeRecord } from '../types/arcade';
import { 
  Flame, 
  Swords, 
  Shield, 
  Zap, 
  Heart, 
  Clock, 
  CheckCircle2, 
  Users, 
  ExternalLink, 
  RefreshCw, 
  Sparkles, 
  Award, 
  Smartphone, 
  Tv, 
  Play, 
  HelpCircle, 
  Grid3X3,
  Volume2,
  VolumeX,
  Target
} from 'lucide-react';
import { 
  PixelArtBoss, 
  PixelArtWarrior, 
  PixelArtMage, 
  PixelArtGuardian, 
  PixelArtAvaxGem 
} from './PixelArtSprites';

interface OnChainTurnBasedGameProps {
  config: VersionedGameConfig;
  attendees: AttendeeRecord[];
  onOpenPoapClaim?: () => void;
}

interface ActionLog {
  id: string;
  blockNumber: number;
  txHash: string;
  player: string;
  actionName: string;
  damage: number;
  type: 'attack' | 'combo' | 'shield' | 'heal';
  latencyMs: number;
  timestamp: number;
}

export const OnChainTurnBasedGame: React.FC<OnChainTurnBasedGameProps> = ({
  config,
  attendees,
  onOpenPoapClaim,
}) => {
  const [gameMode, setGameMode] = useState<'boss_raid' | 'trivia_royale' | 'grid_conquest'>('boss_raid');

  // Boss Raid State
  const maxBossHp = 3000;
  const [bossHp, setBossHp] = useState<number>(2150);
  const [selectedPlayerName, setSelectedPlayerName] = useState<string>(
    attendees[0]?.name || 'Tomás Valenzuela'
  );
  const [isExecutingTurn, setIsExecutingTurn] = useState(false);
  const [lastActionFeedback, setLastActionFeedback] = useState<string | null>(null);
  const [damagePopups, setDamagePopups] = useState<{ id: string; text: string; x: number; y: number }[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([
    {
      id: 'log-1',
      blockNumber: 3819201,
      txHash: '0x8f2a1b948721c0e928f491823719284719283749102938471029384719203948',
      player: 'Catalina Sepúlveda',
      actionName: 'Ataque Rápido AVAX',
      damage: 120,
      type: 'attack',
      latencyMs: 640,
      timestamp: Date.now() - 45000,
    },
    {
      id: 'log-2',
      blockNumber: 3819202,
      txHash: '0x3c91a0b3297a8e74921bdfa891024838193850124819481928374910293847',
      player: 'Felipe Araya',
      actionName: 'Teleporter Combo',
      damage: 280,
      type: 'combo',
      latencyMs: 720,
      timestamp: Date.now() - 25000,
    },
    {
      id: 'log-3',
      blockNumber: 3819203,
      txHash: '0x1e8471928374910293847102938471920394818f2a1b948721c0e928f491823',
      player: 'Constanza Rivas',
      actionName: 'Escudo de Subnet',
      damage: 0,
      type: 'shield',
      latencyMs: 580,
      timestamp: Date.now() - 10000,
    },
  ]);

  // Trivia Royale State
  const [triviaRound, setTriviaRound] = useState(1);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState<number | null>(null);
  const [triviaSubmitted, setTriviaSubmitted] = useState(false);

  // Grid Conquest State
  const [gridCells, setGridCells] = useState<string[]>([
    'Red AVAX', 'Stand Sponsors', 'Vacante', 'Comunidad UDP',
    'Vacante', 'Red AVAX', 'ChileDAO', 'Vacante',
    'Dev3pack', 'Vacante', 'Red AVAX', 'Stand Sponsors',
    'Vacante', 'ChileDAO', 'Vacante', 'Dev3pack'
  ]);

  // Audio effects synthesizer
  const playSound = (frequency: number, type: OscillatorType = 'sine', duration: number = 0.15) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  // Execute on-chain turn
  const handleExecuteTurn = async (
    actionName: string,
    damageAmount: number,
    actionType: 'attack' | 'combo' | 'shield' | 'heal'
  ) => {
    if (isExecutingTurn) return;
    setIsExecutingTurn(true);

    playSound(actionType === 'combo' ? 520 : actionType === 'heal' ? 660 : 440, 'sawtooth', 0.2);

    // Simulate sub-second finality on Avalanche Fuji
    const latency = Math.floor(550 + Math.random() * 220); // 550ms - 770ms (< 800ms)

    await new Promise((r) => setTimeout(r, latency));

    const newBlock = 3819204 + actionLogs.length;
    const txSalt = `${Date.now()}-${selectedPlayerName}`;
    let hashBuf = 0;
    for (let i = 0; i < txSalt.length; i++) hashBuf = ((hashBuf << 5) - hashBuf) + txSalt.charCodeAt(i);
    const txHash = `0x${Math.abs(hashBuf).toString(16).padStart(16, '0')}7c8f391a0b3297a8e74921bdfa89102483819385012`.slice(0, 66);

    // Update Boss HP
    setBossHp((prev) => Math.max(0, prev - damageAmount));

    // Add Popup
    const popupId = `pop-${Date.now()}`;
    const popupText = actionType === 'shield' ? '🛡️ ESCUDO ACTIVO' : actionType === 'heal' ? '❤️ +150 HP' : `-${damageAmount} HP!`;
    setDamagePopups((prev) => [...prev, { id: popupId, text: popupText, x: 50 + (Math.random() * 20 - 10), y: 40 + (Math.random() * 20 - 10) }]);
    setTimeout(() => {
      setDamagePopups((prev) => prev.filter((p) => p.id !== popupId));
    }, 1500);

    // Add Action Log
    const newLog: ActionLog = {
      id: `log-${Date.now()}`,
      blockNumber: newBlock,
      txHash,
      player: selectedPlayerName,
      actionName,
      damage: damageAmount,
      type: actionType,
      latencyMs: latency,
      timestamp: Date.now(),
    };

    setActionLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    setLastActionFeedback(`¡Turno confirmado on-chain en ${latency}ms! Transacción minada en Avalanche Fuji.`);
    setIsExecutingTurn(false);

    if (actionType === 'combo' || actionType === 'attack') {
      playSound(320, 'square', 0.25);
    }
  };

  const handleResetBoss = () => {
    setBossHp(maxBossHp);
    setLastActionFeedback('Boss reiniciado para la siguiente ronda del evento.');
  };

  const bossHpPercent = Math.round((bossHp / maxBossHp) * 100);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/80 via-slate-900 to-[#0e121a] border-2 border-red-500/40 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1.5">
              <Flame className="w-4 h-4 text-red-500" />
              <span>Avalanche Real-Time Gaming Engine · State Engine On-Chain</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span>Mini Juegos por Turnos Multijugador On-Chain</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-600 text-white font-mono font-bold">
                Latencia &lt;800ms
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              La blockchain como <strong>Motor de Estado en Tiempo Real</strong>. Cada turno ejecutado en el teléfono
              del asistente se valida en Avalanche y se proyecta al instante en la pantalla gigante del escenario,
              creando <em>Spectator Hype</em> colectivo sin esperas de 15 segundos ni costos de gas.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 p-2 rounded-2xl shrink-0">
            <span className="text-[11px] font-mono text-slate-400 pl-1">Evento:</span>
            <span className="text-xs font-mono font-bold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
              {config.project.name}
            </span>
          </div>
        </div>

        {/* Engine Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            onClick={() => setGameMode('boss_raid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              gameMode === 'boss_raid'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>1. Boss Raid Comunal (Cooperativo en Vivo)</span>
          </button>

          <button
            onClick={() => setGameMode('trivia_royale')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              gameMode === 'trivia_royale'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>2. Trivial / Battle Royale por Turnos</span>
          </button>

          <button
            onClick={() => setGameMode('grid_conquest')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              gameMode === 'grid_conquest'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>3. Grid Strategy (Conquista de Casillas)</span>
          </button>
        </div>
      </div>

      {/* MODE 1: BOSS RAID COMUNAL */}
      {gameMode === 'boss_raid' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Escenario Gigante (Spectator Hype) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/90 border-2 border-red-500/30 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header of the Stage Screen */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Pantalla Gigante del Escenario (Proyección en Vivo)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    Avalanche Fuji State Sync
                  </span>
                </div>
              </div>

              {/* Boss Visual Entity */}
              <div className="py-6 flex flex-col items-center justify-center text-center relative min-h-[220px]">
                {/* Damage Popups */}
                {damagePopups.map((pop) => (
                  <div
                    key={pop.id}
                    className="absolute text-xl sm:text-2xl font-black text-amber-400 font-mono animate-bounce drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] pointer-events-none z-20"
                    style={{ top: `${pop.y}%`, left: `${pop.x}%` }}
                  >
                    {pop.text}
                  </div>
                ))}

                <div className="relative group">
                  {/* Retro 8-bit Pixel Arena Frame */}
                  <div className={`p-4 rounded-3xl transition-all duration-300 relative border-2 ${
                    bossHp <= 0 
                      ? 'bg-slate-950 border-slate-800' 
                      : isExecutingTurn
                      ? 'bg-red-950/40 border-amber-500 shadow-2xl shadow-red-600/40 scale-105'
                      : 'bg-slate-950/80 border-red-500/50 shadow-2xl shadow-red-600/20'
                  }`}>
                    {/* Pixel Art Avalanche Boss Entity */}
                    <div className="flex flex-col items-center justify-center">
                      <PixelArtBoss 
                        isHit={isExecutingTurn} 
                        isDefeated={bossHp <= 0} 
                        className="w-36 h-36 sm:w-44 sm:h-44" 
                      />
                      <div className="mt-2 flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 rounded-xl border border-red-500/30">
                        <PixelArtAvaxGem className="w-4 h-4" />
                        <span className="text-xs font-black uppercase text-white font-mono tracking-wider">
                          GÓLEM DE LA RED (BOSS PIXEL ART)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-red-400 mt-0.5">
                        {bossHp > 0 ? '⚡ Debilidad: Ataques Turno a Turno en Avalanche' : '☠ Derrotado por el Consenso'}
                      </span>
                    </div>
                  </div>

                  {bossHp <= 0 && (
                    <div className="absolute inset-0 bg-black/85 rounded-3xl flex flex-col items-center justify-center p-3 text-center animate-fadeIn border-2 border-emerald-500">
                      <Award className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
                      <span className="text-base font-black text-white font-mono">¡BOSS DERROTADO ON-CHAIN!</span>
                      <span className="text-xs text-emerald-400 font-mono mt-1">Recompensas y Badges Fuji Desbloqueados</span>
                    </div>
                  )}
                </div>

                {/* HP Bar */}
                <div className="w-full max-w-md mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Salud Comunal del Boss:</span>
                    <span className="font-bold text-white">
                      {bossHp} / {maxBossHp} HP ({bossHpPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-4 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        bossHpPercent > 50
                          ? 'bg-gradient-to-r from-red-600 to-amber-500'
                          : bossHpPercent > 20
                          ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                          : 'bg-red-600 animate-pulse'
                      }`}
                      style={{ width: `${bossHpPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* On-Chain Sub-Second Activity Feed */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Transacciones en Vivo (&lt;800ms Finality):</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Gas: 100% Patrocinado</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {actionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                          log.type === 'combo' ? 'bg-amber-500/20 text-amber-400' :
                          log.type === 'shield' ? 'bg-cyan-500/20 text-cyan-400' :
                          log.type === 'heal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-600/20 text-red-400'
                        }`}>
                          {log.type === 'combo' ? '⚡' : log.type === 'shield' ? '🛡️' : log.type === 'heal' ? '❤️' : '⚔️'}
                        </div>
                        <div>
                          <div className="text-white font-bold flex items-center gap-1.5">
                            <span>@{log.player}</span>
                            <span className="text-slate-400 text-[10px]">usó</span>
                            <span className="text-red-400">{log.actionName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[220px]">
                            Tx: {log.txHash.slice(0, 14)}...{log.txHash.slice(-8)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-amber-400">
                          {log.damage > 0 ? `-${log.damage} HP` : log.type === 'heal' ? '+150 HP' : 'DEF +80'}
                        </div>
                        <div className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{log.latencyMs}ms</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Controlador Móvil del Asistente */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Controlador Móvil del Asistente (Vía QR)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800">
                  ERC-4337 Smart Account
                </span>
              </div>

              {/* Player Selector */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Jugador Activo en el Móvil:
                </label>
                <div className="relative">
                  <select
                    value={selectedPlayerName}
                    onChange={(e) => setSelectedPlayerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {attendees.map((att) => (
                      <option key={att.id} value={att.name}>
                        {att.name} ({att.email})
                      </option>
                    ))}
                    <option value="Asistente VIP">Asistente VIP (Demo)</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  El jugador no requiere descargar billetera ni pagar gas. Todo patrocinado en Avalanche Fuji.
                </p>
              </div>

              {/* Turn Action Buttons */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-mono font-bold text-slate-300 uppercase block">
                  Elige tu jugada para este turno:
                </span>

                <button
                  type="button"
                  onClick={() => handleExecuteTurn('Ataque Rápido AVAX', 120, 'attack')}
                  disabled={isExecutingTurn || bossHp <= 0}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-red-600/90 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-bold transition flex items-center justify-between shadow-lg shadow-red-600/20 cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="w-9 h-9 rounded-xl bg-black/40 flex items-center justify-center p-1 border border-white/10">
                      <PixelArtWarrior className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="font-black">Ataque Rápido AVAX</div>
                      <div className="text-[10px] text-white/80">Causa 120 DMG · Latencia ~640ms</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-black/30 px-2 py-1 rounded-lg">Turno Normal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExecuteTurn('Teleporter Combo', 280, 'combo')}
                  disabled={isExecutingTurn || bossHp <= 0}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-600/90 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono text-xs font-bold transition flex items-center justify-between shadow-lg shadow-amber-600/20 cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="w-9 h-9 rounded-xl bg-black/40 flex items-center justify-center p-1 border border-white/10">
                      <PixelArtMage className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="font-black">Teleporter Combo</div>
                      <div className="text-[10px] text-white/80">Causa 280 DMG · Latencia ~720ms</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-black/30 px-2 py-1 rounded-lg">Ataque Crítico</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleExecuteTurn('Escudo de Subnet', 0, 'shield')}
                    disabled={isExecutingTurn || bossHp <= 0}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-white font-mono text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <PixelArtGuardian className="w-6 h-6" />
                    <span>Escudo Subnet</span>
                    <span className="text-[9px] text-slate-400">+80 Def Comunal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecuteTurn('Curación Comunal', 0, 'heal')}
                    disabled={isExecutingTurn || bossHp <= 0}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-white font-mono text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <span className="text-base">❤️</span>
                    <span>Curación</span>
                    <span className="text-[9px] text-slate-400">+150 HP Grupo</span>
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {isExecutingTurn ? (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-center gap-2 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Procesando turno on-chain en Avalanche Fuji (&lt;800ms)...</span>
                </div>
              ) : lastActionFeedback ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{lastActionFeedback}</span>
                </div>
              ) : null}

              {/* Reset Boss Option */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetBoss}
                  className="text-xs font-mono text-slate-400 hover:text-white underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reiniciar HP del Boss</span>
                </button>

                {onOpenPoapClaim && (
                  <button
                    type="button"
                    onClick={onOpenPoapClaim}
                    className="text-xs font-mono text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Reclamar PoAP del Raid</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: TRIVIAL BATTLE ROYALE POR TURNOS */}
      {gameMode === 'trivia_royale' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block mb-1">
                Engine 07 · Trivial / Battle Royale por Turnos On-Chain
              </span>
              <h3 className="text-xl font-bold text-white">Ronda #{triviaRound}: Consenso Simultáneo</h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-800">
              Commit-Reveal en Bloque
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Todos los asistentes en la sala envían su respuesta codificada on-chain. Cuando se cierra el bloque (&lt;800ms),
            la red revela las respuestas correctas, elimina a los que fallaron y actualiza el podio de supervivientes en vivo.
          </p>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white font-mono">
              ¿Cuál es la finalidad de consenso típica en la red Avalanche?
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {[
                '15 a 30 segundos (Prueba de Trabajo)',
                'Menor a 800 milisegundos (Sub-segundo)',
                '10 a 15 minutos (Bloques tradicionales)',
                'Depende del gas pagado por el usuario',
              ].map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedTriviaOption(idx);
                    setTriviaSubmitted(true);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                    selectedTriviaOption === idx
                      ? idx === 1
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                        : 'bg-red-950 border-red-500 text-red-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="font-bold text-slate-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {triviaSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center justify-between">
                <span>✓ Respuesta enviada on-chain. ¡Sobreviviste a la Ronda #{triviaRound}!</span>
                <span className="text-[10px] text-slate-400">84 asistentes clasificados</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: GRID STRATEGY (LA CONQUISTA DEL STAND) */}
      {gameMode === 'grid_conquest' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block mb-1">
                Engine 08 · Grid Strategy (La Conquista del Stand)
              </span>
              <h3 className="text-xl font-bold text-white">Tablero de Territorio On-Chain 4x4</h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Control Territorial en Vivo
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Cada asistente o equipo conquista una casilla del tablero durante su turno. Cada movimiento emite
            una transacción con sub-segundo finality, pintando el mapa de stands en la pantalla gigante del evento.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gridCells.map((cell, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const updated = [...gridCells];
                  updated[idx] = selectedPlayerName.split(' ')[0] || 'Mi Marca';
                  setGridCells(updated);
                  playSound(480, 'sine', 0.1);
                }}
                className={`p-4 rounded-2xl border text-center font-mono text-xs transition cursor-pointer flex flex-col items-center justify-center min-h-[90px] ${
                  cell.includes('AVAX') ? 'bg-red-950/60 border-red-500/60 text-red-200' :
                  cell === 'Vacante' ? 'bg-slate-950 border-dashed border-slate-800 text-slate-500 hover:border-slate-600' :
                  'bg-slate-900 border-slate-700 text-white font-bold'
                }`}
              >
                <span className="text-[10px] text-slate-400 mb-1">Casilla #{idx + 1}</span>
                <span className="font-black text-xs">{cell}</span>
                <span className="text-[9px] text-emerald-400 mt-1">
                  {cell !== 'Vacante' ? 'On-Chain' : 'Libre'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WHY THIS WINS THE IDEATHON (POR QUÉ ESTO GANA) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <h4 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>¿Por qué los Juegos por Turnos On-Chain Ganan la Ideatón de Avalanche?</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <strong className="text-white block font-mono">1. Blockchain como State Engine</strong>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              No usamos Avalanche solo para emitir un NFT al final del día. La red opera como el <strong>motor de estado en vivo</strong> de cada turno, ataque y respuesta.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <strong className="text-white block font-mono">2. Confianza y Anti-Trampas</strong>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Nadie puede adulterar los puntajes, el orden de los turnos ni manipular quién eliminó al Boss para quedarse con el premio, gracias al consenso descentralizado.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <strong className="text-white block font-mono">3. Spectator Hype Inmediato</strong>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Convertir las transacciones on-chain en una experiencia visual colectiva hace que el stand o el escenario principal explote de adrenalina en tiempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

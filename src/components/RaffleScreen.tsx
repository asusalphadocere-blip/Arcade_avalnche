import React, { useState, useEffect, useRef } from 'react';
import { AttendeeRecord, RaffleCriteria, RafflePrize, VersionedGameConfig } from '../types/arcade';
import { 
  Trophy, 
  Gift, 
  Sparkles, 
  RotateCcw, 
  Ticket, 
  Users, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Crown, 
  Flame,
  Award,
  Filter,
  Download,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

interface RaffleScreenProps {
  config: VersionedGameConfig;
  attendees: AttendeeRecord[];
  prizes: RafflePrize[];
  projects?: VersionedGameConfig[];
  selectedProjectId?: string;
  onSelectProject?: (id: string) => void;
  onAwardPrize: (prizeId: string, winner: AttendeeRecord) => void;
  onClose?: () => void;
}

export const RaffleScreen: React.FC<RaffleScreenProps> = ({
  config,
  attendees,
  prizes,
  projects = [],
  selectedProjectId,
  onSelectProject,
  onAwardPrize,
  onClose,
}) => {
  const [selectedCriteria, setSelectedCriteria] = useState<RaffleCriteria>('all_attendees');
  const [minScore, setMinScore] = useState(150);
  const [currentPrizeTitle, setCurrentPrizeTitle] = useState(
    prizes.find((p) => !p.winner)?.title || 'Premio Oficial del Evento'
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [rollingAttendee, setRollingAttendee] = useState<AttendeeRecord | null>(null);
  const [winner, setWinner] = useState<AttendeeRecord | null>(null);
  const [hideEmails, setHideEmails] = useState(true);
  const [copiedWinner, setCopiedWinner] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play audio sound effects
  const playTickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // ignore
    }
  };

  const playFanfareSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 0.4);
      });
    } catch (e) {
      // ignore
    }
  };

  // Launch confetti animation
  useEffect(() => {
    if (!winner || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 350;

    const colors = ['#E84142', '#F59E0B', '#10B981', '#38BDF8', '#D946EF', '#FFFFFF'];
    const particles = Array.from({ length: 60 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 12,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
    }));

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          ctx.restore();
        }
      });

      if (particles.some((p) => p.alpha > 0)) {
        animationId = requestAnimationFrame(render);
      }
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [winner]);

  // Filter pool of eligible attendees based on selected criteria
  const getEligiblePool = (): AttendeeRecord[] => {
    switch (selectedCriteria) {
      case 'min_score':
        return attendees.filter((a) => a.hasPlayed && a.bestScore >= minScore);
      case 'top_players':
        return [...attendees].sort((a, b) => b.bestScore - a.bestScore).slice(0, 5);
      case 'weighted_score': {
        const weighted: AttendeeRecord[] = [];
        attendees.forEach((a) => {
          const tickets = 1 + Math.floor((a.bestScore || 0) / 100);
          for (let i = 0; i < tickets; i++) {
            weighted.push(a);
          }
        });
        return weighted;
      }
      case 'all_attendees':
      default:
        return attendees;
    }
  };

  const eligiblePool = getEligiblePool();
  const uniqueEligibleCount = new Set(eligiblePool.map((a) => a.id)).size;

  // Execute drawing animation
  const handleStartDraw = () => {
    if (eligiblePool.length === 0) return;

    setIsDrawing(true);
    setWinner(null);

    let counter = 0;
    const maxSteps = 32;
    const intervalTime = 65;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * eligiblePool.length);
      setRollingAttendee(eligiblePool[randomIndex]);
      playTickSound();
      counter++;

      if (counter >= maxSteps) {
        clearInterval(interval);
        const finalWinner = eligiblePool[Math.floor(Math.random() * eligiblePool.length)];
        setWinner(finalWinner);
        setRollingAttendee(finalWinner);
        setIsDrawing(false);
        playFanfareSound();

        const existingPrize = prizes.find((p) => p.title === currentPrizeTitle && !p.winner);
        if (existingPrize) {
          onAwardPrize(existingPrize.id, finalWinner);
        }
      }
    }, intervalTime);
  };

  const maskEmail = (emailStr: string) => {
    if (!hideEmails) return emailStr;
    const [user, domain] = emailStr.split('@');
    if (!domain) return emailStr;
    const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user}***`;
    return `${maskedUser}@${domain}`;
  };

  const handleCopyWinnerData = () => {
    if (!winner) return;
    const text = `🏆 GANADOR DE SORTEO · ${config.event.name}\nPremio: ${currentPrizeTitle}\nTicket: ${winner.ticketCode}\nNombre: ${winner.name}\nCorreo: ${winner.email}\nPuntaje Arcade: ${winner.bestScore} pts`;
    navigator.clipboard.writeText(text);
    setCopiedWinner(true);
    setTimeout(() => setCopiedWinner(false), 2000);
  };

  const handleDownloadRaffleAct = () => {
    const actData = {
      event: {
        id: config.project.id,
        name: config.event.name,
        lumaUrl: config.event.lumaUrl,
        date: new Date().toISOString(),
      },
      currentDraw: {
        prize: currentPrizeTitle,
        criteria: selectedCriteria,
        winner: winner
          ? {
              ticketCode: winner.ticketCode,
              ticketNumber: winner.ticketNumber,
              name: winner.name,
              email: winner.email,
              score: winner.bestScore,
            }
          : null,
      },
      allPrizes: prizes,
    };

    const blob = new Blob([JSON.stringify(actData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.deployment.slug || 'evento'}-acta-sorteo.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* 3 LUMA EVENTS QUICK SWITCHER STRIP */}
      {projects.length > 0 && onSelectProject && (
        <div className="p-4 rounded-3xl bg-[#0D1119] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Eventos Configurados para Sorteos (Luma)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Selecciona el evento donde vas a realizar la tómbola
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {projects.map((proj) => {
              const isSelected = proj.project.id === selectedProjectId;
              return (
                <button
                  key={proj.project.id}
                  onClick={() => onSelectProject(proj.project.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all flex flex-col justify-between border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border-amber-500 ring-2 ring-amber-500/20 shadow-lg'
                      : 'bg-slate-900/60 hover:bg-slate-850/80 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-white flex items-center gap-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: proj.brand.colors.primary }}
                        />
                        {proj.game.engineId}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-black">
                          SORTEO ACTIVO
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{proj.event.name}</h4>
                  </div>

                  {proj.event.lumaUrl && (
                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-amber-400">
                      <span className="truncate">{proj.event.lumaUrl.replace('https://', '')}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0 ml-1" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Tómbola & Sorteo en Vivo para Eventos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Sorteo Digital de Ganadores del Evento
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-300 font-medium">
              Evento activo: <strong className="text-white">{config.event.name}</strong>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Proyecta esta pantalla en el escenario para sortear premios entre los asistentes que llegaron con su ticket, o premia a quienes lograron altos puntajes en el arcade.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setHideEmails(!hideEmails)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-700 text-xs font-mono hover:text-white transition"
          >
            {hideEmails ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span>{hideEmails ? 'Correos Ocultos (Privacidad)' : 'Mostrar Correos'}</span>
          </button>

          <button
            onClick={handleDownloadRaffleAct}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-700 text-xs font-mono hover:text-white transition"
            title="Descargar acta del sorteo en JSON"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Acta en JSON</span>
          </button>
        </div>
      </div>

      {/* Main Sorteo Area: Config on Left, Digital Drum / Winner on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* CONFIGURATION & CRITERIA (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#11151F] border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                1. Selecciona el Premio a Sortear:
              </label>
              <input
                type="text"
                value={currentPrizeTitle}
                onChange={(e) => setCurrentPrizeTitle(e.target.value)}
                placeholder="Ej. Beca Hackathon + Merch Web3"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold focus:border-amber-500 outline-none"
              />
            </div>

            {/* Criteria Selector */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                2. Criterio de Elegibilidad para el Sorteo:
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedCriteria('all_attendees')}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                    selectedCriteria === 'all_attendees'
                      ? 'border-amber-500 bg-amber-950/40 text-white ring-1 ring-amber-500/40'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <strong className="block text-white">Todos los Asistentes (Check-in Verificado)</strong>
                  <span className="text-[11px] text-slate-400">
                    Cualquiera que llegó al evento y recibió su número de ticket participa por igual.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCriteria('min_score')}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                    selectedCriteria === 'min_score'
                      ? 'border-amber-500 bg-amber-950/40 text-white ring-1 ring-amber-500/40'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <strong className="block text-white">Por Puntuación Mínima en el Arcade</strong>
                  <span className="text-[11px] text-slate-400">
                    Solo asistentes que jugaron y lograron al menos {minScore} puntos.
                  </span>
                </button>

                {selectedCriteria === 'min_score' && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Puntuación Requerida:</span>
                    <input
                      type="number"
                      value={minScore}
                      onChange={(e) => setMinScore(Number(e.target.value))}
                      className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono text-center"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedCriteria('top_players')}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                    selectedCriteria === 'top_players'
                      ? 'border-amber-500 bg-amber-950/40 text-white ring-1 ring-amber-500/40'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <strong className="block text-white">Top 5 del Leaderboard</strong>
                  <span className="text-[11px] text-slate-400">
                    Sorteo exclusivo entre los 5 mejores jugadores del ranking del evento.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCriteria('weighted_score')}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                    selectedCriteria === 'weighted_score'
                      ? 'border-amber-500 bg-amber-950/40 text-white ring-1 ring-amber-500/40'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <strong className="block text-white">Boletos Ponderados por Desempeño</strong>
                  <span className="text-[11px] text-slate-400">
                    1 boleto base + 1 boleto extra por cada 100 puntos en el juego.
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Eligible Pool Stats */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Participantes Elegibles:</span>
            <span className="font-bold text-amber-400 text-sm">
              {uniqueEligibleCount} asistentes ({eligiblePool.length} boletos)
            </span>
          </div>
        </div>

        {/* DIGITAL DRUM / TOMBOLA STAGE (7 Cols) */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-gradient-to-br from-[#121622] via-[#0D1017] to-black border-2 border-amber-500/40 shadow-2xl flex flex-col justify-between text-center relative overflow-hidden min-h-[420px]">
          {/* Confetti canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-10 w-full h-full"
          />

          {/* Ambient Amber Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Marquee */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono relative z-20">
            <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sorteo Oficial · {config.event.name.split('·')[0]}</span>
            </span>
            <span className="text-slate-400">
              Premio: <strong className="text-white">{currentPrizeTitle}</strong>
            </span>
          </div>

          {/* Center Stage: Rolling Animation or Winner Display */}
          <div className="my-auto py-8 space-y-4 relative z-20">
            {!winner && !isDrawing && (
              <div className="space-y-4">
                <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center mx-auto shadow-2xl">
                  <Gift className="w-12 h-12 text-amber-400 animate-pulse" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Tómbola Digital Lista
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Hay <strong className="text-amber-300">{uniqueEligibleCount} asistentes</strong> calificados para este sorteo según el criterio seleccionado.
                </p>
              </div>
            )}

            {isDrawing && rollingAttendee && (
              <div className="space-y-4 animate-pulse">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block">
                  ¡Girando la Tómbola!
                </span>
                <div className="inline-block p-6 rounded-3xl bg-black/80 border-2 border-amber-400 shadow-2xl shadow-amber-500/20">
                  <span className="text-5xl sm:text-6xl font-black font-mono text-amber-300 block">
                    {rollingAttendee.ticketCode}
                  </span>
                  <span className="text-lg font-bold text-white block mt-1">
                    {rollingAttendee.name}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">Seleccionando al azar...</p>
              </div>
            )}

            {winner && !isDrawing && (
              <div className="space-y-4 animate-fadeIn">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>¡TENEMOS UN GANADOR!</span>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-black border-2 border-amber-400 shadow-2xl shadow-amber-500/30 max-w-md mx-auto">
                  <span className="text-xs uppercase font-mono tracking-widest text-slate-400 block mb-1">
                    Ticket Ganador
                  </span>
                  <div className="text-5xl sm:text-6xl font-black text-amber-300 font-mono mb-2">
                    {winner.ticketCode}
                  </div>
                  <h4 className="text-2xl font-black text-white">{winner.name}</h4>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">{maskEmail(winner.email)}</p>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Puntuación Arcade:</span>
                    <strong className="text-emerald-400">{winner.bestScore} pts</strong>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleCopyWinnerData}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono hover:text-white transition"
                  >
                    {copiedWinner ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedWinner ? '¡Copiado!' : 'Copiar Ganador'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Premio asignado: <strong className="text-amber-300">{currentPrizeTitle}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-3 relative z-20">
            <button
              onClick={handleStartDraw}
              disabled={isDrawing || eligiblePool.length === 0}
              className="w-full max-w-sm py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-red-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-40"
            >
              {isDrawing ? 'Sorteando...' : winner ? 'Sortear Siguiente Premio' : '¡Iniciar Sorteo en Vivo!'}
            </button>
          </div>
        </div>
      </div>

      {/* History of Prizes Awarded in this Event */}
      <div className="p-6 rounded-3xl bg-[#11151F] border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Historial de Premios Sorteados en {config.event.name}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {prizes.map((prz) => (
            <div
              key={prz.id}
              className={`p-4 rounded-2xl border ${
                prz.winner
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/40 text-slate-400">
                  {prz.criteria === 'all_attendees' ? 'Todos los asistentes' : prz.criteria}
                </span>
                {prz.winner && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Entregado</span>
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white mb-2">{prz.title}</h4>

              {prz.winner ? (
                <div className="p-2 rounded-xl bg-black/50 text-[11px] font-mono text-amber-300">
                  <div>Ganador: <strong>{prz.winner.name}</strong></div>
                  <div className="text-[10px] text-slate-400">Ticket: {prz.winner.ticketCode}</div>
                </div>
              ) : (
                <span className="text-[11px] text-slate-500 italic font-mono">Pendiente de sorteo</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

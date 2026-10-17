import React, { useState } from 'react';
import { AttendeeRecord, VersionedGameConfig } from '../types/arcade';
import { 
  UserCheck, 
  Ticket, 
  Search, 
  Plus, 
  Mail, 
  User, 
  Clock, 
  CheckCircle2, 
  Gamepad2, 
  Sparkles, 
  Download, 
  FileSpreadsheet,
  QrCode,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  ExternalLink,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { githubService } from '../lib/github/githubService';

interface CheckInModuleProps {
  config: VersionedGameConfig;
  attendees: AttendeeRecord[];
  projects?: VersionedGameConfig[];
  selectedProjectId?: string;
  onSelectProject?: (id: string) => void;
  onAddAttendee: (attendee: AttendeeRecord) => void;
  onResetAttendees?: () => void;
  onRestoreAttendees?: () => void;
  onLaunchGameForAttendee?: (attendee: AttendeeRecord) => void;
}

export const CheckInModule: React.FC<CheckInModuleProps> = ({
  config,
  attendees,
  projects = [],
  selectedProjectId,
  onSelectProject,
  onAddAttendee,
  onResetAttendees,
  onRestoreAttendees,
  onLaunchGameForAttendee,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [customTicketNumber, setCustomTicketNumber] = useState<string>('');
  const [useCustomTicket, setUseCustomTicket] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRegistered, setLastRegistered] = useState<AttendeeRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Autofill with connected GitHub profile
  const handleAutofillFromGithub = async () => {
    let user = githubService.getLocalUser();
    if (!user) {
      try {
        user = await githubService.demoLogin('alphadocere');
      } catch {
        // fallback
      }
    }
    if (user) {
      setName(`${user.name} (@${user.login})`);
      if (user.email) setEmail(user.email);
      playSuccessSound();
    }
  };

  // Play a pleasant Web Audio confirmation chime
  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // AudioContext might be blocked until user gesture, ignore
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    let targetTicketNumber: number;
    if (useCustomTicket && customTicketNumber.trim() && !isNaN(Number(customTicketNumber))) {
      targetTicketNumber = Number(customTicketNumber);
    } else {
      targetTicketNumber = attendees.length > 0
        ? Math.max(...attendees.map((a) => a.ticketNumber)) + 1
        : 1;
    }

    const paddedNumber = String(targetTicketNumber).padStart(3, '0');
    const newAttendee: AttendeeRecord = {
      id: `att-${Date.now()}`,
      ticketNumber: targetTicketNumber,
      ticketCode: `TICK-${paddedNumber}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      checkInTime: new Date().toISOString(),
      hasPlayed: false,
      bestScore: 0,
      attemptsCount: 0,
      wonPrizes: [],
    };

    onAddAttendee(newAttendee);
    setLastRegistered(newAttendee);
    setName('');
    setEmail('');
    setCustomTicketNumber('');
    setUseCustomTicket(false);
    playSuccessSound();
  };

  const handleBulkImport = () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput.split('\n');
    let currentNumber = attendees.length > 0
      ? Math.max(...attendees.map((a) => a.ticketNumber)) + 1
      : 1;

    lines.forEach((line) => {
      const parts = line.split(/[,;\t]/);
      if (parts.length >= 2) {
        const attendeeName = parts[0].trim();
        const attendeeEmail = parts[1].trim();
        if (attendeeName && attendeeEmail) {
          const paddedNumber = String(currentNumber).padStart(3, '0');
          onAddAttendee({
            id: `att-${Date.now()}-${currentNumber}`,
            ticketNumber: currentNumber,
            ticketCode: `TICK-${paddedNumber}`,
            name: attendeeName,
            email: attendeeEmail.toLowerCase(),
            checkInTime: new Date().toISOString(),
            hasPlayed: false,
            bestScore: 0,
            attemptsCount: 0,
            wonPrizes: [],
          });
          currentNumber++;
        }
      }
    });

    setBulkInput('');
    setShowBulkModal(false);
    playSuccessSound();
  };

  const handleCopyTicket = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadEventJson = () => {
    const data = {
      eventInfo: {
        id: config.project.id,
        name: config.event.name,
        lumaUrl: config.event.lumaUrl,
        date: new Date().toISOString().slice(0, 10),
      },
      stats: {
        totalAttendees: attendees.length,
        totalPlayed: attendees.filter((a) => a.hasPlayed).length,
        highestScore: attendees.reduce((max, a) => Math.max(max, a.bestScore), 0),
      },
      attendees,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.deployment.slug || 'evento'}-asistencia-tickets.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const headers = 'Ticket_Numero,Codigo_Ticket,Nombre,Email,Hora_CheckIn,Jugo_Arcade,Mejor_Puntaje\n';
    const rows = attendees
      .map(
        (a) =>
          `"${a.ticketNumber}","${a.ticketCode}","${a.name}","${a.email}","${a.checkInTime}","${a.hasPlayed ? 'SI' : 'NO'}","${a.bestScore}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.deployment.slug || 'evento'}-asistencia.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAttendees = attendees.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(a.ticketNumber) === searchTerm.trim()
  );

  const totalPlayed = attendees.filter((a) => a.hasPlayed).length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* 3 LUMA EVENTS QUICK SWITCHER STRIP */}
      {projects.length > 0 && onSelectProject && (
        <div className="p-4 rounded-3xl bg-[#0D1119] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>Eventos Configurados para Prueba & Operación (Luma)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Selecciona un evento para registrar su asistencia y boletos
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
                      ? 'bg-gradient-to-br from-red-950/70 via-slate-900 to-slate-950 border-red-500 ring-2 ring-red-500/20 shadow-lg'
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
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                          ACTIVO
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

      {/* Header and Summary Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4 text-red-400" />
            <span>Módulo de Recepción & Registro de Llegada</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Check-in de Asistentes & Asignación de Tickets
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs text-slate-300 font-medium">
              Evento activo: <strong className="text-white">{config.event.name}</strong>
            </span>
            {config.event.lumaUrl && (
              <a
                href={config.event.lumaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline flex items-center gap-1 ml-1"
              >
                <span>{config.event.lumaUrl}</span>
                <span className="text-[10px]">↗</span>
              </a>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cada asistente que llega se registra con su nombre y correo, y recibe un <span className="text-amber-400 font-bold font-mono">Número Correlativo</span> que sirve como ticket para la tómbola / sorteo al final del evento.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadEventJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition"
            title="Descargar datos en formato JSON"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>JSON Asistencia</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition"
            title="Descargar lista para Excel o imprimir"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Puerta</span>
          </button>

          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Carga Masiva</span>
          </button>

          {onResetAttendees && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-mono transition"
              title="Vaciar lista para empezar un evento real desde ticket #001"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Vaciar para Evento en Vivo</span>
            </button>
          )}

          {onRestoreAttendees && attendees.length === 0 && (
            <button
              onClick={onRestoreAttendees}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-mono transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cargar Datos de Prueba</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal to Clear list */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0E121A] border border-red-500/50 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              <span>¿Iniciar Check-in Limpio en Vivo?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Esto vaciará los asistentes de este evento para que puedas empezar a registrar las llegadas en la puerta física desde el <strong>Ticket #001</strong>. Siempre podrás volver a cargar los datos de prueba con un solo clic.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (onResetAttendees) onResetAttendees();
                  setShowClearConfirm(false);
                  setLastRegistered(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500"
              >
                Sí, vaciar lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#11151F] border border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Total Check-in
          </span>
          <span className="text-2xl font-black text-white">{attendees.length}</span>
          <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">Asistentes presentes</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11151F] border border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Próximo Ticket Sorteo
          </span>
          <span className="text-2xl font-black text-amber-400">
            #{attendees.length > 0 ? String(Math.max(...attendees.map((a) => a.ticketNumber)) + 1).padStart(3, '0') : '001'}
          </span>
          <span className="text-[11px] text-slate-400 block font-mono mt-0.5">Asignación automática</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11151F] border border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Han Jugado en el Arcade
          </span>
          <span className="text-2xl font-black text-red-400">{totalPlayed}</span>
          <span className="text-[11px] text-slate-400 block font-mono mt-0.5">
            {attendees.length > 0 ? Math.round((totalPlayed / attendees.length) * 100) : 0}% de participación
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11151F] border border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Modo de Sorteo
          </span>
          <span className="text-xl font-bold text-cyan-400 font-mono">Tómbola Lista</span>
          <span className="text-[11px] text-slate-400 block font-mono mt-0.5">Criterios configurables</span>
        </div>
      </div>

      {/* Main Check-in Area: Registration Form on Left, Ticket Confirmation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CHECK-IN FORM (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#11151F] border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold text-white">Registrar Llegada de Asistente</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Paso 1 de 2</span>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Quick Autofill with GitHub */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#161B22] border border-[#30363D]">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-[11px] font-mono text-slate-300">¿Participante con cuenta GitHub?</span>
              </div>
              <button
                type="button"
                onClick={handleAutofillFromGithub}
                className="px-2.5 py-1 rounded-lg bg-[#238636] hover:bg-[#2EA043] text-white text-[11px] font-mono font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <span>Autocompletar con GitHub</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Nombre Completo:</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Constanza Rivas"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Correo Electrónico:</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="constanza@ejemplo.cl"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            <div className="pt-1">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <button
                  type="button"
                  onClick={() => setUseCustomTicket(!useCustomTicket)}
                  className="text-amber-400 hover:text-amber-300 underline font-mono text-[11px]"
                >
                  {useCustomTicket ? 'Usar ticket correlativo automático' : '¿Asignar número de ticket personalizado?'}
                </button>
              </div>

              {useCustomTicket && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <label className="block text-[11px] font-mono text-slate-300">
                    Número de Ticket Específico:
                  </label>
                  <input
                    type="number"
                    value={customTicketNumber}
                    onChange={(e) => setCustomTicketNumber(e.target.value)}
                    placeholder="Ej. 100"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs outline-none"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4 text-amber-300" />
              <span>Confirmar Check-in & Asignar Ticket</span>
            </button>
          </form>
        </div>

        {/* TICKET CONFIRMATION BADGE (6 Cols) */}
        <div className="lg:col-span-6">
          {lastRegistered ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#131722] to-[#0E121B] border-2 border-amber-500/40 shadow-2xl relative overflow-hidden animate-fadeIn space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡Check-in Confirmado!</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  {config.event.name.split('·')[0]}
                </span>
              </div>

              {/* Big Ticket Number */}
              <div className="text-center py-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  Número de Ticket para el Sorteo
                </span>
                <div className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-black/60 border border-amber-500/40 shadow-inner">
                  <Ticket className="w-8 h-8 text-amber-400" />
                  <span className="text-4xl sm:text-5xl font-black text-amber-300 font-mono tracking-tight">
                    {lastRegistered.ticketCode}
                  </span>
                </div>
              </div>

              {/* Attendee Details */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Asistente:</span>
                  <strong className="text-white">{lastRegistered.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Correo:</span>
                  <span className="text-slate-300">{lastRegistered.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hora de Llegada:</span>
                  <span className="text-emerald-400">
                    {new Date(lastRegistered.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => handleCopyTicket(lastRegistered.ticketCode)}
                  className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? '¡Ticket Copiado!' : 'Copiar Ticket'}</span>
                </button>

                {onLaunchGameForAttendee && (
                  <button
                    onClick={() => onLaunchGameForAttendee(lastRegistered)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono transition cursor-pointer shadow-sm"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Jugar Arcade Ahora</span>
                  </button>
                )}
              </div>

              {/* Quick Share Ticket via WhatsApp, LinkedIn, Instagram */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                  Compartir mi ticket / credencial:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `🎟️ ¡Acabo de registrarme en *${config.event.name}*!\nMi Ticket oficial para el sorteo es: *${lastRegistered.ticketCode}*\nEvento en Luma: https://luma.com/fg52mshy`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent('https://luma.com/fg52mshy'), '_blank');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-sky-950/60 hover:bg-sky-900 border border-sky-600/30 text-sky-300 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <span>LinkedIn</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`🎟️ ¡Mi Ticket Oficial para ${config.event.name} es ${lastRegistered.ticketCode}! #Avalanche #Hackathon @dev3pack`);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2500);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-600/30 text-rose-300 text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <span>Instagram</span>
                  </button>
                </div>
              </div>

              <div className="pt-1 text-center text-[10px] text-slate-400 leading-relaxed font-mono">
                Conserva este número para la tómbola del final. Juega en el arcade para aumentar tus posibilidades de ganar.
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">Ningún asistente registrado en esta sesión</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Rellena el formulario de la izquierda al recibir a una persona para generarle su ticket de sorteo al instante.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ATTENDEE LIST WITH LIVE SEARCH */}
      <div className="p-6 rounded-3xl bg-[#11151F] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">Lista de Asistentes Acreditados ({attendees.length})</h3>
            <p className="text-xs text-slate-400">
              Todos los participantes tienen asignado su ticket correlativo para el sorteo del evento.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, correo o ticket #..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Ticket #</th>
                <th className="py-2.5 px-3">Nombre</th>
                <th className="py-2.5 px-3">Correo</th>
                <th className="py-2.5 px-3">Hora Check-in</th>
                <th className="py-2.5 px-3">Arcade Score</th>
                <th className="py-2.5 px-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-900/60 transition">
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                        {att.ticketCode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white">{att.name}</td>
                    <td className="py-3 px-3 text-slate-400">{att.email}</td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(att.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3">
                      {att.hasPlayed ? (
                        <span className="text-emerald-400 font-bold">{att.bestScore} pts</span>
                      ) : (
                        <span className="text-slate-500">Sin jugar aún</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Presente</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No se encontraron asistentes con ese filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0E121A] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Importar Asistentes en Lote (CSV)</h3>
            <p className="text-xs text-slate-400">
              Pega una lista de asistentes con formato <code className="text-amber-400 font-mono">Nombre, Correo</code> por cada línea:
            </p>

            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={6}
              placeholder={`Ana Morales, ana.m@empresa.com\nCarlos Vega, c.vega@tech.io\nLaura Gómez, laura@crypto.org`}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-600 outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkImport}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500"
              >
                Cargar Asistentes & Asignar Tickets
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

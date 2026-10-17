import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  UserCheck, 
  Flame, 
  Gift, 
  Award, 
  X, 
  Play, 
  ExternalLink 
} from 'lucide-react';

interface QuickTestGuideProps {
  activeTab: string;
  onNavigate: (tab: any, subView?: string, checkinSub?: string) => void;
}

export const QuickTestGuide: React.FC<QuickTestGuideProps> = ({
  activeTab,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      id: 'step-checkin',
      number: 1,
      title: 'Acreditar Asistente & Ticket',
      subtitle: 'Simula el check-in de llegada con código QR o manual',
      actionLabel: 'Ir al Check-in Express',
      icon: UserCheck,
      badge: 'Paso 1: Check-in',
      targetTab: 'checkin',
      targetCheckinSub: 'checkin',
      details: 'Ingresa un nombre o usa "Registro Rápido". Recibirás un ticket oficial para la tómbola.',
      previewTag: 'Ticket #001',
    },
    {
      id: 'step-boss',
      number: 2,
      title: 'Boss Raid On-Chain (<800ms)',
      subtitle: 'Ejecuta un turno cooperativo contra el Boss Gólem',
      actionLabel: 'Ir a Batalla On-Chain',
      icon: Flame,
      badge: 'Paso 2: Gaming On-Chain',
      targetTab: 'games',
      targetSubView: 'boss_raid',
      details: 'Elige "Ataque Rápido AVAX" o "Teleporter Combo". El turno se valida en Fuji en sub-segundos sin pagar gas.',
      previewTag: 'Turno On-Chain',
    },
    {
      id: 'step-raffle',
      number: 3,
      title: 'Tómbola & Sorteo en Vivo',
      subtitle: 'Gira la ruleta de premios con los asistentes registrados',
      actionLabel: 'Girar Sorteo Comunal',
      icon: Gift,
      badge: 'Paso 3: Sorteo Transparente',
      targetTab: 'checkin',
      targetCheckinSub: 'raffle',
      details: 'Presiona "Girar Tómbola". El algoritmo selecciona un ganador aleatorio transparente entre los presentes.',
      previewTag: 'Premio Mayor',
    },
    {
      id: 'step-poap',
      number: 4,
      title: 'Certificado POAP & Compartir',
      subtitle: 'Mintea tu badge Soulbound y compártelo en WhatsApp o Instagram',
      actionLabel: 'Ver Certificado Oficial',
      icon: Award,
      badge: 'Paso 4: Credenciales Web3',
      targetTab: 'poap',
      details: 'Mintea tu insignia digital patrocinada (gasless) y envíala a WhatsApp, LinkedIn o Instagram Stories (9:16).',
      previewTag: 'Token Soulbound',
    },
  ];

  const currentStep = steps[currentStepIndex];
  const StepIcon = currentStep.icon;

  const handleExecuteStep = () => {
    onNavigate(
      currentStep.targetTab,
      currentStep.targetSubView,
      currentStep.targetCheckinSub
    );
  };

  const handleNext = () => {
    const nextIdx = Math.min(steps.length - 1, currentStepIndex + 1);
    setCurrentStepIndex(nextIdx);
    const nextStep = steps[nextIdx];
    onNavigate(
      nextStep.targetTab,
      nextStep.targetSubView,
      nextStep.targetCheckinSub
    );
  };

  const handlePrev = () => {
    const prevIdx = Math.max(0, currentStepIndex - 1);
    setCurrentStepIndex(prevIdx);
    const prevStep = steps[prevIdx];
    onNavigate(
      prevStep.targetTab,
      prevStep.targetSubView,
      prevStep.targetCheckinSub
    );
  };

  if (!isOpen) {
    return (
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/60 border border-red-500/30 p-2.5 rounded-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500/50 flex items-center justify-center text-amber-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white font-mono">
              Tour de Prueba Rápido (Paso a Paso)
            </span>
            <span className="text-[10px] text-slate-400 font-mono ml-2">
              Paso {currentStepIndex + 1} de {steps.length}: {currentStep.title}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <span>Abrir Guía</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-950 via-[#10141D] to-slate-950 border-2 border-red-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl relative space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/60 flex items-center justify-center text-amber-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white font-mono tracking-tight">
                Demo Paso a Paso en 60 Segundos
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/30 font-bold">
                Paso {currentStepIndex + 1} de {steps.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Flujo recomendado para jurados y evaluadores del Ideathón
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="Minimizar Guía"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Steps Indicator */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {steps.map((st, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <button
              key={st.id}
              onClick={() => {
                setCurrentStepIndex(idx);
                onNavigate(st.targetTab, st.targetSubView, st.targetCheckinSub);
              }}
              className={`p-2 rounded-xl text-left transition border cursor-pointer ${
                isCurrent
                  ? 'bg-red-600/20 border-red-500 text-white shadow-md'
                  : isDone
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="flex items-center gap-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <span>#{st.number}</span>
                  )}
                  <span className="hidden sm:inline truncate">{st.previewTag}</span>
                </span>
                <span className={isCurrent ? 'text-amber-300' : 'text-slate-500'}>
                  {isCurrent ? 'Actual' : isDone ? 'OK' : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Step Interactive Card */}
      <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 shrink-0">
            <StepIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-white font-mono">
                {currentStep.number}. {currentStep.title}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono font-medium">
              {currentStep.subtitle}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              💡 {currentStep.details}
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExecuteStep}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{currentStep.actionLabel}</span>
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-1 text-xs font-mono">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Paso Anterior</span>
        </button>

        <div className="text-[11px] text-slate-400">
          Tip: Completa los 4 pasos para ver el flujo completo del Pitch
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          className="px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 disabled:opacity-40 text-white font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <span>Siguiente Paso</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

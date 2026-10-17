import React, { useState, useEffect } from 'react';
import { ProjectIdea } from '../data/featuredIdeas';
import { X, ChevronLeft, ChevronRight, Presentation, Sparkles, Flame, Award } from 'lucide-react';

interface PitchDeckModalProps {
  idea: ProjectIdea | null;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ idea, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide((prev) => Math.min((idea?.pitchDeck.length || 1) - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [idea, onClose]);

  if (!idea) return null;

  const slide = idea.pitchDeck[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-[#07090E] flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-sm block">{idea.title}</span>
            <span className="text-[11px] font-mono text-red-400">{idea.trackName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
            Slide {currentSlide + 1} de {idea.pitchDeck.length}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Cerrar presentación (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="flex-1 flex items-center justify-center my-6">
        <div className="w-full max-w-4xl p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900/90 to-[#101420] border border-slate-800 shadow-2xl relative min-h-[380px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-red-400 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40">
                DIAPOSITIVA #{slide.slideNumber}
              </span>
              {slide.callout && (
                <span className="text-xs font-bold text-amber-300 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 font-mono">
                  {slide.callout}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
              {slide.title}
            </h1>
            <p className="text-sm sm:text-base text-red-300/90 font-medium mb-8">
              {slide.tagline}
            </p>

            <ul className="space-y-4">
              {slide.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-base sm:text-lg text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2 shrink-0 shadow-lg shadow-red-500/40" />
                  <span className="leading-snug">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 mt-8">
            <span className="font-mono">Construido con estándares de avaxskills.com</span>
            <span>Usa las teclas ← y → o la barra espaciadora para navegar</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {idea.pitchDeck.map((sl, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-red-500' : 'w-3 bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Slide ${idx + 1}: ${sl.title}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold disabled:opacity-30 border border-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>
          <button
            onClick={() => setCurrentSlide(Math.min(idea.pitchDeck.length - 1, currentSlide + 1))}
            disabled={currentSlide === idea.pitchDeck.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold disabled:opacity-30 transition shadow-lg shadow-red-600/20"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

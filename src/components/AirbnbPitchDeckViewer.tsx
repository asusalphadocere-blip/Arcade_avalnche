import React, { useState, useEffect } from 'react';
import { AIRBNB_PITCH_DECK, AirbnbSlide } from '../data/airbnbPitchDeck';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  Layers, 
  Award, 
  ExternalLink,
  Presentation,
  CheckCircle2,
  X,
  Target
} from 'lucide-react';

interface AirbnbPitchDeckViewerProps {
  onOpenFullscreen?: () => void;
}

export const AirbnbPitchDeckViewer: React.FC<AirbnbPitchDeckViewerProps> = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentSlide: AirbnbSlide = AIRBNB_PITCH_DECK[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => Math.min(AIRBNB_PITCH_DECK.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleCopyMarkdown = () => {
    let md = `# Arcade Studio — Pitch Deck (Estructura Estilo Airbnb)\n\n`;
    AIRBNB_PITCH_DECK.forEach((slide) => {
      md += `## Slide ${slide.slideNumber}: ${slide.title}\n`;
      md += `*${slide.tagline}*\n\n`;
      md += `> **Referencia Airbnb:** ${slide.airbnbComparison}\n\n`;
      if (slide.keyMetricOrQuote) {
        md += `**Métrica Clave:** ${slide.keyMetricOrQuote.value} — ${slide.keyMetricOrQuote.label}\n\n`;
      }
      slide.bullets.forEach((b) => {
        md += `- ${b}\n`;
      });
      if (slide.cards) {
        md += `\n**Puntos Destacados:**\n`;
        slide.cards.forEach((c) => {
          md += `- **${c.title}** (${c.highlight || ''}): ${c.subtitle}\n`;
        });
      }
      md += `\n---\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    let md = `# Arcade Studio — Pitch Deck (Estructura Estilo Airbnb)\n\n`;
    AIRBNB_PITCH_DECK.forEach((slide) => {
      md += `## Slide ${slide.slideNumber}: ${slide.title}\n`;
      md += `*${slide.tagline}*\n\n`;
      md += `> **Referencia Airbnb:** ${slide.airbnbComparison}\n\n`;
      if (slide.keyMetricOrQuote) {
        md += `**Métrica Clave:** ${slide.keyMetricOrQuote.value} — ${slide.keyMetricOrQuote.label}\n\n`;
      }
      slide.bullets.forEach((b) => {
        md += `- ${b}\n`;
      });
      if (slide.cards) {
        md += `\n**Puntos Destacados:**\n`;
        slide.cards.forEach((c) => {
          md += `- **${c.title}** (${c.highlight || ''}): ${c.subtitle}\n`;
        });
      }
      md += `\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arcade-studio-pitch-deck-airbnb.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSlideContent = (isModal: boolean = false) => (
    <div className={`flex flex-col justify-between ${isModal ? 'min-h-[520px]' : 'min-h-[460px]'}`}>
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-red-950/70 text-red-400 border border-red-500/40 uppercase">
              {currentSlide.category}
            </span>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
              Diapositiva {currentSlide.slideNumber} de {AIRBNB_PITCH_DECK.length}
            </span>
          </div>

          <div className="text-[11px] font-mono text-amber-300/90 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-full">
            {currentSlide.airbnbComparison}
          </div>
        </div>

        {/* Slide Title & Tagline */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
            {currentSlide.title}
          </h2>
          <p className="text-sm sm:text-base text-red-400/90 font-medium">
            {currentSlide.tagline}
          </p>
        </div>

        {/* Key Metric Callout if present */}
        {currentSlide.keyMetricOrQuote && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/30 border border-red-500/30 mb-6 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400 block">
                Métrica de Impacto / Validación
              </span>
              <span className="text-xs sm:text-sm text-slate-200 font-medium">
                {currentSlide.keyMetricOrQuote.label}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight shrink-0">
              {currentSlide.keyMetricOrQuote.value}
            </div>
          </div>
        )}

        {/* Bullet Points */}
        <div className="space-y-3 mb-6">
          {currentSlide.bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-md shadow-red-500/50" />
              <span className="leading-relaxed">{bullet}</span>
            </div>
          ))}
        </div>

        {/* Cards Grid if present */}
        {currentSlide.cards && currentSlide.cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {currentSlide.cards.map((card, cIdx) => (
              <div
                key={cIdx}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1"
              >
                {card.highlight && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 inline-block mb-1">
                    {card.highlight}
                  </span>
                )}
                <h4 className="text-xs font-bold text-white">{card.title}</h4>
                <p className="text-[11px] text-slate-400">{card.subtitle}</p>
              </div>
            ))}
          </div>
        )}

        {/* Callout */}
        {currentSlide.callout && (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{currentSlide.callout}</span>
          </div>
        )}
      </div>

      {/* Slide Footer Navigation */}
      <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 mt-6">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 border border-slate-800 transition cursor-pointer"
            title="Diapositiva anterior (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 font-bold">
            {currentSlideIndex + 1} / {AIRBNB_PITCH_DECK.length}
          </span>

          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(AIRBNB_PITCH_DECK.length - 1, prev + 1))}
            disabled={currentSlideIndex === AIRBNB_PITCH_DECK.length - 1}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 border border-slate-800 transition cursor-pointer"
            title="Siguiente diapositiva (→ o Barra Espaciadora)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-slate-500">
            Navega con flechas ← →
          </span>
          {!isModal && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-md shadow-red-600/20"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Presentación Fullscreen</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Deck Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0D1017] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1">
            <Presentation className="w-4 h-4 text-red-400" />
            <span>Estructura Oficial Airbnb Pitch Deck (12 Slides)</span>
          </div>
          <h3 className="text-xl font-black text-white">
            Pitch Deck de Inversión & Alianzas: Arcade Studio
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Estructurado siguiendo la fórmula exacta del histórico pitch deck de Airbnb adaptado al modelo de negocio de este proyecto.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition"
            title="Copiar pitch deck en Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '¡Copiado!' : 'Copiar MD'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition"
            title="Descargar archivo Markdown del Pitch Deck"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Descargar Deck</span>
          </button>

          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono transition shadow-lg shadow-red-600/30"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Presentar</span>
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Quick Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
        {AIRBNB_PITCH_DECK.map((s, idx) => {
          const isSelected = idx === currentSlideIndex;
          return (
            <button
              key={s.slideNumber}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`p-2.5 rounded-xl border text-left transition text-xs font-mono flex flex-col justify-between ${
                isSelected
                  ? 'bg-red-950/70 border-red-500 text-white ring-1 ring-red-500/40'
                  : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[10px] text-red-400 font-bold block mb-1">
                Slide {s.slideNumber}
              </span>
              <span className="font-bold text-[11px] truncate block text-white">
                {s.category.split('/')[0].replace(/^\d+\.\s*/, '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Slide Card Container */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#111520] via-[#0D1018] to-black border-2 border-slate-800/80 shadow-2xl relative overflow-hidden">
        {renderSlideContent(false)}
      </div>

      {/* Fullscreen Presentation Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#06080D] flex flex-col justify-between p-6 sm:p-12 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-base block">Arcade Studio · Pitch Deck</span>
                <span className="text-xs font-mono text-slate-400">Estructura Airbnb para Inversionistas</span>
              </div>
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Cerrar pantalla completa (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Fullscreen Stage */}
          <div className="max-w-5xl w-full mx-auto my-auto p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#121624] via-[#0C0F17] to-black border-2 border-red-500/30 shadow-2xl">
            {renderSlideContent(true)}
          </div>

          {/* Footer note */}
          <div className="text-center text-xs font-mono text-slate-500 pt-4 border-t border-slate-800">
            Presiona Esc para salir · Flechas ← → para cambiar diapositiva
          </div>
        </div>
      )}
    </div>
  );
};

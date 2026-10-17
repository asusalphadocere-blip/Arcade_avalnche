import React from 'react';
import { ProjectIdea } from '../data/featuredIdeas';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Code2, 
  Presentation,
  CheckCircle2,
  Zap,
  Flame
} from 'lucide-react';

interface IdeaCardProps {
  idea: ProjectIdea;
  onSelect: (idea: ProjectIdea) => void;
  onOpenDeck: (idea: ProjectIdea) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onSelect, onOpenDeck }) => {
  return (
    <div className="group relative rounded-2xl bg-[#11151F] border border-slate-800/90 hover:border-slate-700/80 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/20">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-red-400 font-mono">
            {idea.trackName}
          </span>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Score: {idea.rubricScore.total}/100</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl font-extrabold text-white group-hover:text-red-400 transition-colors mb-1.5 flex items-center gap-2">
          <span>{idea.title}</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">
          {idea.subtitle}
        </p>

        {/* The Hook Quote */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/30 to-slate-900/60 border border-red-500/20 mb-4">
          <div className="flex items-start gap-2">
            <Flame className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 font-mono block">
                The Pitch Hook:
              </span>
              <p className="text-xs text-slate-200 italic font-medium mt-0.5 leading-snug">
                "{idea.hook}"
              </p>
            </div>
          </div>
        </div>

        {/* Unfair Advantage Callout */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Superpoder en Avalanche:
          </span>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {idea.unfairAdvantage}
          </p>
        </div>

        {/* AvaxSkills Chips */}
        <div className="mb-5">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mb-2">
            <Cpu className="w-3 h-3 text-red-400" />
            Skills Utilizadas (avaxskills.com):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {idea.avaxSkills.map((sk) => (
              <span
                key={sk.name}
                className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
              >
                {sk.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 mt-auto">
        <button
          onClick={() => onSelect(idea)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/20 transition-all duration-200"
        >
          <span>Arquitectura & Código</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onOpenDeck(idea)}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          title="Ver diapositivas de Pitch Deck"
        >
          <Presentation className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};

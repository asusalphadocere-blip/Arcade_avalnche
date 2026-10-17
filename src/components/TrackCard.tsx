import React from 'react';
import { AvaxTrack } from '../data/avaxTracks';
import { 
  Bot, 
  Layers, 
  Network, 
  Building2, 
  TrendingUp, 
  Gamepad2, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';

interface TrackCardProps {
  track: AvaxTrack;
  onSelectTrack: (trackId: string) => void;
  onExploreIdeas: (trackId: string) => void;
  isSelected?: boolean;
}

const getTrackIcon = (iconName: string) => {
  switch (iconName) {
    case 'Bot':
      return <Bot className="w-6 h-6 text-amber-400" />;
    case 'Layers':
      return <Layers className="w-6 h-6 text-red-400" />;
    case 'Network':
      return <Network className="w-6 h-6 text-cyan-400" />;
    case 'Building2':
      return <Building2 className="w-6 h-6 text-emerald-400" />;
    case 'TrendingUp':
      return <TrendingUp className="w-6 h-6 text-violet-400" />;
    case 'Gamepad2':
      return <Gamepad2 className="w-6 h-6 text-pink-400" />;
    case 'ShieldAlert':
      return <ShieldAlert className="w-6 h-6 text-blue-400" />;
    default:
      return <Sparkles className="w-6 h-6 text-red-400" />;
  }
};

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onSelectTrack,
  onExploreIdeas,
  isSelected = false,
}) => {
  return (
    <div
      className={`group relative rounded-2xl p-6 transition-all duration-300 border bg-[#11151F]/90 hover:bg-[#151A26] flex flex-col justify-between ${
        isSelected
          ? 'border-red-500 ring-2 ring-red-500/30 shadow-xl shadow-red-500/10'
          : 'border-slate-800/80 hover:border-slate-700 shadow-lg shadow-black/40'
      }`}
    >
      {/* Top Banner with Icon & Tag */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            {getTrackIcon(track.iconName)}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 font-mono">
              {track.skillsCount} Skills
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                track.hackathonPotential === 'Extremo'
                  ? 'bg-red-950/70 text-red-400 border-red-500/30'
                  : 'bg-amber-950/70 text-amber-300 border-amber-500/30'
              }`}
            >
              Potencial: {track.hackathonPotential}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors mb-1">
          {track.name}
        </h3>
        <p className="text-xs text-red-300/80 font-medium mb-3">
          {track.tagline}
        </p>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {track.description}
        </p>

        {/* Highlight Skills Chips */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-2 font-mono">
            <Zap className="w-3 h-3 text-red-400" />
            Skills Clave de avaxskills.com:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {track.highlightSkills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-600 transition"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Why Avalanche Callout */}
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 mb-5">
          <span className="text-[11px] font-bold text-red-400 flex items-center gap-1.5 mb-1">
            <Target className="w-3 h-3 text-red-400" />
            Por qué Avalanche es indispensable:
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {track.whyAvalanche}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 mt-auto">
        <button
          onClick={() => onExploreIdeas(track.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 transition-all duration-200"
        >
          <span>Ver Ideas del Track</span>
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => onSelectTrack(track.id)}
          className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          title="Usar este track para generar una nueva idea"
        >
          Diseñar aquí
        </button>
      </div>
    </div>
  );
};

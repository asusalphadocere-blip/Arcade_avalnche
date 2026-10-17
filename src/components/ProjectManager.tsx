import React from 'react';
import { VersionedGameConfig, EngineInfo } from '../types/arcade';
import { AVAILABLE_ENGINES } from '../data/initialProjects';
import { 
  Plus, 
  Gamepad2, 
  Calendar, 
  Users, 
  Tv, 
  Smartphone, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  CheckCircle2, 
  Sliders,
  QrCode,
  ExternalLink
} from 'lucide-react';

interface ProjectManagerProps {
  projects: VersionedGameConfig[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateNewProject: (engineId: string) => void;
  onOpenLiveScreen: (project: VersionedGameConfig) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateNewProject,
  onOpenLiveScreen,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#11151F] border border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Proyectos de Eventos
          </span>
          <span className="text-2xl font-black text-white">{projects.length}</span>
          <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">Listos para operar</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11151F] border border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Motores 2D Reutilizables
          </span>
          <span className="text-2xl font-black text-red-400">5</span>
          <span className="text-[11px] text-slate-400 block font-mono mt-0.5">Phaser & Canvas</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11151F] border border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Partidas Jugadas
          </span>
          <span className="text-2xl font-black text-amber-400">3,420</span>
          <span className="text-[11px] text-slate-400 block font-mono mt-0.5">Móvil & Tótems Kiosko</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11151F] border border-slate-800">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
            Integración Avalanche
          </span>
          <span className="text-2xl font-black text-cyan-400">Fuji / Subnet</span>
          <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">Insignias Digitales PoAP</span>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-white">Eventos & Arcades Configurados</h3>
            <p className="text-xs text-slate-400">
              Selecciona un arcade para personalizar su identidad visual, reglas y acreditación.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const isSelected = proj.project.id === selectedProjectId;
            const engineInfo = AVAILABLE_ENGINES.find((e) => e.id === proj.game.engineId);

            return (
              <div
                key={proj.project.id}
                className={`p-6 rounded-3xl bg-[#11151F] border flex flex-col justify-between transition-all duration-300 relative group ${
                  isSelected
                    ? 'border-red-500 ring-2 ring-red-500/20 shadow-xl shadow-red-500/10'
                    : 'border-slate-800 hover:border-slate-700 shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-red-400">
                      {engineInfo?.name || proj.game.engineId}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        proj.project.status === 'published'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {proj.project.status === 'published' ? '● Publicado' : 'Borrador'}
                    </span>
                  </div>

                  {/* Brand Color Indicator & Luma link */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: proj.brand.colors.primary }}
                      />
                      <span className="text-[11px] font-mono text-slate-400">
                        {proj.brand.logoText}
                      </span>
                    </div>

                    {proj.event.lumaUrl && (
                      <a
                        href={proj.event.lumaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 transition"
                      >
                        <span>Ver en Luma</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors mb-1">
                    {proj.project.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {proj.brand.tagline || proj.brand.title}
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-400 font-mono mb-5">
                    <div className="flex items-center justify-between">
                      <span>Modo de Acceso:</span>
                      <strong className="text-white uppercase">{proj.event.accessMode}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Duración:</span>
                      <strong className="text-white">{proj.game.durationSeconds}s</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Destinos:</span>
                      <strong className="text-white">{proj.deployment.targets.join(', ')}</strong>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2 mt-auto">
                  <button
                    onClick={() => onSelectProject(proj.project.id)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Personalizar Marca</span>
                  </button>

                  <button
                    onClick={() => onOpenLiveScreen(proj)}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                    title="Abrir Pantalla Kiosko de Marcador en Vivo"
                  >
                    <Tv className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Game Engines Library */}
      <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Librería de Motores Arcade 2D Reutilizables</h3>
            <p className="text-xs text-slate-400">
              Despliega un nuevo arcade en segundos sin programar una sola línea de código.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AVAILABLE_ENGINES.map((eng) => (
            <div
              key={eng.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-white">{eng.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-red-400">
                    {eng.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3">{eng.description}</p>
                <div className="text-[10px] text-slate-400 font-mono space-y-1 mb-4">
                  <div>Controles: {eng.supportedControls.join(', ')}</div>
                </div>
              </div>

              <button
                onClick={() => onCreateNewProject(eng.id)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white text-xs font-bold font-mono transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Crear Arcade con este Motor</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

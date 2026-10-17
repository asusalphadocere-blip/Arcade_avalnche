import React from 'react';
import { 
  Gamepad2, 
  Palette, 
  Tv, 
  Code2, 
  UserCheck, 
  Gift, 
  History, 
  Plus, 
  Layers,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';

import { VersionedGameConfig } from '../types/arcade';

interface NavbarProps {
  activeTab: 'games' | 'projects' | 'editor' | 'checkin' | 'raffle' | 'live' | 'architecture' | 'poap' | 'github';
  setActiveTab: (tab: 'games' | 'projects' | 'editor' | 'checkin' | 'raffle' | 'live' | 'architecture' | 'poap' | 'github') => void;
  onNewProject: () => void;
  onOpenHistory: () => void;
  activeProjectName?: string;
  projects?: VersionedGameConfig[];
  selectedProjectId?: string;
  onSelectProject?: (projectId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewProject,
  onOpenHistory,
  activeProjectName,
  projects = [],
  selectedProjectId,
  onSelectProject,
}) => {
  const [showEventMenu, setShowEventMenu] = React.useState(false);
  const currentProject = projects.find((p) => p.project.id === selectedProjectId) || projects[0];
  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab('projects')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 ring-1 ring-red-400/30">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white font-mono">
                  Arcade Studio
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-500/30 font-mono font-bold">
                  Eventos & Sorteos
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Canva para Arcades de Marca · Check-in & Tómbolas
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Streamlined Tree */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/90 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'games' || activeTab === 'live' || activeTab === 'projects'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-red-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Juegos On-Chain</span>
              <span className="text-[9px] bg-red-950 text-red-300 px-1.5 py-0.2 rounded font-mono font-bold">&lt;800ms</span>
            </button>

            <button
              onClick={() => setActiveTab('checkin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'checkin' || activeTab === 'raffle'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Check-in & Sorteo</span>
            </button>

            <button
              onClick={() => setActiveTab('github')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'github'
                  ? 'bg-[#238636] text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub Hub</span>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">Git</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'architecture'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pitch Ideatón</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Event Switcher Dropdown */}
            {projects.length > 0 && onSelectProject && (
              <div className="relative">
                <button
                  onClick={() => setShowEventMenu(!showEventMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-white border border-slate-700/80 transition max-w-[200px] sm:max-w-[240px] truncate"
                  title="Cambiar evento activo"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: currentProject?.brand.colors.primary || '#E84142' }}
                  />
                  <span className="truncate font-medium">
                    {currentProject?.event.name.split('·')[0] || currentProject?.project.name}
                  </span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>

                {showEventMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowEventMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-[#0E121A] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-fadeIn">
                      <div className="px-3 py-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                        <span>Eventos Disponibles ({projects.length})</span>
                        <span className="text-red-400">Seleccionar</span>
                      </div>
                      <div className="py-1 space-y-1 max-h-64 overflow-y-auto">
                        {projects.map((p) => {
                          const isSel = p.project.id === selectedProjectId;
                          return (
                            <button
                              key={p.project.id}
                              onClick={() => {
                                onSelectProject(p.project.id);
                                setShowEventMenu(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-xl transition flex flex-col gap-1 ${
                                isSel
                                  ? 'bg-red-950/50 border border-red-500/40 text-white'
                                  : 'hover:bg-slate-850 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs truncate flex items-center gap-1.5">
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: p.brand.colors.primary }}
                                  />
                                  {p.project.name}
                                </span>
                                {isSel && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-600 text-white shrink-0">
                                    Activo
                                  </span>
                                )}
                              </div>
                              {p.event.lumaUrl && (
                                <span className="text-[10px] text-amber-400/90 font-mono truncate">
                                  {p.event.lumaUrl}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <a
              href="https://luma.com/fg52mshy"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-white border border-red-500/40 text-xs font-mono font-bold transition shadow-sm"
              title="Abrir evento oficial en Luma: fg52mshy"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Luma fg52mshy</span>
            </a>

            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition"
              title="Descargar / Importar Historial de Eventos en JSON"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Historial JSON</span>
            </button>

            <button
              onClick={onNewProject}
              className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Arcade</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bar - Streamlined Tree */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 bg-slate-950 border-t border-slate-800 text-xs gap-1.5 scrollbar-none">
        <button
          onClick={() => setActiveTab('games')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-mono text-xs ${
            activeTab === 'games' || activeTab === 'live' || activeTab === 'projects' ? 'bg-red-600 text-white font-bold' : 'text-slate-400'
          }`}
        >
          ⚔️ Juegos On-Chain
        </button>
        <button
          onClick={() => setActiveTab('checkin')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-mono text-xs ${
            activeTab === 'checkin' || activeTab === 'raffle' ? 'bg-red-600 text-white font-bold' : 'text-slate-400'
          }`}
        >
          🎟️ Check-in & Sorteo
        </button>
        <button
          onClick={() => setActiveTab('github')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-mono text-xs ${
            activeTab === 'github' ? 'bg-[#238636] text-white font-bold' : 'text-slate-400'
          }`}
        >
          🐙 GitHub Hub
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-mono text-xs ${
            activeTab === 'architecture' ? 'bg-red-600 text-white font-bold' : 'text-slate-400'
          }`}
        >
          💡 Pitch Ideatón
        </button>
      </div>
    </header>
  );
};

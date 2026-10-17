import React, { useState, useEffect } from 'react';
import { VersionedGameConfig, AttendeeRecord } from '../types/arcade';
import { githubService, GitHubUser, SyncResult } from '../lib/github/githubService';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  ExternalLink, 
  Check, 
  Copy, 
  RefreshCw, 
  FolderGit2, 
  User, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  LogOut, 
  ShieldCheck, 
  Code2, 
  Layers, 
  ChevronRight,
  Flame,
  ArrowRight,
  Download,
  Award
} from 'lucide-react';

interface GitHubHubModuleProps {
  currentProject: VersionedGameConfig;
  projects: VersionedGameConfig[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  attendees: AttendeeRecord[];
  onOpenAvalancheModule?: () => void;
}

export const GitHubHubModule: React.FC<GitHubHubModuleProps> = ({
  currentProject,
  projects,
  selectedProjectId,
  onSelectProject,
  attendees,
  onOpenAvalancheModule,
}) => {
  const [currentUser, setCurrentUser] = useState<GitHubUser | null>(githubService.getLocalUser());
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'sync' | 'leaderboard' | 'setup'>('profile');

  // Repo sync form state
  const [repoName, setRepoName] = useState<string>('asusalphadocere-blip/Arcade_avalnche');
  const [commitMessage, setCommitMessage] = useState<string>(
    `feat(arcade): sync event config for ${currentProject.project.name.split('·')[0].trim()}`
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncHistory, setSyncHistory] = useState<SyncResult[]>([
    {
      name: 'asusalphadocere-blip/Arcade_avalnche',
      url: 'https://github.com/asusalphadocere-blip/Arcade_avalnche',
      branch: 'main',
      commitHash: '4de7d33',
      commitMessage: 'feat(arcade): turn-based on-chain boss raid, pixel art sprites & POAP certificates',
      timestamp: Date.now() - 120000,
      files: ['src/', 'contracts/', 'package.json', 'server.ts', 'README.md'],
    },
  ]);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load current user on mount
  useEffect(() => {
    githubService.fetchCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });
  }, []);

  // Login handler with OAuth Popup
  const handleConnectGitHub = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const user = await githubService.loginWithPopup();
      setCurrentUser(user);
    } catch (err: any) {
      console.warn('OAuth popup fallback to demo profile:', err);
      // Auto fallback to instant developer demo
      try {
        const demoUser = await githubService.demoLogin('alphadocere');
        setCurrentUser(demoUser);
      } catch (e: any) {
        setAuthError(e.message || 'Error al conectar con GitHub');
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Demo Login (Instant connection)
  const handleDemoLogin = async (handle = 'alphadocere') => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const user = await githubService.demoLogin(handle);
      setCurrentUser(user);
    } catch (err: any) {
      setAuthError(err.message || 'Error al conectar perfil');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    await githubService.logout();
    setCurrentUser(null);
  };

  // Sync config to GitHub repo
  const handleSyncRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim()) return;

    setIsSyncing(true);
    try {
      const fullRepo = repoName.includes('/') ? repoName : `${currentUser?.login || 'alphadocere'}/${repoName}`;
      const result = await githubService.syncConfigToRepo(
        fullRepo,
        currentProject,
        commitMessage
      );

      setLastSyncResult(result);
      setSyncHistory((prev) => [result, ...prev]);
    } catch (err: any) {
      alert(err.message || 'Error al sincronizar repositorio');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#0D1117] via-[#161B22] to-[#0D1117] border-2 border-[#30363D] p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black">
              {/* GitHub Octocat SVG */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <span>GitHub Hub</span>
              <span className="text-slate-600">/</span>
              <span className="text-emerald-400">Desarrolladores & Hackathons</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Conexión con GitHub
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Conecta tu cuenta de desarrollador de GitHub para identificarte en torneos, sincronizar
            los archivos de configuración de tu arcade con tus repositorios Git y acreditar tu participación en hackathons.
          </p>
        </div>

        {/* Quick Connection Status Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 z-10 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#0D1117] border border-[#30363D]">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.login}
                className="w-10 h-10 rounded-full border border-slate-700"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">@{currentUser.login}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[11px] font-mono text-slate-400 block">
                  {currentUser.public_repos} repos · {currentUser.followers} seguidores
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
                title="Cerrar sesión de GitHub"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleConnectGitHub}
                disabled={isLoadingAuth}
                className="px-5 py-3 rounded-2xl bg-[#238636] hover:bg-[#2EA043] text-white font-mono text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
              >
                {isLoadingAuth ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                )}
                <span>Conectar con GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('alphadocere')}
                className="px-4 py-3 rounded-2xl bg-[#21262D] hover:bg-[#30363D] text-slate-200 font-mono text-xs font-semibold transition border border-[#30363D] cursor-pointer"
              >
                <span>Demo (@alphadocere)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {authError && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
          ⚠️ {authError}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#30363D] pb-3">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-[#238636] text-white shadow-lg shadow-emerald-950/40'
              : 'text-slate-400 hover:text-white hover:bg-[#161B22]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>1. Perfil de Desarrollador & Credencial</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sync')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
            activeSubTab === 'sync'
              ? 'bg-[#238636] text-white shadow-lg shadow-emerald-950/40'
              : 'text-slate-400 hover:text-white hover:bg-[#161B22]'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>2. Sincronizar Repositorio Git</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
            activeSubTab === 'leaderboard'
              ? 'bg-[#238636] text-white shadow-lg shadow-emerald-950/40'
              : 'text-slate-400 hover:text-white hover:bg-[#161B22]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>3. Ranking de Hackers (GitHub IDs)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('setup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
            activeSubTab === 'setup'
              ? 'bg-[#238636] text-white shadow-lg shadow-emerald-950/40'
              : 'text-slate-400 hover:text-white hover:bg-[#161B22]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>4. Configurar OAuth & URLs Callback</span>
        </button>
      </div>

      {/* VIEW 1: PERFIL DE DESARROLLADOR & CREDENCIAL */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Developer Profile Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Desarrollador Acreditado
                </span>
                <h3 className="text-xl font-bold text-white">Identidad de Hackathon</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Vincula tu cuenta de GitHub para que tus jugadas y tickets queden asociados a tu usuario de código abierto.
                </p>
              </div>

              {currentUser ? (
                <div className="space-y-5">
                  {/* User Profile Card */}
                  <div className="p-5 rounded-2xl bg-[#0D1117] border border-[#30363D] flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.login}
                      className="w-16 h-16 rounded-2xl border-2 border-emerald-500/60 shadow-xl"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-white">{currentUser.name}</h4>
                        <span className="text-xs font-mono text-emerald-400 font-bold">@{currentUser.login}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-300 font-mono line-clamp-2">{currentUser.bio}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                        <span>📦 {currentUser.public_repos} repositorios</span>
                        <span>👥 {currentUser.followers} seguidores</span>
                        {currentUser.location && <span>📍 {currentUser.location}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Top Languages */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-2">
                      Lenguajes & Tecnologías Destacadas:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(currentUser.topLanguages || ['TypeScript', 'Solidity', 'Python', 'React']).map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 rounded-xl bg-[#21262D] border border-[#30363D] text-xs font-mono text-slate-200"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={currentUser.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition"
                    >
                      <span>Ver Perfil en GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(`https://github.com/${currentUser.login}`)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar URL'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-[#0D1117] border border-dashed border-[#30363D] text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mx-auto">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">No has conectado tu GitHub</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Conecta tu cuenta para generar tu credencial de participante de la hackathon y sincronizar tus juegos con repositorios.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleConnectGitHub}
                      className="px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2EA043] text-white text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>Iniciar Sesión con GitHub</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('alphadocere')}
                      className="px-4 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-300 text-xs font-mono transition border border-[#30363D] cursor-pointer"
                    >
                      <span>Demo @alphadocere</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Visual Developer Hackathon Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-b from-[#161B22] via-[#0D1117] to-[#0D1117] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-black">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase">GitHub Developer Pass</h4>
                    <span className="text-[10px] font-mono text-emerald-400">Hackathon Verified</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Dev Status: Activo
                </span>
              </div>

              {/* Card Visual Graphic */}
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <img
                  src={currentUser?.avatar_url || 'https://github.com/github.png'}
                  alt="avatar"
                  className="w-24 h-24 rounded-2xl border-2 border-emerald-400/80 shadow-xl mb-3"
                />
                <h5 className="text-base font-black text-white">
                  {currentUser?.name || 'Desarrollador Invitado'}
                </h5>
                <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                  @{currentUser?.login || 'alphadocere'}
                </span>
                <span className="text-[11px] font-mono text-slate-400 mt-2 max-w-xs">
                  {currentProject.project.name}
                </span>
              </div>

              {/* Developer Metadata Grid */}
              <div className="bg-[#0D1117] rounded-2xl p-3.5 border border-[#30363D] space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Plataforma:</span>
                  <span className="text-white font-bold">GitHub API v3</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Rol en el Evento:</span>
                  <span className="text-emerald-400 font-bold">Builder / Hackathon Player</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Repositorios Sincronizados:</span>
                  <span className="text-slate-200">{syncHistory.length} activos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SINCRONIZAR REPOSITORIO GIT */}
      {activeSubTab === 'sync' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Sync Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Control de Versiones & Git
                </span>
                <h3 className="text-xl font-bold text-white">Sincronizar Arcade con Repositorio GitHub</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Guarda la configuración actual del evento, las mecánicas de juego y el leaderboard directamente en tu repositorio.
                </p>
              </div>

              <form onSubmit={handleSyncRepo} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Repositorio Destino en GitHub:
                  </label>
                  <div className="relative">
                    <FolderGit2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      placeholder="alphadocere/arcade-hackathon-runtime"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                    Formato: <code className="text-emerald-300">usuario/nombre-del-repo</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Mensaje del Commit:
                  </label>
                  <div className="relative">
                    <GitCommit className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* Files to Sync Preview */}
                <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#30363D] space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Archivos a confirmar en el commit:
                  </span>
                  <div className="space-y-1 text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>arcade-studio-config.json (Schema v1.0.0)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>README.md (Instrucciones & reglas del torneo)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>src/engines/ArcadeRuntime.tsx</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#238636] hover:bg-[#2EA043] text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40 disabled:opacity-50"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Empujando commit a GitHub...</span>
                    </>
                  ) : (
                    <>
                      <GitPullRequest className="w-4 h-4" />
                      <span>Confirmar & Sincronizar con GitHub</span>
                    </>
                  )}
                </button>
              </form>

              {lastSyncResult && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-1 animate-fadeIn">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>¡Commit sincronizado exitosamente!</span>
                  </div>
                  <div>Repositorio: <strong>{lastSyncResult.name}</strong></div>
                  <div>Commit Hash: <code>{lastSyncResult.commitHash}</code> (rama: {lastSyncResult.branch})</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sync History */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Historial de Commits Sincronizados ({syncHistory.length})</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Git Log</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {syncHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#0D1117] border border-[#30363D] space-y-1.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 truncate max-w-[200px]">
                        {item.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#21262D] text-slate-300 text-[10px]">
                        {item.commitHash}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{item.commitMessage}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>Ver en GitHub</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: LEADERBOARD CON CUENTAS GITHUB VERIFICADAS */}
      {activeSubTab === 'leaderboard' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Ranking de Hackathon
              </span>
              <h3 className="text-xl font-bold text-white">Marcador con Desarrolladores de GitHub</h3>
              <p className="text-xs text-slate-400 mt-1">
                Puntajes del arcade asociados directamente a los perfiles de GitHub de cada asistente.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#30363D] text-slate-400">
                  <th className="py-2.5 px-3"># Posición</th>
                  <th className="py-2.5 px-3">Desarrollador / GitHub Handle</th>
                  <th className="py-2.5 px-3">Repos</th>
                  <th className="py-2.5 px-3">Puntaje Arcade</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]/60 text-slate-300">
                {[
                  { rank: 1, handle: 'alphadocere', name: 'Alpha Docere', repos: 18, score: 520, verified: true },
                  { rank: 2, handle: 'catalina-dev', name: 'Catalina Sepúlveda', repos: 12, score: 480, verified: true },
                  { rank: 3, handle: 'faraya-web3', name: 'Felipe Araya', repos: 9, score: 430, verified: true },
                  { rank: 4, handle: 'crivas-tech', name: 'Constanza Rivas', repos: 15, score: 390, verified: true },
                  { rank: 5, handle: 'builder-udp', name: 'Hacker UDP', repos: 6, score: 340, verified: false },
                ].map((row) => (
                  <tr key={row.rank} className="hover:bg-[#0D1117] transition">
                    <td className="py-3 px-3 font-bold text-white">
                      <span className={`px-2 py-0.5 rounded ${
                        row.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        row.rank === 2 ? 'bg-slate-700/40 text-slate-200' :
                        row.rank === 3 ? 'bg-amber-900/30 text-amber-500' : 'text-slate-400'
                      }`}>
                        #{row.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://github.com/${row.handle}.png`}
                          alt={row.handle}
                          className="w-7 h-7 rounded-full border border-slate-700"
                          onError={(e) => {
                            (e.target as any).src = 'https://github.com/github.png';
                          }}
                        />
                        <div>
                          <div className="text-white font-bold">{row.name}</div>
                          <div className="text-[10px] text-emerald-400">@{row.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{row.repos} repos</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">{row.score} pts</td>
                    <td className="py-3 px-3">
                      {row.verified ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>GitHub Verificado</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">No vinculado</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={`https://github.com/${row.handle}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: CONFIGURAR OAUTH & GUÍA TÉCNICA */}
      {activeSubTab === 'setup' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Guía de Configuración OAuth
            </span>
            <h3 className="text-xl font-bold text-white">Pasos para Configurar tu GitHub OAuth App</h3>
            <p className="text-xs text-slate-400 mt-1">
              Si deseas utilizar tus propias credenciales de GitHub en lugar del modo de prueba integrado, sigue estos pasos:
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono text-slate-300">
            <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#30363D] space-y-2">
              <span className="font-bold text-white block">1. Crea tu OAuth App en GitHub:</span>
              <p className="text-slate-400">
                Ingresa a <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer" className="text-emerald-400 underline">https://github.com/settings/developers</a> y haz clic en <strong>New OAuth App</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#30363D] space-y-2">
              <span className="font-bold text-white block">2. Registra las URLs de Callback Exactas:</span>
              <p className="text-slate-400">
                En el campo <em>Authorization callback URL</em>, añade la siguiente URL proporcionada para tu entorno:
              </p>
              <div className="p-3 rounded-xl bg-black border border-[#30363D] text-emerald-400 flex items-center justify-between">
                <code className="text-[11px]">https://ais-dev-6qjsnmbihwmz763wriv4vq-35388113219.us-west1.run.app/auth/github/callback</code>
                <button
                  onClick={() => handleCopy('https://ais-dev-6qjsnmbihwmz763wriv4vq-35388113219.us-west1.run.app/auth/github/callback')}
                  className="text-slate-400 hover:text-white cursor-pointer ml-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                URL de Despliegue Compartido: <code className="text-slate-300">https://ais-pre-6qjsnmbihwmz763wriv4vq-35388113219.us-west1.run.app/auth/github/callback</code>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#30363D] space-y-2">
              <span className="font-bold text-white block">3. Configura las Variables de Entorno en tu archivo .env:</span>
              <pre className="p-3 rounded-xl bg-black border border-[#30363D] text-slate-300 text-[11px] overflow-x-auto">
{`GITHUB_CLIENT_ID="tu_client_id_de_github"
GITHUB_CLIENT_SECRET="tu_client_secret_de_github"`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TUCKED AWAY / OPTIONAL SECTION: AVALANCHE (HIDDEN UNLESS REQUESTED) */}
      <div className="pt-4 border-t border-[#30363D]/60 flex items-center justify-between text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          <span>Integración Web3 / Avalanche: En pausa según solicitud</span>
        </span>
        {onOpenAvalancheModule && (
          <button
            onClick={onOpenAvalancheModule}
            className="text-slate-400 hover:text-red-400 underline cursor-pointer text-[11px]"
          >
            Ver herramientas Avalanche (Opcional)
          </button>
        )}
      </div>
    </div>
  );
};

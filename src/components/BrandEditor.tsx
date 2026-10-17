import React, { useState } from 'react';
import { VersionedGameConfig, TargetDevice, GameEngineId, QuizQuestion } from '../types/arcade';
import { BRAND_PRESETS, AVAILABLE_ENGINES } from '../data/initialProjects';
import { ArcadeRuntime } from './ArcadeRuntime';
import { 
  Palette, 
  Sliders, 
  Key, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Copy, 
  Check, 
  QrCode, 
  Code2, 
  Trophy, 
  Flame, 
  Zap, 
  Layers, 
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Tv
} from 'lucide-react';

interface BrandEditorProps {
  config: VersionedGameConfig;
  onChangeConfig: (newConfig: VersionedGameConfig) => void;
  onOpenLiveScreen: () => void;
  onOpenJsonViewer: () => void;
}

export const BrandEditor: React.FC<BrandEditorProps> = ({
  config,
  onChangeConfig,
  onOpenLiveScreen,
  onOpenJsonViewer,
}) => {
  const [editorTab, setEditorTab] = useState<'brand' | 'gameplay' | 'access' | 'avalanche'>('brand');
  const [previewDevice, setPreviewDevice] = useState<TargetDevice>('mobile-web');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Helper updaters
  const updateBrand = (partial: Partial<VersionedGameConfig['brand']>) => {
    onChangeConfig({
      ...config,
      brand: { ...config.brand, ...partial },
      project: { ...config.project, updatedAt: new Date().toISOString() },
    });
  };

  const updateColors = (partialColors: Partial<VersionedGameConfig['brand']['colors']>) => {
    onChangeConfig({
      ...config,
      brand: {
        ...config.brand,
        colors: { ...config.brand.colors, ...partialColors },
      },
      project: { ...config.project, updatedAt: new Date().toISOString() },
    });
  };

  const updateGame = (partial: Partial<VersionedGameConfig['game']>) => {
    onChangeConfig({
      ...config,
      game: { ...config.game, ...partial },
      project: { ...config.project, updatedAt: new Date().toISOString() },
    });
  };

  const updateEvent = (partial: Partial<VersionedGameConfig['event']>) => {
    onChangeConfig({
      ...config,
      event: { ...config.event, ...partial },
      project: { ...config.project, updatedAt: new Date().toISOString() },
    });
  };

  const updateAvalanche = (partial: Partial<VersionedGameConfig['integrations']['avalanche']>) => {
    onChangeConfig({
      ...config,
      integrations: {
        ...config.integrations,
        avalanche: { ...config.integrations.avalanche, ...partial },
      },
      project: { ...config.project, updatedAt: new Date().toISOString() },
    });
  };

  const applyPreset = (preset: typeof BRAND_PRESETS[0]) => {
    onChangeConfig({
      ...config,
      brand: {
        ...config.brand,
        colors: preset.colors,
        logoIcon: preset.logoIcon,
        fontFamily: preset.fontFamily,
      },
    });
  };

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/play/${config.deployment.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Quiz question management
  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: 'Nueva Pregunta sobre la Marca',
      options: ['Opción A (Correcta)', 'Opción B', 'Opción C', 'Opción D'],
      correctIndex: 0,
      explanation: 'Explicación del concepto clave.',
    };
    updateGame({
      quizQuestions: [...(config.game.quizQuestions || []), newQ],
    });
  };

  const handleRemoveQuestion = (idx: number) => {
    const updated = [...(config.game.quizQuestions || [])];
    updated.splice(idx, 1);
    updateGame({ quizQuestions: updated });
  };

  const handleUpdateQuestion = (idx: number, updatedQ: QuizQuestion) => {
    const list = [...(config.game.quizQuestions || [])];
    list[idx] = updatedQ;
    updateGame({ quizQuestions: list });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: THE CANVA-STYLE BRAND & GAME EDITOR (7 Cols) */}
      <div className="lg:col-span-7 bg-[#11151F] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Editor Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1">
              <Palette className="w-3.5 h-3.5" />
              <span>Editor de Marca & Evento</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {config.project.name}
            </h2>
            {config.event.lumaUrl && (
              <a
                href={config.event.lumaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-mono mt-1"
              >
                <span>Página en Luma: {config.event.lumaUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenJsonViewer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono transition"
              title="Inspeccionar Schema JSON v1.0.0"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>JSON Schema</span>
            </button>
            <button
              onClick={onOpenLiveScreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Pantalla de Evento</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex overflow-x-auto p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold scrollbar-none gap-1">
          <button
            onClick={() => setEditorTab('brand')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              editorTab === 'brand'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Marca & Estilo</span>
          </button>
          <button
            onClick={() => setEditorTab('gameplay')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              editorTab === 'gameplay'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Reglas & Motor</span>
          </button>
          <button
            onClick={() => setEditorTab('access')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              editorTab === 'access'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Acceso & Acreditación</span>
          </button>
          <button
            onClick={() => setEditorTab('avalanche')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              editorTab === 'avalanche'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Avalanche Web3</span>
          </button>
        </div>

        {/* TAB 1: MARCA & ESTILO */}
        {editorTab === 'brand' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Presets Row */}
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Paletas Rápidas (1-Clic Presets):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BRAND_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition group"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.colors.primary }} />
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.colors.accent }} />
                    </div>
                    <span className="text-[11px] font-bold text-white group-hover:text-red-400 block truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo & Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Nombre de Marca / Logo:
                </label>
                <input
                  type="text"
                  value={config.brand.logoText}
                  onChange={(e) => updateBrand({ logoText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Tipografía:
                </label>
                <select
                  value={config.brand.fontFamily}
                  onChange={(e) => updateBrand({ fontFamily: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-red-500 outline-none"
                >
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Moderna)</option>
                  <option value="Inter">Inter (Limpia Corporativa)</option>
                  <option value="JetBrains Mono">JetBrains Mono (Arcade / Tech)</option>
                </select>
              </div>
            </div>

            {/* Colors Pickers */}
            <div>
              <span className="text-xs font-mono font-bold text-slate-300 uppercase block mb-2">
                Paleta de Colores de la Marca:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Primario</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.brand.colors.primary}
                      onChange={(e) => updateColors({ primary: e.target.value })}
                      className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-white">{config.brand.colors.primary}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Acento</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.brand.colors.accent}
                      onChange={(e) => updateColors({ accent: e.target.value })}
                      className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-white">{config.brand.colors.accent}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Fondo</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.brand.colors.background}
                      onChange={(e) => updateColors({ background: e.target.value })}
                      className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-white">{config.brand.colors.background}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Secundario</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.brand.colors.secondary}
                      onChange={(e) => updateColors({ secondary: e.target.value })}
                      className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-white">{config.brand.colors.secondary}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Titles & Messages */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Título de la Pantalla Principal:
                </label>
                <input
                  type="text"
                  value={config.brand.title}
                  onChange={(e) => updateBrand({ title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Subtítulo / Instrucciones:
                </label>
                <input
                  type="text"
                  value={config.brand.tagline || ''}
                  onChange={(e) => updateBrand({ tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                  Mensaje de Fin de Partida:
                </label>
                <textarea
                  value={config.brand.endMessage}
                  onChange={(e) => updateBrand({ endMessage: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-red-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGLAS & MOTOR */}
        {editorTab === 'gameplay' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Engine Selector */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                Seleccionar Motor de Juego:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {AVAILABLE_ENGINES.slice(0, 3).map((eng) => (
                  <button
                    key={eng.id}
                    onClick={() => updateGame({ engineId: eng.id })}
                    className={`p-3 rounded-xl border text-left transition ${
                      config.game.engineId === eng.id
                        ? 'border-red-500 bg-red-950/40 text-white ring-1 ring-red-500/50'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1">{eng.name}</span>
                    <span className="text-[10px] text-slate-400 block line-clamp-2">
                      {eng.tagline}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration and Difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Duración de Partida:
                </label>
                <select
                  value={config.game.durationSeconds}
                  onChange={(e) => updateGame({ durationSeconds: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                >
                  <option value={15}>15 Segundos (Súper Rápido)</option>
                  <option value={30}>30 Segundos (Recomendado)</option>
                  <option value={45}>45 Segundos</option>
                  <option value={60}>60 Segundos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Dificultad:
                </label>
                <select
                  value={config.game.difficulty}
                  onChange={(e) => updateGame({ difficulty: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                >
                  <option value="easy">Fácil (Para todo público)</option>
                  <option value="normal">Normal (Equilibrado)</option>
                  <option value="hard">Difícil (Competitivo)</option>
                </select>
              </div>
            </div>

            {/* Catch & Collect Specific Rules */}
            {config.game.engineId === 'catch-collect' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-red-400 uppercase block">
                  Reglas de Catch & Collect:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Puntos por Objeto Atrapado:
                    </label>
                    <input
                      type="number"
                      value={config.game.scoring.collectItem ?? 10}
                      onChange={(e) =>
                        updateGame({
                          scoring: { ...config.game.scoring, collectItem: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Penalización por Obstáculo:
                    </label>
                    <input
                      type="number"
                      value={config.game.scoring.penaltyObstacle ?? 15}
                      onChange={(e) =>
                        updateGame({
                          scoring: { ...config.game.scoring, penaltyObstacle: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Brand Quiz Question Manager */}
            {config.game.engineId === 'brand-quiz' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-400 uppercase">
                    Banco de Preguntas del Quiz ({config.game.quizQuestions?.length || 0}):
                  </span>
                  <button
                    onClick={handleAddQuestion}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir Pregunta</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {config.game.quizQuestions?.map((q, qIdx) => (
                    <div key={q.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          #{qIdx + 1}
                        </span>
                        <button
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) =>
                          handleUpdateQuestion(qIdx, { ...q, question: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-slate-800 text-xs text-white"
                        placeholder="Escribe la pregunta..."
                      />

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-1">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctIndex === oIdx}
                              onChange={() => handleUpdateQuestion(qIdx, { ...q, correctIndex: oIdx })}
                              title="Marcar como respuesta correcta"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...q.options];
                                newOpts[oIdx] = e.target.value;
                                handleUpdateQuestion(qIdx, { ...q, options: newOpts });
                              }}
                              className="w-full px-2 py-1 rounded bg-black/40 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACCESO & ACREDITACIÓN */}
        {editorTab === 'access' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                Modo de Acceso para los Asistentes:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => updateEvent({ accessMode: 'open' })}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    config.event.accessMode === 'open'
                      ? 'border-emerald-500 bg-emerald-950/40 text-white ring-1 ring-emerald-500/40'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block text-white mb-1">1. Acceso Abierto</span>
                  <span className="text-[11px] text-slate-400 block">
                    Cualquiera escanea el QR público y juega directamente.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateEvent({ accessMode: 'event_code' })}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    config.event.accessMode === 'event_code'
                      ? 'border-emerald-500 bg-emerald-950/40 text-white ring-1 ring-emerald-500/40'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block text-white mb-1">2. Código de Evento</span>
                  <span className="text-[11px] text-slate-400 block">
                    Requiere un código secreto antes de iniciar partida.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateEvent({ accessMode: 'accredited' })}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    config.event.accessMode === 'accredited'
                      ? 'border-emerald-500 bg-emerald-950/40 text-white ring-1 ring-emerald-500/40'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block text-white mb-1">3. Acreditado (Gafete)</span>
                  <span className="text-[11px] text-slate-400 block">
                    Validación contra lista de identificadores o gafetes.
                  </span>
                </button>
              </div>
            </div>

            {config.event.accessMode === 'event_code' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                  Código Requerido para Jugar:
                </label>
                <input
                  type="text"
                  value={config.event.eventCode || ''}
                  onChange={(e) => updateEvent({ eventCode: e.target.value.toUpperCase() })}
                  placeholder="Ej. SUMMIT2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white uppercase focus:border-red-500 outline-none"
                />
              </div>
            )}

            {config.event.accessMode === 'accredited' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                  Lista de Gafetes / Acreditaciones Válidas (Separados por coma):
                </label>
                <input
                  type="text"
                  value={(config.event.accreditationList || []).join(', ')}
                  onChange={(e) =>
                    updateEvent({
                      accreditationList: e.target.value.split(',').map((s) => s.trim().toUpperCase()),
                    })
                  }
                  placeholder="VIP-001, DEV-99, SPEAKER-12, PRESS-05"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:border-red-500 outline-none"
                />
              </div>
            )}

            {/* Max attempts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Máximo de Intentos por Asistente:
                </label>
                <select
                  value={config.event.maxAttemptsPerPlayer}
                  onChange={(e) => updateEvent({ maxAttemptsPerPlayer: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                >
                  <option value={1}>1 Intento (Máxima Tensión)</option>
                  <option value={3}>3 Intentos (Estándar)</option>
                  <option value={5}>5 Intentos</option>
                  <option value={999}>Ilimitados (Modo Libre)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Identificación en Leaderboard:
                </label>
                <select
                  value={config.leaderboard.displayNameMode}
                  onChange={(e) =>
                    onChangeConfig({
                      ...config,
                      leaderboard: {
                        ...config.leaderboard,
                        displayNameMode: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                >
                  <option value="nickname">Apodo / Gamer Tag</option>
                  <option value="company">Empresa / Proyecto</option>
                  <option value="wallet">Billetera / Ens</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AVALANCHE WEB3 INTEGRATION */}
        {editorTab === 'avalanche' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-start gap-3">
              <Flame className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold font-mono text-red-400 uppercase block">
                  Infraestructura Web3 Opcional con Avalanche:
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Los jugadores <span className="font-bold text-white">no necesitan instalar billeteras cripto</span> para participar. Si activas este módulo, el servidor de Arcade Studio acuñará insignias digitales (PoAP) en Avalanche Fuji o registrará puntuaciones a prueba de manipulaciones usando un Paymaster patrocinado (cero gas para el usuario).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-sm font-bold text-white block">
                  Habilitar Módulo Avalanche
                </span>
                <span className="text-xs text-slate-400">
                  Acuñación de insignias PoAP y verificación on-chain
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.integrations.avalanche.enabled}
                onChange={(e) => updateAvalanche({ enabled: e.target.checked })}
                className="w-5 h-5 accent-red-500 rounded cursor-pointer"
              />
            </div>

            {config.integrations.avalanche.enabled && (
              <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                    Red Avalanche:
                  </label>
                  <select
                    value={config.integrations.avalanche.network || 'avalanche-fuji'}
                    onChange={(e) => updateAvalanche({ network: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="avalanche-fuji">Avalanche Fuji Testnet (Recomendado para eventos)</option>
                    <option value="avalanche-mainnet">Avalanche C-Chain Mainnet</option>
                    <option value="custom-subnet">Subnet Soberana Dedicada (Avalanche9000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">
                    Nombre de la Insignia Digital (Digital Badge PoAP):
                  </label>
                  <input
                    type="text"
                    value={config.integrations.avalanche.badgeName || ''}
                    onChange={(e) => updateAvalanche({ badgeName: e.target.value })}
                    placeholder="Ej. Summit 2026 Champion Badge"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="gasless"
                    checked={config.integrations.avalanche.gaslessRelay}
                    onChange={(e) => updateAvalanche({ gaslessRelay: e.target.checked })}
                    className="accent-red-500 rounded"
                  />
                  <label htmlFor="gasless" className="text-xs text-slate-300">
                    Acuñación patrocinada sin gas para los asistentes (Paymaster ERC-4337)
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: LIVE INTERACTIVE PREVIEW & KIOSK SIMULATOR (5 Cols) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Device Switcher Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#11151F] border border-slate-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPreviewDevice('mobile-web')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                previewDevice === 'mobile-web'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Móvil (QR)</span>
            </button>
            <button
              onClick={() => setPreviewDevice('arcade-kiosk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                previewDevice === 'arcade-kiosk'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Tótem Kiosko</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShareLink}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
              title="Copiar enlace de juego para el evento"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowQrModal(!showQrModal)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
              title="Mostrar Código QR para asistentes"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* QR Code Quick View Overlay */}
        {showQrModal && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3 animate-fadeIn">
            <span className="text-xs font-mono font-bold text-red-400 uppercase block">
              Código QR para Escaneo en Móvil:
            </span>
            <div className="w-36 h-36 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              {/* Scalable Vector QR Code Graphic */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                <rect width="100" height="100" fill="white" />
                <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" fill="black" />
                <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" fill="black" />
                <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" fill="black" />
                <rect x="45" y="15" width="8" height="18" fill="black" />
                <rect x="45" y="45" width="10" height="10" fill="black" />
                <rect x="60" y="55" width="25" height="8" fill="black" />
                <rect x="70" y="70" width="15" height="15" fill="black" />
                <rect x="25" y="45" width="15" height="8" fill="black" />
              </svg>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Los asistentes escanean este QR en el evento y juegan sin instalar nada.
            </p>
          </div>
        )}

        {/* DEVICE FRAME CONTAINER */}
        <div className="flex justify-center">
          {previewDevice === 'mobile-web' ? (
            /* Smartphone Mockup Frame */
            <div className="relative w-full max-w-[340px] aspect-[9/16] max-h-[640px] rounded-[42px] p-3 bg-[#1A1D27] border-4 border-slate-700 shadow-2xl shadow-black/80 flex flex-col justify-between">
              {/* Dynamic Island / Speaker notch */}
              <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-900" />
              </div>

              {/* Game Screen Container */}
              <div className="flex-1 w-full rounded-[28px] overflow-hidden bg-black relative">
                <ArcadeRuntime
                  config={config}
                  targetDevice="mobile-web"
                />
              </div>

              {/* Home bar */}
              <div className="w-28 h-1 bg-white/30 rounded-full mx-auto mt-2 shrink-0" />
            </div>
          ) : (
            /* Kiosk / Arcade Totem Frame */
            <div className="relative w-full max-w-[400px] aspect-[3/4] max-h-[600px] rounded-3xl p-4 bg-gradient-to-b from-slate-900 to-[#121622] border-4 border-red-500/40 shadow-2xl flex flex-col justify-between">
              {/* Kiosk Top Marquee */}
              <div className="text-center pb-2 border-b border-red-500/30 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest">
                  Tótem Kiosko Oficial
                </span>
                <span className="text-[10px] font-mono text-emerald-400">En Línea</span>
              </div>

              {/* Game View */}
              <div className="flex-1 w-full rounded-2xl overflow-hidden bg-black relative my-2">
                <ArcadeRuntime
                  config={config}
                  targetDevice="arcade-kiosk"
                />
              </div>

              {/* Kiosk Footer */}
              <div className="pt-2 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono">
                Pantalla Táctil Activa · Modo Pantalla Completa
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

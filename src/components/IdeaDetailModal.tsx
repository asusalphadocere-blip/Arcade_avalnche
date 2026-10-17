import React, { useState } from 'react';
import { ProjectIdea, PitchSlide } from '../data/featuredIdeas';
import { 
  X, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  Code2, 
  Presentation, 
  Calendar, 
  Award, 
  Download, 
  Share2, 
  ChevronRight, 
  ChevronLeft,
  ExternalLink,
  Flame,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';

interface IdeaDetailModalProps {
  idea: ProjectIdea | null;
  onClose: () => void;
  onOpenDeckFullscreen: (idea: ProjectIdea) => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  onClose,
  onOpenDeckFullscreen,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'code' | 'pitch' | 'hackathon' | 'skills'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  if (!idea) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(idea.smartContractSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(idea.agentPromptSnippet);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const generateMarkdown = () => {
    return `# ${idea.title} - Avalanche Hackathon Proposal
**Track:** ${idea.trackName}
**Subtitle:** ${idea.subtitle}

## The Hook
> "${idea.hook}"

## El Problema
${idea.problem}

## La Solución
${idea.solution}

## Por Qué Avalanche (Unfair Advantage)
${idea.unfairAdvantage}

## Skills de Avaxskills.com Utilizadas
${idea.avaxSkills.map(s => `- **${s.name}**: ${s.description} (\`${s.command}\`)`).join('\n')}

## Flujo de Arquitectura
${idea.architectureSteps.map(s => `${s.stepNumber}. **${s.title}** (${s.tech})\n   ${s.description}`).join('\n\n')}

## Contrato Inteligente / Configuración
\`\`\`solidity
${idea.smartContractSnippet}
\`\`\`

## Prompt para Agentes IA (Cursor / Claude Code)
\`\`\`
${idea.agentPromptSnippet}
\`\`\`

## Plan de Hackathon de 48 Horas
${idea.hackathon48hPlan.map(p => `### ${p.phase} (${p.hours})\n**Hito:** ${p.milestone}\n${p.tasks.map(t => `- [ ] ${t}`).join('\n')}`).join('\n\n')}

## Rúbrica de Jueces
- Innovación: ${idea.rubricScore.innovation}/100
- Factibilidad Técnica: ${idea.rubricScore.technicalFeasibility}/100
- Ajuste Ecosistema Avalanche: ${idea.rubricScore.avaxEcosystemFit}/100
- Potencial de Mercado: ${idea.rubricScore.marketPotential}/100
- **Total:** ${idea.rubricScore.total}/100
- **Veredicto:** ${idea.rubricScore.verdict}
- **Tip para Jueces:** ${idea.judgesTip}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0E121A] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-red-950/80 text-red-400 border border-red-500/40">
              {idea.trackName}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <span>Rubric Score:</span>
              <span className="text-emerald-400 font-bold">{idea.rubricScore.total}/100</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Copiar propuesta completa en formato Markdown"
            >
              {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedMarkdown ? 'Copiado!' : 'Exportar Markdown'}</span>
            </button>
            <button
              onClick={() => onOpenDeckFullscreen(idea)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 transition"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modo Pitch Deck</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="px-6 py-5 bg-gradient-to-b from-slate-900/60 to-transparent border-b border-slate-800/60">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <span>{idea.title}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-red-600 text-white font-mono uppercase font-bold">
              Hackathon Ready
            </span>
          </h2>
          <p className="text-sm text-slate-300 font-medium">
            {idea.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto px-6 bg-slate-950/90 border-b border-slate-800 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Visión & The Hook
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'architecture'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Arquitectura Técnica
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'code'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Contrato & Prompt IA
          </button>
          <button
            onClick={() => setActiveTab('pitch')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'pitch'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            Pitch Deck (6 Slides)
          </button>
          <button
            onClick={() => setActiveTab('hackathon')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'hackathon'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Plan 48h & Rúbrica
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'skills'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Skills CLI ({idea.avaxSkills.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Pitch Hook Callout */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                    <Flame className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono">
                      The Hook para Jueces de Hackathon:
                    </span>
                    <p className="text-base text-white font-medium mt-1 italic">
                      "{idea.hook}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Problem vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono block mb-2">
                    El Problema (Dolor Real en el Mercado):
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {idea.problem}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono block mb-2">
                    Nuestra Solución con Avalanche:
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {idea.solution}
                  </p>
                </div>
              </div>

              {/* Unfair Advantage Callout */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5 mb-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  Por Qué Tiene que Ser Avalanche (Unfair Advantage):
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {idea.unfairAdvantage}
                </p>
              </div>

              {/* Skills Involved Quick View */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block mb-3">
                  Habilidades Clave de avaxskills.com involucradas:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {idea.avaxSkills.map((sk) => (
                    <div key={sk.name} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Terminal className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-xs font-mono font-bold text-white">{sk.name}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{sk.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Pipeline de Arquitectura Técnica</h3>
                <p className="text-xs text-slate-400">
                  Flujo de ejecución de extremo a extremo, diseñado siguiendo las especificaciones de Teleporter, AWM y Subnet-EVM.
                </p>
              </div>

              <div className="relative border-l-2 border-red-500/40 ml-4 pl-6 space-y-6">
                {idea.architectureSteps.map((step) => (
                  <div key={step.stepNumber} className="relative group">
                    {/* Circle badge */}
                    <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-slate-950 border-2 border-red-500 flex items-center justify-center text-xs font-bold font-mono text-white shadow-lg shadow-red-500/20">
                      {step.stepNumber}
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 group-hover:border-slate-700 transition">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="text-sm font-bold text-white">{step.title}</h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {step.tech}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CODE & PROMPT */}
          {activeTab === 'code' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Smart Contract Snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      Smart Contract / Configuración Técnica:
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? '¡Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-black border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-80 scrollbar-thin">
                  <pre>{idea.smartContractSnippet}</pre>
                </div>
              </div>

              {/* Agent Prompt Snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      Prompt para Agentes IA (Cursor / Claude Code / Copilot):
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? '¡Copiado!' : 'Copiar Prompt'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200/90 leading-relaxed">
                  <p>{idea.agentPromptSnippet}</p>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Pega este prompt en tu entorno de desarrollo para que el agente consulte los archivos de <code className="text-red-400 font-mono">avaxskills.com</code> y genere la estructura inicial del proyecto.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PITCH DECK */}
          {activeTab === 'pitch' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Estructura del Pitch Deck (6 Slides)</h3>
                  <p className="text-xs text-slate-400">Diseñado para convencer al panel de jueces en una presentación de 3 a 5 minutos.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
                    disabled={activeSlideIndex === 0}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Slide {activeSlideIndex + 1} de {idea.pitchDeck.length}
                  </span>
                  <button
                    onClick={() => setActiveSlideIndex(Math.min(idea.pitchDeck.length - 1, activeSlideIndex + 1))}
                    disabled={activeSlideIndex === idea.pitchDeck.length - 1}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Slide Display */}
              {(() => {
                const slide = idea.pitchDeck[activeSlideIndex];
                return (
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-[#121622] border border-slate-700/80 shadow-2xl relative min-h-[260px] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono font-bold text-red-400 px-2.5 py-0.5 rounded bg-red-950/60 border border-red-500/30">
                          DIAPOSITIVA #{slide.slideNumber}
                        </span>
                        {slide.callout && (
                          <span className="text-xs font-bold text-amber-300 px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                            {slide.callout}
                          </span>
                        )}
                      </div>
                      <h4 className="text-2xl font-extrabold text-white mb-1">{slide.title}</h4>
                      <p className="text-xs text-slate-400 font-medium mb-6">{slide.tagline}</p>

                      <ul className="space-y-3">
                        {slide.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                            <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-6">
                      <span>{idea.title} Pitch Deck</span>
                      <span>Avalanche Skills Hackathon Edition</span>
                    </div>
                  </div>
                );
              })()}

              {/* Thumbnails */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {idea.pitchDeck.map((sl, i) => (
                  <button
                    key={sl.slideNumber}
                    onClick={() => setActiveSlideIndex(i)}
                    className={`p-2 rounded-xl text-left border transition ${
                      activeSlideIndex === i
                        ? 'border-red-500 bg-red-950/40 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono block text-red-400">Slide {sl.slideNumber}</span>
                    <span className="text-xs font-bold truncate block">{sl.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: HACKATHON PLAN & RUBRIC */}
          {activeTab === 'hackathon' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Rubric Score Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Rúbrica de Evaluación de Jueces:
                    </h3>
                  </div>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    Total: {idea.rubricScore.total} / 100 pts
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Innovación</span>
                    <span className="text-lg font-extrabold text-white">{idea.rubricScore.innovation}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Factibilidad Técnica</span>
                    <span className="text-lg font-extrabold text-white">{idea.rubricScore.technicalFeasibility}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Ajuste Ecosistema AVAX</span>
                    <span className="text-lg font-extrabold text-red-400">{idea.rubricScore.avaxEcosystemFit}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Potencial de Mercado</span>
                    <span className="text-lg font-extrabold text-white">{idea.rubricScore.marketPotential}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic mb-3">
                  <span className="font-bold text-white">Veredicto del Jurado: </span>
                  {idea.rubricScore.verdict}
                </p>

                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Consejo Clave de Jueces de Ava Labs:</span>
                    <span>{idea.judgesTip}</span>
                  </div>
                </div>
              </div>

              {/* 48h Sprint Plan */}
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-400" />
                  Plan de Ejecución de 48 Horas para Hackathon:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {idea.hackathon48hPlan.map((ph, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{ph.phase}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/30">
                          {ph.hours}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-400 font-semibold mb-3">
                        Hito: {ph.milestone}
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {ph.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SKILLS CLI */}
          {activeTab === 'skills' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Skills de <span className="text-red-400 font-mono">avaxskills.com</span> para este Proyecto
                </h3>
                <p className="text-xs text-slate-400">
                  Descarga directamente cada especificación Markdown con curl o haz que tu agente las lea para que conozca los precompiles y contratos oficiales de Avalanche.
                </p>
              </div>

              <div className="space-y-4">
                {idea.avaxSkills.map((sk) => (
                  <div key={sk.name} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white font-mono">{sk.name}</span>
                      <a
                        href={`https://www.avaxskills.com/`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-mono"
                      >
                        <span>Ver en avaxskills</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-slate-300">{sk.description}</p>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black border border-slate-800 font-mono text-xs text-slate-300">
                      <code>{sk.command}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(sk.command);
                        }}
                        className="text-slate-400 hover:text-white p-1"
                        title="Copiar comando"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

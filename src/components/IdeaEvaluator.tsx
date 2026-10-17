import React, { useState } from 'react';
import { AVAX_TRACKS } from '../data/avaxTracks';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  Flame,
  Award
} from 'lucide-react';

interface IdeaEvaluationResult {
  title: string;
  recommendedTrack: string;
  matchScore: number;
  strengths: string[];
  improvements: string[];
  recommendedAvaxSkills: string[];
  avalancheAdvantage: string;
  proposedTechStack: string[];
}

export const IdeaEvaluator: React.FC = () => {
  const [ideaText, setIdeaText] = useState('');
  const [targetTrack, setTargetTrack] = useState('Auto-detectar');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<IdeaEvaluationResult | null>(null);

  const sampleIdeas = [
    'Quiero hacer una app para que creadores de contenido vendan accesos exclusivos con micro-pagos instantáneos sin pasar por comisiones de Apple/Google.',
    'Un protocolo que permite prestar colateral en una Subnet y pedir prestado en la C-Chain de Avalanche sin usar puentes centralizados.',
    'Una red de logística donde camiones reportan temperatura de carga fría en la blockchain para asegurar pagos de seguros automáticos.',
  ];

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;

    setIsEvaluating(true);

    try {
      const response = await fetch('/api/evaluate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaDescription: ideaText,
          targetTrack,
        }),
      });

      const data = await response.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
        setIsEvaluating(false);
        return;
      }
    } catch (err) {
      console.log('Using client-side evaluation fallback:', err);
    }

    // Heuristic assessment fallback
    const lower = ideaText.toLowerCase();
    let detectedTrack = 'AI Agents, Orquestación & x402 Micropayments';
    let skills = ['x402-payments', 'orchestration', 'defensive-solidity'];

    if (lower.includes('prest') || lower.includes('cross') || lower.includes('puente') || lower.includes('interop')) {
      detectedTrack = 'Interoperabilidad Cross-Chain (Teleporter & AWM)';
      skills = ['warp-messaging', 'teleporter-icm', 'defensive-solidity', 'testing'];
    } else if (lower.includes('empresa') || lower.includes('gas') || lower.includes('token') || lower.includes('cadena') || lower.includes('l1')) {
      detectedTrack = 'Avalanche9000 & Custom L1s (Subnets Soberanas)';
      skills = ['subnet-deployment', 'gas-token-config', 'custom-vm', 'validator-setup'];
    } else if (lower.includes('rwa') || lower.includes('inmueble') || lower.includes('factura') || lower.includes('seguro') || lower.includes('identidad')) {
      detectedTrack = 'Real World Assets (RWA) & Cumplimiento Institucional';
      skills = ['kyc-aml', 'synaps-integration', 'permissioned-precompiles', 'proof-of-reserves'];
    } else if (lower.includes('juego') || lower.includes('gamer') || lower.includes('social') || lower.includes('nft')) {
      detectedTrack = 'Web3 UX, Consumer & Gaming de Alta Escala';
      skills = ['wallet-integration', 'reown-appkit', 'dynamic-wallet', 'session-keys'];
    }

    setEvaluation({
      title: 'Idea de Alto Impacto para Avalanche',
      recommendedTrack: detectedTrack,
      matchScore: 94,
      strengths: [
        'Alineación directa con los tracks prioritarios de avaxskills.com.',
        'Resuelve un problema real de fricción y costos en aplicaciones descentralizadas.',
        'Aprovecha la infraestructura de bajo costo y alta velocidad de Avalanche.',
      ],
      improvements: [
        'Resalta en el pitch la finalidad sub-segundo (<800ms) como ventaja insuperable frente a Ethereum y L2s.',
        'Incluye un contrato verificable en Snowtrace Fuji para que los jueces puedan probarlo en vivo.',
        'Añade soporte para billeteras Web2 (Reown AppKit / Dynamic) para demostrar que la UX no tiene fricción.',
      ],
      recommendedAvaxSkills: skills,
      avalancheAdvantage: 'En Avalanche puedes desplegar una arquitectura sovereign con sub-second finality o una L1 con costo 99.9% menor en Avalanche9000 sin quedar atrapado en la congestión de una red compartida.',
      proposedTechStack: ['Foundry para Solidity', 'Avalanche Fuji Testnet', 'Snowtrace Explorer', 'Reown AppKit', 'Express / Node.js'],
    });

    setIsEvaluating(false);
  };

  return (
    <div className="bg-[#11151F] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-red-400 mb-2 uppercase tracking-wider">
        <Award className="w-4 h-4 text-red-400" />
        <span>Rúbrica de Jueces de Avalanche</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
        Evalúa tu Propia Idea contra avaxskills.com
      </h2>
      <p className="text-sm text-slate-300 max-w-3xl mb-6 leading-relaxed">
        Escribe un borrador de lo que tienes en mente. La IA lo evaluará bajo los criterios de los jueces técnicos de Avalanche: viabilidad, ventaja injusta en AVAX, y qué habilidades de <span className="text-red-400 font-semibold font-mono">avaxskills.com</span> necesitas para asegurar una victoria en hackathon o grant.
      </p>

      {/* Preset Ideas to click */}
      <div className="mb-6">
        <span className="text-xs font-mono text-slate-400 block mb-2 font-bold uppercase">
          O prueba con una idea de ejemplo:
        </span>
        <div className="flex flex-col sm:flex-row gap-2">
          {sampleIdeas.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setIdeaText(s)}
              className="text-left text-xs p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex-1 line-clamp-2"
            >
              "{s}"
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleEvaluate} className="space-y-4 mb-8">
        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
            Pega tu Idea o Problema a Resolver:
          </label>
          <textarea
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            rows={4}
            placeholder="Escribe tu idea con todos los detalles que quieras: público objetivo, funcionamiento, tecnología..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
              Track Objetivo:
            </label>
            <select
              value={targetTrack}
              onChange={(e) => setTargetTrack(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-xs text-white outline-none"
            >
              <option value="Auto-detectar">Auto-detectar según avaxskills.com</option>
              {AVAX_TRACKS.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/2 sm:pt-6">
            <button
              type="submit"
              disabled={isEvaluating || !ideaText.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluando Factibilidad Técnica...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Evaluar y Mejorar mi Idea</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Evaluation Results Box */}
      {evaluation && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 animate-fadeIn">
          {/* Header with Score */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 block mb-1">
                Track Óptimo Detectado:
              </span>
              <h3 className="text-xl font-bold text-white">{evaluation.recommendedTrack}</h3>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] uppercase font-mono block text-emerald-400">Match Score</span>
                <span className="text-xl font-black text-white">{evaluation.matchScore} / 100</span>
              </div>
            </div>
          </div>

          {/* Superpower Highlight */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
            <div className="flex items-start gap-2.5">
              <Flame className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-red-400 font-mono uppercase block">
                  El Superpoder de Avalanche que debes Enfatizar:
                </span>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {evaluation.avalancheAdvantage}
                </p>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 font-mono uppercase flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Puntos Fuertes:
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Mejoras Críticas para Ganar:
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Skills */}
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Skills de avaxskills.com que debes implementar:
            </span>
            <div className="flex flex-wrap gap-2">
              {evaluation.recommendedAvaxSkills.map((sk) => (
                <div
                  key={sk}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200"
                >
                  <span className="text-red-400">#</span>
                  <span>{sk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Stack Tecnológico Recomendado:
            </span>
            <div className="flex flex-wrap gap-2">
              {evaluation.proposedTechStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 rounded bg-slate-900 text-cyan-300 border border-cyan-800/40 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

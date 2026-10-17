import React, { useState } from 'react';
import { RAW_AVAX_SKILLS, AvaxSkillItem } from '../data/avaxTracks';
import { Search, Terminal, Copy, Check, ExternalLink, Filter, BookOpen } from 'lucide-react';

export const AvaxSkillsCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'Todos',
    'AI Agents & x402',
    'Avalanche9000 & L1s',
    'Teleporter & Interop',
    'RWA & Compliance',
    'Gaming & UX Consumer',
    'Seguridad & Audit',
  ];

  const filteredSkills = RAW_AVAX_SKILLS.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.keyConcepts.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Todos' || skill.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#11151F] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 mb-1 uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-red-400" />
            <span>Biblioteca de Habilidades para Agentes IA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Catálogo Oficial de <span className="text-red-400 font-mono">avaxskills.com</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Cada skill es un archivo Markdown autocontenido que puedes invocar desde terminal con <code className="text-red-400 font-mono">curl</code> o instruir a Cursor / Claude Code / Copilot para que construyan con los estándares oficiales de Avalanche.
          </p>
        </div>

        <a
          href="https://www.avaxskills.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-white border border-slate-700 text-xs font-mono transition"
        >
          <span>Visitar avaxskills.com</span>
          <ExternalLink className="w-3.5 h-3.5 text-red-400" />
        </a>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, palabra clave o concepto (ej. warp, foundry, x402, genesis)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-red-500 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 flex flex-col justify-between transition group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {skill.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    skill.difficulty === 'Principiante'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : skill.difficulty === 'Intermedio'
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      : 'bg-red-950 text-red-400 border border-red-500/30'
                  }`}
                >
                  {skill.difficulty}
                </span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mb-1 font-mono">
                {skill.name}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {skill.description}
              </p>

              {/* Key Concepts */}
              <div className="mb-4">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
                  Conceptos Técnicos:
                </span>
                <div className="flex flex-wrap gap-1">
                  {skill.keyConcepts.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-slate-400 border border-slate-800 font-mono"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CLI Snippet Box */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between p-2 rounded-lg bg-black border border-slate-800 font-mono text-[11px] text-slate-300">
                <span className="truncate mr-2">{skill.cliSnippet}</span>
                <button
                  onClick={() => handleCopy(skill.id, skill.cliSnippet)}
                  className="text-slate-400 hover:text-white shrink-0 p-1"
                  title="Copiar comando curl"
                >
                  {copiedId === skill.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Installation Guide */}
      <div className="mt-8 p-6 rounded-2xl bg-slate-950 border border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-red-400" />
          Cómo Usar AvaxSkills en tu Flujo de Desarrollo
        </h3>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Puedes instalar el paquete oficial de npm para que tus agentes de IA tengan acceso a las 67 habilidades de Avalanche localmente:
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full p-3 rounded-xl bg-black border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
            <code>npm install avaxskills</code>
            <button
              onClick={() => handleCopy('npm', 'npm install avaxskills')}
              className="text-slate-400 hover:text-white"
            >
              {copiedId === 'npm' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex-1 w-full p-3 rounded-xl bg-black border border-slate-800 font-mono text-xs text-cyan-400 flex items-center justify-between">
            <code>curl -s https://avaxskills.com/skills/all.md</code>
            <button
              onClick={() => handleCopy('curl-all', 'curl -s https://avaxskills.com/skills/all.md')}
              className="text-slate-400 hover:text-white"
            >
              {copiedId === 'curl-all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

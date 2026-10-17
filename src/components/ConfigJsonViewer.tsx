import React, { useState } from 'react';
import { VersionedGameConfig } from '../types/arcade';
import { Copy, Check, Download, X, Code2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ConfigJsonViewerProps {
  config: VersionedGameConfig;
  onClose: () => void;
}

export const ConfigJsonViewer: React.FC<ConfigJsonViewerProps> = ({ config, onClose }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(config, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.deployment.slug || 'game-config'}-v${config.schemaVersion}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0E121A] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Versioned Game Config JSON</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Schema v{config.schemaVersion} Válido</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Desacoplamiento total del motor respecto a la marca y configuración
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* JSON Preview Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-cyan-300/90 bg-black/90 selection:bg-cyan-500 selection:text-black">
          <pre>{jsonString}</pre>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>{config.game.engineId} v{config.game.engineVersion}</span>
          <span>Target: {config.deployment.targets.join(', ')}</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { EventsHistoryFile, EventHistoryEntry } from '../types/arcade';
import { 
  Download, 
  Upload, 
  Copy, 
  Check, 
  X, 
  Calendar, 
  Users, 
  Trophy, 
  FileText, 
  Code2, 
  Sparkles,
  Layers,
  History
} from 'lucide-react';

interface EventHistoryModalProps {
  historyData: EventsHistoryFile;
  onImportHistory: (imported: EventsHistoryFile) => void;
  onClose: () => void;
}

export const EventHistoryModal: React.FC<EventHistoryModalProps> = ({
  historyData,
  onImportHistory,
  onClose,
}) => {
  const [activeView, setActiveView] = useState<'events' | 'json'>('events');
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const jsonString = JSON.stringify(historyData, null, 2);

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
    a.download = `arcade-studio-events-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.events && Array.isArray(parsed.events)) {
          onImportHistory(parsed);
          setImportError(null);
          onClose();
        } else {
          setImportError('El archivo no contiene un formato de historial de eventos válido.');
        }
      } catch (err) {
        setImportError('Error al leer el archivo JSON. Verifica que sea un JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0E121A] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Historial de Eventos JSON</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {historyData.events.length} Eventos Guardados
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Almacena asistentes, tickets asignados, partidas y sorteos realizados
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs mr-2">
              <button
                onClick={() => setActiveView('events')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeView === 'events' ? 'bg-red-600 text-white' : 'text-slate-400'
                }`}
              >
                Eventos
              </button>
              <button
                onClick={() => setActiveView('json')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeView === 'json' ? 'bg-red-600 text-white' : 'text-slate-400'
                }`}
              >
                Ver JSON
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition"
              title="Copiar JSON completo"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition shadow-md shadow-red-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {importError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs">
              {importError}
            </div>
          )}

          {activeView === 'events' ? (
            <div className="space-y-6">
              {/* Event Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {historyData.events.map((evt, idx) => (
                  <div
                    key={evt.projectId}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                          Fecha: {evt.date}
                        </span>
                        <h4 className="text-base font-bold text-white">{evt.eventName}</h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-slate-300 border border-slate-800">
                        {evt.gameEngine}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-2 bg-black/30 rounded-xl border border-white/5">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Asistentes</span>
                        <strong className="text-white">{evt.attendees.length || evt.totalAttendees}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Partidas</span>
                        <strong className="text-emerald-400">{evt.totalGamesPlayed}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Récord</span>
                        <strong className="text-amber-400">{evt.highestScore} pts</strong>
                      </div>
                    </div>

                    {/* Sorteos Realizados */}
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
                        Sorteos Realizados ({evt.raffleHistory?.length || 0}):
                      </span>
                      <div className="space-y-1">
                        {evt.raffleHistory?.map((rf, rIdx) => (
                          <div
                            key={rIdx}
                            className="p-2 rounded-lg bg-black/50 text-[11px] font-mono flex items-center justify-between"
                          >
                            <span className="truncate mr-2 text-slate-300">{rf.title}</span>
                            {rf.winner ? (
                              <span className="text-emerald-400 font-bold shrink-0">
                                Ganador: {rf.winner.ticketCode} ({rf.winner.name})
                              </span>
                            ) : (
                              <span className="text-slate-500 shrink-0">Pendiente</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Event Card Footer Actions */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      {evt.lumaUrl ? (
                        <a
                          href={evt.lumaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 underline"
                        >
                          <span>{evt.lumaUrl}</span>
                          <span className="text-[10px]">↗</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">Evento Local</span>
                      )}

                      <button
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(evt, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${evt.projectId}-historial.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono transition"
                        title="Descargar solo los datos de este evento"
                      >
                        <Download className="w-3 h-3 text-amber-400" />
                        <span>JSON Evento</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload New JSON Area */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Importar Archivo de Historial JSON</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Carga un archivo de historial previo para restaurar eventos, listas de asistentes y sorteos pasados.
                </p>
                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono border border-slate-700 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Seleccionar Archivo .json</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            /* Raw JSON View */
            <div className="p-4 rounded-2xl bg-black font-mono text-xs text-amber-200/90 overflow-x-auto max-h-[60vh] selection:bg-amber-500 selection:text-black">
              <pre>{jsonString}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

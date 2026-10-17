import React, { useState } from 'react';
import { VersionedGameConfig } from '../types/arcade';
import { AirbnbPitchDeckViewer } from './AirbnbPitchDeckViewer';
import { IdeathonLeanPitch } from './IdeathonLeanPitch';
import { 
  Layers, 
  Code2, 
  Server, 
  Smartphone, 
  Tv, 
  Database, 
  ShieldCheck, 
  Flame, 
  ExternalLink,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Presentation,
  Terminal,
  FileCode2,
  Zap,
  Sparkles,
  Award,
  Wallet
} from 'lucide-react';

interface ArchitectureViewProps {
  config: VersionedGameConfig;
  onOpenJsonViewer: () => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ config, onOpenJsonViewer }) => {
  const [subTab, setSubTab] = useState<'lean' | 'pitchdeck' | 'technical' | 'web3'>('lean');

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1">
            <Presentation className="w-4 h-4 text-red-400" />
            <span>Estrategia de Producto, Ideatón & Arquitectura de Software</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {subTab === 'lean' && 'Lean Pitch Ideatón · Arcade Studio'}
            {subTab === 'pitchdeck' && 'Pitch Deck Estilo Airbnb (12 Slides) · Arcade Studio'}
            {subTab === 'technical' && 'Arquitectura Técnica del MVP · Desacoplamiento 2D'}
            {subTab === 'web3' && 'Arquitectura Web3 & Account Abstraction (EIP-4337)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {subTab === 'lean' &&
              'Ficha focalizada en El Problema, Cliente y Usuario Objetivo, Por Qué Avalanche y Entregables de 48h para la Hackathon.'}
            {subTab === 'pitchdeck' &&
              'Presentación completa para inversionistas estructurada bajo la metodología legendaria del pitch deck de Airbnb.'}
            {subTab === 'technical' &&
              'La decisión arquitectónica clave: separar el motor de juego de la configuración de cada cliente para crear decenas de arcades sin duplicar código.'}
          </p>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSubTab('lean')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              subTab === 'lean'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Lean Pitch (Ideatón)</span>
          </button>

          <button
            onClick={() => setSubTab('pitchdeck')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              subTab === 'pitchdeck'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Pitch Airbnb</span>
          </button>

          <button
            onClick={() => setSubTab('technical')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              subTab === 'technical'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Arquitectura Técnica</span>
          </button>

          <button
            onClick={() => setSubTab('web3')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              subTab === 'web3'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-red-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Arquitectura Web3 & PoAP</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LEAN PITCH FOR IDEATHON */}
      {subTab === 'lean' && (
        <IdeathonLeanPitch />
      )}

      {/* VIEW 2: AIRBNB PITCH DECK */}
      {subTab === 'pitchdeck' && (
        <AirbnbPitchDeckViewer />
      )}

      {/* VIEW 3: TECHNICAL SPECIFICATION & MERMAID DATA FLOW */}
      {subTab === 'technical' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Quick Action to open JSON Viewer */}
          <div className="flex justify-end">
            <button
              onClick={onOpenJsonViewer}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Ver Versioned Game Config JSON Actual</span>
            </button>
          </div>

          {/* 3 Capas de Desacoplamiento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-[#11151F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">1. Engine (Motor)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Código 2D (Phaser/Canvas), controles touch/teclado, físicas, bucle de animación y colisiones.
              </p>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-red-300 border border-slate-800 inline-block">
                Inmutable · Reutilizable
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-[#11151F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">2. Configuration</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Duración (ej. 30s), dificultad, puntos por objeto, penalización, preguntas del Quiz y límites de intentos.
              </p>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 inline-block">
                JSON Schema v1.0.0
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-[#11151F] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">3. Theme (Marca)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Logotipos, paleta de colores, tipografías, fondos, mensajes de inicio, victoria y sprites de patrocinadores.
              </p>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800 inline-block">
                Personalizable en minutos
              </span>
            </div>
          </div>

          {/* Visual Flow Pipeline Diagram */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0E14] border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span>Flujo de Ejecución del Sistema</span>
              <span className="text-xs text-slate-500 font-normal">(Mermaid Data Flow)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] text-red-400 font-bold uppercase block">Paso 1: Autoría</span>
                <strong className="text-white block text-sm">Dashboard & Brand Editor</strong>
                <p className="text-slate-400 text-[11px]">
                  El organizador elige motor y personaliza colores y reglas sin programar.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">Paso 2: Formato</span>
                <strong className="text-white block text-sm">Versioned Game Config</strong>
                <p className="text-slate-400 text-[11px]">
                  Genera un JSON inmutable validado con JSON Schema para auditoría.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Paso 3: Destinos</span>
                <strong className="text-white block text-sm">Shared Arcade Runtime</strong>
                <p className="text-slate-400 text-[11px]">
                  Se ejecuta por QR en teléfonos móviles o en tótems kiosko físicos.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Paso 4: Validación</span>
                <strong className="text-white block text-sm">Session & Score Service</strong>
                <p className="text-slate-400 text-[11px]">
                  El servidor valida resultados y actualiza el leaderboard en vivo (+ Avalanche PoAP).
                </p>
              </div>
            </div>
          </div>

          {/* Stack Tecnológico Recomendado */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#11151F] border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white font-mono">
              Stack Tecnológico Recomendado
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Capa</th>
                    <th className="py-2.5 px-3">Tecnología</th>
                    <th className="py-2.5 px-3">Responsabilidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Panel y Editor</td>
                    <td className="py-3 px-3 text-red-400">Next.js + React + Tailwind</td>
                    <td className="py-3 px-3">Crear proyectos, configurar eventos y gestionar plantillas</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Runtime de Juegos</td>
                    <td className="py-3 px-3 text-cyan-400">Phaser + Canvas + TypeScript</td>
                    <td className="py-3 px-3">Renderizar arcades 2D reutilizables ultra ligeros</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">API & Validación</td>
                    <td className="py-3 px-3 text-amber-400">Node.js + Express</td>
                    <td className="py-3 px-3">Sesiones, anti-trampas, resultados y publicación</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Actualización en Vivo</td>
                    <td className="py-3 px-3 text-purple-400">WebSockets / SSE</td>
                    <td className="py-3 px-3">Rankings y pantallas gigantes del evento en tiempo real</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Blockchain (Opcional)</td>
                    <td className="py-3 px-3 text-emerald-400">Avalanche Fuji / Subnets (ERC-4337)</td>
                    <td className="py-3 px-3">Insignias digitales PoAP sin gas y leaderboards verificables</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: WEB3 & ACCOUNT ABSTRACTION ARCHITECTURE */}
      {subTab === 'web3' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-red-500" />
              <span>Avalanche C-Chain & Subnet EIP-4337 Architecture</span>
            </div>
            <h3 className="text-2xl font-black text-white">
              Arquitectura de PoAPs / Badges Sin Costo de Gas (Gasless Minting)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              En eventos presenciales y masivos, exigir a los asistentes instalar MetaMask, guardar seed phrases
              o comprar tokens AVAX destruye el 95% de la conversión. Arcade Studio implementa
              <strong> Abstracción de Cuentas (ERC-4337) y Embedded Wallets</strong> para que la experiencia sea idéntica
              a una aplicación Web2, pero con la custodia criptográfica y verificabilidad de Avalanche.
            </p>
          </div>

          {/* Architecture Diagram Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h4 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
              Flujo de Datos y Transacción Patrocinada:
            </h4>

            {/* Visual Sequence Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold font-mono text-sm">
                  1
                </div>
                <h5 className="font-bold text-white text-sm">Check-in / Fin Partida</h5>
                <p className="text-xs text-slate-400">
                  El jugador solo proporciona su correo electrónico al jugar o acreditarse. No requiere wallet previa.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono text-sm">
                  2
                </div>
                <h5 className="font-bold text-white text-sm">Embedded Wallet (Privy)</h5>
                <p className="text-xs text-slate-400">
                  Se genera silenciosamente una smart wallet counterfactual basada en su correo, sin popups ni extensiones.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono text-sm">
                  3
                </div>
                <h5 className="font-bold text-white text-sm">Paymaster Patrocinador</h5>
                <p className="text-xs text-slate-400">
                  El Paymaster ERC-4337 firma la UserOp y cubre el 100% del gas fee. El usuario paga exactamente $0.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono text-sm">
                  4
                </div>
                <h5 className="font-bold text-white text-sm">Fuji Sub-second &lt;800ms</h5>
                <p className="text-xs text-slate-400">
                  El contrato <code className="text-red-400">ArcadePoapBadge.sol</code> emite el NFT Soulbound con el score y el ID del evento.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h4 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
              Comparativa: Web3 Tradicional vs Arcade Studio Gasless
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-2.5 px-3">Criterio de Experiencia</th>
                    <th className="py-2.5 px-3 text-red-400">Web3 Tradicional (Fricción Alta)</th>
                    <th className="py-2.5 px-3 text-emerald-400">Arcade Studio + Avalanche (Cero Fricción)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Autenticación</td>
                    <td className="py-3 px-3 text-rose-300">Seed phrase de 12 palabras, extensión de navegador</td>
                    <td className="py-3 px-3 text-emerald-300">Correo o Google (Embedded Wallet automática)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Costo para el usuario</td>
                    <td className="py-3 px-3 text-rose-300">Debe fondear AVAX para gas fees</td>
                    <td className="py-3 px-3 text-emerald-300">$0.00 (Gasless patrocinado por Paymaster B2B)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Velocidad de confirmación</td>
                    <td className="py-3 px-3 text-rose-300">15 a 60 segundos (otras L1)</td>
                    <td className="py-3 px-3 text-emerald-300">&lt; 800 milisegundos (Consenso Avalanche Snow)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">Naturaleza del PoAP</td>
                    <td className="py-3 px-3 text-rose-300">Transferible (puede ser revendido o falseado)</td>
                    <td className="py-3 px-3 text-emerald-300">Soulbound Badge verificable en Snowtrace</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

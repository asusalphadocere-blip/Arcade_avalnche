import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Users, 
  Flame, 
  Cpu, 
  Rocket, 
  Copy, 
  Check, 
  Download, 
  ExternalLink,
  Target,
  ShieldCheck,
  Zap,
  Ticket,
  Clock,
  Layers,
  Award
} from 'lucide-react';

export const IdeathonLeanPitch: React.FC = () => {
  const [copiedSpeech, setCopiedSpeech] = useState(false);
  const [copiedDoc, setCopiedDoc] = useState(false);

  const pitchSpeech = `¡Hola a todos! Este es Arcade Studio para el Track de Avalanche:

1. EL PROBLEMA:
Las marcas y organizadores de eventos invierten miles de dólares en merchandising físico desechable y minijuegos publicitarios de un solo uso. La recepción en puerta es aburrida, y las tómbolas de cierre de evento son caóticas y sin trazabilidad.

2. CLIENTE Y USUARIO OBJETIVO:
- Cliente B2B: Organizadores de conferencias, hackathons y marcas en stands (ej. Dev3pack, CMEI UDP, ChileDAO) que necesitan retención y captura de leads calificados.
- Usuario Objetivo: El asistente presencial que se registra en 5 segundos con su correo, recibe su ticket correlativo (#001, #002...) y participa en la partida colectiva desde su móvil.

3. TRACK DE AVALANCHE: GAMING ON-CHAIN EN TIEMPO REAL
"En el track de Avalanche, llevamos los eventos al siguiente nivel con mini juegos por turnos 100% on-chain. Gracias a la velocidad y finalidad sub-segundo de Avalanche (<800ms), cada movimiento o turno de los jugadores en sus teléfonos se procesa en la red y se refleja al instante en la pantalla gigante del escenario. Usamos abstracción de cuenta para que el usuario juegue sin pagar gas ni crear wallets, construyendo una experiencia multijugador transparente, competitiva y visible para toda la audiencia."

4. EJEMPLOS DE MINI JUEGOS POR TURNOS ON-CHAIN:
- Boss Raid Comunal: Toda la sala ataca cooperativamente a un Boss en la pantalla gigante mediante turnos en vivo.
- Trivial / Battle Royale por Turnos: Respuestas simultáneas on-chain con eliminación y podio dinámico por bloque.
- Grid Strategy (La Conquista del Stand): Tablero territorial donde marcas y asistentes conquistan casillas en turnos sucesivos.

5. ¿POR QUÉ ESTO GANA LA IDEATHÓN?
- Avalanche como State Engine: La red opera como el motor de estado del juego durante el evento (no solo un NFT al final).
- Confianza y Anti-trampas: Nadie puede alterar los puntajes ni el orden de los turnos gracias al consenso descentralizado.
- Spectator Hype: Transforma transacciones on-chain en una experiencia visual colectiva que llena el escenario de emoción.`;

  const handleCopySpeech = () => {
    navigator.clipboard.writeText(pitchSpeech);
    setCopiedSpeech(true);
    setTimeout(() => setCopiedSpeech(false), 2000);
  };

  const handleDownloadDoc = () => {
    const md = `# Arcade Studio — Lean Pitch para Ideatón (Avalanche Track)
*Producto para eventos y gamificación de marca construido sobre arquitectura Avalanche*

## 1. El Problema (The Problem)
- **Desperdicio en Activaciones Tradicionales:** Las marcas invierten entre $8.000 y $20.000 USD en desarrollar juegos publicitarios desechables de un solo uso, o regalan folletos y merchandising físico que terminan en la basura.
- **Fricción en la Puerta y Desconexión:** El check-in de llegada en papel o formularios fríos de Google Forms corta la experiencia; no hay interacción entretenida desde el minuto uno.
- **Sorteos Caóticos y Sin Trazabilidad:** Las tómbolas de cierre de evento se hacen con papelitos o planillas manuales, sin transparencia sobre quién asistió realmente o quién merecía ganar según su desempeño.

---

## 2. Cliente y Usuario Objetivo (Customer & Target User)
- **Cliente B2B (Quien paga y decide):**
  - Organizadores de eventos, festivales y conferencias de tecnología.
  - Equipos de marketing de empresas que patrocinan stands y necesitan captar leads calificados.
  - Comunidades universitarias y hackathons (ej. Dev3pack, Mujeres en Ingeniería UDP CMEI, ChileDAO).
- **Usuario Objetivo (El Asistente del evento):**
  - Estudiantes, desarrolladores y asistentes que llegan al recinto.
  - Se registran en 5 segundos con Nombre y Correo -> Obtienen su **Ticket de Sorteo Correlativo (#001, #002...)** -> Juegan 30 segundos en su móvil vía QR o en un tótem arcade táctil -> Participan en la tómbola digital en vivo proyectada en el escenario.

---

## 3. Qué usamos y Por Qué de la Tecnología Avalanche (Why Avalanche?)
### ¿Qué componentes tecnológicos usamos?
- **Avalanche C-Chain / Fuji Testnet:** Para registro verificable de puntajes y tickets de asistencia.
- **Insignias Digitales PoAP (ERC-721 / ERC-1155):** Credenciales de participación inmutables.
- **Account Abstraction (ERC-4337 / Gasless Relayer):** Patrocinio de transacciones en segundo plano para usuarios sin billetera cripto.
- **Patrones de avaxskills.com:** Arquitectura modular desacoplada basada en los tracks oficiales de agentes y subnets.

### ¿Por qué Avalanche y no otra red?
1. **Finalidad Sub-segundo (< 800 ms):** En un evento presencial con cientos de personas en fila, la verificación de llegada y el registro de puntuación deben ser instantáneos. Avalanche ofrece la confirmación más rápida de la industria.
2. **Cero Fricción para Usuarios Web2 (Gasless):** El asistente no necesita descargar MetaMask ni comprar monedas; la experiencia es tan fluida como registrarse en una app web tradicional, pero con custodia descentralizada.
3. **Escalabilidad para Picos de Concurrencia:** Durante los recesos de conferencias, cientos de personas escanean el QR a la vez; Avalanche soporta picos masivos sin aumentos abruptos de comisiones.
4. **Trazabilidad Abierta para Sorteos Justos:** Los números de boletos y las puntuaciones quedan asentadas con sello de tiempo en la blockchain, garantizando que el sorteo sea demostrablemente legítimo.

---

## 4. Qué agregaremos para la Hackathon (48 Hours Build Plan)
1. **Smart Contract \`ArcadeScoreVerifier.sol\` en Fuji:** Validación de puntuaciones con firma criptográfica del backend para evitar trampas en el cliente.
2. **Smart Contract \`EventRaffleTicket.sol\`:** Emisión on-chain de boletos correlativos vinculados al check-in de llegada y al reclamo del PoAP.
3. **Paymaster ERC-4337:** Servidor relayer que patrocina el 100% del gas de los asistentes en Avalanche Fuji.
4. **WebSockets Live Scoreboard & Kiosk:** Tablero gigante en tiempo real que sincroniza las pantallas del escenario con transacciones on-chain.
5. **Widget Embebible / SDK en 1 Línea:** Componente React/HTML que permite incrustar el arcade y el check-in en páginas de Luma o portales de eventos con un simple snippet.
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arcade-studio-lean-pitch-ideathon.md`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Banner Action */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900 to-[#121622] border-2 border-red-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Ficha de Presentación Oficial · Formato Ideatón (3-5 Minutos)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Lean Pitch: Arcade Studio para Ideatón
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Síntesis ejecutiva y técnica enfocada en los 4 ejes requeridos por los jueces: El Problema, Cliente/Usuario, Por qué Avalanche y el Roadmap para la Hackathon.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySpeech}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold border border-slate-700 transition cursor-pointer shadow-md"
            title="Copiar guion oral para el expositor en la ideatón"
          >
            {copiedSpeech ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copiedSpeech ? '¡Guion Copiado!' : 'Copiar Guion Oral (2 min)'}</span>
          </button>

          <button
            onClick={handleDownloadDoc}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition cursor-pointer shadow-lg shadow-red-600/30"
            title="Descargar documento estructurado en Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Markdown</span>
          </button>
        </div>
      </div>

      {/* 4 CORE SECTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* 1. EL PROBLEMA */}
        <div className="p-6 rounded-3xl bg-[#11151F] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-500/30 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>1. El Problema</span>
              </span>
              <span className="text-xs font-mono text-slate-400">$15K+ y 4 semanas</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Los Juegos para Eventos son Desechables y las Operaciones están Desconectadas
            </h3>

            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Costo y desperdicio:</strong> Las marcas gastan $8,000–$20,000 en agencias para minijuegos que se usan 1 día y se botan, o regalan folletos que nadie lee.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Llegada fría en la puerta:</strong> El check-in con planillas de papel o formularios aburridos de Google Forms no genera emoción ni retención.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Sorteos sin trazabilidad:</strong> Las rifas de cierre de evento se hacen con papelitos o tómbolas manuales, sin saber quién asistió realmente o quién merecía ganar.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-amber-400 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
            Impacto: Pérdida del 80% del retorno publicitario en stands y eventos presenciales.
          </div>
        </div>

        {/* 2. CLIENTE Y USUARIO OBJETIVO */}
        <div className="p-6 rounded-3xl bg-[#11151F] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>2. Cliente & Usuario Objetivo</span>
              </span>
              <span className="text-xs font-mono text-slate-400">B2B2C</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Doble Audiencia: Quien Compra la Solución y Quien Juega en el Evento
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <strong className="text-white block font-mono text-xs flex items-center gap-1.5 text-cyan-300">
                  <span>🏢 Cliente B2B (Quien Paga / Decide):</span>
                </strong>
                <p className="text-[11px] text-slate-300">
                  Organizadores de conferencias y hackathons, empresas que pagan stands en expos, y comunidades estudiantiles (ej. <strong>Dev3pack, CMEI UDP, ChileDAO</strong>). Buscan capturar leads calificados y engagement verificable.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <strong className="text-white block font-mono text-xs flex items-center gap-1.5 text-emerald-300">
                  <span>🎮 Usuario Objetivo (El Asistente Presencial):</span>
                </strong>
                <p className="text-[11px] text-slate-300">
                  Llega al recinto, ingresa <strong>Nombre y Correo</strong> en 5 segundos, recibe su <strong>Ticket Correlativo (#001, #002...)</strong>, juega 30 segundos en su móvil o tótem táctil y compite por premios en la tómbola en vivo.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-400 bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-500/20">
            Validado en terreno: 3 eventos activos en Luma probando la plataforma en vivo.
          </div>
        </div>

        {/* 3. QUÉ USAMOS Y POR QUÉ AVALANCHE */}
        <div className="p-6 rounded-3xl bg-[#11151F] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-500/30 uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>3. Qué Usamos y Por Qué Avalanche</span>
              </span>
              <span className="text-xs font-mono text-red-400 font-bold">Fuji / Subnet Ready</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Gaming On-Chain en Tiempo Real: Avalanche como State Engine
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white">Sub-second Finality (&lt; 800ms) para Turnos Fluidos:</strong> Cada jugada o turno en el móvil se valida on-chain y se refleja al instante en la pantalla gigante sin esperas destructivas de 15 segundos.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white">Acciones Visibles (Espectador + Jugador):</strong> Toda la sala ve los ataques y jugadas en vivo ("¡@carlos lanzó un ataque directo! -50 HP al Boss"), generando <em>Spectator Hype</em> colectivo.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white">Abstracción de Cuenta (ERC-4337 sin gas):</strong> El asistente solo ingresa su correo. Un Paymaster en Fuji patrocina el gas; cero necesidad de instalar MetaMask ni comprar AVAX.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-red-500/20 text-[11px] space-y-1">
                <span className="font-bold text-red-400 block font-mono">3 Motores por Turnos:</span>
                <div className="text-slate-300 text-[10px] leading-tight">
                  • <strong>Boss Raid Comunal:</strong> Cooperativo grupal contra el jefe en pantalla.<br/>
                  • <strong>Trivial Battle Royale:</strong> Respuestas simultáneas con eliminación por bloque.<br/>
                  • <strong>Grid Strategy:</strong> Conquista territorial de casillas por turno on-chain.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
            Diferencial Ideatón: La blockchain es el State Engine del evento, no solo un NFT decorativo al final.
          </div>
        </div>

        {/* 4. QUÉ ENTREGAREMOS PARA LA HACKATHON */}
        <div className="p-6 rounded-3xl bg-[#11151F] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30 uppercase flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" />
                <span>4. Roadmap para la Hackathon (48 Horas)</span>
              </span>
              <span className="text-xs font-mono text-amber-300 font-bold">100% Ejecutable</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Entregables Concretos de Código y Smart Contracts
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                <span className="font-mono text-amber-400 font-bold text-xs shrink-0">Hito 1:</span>
                <div>
                  <strong className="text-white">Smart Contract ArcadeScoreVerifier.sol:</strong> Despliegue en Avalanche Fuji con verificación de firmas criptográficas para evitar adulteración de puntajes.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                <span className="font-mono text-amber-400 font-bold text-xs shrink-0">Hito 2:</span>
                <div>
                  <strong className="text-white">Smart Contract EventRaffleTicket.sol:</strong> Emisión de boletos correlativos on-chain vinculados a la billetera efímera generada por el correo del asistente.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                <span className="font-mono text-amber-400 font-bold text-xs shrink-0">Hito 3:</span>
                <div>
                  <strong className="text-white">Gasless Relayer con Paymaster ERC-4337:</strong> Backend configurado para asumir el gas de los participantes en la red de pruebas.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                <span className="font-mono text-amber-400 font-bold text-xs shrink-0">Hito 4:</span>
                <div>
                  <strong className="text-white">Leaderboard & Tómbola Kiosk en Vivo:</strong> Proyección para escenario sincronizada con eventos en cadena y WebSockets.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-amber-400 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
            Resultado final: Demo funcional en vivo con teléfonos de los jueces en la sala.
          </div>
        </div>
      </div>

      {/* QUICK PITCH SCRIPT / SPEECH CHEAT SHEET */}
      <div className="p-6 rounded-3xl bg-[#0D1017] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Guion de Presentación Oral (2 Minutos para el Pitch de la Ideatón)
            </h3>
          </div>
          <button
            onClick={handleCopySpeech}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition cursor-pointer"
          >
            {copiedSpeech ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSpeech ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/5 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
          {pitchSpeech}
        </div>
      </div>
    </div>
  );
};

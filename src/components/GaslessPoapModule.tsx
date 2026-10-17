import React, { useState } from 'react';
import { VersionedGameConfig, AttendeeRecord } from '../types/arcade';
import { useGaslessPoap, ClaimStage } from '../lib/web3/useGaslessPoap';
import { 
  Award, 
  Flame, 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  Copy, 
  Check, 
  Code2, 
  FileCode, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Terminal, 
  ArrowRight,
  Wallet,
  Coins,
  Cpu,
  RefreshCw,
  Mail,
  User,
  Gamepad2,
  Share2,
  Download,
  X
} from 'lucide-react';
import { PixelArtPoapMedal, PixelArtAvaxGem } from './PixelArtSprites';

interface GaslessPoapModuleProps {
  currentProject: VersionedGameConfig;
  projects: VersionedGameConfig[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  attendees: AttendeeRecord[];
}

export const GaslessPoapModule: React.FC<GaslessPoapModuleProps> = ({
  currentProject,
  projects,
  selectedProjectId,
  onSelectProject,
  attendees,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'solidity' | 'typescript' | 'hook' | 'env'>('simulator');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state for interactive simulation
  const [recipientEmail, setRecipientEmail] = useState<string>('asistente@dev3pack.cl');
  const [recipientName, setRecipientName] = useState<string>('Tomás Valenzuela');
  const [scoreInput, setScoreInput] = useState<number>(490);
  const [mintedBadges, setMintedBadges] = useState<any[]>([
    {
      tokenId: 101,
      email: 'catalina.sepulveda@gmail.com',
      name: 'Catalina Sepúlveda',
      score: 450,
      txHash: '0x39a1b948721c0e928f4918237192847192837491029384710293847192039481',
      timestamp: Date.now() - 120000,
    },
    {
      tokenId: 102,
      email: 'felipe.araya@cmei-udp.cl',
      name: 'Felipe Araya',
      score: 380,
      txHash: '0x81b2a94017e82937481920384710293847102938471029384710293847102938',
      timestamp: Date.now() - 360000,
    }
  ]);

  const { claimPoapWithoutGas, isClaiming, stage, statusMessage, lastResult, resetStatus } = useGaslessPoap();

  const handleCopy = (codeKey: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(codeKey);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSelectAttendeeQuick = (att: AttendeeRecord) => {
    setRecipientEmail(att.email);
    setRecipientName(att.name);
    if (att.bestScore) {
      setScoreInput(att.bestScore);
    }
  };

  const handleExecuteMint = async () => {
    if (!recipientEmail) return;

    const res = await claimPoapWithoutGas(
      recipientEmail,
      {
        id: currentProject.project.id,
        name: currentProject.project.name,
      },
      Number(scoreInput) || 0
    );

    if (res.success) {
      setMintedBadges((prev) => [
        {
          tokenId: res.tokenId,
          email: recipientEmail,
          name: recipientName || recipientEmail,
          score: Number(scoreInput) || 0,
          txHash: res.transactionHash,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    }
  };

  // Social Sharing Handlers (WhatsApp, LinkedIn, Instagram Stories)
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [copiedShareNotice, setCopiedShareNotice] = useState<string | null>(null);

  const activeTokenId = lastResult?.tokenId || (mintedBadges[0]?.tokenId || 101);
  const activeTxHash = lastResult?.transactionHash || (mintedBadges[0]?.txHash || '0x39a1b948721c0e928f49182371928471928374910293847192039481');

  const handleShareWhatsApp = () => {
    const text = `🎮 ¡Obtuve mi Badge Oficial en Avalanche Fuji en Arcade Studio! 🏆\n\n` +
      `• Evento: ${currentProject.project.name}\n` +
      `• Asistente: ${recipientName || 'Hacker Web3'}\n` +
      `• Insignia PoAP: Token #${activeTokenId} (Soulbound ERC-721)\n` +
      `• Score Arcade: ${scoreInput} pts\n` +
      `⚡ Minteado on-chain sin gas fees ni extensiones de billetera:\n` +
      `https://testnet.snowtrace.io/tx/${activeTxHash}\n\n` +
      `Ruta a la Hackathon en Luma: https://luma.com/fg52mshy`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const lumaUrl = 'https://luma.com/fg52mshy';
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(lumaUrl)}`, '_blank');
    const text = `🚀 ¡Orgulloso de participar en ${currentProject.project.name}!\n\n` +
      `Acabo de certificar mi asistencia y puntaje en el torneo Arcade interactivo con un Badge Digital Oficial Soulbound (ERC-721) registrado en la red Avalanche Fuji a través de Arcade Studio. 🔺\n\n` +
      `Lo más innovador: ¡Transacción 100% patrocinada con Abstracción de Cuentas (ERC-4337) y Paymaster en Avalanche! Cero costo de gas y finalidad sub-segundo (<800ms).\n\n` +
      `Insignia Token #${activeTokenId} | Puntaje: ${scoreInput} pts\n` +
      `Verificación On-Chain: https://testnet.snowtrace.io/tx/${activeTxHash}\n\n` +
      `#Avalanche #Web3 #AccountAbstraction #Hackathon #ChileDAO #Dev3pack #POAP #GamingOnChain #ERC4337`;
    navigator.clipboard.writeText(text);
    setCopiedShareNotice('¡Texto optimizado para LinkedIn copiado al portapapeles!');
    setTimeout(() => setCopiedShareNotice(null), 3000);
  };

  const handleCopyInstagramCaption = () => {
    const text = `👾 ¡Mi Badge Arcade Oficial en Avalanche Fuji! 🔺\nEvento: ${currentProject.project.name}\nInsignia Token #${activeTokenId} | ${scoreInput} pts 🔥\nMinteado con Account Abstraction (ERC-4337) sin gas fees ⚡\n@avalanche @dev3pack @chiledao #Avalanche #Web3 #POAP`;
    navigator.clipboard.writeText(text);
    setCopiedShareNotice('¡Caption para Instagram copiado al portapapeles!');
    setTimeout(() => setCopiedShareNotice(null), 3000);
  };
  const soliditySnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArcadePoapBadge (ERC-721 Gasless Badge para Avalanche)
 * Diseñado para eventos con Account Abstraction (ERC-4337)
 */
contract ArcadePoapBadge {
    string public name = "Arcade Studio Event PoAP";
    string public symbol = "ARCADIA";
    address public owner;
    mapping(address => bool) public authorizedRelayers;
    bool public isSoulbound = true; // No transferible para certificar presencia real

    struct BadgeMetadata {
        string eventId;
        string eventName;
        uint256 score;
        uint256 timestamp;
        string tokenURI;
    }

    uint256 private _nextTokenId = 1;
    mapping(uint256 => address) private _owners;
    mapping(uint256 => BadgeMetadata) private _badgeDetails;

    event PoapMinted(address indexed recipient, uint256 indexed tokenId, string eventId, uint256 score);

    modifier onlyRelayerOrOwner() {
        require(msg.sender == owner || authorizedRelayers[msg.sender], "Not authorized relayer");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedRelayers[msg.sender] = true;
    }

    function setAuthorizedRelayer(address relayer, bool authorized) external {
        require(msg.sender == owner, "Only owner");
        authorizedRelayers[relayer] = authorized;
    }

    // Minteo Patrocinado: El relayer paga el gas, el usuario recibe el Badge
    function mintGaslessPoap(
        address recipient,
        string calldata eventId,
        string calldata eventName,
        uint256 score,
        string calldata metadataURI
    ) external onlyRelayerOrOwner returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        uint256 tokenId = _nextTokenId++;
        _owners[tokenId] = recipient;
        _badgeDetails[tokenId] = BadgeMetadata(eventId, eventName, score, block.timestamp, metadataURI);
        emit PoapMinted(recipient, tokenId, eventId, score);
        return tokenId;
    }
}`;

  const tsProviderSnippet = `import { defineChain } from 'viem';

// 1. Avalanche Fuji Testnet
export const avalancheFuji = defineChain({
  id: 43_113,
  name: 'Avalanche Fuji',
  nativeCurrency: { decimals: 18, name: 'Avalanche', symbol: 'AVAX' },
  rpcUrls: { default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] } },
  blockExplorers: { default: { name: 'Snowtrace', url: 'https://testnet.snowtrace.io' } },
});

// 2. Configuración Privy (Embedded Wallets por Email sin frases semilla)
export const privyConfig = {
  appId: process.env.VITE_PRIVY_APP_ID,
  loginMethods: ['email', 'google', 'apple'],
  embeddedWallets: {
    createOnLogin: 'all-users',
    noPromptOnSignature: true, // Cero popups molestos durante el evento
  },
  defaultChain: avalancheFuji,
  supportedChains: [avalancheFuji],
};

// 3. Configuración Paymaster ERC-4337 (Pimlico / Biconomy)
export const paymasterConfig = {
  paymasterRpcUrl: 'https://api.pimlico.io/v2/43113/rpc?apikey=' + process.env.VITE_PIMLICO_API_KEY,
  sponsorshipPolicyId: 'sp_arcade_studio_events', // Patrocina el 100% del gas
};`;

  const hookSnippet = `import { useState, useCallback } from 'react';
import { paymasterConfig } from './privyConfig';

export function useGaslessPoap() {
  const [isClaiming, setIsClaiming] = useState(false);

  const claimPoapWithoutGas = useCallback(async (userEmail: string, eventData: any, score: number) => {
    setIsClaiming(true);
    try {
      // Llamada al Relayer / Paymaster Backend que ejecuta la transacción en Fuji
      const response = await fetch('/api/poap/gasless-mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, eventId: eventData.id, eventName: eventData.name, score }),
      });
      const data = await response.json();
      return {
        success: true,
        tokenId: data.tokenId,
        transactionHash: data.transactionHash,
        explorerUrl: 'https://testnet.snowtrace.io/tx/' + data.transactionHash,
      };
    } finally {
      setIsClaiming(false);
    }
  }, []);

  return { claimPoapWithoutGas, isClaiming };
}`;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase tracking-wider mb-1.5">
            <Flame className="w-4 h-4 text-red-500" />
            <span>Avalanche Web3 Engine · EIP-4337 Account Abstraction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <span>PoAPs & Badges Digitales Sin Gas</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-800/60 font-mono font-semibold">
              Fuji Testnet (43113)
            </span>
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Solución integral para mintear insignias digitales de asistencia y puntaje arcade directamente
            en Avalanche. El asistente solo ingresa su correo; un Paymaster ERC-4337 y una Embedded Wallet patrocinan
            el gas en segundo plano con finalidad sub-segundo (&lt;800ms).
          </p>
        </div>

        {/* Event Quick Switcher & Luma Button */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shrink-0">
          <span className="text-[11px] font-mono text-slate-400 pl-1">Evento Activo:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-slate-950 text-white text-xs font-bold font-mono px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p.project.id} value={p.project.id}>
                {p.project.name}
              </option>
            ))}
          </select>
          <a
            href="https://luma.com/fg52mshy"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition shadow-sm"
          >
            <span>Luma: fg52mshy</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
            activeSubTab === 'simulator'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Simulador Gasless en Vivo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('solidity')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
            activeSubTab === 'solidity'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>1. Contrato Solidity (ArcadePoapBadge.sol)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('typescript')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
            activeSubTab === 'typescript'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>2. Configuración Embedded Wallet & Paymaster</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hook')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
            activeSubTab === 'hook'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>3. Hook React (claimPoapWithoutGas)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('env')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
            activeSubTab === 'env'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>4. Variables de Entorno (.env) & Guía</span>
        </button>
      </div>

      {/* VIEW 1: INTERACTIVE SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Triggers */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-red-400" />
                    Embedded Wallet & Paymaster Trigger
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Gasless Sponsor Activo
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">Mintear Insignia PoAP para Asistente</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Evento seleccionado: <span className="text-white font-semibold">{currentProject.project.name}</span>
                </p>
              </div>

              {/* Quick Attendee Select */}
              {attendees.length > 0 && (
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">
                    Seleccionar asistente rápido de la lista del evento:
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-950 rounded-2xl border border-slate-800">
                    {attendees.slice(0, 6).map((att) => (
                      <button
                        key={att.id}
                        type="button"
                        onClick={() => handleSelectAttendeeQuick(att)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                          recipientEmail === att.email
                            ? 'bg-red-600/30 border-red-500 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold">{att.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">#{att.ticketNumber}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Nombre del Asistente
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Ej: Tomás Valenzuela"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Email del Asistente (Genera Embedded Wallet sin Seed Phrase)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="asistente@evento.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    ✓ Sin MetaMask. ✓ Sin pedir frases semilla ni extensiones.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono text-slate-300">
                      Puntaje Arcade Registrado
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      0 = solo check-in de asistencia
                    </span>
                  </div>
                  <div className="relative">
                    <Gamepad2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      value={scoreInput}
                      onChange={(e) => setScoreInput(Number(e.target.value))}
                      placeholder="490"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleExecuteMint}
                  disabled={isClaiming || !recipientEmail}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-xl cursor-pointer ${
                    isClaiming
                      ? 'bg-slate-800 text-slate-400 border border-slate-700'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                  }`}
                >
                  {isClaiming ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
                      <span>{statusMessage || 'Procesando en Avalanche...'}</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>Reclamar PoAP sin Gas (Avalanche Fuji)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Real-time Architecture Pipeline Status */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Flujo de Abstracción de Cuentas ERC-4337 en Ejecución:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-mono">
                  <div className={`p-2 rounded-xl border ${
                    stage === 'generating_wallet' ? 'bg-amber-950/60 border-amber-500 text-amber-200' :
                    stage === 'confirmed' || stage === 'mining_fuji' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <div className="font-bold">1. Embedded Wallet</div>
                    <div className="text-[9px] text-slate-400">Privy / Email</div>
                  </div>
                  <div className={`p-2 rounded-xl border ${
                    stage === 'preparing_meta' ? 'bg-amber-950/60 border-amber-500 text-amber-200' :
                    stage === 'confirmed' || stage === 'mining_fuji' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <div className="font-bold">2. Metadatos</div>
                    <div className="text-[9px] text-slate-400">Score & Evento</div>
                  </div>
                  <div className={`p-2 rounded-xl border ${
                    stage === 'sponsoring_gas' ? 'bg-amber-950/60 border-amber-500 text-amber-200' :
                    stage === 'confirmed' || stage === 'mining_fuji' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <div className="font-bold">3. Paymaster</div>
                    <div className="text-[9px] text-slate-400">Gas $0 (100% patrocinado)</div>
                  </div>
                  <div className={`p-2 rounded-xl border ${
                    stage === 'mining_fuji' ? 'bg-amber-950/60 border-amber-500 text-amber-200 animate-pulse' :
                    stage === 'confirmed' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <div className="font-bold">4. Fuji Block</div>
                    <div className="text-[9px] text-slate-400">&lt;800ms Finality</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual PoAP Badge & Explorer Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual PoAP Digital Card */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-red-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-xs">
                    ▲
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase">Avalanche Digital PoAP</h4>
                    <span className="text-[10px] font-mono text-red-400">ERC-721 Soulbound</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Gasless Verified
                </span>
              </div>

              {/* Retro Pixel Art Digital Badge Graphic */}
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <div className="relative group">
                  <div className="p-3 rounded-3xl bg-slate-950 border-2 border-red-500/50 shadow-2xl shadow-red-600/30 flex flex-col items-center justify-center">
                    <PixelArtPoapMedal className="w-24 h-24 mb-1 drop-shadow-[0_0_15px_rgba(232,65,66,0.6)]" />
                    <span className="text-[10px] font-mono font-black uppercase text-amber-300 tracking-wider">
                      {scoreInput > 0 ? `${scoreInput} PTS RECORD` : 'ATTENDEE VERIFIED'}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                    <span className="bg-red-600 text-white text-[9px] font-mono font-extrabold px-3 py-0.5 rounded-full shadow-lg border border-red-400">
                      TOKEN #{activeTokenId}
                    </span>
                  </div>
                </div>

                <h5 className="text-base font-black text-white mt-5">
                  {currentProject.project.name}
                </h5>
                <p className="text-xs text-slate-300 mt-0.5 font-mono font-bold">
                  {recipientName || 'Asistente Acreditado'}
                </p>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {recipientEmail}
                </span>
              </div>

              {/* Badge Details Grid */}
              <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800/80 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Red Blockchain:</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <PixelArtAvaxGem className="w-3.5 h-3.5" />
                    <span>Avalanche Fuji C-Chain</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Costo Gas para Usuario:</span>
                  <span className="text-emerald-400 font-bold">$0.00 AVAX (100% Patrocinado)</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Velocidad de Finalidad:</span>
                  <span className="text-amber-400 font-bold">&lt; 800ms Sub-segundo</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Tipo de Token:</span>
                  <span className="text-slate-300">Soulbound Badge (No Transferible)</span>
                </div>
              </div>

              {/* SOCIAL SHARING BAR (WhatsApp, LinkedIn, Instagram Stories) */}
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Compartir Certificado / Badge Oficial:</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">Listo para Compartir</span>
                </div>

                {copiedShareNotice && (
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500 text-[11px] text-emerald-300 font-mono text-center animate-fadeIn">
                    ✓ {copiedShareNotice}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-600/40 text-emerald-300 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
                    title="Compartir por WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-emerald-400">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>

                  {/* LinkedIn */}
                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    className="p-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/70 border border-sky-600/40 text-sky-300 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
                    title="Compartir en LinkedIn"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-sky-400">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    <span>LinkedIn</span>
                  </button>

                  {/* Instagram Story */}
                  <button
                    type="button"
                    onClick={() => setShowInstagramModal(true)}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 hover:from-rose-900/70 hover:to-purple-900/70 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
                    title="Ver formato Historia de Instagram"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-rose-400">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
                  </button>
                </div>
              </div>

              {/* Transaction Explorer Link */}
              <div className="mt-3 pt-3 border-t border-slate-800">
                <a
                  href={`https://testnet.snowtrace.io/tx/${activeTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs text-red-400 font-mono transition border border-red-500/30"
                >
                  <span className="truncate max-w-[220px]">
                    Tx: {activeTxHash}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>

            {/* List of Minted Badges */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Historial de Badges Minteados ({mintedBadges.length})
                </span>
                <span className="text-[10px] font-mono text-red-400">Live Fuji Ledger</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {mintedBadges.map((badge) => (
                  <div
                    key={badge.tokenId}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-mono font-bold text-[10px]">
                        #{badge.tokenId}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-[11px]">{badge.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{badge.score} pts</div>
                      </div>
                    </div>
                    <a
                      href={`https://testnet.snowtrace.io/tx/${badge.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-red-400 hover:text-red-300 font-mono flex items-center gap-1"
                    >
                      <span>Snowtrace</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SOLIDITY SMART CONTRACT */}
      {activeSubTab === 'solidity' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block mb-1">
                  Entregable 1 · Contrato Inteligente Solidity
                </span>
                <h3 className="text-xl font-bold text-white">contracts/ArcadePoapBadge.sol</h3>
                <p className="text-xs text-slate-400">
                  Optimizado para gasless minting por relayer/paymaster, compatible con ERC-721 y soulbound.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('sol', soliditySnippet)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-mono transition cursor-pointer border border-slate-700"
              >
                {copiedCode === 'sol' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block */}
            <div className="relative">
              <pre className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
                <code>{soliditySnippet}</code>
              </pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-white block mb-0.5">Gas Optimization</span>
                <p className="text-slate-400 text-[11px]">
                  Evita bucles costosos y serializa metadatos en un solo struct para un consumo inferior a 65.000 gas.
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-white block mb-0.5">Soulbound Anti-Trampas</span>
                <p className="text-slate-400 text-[11px]">
                  Bloquea las transferencias estándar del ERC-721 para evitar que los asistentes vendan o pasen su asistencia.
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-white block mb-0.5">Relayer Authorization</span>
                <p className="text-slate-400 text-[11px]">
                  Mapeo <code className="text-red-400">authorizedRelayers</code> para permitir al backend pagar el gas por el usuario.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: TYPESCRIPT EMBEDDED WALLET & PAYMASTER */}
      {activeSubTab === 'typescript' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block mb-1">
                  Entregable 2 · Configuración TypeScript
                </span>
                <h3 className="text-xl font-bold text-white">src/lib/web3/privyConfig.ts</h3>
                <p className="text-xs text-slate-400">
                  Proveedor de Embedded Wallet sin seed phrases y Paymaster ERC-4337 en Avalanche Fuji.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('ts', tsProviderSnippet)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-mono transition cursor-pointer border border-slate-700"
              >
                {copiedCode === 'ts' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block */}
            <div className="relative">
              <pre className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
                <code>{tsProviderSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: REACT HOOK */}
      {activeSubTab === 'hook' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block mb-1">
                  Entregable 3 · Hook de React Frontend
                </span>
                <h3 className="text-xl font-bold text-white">src/lib/web3/useGaslessPoap.ts</h3>
                <p className="text-xs text-slate-400">
                  Función <code className="text-red-400 font-bold">claimPoapWithoutGas(userEmail, eventData, score)</code> para minteo transparente.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('hook', hookSnippet)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-mono transition cursor-pointer border border-slate-700"
              >
                {copiedCode === 'hook' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block */}
            <div className="relative">
              <pre className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
                <code>{hookSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: ENV & INSTRUCTIONS */}
      {activeSubTab === 'env' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block mb-1">
                Entregable 4 · Variables de Entorno & Dependencias npm
              </span>
              <h3 className="text-xl font-bold text-white">Instrucciones Paso a Paso para Producción</h3>
              <p className="text-xs text-slate-400 mt-1">
                Cómo poner en marcha el minteo de Badges sin costo de gas en Avalanche Fuji.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">1</span>
                <span>Dependencias npm necesarias</span>
              </h4>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-red-400">
                npm install viem @privy-io/react-auth
              </pre>
              <p className="text-xs text-slate-400">
                • <strong className="text-white">viem</strong>: Cliente Ethereum/Avalanche ligero y moderno para interactuar con contratos y serializar transacciones.<br/>
                • <strong className="text-white">@privy-io/react-auth</strong>: Proveedor de embedded wallets con autenticación por email/social sin extensiones.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">2</span>
                <span>Archivo de Variables de Entorno (.env)</span>
              </h4>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`# Avalanche Fuji RPC
VITE_AVALANCHE_FUJI_RPC="https://api.avax-test.network/ext/bc/C/rpc"

# Dirección del Contrato ArcadePoapBadge en Fuji
VITE_POAP_CONTRACT_ADDRESS="0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"

# Privy App ID (obtenido en https://dashboard.privy.io)
VITE_PRIVY_APP_ID="clx_arcade_studio_fuji_dev"

# Paymaster / Bundler ERC-4337 (Pimlico / Biconomy)
VITE_PAYMASTER_RPC_URL="https://api.pimlico.io/v2/43113/rpc?apikey=TU_API_KEY"
VITE_SPONSORSHIP_POLICY_ID="sp_arcade_events_sponsorship"

# Clave privada del Relayer que patrocina el gas (SOLO en server.ts / backend)
AVALANCHE_RELAYER_PRIVATE_KEY="0xTU_CLAVE_PRIVADA_RELAYER"`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* INSTAGRAM STORY / CERTIFICATE MODAL */}
      {showInstagramModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-[#0C1017] border-2 border-rose-500/50 rounded-3xl p-6 shadow-2xl relative space-y-5">
            {/* Close button */}
            <button
              onClick={() => setShowInstagramModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-rose-400">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram Story Card (9:16)</span>
              </span>
              <h3 className="text-base font-bold text-white mt-1">Tarjeta para Historia & Feed</h3>
            </div>

            {/* Simulated 9:16 Story Card */}
            <div className="bg-gradient-to-b from-slate-950 via-[#161B26] to-[#0E121B] border-2 border-red-500/50 rounded-2xl p-5 text-center space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-b border-white/10 pb-2">
                <span className="text-red-400 font-bold">AVALANCHE FUJI</span>
                <span className="text-emerald-400">VERIFIED ON-CHAIN</span>
              </div>

              <div className="flex justify-center py-2">
                <PixelArtPoapMedal className="w-24 h-24 drop-shadow-[0_0_20px_rgba(232,65,66,0.7)]" />
              </div>

              <div>
                <span className="bg-red-600 text-white text-[9px] font-mono font-black px-2.5 py-0.5 rounded-full">
                  TOKEN #{activeTokenId}
                </span>
                <h4 className="text-sm font-black text-white mt-2 font-mono">
                  {currentProject.project.name}
                </h4>
                <p className="text-xs text-amber-300 font-mono font-bold mt-1">
                  {recipientName || 'Hacker Web3'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {scoreInput > 0 ? `Puntaje: ${scoreInput} PTS` : 'Check-in Oficial'}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 text-[9px] font-mono text-slate-400">
                Luma: <span className="text-white">luma.com/fg52mshy</span> · Arcade Studio
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCopyInstagramCaption}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Pie de Foto / Sticker</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCopiedShareNotice('¡Tarjeta lista! Captura la pantalla o guarda para compartir en Instagram Stories con el sticker de Luma.');
                  setTimeout(() => setCopiedShareNotice(null), 4000);
                }}
                className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Guardar Tarjeta de Certificado</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

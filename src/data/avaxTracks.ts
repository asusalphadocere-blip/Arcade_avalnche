export interface AvaxSkillItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  cliSnippet: string;
  keyConcepts: string[];
}

export interface AvaxTrack {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  iconName: string;
  badgeColor: string;
  skillsCount: number;
  highlightSkills: string[];
  whyAvalanche: string;
  hackathonPotential: 'Extremo' | 'Muy Alto' | 'Alto';
  targetUseCases: string[];
}

export const AVAX_TRACKS: AvaxTrack[] = [
  {
    id: 'ai-agents-x402',
    name: 'AI Agents, Orquestación & x402 Micropayments',
    shortName: 'AI Agents & x402',
    tagline: 'Agentes autónomos pagando por cómputo y coordinando transacciones on-chain',
    description: 'Aprovecha la sub-second finality de Avalanche para habilitar agentes de IA que pagan microtransacciones HTTP 402 en tiempo real, coordinan flujos multi-agente y ejecutan contratos sin intervención humana.',
    iconName: 'Bot',
    badgeColor: 'from-amber-500 to-red-500',
    skillsCount: 14,
    highlightSkills: ['orchestration', 'x402-payments', 'agent-tooling', 'autonomous-treasury', 'intent-execution'],
    whyAvalanche: 'Finalidad determinista sub-segundo (<800ms) y tarifas predecibles en la C-Chain o Subnet dedicada, crucial para que los agentes no se queden bloqueados esperando confirmaciones de bloques lentas.',
    hackathonPotential: 'Extremo',
    targetUseCases: ['APIs monetizadas por llamada para LLMs', 'Enjambre de agentes de arbitraje', 'Gestión autónoma de tesorerías DAO', 'Mercados de datos máquina a máquina'],
  },
  {
    id: 'avalanche9000-subnets',
    name: 'Avalanche9000 & Custom L1s (Subnets Soberanas)',
    shortName: 'Avalanche9000 & L1s',
    tagline: 'Crea tu propia blockchain L1 con costo 99.9% menor y token de gas nativo',
    description: 'Con la actualización Avalanche9000 (Etna), desplegar una L1 soberana es hasta un 99.9% más económico. Configura tu propio token de gas, reglas de validadores, precompiles personalizadas y escalabilidad infinita.',
    iconName: 'Layers',
    badgeColor: 'from-red-600 to-rose-700',
    skillsCount: 18,
    highlightSkills: ['subnet-deployment', 'custom-vm', 'subnet-evm', 'gas-token-config', 'precompiles-builder', 'validator-setup'],
    whyAvalanche: 'Soberanía absoluta sin los costos de fragmentación de rollups: consenso Snowman rápido, interoperabilidad nativa vía Teleporter y control total de la economía de gas.',
    hackathonPotential: 'Extremo',
    targetUseCases: ['L1 empresarial con token de gas en stablecoin', 'Cadena de alta frecuencia para gaming', 'Appchain de compliance institucional', 'Blockchain privada para consorcios'],
  },
  {
    id: 'teleporter-interop',
    name: 'Interoperabilidad Cross-Chain (Teleporter & AWM)',
    shortName: 'Teleporter & AWM',
    tagline: 'Comunicación y liquidez cross-subnet sin puentes vulnerables con firmas BLS',
    description: 'Avalanche Warp Messaging (AWM) permite a cualquier subred comunicarse nativamente verificando criptográficamente las firmas BLS de los validadores. Teleporter añade la capa de protocolo para llamadas de contratos y transferencias atómicas.',
    iconName: 'Network',
    badgeColor: 'from-cyan-500 to-blue-600',
    skillsCount: 12,
    highlightSkills: ['warp-messaging', 'teleporter-icm', 'cross-chain-token', 'arbitrary-call-relay', 'bls-security'],
    whyAvalanche: 'Elimina el vector de ataque #1 en Web3 (hacks de puentes cross-chain). La seguridad proviene del propio set de validadores de Avalanche, no de multisigs externas.',
    hackathonPotential: 'Muy Alto',
    targetUseCases: ['Bóvedas de rendimiento multichain', 'Comercio omni-cadena de NFTs', 'Préstamos respaldados por colateral en otra Subnet', 'Gobernanza unificada entre L1s'],
  },
  {
    id: 'rwa-compliance',
    name: 'Real World Assets (RWA) & Cumplimiento Institucional',
    shortName: 'RWA & Compliance',
    tagline: 'Tokenización de activos del mundo real con KYC/AML integrado en la L1',
    description: 'Integra proveedores de identidad como Synaps y Fractal para emitir y negociar activos regulados (bienes raíces, bonos, crédito privado, fondos) en L1s con precompiles de restricción de transferencias.',
    iconName: 'Building2',
    badgeColor: 'from-emerald-500 to-teal-700',
    skillsCount: 9,
    highlightSkills: ['kyc-aml', 'synaps-integration', 'fractal-id', 'permissioned-precompiles', 'proof-of-reserves', 'rwa-tokenization'],
    whyAvalanche: 'Avalanche es la red elegida por instituciones (Citi, JPMorgan Onyx, WisdomTree, Wellington) gracias a la capacidad de crear Subnets permisionadas donde solo carteras validadas pueden transaccionar.',
    hackathonPotential: 'Muy Alto',
    targetUseCases: ['Tokenización de facturas comerciales B2B', 'Fondo de crédito privado institucional', 'Mercado secundario de activos inmobiliarios', 'Bonos tokenizados con pago de cupón automático'],
  },
  {
    id: 'nextgen-defi',
    name: 'Next-Gen DeFi & Subnet Liquidity Mesh',
    shortName: 'Next-Gen DeFi',
    tagline: 'Mercados líquidos, derivados de alta velocidad y agregación de rendimiento',
    description: 'Diseña protocolos DeFi de vanguardia con oráculos de ultra baja latencia (Pyth, Chainlink), liquid staking derivado (sAVAX), flash-loans eficientes y distribución de liquidez entre L1s federadas.',
    iconName: 'TrendingUp',
    badgeColor: 'from-violet-500 to-purple-700',
    skillsCount: 11,
    highlightSkills: ['defi-amm', 'pyth-oracles', 'chainlink-data', 'liquid-staking-savax', 'lending-market', 'dynamic-fee-pools'],
    whyAvalanche: 'Elimina las pérdidas por arbitraje y MEV tóxico gracias a la finalidad rápida y permite aislar el riesgo financiero en L1s especializadas sin congestionar la C-Chain.',
    hackathonPotential: 'Muy Alto',
    targetUseCases: ['DEX con libro de órdenes on-chain en L1 dedicada', 'Protocolo de lending con liquidaciones sin latencia', 'Sintéticos de materias primas con Pyth', 'Derivados de staking de validadores'],
  },
  {
    id: 'gaming-consumer-ux',
    name: 'Web3 UX, Consumer & Gaming de Alta Escala',
    shortName: 'Gaming & UX Consumer',
    tagline: 'Experiencias sin gas (gasless), login social y sesiones efímeras sin fricción',
    description: 'Crea dApps y juegos que se sienten como Web2: integración con Reown AppKit, Dynamic y wagmi, Account Abstraction (ERC-4337), sesiones efímeras y gasless transactions patrocinadas por paymasters.',
    iconName: 'Gamepad2',
    badgeColor: 'from-pink-500 to-rose-600',
    skillsCount: 8,
    highlightSkills: ['wallet-integration', 'reown-appkit', 'dynamic-wallet', 'account-abstraction', 'gasless-paymasters', 'session-keys'],
    whyAvalanche: 'Los juegos y apps de consumo mueren si los usuarios tienen que firmar cada clic o pagar $2 de gas. Las subnets de Avalanche permiten transacciones gratuitas con microsegundos de respuesta.',
    hackathonPotential: 'Alto',
    targetUseCases: ['Juego casual de cartas con miles de movimientos gratuitos', 'App social con micro-recompensas en segundo plano', 'Marketplace de entradas con login social de Google/Apple', 'Fidelización de marcas con billeteras invisibles'],
  },
  {
    id: 'security-audit-testing',
    name: 'Defensive Security, QA & Testing con Foundry',
    shortName: 'Seguridad, QA & Audit',
    tagline: 'Solidity defensivo, fuzzing automatizado y checklists pre-mainnet Fuji',
    description: 'Especialízate en la seguridad de smart contracts en Avalanche: pruebas de fuzzing con Foundry, modelos de confianza en Warp Messaging, prevención de reentrancy cross-subnet y listas de control de Fuji a Mainnet.',
    iconName: 'ShieldAlert',
    badgeColor: 'from-blue-600 to-indigo-800',
    skillsCount: 7,
    highlightSkills: ['defensive-solidity', 'testing-foundry', 'fork-testing', 'audit-prompts', 'fuji-to-mainnet-qa', 'warp-threat-model'],
    whyAvalanche: 'La interoperabilidad cross-subnet introduce nuevos vectores como validación asíncrona de mensajes y front-running de relayers. Dominar la seguridad en Avalanche es una ventaja técnica inmensa.',
    hackathonPotential: 'Muy Alto',
    targetUseCases: ['Herramienta de auditoría continua en CI/CD para Subnets', 'Canario de monitoreo de Warp messages en vivo', 'Suite de fuzzing para contratos Teleporter', 'Framework de pruebas fork de la C-Chain'],
  },
];

export const RAW_AVAX_SKILLS: AvaxSkillItem[] = [
  {
    id: 'x402-payments',
    name: 'x402 HTTP Micropayments',
    slug: 'x402-payments',
    category: 'AI Agents & x402',
    difficulty: 'Intermedio',
    description: 'Implementación del estándar HTTP 402 Payment Required para monetizar APIs con micropagos instantáneos en AVAX.',
    cliSnippet: 'curl -s https://avaxskills.com/skills/x402-payments.md',
    keyConcepts: ['HTTP 402 Status', 'Sub-second verification', 'Pre-authorized EIP-712 vouchers', 'API Gateways'],
  },
  {
    id: 'orchestration',
    name: 'Multi-Agent Orchestration',
    slug: 'orchestration',
    category: 'AI Agents & x402',
    difficulty: 'Avanzado',
    description: 'Patrones de coordinación entre agentes autónomos con carteras compartidas y arbitraje de tareas.',
    cliSnippet: 'curl -s https://avaxskills.com/skills/orchestration.md',
    keyConcepts: ['Agent swarms', 'Multi-sig delegation', 'On-chain task escrow', 'Fallback resolution'],
  },
  {
    id: 'subnet-deployment',
    name: 'Subnet Genesis to Mainnet',
    slug: 'subnet-deployment',
    category: 'Avalanche9000 & L1s',
    difficulty: 'Avanzado',
    description: 'Guía integral para inicializar, configurar el genesis block y desplegar un L1 en Avalanche9000.',
    cliSnippet: 'curl -s https://avaxskills.com/skills/subnet-deployment.md',
    keyConcepts: ['Genesis.json', 'Avalanche CLI', 'Etna upgrade', 'Custom Gas Token', 'Validator Staking'],
  },
  {
    id: 'warp-messaging',
    name: 'Avalanche Warp Messaging (AWM)',
    slug: 'warp-messaging',
    category: 'Teleporter & Interop',
    difficulty: 'Avanzado',
    description: 'Envío y verificación de mensajes criptográficos entre subredes usando firmas agregadas BLS.',
    cliSnippet: 'curl -s https://avaxskills.com/skills/warp-messaging.md',
    keyConcepts: ['BLS Signatures', 'P-Chain validator registry', 'Message Payload', 'Verification precompile'],
  },
  {
    id: 'teleporter-icm',
    name: 'Teleporter Cross-Chain Messaging',
    slug: 'teleporter-icm',
    category: 'Teleporter & Interop',
    difficulty: 'Intermedio',
    description: 'Uso del protocolo Teleporter para llamadas directas de contrato a contrato entre L1s.',
    cliSnippet: 'curl -s https://avaxskills.com/skills/teleporter.md',
    keyConcepts: ['ITeleporterMessenger', 'Relayer incentives', 'Cross-chain execution', 'Retry mechanism'],
  },
  {
    id: 'kyc-aml',
    name: 'On-Chain KYC/AML Integration',
    slug: 'kyc-aml',
    category: 'RWA & Compliance',
    difficulty: 'Intermedio',
    description: 'Integración de identidades verificadas (Synaps, Fractal) con smart contracts y precompiles restrictivos.',
    cliSnippet: 'curl -s https://avaxskills.com/skills/kyc-aml.md',
    keyConcepts: ['Zero-Knowledge proofs of identity', 'Synaps Webhook', 'Allowlist contracts', 'Transfer restrictions'],
  },
  {
    id: 'wallet-integration',
    name: 'Reown AppKit & Dynamic Wallets',
    slug: 'wallet-integration',
    category: 'Gaming & UX Consumer',
    difficulty: 'Principiante',
    description: 'Configuración de Reown AppKit, Dynamic y wagmi para compatibilidad total con Avalanche C-Chain y Subnets.',
    cliSnippet: 'curl -s https://avaxskills.com/skills/wallet-integration.md',
    keyConcepts: ['Core Wallet', 'MetaMask chain switching', 'EIP-6963 discovery', 'Custom RPC failover'],
  },
  {
    id: 'defensive-solidity',
    name: 'Defensive Solidity for Avalanche',
    slug: 'defensive-solidity',
    category: 'Seguridad & Audit',
    difficulty: 'Avanzado',
    description: 'Patrones de código seguro para evitar reentrancias cross-subnet y fallos de relayers en Teleporter.',
    cliSnippet: 'curl -s https://avaxskills.com/skills/defensive-solidity.md',
    keyConcepts: ['Cross-chain reentrancy', 'Replay protection', 'Fee-on-transfer safety', 'Invariant checks'],
  },
  {
    id: 'testing-foundry',
    name: 'Testing with Foundry & Forking',
    slug: 'testing',
    category: 'Seguridad & Audit',
    difficulty: 'Intermedio',
    description: 'Unit testing, fuzzing y fork testing de la C-Chain y Fuji usando la suite de Foundry.',
    cliSnippet: 'curl -s https://avaxskills.com/skills/testing.md',
    keyConcepts: ['Forge test', 'Fuzz testing invariants', 'Fuji RPC fork', 'Gas profiling'],
  },
];

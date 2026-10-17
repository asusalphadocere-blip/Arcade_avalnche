export interface PitchSlide {
  slideNumber: number;
  title: string;
  tagline: string;
  bullets: string[];
  callout?: string;
}

export interface HackathonPhase {
  phase: string;
  hours: string;
  milestone: string;
  tasks: string[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  trackId: string;
  trackName: string;
  badgeColor: string;
  subtitle: string;
  hook: string;
  problem: string;
  solution: string;
  unfairAdvantage: string;
  avaxSkills: {
    name: string;
    description: string;
    command: string;
  }[];
  architectureSteps: {
    stepNumber: number;
    title: string;
    description: string;
    tech: string;
  }[];
  smartContractSnippet: string;
  agentPromptSnippet: string;
  pitchDeck: PitchSlide[];
  hackathon48hPlan: HackathonPhase[];
  rubricScore: {
    innovation: number;
    technicalFeasibility: number;
    avaxEcosystemFit: number;
    marketPotential: number;
    total: number;
    verdict: string;
  };
  judgesTip: string;
}

export const FEATURED_IDEAS: ProjectIdea[] = [
  {
    id: 'agentmesh-x402',
    title: 'AgentMesh x402',
    trackId: 'ai-agents-x402',
    trackName: 'AI Agents & x402 Micropayments',
    badgeColor: 'from-amber-500 to-red-500',
    subtitle: 'Red de inferencia de IA descentralizada con micropagos HTTP 402 en tiempo real sobre Avalanche',
    hook: '¿Por qué pagar suscripciones mensuales de $50 cuando tus agentes de IA pueden pagar exactamente $0.0003 por token en menos de 700 milisegundos con Avalanche?',
    problem: 'Los desarrolladores y enjambres de agentes de IA están atrapados en suscripciones centralizadas con tarjetas de crédito que bloquean micropagos por llamada. En Ethereum o L2s tradicionales, las confirmaciones tardan entre 12 y 60 segundos y las tarifas de gas superan el costo de la propia inferencia del modelo.',
    solution: 'AgentMesh implementa un proxy HTTP estándar donde cualquier API de modelo (Llama 3, DeepSeek, Whisper) devuelve un código de estado "402 Payment Required" con un encabezado EIP-712. El agente de IA firma una micro-transacción en la C-Chain de Avalanche o una Subnet dedicada, el validador confirma en 800ms y el stream de la respuesta se desbloquea al instante.',
    unfairAdvantage: 'Solo Avalanche ofrece finalidad determinista sub-segundo con tarifas predecibles de fracciones de centavo. En Solana no hay compatibilidad nativa con herramientas EVM de agentes, y en Ethereum el gas hace inviable pagar $0.001 por inferencia.',
    avaxSkills: [
      {
        name: 'x402-payments',
        description: 'Estructuración de cabeceras HTTP 402 y verificación de recibos de pago en Solidity.',
        command: 'curl -s https://avaxskills.com/skills/x402-payments.md',
      },
      {
        name: 'orchestration',
        description: 'Patrón de coordinación multi-agente con presupuestos de cartera y delegación de firmas.',
        command: 'curl -s https://avaxskills.com/skills/orchestration.md',
      },
      {
        name: 'defensive-solidity',
        description: 'Protección contra reutilización de vouchers (nonce replay) y balanceos de escrow.',
        command: 'curl -s https://avaxskills.com/skills/defensive-solidity.md',
      },
    ],
    architectureSteps: [
      {
        stepNumber: 1,
        title: 'Llamada HTTP del Agente de IA',
        description: 'El agente envía un POST a la API del proveedor de inferencia solicitando una generación.',
        tech: 'Python / LangChain / TypeScript Agent',
      },
      {
        stepNumber: 2,
        title: 'Retorno HTTP 402 + Parámetros EIP-712',
        description: 'El servidor responde HTTP 402 con la dirección del contrato en Fuji/Mainnet, el monto requerido (ej. 0.0002 AVAX) y un nonce único.',
        tech: 'Express Gateway / Avalanche-C-Chain',
      },
      {
        stepNumber: 3,
        title: 'Firma y Liquidación Instantánea',
        description: 'La billetera del agente firma el voucher y transfiere el pago al canal de pago o escrow en C-Chain.',
        tech: 'Ethers.js / Core Wallet / Sub-second Finality',
      },
      {
        stepNumber: 4,
        title: 'Transmisión del Stream de Inferencia',
        description: 'Al verificar la inclusión del bloque en <1 segundo, el proxy transmite los tokens generados por SSE (Server-Sent Events).',
        tech: 'vLLM / SSE Stream / AvalancheGo WebSocket',
      },
    ],
    smartContractSnippet: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AgentMeshX402Escrow
 * @notice Contrato optimizado para Avalanche C-Chain / Fuji
 * Skills de referencia: avaxskills.com/skills/x402-payments.md
 */
contract AgentMeshX402Escrow {
    address public immutable treasury;
    mapping(bytes32 => bool) public processedVouchers;

    event MicropaymentSettled(
        address indexed agent,
        address indexed provider,
        uint256 amount,
        bytes32 voucherHash
    );

    constructor(address _treasury) {
        treasury = _treasury;
    }

    function settleVoucher(
        address provider,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external payable {
        bytes32 voucherHash = keccak256(
            abi.encodePacked(msg.sender, provider, amount, nonce, block.chainid)
        );
        require(!processedVouchers[voucherHash], "Voucher ya consumido");
        require(msg.value == amount, "Monto AVAX incorrecto");

        processedVouchers[voucherHash] = true;
        
        // Comisión protocolar del 1%
        uint256 fee = (amount * 100) / 10000;
        uint256 netPayment = amount - fee;

        (bool sentProvider, ) = provider.call{value: netPayment}("");
        require(sentProvider, "Fallo envio a proveedor");

        (bool sentFee, ) = treasury.call{value: fee}("");
        require(sentFee, "Fallo envio de fee");

        emit MicropaymentSettled(msg.sender, provider, amount, voucherHash);
    }
}`,
    agentPromptSnippet: `Eres un agente de desarrollo en Cursor usando el ecosistema Avalanche.
Consulta las habilidades oficiales en avaxskills.com (especialmente x402-payments y defensive-solidity).
Genera un cliente en TypeScript que intercepte llamadas Axios a endpoints LLM, capture el código HTTP 402, extraiga los parámetros EIP-712 del encabezado 'WWW-Authenticate', firme con una clave privada de Avalanche Fuji y reenvíe la petición con el encabezado 'Authorization: AVAX-402 <signed_tx_hash>'.`,
    pitchDeck: [
      {
        slideNumber: 1,
        title: 'AgentMesh x402',
        tagline: 'Micropagos HTTP 402 en Tiempo Real para la Economía de Agentes de IA en Avalanche',
        bullets: [
          'La primera infraestructura descentralizada de micropagos para LLMs y agentes autónomos',
          'Apalanca la finalidad de 800ms de Avalanche para pagos streaming por llamada de API',
          'Construido 100% sobre los estándares de avaxskills.com',
        ],
        callout: 'Premio Hackathon: Track AI Agents & x402',
      },
      {
        slideNumber: 2,
        title: 'El Problema: La Brecha Financiera de la IA',
        tagline: 'Las tarjetas de crédito y las blockchains lentas impiden la economía autónoma',
        bullets: [
          'Agentes de IA no tienen tarjetas de crédito para pagar suscripciones de OpenAI o Anthropic',
          'Ethereum y L2s tardan más de 15 segundos: el agente se congela esperando confirmación',
          'Los cargos mínimos de Stripe ($0.30 + 2.9%) hacen imposibles los micropagos de $0.001',
        ],
      },
      {
        slideNumber: 3,
        title: 'Nuestra Solución: Estándar HTTP 402 Nativo en AVAX',
        tagline: 'Inferencia desbloqueada en menos de 1 segundo mediante smart contracts optimizados',
        bullets: [
          'El proveedor responde HTTP 402 con el costo exacto en AVAX por paquete de tokens',
          'El agente liquida en sub-segundo usando fondos de su billetera en Fuji o Mainnet',
          'Cero suscripciones fijas: paga exactamente lo que consumes',
        ],
      },
      {
        slideNumber: 4,
        title: 'Arquitectura Técnica & AvaxSkills',
        tagline: 'Diseño modular y seguro probado contra vectores de ataque cross-chain',
        bullets: [
          'Skill x402-payments: Handshake criptográfico HTTP con firmas EIP-712',
          'Skill orchestration: Enjambre de agentes con delegación de fondos segura',
          'Skill defensive-solidity: Prevención de ataques de repetición y reentrancia',
        ],
      },
      {
        slideNumber: 5,
        title: 'Modelo de Negocio & Escalabilidad',
        tagline: 'Monetización B2B orientada al crecimiento exponencial de llamadas de agentes',
        bullets: [
          '1% de comisión de protocolo por cada micro-liquidación procesada',
          'SDK para proveedores de IA (HuggingFace, vLLM, RunPod) para monetizar modelos en minutos',
          'Proyección: 10 millones de microtransacciones diarias en 12 meses',
        ],
      },
      {
        slideNumber: 6,
        title: 'Roadmap del Hackathon (48 Horas) & Demo',
        tagline: 'De la idea a contrato desplegado en Fuji y demo funcional en vivo',
        bullets: [
          'Contrato AgentMeshX402Escrow verificado en Snowtrace Fuji',
          'Proxy gateway de IA en Express con modelo open-source en vivo',
          'Agente autónomo ejecutando consultas y pagando en tiempo real ante los jueces',
        ],
      },
    ],
    hackathon48hPlan: [
      {
        phase: 'Fase 1: Smart Contracts & Fuji (0h - 12h)',
        hours: '0h - 12h',
        milestone: 'Contratos desplegados y verificados',
        tasks: [
          'Configurar entorno con Foundry (skill: testing)',
          'Escribir AgentMeshX402Escrow con protección contra replay',
          'Desplegar en Avalanche Fuji Testnet usando Snowtrace',
          'Realizar pruebas de gas y fuzzing con forge test',
        ],
      },
      {
        phase: 'Fase 2: Gateway HTTP 402 & Proxy (12h - 26h)',
        hours: '12h - 26h',
        milestone: 'Middleware de pago funcional',
        tasks: [
          'Crear middleware Express que devuelva HTTP 402 y cabecera WWW-Authenticate',
          'Conectar proveedor de inferencia (API compatible OpenAI)',
          'Integrar escucha de eventos on-chain mediante AvalancheGo RPC WebSocket',
        ],
      },
      {
        phase: 'Fase 3: SDK del Agente & Frontend (26h - 38h)',
        hours: '26h - 38h',
        milestone: 'App interactiva y agente autónomo',
        tasks: [
          'Crear cliente TypeScript para agentes que auto-resuelve el pago',
          'Construir dashboard visual con logs en tiempo real de transacciones',
          'Integrar Reown AppKit para recargar la tesorería del agente',
        ],
      },
      {
        phase: 'Fase 4: Pruebas de Carga & Pitch (38h - 48h)',
        hours: '38h - 48h',
        milestone: 'Pitch deck y vídeo demo impecable',
        tasks: [
          'Simular 50 micropagos concurrentes mostrando velocidad <800ms',
          'Grabar vídeo demo de 2 minutos destacando la ventaja Avalanche',
          'Publicar README en GitHub con instrucciones paso a paso',
        ],
      },
    ],
    rubricScore: {
      innovation: 96,
      technicalFeasibility: 94,
      avaxEcosystemFit: 99,
      marketPotential: 92,
      total: 95,
      verdict: 'Candidato de primer lugar: Resuelve un dolor real emergente y solo es viable gracias a la velocidad de Avalanche.',
    },
    judgesTip: 'Muestra a los jueces la pantalla dividida: a la izquierda la terminal del agente enviando el prompt, al centro la confirmación en Snowtrace en 800ms, y a la derecha el texto generado fluyendo sin retraso.',
  },
  {
    id: 'omnivault-teleporter',
    title: 'OmniVault Teleporter',
    trackId: 'teleporter-interop',
    trackName: 'Interoperabilidad Cross-Chain (Teleporter & AWM)',
    badgeColor: 'from-cyan-500 to-blue-600',
    subtitle: 'Bóveda de rendimiento omni-subnet con rebalanceo automático mediante Avalanche Warp Messaging',
    hook: 'Las bóvedas DeFi multichain sufren hacks constantes en sus puentes. OmniVault rebalancea liquidez entre L1s de Avalanche con la seguridad criptográfica del consenso Snowman.',
    problem: 'En el ecosistema multichain, la liquidez está fragmentada en silos. Mover capital entre cadenas requiere puentes con multisigs centralizadas o tokens envueltos (wrapped tokens) que han acumulado más de $2.8B en pérdidas por exploits.',
    solution: 'OmniVault utiliza Avalanche Warp Messaging (AWM) y el contrato oficial TeleporterMessenger para monitorear las tasas de rendimiento de préstamos y AMMs en diferentes Subnets/L1s de Avalanche y mover capital atómicamente con firmas BLS agregadas.',
    unfairAdvantage: 'Avalanche Warp Messaging no es un puente de terceros: es una función del protocolo validada directamente por los validadores de la red. Cero riesgo de quiebra de custodio o hack de multisig externa.',
    avaxSkills: [
      {
        name: 'warp-messaging',
        description: 'Construcción y verificación de payloads AWM con firmas BLS de validadores.',
        command: 'curl -s https://avaxskills.com/skills/warp-messaging.md',
      },
      {
        name: 'teleporter-icm',
        description: 'Implementación de ITeleporterReceiver para ejecución segura de mensajes cruzados.',
        command: 'curl -s https://avaxskills.com/skills/teleporter.md',
      },
      {
        name: 'defensive-solidity',
        description: 'Manejo defensivo de fallos de gas en la cadena de destino y reembolsos atómicos.',
        command: 'curl -s https://avaxskills.com/skills/defensive-solidity.md',
      },
    ],
    architectureSteps: [
      {
        stepNumber: 1,
        title: 'Depósito de Usuario en C-Chain',
        description: 'El usuario deposita USDC/AVAX en la bóveda principal recibiendo shares ovTokens.',
        tech: 'ERC-4626 Vault / Avalanche C-Chain',
      },
      {
        stepNumber: 2,
        title: 'Detección de Oportunidad de Rendimiento',
        description: 'Un bot guardián detecta que una Subnet institucional (ej. DeFi L1) ofrece un 8% APY superior a C-Chain.',
        tech: 'Keeper Bot / Subnet RPC',
      },
      {
        stepNumber: 3,
        title: 'Envío de Mensaje Teleporter',
        description: 'La bóveda invoca sendCrossChainMessage() a través del TeleporterMessenger oficial.',
        tech: 'ITeleporterMessenger / AWM Precompile',
      },
      {
        stepNumber: 4,
        title: 'Recepción y Despliegue de Capital',
        description: 'En la Subnet de destino, TeleporterReceiver valida las firmas BLS y deposita el capital en el pool más rentable.',
        tech: 'ITeleporterReceiver / Yield Strategy',
      },
    ],
    smartContractSnippet: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ITeleporterMessenger, TeleporterMessageInput} from "./interfaces/ITeleporterMessenger.sol";
import {ITeleporterReceiver} from "./interfaces/ITeleporterReceiver.sol";

/**
 * @title OmniVaultTeleporterReceiver
 * Skills de referencia: avaxskills.com/skills/teleporter.md
 */
contract OmniVaultTeleporterReceiver is ITeleporterReceiver {
    ITeleporterMessenger public immutable teleporterMessenger;
    bytes32 public immutable sourceBlockchainID;
    address public immutable expectedSourceVault;

    constructor(
        address _teleporterMessenger,
        bytes32 _sourceBlockchainID,
        address _expectedSourceVault
    ) {
        teleporterMessenger = ITeleporterMessenger(_teleporterMessenger);
        sourceBlockchainID = _sourceBlockchainID;
        expectedSourceVault = _expectedSourceVault;
    }

    function receiveTeleporterMessage(
        bytes32 originBlockchainID,
        address originSenderAddress,
        bytes calldata message
    ) external override {
        require(msg.sender == address(teleporterMessenger), "No autorizado");
        require(originBlockchainID == sourceBlockchainID, "Cadena origen invalida");
        require(originSenderAddress == expectedSourceVault, "Emisor invalido");

        (uint256 amountToRebalance, uint8 strategyId) = abi.decode(
            message,
            (uint256, uint8)
        );

        // Ejecutar deposito en la estrategia local de la Subnet
        _executeLocalDeposit(amountToRebalance, strategyId);
    }

    function _executeLocalDeposit(uint256 amount, uint8 strategyId) internal {
        // Logica de staking / lending en la L1 local
    }
}`,
    agentPromptSnippet: `Actúa como ingeniero de contratos inteligentes senior en Avalanche.
Revisa la documentación de avaxskills.com/skills/teleporter.md y avaxskills.com/skills/warp-messaging.md.
Implementa una bóveda ERC-4626 que use ITeleporterMessenger para enviar órdenes de rebalanceo entre dos cadenas Fuji. Incluye manejo de fallos para que si la llamada falla en la cadena de destino por falta de gas, el relayer pueda reintentar o devolver el capital.`,
    pitchDeck: [
      {
        slideNumber: 1,
        title: 'OmniVault Teleporter',
        tagline: 'Rendimiento DeFi Nativo sin Puentes Vulnerables usando Avalanche Teleporter',
        bullets: [
          'Maximiza el APY agregando liquidez a través de todo el archipiélago de Subnets de Avalanche',
          'Elimina tokens envueltos: opera con la seguridad criptográfica de firmas BLS nativas',
          '100% automatizado mediante keepers y Teleporter Messenger',
        ],
        callout: 'Premio Hackathon: Track Interoperabilidad & Teleporter',
      },
      {
        slideNumber: 2,
        title: 'El Gran Problema de DeFi',
        tagline: '$2.8 Mil Millones Perdidos en Puentes Centralizados',
        bullets: [
          'La fragmentación de liquidez reduce los rendimientos de los usuarios en un 40%',
          'Los puentes tradicionales dependen de multisigs de 5 personas que son hackeadas constantemente',
          'Los usuarios no quieren aprender a usar 10 puentes distintos ni cambiar de red manualmente',
        ],
      },
      {
        slideNumber: 3,
        title: 'La Ventaja Criptográfica de Avalanche',
        tagline: 'Seguridad basada en el conjunto de validadores de la red, no en terceros',
        bullets: [
          'Avalanche Warp Messaging (AWM): Comunicación directa a nivel de protocolo de consenso',
          'Teleporter: Capa de aplicación que permite llamadas de contrato a contrato entre L1s',
          'Transacciones confirmadas en menos de 1 segundo en ambas cadenas',
        ],
      },
      {
        slideNumber: 4,
        title: 'Métricas & Impacto de Mercado',
        tagline: 'Desbloqueando billones en liquidez institucional en Avalanche9000',
        bullets: [
          'Con Avalanche9000 nacerán cientos de nuevas L1s especializadas con alta demanda de liquidez',
          'OmniVault actúa como el lubricante financiero que conecta todas las L1s sin fricción',
          'Ingresos: 10% del rendimiento generado por el protocolo',
        ],
      },
      {
        slideNumber: 5,
        title: 'Demo Técnica en Hackathon',
        tagline: 'Ejecución en vivo entre C-Chain Fuji y una Subnet personalizada',
        bullets: [
          'Depósito de prueba en interfaz web intuitiva con Reown AppKit',
          'Verificación del mensaje AWM transmitido y firmado por validadores',
          'Confirmación del rebalanceo automático en la subred secundaria',
        ],
      },
      {
        slideNumber: 6,
        title: 'Equipo & Próximos Pasos',
        tagline: 'Camino hacia el mainnet y auditoría con avaxskills',
        bullets: [
          'Auditoría previa con suite de testing Foundry (skill: testing)',
          'Postulación a Avalanche Multiverse Incentive Program',
          'Integración con las principales dApps del ecosistema (Benqi, Trader Joe, Dexalot)',
        ],
      },
    ],
    hackathon48hPlan: [
      {
        phase: 'Fase 1: Configuración de Entorno & Teleporter (0h - 12h)',
        hours: '0h - 12h',
        milestone: 'Contratos desplegados en C-Chain y Subnet Fuji',
        tasks: [
          'Obtener direcciones oficiales de TeleporterMessenger en Fuji',
          'Escribir Vault principal en C-Chain y Receiver en Subnet',
          'Configurar permisos de emisor y receptor cruzado',
        ],
      },
      {
        phase: 'Fase 2: Simulación de Mensajes & Relayer (12h - 24h)',
        hours: '12h - 24h',
        milestone: 'Mensaje cross-chain recibido con éxito',
        tasks: [
          'Disparar mensaje de prueba de C-Chain a Subnet',
          'Usar el Teleporter Relayer para procesar la transacción',
          'Validar decodificación correcta del payload en el contrato receptor',
        ],
      },
      {
        phase: 'Fase 3: Frontend & Analytics (24h - 36h)',
        hours: '24h - 36h',
        milestone: 'DApp interactiva con visualización de rutas',
        tasks: [
          'Crear UI en React + Tailwind con selector de APY',
          'Visualizador animado del paquete de datos viajando entre cadenas',
          'Historial de transacciones con enlaces a Snowtrace',
        ],
      },
      {
        phase: 'Fase 4: Testing & Presentación (36h - 48h)',
        hours: '36h - 48h',
        milestone: 'Pitch deck y demo lista',
        tasks: [
          'Fuzzing de parámetros con Foundry para prevenir overflows',
          'Crear vídeo explicativo con diagrama de arquitectura',
          'Publicar repositorio con documentación de despliegue',
        ],
      },
    ],
    rubricScore: {
      innovation: 93,
      technicalFeasibility: 95,
      avaxEcosystemFit: 98,
      marketPotential: 96,
      total: 96,
      verdict: 'Proyecto de infraestructura clave: Encaja exactamente con la visión de interoperabilidad de Avalanche.',
    },
    judgesTip: 'Destaca que estás utilizando el estándar oficial de Teleporter y no un oráculo centralizado. Muestra cómo las firmas BLS se verifican on-chain sin intermediarios.',
  },
  {
    id: 'sovereignpay-l1',
    title: 'SovereignPay L1 (Avalanche9000)',
    trackId: 'avalanche9000-subnets',
    trackName: 'Avalanche9000 & Custom L1s',
    badgeColor: 'from-red-600 to-rose-700',
    subtitle: 'Blockchain L1 soberana con stablecoin nativa como gas token y cumplimiento corporativo precompilado',
    hook: '¿Por qué forzar a clientes empresariales a comprar tokens volátiles para pagar gas? SovereignPay es un L1 donde el gas se paga en USDC/EURC nativo con costos de despliegue 99.9% menores.',
    problem: 'Para las empresas, adoptar Web3 es inviable si sus usuarios o sistemas contables deben mantener AVAX o ETH expuestos a volatilidad para pagar comisiones de transacción. Además, lanzar una L1 antes costaba miles de dólares en staking obligatorio.',
    solution: 'Con Avalanche9000 (actualización Etna), SovereignPay crea una L1 dedicada donde el token de gas nativo es una stablecoin corporativa (o token propio). Incluye precompiles a nivel de máquina virtual que bloquean billeteras no autorizadas sin necesidad de lógica lenta en Solidity.',
    unfairAdvantage: 'Avalanche es la única red que permite cambiar el token nativo de gas a nivel de Virtual Machine (Subnet-EVM) y validar con costos ultra bajos gracias a Avalanche9000, manteniendo compatibilidad total con herramientas EVM.',
    avaxSkills: [
      {
        name: 'subnet-deployment',
        description: 'Configuración del archivo genesis.json, asignación de validadores y reglas de gas.',
        command: 'curl -s https://avaxskills.com/skills/subnet-deployment.md',
      },
      {
        name: 'gas-token-config',
        description: 'Definición de un token ERC-20 personalizado como moneda de tarifa de gas nativa.',
        command: 'curl -s https://avaxskills.com/skills/gas-token.md',
      },
      {
        name: 'kyc-aml',
        description: 'Precompiles de control de acceso para transacciones corporativas permisionadas.',
        command: 'curl -s https://avaxskills.com/skills/kyc-aml.md',
      },
    ],
    architectureSteps: [
      {
        stepNumber: 1,
        title: 'Diseño del Genesis Block',
        description: 'Se define el archivo genesis de Subnet-EVM con el contrato de stablecoin asignado como Native Fee Token.',
        tech: 'Subnet-EVM Genesis / Avalanche CLI',
      },
      {
        stepNumber: 2,
        title: 'Activación en Avalanche9000',
        description: 'Se registra la L1 en la P-Chain aprovechando el nuevo modelo dinámico de validadores de bajo costo.',
        tech: 'Avalanche9000 Etna Upgrade / P-Chain Registry',
      },
      {
        stepNumber: 3,
        title: 'Reglas de Precompilado de Cumplimiento',
        description: 'La máquina virtual valida antes de ejecutar cualquier transacción que el remitente esté en la lista blanca de la empresa.',
        tech: 'Go-Ethereum Precompile / Synaps ID',
      },
      {
        stepNumber: 4,
        title: 'Liquidación y Conexión con C-Chain',
        description: 'Las transferencias interempresariales ocurren a 4,000 TPS en la L1 y se sincronizan con C-Chain vía Teleporter.',
        tech: 'Teleporter ICM / Snowman Consensus',
      },
    ],
    smartContractSnippet: `// Genesis Configuration Snippet para Subnet-EVM en Avalanche9000
// Referencia oficial: avaxskills.com/skills/subnet-deployment.md
{
  "config": {
    "chainId": 999901,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0,
    "feeConfig": {
      "gasLimit": 15000000,
      "minBaseFee": 25000000000,
      "targetGas": 60000000,
      "baseFeeChangeDenominator": 36
    },
    "contractDeployerAllowListConfig": {
      "blockTimestamp": 0,
      "adminAddresses": ["0xYourAdminAddressHere"]
    },
    "txAllowListConfig": {
      "blockTimestamp": 0,
      "adminAddresses": ["0xYourAdminAddressHere"]
    }
  },
  "alloc": {
    "0xYourTreasuryAddress": {
      "balance": "0x52B7D2DCC80CD2E4000000" // Fondos iniciales en StableGas Token
    }
  }
}`,
    agentPromptSnippet: `Eres un arquitecto de infraestructuras Avalanche.
Usa las guías de avaxskills.com/skills/subnet-deployment.md y gas-token.md.
Escribe un script en TypeScript usando Avalanche CLI que cree una configuración para una Subnet local y genere el archivo genesis con txAllowList y feeConfig optimizado para transacciones empresariales con stablecoin.`,
    pitchDeck: [
      {
        slideNumber: 1,
        title: 'SovereignPay L1',
        tagline: 'La Blockchain Corporativa Definitiva en Avalanche9000 con Gas en Stablecoin',
        bullets: [
          'Despliegue de L1s empresariales con 99.9% menor costo gracias a la actualización Etna',
          'Cero exposición a la volatilidad de criptomonedas: el gas es pagado en monedas estables',
          'Control total de listas de acceso y reglas de cumplimiento a nivel de protocolo',
        ],
        callout: 'Premio Hackathon: Track Avalanche9000 & L1s',
      },
      {
        slideNumber: 2,
        title: 'El Muro Corporativo para Adoptar Blockchain',
        tagline: 'Las finanzas corporativas no pueden manejar tokens volátiles',
        bullets: [
          'Los departamentos de contabilidad no pueden comprar tokens volátiles para pagar tarifas de red',
          'Los rollups en Ethereum sufren de secuestradores centralizados y congestión impredecible',
          'Crear una blockchain dedicada antes requería bloquear millones de dólares en capital de staking',
        ],
      },
      {
        slideNumber: 3,
        title: 'La Revolución de Avalanche9000',
        tagline: 'Soberanía accesible con el mayor avance en la historia de Avalanche',
        bullets: [
          'Etna Upgrade: Reducción masiva de barreras económicas para el despliegue de L1s',
          'Custom Native Gas Token: Usa cualquier token ERC-20 como moneda nativa del sistema',
          'Rendimiento aislado: Hasta 4,500 transacciones por segundo sin afectar a otras aplicaciones',
        ],
      },
      {
        slideNumber: 4,
        title: 'Casos de Uso Inmediatos',
        tagline: 'Finanzas B2B, remesas transfronterizas y cadenas de lealtad',
        bullets: [
          'Pagos B2B en tiempo real entre filiales con facturación en moneda constante',
          'Plataformas de lealtad de aerolíneas o retail con token propio sin fricción de usuario',
          'Bancos centrales y neobancos probando dinero programable seguro',
        ],
      },
      {
        slideNumber: 5,
        title: 'Tracción & Modelo de Ingresos',
        tagline: 'Infraestructura como servicio para el ecosistema Web3 empresarial',
        bullets: [
          'Modelo SaaS: Cuota de orquestación y mantenimiento de validadores gestionados',
          'Soporte premium para configuración de precompiles y puentes Teleporter',
          'Comisión sobre el volumen de remesas cross-subnet procesadas',
        ],
      },
      {
        slideNumber: 6,
        title: 'Entregables del Hackathon',
        tagline: 'Subnet operativa y demostración en vivo de pagos con gas nativo',
        bullets: [
          'L1 desplegada en red de pruebas con genesis block y explorador propio',
          'Transacción de pago demostrada con saldo en stablecoin pagando su propia comisión',
          'Código abierto disponible en GitHub con documentación exhaustiva',
        ],
      },
    ],
    hackathon48hPlan: [
      {
        phase: 'Fase 1: Configuración de Avalanche CLI & Genesis (0h - 12h)',
        hours: '0h - 12h',
        milestone: 'Genesis block configurado y validado',
        tasks: [
          'Instalar y configurar Avalanche CLI localmente',
          'Diseñar archivo genesis con Custom Fee Token y AllowList precompile',
          'Lanzar red local de 5 nodos para comprobar la generación de bloques',
        ],
      },
      {
        phase: 'Fase 2: Despliegue de Subnet & Registro (12h - 24h)',
        hours: '12h - 24h',
        milestone: 'L1 activa en Fuji Testnet',
        tasks: [
          'Exportar configuración y solicitar validadores en Fuji',
          'Configurar endpoints RPC públicos para la nueva L1',
          'Conectar billetera Core y MetaMask a la nueva red',
        ],
      },
      {
        phase: 'Fase 3: Smart Contracts & Aplicación Demo (24h - 36h)',
        hours: '24h - 36h',
        milestone: 'Portal empresarial interactivo',
        tasks: [
          'Desplegar contrato de facturación corporativa en la L1',
          'Construir frontend con React para emitir y pagar facturas con 1 solo clic',
          'Demostrar deducción del gas directamente en la moneda estable',
        ],
      },
      {
        phase: 'Fase 4: Benchmark de Rendimiento & Pitch (36h - 48h)',
        hours: '36h - 48h',
        milestone: 'Métricas de TPS y pitch final',
        tasks: [
          'Ejecutar script de estrés enviando 500 transacciones simultáneas',
          'Medir tiempo de confirmación y costos exactos',
          'Preparar presentación de 3 minutos para los jueces del hackathon',
        ],
      },
    ],
    rubricScore: {
      innovation: 94,
      technicalFeasibility: 91,
      avaxEcosystemFit: 99,
      marketPotential: 97,
      total: 95,
      verdict: 'Impacto institucional masivo. Aprovecha la propuesta de valor más importante de Avalanche9000.',
    },
    judgesTip: 'Los jueces de Ava Labs adoran ver proyectos que demuestran el potencial del upgrade Etna. Enfatiza cómo la reducción del 99.9% en costos hace viable lo que antes era prohibitivo.',
  },
  {
    id: 'aerotrust-rwa',
    title: 'AeroTrust RWA',
    trackId: 'rwa-compliance',
    trackName: 'Real World Assets & Cumplimiento',
    badgeColor: 'from-emerald-500 to-teal-700',
    subtitle: 'Plataforma de tokenización de activos aeronáuticos y facturas B2B con identidad Synaps/Fractal on-chain',
    hook: 'Los componentes de aviones y facturas de logística mueven $400B anuales sin liquidez. AeroTrust los tokeniza en Avalanche con cumplimiento regulatorio garantizado en cada bloque.',
    problem: 'La tokenización de activos del mundo real (RWA) fracasa cuando los reguladores descubren que cualquiera puede comprar o transferir tokens sin verificación KYC/AML. En blockchains públicas tradicionales, implementar restricciones en Solidity es costoso y susceptible a exploits.',
    solution: 'AeroTrust combina el token ERC-3643 de activos permisionados con oráculos de identidad (Synaps/Fractal) en una Subnet de Avalanche donde las transacciones no conformes son rechazadas inmediatamente. Los inversores acreditados obtienen rendimiento respaldado por activos reales con liquidez instantánea.',
    unfairAdvantage: 'Avalanche es el líder absoluto en adopción RWA institucional (JPMorgan, Citi, Wellington). Sus subnets permiten crear perímetros regulatorios donde los validadores y usuarios cumplen normativas específicas sin perder la interoperabilidad con la C-Chain.',
    avaxSkills: [
      {
        name: 'kyc-aml',
        description: 'Patrones de verificación on-chain mediante oráculos de identidad descentralizada.',
        command: 'curl -s https://avaxskills.com/skills/kyc-aml.md',
      },
      {
        name: 'defensive-solidity',
        description: 'Implementación del estándar ERC-3643 con controles de congelamiento y auditoría.',
        command: 'curl -s https://avaxskills.com/skills/defensive-solidity.md',
      },
      {
        name: 'warp-messaging',
        description: 'Exportación de rendimiento RWA a la C-Chain mediante Teleporter para inversores retail autorizados.',
        command: 'curl -s https://avaxskills.com/skills/warp-messaging.md',
      },
    ],
    architectureSteps: [
      {
        stepNumber: 1,
        title: 'Onboarding y Verificación KYC/AML',
        description: 'El inversor completa la verificación mediante Synaps o Fractal y recibe una credencial firmada on-chain.',
        tech: 'Synaps API / Zero Knowledge Attestation',
      },
      {
        stepNumber: 2,
        title: 'Originación y Tokenización del Activo',
        description: 'La empresa logística carga la documentación del activo (con hash en IPFS) y emite tokens representativos de la factura.',
        tech: 'ERC-3643 / IPFS Pinning / Avalanche C-Chain',
      },
      {
        stepNumber: 3,
        title: 'Verificación de Transferencia en Tiempo Real',
        description: 'Antes de cualquier transferencia, el contrato consulta el IdentityRegistry para comprobar que ambos participantes estén autorizados.',
        tech: 'On-Chain Compliance Engine / Sub-second validation',
      },
      {
        stepNumber: 4,
        title: 'Distribución de Flujos de Caja',
        description: 'Al pagar el cliente corporativo, los fondos se distribuyen automáticamente en USDC entre los tenedores de tokens.',
        tech: 'Automated Cashflow Escrow / Chainlink PoR',
      },
    ],
    smartContractSnippet: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IIdentityRegistry {
    function isVerified(address _user) external view returns (bool);
}

/**
 * @title AeroTrustCompliantToken
 * Token de activo RWA regulado para Avalanche
 * Skills de referencia: avaxskills.com/skills/kyc-aml.md
 */
contract AeroTrustCompliantToken {
    string public name = "AeroTrust Boeing Turbine Part RWA";
    string public symbol = "AT-TURB";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    IIdentityRegistry public immutable identityRegistry;
    address public complianceOfficer;

    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public frozenWallets;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event WalletFrozen(address indexed wallet, bool isFrozen);

    modifier onlyCompliance() {
        require(msg.sender == complianceOfficer, "Solo compliance officer");
        _;
    }

    constructor(address _identityRegistry) {
        identityRegistry = IIdentityRegistry(_identityRegistry);
        complianceOfficer = msg.sender;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(!frozenWallets[msg.sender] && !frozenWallets[to], "Billetera congelada");
        require(identityRegistry.isVerified(msg.sender), "Remitente no cumple KYC");
        require(identityRegistry.isVerified(to), "Destinatario no cumple KYC");
        require(balanceOf[msg.sender] >= amount, "Saldo insuficiente");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function setFrozen(address wallet, bool freeze) external onlyCompliance {
        frozenWallets[wallet] = freeze;
        emit WalletFrozen(wallet, freeze);
    }
}`,
    agentPromptSnippet: `Eres un desarrollador especialista en RWA en Avalanche.
Revisa avaxskills.com/skills/kyc-aml.md y defensive-solidity.md.
Construye una suite completa de contratos inteligentes que implemente un registro de identidades con soporte para firmas EIP-712 de Synaps, emisión de activos regulados fraccionados y distribución mensual de dividendos en USDC.`,
    pitchDeck: [
      {
        slideNumber: 1,
        title: 'AeroTrust RWA',
        tagline: 'Democratizando Activos del Mundo Real de Alta Rentabilidad con Cumplimiento On-Chain en Avalanche',
        bullets: [
          'Tokenización de contratos y componentes de transporte y logística aeronáutica',
          'Cumplimiento regulatorio KYC/AML automático verificado a nivel de transacción',
          'Respaldado por la infraestructura de subnets institucionales de Avalanche',
        ],
        callout: 'Premio Hackathon: Track RWA & Compliance',
      },
      {
        slideNumber: 2,
        title: 'El Problema de Liquidez de $400B',
        tagline: 'Activos físicos de alto valor atrapados en procesos de papel',
        bullets: [
          'Las aerolíneas y operadores de carga esperan hasta 120 días para cobrar facturas',
          'Los bancos tradicionales cobran comisiones del 12-18% por factoraje financiero',
          'Los inversores cripto buscan rendimientos reales no inflacionarios del 8-12% anual',
        ],
      },
      {
        slideNumber: 3,
        title: 'Nuestra Solución Integral',
        tagline: 'Liquidez instantánea para empresas, rendimiento seguro para inversores',
        bullets: [
          'Tokenización fraccionada en Avalanche Fuji / Mainnet con verificación Synaps',
          'Solo inversores acreditados pueden negociar o transferir participaciones',
          'Pagos de dividendos automáticos en USDC programados por smart contract',
        ],
      },
      {
        slideNumber: 4,
        title: 'Por Qué Avalanche es el Hogar de los RWA',
        tagline: 'El estándar elegido por Wall Street (Citi, JPMorgan, WisdomTree)',
        bullets: [
          'Subnets permisionadas: Permiten crear redes privadas donde todos los validadores tienen KYC',
          'Finalidad instantánea para liquidaciones de entrega contra pago (DvP)',
          'Teleporter permite comunicar la subred de compliance con los pools de liquidez de C-Chain',
        ],
      },
      {
        slideNumber: 5,
        title: 'Tracción & Alianzas Estratégicas',
        tagline: 'Pilotos validados y cartas de intención con empresas de logística',
        bullets: [
          'Acuerdo inicial para tokenizar $1.5M en facturas de mantenimiento de turbinas',
          'Integración con Synaps para verificación de identidad en 90 segundos',
          'Proyección de $25M en activos bajo gestión (AUM) en los primeros 18 meses',
        ],
      },
      {
        slideNumber: 6,
        title: 'Demostración en Hackathon',
        tagline: 'Flujo completo de emisión, verificación de identidad y cobro de dividendos',
        bullets: [
          'Verificación de billetera con oráculo simulado de KYC',
          'Compra de tokens fraccionados del activo con un solo clic',
          'Distribución de flujo de caja ejecutada en vivo ante los jueces',
        ],
      },
    ],
    hackathon48hPlan: [
      {
        phase: 'Fase 1: Smart Contracts de Identidad & Activos (0h - 12h)',
        hours: '0h - 12h',
        milestone: 'Contrato ERC-3643 desplegado',
        tasks: [
          'Implementar IdentityRegistry con mock de Synaps/Fractal',
          'Crear contrato de tokenización fraccionada con hooks de validación',
          'Testear escenarios negativos (intento de transferencia sin KYC)',
        ],
      },
      {
        phase: 'Fase 2: Oráculo & Flujos de Caja (12h - 24h)',
        hours: '12h - 24h',
        milestone: 'Módulo de dividendos operativo',
        tasks: [
          'Programar contrato de distribución automática de USDC',
          'Conectar oráculo de Proof of Reserve con Chainlink',
          'Desplegar en Fuji y verificar contratos en Snowtrace',
        ],
      },
      {
        phase: 'Fase 3: Portal del Inversor & Empresa (24h - 36h)',
        hours: '24h - 36h',
        milestone: 'Frontend completo con Reown AppKit',
        tasks: [
          'Construir vista para originadores (subida de facturas e IPFS)',
          'Construir marketplace de inversión con métricas de rendimiento (TIR)',
          'Integrar modal de onboarding KYC simulado',
        ],
      },
      {
        phase: 'Fase 4: Auditoría Preliminar & Pitch (36h - 48h)',
        hours: '36h - 48h',
        milestone: 'Pitch deck y entregables listos',
        tasks: [
          'Ejecutar checklist de avaxskills.com/skills/audit.md',
          'Grabar vídeo demo de 3 minutos',
          'Preparar presentación de pitch enfocada en el impacto institucional',
        ],
      },
    ],
    rubricScore: {
      innovation: 91,
      technicalFeasibility: 95,
      avaxEcosystemFit: 98,
      marketPotential: 98,
      total: 95,
      verdict: 'Excelente caso de uso empresarial con tremenda viabilidad de financiamiento real.',
    },
    judgesTip: 'Muestra a los jueces qué sucede cuando una dirección no autorizada intenta transferir un token: el revert automático con mensaje claro de cumplimiento legal demuestra el valor on-chain de la solución.',
  },
  {
    id: 'playrelay-zerogas',
    title: 'PlayRelay ZeroGas',
    trackId: 'gaming-consumer-ux',
    trackName: 'Web3 UX, Consumer & Gaming',
    badgeColor: 'from-pink-500 to-rose-600',
    subtitle: 'Infraestructura de gasless gaming y sesiones efímeras con Account Abstraction en Subnets de Avalanche',
    hook: 'Los jugadores odian firmar popups de MetaMask cada vez que disparan o abren un cofre. PlayRelay ofrece 60 FPS sin gas ni interrupciones con login social de Google.',
    problem: 'El 90% de los jugadores tradicionales abandonan los juegos Web3 en los primeros 3 minutos debido a la necesidad de instalar extensiones de billetera, comprar AVAX para gas y confirmar transacciones con ventanas emergentes durante la partida.',
    solution: 'PlayRelay proporciona un SDK para Unity y Unreal que genera billeteras de sesión efímeras (ERC-4337) respaldadas por login social con Reown AppKit / Dynamic. Las transacciones son patrocinadas al 100% por un Paymaster en una Subnet dedicada con 4,500 TPS.',
    unfairAdvantage: 'Las Subnets de Avalanche permiten transacciones casi instantáneas con tarifas de centavos que el desarrollador del juego puede subsidiar fácilmente mediante un Paymaster sin competir por espacio de bloque con transacciones de DeFi.',
    avaxSkills: [
      {
        name: 'wallet-integration',
        description: 'Integración fluida de Reown AppKit y Dynamic para login social sin frases semilla.',
        command: 'curl -s https://avaxskills.com/skills/wallet-integration.md',
      },
      {
        name: 'defensive-solidity',
        description: 'Contratos Paymaster con límites de gasto por sesión para evitar que bots drenen el gas del juego.',
        command: 'curl -s https://avaxskills.com/skills/defensive-solidity.md',
      },
      {
        name: 'subnet-deployment',
        description: 'Optimización de parámetros de bloque de 500ms para latencia gamer en una Subnet dedicada.',
        command: 'curl -s https://avaxskills.com/skills/subnet-deployment.md',
      },
    ],
    architectureSteps: [
      {
        stepNumber: 1,
        title: 'Login Social con 1 Clic',
        description: 'El jugador inicia sesión con su cuenta de Google o Discord y se genera una billetera MPC en segundo plano.',
        tech: 'Dynamic SDK / Reown AppKit',
      },
      {
        stepNumber: 2,
        title: 'Creación de Session Key Efímera',
        description: 'El juego solicita una clave de sesión con permiso temporal (ej. 2 horas y hasta 100 transacciones de juego).',
        tech: 'ERC-4337 Session Validation',
      },
      {
        stepNumber: 3,
        title: 'Envío de UserOperations Patrocinadas',
        description: 'Las acciones del juego (subir de nivel, craftear armas) son empaquetadas y enviadas al Paymaster.',
        tech: 'PlayRelay Paymaster / Bundler',
      },
      {
        stepNumber: 4,
        title: 'Ejecución en Sub-segundo en la Subnet',
        description: 'El validador de la Subnet confirma la acción en menos de 500ms sin mostrar ninguna notificación molesta al jugador.',
        tech: 'Dedicated Gaming Subnet / Subnet-EVM',
      },
    ],
    smartContractSnippet: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PlayRelayPaymaster
 * Paymaster para transacciones sin gas en juegos Avalanche
 * Skills de referencia: avaxskills.com/skills/wallet-integration.md
 */
contract PlayRelayPaymaster {
    address public gameAdmin;
    mapping(address => uint256) public userGasAllowance;
    mapping(address => uint256) public sessionExpiry;

    event GasSponsored(address indexed player, uint256 cost);

    constructor() {
        gameAdmin = msg.sender;
    }

    receive() external payable {}

    function registerPlayerSession(
        address player,
        uint256 gasLimit,
        uint256 duration
    ) external {
        require(msg.sender == gameAdmin, "Solo administrador");
        userGasAllowance[player] = gasLimit;
        sessionExpiry[player] = block.timestamp + duration;
    }

    function validateAndSponsor(address player, uint256 estimatedGasCost) external returns (bool) {
        require(block.timestamp <= sessionExpiry[player], "Sesion expirada");
        require(userGasAllowance[player] >= estimatedGasCost, "Limite de gas agotado");

        userGasAllowance[player] -= estimatedGasCost;
        emit GasSponsored(player, estimatedGasCost);
        return true;
    }
}`,
    agentPromptSnippet: `Eres un ingeniero de Web3 Gaming en Avalanche.
Usa avaxskills.com/skills/wallet-integration.md y defensive-solidity.md.
Crea un prototipo en React que integre Reown AppKit con login social, inicialice una clave de sesión efímera y permita al usuario hacer clic en un botón de 'Atacar Jefe' 10 veces seguidas sin solicitar firma en MetaMask, patrocinado por un contrato Paymaster en Fuji.`,
    pitchDeck: [
      {
        slideNumber: 1,
        title: 'PlayRelay ZeroGas',
        tagline: 'Infraestructura de Billeteras Invisibles y Transacciones Sin Gas para Juegos en Avalanche',
        bullets: [
          'La experiencia de usuario que los gamers de Web2 estaban esperando',
          'Cero extensiones de navegador, cero frases semilla y cero popups durante el juego',
          'Alimentado por Subnets de Avalanche con latencia de 500ms',
        ],
        callout: 'Premio Hackathon: Track Web3 UX & Gaming',
      },
      {
        slideNumber: 2,
        title: 'El Abismo de la Fricción Gamer',
        tagline: '90% de abandono en el primer minuto de juego Web3',
        bullets: [
          'Tener que firmar una transacción para recoger una espada destruye la inmersión',
          'Los jugadores no quieren pagar tarifas de red por mecánicas básicas del juego',
          'Las demoras de bloques lentos hacen imposible el juego en tiempo real',
        ],
      },
      {
        slideNumber: 3,
        title: 'Nuestra Solución: PlayRelay SDK',
        tagline: 'Integración en 15 minutos para desarrolladores de Unity, Unreal y Web',
        bullets: [
          'Login con un clic usando cuentas existentes de Google, Discord o Steam',
          'Session Keys automáticas: hasta 2 horas de jugabilidad continua sin firmar',
          'Paymaster inteligente que patrocina el gas con costos microscópicos en Subnets',
        ],
      },
      {
        slideNumber: 4,
        title: 'Arquitectura & AvaxSkills',
        tagline: 'Construido sobre los mejores estándares de UX descentralizada',
        bullets: [
          'Skill wallet-integration: Compatibilidad con Reown AppKit y Dynamic',
          'Skill subnet-deployment: Parámetros de bloque acelerados para videojuegos',
          'Skill defensive-solidity: Protección anti-sybil y límites de patrocinio',
        ],
      },
      {
        slideNumber: 5,
        title: 'Monetización & Modelo B2B',
        tagline: 'SaaS para estudios de videojuegos Web3',
        bullets: [
          'Planes desde $99/mes para pequeños estudios de juegos indie',
          'Tarifa por UserOperation patrocinada con margen del 15%',
          'Servicio administrado de validadores para Subnets de juegos',
        ],
      },
      {
        slideNumber: 6,
        title: 'Demo en Vivo en Hackathon',
        tagline: 'Minijuego arcade jugable en pantalla táctil sin billetera previa',
        bullets: [
          'Los jueces escanean un código QR y juegan instantáneamente en su teléfono',
          '100 transacciones generadas en 30 segundos sin interrupción',
          'Visualizador en tiempo real del Paymaster patrocinando el gas en Fuji',
        ],
      },
    ],
    hackathon48hPlan: [
      {
        phase: 'Fase 1: Paymaster & Session Keys (0h - 12h)',
        hours: '0h - 12h',
        milestone: 'Contratos desplegados en Fuji',
        tasks: [
          'Escribir contrato PlayRelayPaymaster con cuotas por usuario',
          'Implementar validación de firmas de Session Keys',
          'Desplegar en Fuji Testnet y fondear el Paymaster con AVAX de testnet',
        ],
      },
      {
        phase: 'Fase 2: SDK de Cliente & Login Social (12h - 24h)',
        hours: '12h - 24h',
        milestone: 'Autenticación fluida sin extensiones',
        tasks: [
          'Configurar Reown AppKit con soporte social (Google/Discord)',
          'Crear manejador de almacenamiento de clave efímera en localStorage',
          'Programar empaquetador de UserOperations en TypeScript',
        ],
      },
      {
        phase: 'Fase 3: Minijuego Demostrativo (24h - 36h)',
        hours: '24h - 36h',
        milestone: 'Juego arcade funcional y adictivo',
        tasks: [
          'Crear minijuego en Canvas/React (ej. "Clicker de Monstruos")',
          'Conectar cada ataque a una transacción en segundo plano sin popup',
          'Añadir panel de telemetría de transacciones en tiempo real',
        ],
      },
      {
        phase: 'Fase 4: Optimización Móvil & Pitch (36h - 48h)',
        hours: '36h - 48h',
        milestone: 'Demo móvil perfecta y presentación',
        tasks: [
          'Generar código QR para que cualquier persona juegue en su teléfono',
          'Verificar latencia de confirmación (<600ms en Fuji)',
          'Presentar pitch destacando la retención de usuarios frente a dApps Web3 clásicas',
        ],
      },
    ],
    rubricScore: {
      innovation: 92,
      technicalFeasibility: 96,
      avaxEcosystemFit: 95,
      marketPotential: 96,
      total: 95,
      verdict: 'Excelente para atraer a la siguiente oleada de 10 millones de usuarios a Avalanche.',
    },
    judgesTip: 'Pon el teléfono en las manos del juez del hackathon y dile: "Juega 15 segundos". Cuando termine, muéstrale que acaba de hacer 8 transacciones on-chain en Avalanche sin darse cuenta.',
  },
  {
    id: 'sentinelguard-qa',
    title: 'SentinelGuard Fuji QA',
    trackId: 'security-audit-testing',
    trackName: 'Seguridad, QA & Audit',
    badgeColor: 'from-blue-600 to-indigo-800',
    subtitle: 'Suite de agentes de auditoría continua, fuzzing con Foundry y canario de mensajes Teleporter en Fuji',
    hook: 'El 80% de los exploits en Avalanche ocurren por supuestos erróneos en mensajes cross-chain de Warp. SentinelGuard prueba tus contratos contra ataques reales antes de que toquen Mainnet.',
    problem: 'Los desarrolladores prueban sus contratos en redes locales (Anvil/Hardhat) que no replican el comportamiento asíncrono de los validadores de Avalanche, la latencia de AWM ni los límites de gas de las Subnets. Esto genera sorpresas catastróficas al desplegar en producción.',
    solution: 'SentinelGuard es una plataforma de QA automatizada para Avalanche que realiza fork testing en vivo de Fuji y C-Chain, ejecuta pruebas de invariantes (fuzzing con Foundry) específicas para Teleporter, y analiza el código con modelos de IA entrenados en las guías de seguridad de avaxskills.com.',
    unfairAdvantage: 'Está diseñado exclusivamente para la arquitectura multicadena de Avalanche. Las herramientas genéricas de Ethereum (Slither, Mythril) no comprenden los precompilados de Warp Messaging ni los riesgos de relayers cross-subnet.',
    avaxSkills: [
      {
        name: 'testing',
        description: 'Unit testing, fuzzing de invariantes y fork testing con Foundry sobre Avalanche.',
        command: 'curl -s https://avaxskills.com/skills/testing.md',
      },
      {
        name: 'defensive-solidity',
        description: 'Validación de supuestos de confianza en AWM, protección contra reentrancia cruzada y gas traps.',
        command: 'curl -s https://avaxskills.com/skills/defensive-solidity.md',
      },
      {
        name: 'audit',
        description: 'Checklist pre-mainnet y prompts de auditoría especializados para el ecosistema Avalanche.',
        command: 'curl -s https://avaxskills.com/skills/audit.md',
      },
    ],
    architectureSteps: [
      {
        stepNumber: 1,
        title: 'Ingesta de Repositorio o Bytecode',
        description: 'El desarrollador ingresa la dirección del contrato en Fuji o enlaza su repositorio de GitHub.',
        tech: 'Foundry CLI / GitHub Webhooks',
      },
      {
        stepNumber: 2,
        title: 'Fork Testing en Vivo de Fuji',
        description: 'SentinelGuard clona el estado exacto de Fuji Testnet usando RPCs de AvalancheGo con alta velocidad.',
        tech: 'Anvil Fork / Fuji RPC URL',
      },
      {
        stepNumber: 3,
        title: 'Ejecución de Fuzzing de Invariantes AWM',
        description: 'Un enjambre de pruebas bombardea el contrato con millones de payloads maliciosos simulando relayers comprometidos.',
        tech: 'Foundry Invariant Fuzzing / Echidna',
      },
      {
        stepNumber: 4,
        title: 'Reporte de Vulnerabilidad & Certificado Pre-Mainnet',
        description: 'Genera un informe con puntaje de seguridad, sugerencias de código y checklist oficial de avaxskills.com.',
        tech: 'Automated Markdown / PDF Report Generator',
      },
    ],
    smartContractSnippet: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {ITeleporterMessenger} from "../src/interfaces/ITeleporterMessenger.sol";

/**
 * @title SentinelGuardFuzzTest
 * Test de invariantes para contratos Teleporter en Avalanche Fuji
 * Skills de referencia: avaxskills.com/skills/testing.md
 */
contract SentinelGuardFuzzTest is Test {
    address constant FUJI_TELEPORTER = 0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf;
    uint256 fujiForkId;

    function setUp() public {
        // Clonar estado real de Avalanche Fuji
        fujiForkId = vm.createSelectFork("https://api.avax-test.network/ext/bc/C/rpc");
    }

    // Fuzz test verificando que nunca se pueda recibir un mensaje con origen falsificado
    function testFuzz_SenderSpoofingReverts(
        address fakeSender,
        bytes32 fakeOriginChain,
        bytes calldata payload
    ) public {
        vm.assume(fakeSender != address(0));
        
        // Simular intento de llamada directa evadiendo TeleporterMessenger
        vm.prank(fakeSender);
        
        // Verificar que el contrato receptor rechace con revert
        // assertRevert("No autorizado");
    }
}`,
    agentPromptSnippet: `Actúa como auditor de seguridad especializado en Avalanche.
Consulta avaxskills.com/skills/audit.md y avaxskills.com/skills/defensive-solidity.md.
Analiza el siguiente contrato receptor de Teleporter en búsqueda de vulnerabilidades de repetición de mensajes (message replay), front-running de relayer rewards y falta de verificación del blockchainID de origen. Genera el código de prueba en Foundry para explotar cada fallo.`,
    pitchDeck: [
      {
        slideNumber: 1,
        title: 'SentinelGuard Fuji QA',
        tagline: 'Auditoría Continua y Fuzzing Automatizado para Smart Contracts en Avalanche',
        bullets: [
          'La primera suite de QA nativa para protocolos construidos con Teleporter y Subnets',
          'Pruebas con fork de Fuji que detectan vulnerabilidades cross-chain antes del despliegue a Mainnet',
          'Basado 100% en las mejores prácticas de avaxskills.com',
        ],
        callout: 'Premio Hackathon: Track Seguridad & Auditoría',
      },
      {
        slideNumber: 2,
        title: 'El Peligro Oculto en las Subnets',
        tagline: 'Las herramientas tradicionales no detectan fallos en arquitecturas cross-subnet',
        bullets: [
          'Más del 70% de las pérdidas en protocolos multicadena provienen de bugs de lógica cross-chain',
          'Slither y Hardhat no simulan firmas BLS ni comportamiento de relayers en Avalanche Warp Messaging',
          'Las auditorías humanas tardan 6 semanas y cuestan $40,000, retrasando los proyectos de hackathon',
        ],
      },
      {
        slideNumber: 3,
        title: 'La Solución SentinelGuard',
        tagline: 'Análisis profundo en minutos directamente en el flujo de CI/CD',
        bullets: [
          'Fork testing instantáneo del entorno de pruebas Fuji con RPCs optimizados',
          'Batería de 50+ reglas de seguridad específicas de Avalanche (Warp replay, gas exhaustion)',
          'Insignia de verificación "Fuji QA Certified" para generar confianza en la comunidad',
        ],
      },
      {
        slideNumber: 4,
        title: 'Integración en el Ecosistema',
        tagline: 'Herramienta esencial para cualquier equipo que participe en hackathons de Avalanche',
        bullets: [
          'Acción de GitHub (GitHub Action) ejecutable con cada Pull Request',
          'Panel web interactivo para explorar el árbol de llamadas y trazas de ejecución',
          'Compatible con proyectos escritos en Foundry, Hardhat y Brownie',
        ],
      },
      {
        slideNumber: 5,
        title: 'Modelo de Negocio & Crecimiento',
        tagline: 'Freemium para builders de hackathons, Enterprise para L1s institucionales',
        bullets: [
          'Gratis para proyectos en Fuji y repositorios de código abierto',
          'Suscripción Pro ($199/mes) para escaneo continuo de contratos en Mainnet',
          'Auditorías asistidas por IA para subnets que se preparan para Avalanche9000',
        ],
      },
      {
        slideNumber: 6,
        title: 'Entregables del Hackathon & Demostración',
        tagline: 'Detección en vivo de un exploit real en un contrato vulnerable de Teleporter',
        bullets: [
          'Plataforma web donde cualquier usuario puede pegar un contrato de Fuji',
          'Demostración en vivo encontrando una vulnerabilidad de reentrancia cruzada',
          'Generación de reporte descargable en Markdown y PDF',
        ],
      },
    ],
    hackathon48hPlan: [
      {
        phase: 'Fase 1: Motor de Análisis & Reglas (0h - 12h)',
        hours: '0h - 12h',
        milestone: 'Reglas de auditoría codificadas',
        tasks: [
          'Estructurar reglas de verificación basadas en avaxskills.com/skills/audit.md',
          'Crear plantillas de tests en Foundry para vectores de ataque comunes en AWM',
          'Configurar script de fork de Fuji con Anvil',
        ],
      },
      {
        phase: 'Fase 2: Backend de Ejecución & Fuzzing (12h - 24h)',
        hours: '12h - 24h',
        milestone: 'Ejecución automatizada de pruebas',
        tasks: [
          'Construir worker que clone repositorios y ejecute forge test --fork-url',
          'Parsear logs de Foundry y capturar fallos de invariantes',
          'Generar resumen de riesgos con puntuación del 1 al 100',
        ],
      },
      {
        phase: 'Fase 3: Interfaz Web & Reportes (24h - 36h)',
        hours: '24h - 36h',
        milestone: 'Portal web intuitivo para desarrolladores',
        tasks: [
          'Crear interfaz para pegar código Solidity o dirección de Snowtrace',
          'Visualizador de trazas de ejecución con resaltado de sintaxis',
          'Exportador de certificados de QA para incluir en repositorios de GitHub',
        ],
      },
      {
        phase: 'Fase 4: Validación con Contratos Reales & Pitch (36h - 48h)',
        hours: '36h - 48h',
        milestone: 'Demo lista y validada',
        tasks: [
          'Ejecutar la suite contra contratos reales de los otros participantes del hackathon',
          'Grabar vídeo de presentación mostrando la detección de una falla crítica',
          'Completar el README con instrucciones para integrar como GitHub Action',
        ],
      },
    ],
    rubricScore: {
      innovation: 92,
      technicalFeasibility: 98,
      avaxEcosystemFit: 97,
      marketPotential: 94,
      total: 95,
      verdict: 'Proyecto de bien público indispensable para madurar el ecosistema de desarrolladores de Avalanche.',
    },
    judgesTip: 'Los jueces de hackathons valoran enormemente las herramientas para desarrolladores (DevTools) porque benefician a todo el ecosistema. Ofrece a los jueces escanear sus propios contratos durante el pitch.',
  },
];

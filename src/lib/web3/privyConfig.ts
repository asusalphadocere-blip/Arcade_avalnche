/**
 * @file privyConfig.ts
 * @description Configuración para Embedded Wallets y Abstracción de Cuentas (ERC-4337)
 *              en Avalanche Fuji Testnet & C-Chain para Arcade Studio.
 * 
 * Permite a los asistentes a eventos iniciar sesión ÚNICAMENTE con su Email o Redes Sociales,
 * generando una Embedded Wallet instantánea sin extensiones ni seed phrases.
 */

import { defineChain } from 'viem';

// 1. Definición estricta de Avalanche Fuji Testnet para Viem y Providers Web3
export const avalancheFujiChain = defineChain({
  id: 43_113,
  name: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: {
      http: [
        process.env.VITE_AVALANCHE_FUJI_RPC || 'https://api.avax-test.network/ext/bc/C/rpc',
      ],
    },
    public: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Snowtrace Fuji',
      url: 'https://testnet.snowtrace.io',
    },
  },
  testnet: true,
});

// 2. Configuración de Privy Provider (Embedded Wallets para Eventos)
export const privyConfig = {
  // App ID obtenido desde dashboard.privy.io
  appId: process.env.VITE_PRIVY_APP_ID || 'arcade-studio-fuji-preview',

  // Configuración de interfaz visual personalizada para la marca del evento
  appearance: {
    theme: 'dark' as const,
    accentColor: '#E84142', // Rojo Avalanche
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
    showWalletLoginFirst: false, // Forzar login por correo para cero fricción Web3
    walletList: ['detected_wallets'],
  },

  // Métodos de autenticación: Email con código de 6 dígitos o Social Login
  loginMethods: ['email' as const, 'google' as const, 'apple' as const],

  // Creación automática y silenciosa de la Embedded Wallet
  embeddedWallets: {
    createOnLogin: 'all-users' as const, // Todos los asistentes reciben una wallet automáticamente
    noPromptOnSignature: true, // Sin popups intrusivos al firmar UserOps
  },

  // Red por defecto: Avalanche Fuji Testnet
  defaultChain: avalancheFujiChain,
  supportedChains: [avalancheFujiChain],
};

// 3. Configuración del Paymaster / Relayer ERC-4337
export const paymasterConfig = {
  // Enpoint del Bundler / Paymaster (Pimlico, Biconomy o Bouncer Relayer de Arcade Studio)
  paymasterRpcUrl: 
    process.env.VITE_PAYMASTER_RPC_URL || 
    'https://api.pimlico.io/v2/43113/rpc?apikey=' + (process.env.VITE_PIMLICO_API_KEY || 'demo-key'),

  // ID de la política de patrocinio de gas para el evento (Arcade Studio cubre el 100% del gas)
  sponsorshipPolicyId: process.env.VITE_SPONSORSHIP_POLICY_ID || 'sp_arcade_studio_events',

  // Dirección del contrato inteligente PoAP desplegado en Avalanche Fuji
  contractAddress: 
    (process.env.VITE_POAP_CONTRACT_ADDRESS || '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4') as `0x${string}`,

  // URL del Relayer Backend (Fallback directo sin bundler externo)
  relayerApiEndpoint: '/api/poap/gasless-mint',
};

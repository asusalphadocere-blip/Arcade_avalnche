# 🔺 Arcade Avalanche · Turn-Based On-Chain Gaming & Event Runtime

> **Plataforma interactiva para eventos y hackathons Web3.** Convierte la audiencia presencial en jugadores multijugador en tiempo real con turnos registrados 100% on-chain en Avalanche (< 800ms de finalidad), abstracción de cuenta para juego sin fricción y certificados digitales / POAP compartibles en redes sociales.

🔗 **Evento Oficial en Luma:** [https://luma.com/fg52mshy](https://luma.com/fg52mshy)  
*Ruta a la Hackathon Universitaria · Dev3pack x ChileDAO*

---

## ⚡ ¿Por qué Avalanche en Juegos por Turnos para Eventos?

1. **Finalidad Sub-segundo (< 800ms):**
   - En otras blockchains, esperar 10–15 segundos por turno destruye la experiencia de un evento presencial.
   - En Avalanche, cada turno de los jugadores se procesa casi de inmediato, reflejando el estado en vivo en la pantalla gigante del escenario.
2. **Acciones On-Chain Visibles en Tiempo Real (Espectador + Jugador):**
   - Cada turno emite un evento/transacción en la C-Chain de Fuji.
   - La pantalla comunitaria del evento consume los bloques y proyecta la batalla en vivo.
3. **Abstracción de Cuenta (Gasless Play):**
   - Los asistentes escanean el código QR, ingresan su correo o nombre, y juegan sin pagar gas ni instalar billeteras complejas. El contrato y el relayer patrocinan el gas.

---

## 🎮 Características del Demo

- 👾 **Boss Raid Comunal por Turnos (Pixel Art 8-Bit):**
  - Enfrentamiento cooperativo contra el Boss Gólem de Avalanche con sprites SVG retro 8-bit nativos.
  - Habilidades: *Ataque Rápido AVAX* (Guerrero), *Teleporter Combo AWM* (Mago) y *Escudo Subnet* (Guardián).
- 🏆 **Certificados Digitales & Gasless POAP:**
  - Minteo de badges Soulbound en Avalanche Fuji C-Chain sin costo de gas para el asistente.
  - Compartición instantánea a **WhatsApp**, **LinkedIn** e **Instagram Stories (formato 9:16)**.
- 🎟️ **Check-in & Sorteo en Vivo (Tómbola):**
  - Registro de asistentes, asignación de tickets numerados y sorteo animado para el escenario.
- 🐙 **Sincronización con GitHub:**
  - Repositorio oficial conectado: `https://github.com/asusalphadocere-blip/Arcade_avalnche`

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite.
- **Gráficos:** Pixel Art SVG Retro 8-bit con renderizado `crispEdges`.
- **Backend / Relayer:** Express, TypeScript (tsx), proxy para minteo gasless en Avalanche Fuji.
- **Blockchain:** Avalanche Fuji Testnet (Chain ID 43113), Contratos Solidity ERC-721 / Soulbound.

---

## 🚀 Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/asusalphadocere-blip/Arcade_avalnche.git
cd Arcade_avalnche

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

---

## 📄 Licencia

MIT © [Dev3pack & Avalanche Community](https://luma.com/fg52mshy)

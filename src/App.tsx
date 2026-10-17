import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { INITIAL_PROJECTS, AVAILABLE_ENGINES } from './data/initialProjects';
import { INITIAL_ATTENDEES, INITIAL_RAFFLE_PRIZES, INITIAL_EVENTS_HISTORY } from './data/initialAttendees';
import { VersionedGameConfig, AttendeeRecord, RafflePrize, EventsHistoryFile } from './types/arcade';
import { ProjectManager } from './components/ProjectManager';
import { BrandEditor } from './components/BrandEditor';
import { LiveEventScreen } from './components/LiveEventScreen';
import { CheckInModule } from './components/CheckInModule';
import { RaffleScreen } from './components/RaffleScreen';
import { ArchitectureView } from './components/ArchitectureView';
import { ConfigJsonViewer } from './components/ConfigJsonViewer';
import { EventHistoryModal } from './components/EventHistoryModal';
import { GaslessPoapModule } from './components/GaslessPoapModule';
import { OnChainTurnBasedGame } from './components/OnChainTurnBasedGame';
import { GitHubHubModule } from './components/GitHubHubModule';
import { QuickTestGuide } from './components/QuickTestGuide';
import { 
  Gamepad2, 
  Flame, 
  Sparkles, 
  ExternalLink,
  Layers,
  CheckCircle2,
  Ticket,
  Gift,
  Award,
  Palette,
  Tv,
  Swords,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<VersionedGameConfig[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0].project.id);
  const [activeTab, setActiveTab] = useState<'games' | 'projects' | 'editor' | 'checkin' | 'raffle' | 'live' | 'architecture' | 'poap' | 'github'>('games');
  const [gameSubView, setGameSubView] = useState<'boss_raid' | 'arcade_2d' | 'kiosk'>('boss_raid');
  const [checkinSubTab, setCheckinSubTab] = useState<'checkin' | 'raffle'>('checkin');
  
  // Attendee records per event project
  const [attendeesMap, setAttendeesMap] = useState<Record<string, AttendeeRecord[]>>(INITIAL_ATTENDEES);
  
  // Raffle prizes per event project
  const [prizesMap, setPrizesMap] = useState<Record<string, RafflePrize[]>>(INITIAL_RAFFLE_PRIZES);
  
  // Full multi-event history file
  const [eventsHistory, setEventsHistory] = useState<EventsHistoryFile>(INITIAL_EVENTS_HISTORY);

  // Modals state
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFullscreenLiveScreen, setShowFullscreenLiveScreen] = useState(false);

  const currentProject = projects.find((p) => p.project.id === selectedProjectId) || projects[0];
  const currentAttendees = attendeesMap[selectedProjectId] || [];
  const currentPrizes = prizesMap[selectedProjectId] || [
    {
      id: 'prz-def-1',
      title: 'Premio Mayor del Evento (Merch Oficial)',
      criteria: 'all_attendees',
    },
    {
      id: 'prz-def-2',
      title: 'Premio por Puntuación Arcade (Mejor Jugador)',
      criteria: 'min_score',
      minScoreRequired: 200,
    },
  ];

  const handleUpdateConfig = (newConfig: VersionedGameConfig) => {
    setProjects((prev) =>
      prev.map((p) => (p.project.id === newConfig.project.id ? newConfig : p))
    );
  };

  const handleAddAttendee = (newAttendee: AttendeeRecord) => {
    const updated = [newAttendee, ...currentAttendees];
    setAttendeesMap((prev) => ({
      ...prev,
      [selectedProjectId]: updated,
    }));

    // Update history snapshot
    updateEventHistorySnapshot(selectedProjectId, updated, currentPrizes);
  };

  const handleAwardPrize = (prizeId: string, winner: AttendeeRecord) => {
    const updatedPrizes = currentPrizes.map((p) =>
      p.id === prizeId ? { ...p, winner, drawnAt: new Date().toISOString() } : p
    );
    setPrizesMap((prev) => ({
      ...prev,
      [selectedProjectId]: updatedPrizes,
    }));

    // Mark in attendee wonPrizes
    const updatedAttendees = currentAttendees.map((a) =>
      a.id === winner.id ? { ...a, wonPrizes: [...a.wonPrizes, prizeId] } : a
    );
    setAttendeesMap((prev) => ({
      ...prev,
      [selectedProjectId]: updatedAttendees,
    }));

    updateEventHistorySnapshot(selectedProjectId, updatedAttendees, updatedPrizes);
  };

  const handleResetAttendees = () => {
    setAttendeesMap((prev) => ({
      ...prev,
      [selectedProjectId]: [],
    }));
    updateEventHistorySnapshot(selectedProjectId, [], currentPrizes);
  };

  const handleRestoreAttendees = () => {
    const testData = INITIAL_ATTENDEES[selectedProjectId] || [];
    setAttendeesMap((prev) => ({
      ...prev,
      [selectedProjectId]: testData,
    }));
    updateEventHistorySnapshot(selectedProjectId, testData, currentPrizes);
  };

  const updateEventHistorySnapshot = (
    projId: string,
    attList: AttendeeRecord[],
    przList: RafflePrize[]
  ) => {
    const targetProject = projects.find((p) => p.project.id === projId) || currentProject;
    const existingIndex = eventsHistory.events.findIndex((e) => e.projectId === projId);
    const newEntry = {
      projectId: projId,
      eventName: targetProject.event.name,
      date: new Date().toISOString().slice(0, 10),
      brandTitle: targetProject.brand.title,
      gameEngine: targetProject.game.engineId,
      totalAttendees: attList.length,
      totalGamesPlayed: attList.reduce((acc, curr) => acc + curr.attemptsCount, 0),
      highestScore: attList.reduce((max, curr) => Math.max(max, curr.bestScore), 0),
      lumaUrl: targetProject.event.lumaUrl,
      attendees: attList,
      raffleHistory: przList,
      configSnapshot: targetProject,
    };

    let updatedEvents = [...eventsHistory.events];
    if (existingIndex >= 0) {
      updatedEvents[existingIndex] = newEntry;
    } else {
      updatedEvents.unshift(newEntry);
    }

    setEventsHistory({
      ...eventsHistory,
      exportedAt: new Date().toISOString(),
      events: updatedEvents,
    });
  };

  const handleCreateNewProject = (engineId: string) => {
    const engineInfo = AVAILABLE_ENGINES.find((e) => e.id === engineId) || AVAILABLE_ENGINES[0];
    const newId = `evt-${engineId}-${Date.now().toString(36)}`;
    const newProject: VersionedGameConfig = {
      schemaVersion: '1.0.0',
      project: {
        id: newId,
        name: `Nuevo Evento: ${engineInfo.name.split('—')[1]?.trim() || 'Arcade'}`,
        status: 'draft',
        updatedAt: new Date().toISOString(),
      },
      event: {
        name: 'Conferencia Tecnológica 2026',
        startAt: null,
        endAt: null,
        timezone: 'America/Santiago',
        accessMode: 'open',
        maxAttemptsPerPlayer: 3,
      },
      game: {
        engineId: engineInfo.id,
        engineVersion: '1.0.0',
        durationSeconds: 30,
        difficulty: 'normal',
        controls: ['touch', 'keyboard'],
        scoring: {
          collectItem: 10,
          avoidObstacle: true,
          penaltyObstacle: 15,
          bonusMultiplier: 2,
        },
        assets: {
          player: 'Player Icon',
          collectibles: 'Brand Items',
          obstacles: 'Hazards',
          background: 'Arena',
        },
      },
      brand: {
        logoText: 'Mi Marca Arcade',
        logoIcon: 'Flame',
        colors: {
          primary: '#E84142',
          secondary: '#1A1E29',
          background: '#0B0E14',
          text: '#FFFFFF',
          accent: '#FF6B6C',
        },
        fontFamily: 'Plus Jakarta Sans',
        title: 'Desafío Arcade Oficial',
        tagline: 'Participa y compite por el primer lugar en el ranking del evento.',
        startButton: 'Jugar Ahora',
        endMessage: '¡Gracias por participar! Tu puntuación quedó registrada.',
      },
      leaderboard: {
        enabled: true,
        scope: 'event',
        displayNameMode: 'nickname',
      },
      deployment: {
        targets: ['mobile-web', 'arcade-kiosk'],
        publishedVersion: null,
        slug: `arcade-${Date.now().toString(36)}`,
      },
      integrations: {
        avalanche: {
          enabled: false,
          network: 'avalanche-fuji',
          digitalBadge: false,
          onchainLeaderboard: false,
          gaslessRelay: false,
        },
      },
    };

    setProjects([newProject, ...projects]);
    setSelectedProjectId(newId);
    setAttendeesMap((prev) => ({ ...prev, [newId]: [] }));
    setPrizesMap((prev) => ({
      ...prev,
      [newId]: [
        {
          id: `prz-${Date.now()}`,
          title: 'Premio Especial del Evento',
          criteria: 'all_attendees',
        },
      ],
    }));
    setActiveTab('editor');
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewProject={() => handleCreateNewProject('catch-collect')}
        onOpenHistory={() => setShowHistoryModal(true)}
        activeProjectName={currentProject.project.name}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => setSelectedProjectId(id)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Interactive 4-Step Quick Testing Guide */}
        <QuickTestGuide
          activeTab={activeTab}
          onNavigate={(tab, subView, checkinSub) => {
            setActiveTab(tab);
            if (subView) setGameSubView(subView as any);
            if (checkinSub) setCheckinSubTab(checkinSub as any);
          }}
        />

        {/* TAB 1: JUEGOS ON-CHAIN & ARCADE 2D (STREAMLINED DEMO) */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            {/* Sub-view Selector Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setGameSubView('boss_raid')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                    gameSubView === 'boss_raid'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-950'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Boss Raid On-Chain (Por Turnos &lt;800ms)</span>
                </button>

                <button
                  onClick={() => setGameSubView('arcade_2d')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                    gameSubView === 'arcade_2d'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-950'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Arcade 2D (Catch & Collect)</span>
                </button>

                <button
                  onClick={() => setGameSubView('kiosk')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                    gameSubView === 'kiosk'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-950'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Pantalla Gigante Kiosko</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('editor')}
                  className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Editor de Marca</span>
                </button>
              </div>
            </div>

            {/* Sub-view View Render */}
            {gameSubView === 'boss_raid' && (
              <OnChainTurnBasedGame
                config={currentProject}
                attendees={currentAttendees}
                onOpenPoapClaim={() => setActiveTab('poap')}
              />
            )}

            {gameSubView === 'arcade_2d' && (
              <BrandEditor
                config={currentProject}
                onChangeConfig={handleUpdateConfig}
                onOpenLiveScreen={() => setShowFullscreenLiveScreen(true)}
                onOpenJsonViewer={() => setShowJsonModal(true)}
              />
            )}

            {gameSubView === 'kiosk' && (
              <div className="h-[80vh] relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                <LiveEventScreen
                  config={currentProject}
                  onClose={() => setGameSubView('boss_raid')}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROJECTS LIST (FALLBACK OR VIA MENU) */}
        {activeTab === 'projects' && (
          <ProjectManager
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setActiveTab('games');
            }}
            onCreateNewProject={handleCreateNewProject}
            onOpenLiveScreen={(proj) => {
              setSelectedProjectId(proj.project.id);
              setShowFullscreenLiveScreen(true);
            }}
          />
        )}

        {/* TAB 3: BRAND & GAMEPLAY EDITOR */}
        {activeTab === 'editor' && (
          <BrandEditor
            config={currentProject}
            onChangeConfig={handleUpdateConfig}
            onOpenLiveScreen={() => setShowFullscreenLiveScreen(true)}
            onOpenJsonViewer={() => setShowJsonModal(true)}
          />
        )}

        {/* TAB 4: ATTENDEE CHECK-IN & RAFFLE (UNIFIED) */}
        {activeTab === 'checkin' && (
          <div className="space-y-6">
            {/* Sub-tab Pill for Checkin vs Raffle */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-fit">
              <button
                onClick={() => setCheckinSubTab('checkin')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                  checkinSubTab === 'checkin'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>1. Registro & Tickets de Llegada</span>
              </button>

              <button
                onClick={() => setCheckinSubTab('raffle')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                  checkinSubTab === 'raffle'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>2. Tómbola & Sorteo de Premios</span>
              </button>
            </div>

            {checkinSubTab === 'checkin' && (
              <CheckInModule
                config={currentProject}
                attendees={currentAttendees}
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={(id) => setSelectedProjectId(id)}
                onAddAttendee={handleAddAttendee}
                onResetAttendees={handleResetAttendees}
                onRestoreAttendees={handleRestoreAttendees}
                onLaunchGameForAttendee={(att) => {
                  setActiveTab('games');
                }}
              />
            )}

            {checkinSubTab === 'raffle' && (
              <RaffleScreen
                config={currentProject}
                attendees={currentAttendees}
                prizes={currentPrizes}
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={(id) => setSelectedProjectId(id)}
                onAwardPrize={handleAwardPrize}
              />
            )}
          </div>
        )}

        {/* TAB 5: RAFFLE DIRECT TAB (IF ACCESSED) */}
        {activeTab === 'raffle' && (
          <RaffleScreen
            config={currentProject}
            attendees={currentAttendees}
            prizes={currentPrizes}
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={(id) => setSelectedProjectId(id)}
            onAwardPrize={handleAwardPrize}
          />
        )}

        {/* TAB 5: LIVE EVENT KIOSK SCREEN (EMBEDDED) */}
        {activeTab === 'live' && (
          <div className="h-[80vh] relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <LiveEventScreen
              config={currentProject}
              onClose={() => setActiveTab('editor')}
            />
          </div>
        )}

        {/* TAB: GITHUB HUB (OAUTH, DEV PROFILE, REPO SYNC) */}
        {activeTab === 'github' && (
          <GitHubHubModule
            currentProject={currentProject}
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={(id) => setSelectedProjectId(id)}
            attendees={currentAttendees}
            onOpenAvalancheModule={() => setActiveTab('poap')}
          />
        )}

        {/* TAB 6: GASLESS POAPS & WEB3 BADGES (AVALANCHE FUJI - OPTIONAL) */}
        {activeTab === 'poap' && (
          <GaslessPoapModule
            currentProject={currentProject}
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={(id) => setSelectedProjectId(id)}
            attendees={currentAttendees}
          />
        )}

        {/* TAB 7: ARCHITECTURE VIEW */}
        {activeTab === 'architecture' && (
          <ArchitectureView
            config={currentProject}
            onOpenJsonViewer={() => setShowJsonModal(true)}
          />
        )}
      </main>

      {/* Fullscreen Live Event Screen Modal */}
      {showFullscreenLiveScreen && (
        <LiveEventScreen
          config={currentProject}
          onClose={() => setShowFullscreenLiveScreen(false)}
        />
      )}

      {/* Config JSON Modal */}
      {showJsonModal && (
        <ConfigJsonViewer
          config={currentProject}
          onClose={() => setShowJsonModal(false)}
        />
      )}

      {/* Multi-Event JSON History Modal */}
      {showHistoryModal && (
        <EventHistoryModal
          historyData={eventsHistory}
          onImportHistory={(imported) => {
            setEventsHistory(imported);
          }}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-red-500" />
            <strong className="text-white">Arcade Studio</strong>
            <span>—</span>
            <span>Check-in con Ticket Correlativo · Tómbola Digital · Historial Multi-Evento en JSON</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              Exportar Historial JSON
            </button>
            <span>Avalanche Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

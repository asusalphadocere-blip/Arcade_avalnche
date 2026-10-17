/**
 * @file githubService.ts
 * @description Servicio cliente para conectar Arcade Studio con GitHub (OAuth, Perfil de Desarrollador, Sincronización de Repositorios)
 */

export interface GitHubUser {
  id: number | string;
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  company?: string;
  location?: string;
  email?: string;
  topLanguages?: string[];
  connectedAt: number;
  syncedRepos?: { name: string; url: string; updatedAt: string; lastCommit: string }[];
}

export interface SyncResult {
  name: string;
  url: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  timestamp: number;
  files: string[];
}

const STORAGE_KEY = 'arcade_studio_github_user';

export const githubService = {
  // Obtener usuario guardado localmente
  getLocalUser(): GitHubUser | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // Guardar usuario localmente
  setLocalUser(user: GitHubUser | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  // Obtener URL de autorización desde el backend
  async getAuthUrl(): Promise<{
    url: string;
    isConfigured: boolean;
    redirectUri: string;
    devCallbackUrl: string;
    sharedCallbackUrl: string;
  }> {
    const res = await fetch('/api/auth/github/url');
    if (!res.ok) {
      throw new Error('Error al obtener URL de autorización de GitHub');
    }
    return res.json();
  },

  // Iniciar flujo OAuth en popup directo
  async loginWithPopup(): Promise<GitHubUser> {
    const { url, isConfigured } = await this.getAuthUrl();

    return new Promise((resolve, reject) => {
      // Configurar escucha de postMessage antes de abrir el popup
      let timeoutId: any;

      const handleMessage = (event: MessageEvent) => {
        // Validar origen
        const origin = event.origin;
        if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
          return;
        }

        if (event.data?.type === 'GITHUB_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          clearTimeout(timeoutId);
          const user = event.data.user as GitHubUser;
          githubService.setLocalUser(user);
          resolve(user);
        }
      };

      window.addEventListener('message', handleMessage);

      // Si no hay GITHUB_CLIENT_ID configurado, alertar o derivar a demo login amigable
      if (!isConfigured) {
        // Abrir popup de demostración o realizar demoLogin directamente
        this.demoLogin('alphadocere')
          .then((user) => {
            window.removeEventListener('message', handleMessage);
            resolve(user);
          })
          .catch(reject);
        return;
      }

      // Abrir ventana popup con la URL del proveedor OAuth directamente (requisito iframe AI Studio)
      const popup = window.open(
        url,
        'github_oauth_popup',
        'width=600,height=720,menubar=no,toolbar=no,status=no'
      );

      if (!popup) {
        window.removeEventListener('message', handleMessage);
        reject(new Error('El navegador bloqueó la ventana emergente. Por favor permite popups para este sitio.'));
        return;
      }

      // Timeout después de 2 minutos
      timeoutId = setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        reject(new Error('Tiempo de espera agotado al conectar con GitHub'));
      }, 120000);
    });
  },

  // Login de demostración instantáneo
  async demoLogin(username = 'alphadocere'): Promise<GitHubUser> {
    const res = await fetch('/api/auth/github/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      throw new Error('Error al conectar perfil demo de GitHub');
    }

    const data = await res.json();
    this.setLocalUser(data.user);
    return data.user;
  },

  // Obtener estado actual del usuario
  async fetchCurrentUser(): Promise<GitHubUser | null> {
    try {
      const res = await fetch('/api/auth/github/user');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          this.setLocalUser(data.user);
          return data.user;
        }
      }
    } catch {
      // Ignorar error de red y usar local
    }
    return this.getLocalUser();
  },

  // Cerrar sesión de GitHub
  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/github/logout', { method: 'POST' });
    } catch {
      // Ignorar
    }
    this.setLocalUser(null);
  },

  // Sincronizar configuración con repositorio de GitHub
  async syncConfigToRepo(
    repoName: string,
    config: any,
    commitMessage?: string
  ): Promise<SyncResult> {
    const res = await fetch('/api/github/sync-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repoName,
        config,
        commitMessage,
        branch: 'main',
      }),
    });

    if (!res.ok) {
      throw new Error('Error al sincronizar con el repositorio de GitHub');
    }

    const data = await res.json();
    // Actualizar local user synced repos
    const local = this.getLocalUser();
    if (local) {
      const updated = {
        ...local,
        syncedRepos: [
          {
            name: data.record.name,
            url: data.record.url,
            updatedAt: new Date().toISOString(),
            lastCommit: data.record.commitHash,
          },
          ...(local.syncedRepos || []).filter((r) => r.name !== data.record.name),
        ],
      };
      this.setLocalUser(updated);
    }
    return data.record;
  },
};

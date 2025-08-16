import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface AppInfo {
  version: string;
  electron: string;
  node: string;
  platform: string;
  arch: string;
}

interface DatabaseStatus {
  connected: boolean;
  message: string;
}

export const useAppStore = defineStore('app', () => {
  // State
  const loading = ref(false);
  const appInfo = ref<AppInfo | null>(null);
  const databaseStatus = ref<DatabaseStatus>({ connected: false, message: 'Bağlantı kontrol ediliyor...' });
  const sidebarCollapsed = ref(false);
  const currentRoute = ref('');

  // Getters
  const isLoading = computed(() => loading.value);
  const isConnected = computed(() => databaseStatus.value.connected);
  const appVersion = computed(() => appInfo.value?.version || '1.0.0');

  // Actions
  const setLoading = (state: boolean) => {
    loading.value = state;
  };

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed;
  };

  const setCurrentRoute = (route: string) => {
    currentRoute.value = route;
  };

  const fetchAppInfo = async () => {
    try {
      if (
        typeof window !== 'undefined' &&
        (window as any).electronAPI &&
        (window as any).electronAPI.app &&
        typeof (window as any).electronAPI.app.getInfo === 'function'
      ) {
        const info = await (window as any).electronAPI.app.getInfo();
        appInfo.value = info;
      } else {
        appInfo.value = {
          version: 'dev',
          electron: process?.versions?.electron || 'unknown',
          node: process?.versions?.node || 'unknown',
          platform: process?.platform || 'browser',
          arch: process?.arch || 'x64'
        };
      }
    } catch (error) {
      console.error('App info fetch error:', error);
    }
  };

  const checkDatabaseStatus = async () => {
    try {
      if (
        typeof window !== 'undefined' &&
        (window as any).electronAPI &&
        (window as any).electronAPI.database &&
        typeof (window as any).electronAPI.database.getStatus === 'function'
      ) {
        const status = await (window as any).electronAPI.database.getStatus();
        databaseStatus.value = status;
      } else {
        databaseStatus.value = {
          connected: false,
          message: 'Electron database API not available'
        };
      }
    } catch (error) {
      console.error('Database status check error:', error);
      databaseStatus.value = {
        connected: false,
        message: 'Veritabanı bağlantısı kontrol edilemedi'
      };
    }
  };

  const runMigrations = async () => {
    try {
      setLoading(true);
      if (window.electronAPI) {
        const result = await window.electronAPI.database.migrate();
        await checkDatabaseStatus();
        return result;
      }
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const runSeeds = async () => {
    try {
      setLoading(true);
      if (window.electronAPI) {
        const result = await window.electronAPI.database.seed();
        return result;
      }
    } catch (error) {
      console.error('Seed error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const restartApp = async () => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.app.restart();
      }
    } catch (error) {
      console.error('App restart error:', error);
      throw error;
    }
  };

  const reportError = (error: any, context?: any) => {
    try {
      if (
        typeof window !== 'undefined' &&
        (window as any).electronAPI &&
        (window as any).electronAPI.system &&
        typeof (window as any).electronAPI.system.reportError === 'function'
      ) {
        (window as any).electronAPI.system.reportError({
          error: {
            message: error?.message || String(error),
            stack: error?.stack,
            name: error?.name
          },
          context,
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : null
        });
      } else {
        console.warn('Electron API not available - reportError fallback to console.');
        console.error(error, context);
      }
    } catch (e) {
      console.error('Failed to report error via electronAPI:', e, 'Original error:', error, context);
    }
  };

  const logMessage = (level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any) => {
    if (window.electronAPI) {
      window.electronAPI.system.log(level, message, data);
    }
  };

  // Initialize
  const initialize = async () => {
    await Promise.all([
      fetchAppInfo(),
      checkDatabaseStatus()
    ]);
  };

  return {
    // State
    loading,
    appInfo,
    databaseStatus,
    sidebarCollapsed,
    currentRoute,

    // Getters
    isLoading,
    isConnected,
    appVersion,

    // Actions
    setLoading,
    toggleSidebar,
    setSidebarCollapsed,
    setCurrentRoute,
    fetchAppInfo,
    checkDatabaseStatus,
    runMigrations,
    runSeeds,
    restartApp,
    reportError,
    logMessage,
    initialize
  };
});
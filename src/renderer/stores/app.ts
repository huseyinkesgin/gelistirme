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
      if (window.electronAPI) {
        const info = await window.electronAPI.app.getInfo();
        appInfo.value = info;
      }
    } catch (error) {
      console.error('App info fetch error:', error);
    }
  };

  const checkDatabaseStatus = async () => {
    try {
      if (window.electronAPI) {
        const status = await window.electronAPI.database.getStatus();
        databaseStatus.value = status;
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
    if (window.electronAPI) {
      window.electronAPI.system.reportError({
        error: {
          message: error.message || String(error),
          stack: error.stack,
          name: error.name
        },
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
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
<template>
  <div id="app" class="h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Loading overlay -->
    <LoadingOverlay v-if="appStore.isLoading" />
    
    <!-- Auth layout -->
    <template v-if="!authStore.isAuthenticated">
      <router-view />
    </template>
    
    <!-- Main app layout -->
    <template v-else>
      <!-- Sidebar -->
      <Sidebar 
        v-if="showSidebar && !appStore.sidebarCollapsed" 
        class="flex-shrink-0 transition-all duration-300"
        :class="{ 'w-16': appStore.sidebarCollapsed, 'w-64': !appStore.sidebarCollapsed }"
      />
      
      <!-- Ana içerik alanı -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <Header class="flex-shrink-0" />
        
        <!-- Breadcrumb -->
        <Breadcrumb v-if="currentRoute.meta?.breadcrumb" class="flex-shrink-0" />
        
        <!-- Ana içerik -->
        <main class="flex-1 overflow-auto">
          <div class="p-6">
            <router-view v-slot="{ Component, route }">
              <transition
                :name="route.meta?.transition || 'fade'"
                mode="out-in"
                appear
              >
                <keep-alive v-if="route.meta?.keepAlive">
                  <component :is="Component" :key="route.path" />
                </keep-alive>
                <component v-else :is="Component" :key="route.path" />
              </transition>
            </router-view>
          </div>
        </main>
      </div>
    </template>
    
    <!-- Global components -->
    <NotificationContainer />
    <ModalContainer />
    
    <!-- Development tools -->
    <DevTools v-if="settingsStore.isDebugMode && isDev" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore, useAuthStore, useThemeStore, useSettingsStore, useNotificationStore } from './stores';

// Components
import Sidebar from './components/layout/Sidebar.vue';
import Header from './components/layout/Header.vue';
import Breadcrumb from './components/layout/Breadcrumb.vue';
import NotificationContainer from './components/notifications/NotificationContainer.vue';
import ModalContainer from './components/modals/ModalContainer.vue';
import LoadingOverlay from './components/ui/LoadingOverlay.vue';
import DevTools from './components/dev/DevTools.vue';

// Stores
const appStore = useAppStore();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const settingsStore = useSettingsStore();
const notificationStore = useNotificationStore();

// Router
const currentRoute = useRoute();

// State
const showSidebar = ref(true);
const isDev = ref(process.env.NODE_ENV === 'development');

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Electron API event listeners
const setupElectronListeners = () => {
  if (window.electronAPI) {
    // Navigation events
    window.electronAPI.on('navigate-to', (route: string) => {
      router.push(route);
    });
    
    // Window state events
    window.electronAPI.on('save-window-state', (state: any) => {
      localStorage.setItem('window-state', JSON.stringify(state));
    });
    
    window.electronAPI.on('get-window-state', () => {
      const saved = localStorage.getItem('window-state');
      if (saved) {
        try {
          const state = JSON.parse(saved);
          // Window state'i main process'e gönder
          // Bu işlem main process tarafından handle edilecek
        } catch (error) {
          console.error('Window state parse error:', error);
        }
      }
    });
  }
};

// Cleanup electron listeners
const cleanupElectronListeners = () => {
  if (window.electronAPI) {
    window.electronAPI.off('navigate-to', () => {});
    window.electronAPI.off('save-window-state', () => {});
    window.electronAPI.off('get-window-state', () => {});
  }
};

// Auto-save functionality
let autoSaveInterval: NodeJS.Timeout | null = null;

const setupAutoSave = () => {
  if (settingsStore.autoSaveEnabled && authStore.isAuthenticated) {
    const interval = settingsStore.settings.autoSaveInterval * 60 * 1000; // Convert to milliseconds
    
    autoSaveInterval = setInterval(() => {
      // Auto-save logic burada implement edilecek
      appStore.logMessage('debug', 'Auto-save triggered');
    }, interval);
  }
};

const cleanupAutoSave = () => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
};

// Session timeout
let sessionTimeoutId: NodeJS.Timeout | null = null;

const setupSessionTimeout = () => {
  if (authStore.isAuthenticated && settingsStore.settings.sessionTimeout > 0) {
    const timeout = settingsStore.settings.sessionTimeout * 60 * 1000; // Convert to milliseconds
    
    sessionTimeoutId = setTimeout(() => {
      notificationStore.warning(
        'Oturum Zaman Aşımı',
        'Oturumunuz zaman aşımına uğradı. Lütfen tekrar giriş yapın.'
      );
      authStore.logout();
    }, timeout);
  }
};

const resetSessionTimeout = () => {
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
    sessionTimeoutId = null;
  }
  setupSessionTimeout();
};

const cleanupSessionTimeout = () => {
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
    sessionTimeoutId = null;
  }
};

// User activity tracking
const trackUserActivity = () => {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  const resetTimeout = () => {
    resetSessionTimeout();
  };
  
  events.forEach(event => {
    document.addEventListener(event, resetTimeout, true);
  });
  
  // Cleanup function
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, resetTimeout, true);
    });
  };
};

// Error boundary
const handleGlobalError = (error: ErrorEvent) => {
  appStore.reportError(error.error, {
    filename: error.filename,
    lineno: error.lineno,
    colno: error.colno
  });
  
  notificationStore.systemError(error.error, 'Beklenmeyen bir hata oluştu');
};

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  appStore.reportError(event.reason, 'Unhandled promise rejection');
  notificationStore.systemError(event.reason, 'İşlem tamamlanamadı');
};

// Lifecycle
onMounted(async () => {
  try {
    // Initialize stores
    await Promise.all([
      appStore.initialize(),
      settingsStore.loadSettings(),
      themeStore.initialize()
    ]);
    
    // Setup electron listeners
    setupElectronListeners();
    
    // Setup user activity tracking
    const cleanupActivity = trackUserActivity();
    
    // Setup auto-save
    setupAutoSave();
    
    // Setup session timeout
    setupSessionTimeout();
    
    // Global error handlers
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Welcome notification for first-time users
    if (settingsStore.settings.showWelcomeScreen && authStore.isAuthenticated) {
      notificationStore.info(
        'Hoş Geldiniz!',
        'Emlak Portföy Yönetim Sistemi\'ne hoş geldiniz.',
        { duration: 8000 }
      );
    }
    
    appStore.logMessage('info', 'Application initialized successfully');
    
    // Cleanup function'ı onUnmounted'a kaydet
    onUnmounted(() => {
      cleanupActivity();
    });
  } catch (error) {
    console.error('App initialization error:', error);
    appStore.reportError(error, 'App initialization failed');
    notificationStore.systemError(error, 'Uygulama başlatılamadı');
  }
});

onUnmounted(() => {
  // Cleanup
  cleanupElectronListeners();
  cleanupAutoSave();
  cleanupSessionTimeout();
  
  // Remove global error handlers
  window.removeEventListener('error', handleGlobalError);
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
});

// Watch for auth changes
watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      setupAutoSave();
      setupSessionTimeout();
    } else {
      cleanupAutoSave();
      cleanupSessionTimeout();
    }
  }
);

// Watch for settings changes
watch(
  () => settingsStore.settings.autoSave,
  () => {
    cleanupAutoSave();
    setupAutoSave();
  }
);

watch(
  () => settingsStore.settings.sessionTimeout,
  () => {
    cleanupSessionTimeout();
    setupSessionTimeout();
  }
);
</script>

<style>
/* Global transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* No animations class */
.no-animations * {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}

/* High contrast mode */
.high-contrast {
  filter: contrast(150%);
}

/* Compact mode */
.compact {
  --spacing-unit: 0.5rem;
}

.compact .p-6 {
  padding: var(--spacing-unit);
}

.compact .p-4 {
  padding: calc(var(--spacing-unit) * 0.75);
}

/* Dark mode utilities */
.dark {
  color-scheme: dark;
}
</style>
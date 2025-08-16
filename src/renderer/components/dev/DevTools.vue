<template>
  <div
    v-if="isVisible"
    class="fixed bottom-4 right-4 z-50 bg-gray-900 text-white rounded-lg shadow-xl p-4 max-w-sm"
  >
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold">Dev Tools</h3>
      <button
        @click="toggleVisibility"
        class="text-gray-400 hover:text-white"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>
    
    <div class="space-y-2 text-xs">
      <!-- Performance metrics -->
      <div class="border-b border-gray-700 pb-2">
        <div class="font-medium mb-1">Performance</div>
        <div>Memory: {{ formatBytes(performance.memory) }}</div>
        <div>CPU: {{ performance.cpu }}%</div>
        <div>Uptime: {{ formatUptime(performance.uptime) }}</div>
      </div>
      
      <!-- Route info -->
      <div class="border-b border-gray-700 pb-2">
        <div class="font-medium mb-1">Route</div>
        <div>Path: {{ currentRoute.path }}</div>
        <div>Name: {{ currentRoute.name }}</div>
      </div>
      
      <!-- Store states -->
      <div class="border-b border-gray-700 pb-2">
        <div class="font-medium mb-1">Stores</div>
        <div>Auth: {{ authStore.isAuthenticated ? 'Authenticated' : 'Not authenticated' }}</div>
        <div>Loading: {{ appStore.isLoading ? 'Yes' : 'No' }}</div>
        <div>DB: {{ appStore.isConnected ? 'Connected' : 'Disconnected' }}</div>
      </div>
      
      <!-- Actions -->
      <div class="space-y-1">
        <button
          @click="clearCache"
          class="w-full text-left px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs"
        >
          Clear Cache
        </button>
        <button
          @click="exportLogs"
          class="w-full text-left px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs"
        >
          Export Logs
        </button>
        <button
          @click="showSystemInfo"
          class="w-full text-left px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs"
        >
          System Info
        </button>
      </div>
    </div>
  </div>
  
  <!-- Toggle button when hidden -->
  <button
    v-else
    @click="toggleVisibility"
    class="fixed bottom-4 right-4 z-50 bg-gray-900 text-white rounded-full p-2 shadow-xl hover:bg-gray-800"
    title="Dev Tools"
  >
    <WrenchScrewdriverIcon class="w-5 h-5" />
  </button>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { XMarkIcon, WrenchScrewdriverIcon } from '@heroicons/vue/24/outline';
import { useAppStore, useAuthStore, useNotificationStore } from '../../stores';

const appStore = useAppStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const currentRoute = useRoute();

const isVisible = ref(false);
const performance = reactive({
  memory: 0,
  cpu: 0,
  uptime: 0
});

let performanceInterval: NodeJS.Timeout | null = null;

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};

const updatePerformance = async () => {
  try {
    if (window.electronAPI) {
      const perf = await window.electronAPI.system.getPerformance();
      performance.memory = perf.memory.heapUsed;
      performance.cpu = Math.round(Math.random() * 100); // Mock CPU usage
      performance.uptime = perf.uptime;
    }
  } catch (error) {
    console.error('Performance update error:', error);
  }
};

const formatBytes = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

const formatUptime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
};

const clearCache = () => {
  localStorage.clear();
  sessionStorage.clear();
  notificationStore.success('Cache Cleared', 'All cached data has been cleared');
};

const exportLogs = async () => {
  try {
    const logs = {
      timestamp: new Date().toISOString(),
      route: currentRoute.path,
      stores: {
        auth: {
          isAuthenticated: authStore.isAuthenticated,
          user: authStore.user
        },
        app: {
          loading: appStore.isLoading,
          connected: appStore.isConnected
        }
      },
      performance: { ...performance }
    };
    
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dev-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    notificationStore.success('Logs Exported', 'Development logs have been exported');
  } catch (error) {
    notificationStore.error('Export Failed', 'Failed to export logs');
  }
};

const showSystemInfo = async () => {
  try {
    if (window.electronAPI) {
      const info = await window.electronAPI.system.getInfo();
      const appInfo = await window.electronAPI.app.getInfo();
      
      const systemInfo = {
        app: appInfo,
        system: info,
        browser: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform
        }
      };
      
      console.table(systemInfo);
      notificationStore.info('System Info', 'System information logged to console');
    }
  } catch (error) {
    notificationStore.error('System Info Failed', 'Failed to get system information');
  }
};

onMounted(() => {
  updatePerformance();
  performanceInterval = setInterval(updatePerformance, 2000);
});

onUnmounted(() => {
  if (performanceInterval) {
    clearInterval(performanceInterval);
  }
});
</script>
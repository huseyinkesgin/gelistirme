import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './style.css';

// Global components
import BaseButton from './components/ui/BaseButton.vue';
import BaseInput from './components/ui/BaseInput.vue';
import BaseModal from './components/ui/BaseModal.vue';
import BaseTable from './components/ui/BaseTable.vue';
import LoadingSpinner from './components/ui/LoadingSpinner.vue';

const app = createApp(App);

// Pinia state management
const pinia = createPinia();
app.use(pinia);

// Vue Router
app.use(router);

// Global components
app.component('BaseButton', BaseButton);
app.component('BaseInput', BaseInput);
app.component('BaseModal', BaseModal);
app.component('BaseTable', BaseTable);
app.component('LoadingSpinner', LoadingSpinner);

// Global properties
app.config.globalProperties.$filters = {
  currency: (value: number, currency = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency
    }).format(value);
  },
  
  date: (value: string | Date, format = 'short') => {
    const date = typeof value === 'string' ? new Date(value) : value;
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: format as any
    }).format(date);
  },
  
  number: (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  },
  
  truncate: (text: string, length = 50) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }
};

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info);
  
  // Electron'a hata bildir
  if (window.electronAPI) {
    window.electronAPI.system.reportError({
      type: 'vue-error',
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      info,
      timestamp: new Date().toISOString(),
      component: instance?.$options.name || 'Unknown',
      route: router.currentRoute.value.path
    });
  }
};

// Global warning handler
app.config.warnHandler = (msg, instance, trace) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Vue Warning:', msg, trace);
  }
};

// Performance tracking
if (process.env.NODE_ENV === 'development') {
  app.config.performance = true;
}

// Development tools
if (process.env.NODE_ENV === 'development') {
  // Vue DevTools
  app.config.devtools = true;
  
  // Performance monitoring
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
      }
    }
  });
  
  observer.observe({ entryTypes: ['measure'] });
}

// Mount app
app.mount('#app');

// Export app instance for debugging
if (process.env.NODE_ENV === 'development') {
  (window as any).app = app;
}
// Vue.js Ana Uygulama Giriş Noktası
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './style.css';

// Ana uygulama oluştur
const app = createApp(App);

// State management (Pinia) ekle
app.use(createPinia());

// Router ekle
app.use(router);

// Global özellikler
app.config.globalProperties.$electronAPI = window.electronAPI;

// Uygulamayı mount et
app.mount('#app');
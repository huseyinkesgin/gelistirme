<template>
  <div class="w-64 bg-white shadow-lg h-full flex flex-col">
    <!-- Logo ve başlık -->
    <div class="p-6 border-b border-gray-200">
      <h1 class="text-xl font-bold text-gray-800">
        Emlak Portföy
      </h1>
      <p class="text-sm text-gray-600">Yönetim Sistemi</p>
    </div>
    
    <!-- Navigasyon menüsü -->
    <nav class="flex-1 p-4 space-y-2">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors"
        :class="{ 'bg-amber-100 text-amber-700 font-medium': $route.path === item.path }"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3" />
        {{ item.label }}
      </router-link>
    </nav>
    
    <!-- Alt bilgi -->
    <div class="p-4 border-t border-gray-200">
      <div class="text-xs text-gray-500">
        v{{ appVersion }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CalendarIcon,
  MegaphoneIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/vue/24/outline';

const appVersion = ref('1.0.0');

const menuItems = [
  {
    name: 'dashboard',
    path: '/',
    label: 'Ana Sayfa',
    icon: HomeIcon
  },
  {
    name: 'properties',
    path: '/mulkler',
    label: 'Mülkler',
    icon: BuildingOfficeIcon
  },
  {
    name: 'customers',
    path: '/musteriler',
    label: 'Müşteriler',
    icon: UsersIcon
  },
  {
    name: 'appointments',
    path: '/randevular',
    label: 'Randevular',
    icon: CalendarIcon
  },
  {
    name: 'listings',
    path: '/ilanlar',
    label: 'İlanlar',
    icon: MegaphoneIcon
  },
  {
    name: 'reports',
    path: '/raporlar',
    label: 'Raporlar',
    icon: ChartBarIcon
  },
  {
    name: 'settings',
    path: '/ayarlar',
    label: 'Ayarlar',
    icon: CogIcon
  }
];

onMounted(async () => {
  try {
    if (window.electronAPI) {
      appVersion.value = await window.electronAPI.getVersion();
    }
  } catch (error) {
    console.error('Versiyon bilgisi alınamadı:', error);
  }
});
</script>
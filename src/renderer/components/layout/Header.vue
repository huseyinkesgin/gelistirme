<template>
  <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Sayfa başlığı -->
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">
          {{ pageTitle }}
        </h2>
        <p v-if="pageDescription" class="text-sm text-gray-600 mt-1">
          {{ pageDescription }}
        </p>
      </div>
      
      <!-- Sağ taraf - kullanıcı bilgileri ve işlemler -->
      <div class="flex items-center space-x-4">
        <!-- Bildirimler -->
        <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <BellIcon class="w-5 h-5" />
        </button>
        
        <!-- Kullanıcı menüsü -->
        <div class="relative">
          <button 
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ userInitials }}</span>
            </div>
            <span class="text-sm font-medium">{{ userName }}</span>
            <ChevronDownIcon class="w-4 h-4" />
          </button>
          
          <!-- Dropdown menü -->
          <div 
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profil
            </a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Ayarlar
            </a>
            <hr class="my-2">
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Çıkış Yap
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { BellIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const showUserMenu = ref(false);

// Geçici kullanıcı bilgileri
const userName = ref('Admin User');
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase();
});

const pageTitle = computed(() => {
  return route.meta.title as string || 'Emlak Portföy Yönetim Sistemi';
});

const pageDescription = computed(() => {
  return route.meta.description as string || '';
});

// Dışarı tıklandığında menüyü kapat
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    showUserMenu.value = false;
  }
});
</script>
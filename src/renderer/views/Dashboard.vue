<template>
  <div class="space-y-6">
    <!-- Hoş geldin mesajı -->
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        Hoş Geldiniz!
      </h1>
      <p class="text-gray-600">
        Emlak Portföy Yönetim Sistemi'ne hoş geldiniz. Sistem başarıyla kuruldu ve çalışmaya hazır.
      </p>
    </div>
    
    <!-- İstatistik kartları -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-amber-100 rounded-lg">
            <BuildingOfficeIcon class="w-6 h-6 text-amber-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Toplam Mülk</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalProperties }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <UsersIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Toplam Müşteri</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalCustomers }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <CalendarIcon class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Bu Ay Randevu</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.monthlyAppointments }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <MegaphoneIcon class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Aktif İlan</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.activeListings }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Hızlı işlemler -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/mulkler/yeni"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors"
        >
          <PlusIcon class="w-5 h-5 text-amber-600 mr-3" />
          <span class="font-medium text-gray-900">Yeni Mülk Ekle</span>
        </router-link>
        
        <router-link
          to="/musteriler"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors"
        >
          <UserPlusIcon class="w-5 h-5 text-amber-600 mr-3" />
          <span class="font-medium text-gray-900">Yeni Müşteri Ekle</span>
        </router-link>
        
        <router-link
          to="/randevular"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors"
        >
          <CalendarPlusIcon class="w-5 h-5 text-amber-600 mr-3" />
          <span class="font-medium text-gray-900">Randevu Oluştur</span>
        </router-link>
      </div>
    </div>
    
    <!-- Sistem durumu -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Sistem Durumu</h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Veritabanı Bağlantısı</span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Bağlı
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Uygulama Versiyonu</span>
          <span class="text-sm font-medium text-gray-900">v{{ appVersion }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Son Güncelleme</span>
          <span class="text-sm text-gray-600">{{ lastUpdate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  BuildingOfficeIcon,
  UsersIcon,
  CalendarIcon,
  MegaphoneIcon,
  PlusIcon,
  UserPlusIcon,
  CalendarDaysIcon as CalendarPlusIcon
} from '@heroicons/vue/24/outline';

const appVersion = ref('1.0.0');
const lastUpdate = ref(new Date().toLocaleDateString('tr-TR'));

// Geçici istatistik verileri
const stats = ref({
  totalProperties: 0,
  totalCustomers: 0,
  monthlyAppointments: 0,
  activeListings: 0
});

onMounted(async () => {
  try {
    if (window.electronAPI) {
      appVersion.value = await window.electronAPI.getVersion();
    }
    
    // Burada gerçek veriler API'den çekilecek
    // Şimdilik demo veriler
    stats.value = {
      totalProperties: 0,
      totalCustomers: 0,
      monthlyAppointments: 0,
      activeListings: 0
    };
  } catch (error) {
    console.error('Dashboard verileri yüklenirken hata:', error);
  }
});
</script>
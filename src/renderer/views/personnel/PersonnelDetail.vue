<template>
  <div class="p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">{{ personnel.kisi.ad }} {{ personnel.kisi.soyad }}</h1>
        <p class="text-lg text-gray-500 dark:text-gray-400">{{ personnel.pozisyon.ad }}</p>
      </div>
      <BaseButton variant="primary">Düzenle</BaseButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Profile Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 mx-auto mb-4">{{ personnel.kisi.ad[0] }}{{ personnel.kisi.soyad[0] }}</div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">{{ personnel.kisi.ad }} {{ personnel.kisi.soyad }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ personnel.kullanici.kullanici_adi }}</p>
        </div>
        <!-- Contact Info Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">İletişim Bilgileri</h3>
            <dl class="space-y-2">
                <div class="flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">E-posta</dt>
                    <dd class="text-sm text-gray-900 dark:text-gray-100">{{ personnel.kisi.email }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Telefon</dt>
                    <dd class="text-sm text-gray-900 dark:text-gray-100">{{ personnel.telefon }}</dd>
                </div>
            </dl>
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Organizational Info -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Organizasyon Bilgileri</h3>
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Şube</dt>
                    <dd class="mt-1 text-md text-gray-900 dark:text-gray-100">{{ personnel.pozisyon.departman.sube.ad }}</dd>
                </div>
                <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Departman</dt>
                    <dd class="mt-1 text-md text-gray-900 dark:text-gray-100">{{ personnel.pozisyon.departman.ad }}</dd>
                </div>
                <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Pozisyon</dt>
                    <dd class="mt-1 text-md text-gray-900 dark:text-gray-100">{{ personnel.pozisyon.ad }}</dd>
                </div>
                <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">İşe Başlama Tarihi</dt>
                    <dd class="mt-1 text-md text-gray-900 dark:text-gray-100">{{ formatDate(personnel.ise_baslama_tarihi) }}</dd>
                </div>
            </dl>
        </div>
        <!-- Activity/Notes Tabs -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <p class="p-6 text-gray-500">Personele ait aktiviteler, notlar ve performans metrikleri için sekmeli alan buraya gelecek.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/renderer/components/ui/BaseButton.vue';

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Mock Data for a single personnel
const personnel = ref({
  id: '1',
  kisi: {
    ad: 'Zeynep',
    soyad: 'Demir',
    email: 'zeynep.demir@example.com'
  },
  telefon: '0(555) 123 4567',
  kullanici: {
      kullanici_adi: 'zeynep.demir'
  },
  pozisyon: {
    ad: 'Kıdemli Emlak Danışmanı',
    departman: {
      ad: 'Satış',
      sube: { ad: 'Merkez Şube' }
    },
  },
  ise_baslama_tarihi: '2023-05-10',
});

</script>

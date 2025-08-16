<template>
  <div class="p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">{{ property.baslik }}</h1>
        <p class="text-lg text-gray-500 dark:text-gray-400">{{ property.portfoy_no }}</p>
      </div>
      <div class="flex space-x-2">
        <BaseButton variant="outline">İlanları Yönet</BaseButton>
        <BaseButton variant="primary">Düzenle</BaseButton>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Image Gallery -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Fotoğraflar</h3>
            <div class="grid grid-cols-3 gap-4">
                <img v-for="image in property.images" :key="image.id" :src="image.url" class="rounded-lg object-cover h-40 w-full" />
            </div>
        </div>

        <!-- Description -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Açıklama</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ property.aciklama }}</p>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Price Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">Satış Fiyatı</p>
            <p class="text-3xl font-bold text-amber-600">{{ formatCurrency(property.fiyat) }}</p>
        </div>

        <!-- Owner Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Mülk Sahibi</h3>
            <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">{{ property.sahip.ad[0] }}{{ property.sahip.soyad[0] }}</div>
                <div>
                    <p class="font-semibold text-gray-800 dark:text-gray-100">{{ property.sahip.ad }} {{ property.sahip.soyad }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ property.sahip.email }}</p>
                </div>
            </div>
        </div>

        <!-- Location Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Konum</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ property.adres.full }}</p>
            <div class="mt-4 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                <p class="text-gray-500">Harita Alanı</p>
            </div>
        </div>
      </div>
    </div>

    <!-- Details, History, Documents Tabs -->
    <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <!-- Tabs will go here -->
        <p class="p-6 text-gray-500">Detaylar, Geçmiş, Dokümanlar ve Notlar için sekmeli alan buraya gelecek.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/renderer/components/ui/BaseButton.vue';

const formatCurrency = (value: number) => {
  if (!value) return '-';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
};

// Mock Data for a single property
const property = ref({
  id: '1',
  portfoy_no: 'PF-2024-001',
  baslik: "Kadıköy'de Satılık Lüks Daire",
  aciklama: 'Metroya ve metrobüse yürüme mesafesinde, içi tamamen yenilenmiş, aydınlık ve ferah 3+1 daire. Ankastre mutfak ve ebeveyn banyosu bulunmaktadır.',
  fiyat: 3500000,
  sahip: {
    ad: 'Ahmet',
    soyad: 'Yılmaz',
    email: 'ahmet.yilmaz@example.com'
  },
  adres: {
    full: 'Caferağa Mah. Mühürdar Cad. No:12 D:8, Kadıköy, İstanbul'
  },
  images: [
    { id: '1', url: 'https://via.placeholder.com/400x300.png/fde68a/78350f?text=Salon' },
    { id: '2', url: 'https://via.placeholder.com/400x300.png/fde68a/78350f?text=Mutfak' },
    { id: '3', url: 'https://via.placeholder.com/400x300.png/fde68a/78350f?text=Yatak+Odası' },
  ]
});

</script>
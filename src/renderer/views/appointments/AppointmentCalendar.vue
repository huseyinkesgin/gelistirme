<template>
  <div class="p-4 h-full flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Randevu Takvimi</h1>
        <div class="flex items-center rounded-md shadow-sm bg-white dark:bg-gray-800">
          <button class="p-2 rounded-l-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
            <ChevronLeftIcon class="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <span class="px-4 py-2 text-sm font-medium border-t border-b border-gray-300 dark:border-gray-600">Ağustos 2025</span>
          <button class="p-2 rounded-r-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
            <ChevronRightIcon class="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <div class="rounded-md shadow-sm bg-white dark:bg-gray-800 p-0.5 flex space-x-1">
            <button class="px-3 py-1.5 text-sm font-medium rounded-md" :class="view === 'day' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50'">Gün</button>
            <button class="px-3 py-1.5 text-sm font-medium rounded-md" :class="view === 'week' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50'">Hafta</button>
            <button class="px-3 py-1.5 text-sm font-medium rounded-md" :class="view === 'month' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50'">Ay</button>
        </div>
        <BaseButton @click="goToCreateAppointment">
          <PlusIcon class="h-5 w-5 mr-2" />
          Yeni Randevu
        </BaseButton>
      </div>
    </div>

    <!-- Calendar Placeholder -->
    <div class="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
        <div class="text-center">
            <p class="text-lg font-medium text-gray-500 dark:text-gray-400">Takvim Bileşeni Buraya Gelecek</p>
            <p class="text-sm text-gray-400 dark:text-gray-500">FullCalendar.io gibi bir kütüphane entegrasyonu gerektirir.</p>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/renderer/components/ui/BaseButton.vue';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid';

const router = useRouter();
const view = ref('month'); // day, week, month

const goToCreateAppointment = () => {
  // router.push({ name: 'AppointmentCreate' });
  console.log('Navigating to create appointment page...');
};

</script>
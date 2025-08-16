<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Randevular</h1>
      <button class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        Yeni Randevu Oluştur
      </button>
    </div>
    
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <p class="text-gray-600">
          Randevu listesi ve takvim görünümü burada olacak.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
</script>
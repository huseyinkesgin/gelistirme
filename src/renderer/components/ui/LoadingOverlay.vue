<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
      <div class="flex items-center space-x-4">
        <LoadingSpinner class="w-8 h-8 text-amber-500" />
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {{ title }}
          </h3>
          <p v-if="message" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue';

interface Props {
  title?: string;
  message?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Yükleniyor...',
  message: ''
});
</script>
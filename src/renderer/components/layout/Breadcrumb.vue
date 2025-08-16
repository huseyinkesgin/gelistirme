<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
    <ol class="flex items-center space-x-2 text-sm">
      <li v-for="(item, index) in breadcrumbItems" :key="index" class="flex items-center">
        <router-link
          v-if="item.to && index < breadcrumbItems.length - 1"
          :to="item.to"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          {{ item.text }}
        </router-link>
        <span
          v-else
          class="text-gray-900 dark:text-gray-100 font-medium"
          :class="{ 'text-gray-500 dark:text-gray-400': index < breadcrumbItems.length - 1 }"
        >
          {{ item.text }}
        </span>
        
        <ChevronRightIcon
          v-if="index < breadcrumbItems.length - 1"
          class="w-4 h-4 text-gray-400 mx-2"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronRightIcon } from '@heroicons/vue/24/outline';

const route = useRoute();

interface BreadcrumbItem {
  text: string;
  to?: string;
}

const breadcrumbItems = computed(() => {
  const items: BreadcrumbItem[] = [];
  
  if (route.meta.breadcrumb && Array.isArray(route.meta.breadcrumb)) {
    route.meta.breadcrumb.forEach((text: string, index: number) => {
      const item: BreadcrumbItem = { text };
      
      // İlk item (Ana Sayfa) için home route'u ekle
      if (index === 0 && text === 'Ana Sayfa') {
        item.to = '/';
      }
      
      items.push(item);
    });
  }
  
  return items;
});
</script>
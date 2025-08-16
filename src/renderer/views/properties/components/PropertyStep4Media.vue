<template>
  <div>
    <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Medya Yükleme</h2>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Mülke ait fotoğrafları, videoları ve diğer dokümanları yükleyin.</p>
    
    <div class="mt-6 space-y-8">
      <div>
        <h3 class="text-md font-medium text-gray-800 dark:text-gray-200">Fotoğraflar</h3>
        <ImageUpload
          v-model="localData.images"
          class="mt-2"
        />
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 class="text-md font-medium text-gray-800 dark:text-gray-200">Dokümanlar</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Tapu, sözleşme, imar planı gibi belgeler için dosya yükleme bileşeni buraya gelecek.</p>
        <!-- Placeholder for a Document Uploader -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import ImageUpload from '@/renderer/components/ui/ImageUpload.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const localData = reactive({
  images: [],
  documents: [],
  ...props.modelValue
});

watch(localData, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

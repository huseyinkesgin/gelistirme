<template>
  <div>
    <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Lokasyon Bilgileri</h2>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Mülkün bulunduğu adres ve konum detayları.</p>
    <div class="mt-6 space-y-6">
      <LocationSelector v-model="localData.location" />
      <BaseTextArea
        label="Açık Adres Tarifi"
        v-model="localData.adres_satiri_1"
        :rows="3"
        placeholder="Sokak, bina numarası, kat ve daire bilgileri..."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import LocationSelector from '@/renderer/components/forms/LocationSelector.vue';
import BaseTextArea from '@/renderer/components/ui/BaseTextArea.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const localData = reactive({
  location: {},
  adres_satiri_1: '',
  ...props.modelValue
});

watch(localData, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

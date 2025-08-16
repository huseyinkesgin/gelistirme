<template>
  <div>
    <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Temel Mülk Bilgileri</h2>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Mülkün portföydeki temel görünürlüğünü ve sahibini belirtin.</p>
    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
      <div class="sm:col-span-4">
        <BaseSelect
          label="Mülk Sahibi"
          :options="mockOwners"
          v-model="localData.sahip_id"
          placeholder="Bir mülk sahibi seçin..."
          required
        />
      </div>

      <div class="sm:col-span-6">
        <BaseInput
          label="Mülk Başlığı"
          v-model="localData.baslik"
          placeholder="Örn: Metroya Yakın, Bahçeli Dubleks"
          required
        />
      </div>

      <div class="sm:col-span-6">
        <BaseTextArea
          label="Açıklama"
          v-model="localData.aciklama"
          :rows="5"
          placeholder="Mülkün genel özellikleri, konumu ve avantajları hakkında detaylı bilgi girin."
        />
      </div>

      <div class="sm:col-span-3">
        <InputCurrency
          label="Fiyat"
          v-model="localData.fiyat"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import BaseInput from '@/renderer/components/ui/BaseInput.vue';
import BaseTextArea from '@/renderer/components/ui/BaseTextArea.vue';
import BaseSelect from '@/renderer/components/ui/BaseSelect.vue';
import InputCurrency from '@/renderer/components/ui/InputCurrency.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

// Use a local reactive object to manage the form state
const localData = reactive({ ...props.modelValue });

// Watch for changes in localData and emit them to the parent
watch(localData, (newValue) => {
  emit('update:modelValue', newValue);
});

// Mock data for owners - in a real app, this would be fetched from an API
const mockOwners = ref([
  { value: '1', label: 'Selin Öztürk' },
  { value: '2', label: 'Barış Aydın' },
  { value: '3', label: 'Zeynep Demir (Personel)' },
]);

</script>

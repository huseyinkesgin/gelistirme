<template>
  <div>
    <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Mülk Detayları</h2>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Mülkün tipini ve tipine özel detayları belirtin.</p>
    
    <div class="mt-6">
      <BaseSelect
        label="Mülk Ana Kategorisi"
        :options="kategoriOptions"
        v-model="selectedCategory"
        placeholder="Bir kategori seçin..."
      />
    </div>

    <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      <component :is="dynamicFormComponent" v-if="dynamicFormComponent" v-model="localData" />
      <div v-else class="text-center text-gray-500">
        Lütfen mülk detaylarını girmek için bir ana kategori seçin.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, shallowRef } from 'vue';
import BaseSelect from '@/renderer/components/ui/BaseSelect.vue';

// In a real app, these would be imported properly
const FormKonut = { template: `<div class="grid grid-cols-1 gap-y-6 sm:grid-cols-6 gap-x-4"><div class="sm:col-span-2"><BaseInput label="Oda Sayısı" /></div><div class="sm:col-span-2"><BaseInput label="Banyo Sayısı" /></div><div class="sm:col-span-2"><BaseInput label="Bina Yaşı" /></div></div>`, components: { BaseInput } };
const FormIsyeri = { template: `<div>İşyeri Formu Alanları</div>` };
const FormArsa = { template: `<div>Arsa Formu Alanları</div>` };

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const localData = reactive({ ...props.modelValue });

watch(localData, (newValue) => {
  emit('update:modelValue', newValue);
});

const selectedCategory = ref(null);

const kategoriOptions = ref([
  { value: 'konut', label: 'Konut' },
  { value: 'isyeri', label: 'İşyeri' },
  { value: 'arsa', label: 'Arsa' },
]);

const dynamicFormComponent = computed(() => {
  switch (selectedCategory.value) {
    case 'konut':
      return shallowRef(FormKonut);
    case 'isyeri':
      return shallowRef(FormIsyeri);
    case 'arsa':
      return shallowRef(FormArsa);
    default:
      return null;
  }
});

// Import BaseInput for the placeholder component
import BaseInput from '@/renderer/components/ui/BaseInput.vue';

</script>

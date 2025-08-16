<template>
  <div class="space-y-4">
    <BaseSelect
      v-model="selectedCity"
      :options="cities"
      label="Şehir"
      placeholder="Şehir seçiniz..."
      :loading="loading.cities"
    />
    <BaseSelect
      v-model="selectedDistrict"
      :options="districts"
      label="İlçe"
      placeholder="İlçe seçiniz..."
      :disabled="!selectedCity"
      :loading="loading.districts"
    />
    <BaseSelect
      v-model="selectedQuarter"
      :options="quarters"
      label="Semt"
      placeholder="Semt seçiniz..."
      :disabled="!selectedDistrict"
      :loading="loading.quarters"
    />
    <BaseSelect
      v-model="selectedNeighborhood"
      :options="neighborhoods"
      label="Mahalle"
      placeholder="Mahalle seçiniz..."
      :disabled="!selectedQuarter"
      :loading="loading.neighborhoods"
    />
    <div v-if="showCoordinates" class="grid grid-cols-2 gap-4">
        <BaseInput v-model="coordinates.x" label="Koordinat X" placeholder="X koordinatı" />
        <BaseInput v-model="coordinates.y" label="Koordinat Y" placeholder="Y koordinatı" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, reactive } from 'vue';
import BaseSelect from '../ui/BaseSelect.vue';
import BaseInput from '../ui/BaseInput.vue';

interface Option {
  value: string;
  label: string;
}

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ city: null, district: null, quarter: null, neighborhood: null, coordinates: { x: null, y: null } })
  },
  showCoordinates: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

// Selected values
const selectedCity = ref(props.modelValue.city);
const selectedDistrict = ref(props.modelValue.district);
const selectedQuarter = ref(props.modelValue.quarter);
const selectedNeighborhood = ref(props.modelValue.neighborhood);
const coordinates = reactive(props.modelValue.coordinates || { x: null, y: null });

// Options lists
const cities = ref<Option[]>([]);
const districts = ref<Option[]>([]);
const quarters = ref<Option[]>([]);
const neighborhoods = ref<Option[]>([]);

// Loading states
const loading = reactive({
  cities: false,
  districts: false,
  quarters: false,
  neighborhoods: false
});

// Mock API functions - these would call window.electronAPI in a real scenario
const fetchApi = async (model: string, parentId?: string): Promise<Option[]> => {
  console.log(`Fetching ${model} with parentId: ${parentId}`);
  // In a real app, this would be:
  // return await window.electronAPI.fetchLocationData(model, parentId);
  // For now, returning mock data:
  if (model === 'cities') return [{ value: '1', label: 'İstanbul' }, { value: '2', label: 'Ankara' }];
  if (model === 'districts' && parentId === '1') return [{ value: '1-1', label: 'Kadıköy' }, { value: '1-2', label: 'Beşiktaş' }];
  if (model === 'quarters' && parentId === '1-1') return [{ value: '1-1-1', label: 'Caferağa' }];
  if (model === 'neighborhoods' && parentId === '1-1-1') return [{ value: '1-1-1-1', label: 'Moda' }];
  return [];
};

watch(selectedCity, async (newVal, oldVal) => {
  if (newVal === oldVal) return;
  selectedDistrict.value = null;
  districts.value = [];
  if (newVal) {
    loading.districts = true;
    districts.value = await fetchApi('districts', newVal);
    loading.districts = false;
  }
});

watch(selectedDistrict, async (newVal, oldVal) => {
  if (newVal === oldVal) return;
  selectedQuarter.value = null;
  quarters.value = [];
  if (newVal) {
    loading.quarters = true;
    quarters.value = await fetchApi('quarters', newVal);
    loading.quarters = false;
  }
});

watch(selectedQuarter, async (newVal, oldVal) => {
  if (newVal === oldVal) return;
  selectedNeighborhood.value = null;
  neighborhoods.value = [];
  if (newVal) {
    loading.neighborhoods = true;
    neighborhoods.value = await fetchApi('neighborhoods', newVal);
    loading.neighborhoods = false;
  }
});

// Emit combined value on any change
watch(
  () => [
    selectedCity.value,
    selectedDistrict.value,
    selectedQuarter.value,
    selectedNeighborhood.value,
    coordinates
  ],
  () => {
    emit('update:modelValue', {
      city: selectedCity.value,
      district: selectedDistrict.value,
      quarter: selectedQuarter.value,
      neighborhood: selectedNeighborhood.value,
      coordinates: coordinates
    });
  },
  { deep: true }
);

onMounted(async () => {
  loading.cities = true;
  cities.value = await fetchApi('cities');
  loading.cities = false;
});

</script>

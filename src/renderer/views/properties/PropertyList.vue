<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Mülk Yönetimi</h1>
      <BaseButton @click="goToCreateProperty">
        <PlusIcon class="h-5 w-5 mr-2" />
        Yeni Mülk Ekle
      </BaseButton>
    </div>

    <!-- Filters and Search will go here -->
    <div class="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <p class="text-gray-600 dark:text-gray-300">Filtreleme ve arama bileşenleri buraya gelecek.</p>
    </div>

    <BaseTable
      :headers="tableHeaders"
      :items="properties"
      :loading="loading"
      selectable
      @update:selectedItems="handleSelection"
    >
      <template #cell-sahip="{ item }">
        <div v-if="item.sahip" class="font-medium text-gray-900 dark:text-white">
          {{ item.sahip.ad }} {{ item.sahip.soyad }}
        </div>
        <div v-else class="text-gray-500">-</div>
      </template>

      <template #cell-fiyat="{ value }">
        <span class="font-semibold">{{ formatCurrency(value) }}</span>
      </template>

      <template #cell-durum="{ item }">
        <span 
          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          :class="getStatusClass(item.durum)"
        >
          {{ item.durum }}
        </span>
      </template>

      <template #actions="{ item }">
        <div class="flex space-x-2">
          <button class="text-amber-600 hover:text-amber-900">Düzenle</button>
          <button class="text-indigo-600 hover:text-indigo-900">Detay</button>
          <button class="text-red-600 hover:text-red-900">Sil</button>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseTable from '@/renderer/components/ui/BaseTable.vue';
import BaseButton from '@/renderer/components/ui/BaseButton.vue';
import { PlusIcon } from '@heroicons/vue/20/solid';

// Mock Data - In a real app, this would come from an API call
const properties = ref<any[]>([]);
const loading = ref(true);
const router = useRouter();

const tableHeaders = [
  { key: 'portfoy_no', label: 'Portföy No', sortable: true },
  { key: 'baslik', label: 'Başlık', sortable: true },
  { key: 'sahip', label: 'Mülk Sahibi', sortable: true },
  { key: 'fiyat', label: 'Fiyat', sortable: true },
  { key: 'durum', label: 'Durum', sortable: true },
];

const handleSelection = (selectedIds: string[]) => {
  console.log('Selected property IDs:', selectedIds);
};

const goToCreateProperty = () => {
  // In a real app with Vue Router, this would be:
  // router.push({ name: 'PropertyCreate' });
  console.log('Navigating to create property page...');
};

const formatCurrency = (value: number) => {
  if (!value) return '-';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'Satılık': 'bg-green-100 text-green-800',
    'Kiralık': 'bg-blue-100 text-blue-800',
    'Satıldı': 'bg-red-100 text-red-800',
    'Kiralandı': 'bg-yellow-100 text-yellow-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

// Fetch data on mount
onMounted(() => {
  // Mock API call
  setTimeout(() => {
    properties.value = [
      { id: '1', portfoy_no: 'PF-2024-001', baslik: 'Kadıköy'de Satılık Daire', sahip: { ad: 'Ahmet', soyad: 'Yılmaz' }, fiyat: 2500000, durum: 'Satılık' },
      { id: '2', portfoy_no: 'PF-2024-002', baslik: 'Beşiktaş'ta Kiralık Ofis', sahip: { ad: 'Ayşe', soyad: 'Kaya' }, fiyat: 15000, durum: 'Kiralık' },
    ];
    loading.value = false;
  }, 1000);
});

</script>

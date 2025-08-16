<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">İlan Yönetimi</h1>
      <BaseButton @click="goToCreateListing">
        <PlusIcon class="h-5 w-5 mr-2" />
        Yeni İlan Oluştur
      </BaseButton>
    </div>

    <BaseTable
      :headers="tableHeaders"
      :items="listings"
      :loading="loading"
    >
      <template #cell-mulk="{ item }">
        <div class="font-medium text-gray-900 dark:text-white">{{ item.mulk.baslik }}</div>
        <div class="text-sm text-gray-500">{{ item.mulk.portfoy_no }}</div>
      </template>

      <template #cell-durum="{ value }">
        <span 
          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          :class="getStatusClass(value)"
        >
          {{ value }}
        </span>
      </template>

      <template #cell-yayin_tarihi="{ value }">
        <span>{{ formatDate(value) }}</span>
      </template>

      <template #actions="{ item }">
        <div class="flex space-x-2">
          <button class="text-amber-600 hover:text-amber-900">Düzenle</button>
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
import { IlanDurumuEnum } from '@/models/Ilan';

const listings = ref<any[]>([]);
const loading = ref(true);
const router = useRouter();

const tableHeaders = [
  { key: 'ilan_no', label: 'İlan No', sortable: true },
  { key: 'baslik', label: 'İlan Başlığı', sortable: true },
  { key: 'mulk', label: 'İlgili Mülk', sortable: false },
  { key: 'durum', label: 'Durum', sortable: true },
  { key: 'yayin_tarihi', label: 'Yayın Tarihi', sortable: true },
];

const goToCreateListing = () => {
  // router.push({ name: 'ListingCreate' });
  console.log('Navigating to create listing page...');
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('tr-TR');
};

const getStatusClass = (status: IlanDurumuEnum) => {
  const classes: Record<IlanDurumuEnum, string> = {
    [IlanDurumuEnum.YAYINDA]: 'bg-green-100 text-green-800',
    [IlanDurumuEnum.BEKLEMEDE]: 'bg-yellow-100 text-yellow-800',
    [IlanDurumuEnum.REDDEDILDI]: 'bg-red-100 text-red-800',
    [IlanDurumuEnum.SATILDI]: 'bg-purple-100 text-purple-800',
    [IlanDurumuEnum.KIRALANDI]: 'bg-purple-100 text-purple-800',
    [IlanDurumuEnum.YAYINDA_DEGIL]: 'bg-gray-100 text-gray-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

// Fetch data on mount
onMounted(() => {
  // Mock API call
  setTimeout(() => {
    listings.value = [
      {
        id: '1',
        ilan_no: 'ILN12345',
        baslik: 'Sahibinden Acil Satılık Fırsat Daire',
        mulk: { id: '1', baslik: "Kadıköy'de Satılık Daire", portfoy_no: 'PF-2024-001' },
        durum: IlanDurumuEnum.YAYINDA,
        yayin_tarihi: '2024-08-15',
      },
      {
        id: '2',
        ilan_no: 'ILN67890',
        baslik: 'Boğaz Manzaralı Kiralık Yalı Dairesi',
        mulk: { id: '2', baslik: "Beşiktaş'ta Kiralık Ofis", portfoy_no: 'PF-2024-002' },
        durum: IlanDurumuEnum.BEKLEMEDE,
        yayin_tarihi: null,
      },
    ];
    loading.value = false;
  }, 500);
});

</script>

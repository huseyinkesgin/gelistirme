<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Müşteri Yönetimi</h1>
      <BaseButton @click="goToCreateCustomer">
        <PlusIcon class="h-5 w-5 mr-2" />
        Yeni Müşteri Ekle
      </BaseButton>
    </div>

    <BaseTable
      :headers="tableHeaders"
      :items="customers"
      :loading="loading"
      selectable
    >
      <template #cell-kisi="{ item }">
        <div class="font-medium text-gray-900 dark:text-white">
          {{ item.kisi.ad }} {{ item.kisi.soyad }}
        </div>
        <div class="text-sm text-gray-500">{{ item.kisi.email }}</div>
      </template>

      <template #cell-musteri_tipi="{ value }">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {{ value }}
        </span>
      </template>

      <template #cell-kaynak="{ value }">
        <span>{{ value }}</span>
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

const customers = ref<any[]>([]);
const loading = ref(true);
const router = useRouter();

const tableHeaders = [
  { key: 'kisi', label: 'Ad Soyad', sortable: true },
  { key: 'musteri_tipi', label: 'Müşteri Tipi', sortable: true },
  { key: 'kaynak', label: 'Kaynak', sortable: true },
  { key: 'puan', label: 'Puan', sortable: true },
];

const goToCreateCustomer = () => {
  // router.push({ name: 'CustomerCreate' });
  console.log('Navigating to create customer page...');
};

// Fetch data on mount
onMounted(() => {
  // Mock API call
  setTimeout(() => {
    customers.value = [
      {
        id: '1',
        kisi: { ad: 'Selin', soyad: 'Öztürk', email: 'selin.ozturk@example.com' },
        musteri_tipi: 'Alıcı',
        kaynak: 'Website',
        puan: 5,
      },
      {
        id: '2',
        kisi: { ad: 'Barış', soyad: 'Aydın', email: 'baris.aydin@example.com' },
        musteri_tipi: 'Satıcı',
        kaynak: 'Referans',
        puan: 4,
      },
    ];
    loading.value = false;
  }, 500);
});

</script>

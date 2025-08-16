<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Personel Yönetimi</h1>
      <BaseButton @click="goToCreatePersonnel">
        <PlusIcon class="h-5 w-5 mr-2" />
        Yeni Personel Ekle
      </BaseButton>
    </div>

    <BaseTable
      :headers="tableHeaders"
      :items="personnel"
      :loading="loading"
      selectable
    >
      <template #cell-kisi="{ item }">
        <div class="font-medium text-gray-900 dark:text-white">
          {{ item.kisi.ad }} {{ item.kisi.soyad }}
        </div>
        <div class="text-sm text-gray-500">{{ item.kisi.email }}</div>
      </template>

      <template #cell-pozisyon="{ item }">
        <div>{{ item.pozisyon.ad }}</div>
        <div class="text-sm text-gray-500">{{ item.pozisyon.departman.ad }}</div>
      </template>

       <template #cell-sube="{ item }">
        <div>{{ item.pozisyon.departman.sube.ad }}</div>
      </template>

      <template #cell-ise_baslama_tarihi="{ value }">
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

const personnel = ref<any[]>([]);
const loading = ref(true);
const router = useRouter();

const tableHeaders = [
  { key: 'kisi', label: 'Ad Soyad', sortable: true },
  { key: 'pozisyon', label: 'Pozisyon', sortable: true },
  { key: 'sube', label: 'Şube', sortable: true },
  { key: 'ise_baslama_tarihi', label: 'İşe Başlama', sortable: true },
];

const goToCreatePersonnel = () => {
  // router.push({ name: 'PersonnelCreate' });
  console.log('Navigating to create personnel page...');
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('tr-TR');
};

// Fetch data on mount
onMounted(() => {
  // Mock API call
  setTimeout(() => {
    personnel.value = [
      {
        id: '1',
        kisi: { ad: 'Zeynep', soyad: 'Demir', email: 'zeynep.demir@example.com' },
        pozisyon: {
          ad: 'Emlak Danışmanı',
          departman: { ad: 'Satış', sube: { ad: 'Merkez Şube' } },
        },
        ise_baslama_tarihi: '2023-05-10',
      },
      {
        id: '2',
        kisi: { ad: 'Mehmet', soyad: 'Çelik', email: 'mehmet.celik@example.com' },
        pozisyon: {
          ad: 'Ofis Yöneticisi',
          departman: { ad: 'İdari İşler', sube: { ad: 'Merkez Şube' } },
        },
        ise_baslama_tarihi: '2022-11-20',
      },
    ];
    loading.value = false;
  }, 500);
});

</script>

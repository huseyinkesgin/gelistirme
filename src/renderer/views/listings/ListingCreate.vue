<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Yeni İlan Oluştur</h1>

    <div class="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
      <!-- Mülk Seçimi -->
      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">İlan Yapılacak Mülk</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Hangi mülk için ilan oluşturmak istediğinizi seçin.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <BaseSelect
              label="Mülk Seçimi"
              :options="mockProperties"
              v-model="listingData.mulk_id"
              placeholder="Bir mülk seçin..."
              required
            />
          </div>
        </div>
      </div>

      <!-- İlan Bilgileri -->
      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">İlan Detayları</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">İlan başlığı, açıklaması ve yayın tarihleri.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-6">
            <BaseInput label="İlan Başlığı" v-model="listingData.baslik" required hint="Mülk başlığından farklı, dikkat çekici bir başlık girin." />
          </div>
          <div class="sm:col-span-6">
            <BaseTextArea label="İlan Açıklaması" v-model="listingData.aciklama" :rows="5" />
          </div>
          <div class="sm:col-span-3">
            <BaseInput type="date" label="Yayın Başlangıç Tarihi" v-model="listingData.yayin_tarihi" />
          </div>
          <div class="sm:col-span-3">
            <BaseInput type="date" label="Yayın Bitiş Tarihi" v-model="listingData.bitis_tarihi" />
          </div>
        </div>
      </div>

      <!-- Platform Seçimi -->
      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Yayın Platformları</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">İlanın hangi platformlarda yayınlanacağını seçin.</p>
        </div>
        <div class="mt-6 space-y-4">
            <BaseCheckbox 
                v-for="platform in mockPlatforms" 
                :key="platform.id"
                :label="platform.ad"
                v-model="listingData.platform_ids[platform.id]"
            />
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="pt-5">
      <div class="flex justify-end space-x-3">
        <BaseButton variant="outline" @click="cancel">İptal</BaseButton>
        <BaseButton variant="primary" @click="submitForm">İlanı Oluştur</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '@/renderer/components/ui/BaseInput.vue';
import BaseSelect from '@/renderer/components/ui/BaseSelect.vue';
import BaseTextArea from '@/renderer/components/ui/BaseTextArea.vue';
import BaseButton from '@/renderer/components/ui/BaseButton.vue';
import BaseCheckbox from '@/renderer/components/ui/BaseCheckbox.vue';

const router = useRouter();

const listingData = reactive({
  mulk_id: null,
  baslik: '',
  aciklama: '',
  yayin_tarihi: '',
  bitis_tarihi: '',
  platform_ids: {}
});

// Mock data - in a real app, this would be fetched from an API
const mockProperties = ref([
  { value: '1', label: "PF-2024-001 - Kadıköy'de Satılık Daire" },
  { value: '2', label: "PF-2024-002 - Beşiktaş'ta Kiralık Ofis" },
]);

const mockPlatforms = ref([
    { id: '1', ad: 'Sahibinden.com' },
    { id: '2', ad: 'Hepsiemlak' },
    { id: '3', ad: 'Emlakjet' },
    { id: '4', ad: 'Kurumsal Websitesi' },
]);

const cancel = () => {
  // router.go(-1);
  console.log('Cancelled');
};

const submitForm = () => {
  console.log('Submitting listing data:', listingData);
  // API call to save the listing would go here
};

</script>
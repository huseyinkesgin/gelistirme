<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Yeni Randevu Oluştur</h1>

    <div class="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <!-- Randevu Detayları -->
      <div class="pt-2">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Randevu Detayları</h3>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-6">
            <BaseInput label="Randevu Başlığı" v-model="appointmentData.baslik" required />
          </div>

          <div class="sm:col-span-3">
            <BaseInput type="datetime-local" label="Başlangıç Zamanı" v-model="appointmentData.baslangic_tarihi" required />
          </div>
          <div class="sm:col-span-3">
            <BaseInput type="datetime-local" label="Bitiş Zamanı" v-model="appointmentData.bitis_tarihi" required />
          </div>

          <div class="sm:col-span-6">
            <BaseTextArea label="Açıklama" v-model="appointmentData.aciklama" :rows="4" />
          </div>
        </div>
      </div>

      <!-- İlişkili Kayıtlar -->
      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">İlişkili Kayıtlar</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Randevunun ilgili olduğu mülk ve katılacak kişiler.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-6">
            <BaseSelect
              label="İlgili Mülk (Opsiyonel)"
              :options="mockProperties"
              v-model="appointmentData.mulk_id"
              placeholder="Bir mülk seçin..."
            />
          </div>
          <div class="sm:col-span-3">
            <BaseSelect
              label="Katılımcı Personel"
              :options="mockPersonnel"
              v-model="appointmentData.personel_ids"
              placeholder="Personel seçin..."
            />
             <!-- Note: BaseSelect needs a `multiple` prop for this to work properly -->
          </div>
          <div class="sm:col-span-3">
            <BaseSelect
              label="Katılımcı Müşteriler"
              :options="mockCustomers"
              v-model="appointmentData.musteri_ids"
              placeholder="Müşteri seçin..."
            />
            <!-- Note: BaseSelect needs a `multiple` prop for this to work properly -->
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="pt-5">
      <div class="flex justify-end space-x-3">
        <BaseButton variant="outline" @click="cancel">İptal</BaseButton>
        <BaseButton variant="primary" @click="submitForm">Randevuyu Kaydet</BaseButton>
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

const router = useRouter();

const appointmentData = reactive({
  baslik: '',
  aciklama: '',
  baslangic_tarihi: '',
  bitis_tarihi: '',
  mulk_id: null,
  personel_ids: [],
  musteri_ids: [],
});

// Mock data - in a real app, this would be fetched from an API
const mockProperties = ref([
  { value: '1', label: "PF-2024-001 - Kadıköy'de Satılık Daire" },
  { value: '2', label: "PF-2024-002 - Beşiktaş'ta Kiralık Ofis" },
]);
const mockPersonnel = ref([
  { value: '1', label: 'Zeynep Demir' },
  { value: '2', label: 'Mehmet Çelik' },
]);
const mockCustomers = ref([
  { value: '1', label: 'Selin Öztürk' },
  { value: '2', label: 'Barış Aydın' },
]);

const cancel = () => {
  // router.go(-1);
  console.log('Cancelled');
};

const submitForm = () => {
  console.log('Submitting appointment data:', appointmentData);
  // API call to save the appointment would go here
};

</script>
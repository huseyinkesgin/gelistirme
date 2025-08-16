<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Yeni Müşteri Ekle</h1>

    <div class="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
      <!-- Kişisel Bilgiler -->
      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Kişisel Bilgiler</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Müşteriye ait temel kişisel ve iletişim bilgileri.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <BaseInput label="Ad" v-model="customerData.kisi.ad" required />
          </div>
          <div class="sm:col-span-3">
            <BaseInput label="Soyad" v-model="customerData.kisi.soyad" required />
          </div>
          <div class="sm:col-span-4">
            <InputEmail label="E-posta Adresi" v-model="customerData.kisi.email" />
          </div>
          <div class="sm:col-span-2">
            <InputPhone label="Telefon Numarası" v-model="customerData.telefon" />
          </div>
        </div>
      </div>

      <!-- Müşteri Bilgileri -->
      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Müşteri Bilgileri</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Müşterinin tipi, kaynağı ve diğer detayları.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <BaseSelect label="Müşteri Tipi" :options="musteriTipiOptions" v-model="customerData.musteri.musteri_tipi" />
          </div>
          <div class="sm:col-span-3">
            <BaseSelect label="Müşteri Kaynağı" :options="musteriKaynagiOptions" v-model="customerData.musteri.kaynak" />
          </div>
          <div class="sm:col-span-6">
            <BaseTextArea label="Açıklama / Notlar" v-model="customerData.musteri.aciklama" :rows="3" />
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="pt-5">
      <div class="flex justify-end space-x-3">
        <BaseButton variant="outline" @click="cancel">İptal</BaseButton>
        <BaseButton variant="primary" @click="submitForm">Müşteriyi Kaydet</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '@/renderer/components/ui/BaseInput.vue';
import InputEmail from '@/renderer/components/ui/InputEmail.vue';
import InputPhone from '@/renderer/components/ui/InputPhone.vue';
import BaseSelect from '@/renderer/components/ui/BaseSelect.vue';
import BaseTextArea from '@/renderer/components/ui/BaseTextArea.vue';
import BaseButton from '@/renderer/components/ui/BaseButton.vue';
import { MusteriTipiEnum } from '@/models/Musteri'; // Assuming enums are exported from models
import { MusteriKaynagiEnum } from '@/models/Musteri';

const router = useRouter();

const customerData = reactive({
  kisi: {
    ad: '',
    soyad: '',
    email: ''
  },
  telefon: '',
  musteri: {
    musteri_tipi: null,
    kaynak: null,
    aciklama: ''
  }
});

const musteriTipiOptions = Object.values(MusteriTipiEnum).map(tip => ({ value: tip, label: tip.charAt(0).toUpperCase() + tip.slice(1) }));
const musteriKaynagiOptions = Object.values(MusteriKaynagiEnum).map(kaynak => ({ value: kaynak, label: kaynak.charAt(0).toUpperCase() + kaynak.slice(1) }));

const cancel = () => {
  // router.go(-1);
  console.log('Cancelled');
};

const submitForm = () => {
  console.log('Submitting customer data:', customerData);
  // API call to save the customer would go here
};

</script>
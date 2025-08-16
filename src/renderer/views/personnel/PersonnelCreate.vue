<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Yeni Personel Ekle</h1>

    <div class="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
      <!-- Kişisel Bilgiler -->
      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Kişisel Bilgiler</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Personele ait temel kişisel ve iletişim bilgileri.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <BaseInput label="Ad" v-model="personelData.kisi.ad" required />
          </div>
          <div class="sm:col-span-3">
            <BaseInput label="Soyad" v-model="personelData.kisi.soyad" required />
          </div>
          <div class="sm:col-span-4">
            <InputEmail label="E-posta Adresi" v-model="personelData.kisi.email" required />
          </div>
          <div class="sm:col-span-2">
            <InputPhone label="Telefon Numarası" v-model="personelData.telefon" />
          </div>
          <div class="sm:col-span-6">
            <InputTc label="T.C. Kimlik Numarası" v-model="personelData.kisi.tc_kimlik_no" required />
          </div>
        </div>
      </div>

      <!-- Organizasyon ve Pozisyon -->
      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Organizasyon ve Pozisyon</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Personelin şirketteki rolü ve konumu.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-2">
            <BaseSelect label="Şube" :options="mockSubeOptions" v-model="personelData.pozisyon.sube_id" />
          </div>
          <div class="sm:col-span-2">
            <BaseSelect label="Departman" :options="mockDepartmanOptions" v-model="personelData.pozisyon.departman_id" />
          </div>
          <div class="sm:col-span-2">
            <BaseSelect label="Pozisyon" :options="mockPozisyonOptions" v-model="personelData.personel.pozisyon_id" />
          </div>
          <div class="sm:col-span-3">
             <BaseInput type="date" label="İşe Başlama Tarihi" v-model="personelData.personel.ise_baslama_tarihi" required />
          </div>
        </div>
      </div>

      <!-- Kullanıcı Hesabı -->
      <div class="pt-8">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Kullanıcı Hesabı</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Sisteme giriş için kullanılacak kullanıcı bilgileri.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <BaseInput label="Kullanıcı Adı" v-model="personelData.kullanici.kullanici_adi" hint="Boş bırakılırsa e-posta adresi kullanılacaktır." />
          </div>
          <div class="sm:col-span-6">
            <p class="text-sm text-gray-600 dark:text-gray-300">Not: Personel için otomatik olarak bir kullanıcı hesabı oluşturulacaktır. İlk şifre personelin T.C. Kimlik Numarası olarak ayarlanacaktır.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="pt-5">
      <div class="flex justify-end space-x-3">
        <BaseButton variant="outline" @click="cancel">İptal</BaseButton>
        <BaseButton variant="primary" @click="submitForm">Personeli Kaydet</BaseButton>
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
import InputTc from '@/renderer/components/ui/InputTc.vue';
import BaseSelect from '@/renderer/components/ui/BaseSelect.vue';
import BaseButton from '@/renderer/components/ui/BaseButton.vue';

const router = useRouter();

const personelData = reactive({
  kisi: {
    ad: '',
    soyad: '',
    email: '',
    tc_kimlik_no: ''
  },
  telefon: '',
  personel: {
    pozisyon_id: null,
    ise_baslama_tarihi: ''
  },
  pozisyon: {
      sube_id: null,
      departman_id: null
  },
  kullanici: {
      kullanici_adi: ''
  }
});

// Mock data for selects - in a real app, this would be fetched from an API
const mockSubeOptions = [
  { value: '1', label: 'Merkez Şube' },
  { value: '2', label: 'Ankara Şube' },
];
const mockDepartmanOptions = [
  { value: '1', label: 'Satış' },
  { value: '2', label: 'İdari İşler' },
];
const mockPozisyonOptions = [
  { value: '1', label: 'Emlak Danışmanı' },
  { value: '2', label: 'Ofis Yöneticisi' },
];

const cancel = () => {
  // router.go(-1);
  console.log('Cancelled');
};

const submitForm = () => {
  console.log('Submitting personnel data:', personelData);
  // API call to save the personnel would go here
};

</script>

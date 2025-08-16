<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Yeni Mülk Ekle</h1>

    <!-- Stepper Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <a
          v-for="(step, index) in steps"
          :key="step.name"
          @click="currentStep = index"
          :class="[
            index === currentStep
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-200',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer',
          ]"
        >
          {{ step.name }}
        </a>
      </nav>
    </div>

    <!-- Step Content -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <keep-alive>
        <component :is="steps[currentStep].component" v-model="propertyData" />
      </keep-alive>
    </div>

    <!-- Navigation Buttons -->
    <div class="mt-6 flex justify-between">
      <BaseButton v-if="currentStep > 0" @click="prevStep" variant="secondary">
        Geri
      </BaseButton>
      <div v-else></div> <!-- To keep the layout consistent -->
      
      <div class="space-x-2">
        <BaseButton variant="outline">Taslak Olarak Kaydet</BaseButton>
        <BaseButton v-if="currentStep < steps.length - 1" @click="nextStep">
          İleri
        </BaseButton>
        <BaseButton v-else @click="submitForm" variant="primary">
          Mülkü Kaydet
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, reactive } from 'vue';
import BaseButton from '@/renderer/components/ui/BaseButton.vue';
import PropertyStep1BasicInfo from './components/PropertyStep1BasicInfo.vue';
import PropertyStep2Location from './components/PropertyStep2Location.vue';
import PropertyStep3Details from './components/PropertyStep3Details.vue';
import PropertyStep4Media from './components/PropertyStep4Media.vue';

const currentStep = ref(0);
const steps = shallowRef([
  { name: 'Temel Bilgiler', component: PropertyStep1BasicInfo },
  { name: 'Lokasyon Bilgileri', component: PropertyStep2Location },
  { name: 'Mülk Detayları', component: PropertyStep3Details },
  { name: 'Medya Yükleme', component: PropertyStep4Media },
]);

const propertyData = reactive({
  // Step 1 data
  sahip_id: null,
  baslik: '',
  aciklama: '',
  fiyat: 0,
  // Step 2 data
  location: {},
  adres_satiri_1: '',
  // Step 3 data
  // ... will be populated by the dynamic form component
  // Step 4 data
  images: [],
  documents: [],
});

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const nextStep = () => {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++;
  }
};

const submitForm = () => {
  console.log('Submitting property data:', propertyData);
  // API call to save the property would go here
};

</script>

<template>
  <BaseInput
    v-model="internalValue"
    v-bind="$attrs"
    type="email"
    placeholder="ornek@adres.com"
    :error="errorMessage || error"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseInput from './BaseInput.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  error: String
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue);
const errorMessage = ref<string | null>(null);

const validateEmail = (email: string): string | null => {
  if (!email) return null; // Don't validate if empty

  // Simple regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Lütfen geçerli bir e-posta adresi giriniz.';
  }

  return null; // Valid
};

watch(internalValue, (newValue) => {
  errorMessage.value = validateEmail(newValue);
  emit('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalValue.value) {
    internalValue.value = newValue;
  }
});
</script>

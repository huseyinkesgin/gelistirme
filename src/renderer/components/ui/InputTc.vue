<template>
  <BaseInput
    v-model="internalValue"
    v-bind="$attrs"
    type="text"
    placeholder="11 haneli T.C. Kimlik No"
    maxlength="11"
    :error="errorMessage || error"
    @input="handleInput"
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

const validateTc = (tc: string): string | null => {
  if (!tc) return null; // Don't validate if empty

  if (!/^\d{11}$/.test(tc)) {
    return 'T.C. Kimlik numarası 11 rakamdan oluşmalıdır.';
  }

  const digits = tc.split('').map(Number);
  const lastDigit = digits.pop()!;
  const tenthDigit = digits.pop()!;

  const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const sumEven = digits[1] + digits[3] + digits[5] + digits[7];

  const checkTenth = (sumOdd * 7 - sumEven) % 10;
  if (checkTenth !== tenthDigit) {
    return 'Geçersiz T.C. Kimlik numarası.';
  }

  const totalSum = digits.reduce((acc, curr) => acc + curr, 0) + tenthDigit;
  const checkLast = totalSum % 10;
  if (checkLast !== lastDigit) {
    return 'Geçersiz T.C. Kimlik numarası.';
  }

  return null; // Valid
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  // Allow only digits
  target.value = target.value.replace(/\D/g, '');
  internalValue.value = target.value;
};

watch(internalValue, (newValue) => {
  errorMessage.value = validateTc(newValue);
  emit('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalValue.value) {
    internalValue.value = newValue;
  }
});

</script>

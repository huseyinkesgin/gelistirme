<template>
  <BaseInput
    :model-value="maskedValue"
    @input="handleInput"
    v-bind="$attrs"
    type="tel"
    placeholder="0(5xx) xxx xx xx"
    maxlength="16"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseInput from './BaseInput.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const applyMask = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  let masked = '0(';
  if (digits.length > 1) {
    masked += digits.substring(1, 4);
  }
  if (digits.length > 4) {
    masked += ') ' + digits.substring(4, 7);
  }
  if (digits.length > 7) {
    masked += ' ' + digits.substring(7, 9);
  }
  if (digits.length > 9) {
    masked += ' ' + digits.substring(9, 11);
  }
  return masked;
};

const maskedValue = computed(() => applyMask(props.modelValue));

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const unmaskedValue = target.value.replace(/\D/g, '');
  emit('update:modelValue', unmaskedValue);
};

</script>

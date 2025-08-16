<template>
  <BaseInput
    :model-value="formattedValue"
    @input="handleInput"
    v-bind="$attrs"
    :label="label"
    :error="error"
    :hint="hint"
    :disabled="disabled"
    :required="required"
  >
    <template #prepend>
      <span class="text-gray-500 sm:text-sm">{{ currencySymbol }}</span>
    </template>
  </BaseInput>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseInput from './BaseInput.vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  label: String,
  error: String,
  hint: String,
  disabled: Boolean,
  required: Boolean,
  currencySymbol: {
    type: String,
    default: '₺'
  },
  options: {
    type: Object,
    default: () => ({ locale: 'tr-TR', currency: 'TRY' })
  }
});

const emit = defineEmits(['update:modelValue']);

const formattedValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return '';
  // Format the number to a currency string
  return new Intl.NumberFormat(props.options.locale, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(props.modelValue);
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let numericValue = parseFloat(target.value.replace(/[^\d,-]/g, '').replace(',', '.'));
  if (isNaN(numericValue)) {
    numericValue = 0;
  }
  emit('update:modelValue', numericValue);
};

</script>

<style scoped>
/* You might need to adjust BaseInput to support prepending elements for the currency symbol */
/* This is a placeholder for that logic */
:deep(input) {
  padding-left: 2rem;
}
</style>

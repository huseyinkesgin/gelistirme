<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative rounded-md shadow-sm">
      <div v-if="icon" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <component :is="icon" class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        :id="id"
        :type="type"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @input="onInput"
        @blur="onBlur"
        class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
        :class="{
          'pl-10': icon,
          'border-red-500': error,
          'focus:border-red-500 focus:ring-red-500': error
        }"
      />
    </div>
    <p v-if="error" class="mt-1 text-xs italic text-red-500">
      {{ error }}
    </p>
    <p v-if="hint && !error" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  id: {
    type: String,
    default: () => `base-input-${Math.random().toString(36).substr(2, 9)}`
  },
  name: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  hint: String,
  icon: Object, // Vue component for the icon
  autocomplete: String
});

const emit = defineEmits(['update:modelValue', 'blur']);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const onBlur = (event: FocusEvent) => {
  emit('blur', event);
};
</script>

<style scoped>
/* Focus styles are handled by Tailwind's focus:ring-amber-500 utility class */
input:focus {
  @apply bg-amber-50 dark:bg-gray-800;
}
</style>
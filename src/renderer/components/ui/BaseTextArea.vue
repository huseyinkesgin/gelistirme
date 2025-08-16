<template>
  <div class="w-full">
    <div class="flex justify-between">
      <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <span v-if="maxlength" class="text-sm text-gray-500 dark:text-gray-400" id="char-count">
        {{ modelValue ? modelValue.length : 0 }} / {{ maxlength }}
      </span>
    </div>
    <div class="mt-1">
      <textarea
        :id="id"
        :name="name"
        :rows="rows"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :maxlength="maxlength"
        @input="onInput"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        :class="{ 
          'border-red-500': error,
          'focus:border-red-500 focus:ring-red-500': error
        }"
      ></textarea>
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
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: String,
  label: String,
  id: {
    type: String,
    default: () => `base-textarea-${Math.random().toString(36).substr(2, 9)}`
  },
  name: String,
  rows: {
    type: Number,
    default: 4
  },
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  hint: String,
  maxlength: Number
});

const emit = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped>
textarea:focus {
  @apply bg-amber-50 dark:bg-gray-800;
}
</style>

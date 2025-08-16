<template>
  <div class="relative flex items-start">
    <div class="flex h-5 items-center">
      <input
        :id="id"
        :name="name"
        type="checkbox"
        :checked="modelValue"
        @change="onChange"
        class="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
      />
    </div>
    <div class="ml-3 text-sm">
      <label :for="id" class="font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
      <p v-if="description" class="text-gray-500 dark:text-gray-400">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: String,
  id: {
    type: String,
    default: () => `base-checkbox-${Math.random().toString(36).substr(2, 9)}`
  },
  name: String,
  description: String,
});

const emit = defineEmits(['update:modelValue']);

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>

<template>
  <RadioGroup v-model="selectedValue">
    <RadioGroupLabel v-if="label" class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</RadioGroupLabel>
    <div class="mt-2 space-y-2">
      <RadioGroupOption
        as="template"
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        v-slot="{ active, checked }"
      >
        <div
          :class="[
            active ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-gray-800' : '',
            checked
              ? 'bg-amber-600 border-transparent text-white'
              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200',
            'cursor-pointer rounded-lg border px-5 py-4 shadow-sm focus:outline-none flex justify-between',
          ]"
        >
          <div class="flex items-center">
            <div class="text-sm">
              <RadioGroupLabel as="p" class="font-medium">{{ option.label }}</RadioGroupLabel>
              <RadioGroupDescription as="span" :class="[checked ? 'text-amber-100' : 'text-gray-500 dark:text-gray-400']">
                {{ option.description }}
              </RadioGroupDescription>
            </div>
          </div>
          <div v-if="checked" class="flex-shrink-0 text-white">
            <CheckCircleIcon class="h-6 w-6" />
          </div>
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  RadioGroupDescription,
} from '@headlessui/vue';
import { CheckCircleIcon } from '@heroicons/vue/20/solid';

interface RadioOption {
  value: string | number;
  label: string;
  description?: string;
}

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array as () => RadioOption[],
    default: () => [],
  },
  label: String,
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});
</script>

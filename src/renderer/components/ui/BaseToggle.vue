<template>
  <SwitchGroup as="div" class="flex items-center justify-between">
    <span class="flex flex-grow flex-col">
      <SwitchLabel as="span" class="text-sm font-medium text-gray-900 dark:text-gray-200" passive>{{ label }}</SwitchLabel>
      <SwitchDescription as="span" class="text-sm text-gray-500 dark:text-gray-400">{{ description }}</SwitchDescription>
    </span>
    <Switch
      v-model="enabled"
      :class="[enabled ? 'bg-amber-600' : 'bg-gray-200 dark:bg-gray-700', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2']"
    >
      <span
        aria-hidden="true"
        :class="[enabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']"
      />
    </Switch>
  </SwitchGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Switch, SwitchGroup, SwitchLabel, SwitchDescription } from '@headlessui/vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: String,
  description: String,
});

const emit = defineEmits(['update:modelValue']);

const enabled = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      colorClasses,
      {
        'opacity-50 cursor-not-allowed': disabled,
        'cursor-pointer': !disabled
      }
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot name="icon-left"></slot>
    <slot></slot>
    <slot name="icon-right"></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
    disabled?: boolean
}>(), {
    variant: 'primary',
    disabled: false
});

const colorClasses = computed(() => {
    const classes: { [key: string]: string } = {
        primary: 'border-transparent text-white bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
        secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-amber-500',
        success: 'border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
        danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
        warning: 'border-transparent text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        info: 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    };

    return classes[props.variant];
});
</script>

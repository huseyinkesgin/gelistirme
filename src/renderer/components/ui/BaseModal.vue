<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full transform rounded-lg bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all border-2 border-amber-500"
              :class="sizeClass"
            >
              <!-- Header with title and fixed icons -->
              <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  <slot name="title">{{ title }}</slot>
                </DialogTitle>
                <div class="flex items-center space-x-2">
                  <button v-if="showSave" @click="$emit('save')" class="text-green-600 hover:text-green-800 disabled:opacity-50" :disabled="disableSave">
                    <CheckCircleIcon class="h-6 w-6" />
                  </button>
                  <button v-if="showClear" @click="$emit('clear')" class="text-yellow-600 hover:text-yellow-800">
                    <BackspaceIcon class="h-6 w-6" />
                  </button>
                  <button @click="$emit('update:show', false)" class="text-red-600 hover:text-red-800">
                    <XCircleIcon class="h-6 w-6" />
                  </button>
                </div>
              </div>

              <!-- Body -->
              <div class="p-6">
                <slot></slot>
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer" class="p-4 border-t border-gray-200 dark:border-gray-700">
                <slot name="footer"></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import {
  XCircleIcon,
  CheckCircleIcon,
  BackspaceIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: String,
  size: {
    type: String,
    default: 'md', // xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl
  },
  preventClose: {
    type: Boolean,
    default: true, // Per requirement, default to not closing on outside click
  },
  showSave: { type: Boolean, default: true },
  showClear: { type: Boolean, default: true },
  disableSave: { type: Boolean, default: false },
});

const emit = defineEmits(['update:show', 'save', 'clear']);

const sizeClass = computed(() => {
  const sizes: Record<string, string> = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };
  return sizes[props.size] || sizes.md;
});

const handleClose = (value: boolean) => {
  if (props.preventClose) {
    // Do nothing, closing is handled by the X icon button
    return;
  }
  emit('update:show', value);
};
</script>
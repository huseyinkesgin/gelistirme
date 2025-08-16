<template>
  <Combobox as="div" v-model="selectedValue">
    <ComboboxLabel v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </ComboboxLabel>
    <div class="relative mt-1">
      <ComboboxInput
        class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        @change="query = $event.target.value"
        :display-value="(option) => (option as Option)?.label ?? ''"
        :placeholder="placeholder"
      />
      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </ComboboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ComboboxOptions
          v-if="filteredOptions.length > 0"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-800"
        >
          <ComboboxOption
            v-for="option in filteredOptions"
            :key="option.value"
            :value="option"
            as="template"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                'relative cursor-default select-none py-2 pl-3 pr-9',
                active ? 'bg-amber-600 text-white' : 'text-gray-900 dark:text-gray-200',
              ]"
            >
              <span :class="['block truncate', selected && 'font-semibold']">
                {{ option.label }}
              </span>
              <span
                v-if="selected"
                :class="[
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                  active ? 'text-white' : 'text-amber-600',
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </transition>
    </div>
    <p v-if="error" class="mt-1 text-xs italic text-red-500">{{ error }}</p>
  </Combobox>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';

interface Option {
  value: string | number;
  label: string;
}

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array as () => Option[],
    default: () => [],
  },
  label: String,
  placeholder: String,
  required: Boolean,
  error: String,
});

const emit = defineEmits(['update:modelValue']);

const query = ref('');
const selectedValue = computed({
  get: () => props.options.find(opt => opt.value === props.modelValue),
  set: (option) => {
    emit('update:modelValue', option ? option.value : null);
  },
});

const filteredOptions = computed(() =>
  query.value === ''
    ? props.options
    : props.options.filter((option) => {
        return option.label.toLowerCase().includes(query.value.toLowerCase());
      })
);
</script>

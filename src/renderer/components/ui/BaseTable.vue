<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th v-if="selectable" scope="col" class="px-6 py-3">
                  <BaseCheckbox :model-value="allSelected" @update:model-value="toggleSelectAll" />
                </th>
                <th
                  v-for="header in headers"
                  :key="header.key"
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  :class="{ 'cursor-pointer': header.sortable }"
                  @click="header.sortable ? sortBy(header.key) : null"
                >
                  <div class="flex items-center">
                    <span>{{ header.label }}</span>
                    <span v-if="header.sortable" class="ml-2">
                      <ChevronUpDownIcon v-if="sortState.key !== header.key" class="h-4 w-4" />
                      <ChevronUpIcon v-else-if="sortState.direction === 'asc'" class="h-4 w-4" />
                      <ChevronDownIcon v-else-if="sortState.direction === 'desc'" class="h-4 w-4" />
                    </span>
                  </div>
                </th>
                <th v-if="$slots.actions" scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="loading">
                <td :colspan="tableColspan" class="text-center py-8">
                  <LoadingSpinner />
                </td>
              </tr>
              <tr v-else-if="!sortedItems.length">
                <td :colspan="tableColspan" class="text-center py-8 text-gray-500">
                  Veri bulunamadı.
                </td>
              </tr>
              <tr v-for="item in sortedItems" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td v-if="selectable" class="px-6 py-4 whitespace-nowrap">
                  <BaseCheckbox :model-value="selectedItems.includes(item.id)" @update:model-value="toggleItem(item.id)" />
                </td>
                <td v-for="header in headers" :key="header.key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <slot :name="`cell-${header.key}`" :item="item" :value="get(item, header.key)">
                    {{ get(item, header.key) }}
                  </slot>
                </td>
                <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <slot name="actions" :item="item"></slot>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { get } from 'lodash-es';
import { ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/20/solid';
import BaseCheckbox from './BaseCheckbox.vue';
import LoadingSpinner from './LoadingSpinner.vue';

interface Header {
  key: string;
  label: string;
  sortable?: boolean;
}

const props = defineProps({
  headers: {
    type: Array as () => Header[],
    required: true,
  },
  items: {
    type: Array as () => any[],
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  initialSort: {
    type: Object as () => { key: string; direction: 'asc' | 'desc' },
    default: () => ({ key: 'id', direction: 'asc' }),
  },
});

const emit = defineEmits(['update:selectedItems']);

const sortState = ref(props.initialSort);
const selectedItems = ref<string[]>([]);

const tableColspan = computed(() => {
  let count = props.headers.length;
  if (props.selectable) count++;
  if (slots.actions) count++;
  return count;
});

const sortedItems = computed(() => {
  if (!sortState.value.key) return props.items;
  return [...props.items].sort((a, b) => {
    const valA = get(a, sortState.value.key);
    const valB = get(b, sortState.value.key);
    if (valA < valB) return sortState.value.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortState.value.direction === 'asc' ? 1 : -1;
    return 0;
  });
});

const sortBy = (key: string) => {
  if (sortState.value.key === key) {
    sortState.value.direction = sortState.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.value.key = key;
    sortState.value.direction = 'asc';
  }
};

const allSelected = computed(() => {
  return props.items.length > 0 && selectedItems.value.length === props.items.length;
});

const toggleSelectAll = (value: boolean) => {
  if (value) {
    selectedItems.value = props.items.map(item => item.id);
  } else {
    selectedItems.value = [];
  }
  emit('update:selectedItems', selectedItems.value);
};

const toggleItem = (id: string) => {
  const index = selectedItems.value.indexOf(id);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(id);
  }
  emit('update:selectedItems', selectedItems.value);
};

// Expose slots to script
import { useSlots } from 'vue'
const slots = useSlots()

</script>
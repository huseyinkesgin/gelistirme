<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
    <div
      @dragenter.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
      @dragover.prevent
      @drop.prevent="onDrop"
      :class="[
        'mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6',
        isDragging ? 'border-amber-500 bg-amber-50 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600'
      ]"
    >
      <div class="space-y-1 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="flex text-sm text-gray-600 dark:text-gray-400">
          <label :for="id" class="relative cursor-pointer rounded-md bg-white dark:bg-gray-900 font-medium text-amber-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2 hover:text-amber-500">
            <span>Dosya yükle</span>
            <input :id="id" :name="name" type="file" class="sr-only" :multiple="multiple" :accept="accept" @change="onFileChange">
          </label>
          <p class="pl-1">veya sürükleyip bırakın</p>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-500">{{ fileTypes }} (MAX. {{ maxSizeMB }}MB)</p>
      </div>
    </div>
    <div v-if="error" class="mt-1 text-xs italic text-red-500">{{ error }}</div>

    <!-- Previews -->
    <div v-if="selectedFiles.length" class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div v-for="(file, index) in selectedFiles" :key="index" class="relative group">
        <img :src="file.preview" class="h-24 w-24 rounded-md object-cover" />
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="removeFile(index)" class="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
        <div class="text-xs text-gray-500 truncate mt-1">{{ file.file.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

interface SelectedFile {
  file: File;
  preview: string;
}

const props = defineProps({
  label: String,
  id: {
    type: String,
    default: () => `image-upload-${Math.random().toString(36).substr(2, 9)}`
  },
  name: String,
  multiple: {
    type: Boolean,
    default: true
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  fileTypes: {
    type: String,
    default: 'PNG, JPG, GIF'
  },
  maxSizeMB: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['update:modelValue']);

const isDragging = ref(false);
const selectedFiles = ref<SelectedFile[]>([]);
const error = ref<string | null>(null);

const handleFiles = (files: FileList) => {
  error.value = null;
  const newFiles: SelectedFile[] = [];

  for (const file of Array.from(files)) {
    if (file.size > props.maxSizeMB * 1024 * 1024) {
      error.value = `${file.name} dosyası çok büyük (Maks: ${props.maxSizeMB}MB).`;
      continue;
    }
    if (!file.type.startsWith('image/')) {
        error.value = `${file.name} geçersiz bir dosya tipi.`;
        continue;
    }

    const preview = URL.createObjectURL(file);
    newFiles.push({ file, preview });
  }

  if (props.multiple) {
    selectedFiles.value = [...selectedFiles.value, ...newFiles];
  } else {
    selectedFiles.value = newFiles;
  }

  emit('update:modelValue', selectedFiles.value.map(f => f.file));
};

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    handleFiles(target.files);
  }
};

const onDragEnter = () => { isDragging.value = true; };
const onDragLeave = () => { isDragging.value = false; };
const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files) {
    handleFiles(e.dataTransfer.files);
  }
};

const removeFile = (index: number) => {
  const removedFile = selectedFiles.value[index];
  URL.revokeObjectURL(removedFile.preview);
  selectedFiles.value.splice(index, 1);
  emit('update:modelValue', selectedFiles.value.map(f => f.file));
};

// Cleanup blob URLs on unmount
onUnmounted(() => {
  selectedFiles.value.forEach(file => URL.revokeObjectURL(file.preview));
});

</script>

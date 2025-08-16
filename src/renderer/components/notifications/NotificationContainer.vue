<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="notificationClasses(notification.type)"
        class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <component :is="getIcon(notification.type)" :class="iconClasses(notification.type)" class="h-6 w-6" />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">
                {{ notification.title }}
              </p>
              <p v-if="notification.message" class="mt-1 text-sm text-gray-500">
                {{ notification.message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeNotification(notification.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline';
import type { Notification, NotificationType } from '@/types';

const notifications = ref<Notification[]>([]);

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon;
    case 'warning':
      return ExclamationTriangleIcon;
    case 'error':
      return XCircleIcon;
    default:
      return InformationCircleIcon;
  }
};

const iconClasses = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'text-green-400';
    case 'warning':
      return 'text-yellow-400';
    case 'error':
      return 'text-red-400';
    default:
      return 'text-blue-400';
  }
};

const notificationClasses = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'border-l-4 border-green-400';
    case 'warning':
      return 'border-l-4 border-yellow-400';
    case 'error':
      return 'border-l-4 border-red-400';
    default:
      return 'border-l-4 border-blue-400';
  }
};

const addNotification = (notification: Omit<Notification, 'id'>) => {
  const id = Date.now().toString();
  const newNotification: Notification = {
    id,
    ...notification
  };
  
  notifications.value.push(newNotification);
  
  // Otomatik kaldırma (persistent değilse)
  if (!notification.persistent) {
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }
};

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

// Global olarak erişilebilir fonksiyonları expose et
defineExpose({
  addNotification,
  removeNotification
});
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
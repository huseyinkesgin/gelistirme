import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([]);
  const maxNotifications = ref(5);

  // Actions
  const addNotification = (notification: Omit<Notification, 'id'>): string => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      duration: 5000,
      persistent: false,
      ...notification
    };

    notifications.value.push(newNotification);

    // Maksimum bildirim sayısını kontrol et
    if (notifications.value.length > maxNotifications.value) {
      notifications.value.shift();
    }

    // Otomatik kaldırma (persistent değilse)
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearAllNotifications = () => {
    notifications.value = [];
  };

  const updateNotification = (id: string, updates: Partial<Notification>) => {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      Object.assign(notification, updates);
    }
  };

  // Convenience methods
  const success = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    });
  };

  const error = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'error',
      title,
      message,
      persistent: true, // Error notifications are persistent by default
      ...options
    });
  };

  const warning = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 7000, // Warning notifications last longer
      ...options
    });
  };

  const info = (title: string, message?: string, options?: Partial<Notification>): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    });
  };

  const confirm = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void
  ): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      persistent: true,
      actions: [
        {
          label: 'İptal',
          action: () => {
            onCancel?.();
          },
          style: 'secondary'
        },
        {
          label: 'Onayla',
          action: () => {
            onConfirm();
          },
          style: 'danger'
        }
      ]
    });
  };

  const loading = (title: string, message?: string): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      persistent: true,
      duration: 0
    });
  };

  // System notifications
  const systemError = (error: any, context?: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return addNotification({
      type: 'error',
      title: 'Sistem Hatası',
      message: context ? `${context}: ${errorMessage}` : errorMessage,
      persistent: true,
      actions: [
        {
          label: 'Detayları Göster',
          action: () => {
            console.error('System Error Details:', error);
            if (window.electronAPI) {
              window.electronAPI.dialog.showError('Sistem Hatası', errorMessage);
            }
          },
          style: 'secondary'
        }
      ]
    });
  };

  const networkError = (message?: string) => {
    return addNotification({
      type: 'error',
      title: 'Bağlantı Hatası',
      message: message || 'Ağ bağlantısı sorunu yaşanıyor',
      persistent: true,
      actions: [
        {
          label: 'Yeniden Dene',
          action: () => {
            window.location.reload();
          },
          style: 'primary'
        }
      ]
    });
  };

  const databaseError = (message?: string) => {
    return addNotification({
      type: 'error',
      title: 'Veritabanı Hatası',
      message: message || 'Veritabanı bağlantısı sorunu yaşanıyor',
      persistent: true,
      actions: [
        {
          label: 'Bağlantıyı Kontrol Et',
          action: async () => {
            if (window.electronAPI) {
              try {
                const status = await window.electronAPI.database.getStatus();
                if (status.connected) {
                  success('Bağlantı Başarılı', 'Veritabanı bağlantısı yeniden kuruldu');
                } else {
                  error('Bağlantı Başarısız', status.message);
                }
              } catch (err) {
                error('Bağlantı Kontrolü Başarısız', 'Veritabanı durumu kontrol edilemedi');
              }
            }
          },
          style: 'primary'
        }
      ]
    });
  };

  const operationSuccess = (operation: string, details?: string) => {
    return success(
      `${operation} Başarılı`,
      details || `${operation} işlemi başarıyla tamamlandı`
    );
  };

  const operationError = (operation: string, error: any) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return addNotification({
      type: 'error',
      title: `${operation} Başarısız`,
      message: errorMessage,
      persistent: true
    });
  };

  return {
    // State
    notifications,
    maxNotifications,
    
    // Actions
    addNotification,
    removeNotification,
    clearAllNotifications,
    updateNotification,
    
    // Convenience methods
    success,
    error,
    warning,
    info,
    confirm,
    loading,
    
    // System notifications
    systemError,
    networkError,
    databaseError,
    operationSuccess,
    operationError
  };
});
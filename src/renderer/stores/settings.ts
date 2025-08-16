import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface AppSettings {
  // Genel ayarlar
  language: 'tr' | 'en';
  autoSave: boolean;
  autoSaveInterval: number; // dakika
  confirmOnDelete: boolean;
  showWelcomeScreen: boolean;
  
  // Bildirim ayarları
  enableNotifications: boolean;
  soundEnabled: boolean;
  notificationDuration: number; // saniye
  
  // Tablo ayarları
  defaultPageSize: number;
  showRowNumbers: boolean;
  enableTableFilters: boolean;
  rememberColumnWidths: boolean;
  
  // Form ayarları
  validateOnChange: boolean;
  showRequiredIndicators: boolean;
  autoCompleteEnabled: boolean;
  
  // Dosya ayarları
  defaultExportFormat: 'pdf' | 'excel' | 'csv';
  maxFileSize: number; // MB
  allowedFileTypes: string[];
  
  // Güvenlik ayarları
  sessionTimeout: number; // dakika
  requirePasswordChange: boolean;
  passwordChangeInterval: number; // gün
  
  // Performans ayarları
  enableLazyLoading: boolean;
  cacheEnabled: boolean;
  maxCacheSize: number; // MB
  
  // Geliştirici ayarları
  debugMode: boolean;
  showPerformanceMetrics: boolean;
  enableErrorReporting: boolean;
}

const defaultSettings: AppSettings = {
  // Genel ayarlar
  language: 'tr',
  autoSave: true,
  autoSaveInterval: 5,
  confirmOnDelete: true,
  showWelcomeScreen: true,
  
  // Bildirim ayarları
  enableNotifications: true,
  soundEnabled: true,
  notificationDuration: 5,
  
  // Tablo ayarları
  defaultPageSize: 25,
  showRowNumbers: true,
  enableTableFilters: true,
  rememberColumnWidths: true,
  
  // Form ayarları
  validateOnChange: true,
  showRequiredIndicators: true,
  autoCompleteEnabled: true,
  
  // Dosya ayarları
  defaultExportFormat: 'excel',
  maxFileSize: 10,
  allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  
  // Güvenlik ayarları
  sessionTimeout: 60,
  requirePasswordChange: false,
  passwordChangeInterval: 90,
  
  // Performans ayarları
  enableLazyLoading: true,
  cacheEnabled: true,
  maxCacheSize: 100,
  
  // Geliştirici ayarları
  debugMode: false,
  showPerformanceMetrics: false,
  enableErrorReporting: true
};

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref<AppSettings>({ ...defaultSettings });
  const loading = ref(false);
  const hasUnsavedChanges = ref(false);

  // Getters
  const isDebugMode = computed(() => settings.value.debugMode);
  const currentLanguage = computed(() => settings.value.language);
  const notificationsEnabled = computed(() => settings.value.enableNotifications);
  const autoSaveEnabled = computed(() => settings.value.autoSave);

  // Actions
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    settings.value[key] = value;
    hasUnsavedChanges.value = true;
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    Object.assign(settings.value, newSettings);
    hasUnsavedChanges.value = true;
  };

  const resetSettings = () => {
    settings.value = { ...defaultSettings };
    hasUnsavedChanges.value = true;
  };

  const resetSection = (section: 'general' | 'notifications' | 'table' | 'form' | 'file' | 'security' | 'performance' | 'developer') => {
    switch (section) {
      case 'general':
        updateSettings({
          language: defaultSettings.language,
          autoSave: defaultSettings.autoSave,
          autoSaveInterval: defaultSettings.autoSaveInterval,
          confirmOnDelete: defaultSettings.confirmOnDelete,
          showWelcomeScreen: defaultSettings.showWelcomeScreen
        });
        break;
      case 'notifications':
        updateSettings({
          enableNotifications: defaultSettings.enableNotifications,
          soundEnabled: defaultSettings.soundEnabled,
          notificationDuration: defaultSettings.notificationDuration
        });
        break;
      case 'table':
        updateSettings({
          defaultPageSize: defaultSettings.defaultPageSize,
          showRowNumbers: defaultSettings.showRowNumbers,
          enableTableFilters: defaultSettings.enableTableFilters,
          rememberColumnWidths: defaultSettings.rememberColumnWidths
        });
        break;
      case 'form':
        updateSettings({
          validateOnChange: defaultSettings.validateOnChange,
          showRequiredIndicators: defaultSettings.showRequiredIndicators,
          autoCompleteEnabled: defaultSettings.autoCompleteEnabled
        });
        break;
      case 'file':
        updateSettings({
          defaultExportFormat: defaultSettings.defaultExportFormat,
          maxFileSize: defaultSettings.maxFileSize,
          allowedFileTypes: [...defaultSettings.allowedFileTypes]
        });
        break;
      case 'security':
        updateSettings({
          sessionTimeout: defaultSettings.sessionTimeout,
          requirePasswordChange: defaultSettings.requirePasswordChange,
          passwordChangeInterval: defaultSettings.passwordChangeInterval
        });
        break;
      case 'performance':
        updateSettings({
          enableLazyLoading: defaultSettings.enableLazyLoading,
          cacheEnabled: defaultSettings.cacheEnabled,
          maxCacheSize: defaultSettings.maxCacheSize
        });
        break;
      case 'developer':
        updateSettings({
          debugMode: defaultSettings.debugMode,
          showPerformanceMetrics: defaultSettings.showPerformanceMetrics,
          enableErrorReporting: defaultSettings.enableErrorReporting
        });
        break;
    }
  };

  const saveSettings = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      loading.value = true;
      
      // Settings'i localStorage'a kaydet
      localStorage.setItem('app-settings', JSON.stringify(settings.value));
      
      // Gelecekte API'ye de kaydedilebilir
      await new Promise(resolve => setTimeout(resolve, 500));
      
      hasUnsavedChanges.value = false;
      
      return { success: true, message: 'Ayarlar başarıyla kaydedildi' };
    } catch (error) {
      console.error('Settings save error:', error);
      return { success: false, message: 'Ayarlar kaydedilirken hata oluştu' };
    } finally {
      loading.value = false;
    }
  };

  const loadSettings = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      loading.value = true;
      
      // localStorage'dan settings'i yükle
      const saved = localStorage.getItem('app-settings');
      if (saved) {
        const savedSettings = JSON.parse(saved);
        
        // Yeni ayarları mevcut ayarlarla birleştir (yeni ayarlar için)
        settings.value = { ...defaultSettings, ...savedSettings };
      }
      
      hasUnsavedChanges.value = false;
      
      return { success: true };
    } catch (error) {
      console.error('Settings load error:', error);
      settings.value = { ...defaultSettings };
      return { success: false, message: 'Ayarlar yüklenirken hata oluştu' };
    } finally {
      loading.value = false;
    }
  };

  const exportSettings = async (): Promise<{ success: boolean; data?: string; message?: string }> => {
    try {
      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        settings: settings.value
      };
      
      const jsonData = JSON.stringify(exportData, null, 2);
      
      if (window.electronAPI) {
        const result = await window.electronAPI.fileSystem.saveFile(
          jsonData,
          undefined,
          {
            defaultPath: `emlak-ayarlar-${new Date().toISOString().split('T')[0]}.json`,
            filters: [
              { name: 'JSON Dosyaları', extensions: ['json'] },
              { name: 'Tüm Dosyalar', extensions: ['*'] }
            ]
          }
        );
        
        if (result.success && !result.canceled) {
          return { success: true, message: 'Ayarlar başarıyla dışa aktarıldı' };
        } else if (result.canceled) {
          return { success: false, message: 'Dışa aktarma iptal edildi' };
        }
      }
      
      return { success: true, data: jsonData };
    } catch (error) {
      console.error('Settings export error:', error);
      return { success: false, message: 'Ayarlar dışa aktarılırken hata oluştu' };
    }
  };

  const importSettings = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      if (!window.electronAPI) {
        return { success: false, message: 'Dosya seçimi desteklenmiyor' };
      }
      
      const result = await window.electronAPI.fileSystem.selectFile({
        filters: [
          { name: 'JSON Dosyaları', extensions: ['json'] },
          { name: 'Tüm Dosyalar', extensions: ['*'] }
        ]
      });
      
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, message: 'Dosya seçimi iptal edildi' };
      }
      
      const fileResult = await window.electronAPI.fileSystem.readFile(result.filePaths[0]);
      
      if (!fileResult.success) {
        return { success: false, message: 'Dosya okunamadı' };
      }
      
      const importData = JSON.parse(fileResult.data);
      
      if (!importData.settings) {
        return { success: false, message: 'Geçersiz ayar dosyası' };
      }
      
      // Ayarları güncelle
      settings.value = { ...defaultSettings, ...importData.settings };
      hasUnsavedChanges.value = true;
      
      return { success: true, message: 'Ayarlar başarıyla içe aktarıldı' };
    } catch (error) {
      console.error('Settings import error:', error);
      return { success: false, message: 'Ayarlar içe aktarılırken hata oluştu' };
    }
  };

  const validateSettings = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Validation rules
    if (settings.value.autoSaveInterval < 1 || settings.value.autoSaveInterval > 60) {
      errors.push('Otomatik kaydetme aralığı 1-60 dakika arasında olmalıdır');
    }
    
    if (settings.value.notificationDuration < 1 || settings.value.notificationDuration > 30) {
      errors.push('Bildirim süresi 1-30 saniye arasında olmalıdır');
    }
    
    if (settings.value.defaultPageSize < 10 || settings.value.defaultPageSize > 100) {
      errors.push('Varsayılan sayfa boyutu 10-100 arasında olmalıdır');
    }
    
    if (settings.value.maxFileSize < 1 || settings.value.maxFileSize > 100) {
      errors.push('Maksimum dosya boyutu 1-100 MB arasında olmalıdır');
    }
    
    if (settings.value.sessionTimeout < 5 || settings.value.sessionTimeout > 480) {
      errors.push('Oturum zaman aşımı 5-480 dakika arasında olmalıdır');
    }
    
    if (settings.value.maxCacheSize < 10 || settings.value.maxCacheSize > 1000) {
      errors.push('Maksimum önbellek boyutu 10-1000 MB arasında olmalıdır');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  };

  const getSettingsBySection = (section: string) => {
    switch (section) {
      case 'general':
        return {
          language: settings.value.language,
          autoSave: settings.value.autoSave,
          autoSaveInterval: settings.value.autoSaveInterval,
          confirmOnDelete: settings.value.confirmOnDelete,
          showWelcomeScreen: settings.value.showWelcomeScreen
        };
      case 'notifications':
        return {
          enableNotifications: settings.value.enableNotifications,
          soundEnabled: settings.value.soundEnabled,
          notificationDuration: settings.value.notificationDuration
        };
      case 'table':
        return {
          defaultPageSize: settings.value.defaultPageSize,
          showRowNumbers: settings.value.showRowNumbers,
          enableTableFilters: settings.value.enableTableFilters,
          rememberColumnWidths: settings.value.rememberColumnWidths
        };
      case 'form':
        return {
          validateOnChange: settings.value.validateOnChange,
          showRequiredIndicators: settings.value.showRequiredIndicators,
          autoCompleteEnabled: settings.value.autoCompleteEnabled
        };
      case 'file':
        return {
          defaultExportFormat: settings.value.defaultExportFormat,
          maxFileSize: settings.value.maxFileSize,
          allowedFileTypes: settings.value.allowedFileTypes
        };
      case 'security':
        return {
          sessionTimeout: settings.value.sessionTimeout,
          requirePasswordChange: settings.value.requirePasswordChange,
          passwordChangeInterval: settings.value.passwordChangeInterval
        };
      case 'performance':
        return {
          enableLazyLoading: settings.value.enableLazyLoading,
          cacheEnabled: settings.value.cacheEnabled,
          maxCacheSize: settings.value.maxCacheSize
        };
      case 'developer':
        return {
          debugMode: settings.value.debugMode,
          showPerformanceMetrics: settings.value.showPerformanceMetrics,
          enableErrorReporting: settings.value.enableErrorReporting
        };
      default:
        return settings.value;
    }
  };

  return {
    // State
    settings,
    loading,
    hasUnsavedChanges,
    
    // Getters
    isDebugMode,
    currentLanguage,
    notificationsEnabled,
    autoSaveEnabled,
    
    // Actions
    updateSetting,
    updateSettings,
    resetSettings,
    resetSection,
    saveSettings,
    loadSettings,
    exportSettings,
    importSettings,
    validateSettings,
    getSettingsBySection
  };
});
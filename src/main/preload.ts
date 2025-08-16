import { contextBridge, ipcRenderer } from 'electron';

// Renderer sürecine güvenli API sağla
contextBridge.exposeInMainWorld('electronAPI', {
  // Uygulama bilgileri
  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    getInfo: () => ipcRenderer.invoke('app:get-info'),
    restart: () => ipcRenderer.invoke('app:restart')
  },

  // Veritabanı işlemleri
  database: {
    query: (sql: string, params?: any[]) => ipcRenderer.invoke('db:query', sql, params),
    migrate: () => ipcRenderer.invoke('db:migrate'),
    rollback: () => ipcRenderer.invoke('db:rollback'),
    seed: () => ipcRenderer.invoke('db:seed'),
    getStatus: () => ipcRenderer.invoke('db:status')
  },

  // Dosya sistemi işlemleri
  fileSystem: {
    selectFile: (options?: any) => ipcRenderer.invoke('fs:select-file', options),
    selectFiles: (options?: any) => ipcRenderer.invoke('fs:select-files', options),
    selectDirectory: (options?: any) => ipcRenderer.invoke('fs:select-directory', options),
    saveFile: (data: string | Buffer, filePath?: string, options?: any) =>
      ipcRenderer.invoke('fs:save-file', data, filePath, options),
    readFile: (filePath: string, encoding?: BufferEncoding) =>
      ipcRenderer.invoke('fs:read-file', filePath, encoding),
    getFileStats: (filePath: string) => ipcRenderer.invoke('fs:file-stats', filePath),
    exists: (filePath: string) => ipcRenderer.invoke('fs:exists', filePath)
  },

  // Dialog işlemleri
  dialog: {
    showMessage: (options: any) => ipcRenderer.invoke('dialog:show-message', options),
    showError: (title: string, content: string) =>
      ipcRenderer.invoke('dialog:show-error', title, content),
    showConfirm: (message: string, title?: string) =>
      ipcRenderer.invoke('dialog:show-confirm', message, title)
  },

  // Güvenlik işlemleri
  security: {
    openExternal: (url: string) => ipcRenderer.invoke('security:open-external', url),
    showItemInFolder: (fullPath: string) =>
      ipcRenderer.invoke('security:show-item-in-folder', fullPath)
  },

  // Sistem işlemleri
  system: {
    getInfo: () => ipcRenderer.invoke('system:get-info'),
    getPerformance: () => ipcRenderer.invoke('system:get-performance'),
    reportError: (errorData: any) => ipcRenderer.send('system:report-error', errorData),
    log: (level: string, message: string, data?: any) =>
      ipcRenderer.send('system:log', level, message, data)
  },

  // Auth işlemleri
  auth: {
    login: (credentials: { email: string; password: string }) =>
      ipcRenderer.invoke('auth:login', credentials),
    verifyToken: (token: string) =>
      ipcRenderer.invoke('auth:verify-token', token),
    refreshToken: (oldToken: string) =>
      ipcRenderer.invoke('auth:refresh-token', oldToken),
    checkPermission: (token: string, resource: string, action: string) =>
      ipcRenderer.invoke('auth:check-permission', { token, resource, action }),
    loginSuccess: () => ipcRenderer.send('auth:login-success')
  },

  // Event listener'lar
  on: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = [
      'navigate-to',
      'save-window-state',
      'get-window-state',
      'app-update-available',
      'app-update-downloaded',
      'auth:login-success'
    ];

    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },

  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },

  // Tek seferlik event listener
  once: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = [
      'navigate-to',
      'save-window-state',
      'get-window-state'
    ];

    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, callback);
    }
  }
});

// TypeScript için tip tanımları
declare global {
  interface Window {
    electronAPI: {
      app: {
        getVersion: () => Promise<string>;
        getInfo: () => Promise<{
          version: string;
          electron: string;
          node: string;
          platform: string;
          arch: string;
        }>;
        restart: () => Promise<void>;
      };
      database: {
        query: (sql: string, params?: any[]) => Promise<{ success: boolean; data: any }>;
        migrate: () => Promise<{ success: boolean; message: string }>;
        rollback: () => Promise<{ success: boolean; message: string }>;
        seed: () => Promise<{ success: boolean; message: string }>;
        getStatus: () => Promise<{ connected: boolean; message: string }>;
      };
      fileSystem: {
        selectFile: (options?: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
        selectFiles: (options?: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
        selectDirectory: (options?: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
        saveFile: (data: string | Buffer, filePath?: string, options?: any) =>
          Promise<{ success: boolean; filePath?: string; canceled?: boolean }>;
        readFile: (filePath: string, encoding?: BufferEncoding) =>
          Promise<{ success: boolean; data: string }>;
        getFileStats: (filePath: string) => Promise<{
          success: boolean;
          stats: {
            size: number;
            isFile: boolean;
            isDirectory: boolean;
            created: Date;
            modified: Date;
          };
        }>;
        exists: (filePath: string) => Promise<{ exists: boolean }>;
      };
      dialog: {
        showMessage: (options: any) => Promise<{ response: number }>;
        showError: (title: string, content: string) => Promise<{ success: boolean }>;
        showConfirm: (message: string, title?: string) => Promise<{ confirmed: boolean }>;
      };
      security: {
        openExternal: (url: string) => Promise<{ success: boolean }>;
        showItemInFolder: (fullPath: string) => Promise<{ success: boolean }>;
      };
      system: {
        getInfo: () => Promise<{
          platform: string;
          arch: string;
          version: string;
          memory: any;
          uptime: number;
        }>;
        getPerformance: () => Promise<{
          memory: any;
          cpu: any;
          uptime: number;
        }>;
        reportError: (errorData: any) => void;
        log: (level: string, message: string, data?: any) => void;
      };
      auth: {
        login: (credentials: { email: string; password: string }) =>
          Promise<{ success: boolean; token?: string; message?: string }>;
        verifyToken: (token: string) =>
          Promise<{ valid: boolean; user?: any; error?: string }>;
        refreshToken: (oldToken: string) =>
          Promise<{ success: boolean; token?: string; error?: string }>;
        checkPermission: (token: string, resource: string, action: string) =>
          Promise<{ hasPermission: boolean; error?: string }>;
        loginSuccess: () => void;
      };
      on: (channel: string, callback: (...args: any[]) => void) => void;
      off: (channel: string, callback: (...args: any[]) => void) => void;
      once: (channel: string, callback: (...args: any[]) => void) => void;
    };
  }
}
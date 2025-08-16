import { ipcMain, dialog, shell } from 'electron';
import { promises as fs } from 'fs';
import * as path from 'path';
import DatabaseManager from '../../config/database';
import { ErrorLogger } from '../utils/ErrorLogger';
import { WindowManager } from '../window/WindowManager';
import { SecurityManager } from '../security/SecurityManager';

export class IPCHandler {
  private dbManager: DatabaseManager;
  private errorLogger: ErrorLogger;
  private windowManager: WindowManager;
  private securityManager: SecurityManager;

  constructor(dbManager: DatabaseManager, errorLogger: ErrorLogger) {
    this.dbManager = dbManager;
    this.errorLogger = errorLogger;
    this.windowManager = new WindowManager();
    this.securityManager = new SecurityManager(errorLogger);
  }

  public setupHandlers(): void {
    this.setupAppHandlers();
    this.setupDatabaseHandlers();
    this.setupFileSystemHandlers();
    this.setupDialogHandlers();
    this.setupSecurityHandlers();
    this.setupSystemHandlers();
    this.setupAuthHandlers();
  }

  private setupAuthHandlers(): void {
    // Login
    ipcMain.handle('auth:login', async (event, { email, password }) => {
      try {
        // IP adresi (şu an için dummy)
        const ip = '127.0.0.1';

        // Kimlik doğrulama
        const result = await this.securityManager.authenticateUser(email, password, ip);

        // Başarılı giriş
        if (result.success && result.token) {
          const loginWindow = this.windowManager.getWindow('login');
          if (loginWindow) {
            loginWindow.close();
          }
          await this.windowManager.createMainWindow();
        }

        return result;
      } catch (error) {
        this.errorLogger.logError('Login Error', error);
        throw error;
      }
    });

    // Token doğrulama
    ipcMain.handle('auth:verify-token', async (event, token) => {
      try {
        const decoded = this.securityManager.getAuthManager().verifyToken(token);
        return { valid: true, user: decoded };
      } catch (error) {
        return { valid: false, error: error instanceof Error ? error.message : 'Invalid token' };
      }
    });

    // Token yenileme
    ipcMain.handle('auth:refresh-token', async (event, oldToken) => {
      try {
        const newToken = this.securityManager.getAuthManager().refreshToken(oldToken);
        return { success: true, token: newToken };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Token refresh failed' };
      }
    });

    // İzin kontrolü
    ipcMain.handle('auth:check-permission', async (event, { token, resource, action }) => {
      try {
        const hasPermission = await this.securityManager.checkPermission(token, resource, action);
        return { hasPermission };
      } catch (error) {
        return { hasPermission: false, error: error instanceof Error ? error.message : 'Permission check failed' };
      }
    });
  }

  private setupAppHandlers(): void {
    // Uygulama bilgileri
    ipcMain.handle('app:get-version', () => {
      return process.env.npm_package_version || '1.0.0';
    });

    ipcMain.handle('app:get-info', () => {
      return {
        version: process.env.npm_package_version || '1.0.0',
        electron: process.versions.electron,
        node: process.versions.node,
        platform: process.platform,
        arch: process.arch
      };
    });

    ipcMain.handle('app:restart', () => {
      const { app } = require('electron');
      app.relaunch();
      app.exit(0);
    });

    // Navigasyon
    ipcMain.on('navigate-to', (event, route: string) => {
      const mainWindow = this.windowManager.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('navigate-to', route);
      }
    });
  }

  private setupDatabaseHandlers(): void {
    // Veritabanı sorguları
    ipcMain.handle('db:query', async (event, sql: string, params: any[] = []) => {
      try {
        const knex = this.dbManager.getKnex();
        const result = await knex.raw(sql, params);
        return { success: true, data: result };
      } catch (error) {
        this.errorLogger.logError('Database Query Error', { sql, params, error });
        throw error;
      }
    });

    // Migration işlemleri
    ipcMain.handle('db:migrate', async () => {
      try {
        await this.dbManager.runMigrations();
        return { success: true, message: 'Migration\'lar başarıyla çalıştırıldı' };
      } catch (error) {
        this.errorLogger.logError('Migration Error', error);
        throw error;
      }
    });

    ipcMain.handle('db:rollback', async () => {
      try {
        await this.dbManager.rollbackMigration();
        return { success: true, message: 'Migration geri alındı' };
      } catch (error) {
        this.errorLogger.logError('Rollback Error', error);
        throw error;
      }
    });

    // Seed işlemleri
    ipcMain.handle('db:seed', async () => {
      try {
        await this.dbManager.runSeeds();
        return { success: true, message: 'Seed\'ler başarıyla çalıştırıldı' };
      } catch (error) {
        this.errorLogger.logError('Seed Error', error);
        throw error;
      }
    });

    // Veritabanı durumu
    ipcMain.handle('db:status', async () => {
      try {
        const knex = this.dbManager.getKnex();
        await knex.raw('SELECT 1');
        return { connected: true, message: 'Veritabanı bağlantısı aktif' };
      } catch (error) {
        return { connected: false, message: 'Veritabanı bağlantısı yok' };
      }
    });
  }

  private setupFileSystemHandlers(): void {
    // Dosya seçme
    ipcMain.handle('fs:select-file', async (event, options = {}) => {
      try {
        const mainWindow = this.windowManager.getMainWindow();
        if (!mainWindow) throw new Error('Ana pencere bulunamadı');

        const result = await dialog.showOpenDialog(mainWindow, {
          properties: ['openFile'],
          filters: [
            { name: 'Tüm Dosyalar', extensions: ['*'] },
            { name: 'Resimler', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] },
            { name: 'Dokümanlar', extensions: ['pdf', 'doc', 'docx', 'txt'] }
          ],
          ...options
        });

        return result;
      } catch (error) {
        this.errorLogger.logError('File Select Error', error);
        throw error;
      }
    });

    // Çoklu dosya seçme
    ipcMain.handle('fs:select-files', async (event, options = {}) => {
      try {
        const mainWindow = this.windowManager.getMainWindow();
        if (!mainWindow) throw new Error('Ana pencere bulunamadı');

        const result = await dialog.showOpenDialog(mainWindow, {
          properties: ['openFile', 'multiSelections'],
          ...options
        });

        return result;
      } catch (error) {
        this.errorLogger.logError('Multiple File Select Error', error);
        throw error;
      }
    });

    // Klasör seçme
    ipcMain.handle('fs:select-directory', async (event, options = {}) => {
      try {
        const mainWindow = this.windowManager.getMainWindow();
        if (!mainWindow) throw new Error('Ana pencere bulunamadı');

        const result = await dialog.showOpenDialog(mainWindow, {
          properties: ['openDirectory'],
          ...options
        });

        return result;
      } catch (error) {
        this.errorLogger.logError('Directory Select Error', error);
        throw error;
      }
    });

    // Dosya kaydetme
    ipcMain.handle('fs:save-file', async (event, data: string | Buffer, filePath?: string, options = {}) => {
      try {
        let targetPath = filePath;

        if (!targetPath) {
          const mainWindow = this.windowManager.getMainWindow();
          if (!mainWindow) throw new Error('Ana pencere bulunamadı');

          const result = await dialog.showSaveDialog(mainWindow, {
            filters: [
              { name: 'Tüm Dosyalar', extensions: ['*'] }
            ],
            ...options
          });

          if (result.canceled || !result.filePath) {
            return { success: false, canceled: true };
          }

          targetPath = result.filePath;
        }

        await fs.writeFile(targetPath, data);
        return { success: true, filePath: targetPath };
      } catch (error) {
        this.errorLogger.logError('File Save Error', error);
        throw error;
      }
    });

    // Dosya okuma
    ipcMain.handle('fs:read-file', async (event, filePath: string, encoding: BufferEncoding = 'utf8') => {
      try {
        const data = await fs.readFile(filePath, encoding);
        return { success: true, data };
      } catch (error) {
        this.errorLogger.logError('File Read Error', { filePath, error });
        throw error;
      }
    });

    // Dosya bilgisi
    ipcMain.handle('fs:file-stats', async (event, filePath: string) => {
      try {
        const stats = await fs.stat(filePath);
        return {
          success: true,
          stats: {
            size: stats.size,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory(),
            created: stats.birthtime,
            modified: stats.mtime
          }
        };
      } catch (error) {
        this.errorLogger.logError('File Stats Error', { filePath, error });
        throw error;
      }
    });

    // Dosya/klasör var mı kontrolü
    ipcMain.handle('fs:exists', async (event, filePath: string) => {
      try {
        await fs.access(filePath);
        return { exists: true };
      } catch {
        return { exists: false };
      }
    });
  }

  private setupDialogHandlers(): void {
    // Mesaj kutusu gösterme
    ipcMain.handle('dialog:show-message', async (event, options) => {
      try {
        const mainWindow = this.windowManager.getMainWindow();
        if (!mainWindow) throw new Error('Ana pencere bulunamadı');

        const result = await dialog.showMessageBox(mainWindow, {
          type: 'info',
          buttons: ['Tamam'],
          ...options
        });

        return result;
      } catch (error) {
        this.errorLogger.logError('Dialog Message Error', error);
        throw error;
      }
    });

    // Hata kutusu gösterme
    ipcMain.handle('dialog:show-error', async (event, title: string, content: string) => {
      try {
        dialog.showErrorBox(title, content);
        return { success: true };
      } catch (error) {
        this.errorLogger.logError('Dialog Error Box Error', error);
        throw error;
      }
    });

    // Onay kutusu gösterme
    ipcMain.handle('dialog:show-confirm', async (event, message: string, title = 'Onay') => {
      try {
        const mainWindow = this.windowManager.getMainWindow();
        if (!mainWindow) throw new Error('Ana pencere bulunamadı');

        const result = await dialog.showMessageBox(mainWindow, {
          type: 'question',
          buttons: ['İptal', 'Tamam'],
          defaultId: 1,
          title,
          message
        });

        return { confirmed: result.response === 1 };
      } catch (error) {
        this.errorLogger.logError('Dialog Confirm Error', error);
        throw error;
      }
    });
  }

  private setupSecurityHandlers(): void {
    // Güvenli URL açma
    ipcMain.handle('security:open-external', async (event, url: string) => {
      try {
        // URL güvenlik kontrolü
        const urlObj = new URL(url);
        const allowedProtocols = ['http:', 'https:', 'mailto:'];

        if (!allowedProtocols.includes(urlObj.protocol)) {
          throw new Error('Güvenli olmayan protokol');
        }

        await shell.openExternal(url);
        return { success: true };
      } catch (error) {
        this.errorLogger.logError('External URL Error', { url, error });
        throw error;
      }
    });

    // Dosya/klasör gösterme
    ipcMain.handle('security:show-item-in-folder', async (event, fullPath: string) => {
      try {
        // Path güvenlik kontrolü
        const normalizedPath = path.normalize(fullPath);
        shell.showItemInFolder(normalizedPath);
        return { success: true };
      } catch (error) {
        this.errorLogger.logError('Show Item Error', { fullPath, error });
        throw error;
      }
    });
  }

  private setupSystemHandlers(): void {
    // Sistem bilgileri
    ipcMain.handle('system:get-info', () => {
      return {
        platform: process.platform,
        arch: process.arch,
        version: process.version,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      };
    });

    // Hata raporlama
    ipcMain.on('system:report-error', (event, errorData) => {
      this.errorLogger.logError('Renderer Error', errorData);
    });

    // Log mesajları
    ipcMain.on('system:log', (event, level: string, message: string, data?: any) => {
      switch (level) {
        case 'error':
          this.errorLogger.logError(message, data);
          break;
        case 'warn':
          console.warn(`[RENDERER WARN] ${message}`, data);
          break;
        case 'info':
          console.info(`[RENDERER INFO] ${message}`, data);
          break;
        default:
          console.log(`[RENDERER] ${message}`, data);
      }
    });

    // Performans metrikleri
    ipcMain.handle('system:get-performance', () => {
      return {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime()
      };
    });
  }
}
import { app, BrowserWindow, dialog, shell, Menu, MenuItemConstructorOptions } from 'electron';
import * as path from 'path';
import isDev from 'electron-is-dev';
import DatabaseManager from '../config/database';
import { IPCHandler } from './ipc/IPCHandler';
import { SecurityManager } from './security/SecurityManager';
import { ErrorLogger } from './utils/ErrorLogger';
import { WindowManager } from './window/WindowManager';

class MainProcess {
  private windowManager: WindowManager;
  private dbManager: DatabaseManager;
  private ipcHandler: IPCHandler;
  private securityManager: SecurityManager;
  private errorLogger: ErrorLogger;

  constructor() {
    this.dbManager = DatabaseManager.getInstance();
    this.windowManager = new WindowManager();
    // ErrorLogger must be created before SecurityManager and IPCHandler
    this.errorLogger = new ErrorLogger();
    this.securityManager = new SecurityManager(this.errorLogger);
    this.ipcHandler = new IPCHandler(this.dbManager, this.errorLogger);

    this.init();
  }

  private init(): void {
    // Güvenlik yapılandırması
    this.setupSecurity();

    // Uygulama event handler'ları
    this.setupAppEvents();

    // Uygulama hazır olduğunda başlat
    app.whenReady().then(async () => {
      await this.initializeApp();
    });
  }

  private setupSecurity(): void {
    // CSP (Content Security Policy) ayarları
    app.on('web-contents-created', (_, contents) => {
      this.securityManager.setupWebContentsSecurity(contents);
    });

    // Güvenli olmayan içerik engelleme
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
      if (isDev) {
        // Geliştirme modunda sertifika hatalarını yok say
        event.preventDefault();
        callback(true);
      } else {
        // Production'da sertifika hatalarını logla ve reddet
        this.errorLogger.logError('Certificate Error', { url, error });
        callback(false);
      }
    });
  }

  private setupAppEvents(): void {
    // Tüm pencereler kapatıldığında
    app.on('window-all-closed', async () => {
      try {
        await this.cleanup();
        if (process.platform !== 'darwin') {
          app.quit();
        }
      } catch (error) {
        this.errorLogger.logError('Cleanup Error', error);
        app.quit();
      }
    });

    // macOS'ta dock'tan tıklandığında
    app.on('activate', async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        await this.windowManager.createMainWindow();
      }
    });

    // Uygulama kapatılmadan önce
    app.on('before-quit', async (event) => {
      event.preventDefault();
      await this.cleanup();
      app.exit(0);
    });

    // İkinci instance çalıştırılmaya çalışıldığında
    app.on('second-instance', () => {
      const mainWindow = this.windowManager.getMainWindow();
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });
  }

  private async initializeApp(): Promise<void> {
    try {
      // Single instance kontrolü
      if (!app.requestSingleInstanceLock()) {
        app.quit();
        return;
      }

      // Veritabanını başlat
      await this.initializeDatabase();

      // Login penceresini oluştur
      await this.windowManager.createLoginWindow();

      // IPC handler'ları kur
      this.setupIPC();

      // Menüyü oluştur
      this.createMenu();

      console.log('✅ Uygulama başarıyla başlatıldı');
    } catch (error) {
      this.errorLogger.logError('App Initialization Error', error);

      if (!isDev) {
        await dialog.showErrorBox(
          'Başlatma Hatası',
          'Uygulama başlatılırken bir hata oluştu. Lütfen tekrar deneyin.'
        );
        app.quit();
      }
    }
  }

  private createMenu(): void {
    const template: MenuItemConstructorOptions[] = [
      {
        label: 'Dosya',
        submenu: [
          {
            label: 'Yeni Mülk',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              const mainWindow = this.windowManager.getMainWindow();
              if (mainWindow) {
                mainWindow.webContents.send('navigate-to', '/mulkler/yeni');
              }
            }
          },
          { type: 'separator' },
          {
            label: 'Çıkış',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      {
        label: 'Düzenle',
        submenu: [
          { role: 'undo', label: 'Geri Al' },
          { role: 'redo', label: 'Yinele' },
          { type: 'separator' },
          { role: 'cut', label: 'Kes' },
          { role: 'copy', label: 'Kopyala' },
          { role: 'paste', label: 'Yapıştır' },
          { role: 'selectAll', label: 'Tümünü Seç' }
        ]
      },
      {
        label: 'Görünüm',
        submenu: [
          { role: 'reload', label: 'Yenile' },
          { role: 'forceReload', label: 'Zorla Yenile' },
          { role: 'toggleDevTools', label: 'Geliştirici Araçları' },
          { type: 'separator' },
          { role: 'resetZoom', label: 'Zoom Sıfırla' },
          { role: 'zoomIn', label: 'Yakınlaştır' },
          { role: 'zoomOut', label: 'Uzaklaştır' },
          { type: 'separator' },
          { role: 'togglefullscreen', label: 'Tam Ekran' }
        ]
      },
      {
        label: 'Veritabanı',
        submenu: [
          {
            label: 'Migration Çalıştır',
            click: async () => {
              try {
                await this.dbManager.runMigrations();
                dialog.showMessageBox(this.windowManager.getMainWindow()!, {
                  type: 'info',
                  title: 'Migration Başarılı',
                  message: 'Veritabanı migration\'ları başarıyla çalıştırıldı.'
                });
              } catch (error) {
                this.errorLogger.logError('Migration Menu Error', error);
                dialog.showErrorBox('Migration Hatası', 'Migration çalıştırılırken hata oluştu.');
              }
            }
          },
          {
            label: 'Seed Çalıştır',
            click: async () => {
              try {
                await this.dbManager.runSeeds();
                dialog.showMessageBox(this.windowManager.getMainWindow()!, {
                  type: 'info',
                  title: 'Seed Başarılı',
                  message: 'Veritabanı seed\'leri başarıyla çalıştırıldı.'
                });
              } catch (error) {
                this.errorLogger.logError('Seed Menu Error', error);
                dialog.showErrorBox('Seed Hatası', 'Seed çalıştırılırken hata oluştu.');
              }
            }
          }
        ]
      },
      {
        label: 'Yardım',
        submenu: [
          {
            label: 'Hakkında',
            click: () => {
              dialog.showMessageBox(this.windowManager.getMainWindow()!, {
                type: 'info',
                title: 'Hakkında',
                message: 'Emlak Portföy Yönetim Sistemi',
                detail: `Versiyon: ${app.getVersion()}\nElectron: ${process.versions.electron}\nNode.js: ${process.versions.node}`
              });
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await this.dbManager.initialize();
      console.log('✅ Veritabanı başlatıldı');
    } catch (error) {
      this.errorLogger.logError('Database Initialization Error', error);

      if (!isDev) {
        throw new Error('Veritabanı başlatılamadı');
      }
    }
  }

  private setupIPC(): void {
    this.ipcHandler.setupHandlers();
  }

  private async cleanup(): Promise<void> {
    try {
      console.log('🧹 Temizlik işlemleri başlatılıyor...');

      // Veritabanı bağlantısını kapat
      await this.dbManager.close();

      // Pencere yöneticisini temizle
      this.windowManager.cleanup();

      // Error logger'ı temizle
      await this.errorLogger.cleanup();

      console.log('✅ Temizlik işlemleri tamamlandı');
    } catch (error) {
      console.error('❌ Temizlik hatası:', error);
    }
  }
}

// Ana süreç başlat
new MainProcess();
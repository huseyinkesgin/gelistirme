import { BrowserWindow, screen } from 'electron';
import * as path from 'path';
import isDev from 'electron-is-dev';
import http from 'http';

interface WindowConfig {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  show: boolean;
  center: boolean;
  resizable: boolean;
  maximizable: boolean;
  minimizable: boolean;
  closable: boolean;
  alwaysOnTop: boolean;
  skipTaskbar: boolean;
  title: string;
  icon?: string;
}

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private loginWindow: BrowserWindow | null = null;
  private windows: Map<string, BrowserWindow> = new Map();

  public async createLoginWindow(): Promise<BrowserWindow> {
    if (this.loginWindow && !this.loginWindow.isDestroyed()) {
      this.loginWindow.focus();
      return this.loginWindow;
    }

    const config: WindowConfig = {
      width: 400,
      height: 600,
      minWidth: 400,
      minHeight: 600,
      show: false,
      center: true,
      resizable: false,
      maximizable: false,
      minimizable: true,
      closable: true,
      alwaysOnTop: false,
      skipTaskbar: false,
      title: 'Giriş - Emlak Portföy Yönetim Sistemi'
    };

    this.loginWindow = await this.createWindow('login', config, {
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        sandbox: false,
        webSecurity: !isDev,
        allowRunningInsecureContent: isDev,
        preload: path.join(__dirname, '../preload.js')
      }
    });

    this.loginWindow.once('ready-to-show', () => {
      this.loginWindow?.show();
      if (isDev) {
        this.loginWindow?.webContents.openDevTools();
      }
    });

    const rendererPath = isDev
      ? 'http://localhost:3000/#/auth/login'
      : `file://${path.join(__dirname, '../../renderer/index.html')}/#/auth/login`;

    await this.loginWindow.loadURL(rendererPath);

    return this.loginWindow;
  }

  public async createMainWindow(): Promise<BrowserWindow> {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.focus();
      return this.mainWindow;
    }

    const config: WindowConfig = {
      width: 1400,
      height: 900,
      minWidth: 1200,
      minHeight: 700,
      show: false,
      center: true,
      resizable: true,
      maximizable: true,
      minimizable: true,
      closable: true,
      alwaysOnTop: false,
      skipTaskbar: false,
      title: 'Emlak Portföy Yönetim Sistemi'
    };

    this.mainWindow = await this.createWindow('main', config, {
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        sandbox: false,
        webSecurity: !isDev,
        allowRunningInsecureContent: isDev,
        preload: path.join(__dirname, '../preload.js')
      },
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      vibrancy: process.platform === 'darwin' ? 'under-window' : undefined,
      backgroundColor: '#f8fafc'
    });

    this.setupMainWindowEvents();
    await this.loadMainWindow();

    return this.mainWindow;
  }

  private async createWindow(
    id: string,
    config: WindowConfig,
    additionalOptions: any = {}
  ): Promise<BrowserWindow> {
    // Ekran boyutlarını al
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    // Pencere boyutlarını ekran boyutlarına göre ayarla
    const windowWidth = Math.min(config.width, screenWidth - 100);
    const windowHeight = Math.min(config.height, screenHeight - 100);

    const window = new BrowserWindow({
      width: windowWidth,
      height: windowHeight,
      minWidth: config.minWidth,
      minHeight: config.minHeight,
      show: config.show,
      center: config.center,
      resizable: config.resizable,
      maximizable: config.maximizable,
      minimizable: config.minimizable,
      closable: config.closable,
      alwaysOnTop: config.alwaysOnTop,
      skipTaskbar: config.skipTaskbar,
      title: config.title,
      icon: config.icon,
      ...additionalOptions
    });

    // Pencereyi kaydet
    this.windows.set(id, window);

    // Pencere kapatıldığında temizle
    window.on('closed', () => {
      this.windows.delete(id);
      if (id === 'main') {
        this.mainWindow = null;
      }
    });

    return window;
  }

  private setupMainWindowEvents(): void {
    if (!this.mainWindow) return;

    // Pencere hazır olduğunda göster
    this.mainWindow.once('ready-to-show', () => {
      if (!this.mainWindow) return;

      this.mainWindow.show();

      // Geliştirme modunda DevTools'u aç
      if (isDev) {
        this.mainWindow.webContents.openDevTools();
      }

      // Pencere odağını al
      this.mainWindow.focus();
    });

    // Pencere boyutu değiştiğinde
    this.mainWindow.on('resize', () => {
      this.saveWindowState();
    });

    // Pencere taşındığında
    this.mainWindow.on('move', () => {
      this.saveWindowState();
    });

    // Pencere maximize/minimize durumu değiştiğinde
    this.mainWindow.on('maximize', () => {
      this.saveWindowState();
    });

    this.mainWindow.on('unmaximize', () => {
      this.saveWindowState();
    });

    // Pencere kapatılmaya çalışıldığında
    this.mainWindow.on('close', (event) => {
      if (process.platform === 'darwin') {
        // macOS'ta pencereyi gizle, uygulamayı kapatma
        event.preventDefault();
        this.mainWindow?.hide();
      }
    });

    // Web contents event'leri
    this.mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.error('Page load failed:', { errorCode, errorDescription, validatedURL });
    });

    this.mainWindow.webContents.on('render-process-gone', (event, details) => {
      console.error('Renderer process gone:', details);

      // Renderer process crash durumunda pencereyi yeniden yükle
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.reload();
      }
    });

    // Unresponsive durumu
    this.mainWindow.on('unresponsive', () => {
      console.warn('Main window became unresponsive');
    });

    this.mainWindow.on('responsive', () => {
      console.info('Main window became responsive again');
    });
  }

  private async loadMainWindow(): Promise<void> {
    if (!this.mainWindow) return;
    const rendererPath = isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../../renderer/index.html')}`;

    try {
      // In dev mode, wait briefly for the dev server to be ready to avoid ERR_CONNECTION_REFUSED
      if (isDev) {
        const ready = await this.waitForServer(rendererPath, 10000);
        if (!ready) {
          console.warn(`Dev server not responding at ${rendererPath} after timeout, attempting to load anyway.`);
        }
      }

      await this.mainWindow.loadURL(rendererPath);
    } catch (error) {
      console.error('Failed to load main window:', error);

      // Fallback: Hata sayfası göster
      const errorHtml = `
        <html>
          <head><title>Yükleme Hatası</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Uygulama Yüklenemedi</h1>
            <p>Uygulama yüklenirken bir hata oluştu.</p>
            <p>Lütfen uygulamayı yeniden başlatın.</p>
            <button onclick="location.reload()">Yeniden Dene</button>
          </body>
        </html>
      `;

      await this.mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
    }
  }

  // Wait for an HTTP server to respond at the given URL. Returns true if reachable within timeoutMs.
  private waitForServer(url: string, timeoutMs = 10000): Promise<boolean> {
    const start = Date.now();
    const check = () => new Promise<boolean>((resolve) => {
      try {
        const req = http.request(url, { method: 'HEAD', timeout: 2000 }, (res) => {
          res.resume();
          resolve(true);
        });
        req.on('error', () => resolve(false));
        req.on('timeout', () => {
          req.destroy();
          resolve(false);
        });
        req.end();
      } catch (e) {
        resolve(false);
      }
    });

    return new Promise<boolean>((resolve) => {
      const attempt = async () => {
        const ok = await check();
        if (ok) return resolve(true);
        if (Date.now() - start >= timeoutMs) return resolve(false);
        setTimeout(attempt, 500);
      };
      attempt();
    });
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  public getWindow(id: string): BrowserWindow | null {
    return this.windows.get(id) || null;
  }

  public getAllWindows(): BrowserWindow[] {
    return Array.from(this.windows.values());
  }

  public async createModalWindow(
    parentId: string,
    config: Partial<WindowConfig> = {}
  ): Promise<BrowserWindow> {
    const parent = this.windows.get(parentId);
    if (!parent) {
      throw new Error(`Parent window '${parentId}' not found`);
    }

    const modalConfig: WindowConfig = {
      width: 600,
      height: 400,
      minWidth: 400,
      minHeight: 300,
      show: false,
      center: true,
      resizable: true,
      maximizable: false,
      minimizable: false,
      closable: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      title: 'Modal',
      ...config
    };

    const modalId = `modal-${Date.now()}`;
    const modal = await this.createWindow(modalId, modalConfig, {
      parent,
      modal: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        sandbox: true,
        preload: path.join(__dirname, '../preload.js')
      }
    });

    modal.once('ready-to-show', () => {
      modal.show();
    });

    return modal;
  }

  public closeWindow(id: string): void {
    const window = this.windows.get(id);
    if (window && !window.isDestroyed()) {
      window.close();
    }
  }

  public closeAllWindows(): void {
    this.windows.forEach((window, id) => {
      if (!window.isDestroyed()) {
        window.close();
      }
    });
  }

  public minimizeWindow(id: string): void {
    const window = this.windows.get(id);
    if (window && !window.isDestroyed()) {
      window.minimize();
    }
  }

  public maximizeWindow(id: string): void {
    const window = this.windows.get(id);
    if (window && !window.isDestroyed()) {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  }

  public focusWindow(id: string): void {
    const window = this.windows.get(id);
    if (window && !window.isDestroyed()) {
      if (window.isMinimized()) {
        window.restore();
      }
      window.focus();
    }
  }

  private saveWindowState(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return;

    const bounds = this.mainWindow.getBounds();
    const isMaximized = this.mainWindow.isMaximized();
    const isMinimized = this.mainWindow.isMinimized();

    const windowState = {
      bounds,
      isMaximized,
      isMinimized,
      timestamp: Date.now()
    };

    // Window state'i localStorage'a kaydet (renderer process'e gönder)
    this.mainWindow.webContents.send('save-window-state', windowState);
  }

  public restoreWindowState(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return;

    // Window state'i localStorage'dan al (renderer process'den iste)
    this.mainWindow.webContents.send('get-window-state');
  }

  public cleanup(): void {
    console.log('🧹 WindowManager temizlik işlemleri başlatılıyor...');

    // Tüm pencereleri kapat
    this.closeAllWindows();

    // Referansları temizle
    this.mainWindow = null;
    this.windows.clear();

    console.log('✅ WindowManager temizlik işlemleri tamamlandı');
  }

  // Pencere durumu kontrolleri
  public isMainWindowVisible(): boolean {
    return this.mainWindow ? this.mainWindow.isVisible() : false;
  }

  public isMainWindowMinimized(): boolean {
    return this.mainWindow ? this.mainWindow.isMinimized() : false;
  }

  public isMainWindowMaximized(): boolean {
    return this.mainWindow ? this.mainWindow.isMaximized() : false;
  }

  public getMainWindowBounds(): Electron.Rectangle | null {
    return this.mainWindow ? this.mainWindow.getBounds() : null;
  }

  // Pencere pozisyonu ve boyutu ayarlama
  public setMainWindowBounds(bounds: Partial<Electron.Rectangle>): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.setBounds(bounds);
    }
  }

  public centerMainWindow(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.center();
    }
  }
}
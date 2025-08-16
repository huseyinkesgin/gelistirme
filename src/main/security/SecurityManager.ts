import { WebContents, session } from 'electron';
import isDev from 'electron-is-dev';
import { ErrorLogger } from '../utils/ErrorLogger';
import { AuthManager } from './AuthManager';
import { RoleManager } from './RoleManager';
import { SecurityLogger } from './SecurityLogger';

export class SecurityManager {
  private authManager: AuthManager;
  private roleManager: RoleManager;
  private securityLogger: SecurityLogger;

  constructor(errorLogger: ErrorLogger) {
    this.authManager = new AuthManager(errorLogger);
    this.roleManager = new RoleManager(errorLogger);
    this.securityLogger = new SecurityLogger(errorLogger);
    this.setupGlobalSecurity();
  }

  private setupGlobalSecurity(): void {
    // Güvenli olmayan içerik engelleme
    if (!isDev) {
      // Production'da güvenlik ayarları
      process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'false';
    }
  }

  public setupWebContentsSecurity(contents: WebContents): void {
    // Yeni pencere açma kontrolü
    contents.setWindowOpenHandler(({ url }) => {
      // Sadece güvenli URL'lere izin ver
      if (this.isUrlSafe(url)) {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true,
              sandbox: true
            }
          }
        };
      }
      return { action: 'deny' };
    });

    // Navigation kontrolü
    contents.on('will-navigate', (event, navigationUrl) => {
      if (!this.isNavigationSafe(navigationUrl)) {
        event.preventDefault();
        console.warn('Güvenli olmayan navigasyon engellendi:', navigationUrl);
      }
    });

    // Dosya indirme kontrolü
    contents.session.on('will-download', (event, item, webContents) => {
      // Güvenli dosya türleri kontrolü
      const filename = item.getFilename();
      if (!this.isFileTypeSafe(filename)) {
        event.preventDefault();
        console.warn('Güvenli olmayan dosya indirme engellendi:', filename);
      }
    });

    // CSP (Content Security Policy) ayarları
    this.setupContentSecurityPolicy(contents);

    // Permission handler'ları
    this.setupPermissionHandlers(contents);
  }

  private setupContentSecurityPolicy(contents: WebContents): void {
    contents.session.webRequest.onHeadersReceived((details, callback) => {
      const cspHeader = isDev
        ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* ws://localhost:*; img-src 'self' data: blob:; media-src 'self' blob:;"
        : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self';";

      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [cspHeader]
        }
      });
    });
  }

  private setupPermissionHandlers(contents: WebContents): void {
    contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
      // İzin verilen permission'lar
      const allowedPermissions = [
        'clipboard-read',
        'clipboard-write',
        'fullscreen',
        'notifications'
      ];

      if (allowedPermissions.includes(permission)) {
        callback(true);
      } else {
        console.warn('İzin reddedildi:', permission);
        callback(false);
      }
    });

    // Medya erişimi kontrolü
    contents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
      const allowedOrigins = isDev
        ? ['http://localhost:3000', 'file://']
        : ['file://'];

      const isOriginAllowed = allowedOrigins.some(origin =>
        requestingOrigin.startsWith(origin)
      );

      return isOriginAllowed;
    });
  }

  private isUrlSafe(url: string): boolean {
    try {
      const urlObj = new URL(url);

      // Güvenli protokoller
      const safeProtocols = ['https:', 'http:', 'file:'];
      if (!safeProtocols.includes(urlObj.protocol)) {
        return false;
      }

      // Geliştirme modunda localhost'a izin ver
      if (isDev && urlObj.hostname === 'localhost') {
        return true;
      }

      // Production'da sadece HTTPS
      if (!isDev && urlObj.protocol !== 'https:') {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  private isNavigationSafe(url: string): boolean {
    try {
      const urlObj = new URL(url);

      // Geliştirme modunda localhost navigasyonuna izin ver
      if (isDev && urlObj.hostname === 'localhost') {
        return true;
      }

      // File protokolüne izin ver (Electron app)
      if (urlObj.protocol === 'file:') {
        return true;
      }

      // Diğer durumlarda navigasyonu engelle
      return false;
    } catch {
      return false;
    }
  }

  private isFileTypeSafe(filename: string): boolean {
    const safeExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', // Resimler
      '.pdf', '.txt', '.doc', '.docx', '.xls', '.xlsx', // Dokümanlar
      '.zip', '.rar', '.7z', // Arşivler
      '.mp4', '.avi', '.mov', '.wmv', // Videolar
      '.mp3', '.wav', '.ogg' // Ses dosyaları
    ];

    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return safeExtensions.includes(extension);
  }

  public setupSessionSecurity(): void {
    const ses = session.defaultSession;

    // Güvenli cookie ayarları
    ses.cookies.on('changed', (event, cookie, cause, removed) => {
      if (!removed && !cookie.secure && !isDev) {
        console.warn('Güvenli olmayan cookie tespit edildi:', cookie.name);
      }
    });

    // Cache temizleme
    if (!isDev) {
      ses.clearCache();
      ses.clearStorageData({
        storages: ['cookies', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers']
      });
    }

    // Web güvenlik ayarları
    ses.webRequest.onBeforeRequest((details, callback) => {
      // Kötü amaçlı URL'leri engelle
      if (this.isMaliciousUrl(details.url)) {
        callback({ cancel: true });
        console.warn('Kötü amaçlı URL engellendi:', details.url);
        return;
      }

      callback({ cancel: false });
    });
  }

  private isMaliciousUrl(url: string): boolean {
    // Basit kötü amaçlı URL kontrolü
    const maliciousPatterns = [
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i
    ];

    return maliciousPatterns.some(pattern => pattern.test(url));
  }

  // Auth Manager getters
  public getAuthManager(): AuthManager {
    return this.authManager;
  }

  // Role Manager getters
  public getRoleManager(): RoleManager {
    return this.roleManager;
  }

  // Security Logger getters
  public getSecurityLogger(): SecurityLogger {
    return this.securityLogger;
  }

  // Helper methods
  public async authenticateUser(email: string, password: string, ip: string): Promise<{ success: boolean; token?: string; message?: string }> {
    try {
      // Mock kullanıcı verisi (gerçek uygulamada veritabanından gelecek)
      const mockUser = {
        id: '1',
        email: 'admin@example.com',
        hashedPassword: await this.authManager.hashPassword('admin123'),
        roles: ['admin']
      };

      // Giriş izni kontrolü
      if (!this.authManager.isLoginAllowed(ip)) {
        this.securityLogger.logAuthEvent(email, ip, 'login', false, {
          reason: 'Too many failed attempts'
        });
        return {
          success: false,
          message: 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.'
        };
      }

      // Şifre kontrolü
      if (email !== mockUser.email || !await this.authManager.comparePassword(password, mockUser.hashedPassword)) {
        this.authManager.recordLoginAttempt(ip, false);
        this.securityLogger.logAuthEvent(email, ip, 'login', false, {
          reason: 'Invalid credentials'
        });
        return {
          success: false,
          message: 'Geçersiz e-posta veya şifre'
        };
      }

      // Token oluştur
      const token = this.authManager.generateToken({
        id: mockUser.id,
        email: mockUser.email,
        roles: mockUser.roles
      });

      // Başarılı girişi logla
      this.authManager.recordLoginAttempt(ip, true);
      this.securityLogger.logAuthEvent(mockUser.id, ip, 'login', true);

      return {
        success: true,
        token
      };
    } catch (error) {
      this.securityLogger.logAuthEvent('unknown', ip, 'login', false, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  public async checkPermission(token: string, resource: string, action: string): Promise<boolean> {
    try {
      const decoded = this.authManager.verifyToken(token);
      const hasPermission = this.roleManager.hasPermission(decoded.roles, resource, action);

      this.securityLogger.logAccessEvent(
        decoded.id,
        'unknown', // IP bilgisi bu noktada mevcut değil
        resource,
        action,
        hasPermission
      );

      return hasPermission;
    } catch (error) {
      this.securityLogger.logAccessEvent(
        'unknown',
        'unknown',
        resource,
        action,
        false,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      return false;
    }
  }

  // Cleanup
  public cleanup(): void {
    // Giriş denemelerini temizle
    this.authManager.cleanupLoginAttempts();

    // Eski logları temizle (30 günden eski)
    this.securityLogger.cleanupOldLogs(30);
  }

  public validateInput(input: string, type: 'sql' | 'path' | 'url' | 'general'): boolean {
    switch (type) {
      case 'sql':
        return this.validateSqlInput(input);
      case 'path':
        return this.validatePathInput(input);
      case 'url':
        return this.validateUrlInput(input);
      case 'general':
        return this.validateGeneralInput(input);
      default:
        return false;
    }
  }

  private validateSqlInput(input: string): boolean {
    // SQL injection koruması
    const dangerousPatterns = [
      /(\b(DROP|DELETE|INSERT|UPDATE|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
      /(--|\/\*|\*\/)/,
      /(\bUNION\b.*\bSELECT\b)/i,
      /(\bOR\b.*=.*)/i
    ];

    return !dangerousPatterns.some(pattern => pattern.test(input));
  }

  private validatePathInput(input: string): boolean {
    // Path traversal koruması
    const dangerousPatterns = [
      /\.\./,
      /[<>:"|?*]/,
      /^[a-zA-Z]:\\/,
      /^\//
    ];

    return !dangerousPatterns.some(pattern => pattern.test(input));
  }

  private validateUrlInput(input: string): boolean {
    try {
      const url = new URL(input);
      return ['http:', 'https:', 'file:'].includes(url.protocol);
    } catch {
      return false;
    }
  }

  private validateGeneralInput(input: string): boolean {
    // XSS koruması
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/i,
      /on\w+\s*=/i
    ];

    return !dangerousPatterns.some(pattern => pattern.test(input));
  }
}
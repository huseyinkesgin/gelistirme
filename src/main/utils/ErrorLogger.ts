import { promises as fs } from 'fs';
import * as path from 'path';
import { app } from 'electron';

interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  data?: any;
  stack?: string;
  userId?: string;
  sessionId?: string;
}

export class ErrorLogger {
  private logDir: string;
  private logFile: string;
  private maxLogSize: number = 10 * 1024 * 1024; // 10MB
  private maxLogFiles: number = 5;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.logDir = path.join(app.getPath('userData'), 'logs');
    this.logFile = path.join(this.logDir, 'app.log');
    this.initializeLogger();
  }

  private async initializeLogger(): Promise<void> {
    try {
      // Log klasörünü oluştur
      await fs.mkdir(this.logDir, { recursive: true });
      
      // Log dosyası boyutunu kontrol et ve gerekirse rotate et
      await this.rotateLogsIfNeeded();
      
      // Başlangıç log'u
      await this.logInfo('Logger initialized', {
        sessionId: this.sessionId,
        logDir: this.logDir,
        pid: process.pid
      });
    } catch (error) {
      console.error('Logger initialization failed:', error);
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public async logError(message: string, data?: any): Promise<void> {
    const stack = data instanceof Error ? data.stack : new Error().stack;
    await this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      data: this.sanitizeData(data),
      stack,
      sessionId: this.sessionId
    });
  }

  public async logWarn(message: string, data?: any): Promise<void> {
    await this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      data: this.sanitizeData(data),
      sessionId: this.sessionId
    });
  }

  public async logInfo(message: string, data?: any): Promise<void> {
    await this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      data: this.sanitizeData(data),
      sessionId: this.sessionId
    });
  }

  public async logDebug(message: string, data?: any): Promise<void> {
    await this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      data: this.sanitizeData(data),
      sessionId: this.sessionId
    });
  }

  private async writeLog(entry: LogEntry): Promise<void> {
    try {
      const logLine = JSON.stringify(entry) + '\n';
      await fs.appendFile(this.logFile, logLine, 'utf8');
      
      // Console'a da yazdır (geliştirme modunda)
      if (process.env.NODE_ENV === 'development') {
        this.consoleLog(entry);
      }
      
      // Log dosyası boyutunu kontrol et
      await this.rotateLogsIfNeeded();
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  private consoleLog(entry: LogEntry): void {
    const { timestamp, level, message, data } = entry;
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage, data);
        break;
      case 'warn':
        console.warn(logMessage, data);
        break;
      case 'info':
        console.info(logMessage, data);
        break;
      case 'debug':
        console.debug(logMessage, data);
        break;
    }
  }

  private sanitizeData(data: any): any {
    if (!data) return data;

    // Hassas bilgileri temizle
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
    
    if (typeof data === 'object') {
      const sanitized = { ...data };
      
      for (const key in sanitized) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          sanitized[key] = '[REDACTED]';
        }
      }
      
      return sanitized;
    }
    
    return data;
  }

  private async rotateLogsIfNeeded(): Promise<void> {
    try {
      const stats = await fs.stat(this.logFile).catch(() => null);
      
      if (stats && stats.size > this.maxLogSize) {
        await this.rotateLogs();
      }
    } catch (error) {
      console.error('Log rotation check failed:', error);
    }
  }

  private async rotateLogs(): Promise<void> {
    try {
      // Eski log dosyalarını kaydır
      for (let i = this.maxLogFiles - 1; i > 0; i--) {
        const oldFile = path.join(this.logDir, `app.log.${i}`);
        const newFile = path.join(this.logDir, `app.log.${i + 1}`);
        
        try {
          await fs.rename(oldFile, newFile);
        } catch {
          // Dosya yoksa devam et
        }
      }
      
      // Mevcut log dosyasını .1 olarak kaydet
      const backupFile = path.join(this.logDir, 'app.log.1');
      await fs.rename(this.logFile, backupFile);
      
      // En eski log dosyasını sil
      const oldestFile = path.join(this.logDir, `app.log.${this.maxLogFiles + 1}`);
      try {
        await fs.unlink(oldestFile);
      } catch {
        // Dosya yoksa devam et
      }
      
      await this.logInfo('Log rotation completed');
    } catch (error) {
      console.error('Log rotation failed:', error);
    }
  }

  public async getLogs(lines: number = 100): Promise<LogEntry[]> {
    try {
      const content = await fs.readFile(this.logFile, 'utf8');
      const logLines = content.trim().split('\n').slice(-lines);
      
      return logLines
        .map(line => {
          try {
            return JSON.parse(line) as LogEntry;
          } catch {
            return null;
          }
        })
        .filter(entry => entry !== null) as LogEntry[];
    } catch (error) {
      console.error('Failed to read logs:', error);
      return [];
    }
  }

  public async clearLogs(): Promise<void> {
    try {
      await fs.writeFile(this.logFile, '', 'utf8');
      await this.logInfo('Logs cleared');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  public async exportLogs(exportPath: string): Promise<void> {
    try {
      const logs = await this.getLogs(1000); // Son 1000 log
      const exportData = {
        exportDate: new Date().toISOString(),
        sessionId: this.sessionId,
        appVersion: app.getVersion(),
        platform: process.platform,
        logs
      };
      
      await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2), 'utf8');
      await this.logInfo('Logs exported', { exportPath });
    } catch (error) {
      console.error('Failed to export logs:', error);
      throw error;
    }
  }

  public async getLogStats(): Promise<{
    totalEntries: number;
    errorCount: number;
    warnCount: number;
    infoCount: number;
    debugCount: number;
    fileSize: number;
    oldestEntry?: string;
    newestEntry?: string;
  }> {
    try {
      const logs = await this.getLogs(10000); // Analiz için daha fazla log
      const stats = await fs.stat(this.logFile).catch(() => ({ size: 0 }));
      
      const errorCount = logs.filter(log => log.level === 'error').length;
      const warnCount = logs.filter(log => log.level === 'warn').length;
      const infoCount = logs.filter(log => log.level === 'info').length;
      const debugCount = logs.filter(log => log.level === 'debug').length;
      
      return {
        totalEntries: logs.length,
        errorCount,
        warnCount,
        infoCount,
        debugCount,
        fileSize: stats.size,
        oldestEntry: logs[0]?.timestamp,
        newestEntry: logs[logs.length - 1]?.timestamp
      };
    } catch (error) {
      console.error('Failed to get log stats:', error);
      return {
        totalEntries: 0,
        errorCount: 0,
        warnCount: 0,
        infoCount: 0,
        debugCount: 0,
        fileSize: 0
      };
    }
  }

  public async cleanup(): Promise<void> {
    try {
      await this.logInfo('Logger cleanup started');
      // Cleanup işlemleri burada yapılabilir
      await this.logInfo('Logger cleanup completed');
    } catch (error) {
      console.error('Logger cleanup failed:', error);
    }
  }

  // Crash raporlama
  public async reportCrash(error: Error, context?: any): Promise<void> {
    const crashReport = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context: this.sanitizeData(context),
      system: {
        platform: process.platform,
        arch: process.arch,
        version: process.version,
        appVersion: app.getVersion(),
        memory: process.memoryUsage(),
        uptime: process.uptime()
      }
    };

    await this.logError('Application Crash', crashReport);
    
    // Crash dosyasını ayrı olarak kaydet
    const crashFile = path.join(this.logDir, `crash-${Date.now()}.json`);
    try {
      await fs.writeFile(crashFile, JSON.stringify(crashReport, null, 2), 'utf8');
    } catch (writeError) {
      console.error('Failed to write crash report:', writeError);
    }
  }
}
import { ErrorLogger } from '../utils/ErrorLogger';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

interface SecurityLogEntry {
    type: 'auth' | 'access' | 'suspicious' | 'error';
    severity: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    details: any;
    userId?: string;
    ip?: string;
    timestamp?: string; // Optional çünkü log() metodu içinde ekleniyor
}

export class SecurityLogger {
    private logPath: string;
    private errorLogger: ErrorLogger;
    private suspiciousActivityThreshold: number = 5; // 5 dakika içindeki şüpheli aktivite sayısı
    private suspiciousActivities: Map<string, Array<{ timestamp: number, type: string }>> = new Map();

    constructor(errorLogger: ErrorLogger) {
        this.errorLogger = errorLogger;
        this.logPath = path.join(app.getPath('userData'), 'logs', 'security');
        this.ensureLogDirectory();
    }

    private ensureLogDirectory(): void {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath, { recursive: true });
        }
    }

    private getLogFilePath(type: string): string {
        const date = new Date().toISOString().split('T')[0];
        return path.join(this.logPath, `${type}-${date}.log`);
    }

    public async log(entry: SecurityLogEntry): Promise<void> {
        try {
            const logEntry = {
                ...entry,
                timestamp: new Date().toISOString()
            };

            const logFile = this.getLogFilePath(entry.type);
            const logLine = JSON.stringify(logEntry) + '\n';

            await fs.promises.appendFile(logFile, logLine, 'utf8');

            // Kritik olayları error logger'a da gönder
            if (entry.severity === 'critical') {
                this.errorLogger.logError('Critical Security Event', logEntry);
            }

            // Şüpheli aktivite kontrolü
            if (entry.type === 'suspicious' && entry.ip) {
                this.recordSuspiciousActivity(entry.ip, entry.details?.activityType);
            }
        } catch (error) {
            this.errorLogger.logError('Security Log Error', error);
        }
    }

    public async logAuthEvent(
        userId: string,
        ip: string,
        action: 'login' | 'logout' | 'failed_login' | 'password_reset' | 'token_refresh',
        success: boolean,
        details?: any
    ): Promise<void> {
        const entry: SecurityLogEntry = {
            type: 'auth',
            severity: success ? 'info' : 'warning',
            message: `Authentication ${action} - ${success ? 'Success' : 'Failed'}`,
            details: {
                action,
                success,
                ...details
            },
            userId,
            ip
        };

        await this.log(entry);
    }

    public async logAccessEvent(
        userId: string,
        ip: string,
        resource: string,
        action: string,
        success: boolean,
        details?: any
    ): Promise<void> {
        const entry: SecurityLogEntry = {
            type: 'access',
            severity: success ? 'info' : 'warning',
            message: `Access ${action} to ${resource} - ${success ? 'Granted' : 'Denied'}`,
            details: {
                resource,
                action,
                success,
                ...details
            },
            userId,
            ip
        };

        await this.log(entry);
    }

    public async logSuspiciousActivity(
        ip: string,
        activityType: string,
        severity: 'warning' | 'error' | 'critical',
        details?: any
    ): Promise<void> {
        const entry: SecurityLogEntry = {
            type: 'suspicious',
            severity,
            message: `Suspicious Activity Detected: ${activityType}`,
            details: {
                activityType,
                ...details
            },
            ip
        };

        await this.log(entry);
    }

    private recordSuspiciousActivity(ip: string, activityType: string): void {
        const now = Date.now();
        const activities = this.suspiciousActivities.get(ip) || [];

        // Son 5 dakika içindeki aktiviteleri filtrele
        const recentActivities = activities.filter(
            activity => now - activity.timestamp < 5 * 60 * 1000
        );

        recentActivities.push({ timestamp: now, type: activityType });
        this.suspiciousActivities.set(ip, recentActivities);

        // Şüpheli aktivite eşiğini aşarsa ek önlemler al
        if (recentActivities.length >= this.suspiciousActivityThreshold) {
            this.handleExcessiveSuspiciousActivity(ip, recentActivities);
        }
    }

    private async handleExcessiveSuspiciousActivity(
        ip: string,
        activities: Array<{ timestamp: number, type: string }>
    ): Promise<void> {
        const entry: SecurityLogEntry = {
            type: 'suspicious',
            severity: 'critical',
            message: 'Excessive Suspicious Activities Detected',
            details: {
                ip,
                activityCount: activities.length,
                activities: activities.map(a => ({
                    type: a.type,
                    timestamp: new Date(a.timestamp).toISOString()
                }))
            },
            ip
        };

        await this.log(entry);

        // IP'yi geçici olarak engelle veya ek güvenlik önlemleri al
        // Bu kısım sisteminizin gereksinimlerine göre implement edilmeli
    }

    public async searchLogs(
        type: string,
        startDate: Date,
        endDate: Date,
        filters?: {
            severity?: string;
            userId?: string;
            ip?: string;
            keyword?: string;
        }
    ): Promise<SecurityLogEntry[]> {
        try {
            const logFile = this.getLogFilePath(type);
            if (!fs.existsSync(logFile)) {
                return [];
            }

            const content = await fs.promises.readFile(logFile, 'utf8');
            const lines = content.split('\n').filter(Boolean);
            const logs: SecurityLogEntry[] = lines.map(line => JSON.parse(line));

            return logs.filter(log => {
                if (!log.timestamp) return false;

                const logDate = new Date(log.timestamp);
                if (logDate < startDate || logDate > endDate) {
                    return false;
                }

                if (filters) {
                    if (filters.severity && log.severity !== filters.severity) {
                        return false;
                    }
                    if (filters.userId && log.userId !== filters.userId) {
                        return false;
                    }
                    if (filters.ip && log.ip !== filters.ip) {
                        return false;
                    }
                    if (filters.keyword && !JSON.stringify(log).includes(filters.keyword)) {
                        return false;
                    }
                }

                return true;
            });
        } catch (error) {
            this.errorLogger.logError('Log Search Error', error);
            return [];
        }
    }

    public async getSecurityMetrics(startDate: Date, endDate: Date): Promise<any> {
        try {
            const authLogs = await this.searchLogs('auth', startDate, endDate);
            const accessLogs = await this.searchLogs('access', startDate, endDate);
            const suspiciousLogs = await this.searchLogs('suspicious', startDate, endDate);

            return {
                totalAuthAttempts: authLogs.length,
                failedLogins: authLogs.filter(log =>
                    log.details.action === 'login' && !log.details.success
                ).length,
                accessDenials: accessLogs.filter(log => !log.details.success).length,
                suspiciousActivities: suspiciousLogs.length,
                topSuspiciousIPs: this.getTopIPs(suspiciousLogs),
                severityBreakdown: this.getSeverityBreakdown([
                    ...authLogs,
                    ...accessLogs,
                    ...suspiciousLogs
                ])
            };
        } catch (error) {
            this.errorLogger.logError('Security Metrics Error', error);
            return null;
        }
    }

    private getTopIPs(logs: SecurityLogEntry[]): Array<{ ip: string; count: number }> {
        const ipCounts = new Map<string, number>();

        logs.forEach(log => {
            if (log.ip) {
                ipCounts.set(log.ip, (ipCounts.get(log.ip) || 0) + 1);
            }
        });

        return Array.from(ipCounts.entries())
            .map(([ip, count]) => ({ ip, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }

    private getSeverityBreakdown(logs: SecurityLogEntry[]): Record<string, number> {
        return logs.reduce((acc, log) => {
            acc[log.severity] = (acc[log.severity] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }

    public async cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
        try {
            const files = await fs.promises.readdir(this.logPath);
            const now = Date.now();
            const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

            for (const file of files) {
                const filePath = path.join(this.logPath, file);
                const stats = await fs.promises.stat(filePath);

                if (now - stats.mtimeMs > maxAge) {
                    await fs.promises.unlink(filePath);
                }
            }
        } catch (error) {
            this.errorLogger.logError('Log Cleanup Error', error);
        }
    }
}

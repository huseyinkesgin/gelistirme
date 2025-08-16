import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ErrorLogger } from '../utils/ErrorLogger';

type StringValue = {
    toString(): string;
};

interface AuthConfig {
    jwtSecret: string;
    jwtExpiresIn: string | number;
    bcryptSaltRounds: number;
    maxLoginAttempts: number;
    loginLockoutTime: number; // milliseconds
}

interface TokenPayload {
    id: string;
    email: string;
    roles: string[];
}

interface LoginAttempt {
    ip: string;
    timestamp: number;
    success: boolean;
}

export class AuthManager {
    private config: AuthConfig = {
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
        jwtExpiresIn: 86400, // 24 saat (saniye cinsinden)
        bcryptSaltRounds: 12,
        maxLoginAttempts: 5,
        loginLockoutTime: 15 * 60 * 1000 // 15 minutes
    };

    private loginAttempts: Map<string, LoginAttempt[]> = new Map();
    private errorLogger: ErrorLogger;

    constructor(errorLogger: ErrorLogger) {
        this.errorLogger = errorLogger;
    }

    public async hashPassword(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, this.config.bcryptSaltRounds);
        } catch (error) {
            this.errorLogger.logError('Password Hash Error', error);
            throw new Error('Password hashing failed');
        }
    }

    public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            this.errorLogger.logError('Password Compare Error', error);
            throw new Error('Password comparison failed');
        }
    }

    public generateToken(payload: TokenPayload): string {
        try {
            const options = {
                // jwt.SignOptions.expiresIn accepts number or an object with toString (e.g., '24h')
                expiresIn: this.config.jwtExpiresIn,
                algorithm: 'HS256'
            } as SignOptions;
            return jwt.sign(payload, this.config.jwtSecret as jwt.Secret, options);
        } catch (error) {
            this.errorLogger.logError('Token Generation Error', error);
            throw new Error('Token generation failed');
        }
    }

    public verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, this.config.jwtSecret) as TokenPayload;
        } catch (error) {
            this.errorLogger.logError('Token Verification Error', error);
            throw new Error('Invalid token');
        }
    }

    public refreshToken(oldToken: string): string {
        try {
            const decoded = this.verifyToken(oldToken);
            const payload: TokenPayload = {
                id: decoded.id,
                email: decoded.email,
                roles: decoded.roles
            };
            return this.generateToken(payload);
        } catch (error) {
            this.errorLogger.logError('Token Refresh Error', error);
            throw new Error('Token refresh failed');
        }
    }

    public recordLoginAttempt(ip: string, success: boolean): void {
        const attempts = this.loginAttempts.get(ip) || [];
        const now = Date.now();

        // Eski giriş denemelerini temizle
        const recentAttempts = attempts.filter(
            attempt => now - attempt.timestamp < this.config.loginLockoutTime
        );

        recentAttempts.push({ ip, timestamp: now, success });
        this.loginAttempts.set(ip, recentAttempts);

        // Başarısız giriş denemesi logla
        if (!success) {
            this.errorLogger.logError('Failed Login Attempt', {
                ip,
                timestamp: new Date(now).toISOString(),
                attemptCount: recentAttempts.filter(a => !a.success).length
            });
        }
    }

    public isLoginAllowed(ip: string): boolean {
        const attempts = this.loginAttempts.get(ip) || [];
        const now = Date.now();

        // Son 15 dakika içindeki başarısız giriş denemeleri
        const recentFailedAttempts = attempts.filter(
            attempt => !attempt.success &&
                now - attempt.timestamp < this.config.loginLockoutTime
        );

        return recentFailedAttempts.length < this.config.maxLoginAttempts;
    }

    public validatePassword(password: string): boolean {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return (
            password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar
        );
    }

    public cleanupLoginAttempts(): void {
        const now = Date.now();
        for (const [ip, attempts] of this.loginAttempts.entries()) {
            // Sadece son 24 saatlik giriş denemelerini tut
            const recentAttempts = attempts.filter(
                attempt => now - attempt.timestamp < 24 * 60 * 60 * 1000
            );

            if (recentAttempts.length === 0) {
                this.loginAttempts.delete(ip);
            } else {
                this.loginAttempts.set(ip, recentAttempts);
            }
        }
    }
}

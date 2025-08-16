import { ErrorLogger } from '../utils/ErrorLogger';

interface Role {
    id: string;
    name: string;
    permissions: string[];
}

interface RolePolicy {
    resource: string;
    action: 'create' | 'read' | 'update' | 'delete' | 'manage';
    roles: string[];
}

export class RoleManager {
    private roles: Map<string, Role> = new Map();
    private policies: RolePolicy[] = [];
    private errorLogger: ErrorLogger;

    constructor(errorLogger: ErrorLogger) {
        this.errorLogger = errorLogger;
        this.initializeDefaultRoles();
        this.initializeDefaultPolicies();
    }

    private initializeDefaultRoles(): void {
        this.addRole({
            id: 'admin',
            name: 'Yönetici',
            permissions: ['*'] // Tüm izinlere sahip
        });

        this.addRole({
            id: 'manager',
            name: 'Müdür',
            permissions: [
                'user:read',
                'user:create',
                'property:manage',
                'customer:manage',
                'report:read'
            ]
        });

        this.addRole({
            id: 'agent',
            name: 'Emlak Danışmanı',
            permissions: [
                'property:read',
                'property:create',
                'customer:read',
                'customer:create',
                'appointment:manage'
            ]
        });

        this.addRole({
            id: 'user',
            name: 'Kullanıcı',
            permissions: [
                'property:read',
                'customer:read',
                'profile:manage'
            ]
        });
    }

    private initializeDefaultPolicies(): void {
        // Mülk yönetimi politikaları
        this.addPolicy({
            resource: 'property',
            action: 'create',
            roles: ['admin', 'manager', 'agent']
        });

        this.addPolicy({
            resource: 'property',
            action: 'read',
            roles: ['admin', 'manager', 'agent', 'user']
        });

        this.addPolicy({
            resource: 'property',
            action: 'update',
            roles: ['admin', 'manager', 'agent']
        });

        this.addPolicy({
            resource: 'property',
            action: 'delete',
            roles: ['admin', 'manager']
        });

        // Müşteri yönetimi politikaları
        this.addPolicy({
            resource: 'customer',
            action: 'manage',
            roles: ['admin', 'manager', 'agent']
        });

        // Rapor yönetimi politikaları
        this.addPolicy({
            resource: 'report',
            action: 'read',
            roles: ['admin', 'manager']
        });

        // Kullanıcı yönetimi politikaları
        this.addPolicy({
            resource: 'user',
            action: 'manage',
            roles: ['admin']
        });

        // Sistem yönetimi politikaları
        this.addPolicy({
            resource: 'system',
            action: 'manage',
            roles: ['admin']
        });
    }

    public addRole(role: Role): void {
        try {
            this.roles.set(role.id, role);
        } catch (error) {
            this.errorLogger.logError('Role Addition Error', error);
            throw new Error('Role addition failed');
        }
    }

    public addPolicy(policy: RolePolicy): void {
        try {
            this.policies.push(policy);
        } catch (error) {
            this.errorLogger.logError('Policy Addition Error', error);
            throw new Error('Policy addition failed');
        }
    }

    public getRole(roleId: string): Role | undefined {
        return this.roles.get(roleId);
    }

    public getRoles(): Role[] {
        return Array.from(this.roles.values());
    }

    public getPolicies(): RolePolicy[] {
        return this.policies;
    }

    public hasPermission(userRoles: string[], resource: string, action: string): boolean {
        try {
            // Admin rolü tüm izinlere sahip
            if (userRoles.includes('admin')) {
                return true;
            }

            // İlgili politikayı bul
            const policy = this.policies.find(p =>
                p.resource === resource &&
                (p.action === action || p.action === 'manage')
            );

            if (!policy) {
                return false;
            }

            // Kullanıcının rollerinden herhangi biri politikada varsa izin ver
            return userRoles.some(role => policy.roles.includes(role));
        } catch (error) {
            this.errorLogger.logError('Permission Check Error', error);
            return false;
        }
    }

    public getResourcePermissions(resource: string): RolePolicy[] {
        return this.policies.filter(p => p.resource === resource);
    }

    public getRolePermissions(roleId: string): string[] {
        const role = this.roles.get(roleId);
        return role ? role.permissions : [];
    }

    public updateRole(roleId: string, updates: Partial<Role>): void {
        try {
            const role = this.roles.get(roleId);
            if (role) {
                this.roles.set(roleId, { ...role, ...updates });
            }
        } catch (error) {
            this.errorLogger.logError('Role Update Error', error);
            throw new Error('Role update failed');
        }
    }

    public updatePolicy(index: number, updates: Partial<RolePolicy>): void {
        try {
            if (index >= 0 && index < this.policies.length) {
                this.policies[index] = { ...this.policies[index], ...updates };
            }
        } catch (error) {
            this.errorLogger.logError('Policy Update Error', error);
            throw new Error('Policy update failed');
        }
    }

    public deleteRole(roleId: string): void {
        try {
            // Admin rolünü silmeye çalışıyorsa engelle
            if (roleId === 'admin') {
                throw new Error('Cannot delete admin role');
            }
            this.roles.delete(roleId);
        } catch (error) {
            this.errorLogger.logError('Role Deletion Error', error);
            throw new Error('Role deletion failed');
        }
    }

    public deletePolicy(index: number): void {
        try {
            this.policies.splice(index, 1);
        } catch (error) {
            this.errorLogger.logError('Policy Deletion Error', error);
            throw new Error('Policy deletion failed');
        }
    }

    public validateRole(role: Role): boolean {
        return (
            typeof role.id === 'string' &&
            typeof role.name === 'string' &&
            Array.isArray(role.permissions) &&
            role.permissions.every(p => typeof p === 'string')
        );
    }

    public validatePolicy(policy: RolePolicy): boolean {
        return (
            typeof policy.resource === 'string' &&
            ['create', 'read', 'update', 'delete', 'manage'].includes(policy.action) &&
            Array.isArray(policy.roles) &&
            policy.roles.every(r => this.roles.has(r))
        );
    }
}

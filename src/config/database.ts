import knex, { Knex } from 'knex';
import { Model } from 'objection';
import knexConfig from '../../knexfile';

class DatabaseManager {
    private static instance: DatabaseManager;
    private knexInstance: Knex | null = null;

    private constructor() { }

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    public async initialize(): Promise<void> {
        try {
            const environment = process.env.NODE_ENV || 'development';
            const config = knexConfig[environment];

            if (!config) {
                throw new Error(`Veritabanı konfigürasyonu bulunamadı: ${environment}`);
            }

            this.knexInstance = knex(config);

            // Objection.js'i Knex ile bağla
            Model.knex(this.knexInstance);

            // Bağlantıyı test et
            await this.testConnection();

            console.log('✅ Veritabanı bağlantısı başarılı');
        } catch (error) {
            console.error('❌ Veritabanı bağlantı hatası:', error);
            throw error;
        }
    }

    public getKnex(): Knex {
        if (!this.knexInstance) {
            throw new Error('Veritabanı henüz başlatılmadı. initialize() metodunu çağırın.');
        }
        return this.knexInstance;
    }

    private async testConnection(): Promise<void> {
        if (!this.knexInstance) {
            throw new Error('Knex instance bulunamadı');
        }

        try {
            await this.knexInstance.raw('SELECT 1');
        } catch (error) {
            throw new Error(`Veritabanı bağlantı testi başarısız: ${error}`);
        }
    }

    public async close(): Promise<void> {
        if (this.knexInstance) {
            await this.knexInstance.destroy();
            this.knexInstance = null;
            console.log('🔌 Veritabanı bağlantısı kapatıldı');
        }
    }

    // Migration işlemleri
    public async runMigrations(): Promise<void> {
        if (!this.knexInstance) {
            throw new Error('Veritabanı henüz başlatılmadı');
        }

        try {
            const [batchNo, log] = await this.knexInstance.migrate.latest();

            if (log.length === 0) {
                console.log('📋 Çalıştırılacak yeni migration bulunamadı');
            } else {
                console.log(`📋 Migration batch ${batchNo} çalıştırıldı:`);
                log.forEach((migration: string) => console.log(`  - ${migration}`));
            }
        } catch (error) {
            console.error('❌ Migration hatası:', error);
            throw error;
        }
    }

    // Seed işlemleri
    public async runSeeds(): Promise<void> {
        if (!this.knexInstance) {
            throw new Error('Veritabanı henüz başlatılmadı');
        }

        try {
            const seedFiles = await this.knexInstance.seed.run();

            if (seedFiles[0].length === 0) {
                console.log('🌱 Çalıştırılacak seed dosyası bulunamadı');
            } else {
                console.log('🌱 Seed dosyaları çalıştırıldı:');
                seedFiles[0].forEach((seed: string) => console.log(`  - ${seed}`));
            }
        } catch (error) {
            console.error('❌ Seed hatası:', error);
            throw error;
        }
    }

    // Rollback işlemi
    public async rollbackMigration(): Promise<void> {
        if (!this.knexInstance) {
            throw new Error('Veritabanı henüz başlatılmadı');
        }

        try {
            const [batchNo, log] = await this.knexInstance.migrate.rollback();

            if (log.length === 0) {
                console.log('📋 Geri alınacak migration bulunamadı');
            } else {
                console.log(`📋 Migration batch ${batchNo} geri alındı:`);
                log.forEach((migration: string) => console.log(`  - ${migration}`));
            }
        } catch (error) {
            console.error('❌ Rollback hatası:', error);
            throw error;
        }
    }
}

export default DatabaseManager;
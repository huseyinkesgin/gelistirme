import BaseModel from '../../../src/models/BaseModel';
import { Model } from 'objection';
import knex from 'knex';

// Test için basit bir model oluştur
class TestModel extends BaseModel {
  static get tableName() {
    return 'test_models';
  }

  // Test için JSON schema validation'ını devre dışı bırak
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        ad: { type: 'string' },
        aciklama: { type: 'string' }
      }
    };
  }

  ad!: string;
  aciklama?: string;
}

describe('BaseModel', () => {
  let knexInstance: any;

  beforeAll(async () => {
    // In-memory SQLite veritabanı kullan
    knexInstance = knex({
      client: 'sqlite3',
      connection: {
        filename: ':memory:'
      },
      useNullAsDefault: true
    });

    // Objection.js'i test veritabanı ile bağla
    Model.knex(knexInstance);

    // Test tablosu oluştur
    await knexInstance.schema.createTable('test_models', (table: any) => {
      table.string('id').primary();
      table.timestamp('olusturma_tarihi').notNullable();
      table.timestamp('guncelleme_tarihi').notNullable();
      table.timestamp('silinme_tarihi').nullable();
      table.boolean('aktif_mi').notNullable().defaultTo(true);
      table.integer('siralama').notNullable().defaultTo(1);
      table.string('ad', 100).notNullable();
      table.text('aciklama').nullable();
    });
  });

  afterAll(async () => {
    await knexInstance.destroy();
  });

  beforeEach(async () => {
    // Her test öncesi tabloyu temizle
    await TestModel.query().delete();
  });

  describe('Model Oluşturma', () => {
    it('yeni model oluştururken UUID ve tarih alanları otomatik doldurulmalı', async () => {
      const model = await TestModel.query().insert({
        ad: 'Test Model'
      });

      expect(model.id).toBeDefined();
      expect(model.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(model.olusturma_tarihi).toBeInstanceOf(Date);
      expect(model.guncelleme_tarihi).toBeInstanceOf(Date);
      expect(model.aktif_mi).toBe(true);
      expect(model.siralama).toBe(1);
      expect(model.silinme_tarihi).toBeNull();
    });

    it('özel değerlerle model oluşturulabilmeli', async () => {
      const model = await TestModel.query().insert({
        ad: 'Test Model',
        aciklama: 'Test açıklaması',
        aktif_mi: false,
        siralama: 5
      });

      expect(model.ad).toBe('Test Model');
      expect(model.aciklama).toBe('Test açıklaması');
      expect(model.aktif_mi).toBe(false);
      expect(model.siralama).toBe(5);
    });
  });

  describe('Model Güncelleme', () => {
    it('model güncellenirken guncelleme_tarihi otomatik güncellenmelidir', async () => {
      const model = await TestModel.query().insert({
        ad: 'Test Model'
      });

      const ilkGuncelleme = model.guncelleme_tarihi;

      // Biraz bekle
      await new Promise(resolve => setTimeout(resolve, 10));

      const guncellenmisModel = await model.$query().patchAndFetch({
        aciklama: 'Güncellenmiş açıklama'
      });

      expect(guncellenmisModel.guncelleme_tarihi.getTime()).toBeGreaterThan(ilkGuncelleme.getTime());
      expect(guncellenmisModel.aciklama).toBe('Güncellenmiş açıklama');
    });
  });

  describe('Soft Delete', () => {
    it('softDelete() metodu silinme_tarihi alanını doldurmalı', async () => {
      const model = await TestModel.query().insert({
        ad: 'Test Model'
      });

      await model.softDelete();

      const silinmisModel = await TestModel.query().findById(model.id);
      expect(silinmisModel.silinme_tarihi).toBeInstanceOf(Date);
      expect(silinmisModel.aktif_mi).toBe(false);
    });

    it('restore() metodu silinme_tarihi alanını temizlemeli', async () => {
      const model = await TestModel.query().insert({
        ad: 'Test Model'
      });

      await model.softDelete();
      await model.restore();

      const geriYuklenmisModel = await TestModel.query().findById(model.id);
      expect(geriYuklenmisModel.silinme_tarihi).toBeNull();
      expect(geriYuklenmisModel.aktif_mi).toBe(true);
    });
  });

  describe('Query Modifiers', () => {
    beforeEach(async () => {
      // Test verileri oluştur
      await TestModel.query().insert([
        { ad: 'Aktif Model 1', aktif_mi: true },
        { ad: 'Aktif Model 2', aktif_mi: true },
        { ad: 'Pasif Model', aktif_mi: false }
      ]);

      // Bir modeli soft delete yap
      const silinecekModel = await TestModel.query().findOne({ ad: 'Aktif Model 2' });
      await silinecekModel.softDelete();
    });

    it('aktif modifier sadece aktif kayıtları getirmeli', async () => {
      const aktifModeller = await TestModel.query().modify('aktif');
      
      expect(aktifModeller).toHaveLength(1);
      expect(aktifModeller[0].ad).toBe('Aktif Model 1');
    });

    it('silinmis modifier sadece silinmiş kayıtları getirmeli', async () => {
      const silinmisModeller = await TestModel.query().modify('silinmis');
      
      expect(silinmisModeller).toHaveLength(1);
      expect(silinmisModeller[0].ad).toBe('Aktif Model 2');
    });
  });

  describe('Static Metodlar', () => {
    beforeEach(async () => {
      await TestModel.query().insert([
        { ad: 'Model 1', siralama: 1 },
        { ad: 'Model 2', siralama: 2 },
        { ad: 'Model 3', siralama: 3 }
      ]);

      // Bir modeli soft delete yap
      const silinecekModel = await TestModel.query().findOne({ ad: 'Model 2' });
      await silinecekModel.softDelete();
    });

    it('findActive() sadece aktif kayıtları getirmeli', async () => {
      const aktifModeller = await TestModel.findActive();
      
      expect(aktifModeller).toHaveLength(2);
      expect(aktifModeller.map(m => m.ad)).toEqual(['Model 1', 'Model 3']);
    });

    it('search() belirtilen alanlarda arama yapmalı', async () => {
      const sonuclar = await TestModel.search('Model 1', ['ad']);
      
      expect(sonuclar).toHaveLength(1);
      expect(sonuclar[0].ad).toBe('Model 1');
    });

    it('getStats() doğru istatistikleri döndürmeli', async () => {
      const stats = await TestModel.getStats();
      
      expect(stats.aktif).toBe(2);
      expect(stats.toplam).toBe(3);
      expect(stats.silinmis).toBe(1);
    });

    it('bulkSoftDelete() çoklu kayıtları soft delete yapmalı', async () => {
      const modeller = await TestModel.findActive();
      const ids = modeller.map(m => m.id);
      
      await TestModel.bulkSoftDelete(ids);
      
      const kalanAktifler = await TestModel.findActive();
      expect(kalanAktifler).toHaveLength(0);
    });
  });

  describe('Validation', () => {
    it('gerekli alanlar eksikse hata vermeli', async () => {
      await expect(
        TestModel.query().insert({})
      ).rejects.toThrow();
    });

    it('validator helper metodları doğru çalışmalı', () => {
      const validator = TestModel.createValidator();

      expect(() => validator.required('', 'Test Alanı')).toThrow('Test Alanı alanı zorunludur');
      expect(() => validator.required('değer', 'Test Alanı')).not.toThrow();

      expect(() => validator.email('geçersiz-email', 'E-posta')).toThrow('E-posta geçerli bir e-posta adresi olmalıdır');
      expect(() => validator.email('test@example.com', 'E-posta')).not.toThrow();

      expect(() => validator.minLength('ab', 3, 'Test Alanı')).toThrow('Test Alanı en az 3 karakter olmalıdır');
      expect(() => validator.minLength('abc', 3, 'Test Alanı')).not.toThrow();
    });
  });

  describe('JSON Formatlaması', () => {
    it('tarih alanları ISO string formatında dönmeli', async () => {
      const model = await TestModel.query().insert({
        ad: 'Test Model'
      });

      const json = model.$formatJson(model);

      expect(typeof json.olusturma_tarihi).toBe('string');
      expect(json.olusturma_tarihi).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});
import BaseModel from '../../../src/models/BaseModel';

describe('BaseModel', () => {
  describe('Temel Fonksiyonalite', () => {
    it('BaseModel sınıfı doğru şekilde tanımlanmalı', () => {
      expect(BaseModel).toBeDefined();
      expect(typeof BaseModel).toBe('function');
    });

    it('idColumn UUID olarak ayarlanmalı', () => {
      expect(BaseModel.idColumn).toBe('id');
    });

    it('jsonSchema temel alanları içermeli', () => {
      const schema = BaseModel.jsonSchema;
      expect(schema.properties).toHaveProperty('id');
      expect(schema.properties).toHaveProperty('olusturma_tarihi');
      expect(schema.properties).toHaveProperty('guncelleme_tarihi');
      expect(schema.properties).toHaveProperty('silinme_tarihi');
      expect(schema.properties).toHaveProperty('aktif_mi');
      expect(schema.properties).toHaveProperty('siralama');
    });

    it('modifiers doğru tanımlanmalı', () => {
      const modifiers = BaseModel.modifiers;
      expect(modifiers).toHaveProperty('aktif');
      expect(modifiers).toHaveProperty('silinmis');
      expect(modifiers).toHaveProperty('sirali');
      expect(modifiers).toHaveProperty('yeni');
      expect(modifiers).toHaveProperty('guncellenmis');
    });

    it('validator helper metodları çalışmalı', () => {
      const validator = BaseModel.createValidator();

      expect(() => validator.required('', 'Test Alanı')).toThrow('Test Alanı alanı zorunludur');
      expect(() => validator.required('değer', 'Test Alanı')).not.toThrow();

      expect(() => validator.email('geçersiz-email', 'E-posta')).toThrow('E-posta geçerli bir e-posta adresi olmalıdır');
      expect(() => validator.email('test@example.com', 'E-posta')).not.toThrow();

      expect(() => validator.minLength('ab', 3, 'Test Alanı')).toThrow('Test Alanı en az 3 karakter olmalıdır');
      expect(() => validator.minLength('abc', 3, 'Test Alanı')).not.toThrow();

      expect(() => validator.maxLength('abcdef', 5, 'Test Alanı')).toThrow('Test Alanı en fazla 5 karakter olmalıdır');
      expect(() => validator.maxLength('abc', 5, 'Test Alanı')).not.toThrow();
    });
  });

  describe('Instance Metodları', () => {
    let model: BaseModel;

    beforeEach(() => {
      model = new BaseModel();
    });

    it('$beforeInsert hook çalışmalı', () => {
      model.$beforeInsert();

      expect(model.id).toBeDefined();
      expect(model.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(model.olusturma_tarihi).toBeInstanceOf(Date);
      expect(model.guncelleme_tarihi).toBeInstanceOf(Date);
      expect(model.aktif_mi).toBe(true);
      expect(model.siralama).toBe(1);
    });

    it('$beforeUpdate hook çalışmalı', () => {
      const ilkTarih = new Date('2023-01-01');
      model.guncelleme_tarihi = ilkTarih;

      // Biraz bekle
      setTimeout(() => {
        model.$beforeUpdate();
        expect(model.guncelleme_tarihi.getTime()).toBeGreaterThan(ilkTarih.getTime());
      }, 10);
    });

    it('$formatJson tarih formatlaması yapmalı', () => {
      model.olusturma_tarihi = new Date('2023-01-01T10:00:00.000Z');
      model.guncelleme_tarihi = new Date('2023-01-01T11:00:00.000Z');

      const json = model.$formatJson({
        id: 'test-id',
        olusturma_tarihi: model.olusturma_tarihi,
        guncelleme_tarihi: model.guncelleme_tarihi
      });

      expect(typeof json.olusturma_tarihi).toBe('string');
      expect(json.olusturma_tarihi).toBe('2023-01-01T10:00:00.000Z');
      expect(typeof json.guncelleme_tarihi).toBe('string');
      expect(json.guncelleme_tarihi).toBe('2023-01-01T11:00:00.000Z');
    });
  });
});
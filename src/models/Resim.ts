import BaseModel from './BaseModel';

export default class Resim extends BaseModel {
  static get tableName(): string {
    return 'resimler';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['dosya_adi', 'dosya_yolu', 'resimlenebilir_id', 'resimlenebilir_type'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: ['string', 'null'], maxLength: 255 },
        aciklama: { type: ['string', 'null'] },
        dosya_adi: { type: 'string', maxLength: 255 },
        dosya_yolu: { type: 'string', maxLength: 512 },
        mime_type: { type: ['string', 'null'], maxLength: 100 },
        dosya_boyutu: { type: ['integer', 'null'], minimum: 0 },
        genislik: { type: ['integer', 'null'], minimum: 0 },
        yukseklik: { type: ['integer', 'null'], minimum: 0 },
        ana_gorsel: { type: 'boolean', default: false }, // Görev 11.3
        profil_resmi: { type: 'boolean', default: false }, // Görev 38
        resimlenebilir_id: { type: 'string', format: 'uuid' },
        resimlenebilir_type: { type: 'string', maxLength: 255 }
      }
    };
  }

  // Polimorfik ilişki için bir metod
  resimlenebilir() {
    return this.$relatedQuery(this.resimlenebilir_type, this.resimlenebilir_id);
  }
}

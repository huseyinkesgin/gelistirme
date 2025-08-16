import BaseModel from './BaseModel';

export default class Resim extends BaseModel {
  resimlenebilir_id!: string;
  resimlenebilir_type!: string;
  ad?: string;
  aciklama?: string;
  dosya_adi!: string;
  dosya_yolu!: string;
  mime_type?: string;
  dosya_boyutu?: number;
  genislik?: number;
  yukseklik?: number;
  ana_gorsel: boolean = false;
  profil_resmi: boolean = false;

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
  async resimlenebilir() {
    const ModelClass = require(`./${this.resimlenebilir_type}`).default;
    return await ModelClass.query().findById(this.resimlenebilir_id);
  }
}

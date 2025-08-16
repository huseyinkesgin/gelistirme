import BaseModel from './BaseModel';

export default class Dokuman extends BaseModel {
  dokumanlanabilir_id!: string;
  dokumanlanabilir_type!: string;
  ad?: string;
  aciklama?: string;
  dosya_adi!: string;
  dosya_yolu!: string;
  mime_type?: string;
  dosya_boyutu?: number;
  gizli_mi: boolean = false;

  static get tableName(): string {
    return 'dokumanlar';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['dosya_adi', 'dosya_yolu', 'dokumanlanabilir_id', 'dokumanlanabilir_type'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: ['string', 'null'], maxLength: 255 },
        aciklama: { type: ['string', 'null'] },
        dosya_adi: { type: 'string', maxLength: 255 },
        dosya_yolu: { type: 'string', maxLength: 512 },
        mime_type: { type: ['string', 'null'], maxLength: 100 },
        dosya_boyutu: { type: ['integer', 'null'], minimum: 0 },
        gizli_mi: { type: 'boolean', default: false }, // Görev 11.4
        dokumanlanabilir_id: { type: 'string', format: 'uuid' },
        dokumanlanabilir_type: { type: 'string', maxLength: 255 }
      }
    };
  }

  // Polimorfik ilişki için bir metod
  async dokumanlanabilir() {
    const ModelClass = require(`./${this.dokumanlanabilir_type}`).default;
    return await ModelClass.query().findById(this.dokumanlanabilir_id);
  }
}

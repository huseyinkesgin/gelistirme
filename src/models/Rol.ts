import BaseModel from './BaseModel';

export default class Rol extends BaseModel {
  rollenebilir_id!: string;
  rollenebilir_type!: string;
  ad!: string;
  aciklama?: string;
  yetkiler?: Record<string, any>;

  static get tableName(): string {
    return 'roller';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad', 'rollenebilir_id', 'rollenebilir_type'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', maxLength: 100 },
        aciklama: { type: ['string', 'null'] },
        yetkiler: { type: ['object', 'null'] }, // JSON alanı
        rollenebilir_id: { type: 'string', format: 'uuid' },
        rollenebilir_type: { type: 'string', maxLength: 255 }
      }
    };
  }

  // Polimorfik ilişki için bir metod
  async rollenebilir() {
    const ModelClass = require(`./${this.rollenebilir_type}`).default;
    return await ModelClass.query().findById(this.rollenebilir_id);
  }
}

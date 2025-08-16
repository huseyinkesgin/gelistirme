import BaseModel from './BaseModel';

export default class Rol extends BaseModel {
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
  rollenebilir() {
    return this.$relatedQuery(this.rollenebilir_type, this.rollenebilir_id);
  }
}

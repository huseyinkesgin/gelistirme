import BaseModel from './BaseModel';
import Departman from './Departman';
import Personel from './Personel';

export default class Pozisyon extends BaseModel {
  static get tableName(): string {
    return 'pozisyonlar';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad', 'departman_id'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', maxLength: 150 },
        departman_id: { type: 'string', format: 'uuid' }
      }
    };
  }

  static get relationMappings() {
    return {
      departman: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Departman,
        join: {
          from: 'pozisyonlar.departman_id',
          to: 'departmanlar.id'
        }
      },
      personel: {
        relation: BaseModel.HasManyRelation,
        modelClass: Personel,
        join: {
          from: 'pozisyonlar.id',
          to: 'personeller.pozisyon_id'
        }
      }
    };
  }
}

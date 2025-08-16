import BaseModel from './BaseModel';
import Sube from './Sube';
import Pozisyon from './Pozisyon';

export default class Departman extends BaseModel {
  static get tableName(): string {
    return 'departmanlar';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad', 'sube_id'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', maxLength: 150 },
        sube_id: { type: 'string', format: 'uuid' }
      }
    };
  }

  static get relationMappings() {
    return {
      sube: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Sube,
        join: {
          from: 'departmanlar.sube_id',
          to: 'subeler.id'
        }
      },
      pozisyonlar: {
        relation: BaseModel.HasManyRelation,
        modelClass: Pozisyon,
        join: {
          from: 'departmanlar.id',
          to: 'pozisyonlar.departman_id'
        }
      }
    };
  }
}

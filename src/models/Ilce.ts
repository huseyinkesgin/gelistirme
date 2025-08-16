import BaseModel from './BaseModel';
import Sehir from './Sehir';
import Semt from './Semt';

export default class Ilce extends BaseModel {
  static get tableName(): string {
    return 'ilceler';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad', 'sehir_id'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', maxLength: 100 },
        sehir_id: { type: 'string', format: 'uuid' }
      }
    };
  }

  static get relationMappings() {
    return {
      sehir: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Sehir,
        join: {
          from: 'ilceler.sehir_id',
          to: 'sehirler.id'
        }
      },
      semtler: {
        relation: BaseModel.HasManyRelation,
        modelClass: Semt,
        join: {
          from: 'ilceler.id',
          to: 'semtler.ilce_id'
        }
      }
    };
  }
}

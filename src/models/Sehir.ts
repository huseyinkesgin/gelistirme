import BaseModel from './BaseModel';
import Ilce from './Ilce';

export default class Sehir extends BaseModel {
  static get tableName(): string {
    return 'sehirler';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad', 'plaka_kodu'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', maxLength: 100 },
        plaka_kodu: { type: 'string', maxLength: 2 }
      }
    };
  }

  static get relationMappings() {
    return {
      ilceler: {
        relation: BaseModel.HasManyRelation,
        modelClass: Ilce,
        join: {
          from: 'sehirler.id',
          to: 'ilceler.sehir_id'
        }
      }
    };
  }
}

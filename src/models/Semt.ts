import BaseModel from './BaseModel';
import Ilce from './Ilce';
import Mahalle from './Mahalle';

export default class Semt extends BaseModel {
  static get tableName(): string {
    return 'semtler';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad', 'ilce_id'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', maxLength: 100 },
        ilce_id: { type: 'string', format: 'uuid' }
      }
    };
  }

  static get relationMappings() {
    return {
      ilce: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Ilce,
        join: {
          from: 'semtler.ilce_id',
          to: 'ilceler.id'
        }
      },
      mahalleler: {
        relation: BaseModel.HasManyRelation,
        modelClass: Mahalle,
        join: {
          from: 'semtler.id',
          to: 'mahalleler.semt_id'
        }
      }
    };
  }
}

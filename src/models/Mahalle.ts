import BaseModel from './BaseModel';
import Semt from './Semt';

export default class Mahalle extends BaseModel {
  static get tableName(): string {
    return 'mahalleler';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad', 'semt_id'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', maxLength: 100 },
        semt_id: { type: 'string', format: 'uuid' },
        posta_kodu: { type: ['string', 'null'], maxLength: 5 },
        koordinat_x: { type: ['number', 'null'] },
        koordinat_y: { type: ['number', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      semt: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Semt,
        join: {
          from: 'mahalleler.semt_id',
          to: 'semtler.id'
        }
      }
    };
  }
}

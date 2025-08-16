import BaseModel from './BaseModel';
import Adres from './Adres';
import Departman from './Departman';

export default class Sube extends BaseModel {
  static get tableName(): string {
    return 'subeler';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', maxLength: 150 },
        kod: { type: ['string', 'null'], maxLength: 50 }
      }
    };
  }

  static get relationMappings() {
    return {
      adres: {
        relation: BaseModel.HasOneRelation,
        modelClass: Adres,
        join: {
          from: 'subeler.id',
          to: 'adresler.adreslenebilir_id'
        },
        filter: { adreslenebilir_type: 'Sube' }
      },
      departmanlar: {
        relation: BaseModel.HasManyRelation,
        modelClass: Departman,
        join: {
          from: 'subeler.id',
          to: 'departmanlar.sube_id'
        }
      }
    };
  }
}

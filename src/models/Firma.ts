import { Model } from 'objection';
import BaseModel from './BaseModel';
import Adres from './Adres';
import Telefon from './Telefon';
import { FirmaTipiEnum } from '../enums/FirmaTipiEnum';

export default class Firma extends BaseModel {
  static get tableName(): string {
    return 'firmalar';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad', 'firmalanabilir_id', 'firmalanabilir_type'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', maxLength: 200 },
        vergi_no: { type: ['string', 'null'], maxLength: 20 },
        vergi_dairesi: { type: ['string', 'null'], maxLength: 100 },
        tip: { type: 'string', enum: Object.values(FirmaTipiEnum) },
        sektor: { type: ['string', 'null'], maxLength: 100 },
        firmalanabilir_id: { type: 'string', format: 'uuid' },
        firmalanabilir_type: { type: 'string', maxLength: 255 }
      }
    };
  }

  static get relationMappings() {
    return {
      adresler: {
        relation: Model.MorphManyRelation,
        modelClass: Adres,
        join: {
          from: 'firmalar.id',
          to: 'adresler.adreslenebilir_id'
        },
        filter: { adreslenebilir_type: 'Firma' }
      },
      telefonlar: {
        relation: Model.MorphManyRelation,
        modelClass: Telefon,
        join: {
          from: 'firmalar.id',
          to: 'telefonlar.telefonlanabilir_id'
        },
        filter: { telefonlanabilir_type: 'Firma' }
      }
    };
  }
}
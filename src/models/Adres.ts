import BaseModel from './BaseModel';
import Sehir from './Sehir';
import Ilce from './Ilce';
import Semt from './Semt';
import Mahalle from './Mahalle';
import { AdresTipiEnum } from '../enums/AdresTipiEnum';

export default class Adres extends BaseModel {
  static get tableName(): string {
    return 'adresler';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['adres_tipi', 'adres_satiri_1', 'adreslenebilir_id', 'adreslenebilir_type'],
      properties: {
        ...super.jsonSchema.properties,
        adres_tipi: { type: 'string', enum: Object.values(AdresTipiEnum) },
        varsayilan_mi: { type: 'boolean', default: false },
        baslik: { type: ['string', 'null'], maxLength: 255 },
        adres_satiri_1: { type: 'string', maxLength: 255 },
        adres_satiri_2: { type: ['string', 'null'], maxLength: 255 },
        mahalle_id: { type: ['string', 'null'], format: 'uuid' },
        semt_id: { type: ['string', 'null'], format: 'uuid' },
        ilce_id: { type: ['string', 'null'], format: 'uuid' },
        sehir_id: { type: ['string', 'null'], format: 'uuid' },
        posta_kodu: { type: ['string', 'null'], maxLength: 5 },
        adreslenebilir_id: { type: 'string', format: 'uuid' },
        adreslenebilir_type: { type: 'string', maxLength: 255 }
      }
    };
  }

  static get relationMappings() {
    return {
      sehir: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Sehir,
        join: {
          from: 'adresler.sehir_id',
          to: 'sehirler.id'
        }
      },
      ilce: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Ilce,
        join: {
          from: 'adresler.ilce_id',
          to: 'ilceler.id'
        }
      },
      semt: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Semt,
        join: {
          from: 'adresler.semt_id',
          to: 'semtler.id'
        }
      },
      mahalle: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Mahalle,
        join: {
          from: 'adresler.mahalle_id',
          to: 'mahalleler.id'
        }
      }
    };
  }

  // Polimorfik ilişki için bir metod
  adreslenebilir() {
    return this.$relatedQuery(this.adreslenebilir_type, this.adreslenebilir_id);
  }
}
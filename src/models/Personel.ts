import BaseModel from './BaseModel';
import Departman from './Departman';
import Kisi from './Kisi';
import Pozisyon from './Pozisyon';

export default class Personel extends BaseModel {
  static get tableName(): string {
    return 'personeller';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['kisi_id', 'pozisyon_id', 'ise_baslama_tarihi'],
      properties: {
        ...super.jsonSchema.properties,
        kisi_id: { type: 'string', format: 'uuid' },
        pozisyon_id: { type: 'string', format: 'uuid' },
        departman_id: { type: 'string', format: 'uuid' },
        ise_baslama_tarihi: { type: 'string', format: 'date' },
        isten_ayrilma_tarihi: { type: ['string', 'null'], format: 'date' },
        maas: { type: ['number', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      kisi: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Kisi,
        join: {
          from: 'personeller.kisi_id',
          to: 'kisiler.id'
        }
      },
      pozisyon: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Pozisyon,
        join: {
          from: 'personeller.pozisyon_id',
          to: 'pozisyonlar.id'
        }
      },
      departman: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Departman,
        join: {
          from: 'personeller.departman_id',
          to: 'departmanlar.id'
        }
      }
    };
  }
}

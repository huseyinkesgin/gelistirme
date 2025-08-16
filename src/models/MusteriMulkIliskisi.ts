import BaseModel from './BaseModel';
import Musteri from './Musteri';
import Mulk from './Mulk';

export enum IlgiDurumuEnum {
  ILGILENIYOR = 'ilgileniyor',
  TEKLIF_VERDI = 'teklif_verdi',
  GEZDI_GORDU = 'gezdi_gordu',
  VAZGECTI = 'vazgecti',
  SATIN_ALDI = 'satin_aldi',
  KIRALADI = 'kiraladi'
}

export default class MusteriMulkIliskisi extends BaseModel {
  static get tableName(): string {
    return 'musteri_mulk_iliskileri';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['musteri_id', 'mulk_id'],
      properties: {
        ...super.jsonSchema.properties,
        musteri_id: { type: 'string', format: 'uuid' },
        mulk_id: { type: 'string', format: 'uuid' },
        ilgi_durumu: { type: 'string', enum: Object.values(IlgiDurumuEnum) },
        teklif_fiyati: { type: ['number', 'null'] },
        notlar: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      musteri: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Musteri,
        join: {
          from: 'musteri_mulk_iliskileri.musteri_id',
          to: 'musteriler.id'
        }
      },
      mulk: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Mulk,
        join: {
          from: 'musteri_mulk_iliskileri.mulk_id',
          to: 'mulkler.id'
        }
      }
    };
  }
}

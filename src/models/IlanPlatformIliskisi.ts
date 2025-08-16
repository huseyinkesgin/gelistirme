import BaseModel from './BaseModel';
import Ilan from './Ilan';
import IlanPlatformu from './IlanPlatformu';

export enum IlanPlatformDurumuEnum {
  YAYINDA = 'yayinda',
  BEKLEMEDE = 'beklemede',
  HATA = 'hata',
  KALDIRILDI = 'kaldirildi'
}

export default class IlanPlatformIliskisi extends BaseModel {
  static get tableName(): string {
    return 'ilan_platform_iliskileri';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ilan_id', 'platform_id'],
      properties: {
        ...super.jsonSchema.properties,
        ilan_id: { type: 'string', format: 'uuid' },
        platform_id: { type: 'string', format: 'uuid' },
        platform_ilan_id: { type: ['string', 'null'], maxLength: 255 },
        yayin_url: { type: ['string', 'null'], maxLength: 512 },
        durum: { type: 'string', enum: Object.values(IlanPlatformDurumuEnum), default: IlanPlatformDurumuEnum.BEKLEMEDE },
        hata_mesaji: { type: ['string', 'null'] },
        son_guncelleme_platformdan: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      ilan: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Ilan,
        join: {
          from: 'ilan_platform_iliskileri.ilan_id',
          to: 'ilanlar.id'
        }
      },
      platform: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: IlanPlatformu,
        join: {
          from: 'ilan_platform_iliskileri.platform_id',
          to: 'ilan_platformlari.id'
        }
      }
    };
  }
}

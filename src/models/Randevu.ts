import BaseModel from './BaseModel';
import Musteri from './Musteri';
import Personel from './Personel';
import Mulk from './Mulk';

export enum RandevuDurumuEnum {
  PLANLANDI = 'planlandi',
  TAMAMLANDI = 'tamamlandi',
  IPTAL_EDILDI = 'iptal_edildi',
  ERTELENDI = 'ertelendi'
}

export default class Randevu extends BaseModel {
  static get tableName(): string {
    return 'randevular';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['baslik', 'baslangic_tarihi', 'bitis_tarihi'],
      properties: {
        ...super.jsonSchema.properties,
        baslik: { type: 'string', maxLength: 255 },
        aciklama: { type: ['string', 'null'] },
        baslangic_tarihi: { type: 'string', format: 'date-time' },
        bitis_tarihi: { type: 'string', format: 'date-time' },
        durum: { type: 'string', enum: Object.values(RandevuDurumuEnum), default: RandevuDurumuEnum.PLANLANDI },
        lokasyon: { type: ['string', 'null'] }, // For custom locations
        mulk_id: { type: ['string', 'null'], format: 'uuid' } // Optional, can be a general appointment
      }
    };
  }

  static get relationMappings() {
    return {
      mulk: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Mulk,
        join: {
          from: 'randevular.mulk_id',
          to: 'mulkler.id'
        }
      },
      // An appointment can have multiple customers and personnel
      musteriler: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Musteri,
        join: {
          from: 'randevular.id',
          through: {
            from: 'randevu_katilimcilari.randevu_id',
            to: 'randevu_katilimcilari.katilimci_id',
            extra: ['katilimci_type']
          },
          to: 'musteriler.id'
        },
        filter: (query: any) => query.where('katilimci_type', 'Musteri')
      },
      personel: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Personel,
        join: {
          from: 'randevular.id',
          through: {
            from: 'randevu_katilimcilari.randevu_id',
            to: 'randevu_katilimcilari.katilimci_id',
            extra: ['katilimci_type']
          },
          to: 'personeller.id'
        },
        filter: (query: any) => query.where('katilimci_type', 'Personel')
      }
    };
  }
}

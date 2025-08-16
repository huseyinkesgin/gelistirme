import BaseModel from './BaseModel';
import Kisi from './Kisi';
import MusteriTalep from './MusteriTalep';

export enum MusteriTipiEnum {
  ALICI = 'alici',
  SATICI = 'satici',
  KIRACI = 'kiraci',
  KIRAYA_VEREN = 'kiraya_veren',
  HEPSI = 'hepsi'
}

export enum MusteriKaynagiEnum {
  REFERANS = 'referans',
  WEBSITE = 'website',
  SAHIBINDEN = 'sahibinden',
  HEPSIEMLAK = 'hepsiemlak',
  SOSYAL_MEDYA = 'sosyal_medya',
  DIGER = 'diger'
}

export default class Musteri extends BaseModel {
  static get tableName(): string {
    return 'musteriler';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['kisi_id'],
      properties: {
        ...super.jsonSchema.properties,
        kisi_id: { type: 'string', format: 'uuid' },
        musteri_tipi: { type: 'string', enum: Object.values(MusteriTipiEnum) },
        kaynak: { type: 'string', enum: Object.values(MusteriKaynagiEnum) },
        puan: { type: ['integer', 'null'], minimum: 1, maximum: 5 },
        aciklama: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      kisi: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Kisi,
        join: {
          from: 'musteriler.kisi_id',
          to: 'kisiler.id'
        }
      },
      talepler: {
        relation: BaseModel.HasManyRelation,
        modelClass: MusteriTalep,
        join: {
          from: 'musteriler.id',
          to: 'musteri_talepleri.musteri_id'
        }
      }
    };
  }
}

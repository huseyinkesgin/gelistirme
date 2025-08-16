import BaseModel from './BaseModel';
import Mulk from './Mulk';
import Kullanici from './Kullanici';
import IlanPlatformIliskisi from './IlanPlatformIliskisi';

export enum IlanDurumuEnum {
  YAYINDA = 'yayinda',
  YAYINDA_DEGIL = 'yayinda_degil',
  BEKLEMEDE = 'beklemede',
  REDDEDILDI = 'reddedildi',
  SATILDI = 'satildi',
  KIRALANDI = 'kiralandi'
}

export default class Ilan extends BaseModel {
  mulk_id!: string;
  olusturan_kullanici_id!: string;
  ilan_no?: string;
  baslik!: string;
  aciklama?: string;
  durum: string = IlanDurumuEnum.BEKLEMEDE;
  yayin_tarihi?: Date;
  bitis_tarihi?: Date;
  seo_baslik?: string;
  seo_aciklama?: string;

  static get tableName(): string {
    return 'ilanlar';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['baslik', 'mulk_id', 'olusturan_kullanici_id'],
      properties: {
        ...super.jsonSchema.properties,
        mulk_id: { type: 'string', format: 'uuid' },
        olusturan_kullanici_id: { type: 'string', format: 'uuid' },
        ilan_no: { type: 'string', maxLength: 20 },
        baslik: { type: 'string', maxLength: 255 },
        aciklama: { type: ['string', 'null'] },
        durum: { type: 'string', enum: Object.values(IlanDurumuEnum), default: IlanDurumuEnum.BEKLEMEDE },
        yayin_tarihi: { type: ['string', 'null'], format: 'date-time' },
        bitis_tarihi: { type: ['string', 'null'], format: 'date-time' },
        seo_baslik: { type: ['string', 'null'], maxLength: 255 },
        seo_aciklama: { type: ['string', 'null'] }
      }
    };
  }

  $beforeInsert() {
    super.$beforeInsert();
    if (!this.ilan_no) {
      this.ilan_no = this.generateIlanNo();
    }
  }

  generateIlanNo(): string {
    const prefix = 'ILN';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  static get relationMappings() {
    return {
      mulk: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Mulk,
        join: {
          from: 'ilanlar.mulk_id',
          to: 'mulkler.id'
        }
      },
      olusturanKullanici: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Kullanici,
        join: {
          from: 'ilanlar.olusturan_kullanici_id',
          to: 'kullanicilar.id'
        }
      },
      platformlar: {
        relation: BaseModel.HasManyRelation,
        modelClass: IlanPlatformIliskisi,
        join: {
          from: 'ilanlar.id',
          to: 'ilan_platform_iliskileri.ilan_id'
        }
      }
    };
  }
}

import { Model } from 'objection';
import BaseModel from './BaseModel';
import Adres from './Adres';
import Telefon from './Telefon';
import Resim from './Resim';
import Not from './Not';
import Firma from './Firma';
import Kullanici from './Kullanici';
import { CinsiyetEnum } from '../enums/CinsiyetEnum';
import { MedeniDurumEnum } from '../enums/MedeniDurumEnum';

export default class Kisi extends BaseModel {
  static get tableName(): string {
    return 'kisiler';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad', 'soyad'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', minLength: 1, maxLength: 100 },
        soyad: { type: 'string', minLength: 1, maxLength: 100 },
        tc_kimlik_no: { type: ['string', 'null'], pattern: '^[0-9]{11}$' },
        dogum_tarihi: { type: ['string', 'null'], format: 'date' },
        cinsiyet: { type: 'string', enum: Object.values(CinsiyetEnum) },
        dogum_yeri: { type: ['string', 'null'], maxLength: 100 },
        email: { type: ['string', 'null'], format: 'email' },
        medeni_durum: { type: 'string', enum: Object.values(MedeniDurumEnum) }
      }
    };
  }

  static get relationMappings() {
    return {
      kullanici: {
        relation: Model.HasOneRelation,
        modelClass: Kullanici,
        join: {
          from: 'kisiler.id',
          to: 'kullanicilar.kisi_id'
        }
      },
      adresler: {
        relation: Model.HasManyRelation,
        modelClass: Adres,
        join: {
          from: 'kisiler.id',
          to: 'adresler.adreslenebilir_id'
        },
        filter: { adreslenebilir_type: 'Kisi' }
      },
      telefonlar: {
        relation: Model.HasManyRelation,
        modelClass: Telefon,
        join: {
          from: 'kisiler.id',
          to: 'telefonlar.telefonlanabilir_id'
        },
        filter: { telefonlanabilir_type: 'Kisi' }
      },
      profilResmi: {
        relation: Model.HasOneRelation,
        modelClass: Resim,
        join: {
          from: 'kisiler.id',
          to: 'resimler.resimlenebilir_id'
        },
        filter: { resimlenebilir_type: 'Kisi', profil_resmi: true }
      },
      notlar: {
        relation: Model.HasManyRelation,
        modelClass: Not,
        join: {
          from: 'kisiler.id',
          to: 'notlar.notlanabilir_id'
        },
        filter: { notlanabilir_type: 'Kisi' }
      },
      firmalar: {
        relation: Model.HasManyRelation,
        modelClass: Firma,
        join: {
          from: 'kisiler.id',
          to: 'firmalar.firmalanabilir_id'
        },
        filter: { firmalanabilir_type: 'Kisi' }
      }
    };
  }
}

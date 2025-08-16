import { Model } from 'objection';
import BaseModel from './BaseModel';
import Kisi from './Kisi';
import Rol from './Rol';

export default class Kullanici extends BaseModel {
  static get tableName(): string {
    return 'kullanicilar';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['kullanici_adi', 'sifre'],
      properties: {
        ...super.jsonSchema.properties,
        kisi_id: { type: ['string', 'null'], format: 'uuid' },
        kullanici_adi: { type: 'string', maxLength: 100 },
        sifre: { type: 'string', maxLength: 255 },
        son_giris_tarihi: { type: ['string', 'null'], format: 'date-time' },
        son_giris_ip: { type: ['string', 'null'], maxLength: 45 }
      }
    };
  }

  static get relationMappings() {
    return {
      kisi: {
        relation: Model.BelongsToOneRelation,
        modelClass: Kisi,
        join: {
          from: 'kullanicilar.kisi_id',
          to: 'kisiler.id'
        }
      },
      roller: {
        relation: Model.MorphManyRelation,
        modelClass: Rol,
        join: {
          from: 'kullanicilar.id',
          to: 'roller.rollenebilir_id'
        },
        filter: { rollenebilir_type: 'Kullanici' }
      }
    };
  }

  // Şifreyi JSON çıktısından gizle
  $formatJson(json: any) {
    json = super.$formatJson(json);
    delete json.sifre;
    return json;
  }
}

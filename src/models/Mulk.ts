import BaseModel from './BaseModel';
import Kisi from './Kisi';
import Adres from './Adres';
import Resim from './Resim';
import Dokuman from './Dokuman';
import Not from './Not';
import Kategori from './Kategori';

export default class Mulk extends BaseModel {
  portfoy_no?: string;

  static get tableName(): string {
    return 'mulkler';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['baslik'],
      properties: {
        ...super.jsonSchema.properties,
        sahip_id: { type: ['string', 'null'], format: 'uuid' },
        portfoy_no: { type: 'string', maxLength: 20 },
        baslik: { type: 'string', maxLength: 255 },
        aciklama: { type: ['string', 'null'] },
        fiyat: { type: ['number', 'null'] },
        para_birimi: { type: 'string', maxLength: 3, default: 'TRY' },
        metrekare_brut: { type: ['number', 'null'] },
        metrekare_net: { type: ['number', 'null'] },
        oda_sayisi: { type: ['string', 'null'], maxLength: 20 }, // 2+1, 3+1 etc.
        banyo_sayisi: { type: ['integer', 'null'] },
        kat: { type: ['integer', 'null'] },
        bina_yasi: { type: ['integer', 'null'] },
        dinamik_ozellikler: { type: ['object', 'null'] } // JSON field for dynamic attributes
      }
    };
  }

  $beforeInsert() {
    super.$beforeInsert();
    if (!this.portfoy_no) {
      this.portfoy_no = this.generatePortfoyNo();
    }
  }

  generatePortfoyNo(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `PF-${year}-${random}`;
  }

  static get relationMappings() {
    return {
      sahip: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Kisi,
        join: {
          from: 'mulkler.sahip_id',
          to: 'kisiler.id'
        }
      },
      kategoriler: {
        relation: BaseModel.HasManyRelation,
        modelClass: Kategori,
        join: {
          from: 'mulkler.id',
          to: 'kategoriler.kategorilenebilir_id'
        },
        filter: { kategorilenebilir_type: 'Mulk' }
      },
      adres: {
        relation: BaseModel.HasOneRelation,
        modelClass: Adres,
        join: {
          from: 'mulkler.id',
          to: 'adresler.adreslenebilir_id'
        },
        filter: { adreslenebilir_type: 'Mulk' }
      },
      resimler: {
        relation: BaseModel.HasManyRelation,
        modelClass: Resim,
        join: {
          from: 'mulkler.id',
          to: 'resimler.resimlenebilir_id'
        },
        filter: { resimlenebilir_type: 'Mulk' }
      },
      dokumanlar: {
        relation: BaseModel.HasManyRelation,
        modelClass: Dokuman,
        join: {
          from: 'mulkler.id',
          to: 'dokumanlar.dokumanlanabilir_id'
        },
        filter: { dokumanlanabilir_type: 'Mulk' }
      },
      notlar: {
        relation: BaseModel.HasManyRelation,
        modelClass: Not,
        join: {
          from: 'mulkler.id',
          to: 'notlar.notlanabilir_id'
        },
        filter: { notlanabilir_type: 'Mulk' }
      }
    }
  }
}

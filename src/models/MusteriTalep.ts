import BaseModel from './BaseModel';
import Musteri from './Musteri';

export default class MusteriTalep extends BaseModel {
  static get tableName(): string {
    return 'musteri_talepleri';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['musteri_id'],
      properties: {
        ...super.jsonSchema.properties,
        musteri_id: { type: 'string', format: 'uuid' },
        aciklama: { type: ['string', 'null'] },
        butce_min: { type: ['number', 'null'] },
        butce_max: { type: ['number', 'null'] },
        lokasyon_aciklamasi: { type: ['string', 'null'] }, // For storing text-based location preferences
        ozellikler: { type: ['object', 'null'] } // JSON for storing dynamic property requirements
      }
    };
  }

  static get relationMappings() {
    return {
      musteri: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Musteri,
        join: {
          from: 'musteri_talepleri.musteri_id',
          to: 'musteriler.id'
        }
      }
    };
  }
}

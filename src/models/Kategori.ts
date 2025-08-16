import BaseModel from './BaseModel';

export default class Kategori extends BaseModel {
  kategorilenebilir_id?: string;
  kategorilenebilir_type!: string;
  ad!: string;
  aciklama?: string;
  ust_kategori_id?: string;
  seviye: number = 1;

  static get tableName(): string {
    return 'kategoriler';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad', 'kategorilenebilir_type'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', maxLength: 100 },
        aciklama: { type: ['string', 'null'] },
        ust_kategori_id: { type: ['string', 'null'], format: 'uuid' },
        seviye: { type: 'integer', default: 1 },
        kategorilenebilir_id: { type: ['string', 'null'], format: 'uuid' }, // Null olabilir, genel kategoriler için
        kategorilenebilir_type: { type: 'string', maxLength: 255 }
      }
    };
  }

  static get relationMappings() {
    return {
      ustKategori: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Kategori,
        join: {
          from: 'kategoriler.ust_kategori_id',
          to: 'kategoriler.id'
        }
      },
      altKategoriler: {
        relation: BaseModel.HasManyRelation,
        modelClass: Kategori,
        join: {
          from: 'kategoriler.id',
          to: 'kategoriler.ust_kategori_id'
        }
      }
    };
  }

  // Polimorfik ilişki için bir metod
  async kategorilenebilir() {
    if (!this.kategorilenebilir_type || !this.kategorilenebilir_id) return null;
    const ModelClass = require(`./${this.kategorilenebilir_type}`).default;
    return await ModelClass.query().findById(this.kategorilenebilir_id);
  }
}

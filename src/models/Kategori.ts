import BaseModel from './BaseModel';

export default class Kategori extends BaseModel {
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
  kategorilenebilir() {
    if (!this.kategorilenebilir_type || !this.kategorilenebilir_id) return null;
    return this.$relatedQuery(this.kategorilenebilir_type, this.kategorilenebilir_id);
  }
}

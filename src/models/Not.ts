import BaseModel from './BaseModel';
import { NotTipiEnum } from '../enums/NotTipiEnum';

export default class Not extends BaseModel {
  static get tableName(): string {
    return 'notlar';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['icerik', 'notlanabilir_id', 'notlanabilir_type'],
      properties: {
        ...super.jsonSchema.properties,
        baslik: { type: ['string', 'null'], maxLength: 200 },
        icerik: { type: 'string' },
        tip: { type: 'string', enum: Object.values(NotTipiEnum), default: NotTipiEnum.GENEL },
        renk: { type: ['string', 'null'], maxLength: 7 }, // Hex color, e.g., '#FF5733'
        notlanabilir_id: { type: 'string', format: 'uuid' },
        notlanabilir_type: { type: 'string', maxLength: 255 }
      }
    };
  }

  // Polimorfik ilişki için bir metod
  notlanabilir() {
    return this.$relatedQuery(this.notlanabilir_type, this.notlanabilir_id);
  }
}
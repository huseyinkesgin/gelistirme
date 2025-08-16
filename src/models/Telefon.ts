import BaseModel from './BaseModel';
import { TelefonTipiEnum } from '../enums/TelefonTipiEnum';

export default class Telefon extends BaseModel {
  static get tableName(): string {
    return 'telefonlar';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['numara', 'tip', 'telefonlanabilir_id', 'telefonlanabilir_type'],
      properties: {
        ...super.jsonSchema.properties,
        tip: { type: 'string', enum: Object.values(TelefonTipiEnum) },
        varsayilan_mi: { type: 'boolean', default: false },
        numara: { type: 'string', maxLength: 20 },
        aciklama: { type: ['string', 'null'], maxLength: 255 },
        telefonlanabilir_id: { type: 'string', format: 'uuid' },
        telefonlanabilir_type: { type: 'string', maxLength: 255 }
      }
    };
  }

  // Polimorfik ilişki için bir metod
  telefonlanabilir() {
    return this.$relatedQuery(this.telefonlanabilir_type, this.telefonlanabilir_id);
  }
}
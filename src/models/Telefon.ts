import BaseModel from './BaseModel';
import { TelefonTipiEnum } from '../enums/TelefonTipiEnum';

export default class Telefon extends BaseModel {
  telefonlanabilir_id!: string;
  telefonlanabilir_type!: string;
  numara!: string;
  tip!: string;
  varsayilan_mi?: boolean;
  aciklama?: string;

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
  async telefonlanabilir() {
    const ModelClass = require(`./${this.telefonlanabilir_type}`).default;
    return await ModelClass.query().findById(this.telefonlanabilir_id);
  }
}
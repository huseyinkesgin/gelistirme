import BaseModel from './BaseModel';

export default class RandevuKatilimcisi extends BaseModel {
  static get tableName(): string {
    return 'randevu_katilimcilari';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['randevu_id', 'katilimci_id', 'katilimci_type'],
      properties: {
        ...super.jsonSchema.properties,
        randevu_id: { type: 'string', format: 'uuid' },
        katilimci_id: { type: 'string', format: 'uuid' },
        katilimci_type: { type: 'string', enum: ['Musteri', 'Personel'] }
      }
    };
  }

  // No relations needed here usually, as it's a pivot model.
  // The relations are defined on the Randevu model.
}

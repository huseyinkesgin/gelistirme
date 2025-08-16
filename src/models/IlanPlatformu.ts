import BaseModel from './BaseModel';

export default class IlanPlatformu extends BaseModel {
  static get tableName(): string {
    return 'ilan_platformlari';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ad'],
      properties: {
        ...super.jsonSchema.properties,
        ad: { type: 'string', maxLength: 100 },
        logo_url: { type: ['string', 'null'], maxLength: 512 },
        api_bilgileri: { type: ['object', 'null'] } // JSON for API keys, etc.
      }
    };
  }
}

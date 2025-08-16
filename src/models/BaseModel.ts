import { Model, ModelClass, QueryBuilder, Page, Validator } from 'objection';
import { v4 as uuidv4 } from 'uuid';

export interface BaseEntity {
  id: string;
  olusturma_tarihi: Date;
  guncelleme_tarihi: Date;
  silinme_tarihi?: Date | null;
  aktif_mi: boolean;
  siralama: number;
}

export default class BaseModel extends Model implements BaseEntity {
  id!: string;
  olusturma_tarihi!: Date;
  guncelleme_tarihi!: Date;
  silinme_tarihi?: Date | null;
  aktif_mi!: boolean;
  siralama!: number;

  // ID sütunu UUID olarak ayarla
  static get idColumn(): string {
    return 'id';
  }

  // JSON şeması - tüm modeller için ortak alanlar
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        olusturma_tarihi: { type: 'string', format: 'date-time' },
        guncelleme_tarihi: { type: 'string', format: 'date-time' },
        silinme_tarihi: { type: ['string', 'null'], format: 'date-time' },
        aktif_mi: { type: 'boolean', default: true },
        siralama: { type: 'integer', default: 1, minimum: 1 }
      }
    };
  }

  // Insert öncesi çalışacak hook
  $beforeInsert(): void {
    this.id = uuidv4();
    this.olusturma_tarihi = new Date();
    this.guncelleme_tarihi = new Date();
    this.aktif_mi = this.aktif_mi !== undefined ? this.aktif_mi : true;
    this.siralama = this.siralama || 1;
  }

  // Update öncesi çalışacak hook
  $beforeUpdate(): void {
    this.guncelleme_tarihi = new Date();
  }

  // Query modifier'ları - soft delete desteği
  static get modifiers() {
    return {
      // Sadece aktif kayıtları getir (silinmemiş)
      aktif: (query: QueryBuilder<BaseModel>) => {
        query.whereNull('silinme_tarihi');
      },

      // Sadece silinmiş kayıtları getir
      silinmis: (query: QueryBuilder<BaseModel>) => {
        query.whereNotNull('silinme_tarihi');
      },

      // Sıralamaya göre sırala
      sirali: (query: QueryBuilder<BaseModel>) => {
        query.orderBy('siralama', 'asc');
      },

      // En son oluşturulanlar önce
      yeni: (query: QueryBuilder<BaseModel>) => {
        query.orderBy('olusturma_tarihi', 'desc');
      },

      // En son güncellenmiş önce
      guncellenmis: (query: QueryBuilder<BaseModel>) => {
        query.orderBy('guncelleme_tarihi', 'desc');
      }
    };
  }

  // Soft delete işlemi
  async softDelete(): Promise<number> {
    return await this.$query().patch({
      silinme_tarihi: new Date(),
      aktif_mi: false
    });
  }

  // Soft delete'i geri al
  async restore(): Promise<number> {
    return await this.$query().patch({
      silinme_tarihi: null,
      aktif_mi: true
    });
  }

  // Hard delete (gerçek silme)
  async forceDelete(): Promise<number> {
    return await this.$query().delete();
  }

  // Aktif/pasif durumu değiştir
  async toggleActive(): Promise<number> {
    return await this.$query().patch({
      aktif_mi: !this.aktif_mi
    });
  }

  // Sıralama güncelle
  async updateSiralama(yeniSiralama: number): Promise<number> {
    return await this.$query().patch({
      siralama: yeniSiralama
    });
  }

  // Static metodlar - tüm modeller için ortak sorgular

  // Sadece aktif kayıtları getir
  static async findActive<M extends BaseModel>(this: ModelClass<M>): Promise<M[]> {
    const result = await (this.query() as unknown as Promise<M[]>);
    return result.filter(item => !item.silinme_tarihi);
  }

  // ID ile aktif kayıt bul
  static async findActiveById<M extends BaseModel>(
    this: ModelClass<M>,
    id: string
  ): Promise<M | undefined> {
    const result = await this.query()
      .findById(id) as unknown as M;
    return result && !result.silinme_tarihi ? result : undefined;
  }

  // Sayfalama ile aktif kayıtları getir
  static async findActivePaginated<M extends BaseModel>(
    this: ModelClass<M>,
    page: number = 1,
    perPage: number = 10
  ): Promise<Page<M>> {
    const result = await this.query()
      .whereNull('silinme_tarihi')
      .page(page - 1, perPage) as unknown as Page<M>;

    return result;
  }

  // Arama fonksiyonu - belirtilen alanlarda arama yapar
  static async search<M extends BaseModel>(
    this: ModelClass<M>,
    searchTerm: string,
    searchFields: string[] = []
  ): Promise<M[]> {
    const query = this.query().whereNull('silinme_tarihi');

    if (searchTerm && searchFields.length > 0) {
      query.where((builder) => {
        searchFields.forEach((field, index) => {
          if (index === 0) {
            builder.where(field, 'like', `%${searchTerm}%`);
          } else {
            builder.orWhere(field, 'like', `%${searchTerm}%`);
          }
        });
      });
    }

    return await query as unknown as M[];
  }

  // Toplu soft delete
  static async bulkSoftDelete<T extends BaseModel>(
    this: ModelClass<T>,
    ids: string[]
  ): Promise<number> {
    return await this.query()
      .whereIn('id', ids)
      .patch({
        silinme_tarihi: new Date(),
        aktif_mi: false
      });
  }

  // Toplu restore
  static async bulkRestore<T extends BaseModel>(
    this: ModelClass<T>,
    ids: string[]
  ): Promise<number> {
    return await this.query()
      .whereIn('id', ids)
      .patch({
        silinme_tarihi: null,
        aktif_mi: true
      });
  }

  // Toplu aktif/pasif değiştirme
  static async bulkToggleActive<T extends BaseModel>(
    this: ModelClass<T>,
    ids: string[],
    aktif: boolean
  ): Promise<number> {
    return await this.query()
      .whereIn('id', ids)
      .patch({ aktif_mi: aktif });
  }

  // İstatistik metodları
  static async getStats<T extends BaseModel>(
    this: ModelClass<T>
  ): Promise<{ aktif: number; toplam: number; silinmis: number }> {
    interface CountResult {
      sayi: number | string;
    }

    const [aktifSayisi] = await this.query()
      .modify('aktif')
      .count('id as sayi') as CountResult[];

    const [toplamSayisi] = await this.query()
      .count('id as sayi') as CountResult[];

    const [silinmisSayisi] = await this.query()
      .modify('silinmis')
      .count('id as sayi') as CountResult[];

    return {
      aktif: Number(aktifSayisi.sayi),
      toplam: Number(toplamSayisi.sayi),
      silinmis: Number(silinmisSayisi.sayi)
    };
  }

  // JSON serileştirme - hassas alanları gizle
  $formatJson(json: any): any {
    json = super.$formatJson(json);

    // Tarih formatlaması
    if (json.olusturma_tarihi) {
      json.olusturma_tarihi = new Date(json.olusturma_tarihi).toISOString();
    }
    if (json.guncelleme_tarihi) {
      json.guncelleme_tarihi = new Date(json.guncelleme_tarihi).toISOString();
    }
    if (json.silinme_tarihi) {
      json.silinme_tarihi = new Date(json.silinme_tarihi).toISOString();
    }

    return json;
  }

  // Validation helper
  static override createValidator(): any {
    return {
      validate(args: { json: any }) {
        const { json } = args;

        // Temel validasyonlar
        if (!json.id) {
          throw new Error('ID alanı zorunludur');
        }

        if (!json.olusturma_tarihi) {
          throw new Error('Oluşturma tarihi zorunludur');
        }

        if (!json.guncelleme_tarihi) {
          throw new Error('Güncelleme tarihi zorunludur');
        }

        return json;
      }
    };
  }
};

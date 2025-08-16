import { Knex } from 'knex';

export class MigrationHelper {
  /**
   * Temel sütunları ekler (id, olusturma_tarihi, guncelleme_tarihi, silinme_tarihi, aktif_mi, siralama)
   */
  private static getCurrentTimestamp(knex: Knex) {
    return knex.client.config.client === 'mysql'
      ? knex.raw("(strftime('%s', 'now'))")
      : knex.fn.now();
  }

  static addBaseColumns(table: Knex.CreateTableBuilder): void {
    table.uuid('id').primary().notNullable();
    table.timestamp('olusturma_tarihi', { useTz: false }).notNullable().defaultTo('CURRENT_TIMESTAMP' as any);
    table.timestamp('guncelleme_tarihi', { useTz: false }).notNullable().defaultTo('CURRENT_TIMESTAMP' as any);
    table.timestamp('silinme_tarihi').nullable();
    table.boolean('aktif_mi').notNullable().defaultTo(true);
    table.integer('siralama').notNullable().defaultTo(1);
  }

  /**
   * Temel indeksleri ekler
   */
  static addBaseIndexes(knex: Knex, tableName: string): Promise<void[]> {
    return Promise.all([
      knex.schema.raw(`CREATE INDEX idx_${tableName}_aktif_mi ON ${tableName} (aktif_mi)`),
      knex.schema.raw(`CREATE INDEX idx_${tableName}_silinme_tarihi ON ${tableName} (silinme_tarihi)`),
      knex.schema.raw(`CREATE INDEX idx_${tableName}_olusturma_tarihi ON ${tableName} (olusturma_tarihi)`),
      knex.schema.raw(`CREATE INDEX idx_${tableName}_siralama ON ${tableName} (siralama)`)
    ]);
  }

  /**
   * Polimorfik ilişki sütunları ekler
   */
  static addMorphColumns(
    table: Knex.CreateTableBuilder,
    name: string,
    nullable: boolean = false
  ): void {
    if (nullable) {
      table.uuid(`${name}_id`).nullable();
      table.string(`${name}_type`).nullable();
    } else {
      table.uuid(`${name}_id`).notNullable();
      table.string(`${name}_type`).notNullable();
    }
  }

  /**
   * Polimorfik ilişki indeksi ekler
   */
  static addMorphIndex(knex: Knex, tableName: string, morphName: string): Promise<void> {
    return knex.schema.raw(
      `CREATE INDEX idx_${tableName}_${morphName} ON ${tableName} (${morphName}_type, ${morphName}_id)`
    );
  }

  /**
   * Foreign key sütunu ekler
   */
  static addForeignKey(
    table: Knex.CreateTableBuilder,
    columnName: string,
    referencedTable: string,
    referencedColumn: string = 'id',
    nullable: boolean = false
  ): void {
    const column = table.uuid(columnName);

    if (nullable) {
      column.nullable();
    } else {
      column.notNullable();
    }

    column.references(referencedColumn).inTable(referencedTable).onDelete('CASCADE');
  }

  /**
   * Enum sütunu ekler
   */
  static addEnumColumn(
    table: Knex.CreateTableBuilder,
    columnName: string,
    enumValues: string[],
    defaultValue?: string,
    nullable: boolean = false
  ): void {
    const column = table.enum(columnName, enumValues);

    if (defaultValue) {
      column.defaultTo(defaultValue);
    }

    if (nullable) {
      column.nullable();
    } else {
      column.notNullable();
    }
  }

  /**
   * JSON sütunu ekler
   */
  static addJsonColumn(
    table: Knex.CreateTableBuilder,
    columnName: string,
    nullable: boolean = true
  ): void {
    const column = table.json(columnName);

    if (nullable) {
      column.nullable();
    } else {
      column.notNullable();
    }
  }

  /**
   * Koordinat sütunları ekler (x, y)
   */
  static addCoordinateColumns(
    table: Knex.CreateTableBuilder,
    prefix: string = 'koordinat'
  ): void {
    table.decimal(`${prefix}_x`, 10, 8).nullable();
    table.decimal(`${prefix}_y`, 11, 8).nullable();
  }

  /**
   * Adres bilgileri için sütunlar ekler
   */
  static addAddressColumns(table: Knex.CreateTableBuilder): void {
    table.text('adres_satiri_1').nullable();
    table.text('adres_satiri_2').nullable();
    table.string('posta_kodu', 10).nullable();
  }

  /**
   * İletişim bilgileri için sütunlar ekler
   */
  static addContactColumns(table: Knex.CreateTableBuilder): void {
    table.string('telefon', 20).nullable();
    table.string('cep_telefonu', 20).nullable();
    table.string('email').nullable();
    table.string('website').nullable();
  }

  /**
   * Kişi bilgileri için sütunlar ekler
   */
  static addPersonColumns(table: Knex.CreateTableBuilder): void {
    table.string('ad', 100).notNullable();
    table.string('soyad', 100).notNullable();
    table.string('tc_kimlik_no', 11).nullable().unique();
    table.date('dogum_tarihi').nullable();
    table.enum('cinsiyet', ['erkek', 'kadin']).nullable();
    table.string('dogum_yeri', 100).nullable();
    table.enum('medeni_durum', ['bekar', 'evli', 'dul', 'bosanmis']).nullable();
  }

  /**
   * Firma bilgileri için sütunlar ekler
   */
  static addCompanyColumns(table: Knex.CreateTableBuilder): void {
    table.string('ad', 200).notNullable();
    table.string('vergi_no', 20).nullable();
    table.string('vergi_dairesi', 100).nullable();
    table.enum('tip', ['limited', 'anonim', 'sahis']).nullable();
    table.string('sektor', 100).nullable();
  }

  /**
   * Fiyat bilgileri için sütunlar ekler
   */
  static addPriceColumns(
    table: Knex.CreateTableBuilder,
    columnName: string = 'fiyat',
    currency: boolean = true
  ): void {
    table.decimal(columnName, 15, 2).nullable();

    if (currency) {
      table.string(`${columnName}_para_birimi`, 3).defaultTo('TRY');
    }
  }

  /**
   * Dosya bilgileri için sütunlar ekler
   */
  static addFileColumns(table: Knex.CreateTableBuilder): void {
    table.string('dosya_adi').notNullable();
    table.string('orijinal_adi').notNullable();
    table.string('dosya_yolu').notNullable();
    table.string('mime_type', 100).nullable();
    table.integer('dosya_boyutu').nullable(); // bytes
    table.string('dosya_hash', 64).nullable(); // SHA-256
  }

  /**
   * Resim bilgileri için sütunlar ekler
   */
  static addImageColumns(table: Knex.CreateTableBuilder): void {
    this.addFileColumns(table);
    table.integer('genislik').nullable();
    table.integer('yukseklik').nullable();
    table.string('thumbnail_yolu').nullable();
    table.boolean('ana_resim_mi').defaultTo(false);
  }

  /**
   * SEO bilgileri için sütunlar ekler
   */
  static addSeoColumns(table: Knex.CreateTableBuilder): void {
    table.string('seo_baslik').nullable();
    table.text('seo_aciklama').nullable();
    table.string('seo_anahtar_kelimeler').nullable();
    table.string('slug').nullable().unique();
  }

  /**
   * Audit log bilgileri için sütunlar ekler
   */
  static addAuditColumns(table: Knex.CreateTableBuilder): void {
    table.uuid('kullanici_id').nullable();
    table.string('islem_tipi', 50).notNullable(); // CREATE, UPDATE, DELETE
    table.json('eski_degerler').nullable();
    table.json('yeni_degerler').nullable();
    table.string('ip_adresi', 45).nullable();
    table.string('user_agent').nullable();
  }

  /**
   * Tablo oluşturma helper'ı
   */
  static async createTable(
    knex: Knex,
    tableName: string,
    callback: (table: Knex.CreateTableBuilder) => void,
    addBaseColumns: boolean = true,
    addIndexes: boolean = true
  ): Promise<void> {
    await knex.schema.createTable(tableName, (table) => {
      if (addBaseColumns) {
        this.addBaseColumns(table);
      }
      callback(table);
    });

    if (addIndexes && addBaseColumns) {
      await this.addBaseIndexes(knex, tableName);
    }
  }

  /**
   * Tablo silme helper'ı
   */
  static async dropTable(knex: Knex, tableName: string): Promise<void> {
    await knex.schema.dropTableIfExists(tableName);
  }

  /**
   * Sütun var mı kontrolü
   */
  static async hasColumn(knex: Knex, tableName: string, columnName: string): Promise<boolean> {
    return knex.schema.hasColumn(tableName, columnName);
  }

  /**
   * Tablo var mı kontrolü
   */
  static async hasTable(knex: Knex, tableName: string): Promise<boolean> {
    return knex.schema.hasTable(tableName);
  }
}
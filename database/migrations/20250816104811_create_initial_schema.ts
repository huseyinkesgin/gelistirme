import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('kisiler', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 100).notNullable();
    table.string('soyad', 100).notNullable();
    table.string('tc_kimlik_no', 11).unique().nullable();
    table.date('dogum_tarihi').nullable();
    table.enum('cinsiyet', ['erkek', 'kadin', 'belirtilmemis']).defaultTo('belirtilmemis');
    table.string('dogum_yeri', 100).nullable();
    table.string('email', 255).unique().nullable();
    table.enum('medeni_durum', ['bekar', 'evli', 'dul', 'bosanmis', 'belirtilmemis']).defaultTo('belirtilmemis');
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('kullanicilar', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('kisi_id').references('id').inTable('kisiler').onDelete('SET NULL').nullable();
    table.string('kullanici_adi', 100).notNullable().unique();
    table.string('sifre', 255).notNullable();
    table.timestamp('son_giris_tarihi').nullable();
    table.string('son_giris_ip', 45).nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('subeler', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 150).notNullable();
    table.string('kod', 50).nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('departmanlar', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 150).notNullable();
    table.uuid('sube_id').references('id').inTable('subeler').onDelete('CASCADE').notNullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('pozisyonlar', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 150).notNullable();
    table.uuid('departman_id').references('id').inTable('departmanlar').onDelete('CASCADE').notNullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('personeller', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('kisi_id').references('id').inTable('kisiler').onDelete('CASCADE').notNullable();
    table.uuid('pozisyon_id').references('id').inTable('pozisyonlar').onDelete('SET NULL').nullable();
    table.uuid('departman_id').references('id').inTable('departmanlar').onDelete('SET NULL').nullable();
    table.date('ise_baslama_tarihi').notNullable();
    table.date('isten_ayrilma_tarihi').nullable();
    table.decimal('maas', 10, 2).nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('sehirler', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 100).notNullable();
    table.string('plaka_kodu', 2).notNullable().unique();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('ilceler', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 100).notNullable();
    table.uuid('sehir_id').references('id').inTable('sehirler').onDelete('CASCADE').notNullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('semtler', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 100).notNullable();
    table.uuid('ilce_id').references('id').inTable('ilceler').onDelete('CASCADE').notNullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('mahalleler', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 100).notNullable();
    table.uuid('semt_id').references('id').inTable('semtler').onDelete('CASCADE').notNullable();
    table.string('posta_kodu', 5).nullable();
    table.decimal('koordinat_x', 10, 7).nullable();
    table.decimal('koordinat_y', 10, 7).nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('adresler', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.enum('adres_tipi', ['ev', 'is', 'fatura', 'diger']).notNullable();
    table.boolean('varsayilan_mi').defaultTo(false);
    table.string('baslik', 255).nullable();
    table.string('adres_satiri_1', 255).notNullable();
    table.string('adres_satiri_2', 255).nullable();
    table.uuid('mahalle_id').references('id').inTable('mahalleler').onDelete('SET NULL').nullable();
    table.uuid('semt_id').references('id').inTable('semtler').onDelete('SET NULL').nullable();
    table.uuid('ilce_id').references('id').inTable('ilceler').onDelete('SET NULL').nullable();
    table.uuid('sehir_id').references('id').inTable('sehirler').onDelete('SET NULL').nullable();
    table.string('posta_kodu', 5).nullable();
    table.uuid('adreslenebilir_id').notNullable();
    table.string('adreslenebilir_type', 255).notNullable();
    table.index(['adreslenebilir_id', 'adreslenebilir_type']);
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('telefonlar', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.enum('tip', ['ev', 'is', 'cep', 'faks']).notNullable();
    table.boolean('varsayilan_mi').defaultTo(false);
    table.string('numara', 20).notNullable();
    table.string('aciklama', 255).nullable();
    table.uuid('telefonlanabilir_id').notNullable();
    table.string('telefonlanabilir_type', 255).notNullable();
    table.index(['telefonlanabilir_id', 'telefonlanabilir_type']);
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('resimler', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 255).nullable();
    table.text('aciklama').nullable();
    table.string('dosya_adi', 255).notNullable();
    table.string('dosya_yolu', 512).notNullable();
    table.string('mime_type', 100).nullable();
    table.integer('dosya_boyutu').unsigned().nullable();
    table.integer('genislik').unsigned().nullable();
    table.integer('yukseklik').unsigned().nullable();
    table.boolean('ana_gorsel').defaultTo(false);
    table.boolean('profil_resmi').defaultTo(false);
    table.uuid('resimlenebilir_id').notNullable();
    table.string('resimlenebilir_type', 255).notNullable();
    table.index(['resimlenebilir_id', 'resimlenebilir_type']);
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('dokumanlar', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 255).nullable();
    table.text('aciklama').nullable();
    table.string('dosya_adi', 255).notNullable();
    table.string('dosya_yolu', 512).notNullable();
    table.string('mime_type', 100).nullable();
    table.integer('dosya_boyutu').unsigned().nullable();
    table.boolean('gizli_mi').defaultTo(false);
    table.uuid('dokumanlanabilir_id').notNullable();
    table.string('dokumanlanabilir_type', 255).notNullable();
    table.index(['dokumanlanabilir_id', 'dokumanlanabilir_type']);
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('kategoriler', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 100).notNullable();
    table.text('aciklama').nullable();
    table.uuid('ust_kategori_id').references('id').inTable('kategoriler').onDelete('SET NULL').nullable();
    table.integer('seviye').defaultTo(1);
    table.uuid('kategorilenebilir_id').nullable();
    table.string('kategorilenebilir_type', 255).notNullable();
    table.index(['kategorilenebilir_id', 'kategorilenebilir_type']);
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('roller', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 100).notNullable();
    table.text('aciklama').nullable();
    table.jsonb('yetkiler').nullable();
    table.uuid('rollenebilir_id').notNullable();
    table.string('rollenebilir_type', 255).notNullable();
    table.index(['rollenebilir_id', 'rollenebilir_type']);
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('firmalar', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 200).notNullable();
    table.string('vergi_no', 20).nullable();
    table.string('vergi_dairesi', 100).nullable();
    table.enum('tip', ['limited', 'anonim', 'sahis', 'diger']).nullable();
    table.string('sektor', 100).nullable();
    table.uuid('firmalanabilir_id').notNullable();
    table.string('firmalanabilir_type', 255).notNullable();
    table.index(['firmalanabilir_id', 'firmalanabilir_type']);
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('notlar', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('baslik', 200).nullable();
    table.text('icerik').notNullable();
    table.enum('tip', ['genel', 'onemli', 'hatirlatma']).defaultTo('genel');
    table.string('renk', 7).nullable();
    table.uuid('notlanabilir_id').notNullable();
    table.string('notlanabilir_type', 255).notNullable();
    table.index(['notlanabilir_id', 'notlanabilir_type']);
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('mulkler', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('portfoy_no', 50).unique().nullable();
    table.string('baslik', 255).notNullable();
    table.text('aciklama').nullable();
    table.decimal('fiyat', 15, 2).notNullable().defaultTo(0);
    table.decimal('metrekare', 10, 2).notNullable().defaultTo(0);
    table.integer('oda_sayisi').nullable();
    table.integer('banyo_sayisi').nullable();
    table.integer('kat').nullable();
    table.decimal('koordinat_x', 10, 7).nullable();
    table.decimal('koordinat_y', 10, 7).nullable();
    table.jsonb('dinamik_ozellikler').nullable();
    table.uuid('kategori_id').references('id').inTable('kategoriler').onDelete('SET NULL').nullable();
    table.uuid('sahip_id').references('id').inTable('kisiler').onDelete('SET NULL').nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('musteriler', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('kisi_id').references('id').inTable('kisiler').onDelete('CASCADE').notNullable();
    table.string('musteri_no', 50).unique().nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('musteri_talepleri', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('musteri_id').references('id').inTable('musteriler').onDelete('CASCADE').notNullable();
    table.string('talep_baslik', 255).notNullable();
    table.text('talep_aciklama').nullable();
    table.decimal('min_fiyat', 15, 2).nullable();
    table.decimal('max_fiyat', 15, 2).nullable();
    table.decimal('min_metrekare', 10, 2).nullable();
    table.decimal('max_metrekare', 10, 2).nullable();
    table.integer('oda_sayisi').nullable();
    table.enum('talep_durumu', ['yeni', 'isleniyor', 'tamamlandi', 'iptal_edildi']).defaultTo('yeni');
    table.jsonb('lokasyon_bilgisi').nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('musteri_mulk_iliskileri', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('musteri_id').references('id').inTable('musteriler').onDelete('CASCADE').notNullable();
    table.uuid('mulk_id').references('id').inTable('mulkler').onDelete('CASCADE').notNullable();
    table.enum('ilgi_durumu', ['ilgili', 'teklif_verildi', 'reddedildi', 'satildi']).defaultTo('ilgili');
    table.decimal('teklif_fiyati', 15, 2).nullable();
    table.text('notlar').nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('ilan_platformlari', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('ad', 100).notNullable().unique();
    table.string('api_key', 255).nullable();
    table.string('base_url', 255).nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('ilanlar', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('mulk_id').references('id').inTable('mulkler').onDelete('CASCADE').notNullable();
    table.string('baslik', 255).notNullable();
    table.text('aciklama').nullable();
    table.timestamp('yayin_tarihi').defaultTo(knex.fn.now());
    table.timestamp('bitis_tarihi').nullable();
    table.enum('durum', ['taslak', 'yayinda', 'yayindan_kaldirildi', 'satildi', 'kiralandi']).defaultTo('taslak');
    table.jsonb('seo_bilgileri').nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('ilan_platform_iliskileri', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('ilan_id').references('id').inTable('ilanlar').onDelete('CASCADE').notNullable();
    table.uuid('platform_id').references('id').inTable('ilan_platformlari').onDelete('CASCADE').notNullable();
    table.string('platform_ilan_id', 255).nullable();
    table.string('platform_link', 512).nullable();
    table.enum('durum', ['beklemede', 'yayinda', 'hata', 'yayindan_kaldirildi']).defaultTo('beklemede');
    table.text('hata_mesaji').nullable();
    table.timestamp('yayin_tarihi').nullable();
    table.timestamp('guncelleme_tarihi').nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('randevular', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('musteri_id').references('id').inTable('musteriler').onDelete('CASCADE').notNullable();
    table.uuid('mulk_id').references('id').inTable('mulkler').onDelete('SET NULL').nullable();
    table.uuid('personel_id').references('id').inTable('personeller').onDelete('SET NULL').nullable();
    table.string('konu', 255).notNullable();
    table.text('aciklama').nullable();
    table.date('randevu_tarihi').notNullable();
    table.time('randevu_saati').notNullable();
    table.enum('randevu_durumu', ['planlandi', 'tamamlandi', 'iptal_edildi', 'ertelendi']).defaultTo('planlandi');
    table.text('sonuc').nullable();
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });

  await knex.schema.createTable('randevu_katilimcilari', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('randevu_id').references('id').inTable('randevular').onDelete('CASCADE').notNullable();
    table.uuid('katilimci_id').references('id').inTable('kisiler').onDelete('CASCADE').notNullable();
    table.enum('katilimci_tipi', ['musteri', 'personel', 'diger']).notNullable();
    table.enum('onay_durumu', ['beklemede', 'onaylandi', 'reddedildi']).defaultTo('beklemede');
    table.timestamp('olusturma_tarihi').defaultTo(knex.fn.now());
    table.timestamp('guncelleme_tarihi').defaultTo(knex.fn.now());
    table.boolean('aktif_mi').defaultTo(true);
    table.integer('siralama').defaultTo(1);
    table.timestamp('silinme_tarihi').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('randevu_katilimcilari');
  await knex.schema.dropTableIfExists('randevular');
  await knex.schema.dropTableIfExists('ilan_platform_iliskileri');
  await knex.schema.dropTableIfExists('ilanlar');
  await knex.schema.dropTableIfExists('ilan_platformlari');
  await knex.schema.dropTableIfExists('musteri_mulk_iliskileri');
  await knex.schema.dropTableIfExists('musteri_talepleri');
  await knex.schema.dropTableIfExists('musteriler');
  await knex.schema.dropTableIfExists('mulkler');
  await knex.schema.dropTableIfExists('notlar');
  await knex.schema.dropTableIfExists('firmalar');
  await knex.schema.dropTableIfExists('roller');
  await knex.schema.dropTableIfExists('kategoriler');
  await knex.schema.dropTableIfExists('dokumanlar');
  await knex.schema.dropTableIfExists('resimler');
  await knex.schema.dropTableIfExists('telefonlar');
  await knex.schema.dropTableIfExists('adresler');
  await knex.schema.dropTableIfExists('mahalleler');
  await knex.schema.dropTableIfExists('semtler');
  await knex.schema.dropTableIfExists('ilceler');
  await knex.schema.dropTableIfExists('sehirler');
  await knex.schema.dropTableIfExists('personeller');
  await knex.schema.dropTableIfExists('pozisyonlar');
  await knex.schema.dropTableIfExists('departmanlar');
  await knex.schema.dropTableIfExists('subeler');
  await knex.schema.dropTableIfExists('kullanicilar');
  await knex.schema.dropTableIfExists('kisiler');
}


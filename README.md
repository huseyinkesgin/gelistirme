# Emlak Portföy Yönetim Sistemi

Modern Electron.js tabanlı emlak portföy yönetim sistemi. TypeScript, Vue.js, TailwindCSS, MySQL, Knex.js ve Objection.js teknolojileri kullanılarak geliştirilmiştir.

## Teknoloji Stack

- **Frontend**: Electron.js + Vue.js 3 + TypeScript + TailwindCSS
- **Backend**: Node.js + Express.js
- **Veritabanı**: MySQL 8.0+ + Knex.js + Objection.js
- **Test**: Jest + Vue Test Utils
- **Build**: Vite + Electron Builder

## Kurulum

### Gereksinimler

- Node.js 18+
- MySQL 8.0+
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd emlak-portfoy-yonetim-sistemi
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Ortam değişkenlerini ayarlayın:
```bash
cp .env.example .env
# .env dosyasını düzenleyin
```

4. Veritabanını oluşturun:
```sql
CREATE DATABASE emlak_portfoy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Migration'ları çalıştırın:
```bash
npm run migrate:latest
```

6. Seed verilerini yükleyin (opsiyonel):
```bash
npm run seed:run
```

## Geliştirme

Geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Bu komut hem renderer sürecini (Vue.js) hem de main sürecini (Electron) başlatır.

## Build

Üretim için build almak:

```bash
npm run build
npm run build:all
```

## Test

Testleri çalıştırmak:

```bash
npm test
npm run test:watch
```

## Proje Yapısı

```
src/
├── main/           # Electron ana süreç
├── renderer/       # Vue.js frontend
│   ├── components/ # Vue bileşenleri
│   ├── views/      # Sayfa bileşenleri
│   └── router/     # Vue Router
├── models/         # Objection.js modelleri
├── types/          # TypeScript tip tanımları
└── utils/          # Yardımcı fonksiyonlar

database/
├── migrations/     # Knex.js migration'ları
└── seeds/          # Seed dosyaları

tests/              # Test dosyaları
config/             # Konfigürasyon dosyaları
```

## Özellikler

- ✅ Modern TypeScript tabanlı mimari
- ✅ Responsive TailwindCSS tasarım
- ✅ UUID tabanlı veri modeli
- ✅ Soft delete desteği
- ✅ Polimorfik ilişkiler
- ✅ Türkçe alan adları
- ✅ Test altyapısı
- 🔄 Mülk yönetimi (geliştiriliyor)
- 🔄 Müşteri yönetimi (geliştiriliyor)
- 🔄 Randevu sistemi (geliştiriliyor)
- 🔄 İlan yönetimi (geliştiriliyor)

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.
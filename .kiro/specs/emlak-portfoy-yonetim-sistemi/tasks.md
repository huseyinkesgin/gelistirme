# Emlak Portföy Yönetim Sistemi - Uygulama Planı

Bu belge, Electron.js tabanlı emlak portföy yönetim sisteminin adım adım kodlama görevlerini içerir. Her görev, test odaklı geliştirme yaklaşımı ile artımlı ilerleme sağlayacak şekilde tasarlanmıştır.

## Uygulama Görevleri

- [x] 1. Proje Altyapısı ve Temel Yapılandırma




  - Electron.js, Vue.js, TailwindCSS, MySQL, Knex.js ve Objection.js ile proje iskeletini oluştur
  - Package.json bağımlılıklarını yapılandır ve geliştirme ortamını hazırla
  - Temel klasör yapısını oluştur (src/, database/, tests/, config/)




  - _Gereksinimler: 1.1, 1.2, 1.3_

- [x] 2. Veritabanı Altyapısı ve BaseModel Oluşturma
  - Knex.js yapılandırmasını ve MySQL bağlantısını kur
  - UUID, soft delete ve Türkçe alan adları destekli BaseModel sınıfını implement et
  - Migration helper fonksiyonlarını oluştur
  - BaseModel için birim testleri yaz
  - _Gereksinimler: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 3. Lokasyon Modelleri ve Migration'ları
  - Şehir, İlçe, Semt, Mahalle tablolarının migration'larını oluştur
  - Hiyerarşik ilişkileri ve koordinat alanlarını tanımla
  - Lokasyon modelleri (Sehir, Ilce, Semt, Mahalle) için Objection.js sınıflarını yaz
  - Lokasyon modelleri için birim testleri ve seed verilerini oluştur
  - _Gereksinimler: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 4. Polimorfik İlişki Modelleri (Adres, Telefon, Resim, Doküman, Kategori, Rol, Firma, Not)
  - Polimorfik adres, telefon, kategori, rol, firma, not tablolarının migration'larını oluştur
  - Resim tablosunu profil resmi ve galeri ayrımıyla tasarla
  - Tüm morph model sınıflarını (Adres, Telefon, Resim, Doküman, Kategori, Rol, Firma, Not) implement et
  - Polimorfik ilişkiler için helper fonksiyonları ve testleri yaz
  - _Gereksinimler: 2.2, 11.1, 11.2, 11.3, 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ] 5. Enum Yapıları ve Kullanıcı/Organizasyon Modelleri
  - Cinsiyet, MedeniDurum, TelefonTipi, AdresTipi enum sınıflarını oluştur
  - Users, Kisiler tablolarını telefon alanları olmadan tasarla (morph kullanılacak)
  - Şube, Departman, Pozisyon, Personel tablolarını Türkçe isimlerle oluştur
  - Kullanici, Kisi, Personel model sınıflarını morph ilişkilerle implement et
  - _Gereksinimler: 2.1, 2.2, 2.6, 24.1, 24.2, 24.3, 24.4, 24.5_

- [ ] 6. Mülk Yönetimi Modelleri ve Dinamik Özellikler
  - Mulkler tablosunu kategori morph ilişkisiyle tasarla (ayrı kategori tablosu olmayacak)
  - JSON tabanlı dinamik özellikler ve galeri sistemi için veri yapısını oluştur
  - Mulk model sınıfını Türkçe alan adlarıyla ve morph ilişkilerle implement et
  - Otomatik portfoy numarası üretimi ve dinamik özellik yönetimini yaz
  - _Gereksinimler: 7.1, 7.2, 7.3, 7.4, 7.5, 20.1, 20.2, 20.5, 23.2_

- [ ] 7. Müşteri ve CRM Modelleri
  - Müşteri, müşteri talepleri ve müşteri-mülk ilişkileri tablolarını oluştur
  - Randevu, etkileşim ve görüşme geçmişi tablolarını tasarla
  - Musteri, MusteriTalep, MusteriMulkIliskisi, Randevu model sınıflarını yaz
  - CRM etkileşim takibi ve otomatik bildirim sistemini implement et
  - _Gereksinimler: 8.1, 8.2, 8.3, 8.4, 8.5, 21.1, 21.2, 21.3, 22.1, 22.2_

- [ ] 8. İlan Yönetimi ve Platform Entegrasyonu Modelleri



  - İlan platformları ve ilan-platform ilişkileri tablolarını oluştur
  - İlan, IlanPlatformu, IlanPlatformIliskisi model sınıflarını yaz
  - Platform API entegrasyonu için temel yapıyı hazırla
  - İlan performans takibi ve SEO yönetimi fonksiyonlarını implement et


  - _Gereksinimler: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 9. Electron Ana Süreç ve IPC Yapılandırması
  - Electron main.js dosyasını ve ana pencere yönetimini oluştur
  - IPC (Inter-Process Communication) event handler'larını implement et
  - Veritabanı bağlantısı ve dosya sistemi erişimi için ana süreç fonksiyonlarını yaz
  - Ana süreç güvenlik yapılandırmasını ve hata yönetimini ekle
  - _Gereksinimler: 16.1, 16.4, 16.6, 17.4_

- [x] 10. Vue.js Uygulama Yapısı ve Router Kurulumu
  - Vue.js ana uygulama bileşenini (App.vue) oluştur ✓
  - Vue Router yapılandırmasını ve ana rotaları tanımla ✓
  - Layout bileşenlerini (Sidebar, Header, MainContent) implement et ✓
  - State management (Vuex/Pinia) yapılandırmasını kur ✓
  - _Gereksinimler: 18.1, 18.4, 18.5_

- [x] 11. TailwindCSS Yapılandırması ve Temel Stil Sistemi
  - TailwindCSS yapılandırmasını amber renk teması ile kur ✓
  - Responsive tasarım breakpoint'lerini ve utility sınıflarını tanımla ✓
  - Amber-500 border, amber-200 focus renkleri için custom CSS sınıfları oluştur ✓
  - WCAG 2.1 uyumlu renk kontrastı ve erişilebilirlik stillerini implement et ✓
  - _Gereksinimler: 18.1, 18.3, 18.4, 18.5_

- [ ] 12. Temel Form Bileşenleri Sistemi
  - BaseInput bileşenini tüm validasyon özellikleriyle oluştur
  - InputText, InputNumber, InputDate bileşenlerini implement et
  - Label pozisyonu, boyut seçenekleri ve hata gösterimi fonksiyonlarını ekle
  - Form bileşenleri için kapsamlı birim testleri yaz
  - _Gereksinimler: 4.1, 4.2, 4.3, 4.4_

- [ ] 13. Özelleştirilmiş Input Bileşenleri
  - InputCurrency bileşenini binlik ayırıcı ve döviz desteğiyle oluştur
  - InputPhone bileşenini 0(###)### #### maskesiyle implement et
  - InputTc bileşenini 11 karakter validasyonuyla yaz
  - InputEmail bileşenini e-posta validasyonuyla oluştur
  - _Gereksinimler: 4.5, 4.6, 4.7_

- [ ] 14. Select, TextArea ve Diğer Form Bileşenleri
  - Select bileşenini arama özelliği ve dinamik seçeneklerle oluştur
  - TextArea bileşenini karakter sayımı ve row ayarlarıyla implement et
  - Toggle, Checkbox, Radio bileşenlerini amber renk temasıyla yaz
  - Tüm form bileşenleri için entegrasyon testleri oluştur
  - _Gereksinimler: 4.1, 4.2, 4.3, 4.4_

- [ ] 15. Dosya Yükleme Bileşenleri
  - FileUpload bileşenini drag-drop desteğiyle oluştur
  - ImageUpload (Dropzone) bileşenini çoklu yükleme ve önizleme ile implement et
  - Dosya boyutu, format validasyonu ve çözünürlük sabitleme özelliklerini ekle
  - Dosya yükleme için güvenlik kontrolleri ve hata yönetimi implement et
  - _Gereksinimler: 4.1, 11.1, 11.2, 11.3_

- [ ] 16. Modal Sistemi ve Bildirim Bileşenleri
  - BaseModal bileşenini amber border ve sabit ikonlarla oluştur
  - ConfirmModal ve MessageModal sınıflarını implement et
  - Modal boyut seçenekleri ve ESC tuşu ile kapatma özelliklerini ekle
  - Toastr bildirim sistemini error, success, warning türleriyle yaz
  - _Gereksinimler: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 17. DataTable Bileşeni ve Toplu İşlemler
  - DataTable bileşenini sıralama, filtreleme, arama özellikleriyle oluştur
  - Sütun yönetimi ve drag-drop sıralama fonksiyonlarını implement et
  - Toplu seçim, checkbox sayımı ve toplu işlem butonlarını ekle
  - Export/Import fonksiyonlarını PDF, CSV, XLS, XLSX formatlarıyla yaz
  - _Gereksinimler: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 18. Lokasyon Seçim Bileşeni (Hiyerarşik)
  - Şehir-İlçe-Semt-Mahalle zincirleme seçim bileşenini oluştur
  - Dinamik alt seviye yükleme ve koordinat girişi özelliklerini implement et
  - Lokasyon önbellek sistemi ve performans optimizasyonunu ekle
  - Lokasyon seçim bileşeni için entegrasyon testleri yaz
  - _Gereksinimler: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 19. Kimlik Doğrulama ve Güvenlik Sistemi
  - Login/logout fonksiyonlarını bcrypt şifreleme ile implement et
  - JWT token yönetimi ve oturum kontrolü sistemini oluştur
  - Rol tabanlı erişim kontrolü middleware'ini yaz
  - Güvenlik logları ve şüpheli aktivite tespiti sistemini implement et
  - _Gereksinimler: 16.4, 16.5, 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ] 20. Hata Yönetimi ve Validasyon Sistemi
  - ErrorHandler sınıfını dosya ve veritabanı loglama ile oluştur
  - Validator sınıfını TC kimlik, telefon, e-posta validasyonlarıyla implement et
  - Frontend-backend hata iletişimi için IPC event sistemini kur
  - Kapsamlı hata yakalama ve kullanıcı bildirim sistemini yaz
  - _Gereksinimler: 16.6, 19.5_

- [ ] 21. API Katmanı ve Route Yapılandırması
  - Express.js API router'larını RESTful yapıda oluştur
  - Auth, Properties, Customers, Appointments route'larını implement et
  - API middleware'lerini (authentication, validation, error handling) yaz
  - API endpoint'leri için Postman koleksiyonu ve dokümantasyon oluştur
  - _Gereksinimler: 2.4, 8.1, 9.4, 10.1_

- [ ] 22. Mülk Yönetimi Sayfaları ve Dinamik Formlar
  - Mülk listesi sayfasını DataTable bileşeniyle oluştur
  - Çok adımlı mülk ekleme sihirbazını taslak kaydetme ile implement et
  - Dinamik mülk tipi formlarını (Konut, İşyeri, Arsa, Turistik Tesis) oluştur
  - Mülk detay sayfasını resim galeri ve doküman yönetimiyle yaz
  - _Gereksinimler: 7.1, 7.2, 7.3, 7.4, 7.5, 20.1, 20.2, 20.3, 20.4_

- [ ] 23. Müşteri Yönetimi ve CRM Sayfaları
  - Müşteri listesi ve detay sayfalarını oluştur
  - Müşteri-mülk ilişki yönetimi sayfasını implement et
  - Müşteri etkileşim geçmişi ve görüşme kayıt formlarını yaz
  - Müşteri talep yönetimi ve otomatik eşleştirme sistemini oluştur
  - _Gereksinimler: 8.1, 8.2, 8.3, 8.4, 8.5, 21.1, 21.2, 21.3, 21.4, 21.5_

- [ ] 24. Randevu Yönetimi ve Takvim Sistemi
  - Randevu takvim görünümünü Vue.js takvim bileşeniyle oluştur
  - Randevu oluşturma, düzenleme ve iptal fonksiyonlarını implement et
  - Randevu çakışma kontrolü ve otomatik uyarı sistemini yaz
  - Randevu bildirim sistemi (e-posta, push notification) oluştur
  - _Gereksinimler: 10.1, 10.2, 10.3, 10.4, 10.5, 22.1, 22.2, 22.5_

- [ ] 25. İlan Yönetimi ve Platform Entegrasyonu Sayfaları
  - İlan oluşturma ve düzenleme formlarını SEO alanlarıyla yaz
  - Platform seçimi ve çoklu platform yayınlama sistemini implement et
  - İlan performans takibi ve analiz sayfasını oluştur
  - Platform API entegrasyonu ve hata yönetimi sistemini tamamla
  - _Gereksinimler: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 26. Medya ve Doküman Yönetimi Sistemi
  - Resim galeri yönetimi sayfasını drag-drop sıralama ile oluştur
  - Doküman kategorileme ve gizlilik yönetimi sistemini implement et
  - Otomatik thumbnail oluşturma ve resim optimizasyonu fonksiyonlarını yaz
  - Medya arama, filtreleme ve toplu işlem özelliklerini ekle
  - _Gereksinimler: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 27. Fiyat Takibi ve Analiz Sistemi
  - Fiyat geçmişi kayıt ve görüntüleme sistemini oluştur
  - Grafik ve tablo formatında fiyat analiz sayfalarını implement et
  - Bölgesel karşılaştırma ve piyasa trendi analiz fonksiyonlarını yaz
  - Fiyat anomalisi tespit ve otomatik uyarı sistemini oluştur
  - _Gereksinimler: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 28. Gelişmiş Arama ve Harita Entegrasyonu
  - Çoklu kriter arama formunu ve sonuç sayfasını oluştur
  - Google Maps entegrasyonunu mülk konumları ile implement et
  - Kayıtlı arama ve AI öneri sistemi temellerini yaz
  - Arama sonuçları export ve harita üzerinde filtreleme özelliklerini ekle
  - _Gereksinimler: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 29. Dashboard ve Raporlama Sistemi
  - Ana dashboard sayfasını performans metrikleriyle oluştur
  - Bireysel ve bölgesel performans rapor sayfalarını implement et
  - Finansal rapor ve komisyon hesaplama sistemini yaz
  - Rapor export fonksiyonlarını PDF ve XLSX formatlarıyla oluştur
  - _Gereksinimler: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 30. Performans Optimizasyonu ve Önbellek Sistemi
  - Lazy loading sistemini kritik bileşenler için implement et
  - Veritabanı sorgu optimizasyonu ve indeksleme stratejisini uygula
  - Frontend önbellek sistemi (CacheService) oluştur
  - Performans metrikleri izleme ve raporlama sistemini ekle
  - _Gereksinimler: 16.1, 16.2, 16.3, 17.1, 17.5_

- [ ] 31. Yedekleme ve Veri Güvenliği Sistemi
  - Otomatik veritabanı yedekleme sistemini implement et
  - Veri şifreleme (Encryption sınıfı) ve KVKK uyumlu saklama sistemini yaz
  - IndexedDB fallback sistemi için offline veri erişimini oluştur
  - Veri bütünlüğü kontrolü ve restore fonksiyonlarını implement et
  - _Gereksinimler: 16.5, 17.2, 17.3, 17.4_

- [ ] 32. Mobil Uyumluluk ve PWA Özellikleri
  - Responsive tasarım optimizasyonunu tüm sayfalarda uygula
  - Kamera ve GPS entegrasyonu için Electron API'lerini implement et
  - PWA manifest ve service worker yapılandırmasını oluştur
  - Push notification sistemi ve offline çalışma özelliklerini ekle
  - _Gereksinimler: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 33. Test Süiti ve Kalite Güvencesi
  - Tüm model sınıfları için kapsamlı birim testleri yaz
  - API endpoint'leri için entegrasyon testleri oluştur
  - Kritik kullanıcı senaryoları için E2E testleri implement et
  - Test coverage raporlama ve sürekli entegrasyon yapılandırmasını kur
  - _Gereksinimler: Tüm gereksinimler için test coverage_

- [ ] 34. Dokümantasyon ve Deployment Hazırlığı
  - API dokümantasyonu ve kullanıcı kılavuzunu oluştur
  - Electron uygulama paketleme ve dağıtım yapılandırmasını hazırla
  - Veritabanı migration ve seed script'lerini production için optimize et
  - Sistem kurulum kılavuzu ve troubleshooting dokümantasyonunu yaz
  - _Gereksinimler: Sistem kurulumu ve kullanım dokümantasyonu_

- [ ] 35. Son Entegrasyon ve Sistem Testleri
  - Tüm modüllerin entegrasyonunu test et ve hataları düzelt
  - Performans testleri çalıştır ve optimizasyon gereksinimlerini doğrula
  - Güvenlik testleri ve penetrasyon testlerini gerçekleştir
  - Kullanıcı kabul testleri için demo veri seti oluştur ve sistemi teslim et
  - _Gereksinimler: Tüm gereksinimler için final validation_- [ ] 36. L
aravel Tarzı Yapı ve Migration/Seeder Sistemi
  - Laravel tarzı migration yapısını Knex.js ile implement et
  - Model factory ve seeder sınıflarını oluştur
  - Türkçe tablo ve sütun isimleri için naming convention belirle
  - Migration rollback ve refresh komutlarını implement et
  - _Gereksinimler: 25.5, 1.5_

- [ ] 37. Dinamik Veri Ekleme ve Modal Entegrasyonu
  - DynamicSelect bileşenini + ikonu ve modal entegrasyonuyla oluştur
  - Form içinde modal açma ve veri ekleme sistemini implement et
  - Ana form verisi korunarak modal işlemlerini yönet
  - Tüm seçim listelerinde dinamik ekleme özelliğini aktif et
  - _Gereksinimler: 25.1, 25.2, 25.3, 25.4_

- [ ] 38. Galeri ve Profil Resmi Ayrımı
  - Resim modelinde profil_resmi boolean alanını ekle
  - Tek profil resmi ve çoklu galeri resmi yönetimini implement et
  - Galeri resimlerinde sıralama ve ana görsel seçimi özelliklerini yaz
  - Resim yükleme bileşenlerini profil/galeri ayrımıyla güncelle
  - _Gereksinimler: 11.3, 11.5_
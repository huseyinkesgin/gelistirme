# Emlak Portföy Yönetim Sistemi - Gereksinimler Belgesi

## Giriş

Bu sistem, emlak profesyonellerinin portföy, müşteri, mülk, ilan, randevu, müşteri takip, hizmetler, resim, galeri, personel takip, önmuhasebe ve dokümantasyon süreçlerini uçtan uca yönetmesini sağlayan kapsamlı bir masaüstü uygulamasıdır. Electron.js, MySQL ve TailwindCSS teknolojileri kullanılarak modern, ölçeklenebilir ve güvenli bir mimari hedeflenmiştir.

**Teknoloji Stack:**
- Frontend: Electron.js + TailwindCSS + Vue.js
- Backend: Node.js
- Veritabanı: MySQL 8.0+
- ORM/Query Builder: Knex.js (migrations ve seeds) + Objection.js (model layer)

**Sistem Gereksinimleri:**
- Minimum: Intel Core i3, 4GB RAM, 500MB depolama, 1280x720 çözünürlük
- Önerilen: Intel Core i5, 8GB+ RAM, 2GB+ depolama
- İşletim Sistemi: Windows 10+, macOS 10.15+, Ubuntu 20.04+
- İnternet: API entegrasyonları için (offline mod destekli)

## Gereksinimler

### Gereksinim 1: Temel Sistem Altyapısı ve Veri Modeli

**Kullanıcı Hikayesi:** Bir sistem yöneticisi olarak, tüm veri modellerinin UUID tabanlı, soft delete destekli ve Türkçe alan adlarına sahip olmasını istiyorum, böylece sistem güvenli, ölçeklenebilir ve yerel kullanıcılar için anlaşılır olsun.

#### Kabul Kriterleri

1. WHEN sistem kurulduğunda THEN tüm ana tablolar (kullanıcı, mülk, müşteri, lokasyon, ilan, randevu, hizmet, resim, galeri, doküman, medya, organizasyon) UUID primary key kullanacak
2. WHEN herhangi bir kayıt silindiğinde THEN soft delete ile silinme_tarihi alanı güncellenecek ve kayıt fiziksel olarak silinmeyecek
3. WHEN yeni bir kayıt oluşturulduğunda THEN otomatik olarak olusturma_tarihi, guncelleme_tarihi alanları doldurulacak
4. WHEN herhangi bir kayıt güncellendiğinde THEN guncelleme_tarihi alanı otomatik güncellenecek
5. WHEN veri tabanı tasarımı yapılırken THEN tüm alan adları Türkçe olacak (örn: olusturma_tarihi, guncelleme_tarihi)

### Gereksinim 2: Organizasyon ve Kullanıcı Yönetimi

**Kullanıcı Hikayesi:** Bir şirket yöneticisi olarak, şube, departman, pozisyon ve personel yapısını yönetebilmek istiyorum, böylece organizasyonel hiyerarşiyi sistem üzerinden takip edebilim.

#### Kabul Kriterleri

1. WHEN yeni bir personel eklendiğinde THEN otomatik olarak bir kullanıcı hesabı oluşturulacak ve şifre olarak TC kimlik numarası atanacak
2. WHEN personel bilgileri girildiğinde THEN kişi, adres, telefon (morph), resim, doküman, not ve firma (morph) ile ilişkiler kurulacak
3. WHEN kullanıcı sisteme giriş yaptığında THEN son giriş zamanı, IP adresi ve oturum bilgileri loglanacak
4. WHEN kritik bir işlem yapıldığında THEN audit log tablosuna kullanıcı aktivitesi kaydedilecek
5. WHEN şüpheli bir aktivite tespit edildiğinde THEN sistem otomatik olarak güvenlik loguna kayıt yapacak
6. WHEN rol atanırken THEN Rol morph modeli ile esnek rol yönetimi sağlanacak

### Gereksinim 3: Lokasyon Yönetimi ve Hiyerarşik Yapı

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, şehir, ilçe, semt ve mahalle bilgilerini hiyerarşik olarak seçebilmek istiyorum, böylece mülk lokasyonlarını doğru şekilde tanımlayabilim.

#### Kabul Kriterleri

1. WHEN lokasyon seçimi yapılırken THEN şehir > ilçe > semt > mahalle zincirleme seçim komponenti çalışacak
2. WHEN bir üst seviye lokasyon seçildiğinde THEN alt seviye seçenekleri dinamik olarak güncellenecek
3. WHEN mahalle bilgisi girildiğinde THEN koordinat_x ve koordinat_y bilgileri opsiyonel olarak eklenebilecek
4. WHEN şube tanımlanırken THEN lokasyon ile ilişkilendirilebilecek ve koordinat bilgisi eklenebilecek
5. WHEN lokasyon verileri güncellendiğinde THEN ilgili tüm mülk ve şube kayıtları etkilenecek

### Gereksinim 4: Standart Form Bileşenleri ve UI Komponenti

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, tutarlı ve kullanıcı dostu form bileşenleri ile çalışmak istiyorum, böylece veri girişi hızlı ve hatasız olsun.

#### Kabul Kriterleri

1. WHEN form elemanları kullanıldığında THEN InputText, InputDate, InputNumber, InputCurrency, InputPhone, InputEmail, InputTc, InputCreditCard, Select, TextArea, Toggle, Checkbox, Radio, File Upload, Dropzone bileşenleri mevcut olacak
2. WHEN form elemanına odaklanıldığında THEN arkaplan amber-200 rengine dönüşecek
3. WHEN zorunlu alan belirtildiğinde THEN kırmızı * işareti gösterilecek
4. WHEN validasyon hatası oluştuğunda THEN hata mesajı text-xs italic kırmızı renkte gösterilecek
5. WHEN input-currency kullanıldığında THEN binlik ayırıcı nokta, kuruş ayırıcı virgül olacak ve döviz birimi seçilebilecek
6. WHEN input-phone kullanıldığında THEN 0(###)### #### formatında maskelenecek
7. WHEN input-tc kullanıldığında THEN 11 karakter sınırı olacak ve eksik girişte hata verecek

### Gereksinim 5: Modal ve Bildirim Sistemi

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sistem mesajlarını ve onay işlemlerini modal pencereler aracılığıyla görmek istiyorum, böylece önemli bilgileri kaçırmam.

#### Kabul Kriterleri

1. WHEN modal açıldığında THEN sağ üstte kaydet, temizle ve kapat ikonları sabit olarak bulunacak
2. WHEN modal dışına tıklandığında THEN modal kapanmayacak ancak ESC tuşu ile kapatılabilecek
3. WHEN modal boyutu belirtildiğinde THEN xs, sm, md, lg, 2xl seçenekleri veya manuel boyut (500x685) kullanılabilecek
4. WHEN confirm-modal açıldığında THEN onay mesajları için ayrı bir sınıf yönetimi olacak
5. WHEN sistem hatası oluştuğunda THEN message-modal ile hata mesajları gösterilecek
6. WHEN bildirim gönderildiğinde THEN error, success, warning türlerinde farklı ikon ve renklerle toastr sistemi çalışacak

### Gereksinim 6: Veri Tablosu ve Toplu İşlemler

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, mülk ve müşteri listelerini filtreleyebilmek, sıralayabilmek ve toplu işlemler yapabilmek istiyorum, böylece büyük veri setleriyle verimli çalışabilim.

#### Kabul Kriterleri

1. WHEN veri tablosu görüntülendiğinde THEN sıralama, filtreleme, arama, sütun yönetimi, export ve import özellikleri mevcut olacak
2. WHEN sütun yönetimi yapıldığında THEN drag-drop ile sıralama değiştirilebilecek ve kullanıcıya kaydedilecek
3. WHEN export işlemi yapıldığında THEN PDF, CSV, XLS, XLSX, TXT formatları desteklenecek
4. WHEN import işlemi yapıldığında THEN CSV, XLS, XLSX formatları desteklenecek
5. WHEN toplu seçim yapıldığında THEN checkbox ile seçim sayısı gösterilecek ve tüm tabloyu seçme uyarısı çıkacak
6. WHEN toplu işlem yapıldığında THEN pasif yapma, soft delete, geri alma, force delete seçenekleri confirm-modal ile onaylanacak

### Gereksinim 7: Mülk Yönetimi ve Dinamik Formlar

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, farklı mülk türleri (konut, işyeri, arsa, turistik tesis) için özelleştirilmiş formlar kullanmak istiyorum, böylece her mülk tipine uygun bilgileri girebilim.

#### Kabul Kriterleri

1. WHEN mülk kategorisi seçildiğinde THEN ilgili mülk tipleri dinamik olarak yüklenecek
2. WHEN mülk tipi seçildiğinde THEN Form klasöründeki ilgili blade dosyası (örn: Form/Konut/daire.blade.php) yüklenecek
3. WHEN mülk kaydedildiğinde THEN otomatik portföy numarası oluşturulacak
4. WHEN mülk özellikleri girildiğinde THEN dinamik özellik değerleri ayrı tabloda saklanacak
5. WHEN mülk formu doldurulurken THEN çok adımlı sihirbaz ile taslak kaydetme özelliği olacak

### Gereksinim 8: Müşteri ve İlişki Yönetimi

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, müşteri bilgilerini, taleplerini ve mülklerle olan ilişkilerini takip edebilmek istiyorum, böylece müşteri memnuniyetini artırabilirim.

#### Kabul Kriterleri

1. WHEN yeni müşteri eklendiğinde THEN kişi tablosundan temel bilgiler alınacak ve müşteri özel bilgileri eklenecek
2. WHEN müşteri talebi girildiğinde THEN çoklu mülk tipi, çoklu lokasyon, fiyat aralığı seçenekleri olacak
3. WHEN müşteri-mülk ilişkisi kurulduğunda THEN teklif, ilgi durumu, notlar kaydedilebilecek
4. WHEN müşteri etkileşimi yapıldığında THEN sunum, teklif, ziyaret, ilgi durumu geçmişi tutulacak
5. WHEN görüşme kaydedildiğinde THEN tarih, konu, sonuç, sonraki adım bilgileri saklanacak

### Gereksinim 9: İlan Yönetimi ve Platform Entegrasyonu

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, mülk ilanlarını farklı platformlarda yönetebilmek istiyorum, böylece geniş kitleye ulaşabilim.

#### Kabul Kriterleri

1. WHEN ilan oluşturulduğunda THEN Sahibinden, Hürriyet Emlak, Hepsiemlak, Kendi Sitesi, İlansız seçenekleri olacak
2. WHEN ilan platformda yayınlandığında THEN platform ID'si, link, durum, hata mesajı kaydedilecek
3. WHEN ilan güncellendiğinde THEN SEO bilgileri, başlık, açıklama düzenlenebilecek
4. WHEN platform API'si kullanıldığında THEN hata yönetimi ve loglama yapılacak
5. WHEN ilan performansı takip edildiğinde THEN görüntülenme sayısı ve maliyet bilgileri saklanacak

### Gereksinim 10: Randevu ve Takvim Sistemi

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, müşterilerle randevularımı planlayabilmek ve takip edebilmek istiyorum, böylece zamanımı verimli kullanabilim.

#### Kabul Kriterleri

1. WHEN randevu oluşturulduğunda THEN müşteri, mülk, personel, tarih, saat, lokasyon bilgileri girilecek
2. WHEN randevu zamanı yaklaştığında THEN e-posta, uygulama içi ve push notification gönderilecek
3. WHEN randevu tamamlandığında THEN sonuç, müşteri geri bildirimi, sonraki adım kaydedilebilecek
4. WHEN randevu çakışması olduğunda THEN sistem uyarı verecek
5. WHEN randevu iptal edildiğinde THEN ilgili taraflara bildirim gönderilecek

### Gereksinim 11: Medya ve Doküman Yönetimi

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, mülklere ait fotoğraf, video ve dokümanları organize edebilmek istiyorum, böylece müşterilere profesyonel sunum yapabilim.

#### Kabul Kriterleri

1. WHEN medya yüklendiğinde THEN fotoğraf, video, uydu görüntüsü, imar planı türleri desteklenecek
2. WHEN doküman yüklendiğinde THEN tapu, AutoCAD, sözleşme, fatura türleri kategorize edilecek
3. WHEN resim yüklendiğinde THEN otomatik thumbnail oluşturulacak ve ana görsel seçilebilecek
4. WHEN doküman gizli olarak işaretlendiğinde THEN sadece yetkili kullanıcılar erişebilecek
5. WHEN medya sıralanırken THEN drag-drop ile sıralama değiştirilebilecek

### Gereksinim 12: Fiyat Takibi ve Analiz

**Kullanıcı Hikayesi:** Bir emlak müdürü olarak, mülk fiyat değişikliklerini takip edebilmek ve piyasa analizleri yapabilmek istiyorum, böylece doğru fiyatlama stratejileri geliştirebilim.

#### Kabul Kriterleri

1. WHEN mülk fiyatı değiştirildiğinde THEN eski fiyat, yeni fiyat, değişiklik tarihi, nedeni kaydedilecek
2. WHEN fiyat geçmişi görüntülendiğinde THEN grafik ve tablo formatında gösterilecek
3. WHEN bölgesel analiz yapıldığında THEN benzer mülklerle karşılaştırma gösterilecek
4. WHEN fiyat anomalisi tespit edildiğinde THEN sistem otomatik uyarı verecek
5. WHEN piyasa trendi analiz edildiğinde THEN zaman bazlı fiyat değişimleri raporlanacak

### Gereksinim 13: Gelişmiş Arama ve Harita Entegrasyonu

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, çoklu kriterlere göre mülk arayabilmek ve harita üzerinde görebilmek istiyorum, böylece müşteri taleplerini hızlı karşılayabilim.

#### Kabul Kriterleri

1. WHEN gelişmiş arama yapıldığında THEN fiyat, metrekare, oda sayısı, lokasyon gibi çoklu kriterler kullanılabilecek
2. WHEN harita entegrasyonu kullanıldığında THEN Google Maps ile mülk konumları gösterilecek
3. WHEN arama kaydedildiğinde THEN kullanıcı için kayıtlı arama olarak saklanacak
4. WHEN AI öneri sistemi çalıştığında THEN müşteri geçmişine göre uygun mülkler önerilecek
5. WHEN arama sonuçları export edildiğinde THEN seçilen formatlarda dışa aktarılabilecek

### Gereksinim 14: Raporlama ve Dashboard

**Kullanıcı Hikayesi:** Bir emlak müdürü olarak, genel ve bireysel performans raporlarını görebilmek istiyorum, böylece iş süreçlerini optimize edebilim.

#### Kabul Kriterleri

1. WHEN dashboard açıldığında THEN genel performans metrikleri ve istatistikler gösterilecek
2. WHEN bireysel rapor oluşturulduğunda THEN personel bazında satış, kiralama, randevu istatistikleri gösterilecek
3. WHEN bölgesel analiz yapıldığında THEN lokasyon bazında performans raporları oluşturulacak
4. WHEN finansal rapor alındığında THEN komisyon hesaplamaları ve gelir analizleri gösterilecek
5. WHEN rapor export edildiğinde THEN PDF, XLSX formatlarında indirilebilecek

### Gereksinim 15: Mobil Uyumluluk ve PWA

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, sahada çalışırken mobil cihazımdan sisteme erişebilmek istiyorum, böylece müşteri ziyaretlerinde anlık bilgi güncelleyebilim.

#### Kabul Kriterleri

1. WHEN uygulama mobil cihazda açıldığında THEN responsive tasarım ile uyumlu görüntülenecek
2. WHEN kamera özelliği kullanıldığında THEN mülk fotoğrafları direkt çekilip yüklenebilecek
3. WHEN GPS özelliği kullanıldığında THEN mülk koordinatları otomatik alınabilecek
4. WHEN internet bağlantısı olmadığında THEN offline çalışma özelliği ile temel işlemler yapılabilecek
5. WHEN PWA olarak yüklendiğinde THEN push notification desteği çalışacak
### G
ereksinim 16: Sistem Performansı ve Güvenlik

**Kullanıcı Hikayesi:** Bir sistem yöneticisi olarak, uygulamanın hızlı, güvenli ve KVKK uyumlu çalışmasını istiyorum, böylece kullanıcılar sorunsuz çalışabilsin ve veri güvenliği sağlansın.

#### Kabul Kriterleri

1. WHEN sayfa yüklendiğinde THEN yükleme süresi 2 saniyeden az olacak
2. WHEN veritabanı sorgusu çalıştırıldığında THEN yanıt süresi 500ms'den az olacak
3. WHEN medya dosyaları yüklendiğinde THEN lazy loading ile performans optimize edilecek
4. WHEN kullanıcı şifresi saklandığında THEN bcrypt ile şifrelenecek
5. WHEN veri işlendiğinde THEN KVKV uyumlu saklama ve audit log tutulacak
6. WHEN SQL sorgusu çalıştırıldığında THEN SQL injection koruması aktif olacak

### Gereksinim 17: Ölçeklenebilirlik ve Yedekleme

**Kullanıcı Hikayesi:** Bir sistem yöneticisi olarak, sistemin büyüyen veri miktarını kaldırabilmesini ve düzenli yedekleme yapabilmesini istiyorum, böylece veri kaybı riski olmadan büyüyebilim.

#### Kabul Kriterleri

1. WHEN sistem kullanıldığında THEN 10.000+ kayıt desteği sorunsuz çalışacak
2. WHEN veri miktarı arttığında THEN MySQL clustering ile genişletilebilecek
3. WHEN yedekleme zamanı geldiğinde THEN otomatik veritabanı dump işlemi çalışacak
4. WHEN internet bağlantısı kesildiğinde THEN IndexedDB fallback ile temel veri erişimi sağlanacak
5. WHEN sistem yoğun kullanıldığında THEN performans metrikleri izlenecek

### Gereksinim 18: Kullanıcı Deneyimi ve Erişilebilirlik

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, tamamen Türkçe arayüzde, erişilebilir ve kullanıcı dostu bir deneyim yaşamak istiyorum, böylece sistemi verimli kullanabilim.

#### Kabul Kriterleri

1. WHEN uygulama açıldığında THEN tamamen Türkçe arayüz gösterilecek
2. WHEN klavye ile navigasyon yapıldığında THEN tüm öğeler erişilebilir olacak
3. WHEN renk kontrastı kontrol edildiğinde THEN WCAG 2.1 standartlarına uygun olacak
4. WHEN responsive tasarım test edildiğinde THEN masaüstü odaklı ama mobil benzeri deneyim sunacak
5. WHEN kullanıcı arayüzü öğeleri incelendiğinde THEN tutarlı tasarım dili kullanılacak### Gerek
sinim 19: Rol Tabanlı Erişim Kontrolü ve Güvenlik

**Kullanıcı Hikayesi:** Bir sistem yöneticisi olarak, farklı kullanıcı rollerine göre erişim kontrolü yapabilmek istiyorum, böylece veri güvenliği ve yetki yönetimi sağlansın.

#### Kabul Kriterleri

1. WHEN kullanıcı sisteme giriş yaptığında THEN rol tablosundan yetkileri kontrol edilecek
2. WHEN bir işlem yapılmaya çalışıldığında THEN policy tabanlı yetki kontrolü çalışacak
3. WHEN rol değişikliği yapıldığında THEN kullanıcının erişim yetkileri otomatik güncellenecek
4. WHEN hassas veri erişimi yapıldığında THEN ek güvenlik kontrolü devreye girecek
5. WHEN yetki ihlali tespit edildiğinde THEN sistem otomatik log kaydı yapacak ve erişimi engelleyecek

### Gereksinim 20: Gelişmiş Mülk Yönetimi ve Dinamik Özellikler

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, mülk özelliklerini JSON formatında esnek şekilde saklayabilmek ve çok adımlı formlarla mülk girişi yapabilmek istiyorum, böylece farklı mülk tiplerinin özel özelliklerini yönetebilim.

#### Kabul Kriterleri

1. WHEN mülk özellikleri girildiğinde THEN dinamik özellik değerleri JSON formatında + pivot tablo ile saklanacak
2. WHEN mülk formu doldurulurken THEN çok adımlı sihirbaz ile adım adım veri girişi yapılabilecek
3. WHEN form yarıda bırakıldığında THEN taslak kaydetme özelliği ile veri korunacak
4. WHEN Form klasörü tarandığında THEN Konut, İşyeri, Arsa, Turistik Tesis alt klasörlerindeki formlar otomatik yüklenecek
5. WHEN mülk kaydedildiğinde THEN resim, galeri, doküman morph ilişkileri kurulacak

### Gereksinim 21: Kapsamlı Müşteri ve Mülk Sahibi Yönetimi

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, kişilerin hem müşteri hem mülk sahibi olabilmesini ve detaylı talep kayıtlarını tutabilmek istiyorum, böylece müşteri ilişkilerini daha iyi yönetebilim.

#### Kabul Kriterleri

1. WHEN kişi kaydı oluşturulduğunda THEN müşteri, mülk sahibi veya her ikisi olarak işaretlenebilecek
2. WHEN müşteri talebi girildiğinde THEN detaylı bütçe, lokasyon tercihleri, özel istekler kaydedilecek
3. WHEN müşteri-mülk ilişkisi kurulduğunda THEN ilgi durumu, teklifler, detaylı notlar saklanacak
4. WHEN müşteri etkileşimi yapıldığında THEN ziyaret, teklif, sunum geçmişi detaylı tutulacak
5. WHEN müşteri durumu güncellendiğinde THEN otomatik bildirim ve takip sistemi çalışacak

### Gereksinim 22: Gelişmiş Randevu ve CRM Etkileşim Sistemi

**Kullanıcı Hikayesi:** Bir emlak danışmanı olarak, randevularımı detaylı şekilde yönetebilmek ve müşteri etkileşimlerinin tam geçmişini tutabilmek istiyorum, böylece CRM süreçlerimi optimize edebilim.

#### Kabul Kriterleri

1. WHEN randevu oluşturulduğunda THEN müşteri, mülk, personel, tarih, konu, beklenen sonuç girilecek
2. WHEN randevu tamamlandığında THEN detaylı sonuç, müşteri tepkisi, sonraki adım planı kaydedilecek
3. WHEN müşteri-mülk etkileşimi yapıldığında THEN her etkileşim türü (telefon, e-posta, yüz yüze) ayrı kaydedilecek
4. WHEN görüşme geçmişi görüntülendiğinde THEN kronolojik sırada tüm etkileşimler listelenecek
5. WHEN sonraki adım planlandığında THEN otomatik hatırlatma ve takip sistemi devreye girecek### Gerek
sinim 23: Morph Modelleri ve Esnek Veri Yapısı

**Kullanıcı Hikayesi:** Bir sistem yöneticisi olarak, telefon, kategori, rol, firma, not gibi ortak verilerin morph ilişkilerle yönetilmesini istiyorum, böylece veri tekrarı olmadan esnek bir yapı kurabilirim.

#### Kabul Kriterleri

1. WHEN telefon bilgisi girildiğinde THEN Telefon morph modeli ile kişi, müşteri, personel için ortak yönetim sağlanacak
2. WHEN kategori seçimi yapıldığında THEN Kategori morph modeli ile alt kategorili hiyerarşik yapı desteklenecek
3. WHEN rol atanırken THEN Rol morph modeli ile esnek rol yönetimi ve yetkilendirme sağlanacak
4. WHEN firma bilgisi girildiğinde THEN Firma morph modeli ile müşteri ve personel geçmiş deneyimleri yönetilebilecek
5. WHEN not eklenmek istendiğinde THEN Not morph modeli ile tüm ana modellerde ek bilgi saklanabilecek

### Gereksinim 24: Enum Yönetimi ve Seçim Listeleri

**Kullanıcı Hikayesi:** Bir geliştirici olarak, seçim listelerinin enum ile yönetilmesini istiyorum, böylece tek yerden tüm seçenekleri kontrol edebilirim.

#### Kabul Kriterleri

1. WHEN cinsiyet seçimi yapıldığında THEN enum değerleri kullanılacak (erkek, kadin)
2. WHEN medeni durum seçildiğinde THEN enum değerleri kullanılacak (bekar, evli, dul, bosanmis)
3. WHEN adres tipi seçildiğinde THEN enum değerleri kullanılacak (ev, is, fatura, diger)
4. WHEN mülk durumu seçildiğinde THEN enum değerleri kullanılacak
5. WHEN sistem genelinde sabit seçenekler kullanıldığında THEN enum yapısı tercih edilecek

### Gereksinim 25: Dinamik Veri Ekleme ve Modal Entegrasyonu

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, form doldururken eksik veri olduğunda modal açarak hızlıca ekleyebilmek istiyorum, böylece iş akışım kesintiye uğramasın.

#### Kabul Kriterleri

1. WHEN form doldurulurken eksik veri tespit edildiğinde THEN yanında + ikonu veya "Ekle" butonu gösterilecek
2. WHEN + ikonuna tıklandığında THEN modal açılarak yeni veri girişi yapılabilecek
3. WHEN modal'da veri kaydedildiğinde THEN ana forma geri dönülecek ve yeni veri seçili olacak
4. WHEN modal kapatıldığında THEN ana form verisi korunacak ve kullanıcı kaldığı yerden devam edecek
5. WHEN dinamik ekleme yapıldığında THEN ilgili model, migration ve seeder yapıları Laravel tarzı organize edilecek
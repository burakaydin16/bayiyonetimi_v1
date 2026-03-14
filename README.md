# Su Dağıtım ve Depozito Takip Sistemi (UI)

Bu proje, su dağıtım firmaları için stok, cari, depozito (palet, damacana) ve sevkiyat takibi yapmak amacıyla geliştirilmiştir.

## Kurulum

1.  Projeyi klonlayın.
2.  `npm install` komutu ile bağımlılıkları yükleyin.
3.  `.env` dosyasını kontrol edin.
4.  `npm run dev` ile projeyi başlatın.

## Docker ile Çalıştırma

Projeyi Docker üzerinde çalıştırmak için:

1.  İmajı oluşturun:
    ```bash
    docker build -t bayi-yonetimi-ui .
    ```
2.  Konteyneri başlatın:
    ```bash
    docker run -p 8080:80 bayi-yonetimi-ui
    ```
Uygulama `http://localhost:8080` adresinde çalışacaktır.
-----------------------------------------------------------------
Uygulama canlı ortamda : 'https://nisanaydin.com.tr/' adresinde çalışmaktadır.
-----------------------------------------------------------------
backend adresi swagger : 'https://api.nisanaydin.com.tr/swagger/index.html'
-----------------------------------------------------------------

## Dokploy / GitHub Deployment

1.  Bu projeyi GitHub deponuza gönderin.
2.  Dokploy panelinde yeni bir **Service** oluşturun.
3.  GitHub deponuzu bağlayın.
4.  Dokploy projenizdeki `Dockerfile`'ı otomatik olarak algılayacaktır.
5.  Eğer farklı bir API URL kullanmak isterseniz, Dokploy panelinde `VITE_API_URL` çevre değişkenini ekleyin.

## Özellikler

-   **Stok Takibi:** Dolu su, boş damacana, palet stoklarının anlık takibi.
-   **Cari Hesap:** Müşteri bazlı para ve depozito (emanet) bakiyesi.
-   **Hareket İşleme:** Satış, iade ve stok giriş/çıkış işlemleri.
-   **Raporlama:** Özet grafikler ve listeler.

## Teknoloji

-   React 19
-   TypeScript
-   Vite
-   Tailwind CSS
-   Lucide React (İkonlar)
-   Recharts (Grafikler)

## API Bağlantısı

Uygulama, özel bir backend servisine bağlanır. API URL'i `services/apiService.ts` dosyasında tanımlıdır.

Burak Aydın
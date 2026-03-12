# Su Dağıtım ve Depozito Takip Sistemi (UI)

Bu proje, su dağıtım firmaları için stok, cari, depozito (palet, damacana) ve sevkiyat takibi yapmak amacıyla geliştirilmiştir.

## Kurulum

1.  Projeyi klonlayın.
2.  `npm install` komutu ile bağımlılıkları yükleyin.
3.  `.env` dosyasını kontrol edin.
4.  `npm run dev` ile projeyi başlatın.

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
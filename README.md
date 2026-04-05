# ⚖️ Emsal.AI : YZ Destekli Hukuki Araştırma ve Analiz Asistanı

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![React](https://img.shields.io/badge/react-18.0%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-green)

*GDG Hackathon için DONTSMOKE ekibi tarafından geliştirilmiştir.*

**Emsal.AI**, avukatlar, stajyerler ve hukuk profesyonelleri için geliştirilmiş, gücünü **Google Gemini 2.5**'ten alan yenilikçi bir hukuki asistan platformudur. Doğal dille yazılan karmaşık hukuki olayları anlamsal (semantik) olarak işler; ilgili kanun maddelerini ve en uygun Yargıtay/Danıştay **emsal kararlarını** saniyeler içinde bularak analiz eder.

---

## 📑 İçindekiler
- [Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
- [Nasıl Çalışır?](#-nasıl-çalışır)
- [Kullanılan Teknolojiler (Tech Stack)](#-kullanılan-teknolojiler-tech-stack)
- [Proje Kurulumu ve Çalıştırma](#-proje-kurulumu-ve-çalıştırma)
- [Proje Klasör Yapısı](#-proje-klasör-yapısı)
- [Yasal Uyarı](#-yasal-uyarı-sorumluluk-reddi)
- [Ekip](#-ekip)

---

## 🚀 Öne Çıkan Özellikler

- **Çift Yönlü Analiz Motoru:** 
  - *Kanun Motoru:* Olayın hangi kanun/madde kapsamına girdiğini tespit eder.
  - *Emsal Motoru:* En uygun kararları bulur, eşleştirir, yorumlar ve alternatif görüşler sunar.
- **Anlık Akış (Streaming - SSE):** ChatGPT benzeri kesintisiz yanıt akışı sayesinde bekleme sürelerini ortadan kaldırır.
- **Oturum ve Geçmiş Yönetimi:** Supabase destekli kullanıcı girişi ile yapılan analizler kaydedilir ve daha sonra incelenebilir.
- **PDF Raporlama:** Bulunan yasaları ve analiz edilen emsal kararları tek tıkla PDF formatında dışa aktarma imkanı sunar.

---

## 🧠 Nasıl Çalışır?

1. **Olayın Tanımlanması:** Kullanıcı, platforma hukuki uyuşmazlığı günlük dille ve detaylıca yazar (Örn: *“Müvekkilimin köpeği komşunun bahçesine girip bisikleti parçalamış...”*).
2. **Semantik İşleme:** Sistem, bu metni "kelime-kelime" değil "anlam bütünlüğü" çerçevesinde işler.
3. **Paralel API İstekleri:**
   - İlk istek, olayın temel kanuni dayanaklarını araştırır.
   - İkinci istek, ilgili Yargıtay/Danıştay kararlarının veri havuzunu tarar, olaya en uygun "baş karar" ile diğer "alternatif kararları" analiz ederek listeler.
4. **Sonuçların Sunulması:** Tüm bulgular ayrıştırılmış sekmelerde anlık olarak ve okunabilir bir formatta ekrana dökülür.

---

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS | Hızlı, modern ve responsive kullanıcı arayüzü |
| **Backend** | Python, FastAPI, Uvicorn | Yüksek performanslı, asenkron API ve SSE desteği |
| **Yapay Zeka** | Google Gemini 2.5 Flash Lite API | Hukuki metin analizi, semantik arama ve özetleme |
| **Veritabanı & Auth** | Supabase | Güvenli kullanıcı kimlik doğrulaması ve arama geçmişi loglama |
| **Araçlar** | Axios, html2pdf.js, Lucide Icons | API haberleşmesi, PDF export ve arayüz ikonları |

---

## 💻 Proje Kurulumu ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

### Ön Koşullar
- [Node.js](https://nodejs.org/) (v16 veya üzeri)
- [Python](https://www.python.org/) (v3.8 veya üzeri)
- Supabase hesabı ve projesi (Auth ve DB için)
- Google Gemini API Key

### 1. Backend Kurulumu (FastAPI)
```bash
# Backend klasörüne gidin
cd backend

# Sanal ortam (virtual environment) oluşturun
python -m venv venv

# Sanal ortamı aktifleştirin (Mac/Linux)
source venv/bin/activate
# (Windows için: venv\Scripts\activate)

# Gerekli kütüphaneleri yükleyin
pip install -r requirements.txt
```

**Ortam Değişkenleri (.env):**
`backend` klasörü içerisine `.env` adında bir dosya oluşturun ve API anahtarınızı ekleyin:
```env
API_KEY=sizin_gemini_api_anahtariniz
# Opsiyonel: API_KEY_2=sizin_ikinci_api_anahtariniz
# Google Service Account JSON Dosyası için örnek path:
# GOOGLE_APPLICATION_CREDENTIALS="../dontsmoke-xyz.json"
```

**Sunucuyu Başlatma:**
```bash
uvicorn main:app --reload
# API, http://127.0.0.1:8000 adresinde ayağa kalkacaktır.
```

### 2. Frontend Kurulumu (React/Vite)
Yeni bir terminal penceresinde:
```bash
# Frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin
npm install
```

**Ortam Değişkenleri (.env):**
`frontend` klasöründe `.env` (veya `.env.local`) dosyası oluşturun:
```env
VITE_SUPABASE_URL=sizin_supabase_proje_url'niz
VITE_SUPABASE_ANON_KEY=sizin_supabase_anon_anahtariniz
```

**Uygulamayı Başlatma:**
```bash
npm run dev
# Uygulama http://localhost:5173 adresinde çalışacaktır.
```

---

## 📂 Proje Klasör Yapısı

```text
Emsal.AI/
├── backend/                 # Python/FastAPI Backend Dosyaları
│   ├── main.py              # API Endpoint'leri ve SSE Akış Mantığı
│   ├── dontsmoke-*.json     # Google Service Account Credentials
│   └── requirements.txt     # Python bağımlılıkları
├── frontend/                # React/Vite Frontend Dosyaları
│   ├── src/
│   │   ├── components/      # UI Bileşenleri (LawTab.jsx, PrecedentTab.jsx)
│   │   ├── App.jsx          # Ana Uygulama Dosyası
│   │   ├── index.css        # Tailwind Direktifleri ve Tema
│   │   ├── main.jsx         # React Render Noktası
│   │   └── supabaseClient.js# Veritabanı ve Auth Konfigürasyonu
│   ├── index.html           # Uygulama Giriş Noktası
│   ├── package.json         # Node.js bağımlılıkları
│   └── vite.config.js       # Vite ayarları
├── scripts/                 # Kod manipülasyonu ve otomasyon scriptleri
│   └── *.py                 # Geliştirici scriptleri
├── docs.md                  # Proje takip ve notasyon dökümanı
└── README.md                # Şu an okuduğunuz döküman
```

---

## ⚖️ Yasal Uyarı (Sorumluluk Reddi)

**Emsal.AI**, yapay zeka destekli bir "Hukuki Araştırma ve Analiz Asistanı"dır. Üretilen içerikler, kanun maddeleri veya sunulan emsal kararlar **hukuki tavsiye veya mütalaa niteliği taşımaz**. 
Hukuki bir aksiyon almadan önce tüm bulguların yetkili bir avukat veya hukuk profesyoneli tarafından teyit edilmesi zorunludur. Sistem, doğabilecek maddi veya manevi zararlardan sorumlu tutulamaz.

---

## 👥 Ekip (DONTSMOKE)
Bu proje **GDG Hackathon** kapsamında geliştirilmiştir.

# Haklı-Hak: YZ Destekli Hukuki Asistan (GDG Hackathon - DONTSMOKE)

## 📌 Proje Özeti
Haklı-Hak (veya benzeri bir isim), hukukta kanunların genel ve soyut tanımlarından sıyrılarak, gerçek hayattaki karmaşık olaylara en uygun **Emsal Kararları** (Yargıtay/Danıştay) saniyeler içinde bulan ve analiz eden, Gemini destekli bir **Anlamsal Arama ve Karşılaştırmalı Analiz** motorudur.

---

## 🏛️ 1. Problem Tanımı ve Önemi (15 Puan)
**Problem:** Hukukta kanunlar genel ve soyuttur; gerçek hayattaki karmaşık olaylar genellikle kanunlarda birebir yer almaz. Bu noktada davaların kaderini "Emsal Kararlar" belirler. Ancak avukatlar ve stajyerler, binlerce sayfalık dava dosyaları ve yığınla mahkeme kararı arasında doğru emsali bulmak için günlerini harcamaktadır.
**Önemi:** Gözden kaçan tek bir emsal karar, davanın kaybedilmesine, adaletin gecikmesine ve ciddi maddi/manevi kayıplara yol açabilir. Zamanın çok değerli olduğu hukuk sektöründe bu manuel süreç büyük bir darboğazdır.

---

## 💡 2. Yenilikçilik (Innovation) (15 Puan)
Standart bir "hukuk arama motoru" kelime bazlı (keyword) arama yapar. Bizim yeniliğimiz **"Anlamsal (Semantic) Arama ve Karşılaştırmalı Analiz"** yapmamızdır.
**Çift Yönlü Motor (Dual-Engine):**
1.  **Kanun Motoru:** Olayın direkt hangi kanun/madde kapsamına girdiğini tespit eder.
2.  **Emsal & Analiz Motoru (Gemini Destekli):** Kanunda boşluk varsa veya olay karmaşıksa Google Search entegreli **Gemini API** ile web'den/veri tabanından emsalleri çeker. Sadece listelemekle kalmaz; kararları okur, olayınızla karşılaştırır, en yüksek eşleşme oranına sahip Emsal'i "Baş Karar" olarak öne çıkarır ve diğerlerini "Alternatif Görüşler" olarak özetler.

---

## 🌍 3. Etki ve Gerçek Dünya Kullanılabilirliği (10 Puan)
- **Zaman ve Maliyet Tasarrufu:** Avukatların 15-20 saatini alan araştırma sürecini saniyelere indirir.
- **Adalete Erişim:** Sadece büyük hukuk bürolarının değil, tek başına çalışan avukatların da güçlü bir araştırma asistanına sahip olmasını sağlar.
- **Kullanılabilirlik:** Kullanıcı dostu, sade bir arayüzle (bir chat veya arama çubuğu) herkesin anlayabileceği raporlar üretir.

---

## 🎭 4. Sunum ve Anlatım Stratejisi (25 Puan)
- **Hikayeleştirme (Storytelling):** Sunum teknik detaylarla değil, bir hikaye ile başlayacak. *"Bu Ayşe. Genç bir avukat. Yarın çok kritik bir davası var ve müvekkilinin durumu kanunlarda tam geçmiyor. Bütün gece emsal karar aramak zorunda..."*
Ardından problemin çözümü (uygulamamız) sahnede gösterilecek.
- **Jüriyi Etkileme:** İki faza odaklanılacaktır: 
  1) Yasayı bulmak kolaydır, 2) Yasanın yetmediği yerde uygun emsali yorumlamak asıl zekadır. Platformun bu "yorumlama ve kıyaslama" yeteneği vurgulanacaktır.

---

## 🛠️ 5. Teknik Uygulama ve Demo (25 Puan)
3 kişilik ekibin iş bölümü şu şekildedir:

- **Frontend (Kişi 1):** Modern ve temiz bir UI (React/Vite vb.). Sol tarafta olayın yazılacağı bir metin kutusu, sağ tarafta 2 sekme ("İlgili Kanunlar" ve "Emsal Kararlar Analizi").
- **Backend & Prompt Engineering (Kişi 2 & 3):** Node.js / Python (FastAPI). Gemini API isteklerinin yönetilmesi. *"Grounding with Google Search"* özelliği kullanılarak modelin uydurması (hallucination) önlenecektir.

**Teknik Akış:**
1.  **Kullanıcı olayı yazar:** *"Müvekkilimin köpeği komşunun bahçesindeki bisikleti ısırdı."*
2.  **API 1 (Sistem Promptu 1):** Türk Borçlar Kanunu - Hayvan Bulunduranın Sorumluluğu vb. maddeleri getirir.
3.  **API 2 (Sistem Promptu 2 + Google Search):** İnternetteki emsal Yargıtay kararlarını tarar. Gemini'ye şu prompt atılır: *"Aşağıdaki davaları analiz et, en benzerini seç, neden benzediğini açıkla ve diğerlerini kısaca özetle."*

---

## ⚖️ 6. Etik, Güvenlik ve Sorumluluk (10 Puan)
- **Halüsinasyon Önleme (Grounding):** AI'ın sadece bulduğu gerçek kararlar/linkler üzerinden konuşmasını, bilmediği yerde "Emsal bulunamadı" demesini zorunlu kılıyoruz. (Grounding with Google Search).
- **Sorumluluk Reddi (Disclaimer / Human-in-the-loop):** Platform bir "Hakim veya Avukat" değildir, yalnızca bir "Araştırma Asistanı"dır. Son kararın ve teyidin avukat tarafından yapılması gerektiği sistemde uyarı olarak gösterilir.
- **Veri Gizliliği:** Kullanıcıların girdiği hukuki olaylar veya kişisel veriler, yapay zeka modellerini eğitmek için **kesinlikle saklanmaz**.

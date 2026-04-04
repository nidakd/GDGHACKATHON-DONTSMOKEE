import { useState, useRef } from 'react';
import LawTab from './components/LawTab';
import PrecedentTab from './components/PrecedentTab';
import { Bot, Scale, Search, Shield, Sparkles, BookOpen, BrainCircuit, ArrowRight, Loader } from 'lucide-react';

function App() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  
  const searchRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults(null);
    
    // Ekranda arama kısmına odaklanma (Kaydırma)
    searchRef.current.scrollIntoView({ behavior: 'smooth' });

    // Simülasyon
    setTimeout(() => {
      setResults({
        laws: [
          {
            title: "Türk Borçlar Kanunu - Madde 67",
            description: "Hayvan bulunduranın sorumluluğu. Bir hayvanın bakımını üstlenen kişi, hayvanın başkasına verdiği zararı gidermekle yükümlüdür.",
            relevance: "Yüksek",
          }
        ],
        precedents: [
          {
            summary: "Yargıtay 3. Hukuk Dairesi, 2018/1429 E., 2019/3310 K.",
            details: "Köpeğin tasmasız dolaştırılması sebebiyle üçüncü kişilere verilen zararda, hayvan sahibinin gerekli özen yükümlülüğünü yerine getirmemiş olması nedeniyle tazminat ödemesine hükmedilmiştir.",
            matchRate: "%92 Eşleşme",
            isMain: true
          },
          {
            summary: "Yargıtay 4. Hukuk Dairesi, 2015/842 E.",
            details: "Hayvanın verdiği zarar nedeniyle hayvan güdücüsünün sadece tedbir almadığı için sorumlu tutulabileceği durumu.",
            matchRate: "%75 Eşleşme",
            isMain: false
          }
        ]
      });
      setIsSearching(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* HEADER / NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/30">
                <Scale size={24} />
              </div>
              <span className="text-2xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">
                Haklı-Hak
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#nasil-calisir" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Nasıl Çalışır?</a>
              <a href="#arama-motorlari" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Teknolojimiz</a>
              <button onClick={() => searchRef.current.scrollIntoView({ behavior: 'smooth' })} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md">
                Hemen Dene
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION (Storytelling) */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Dekoratif Arka Plan Parçaları */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-[30rem] h-[30rem] bg-indigo-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <Sparkles size={16} className="text-blue-500" />
            <span>Yapay Zeka Destekli Hukuki Asistan</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight">
            Günler Süren Emsal Karar Aramaya <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Son Verin.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Hukuki olayınızı anlatın. Çift yönlü motorumuz sadece ilgili <strong>Kanun Maddelerini</strong> bulmakla kalmaz; Google entegreli Gemini Yapay Zekası ile binlerce <strong>Yargıtay Emsalini</strong> okur, karşılaştırır ve davanıza en uygun olanı saniyeler içinde karşınıza çıkarır.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => searchRef.current.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-xl shadow-blue-500/20 transition-all hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Asistanı Başlat</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR & ÇİFT YÖNLÜ MOTOR */}
      <section id="arama-motorlari" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Çift Yönlü Motor (Dual-Engine) Teknolojisi</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Standart kelime aramalarını unutun. Haklı-Hak'ın altyapısını oluşturan iki güçlü motor sayesinde davanızı hiçbir boşluk kalmayacak şekilde analiz ediyoruz.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Engine 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BookOpen size={120} />
              </div>
              <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">1. Kanun Motoru</h3>
              <p className="text-slate-600 leading-relaxed">
                Yazdığınız olayı anlamsal (semantic) olarak tarar. Olayın direkt hangi kanun, yönetmelik veya madde kapsamına girdiğini tespit eder. (Örn: Borçlar Kanunu - Hayvan Bulunduranın Sorumluluğu)
              </p>
            </div>

            {/* Engine 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BrainCircuit size={120} />
              </div>
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
                <BrainCircuit size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">2. Emsal & Analiz Motoru <span className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-md ml-2 align-middle">Gemini</span></h3>
              <p className="text-slate-600 leading-relaxed">
                Kanunda boşluk varsa veya olay karmaşıksa devreye girer. Google Search entegreli (Grounding) yeteneğiyle web'den emsalleri çeker. En yüksek eşleşme oranına sahip kararı "Baş Karar" olarak analiz ederek size sunar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* APP INTERFACE (Arama Yapılan Ana Kısım) */}
      <section ref={searchRef} className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">Hukuki Olayı Anlatın</h2>
            <p className="text-slate-500">Kısa ama detaylı şekilde müvekkilinizin veya karşılaştığınız durumu aşağıya yazın.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-2 overflow-hidden transition-all duration-500 ring-4 ring-slate-50/50 focus-within:ring-blue-50">
            <form onSubmit={handleSearch} className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isSearching}
                placeholder="Örn: Müvekkilimin köpeği, kapısı açık bırakılan komşu bahçesine girip bisikleti ısırdı..."
                className="w-full h-40 sm:h-48 resize-none p-6 text-lg text-slate-700 bg-transparent placeholder-slate-400 focus:outline-none"
              />
              <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                <div className="flex items-center text-xs text-slate-400">
                  <Shield size={14} className="mr-1" />
                  Gizlilik güvencesi altında
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !query.trim()}
                  className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Analiz Ediliyor...</span>
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      <span>Emsal Bul</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* SONUÇLAR ALANI */}
          <div className={`mt-12 transition-all duration-700 ease-out origin-top ${results || isSearching ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0 overflow-hidden'}`}>
            
            {isSearching && (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-blue-50/50 rounded-3xl border border-blue-100">
                <Bot size={48} className="text-blue-500 animate-bounce mb-6" />
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">Yapay Zeka Çalışıyor</h3>
                <p className="text-slate-500 max-w-sm animate-pulse">Kanun maddeleri çıkarılıyor ve Yargıtay arşivleri taranarak en uygun emsal karar bulunuyor...</p>
              </div>
            )}

            {results && !isSearching && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
                
                {/* Sonuç Özeti Başlığı */}
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-2xl font-bold font-serif text-slate-900">Analiz Raporu</h3>
                  <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center"><ShieldCheck size={16} className="mr-1"/> Başarıyla Tamamlandı</span>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                  {/* Kanunlar (Sol Kolon) */}
                  <div className="md:col-span-5 relative">
                    <LawTab laws={results.laws} />
                  </div>
                  
                  {/* Emsal Kararlar (Sağ Kolon) */}
                  <div className="md:col-span-7">
                    <PrecedentTab precedents={results.precedents} />
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <Scale size={32} className="text-slate-600 mb-4" />
          <p className="mb-2">GDG Hackathon - DONTSMOKE Takımı</p>
          <p className="max-w-xl text-xs text-slate-500">Bu platform bir "Hakim veya Avukat" değildir, yalnızca bir "Araştırma Asistanı"dır. Son karar ve teyit her zaman insan tarafından yapılmalıdır.</p>
        </div>
      </footer>

    </div>
  );
}

export default App;

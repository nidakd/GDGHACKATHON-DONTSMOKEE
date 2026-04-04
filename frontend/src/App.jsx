import { useState, useRef } from 'react';
import LawTab from './components/LawTab';
import PrecedentTab from './components/PrecedentTab';
import { Bot, Scale, Search, Shield, Sparkles, BookOpen, BrainCircuit, ArrowRight, Loader, ShieldCheck, Download } from 'lucide-react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

function App() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const searchRef = useRef(null);
  const pdfRef = useRef(null);

  const handleExportPDF = () => {
    if (pdfRef.current) {
      const opt = {
        margin: 0.5,
        filename: 'Emsal_AI_Analiz_Raporu.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(pdfRef.current).save();
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults(null);
    setError('');

    if (searchRef.current) {
        searchRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const [lawRes, precedentRes] = await Promise.all([
        axios.post('http://127.0.0.1:8000/api/laws', { olay_metni: query }),
        axios.post('http://127.0.0.1:8000/api/precedents', { olay_metni: query })
      ]);

      setResults({
        lawsMarkdown: lawRes.data.kanunlar,
        precedentsMarkdown: precedentRes.data.emsaller,
      });

    } catch (err) {
      setError('Arama sırasında bir hata oluştu. Lütfen arka plan servisinizin çalıştığından emin olun.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#FFC000]/30 selection:text-[#9C1A15]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      
      {/* HEADER / NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-[#9C1A15] to-[#7a1410] p-2 rounded-lg text-white shadow-lg shadow-[#9C1A15]/30">
                <Scale size={24} />
              </div>
              <span className="text-2xl font-bold text-[#9C1A15]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Emsal.AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#arama-motorlari" className="text-lg font-bold text-slate-600 hover:text-[#9C1A15] transition-colors">Nasıl Çalışır?</a>
            </div>
          </div>
        </div>
      </nav>

      {/* APP INTERFACE (Brought to the very top as requested) */}
      <section ref={searchRef} className="min-h-screen flex flex-col justify-center bg-white relative pt-24 pb-12">
        <div className="max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#9C1A15] tracking-tight mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Hukuki Olayı Anlatın</h1>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">Kısa ama detaylı şekilde müvekkilinizin veya karşılaştığınız durumu buraya yazın. Çift yönlü motorumuz saniyeler içinde kanunları ve emsalleri bulsun.</p>
          </div>

          <div className="flex flex-col flex-col-reverse justify-end w-full">
            
            {/* SONUÇLAR ALANI (Genişlik max-w-4xl yerine mx-auto max-w-[90rem] kullanılarak artırıldı) */}
            <div className={`transition-all duration-700 ease-out origin-top ${results || isSearching ? 'opacity-100 scale-100 mb-12' : 'opacity-0 scale-95 h-0 overflow-hidden mb-0'}`}>
              
              {isSearching && (
                <div className="flex items-center justify-center p-12 bg-transparent">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-[#FFC000] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-3 h-3 bg-[#9C1A15] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-3 h-3 bg-[#FFC000] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="text-sm font-bold text-[#9C1A15] animate-pulse">Emsal.AI kanun maddelerini ve emsal kararları analiz ediyor...</p>
                  </div>
                </div>
              )}

              {results && !isSearching && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                  
                  {/* Sonuç Özeti Başlığı ve Çıktı Butonları */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 mt-8">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-3xl font-bold font-serif text-slate-900">Analiz Raporu</h3>
                      <span className="text-sm font-medium bg-[#FFC000]/20 text-[#9C1A15] px-3 py-1 rounded-full flex items-center shadow-sm border border-[#FFC000]/30">
                        <ShieldCheck size={16} className="mr-1"/> Başarıyla Tamamlandı
                      </span>
                    </div>
                    {/* PDF İndir Butonu */}
                    <button 
                      onClick={handleExportPDF}
                      className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 group"
                    >
                      <Download size={18} className="text-[#9C1A15] group-hover:-translate-y-1 transition-transform" />
                      <span>PDF İndir</span>
                    </button>
                  </div>

                  {/* PDF İÇİN REF ALANI */}
                  {/* Geri plan rengi beyaz */}
                  <div ref={pdfRef} className="grid md:grid-cols-12 gap-8 p-6 bg-white rounded-2xl">
                    {/* Kanunlar (Sol Kolon) */}
                    <div className="md:col-span-4 relative">
                      <LawTab markdown={results.lawsMarkdown} />
                    </div>
                    
                    {/* Emsal Kararlar (Sağ Kolon) */}
                    <div className="md:col-span-8">
                      <PrecedentTab markdown={results.precedentsMarkdown} />
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* ARAMA FORMU */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-[#9C1A15]/5 border border-slate-100 p-2 overflow-hidden transition-all duration-500 ring-4 ring-[#FFC000]/10 focus-within:ring-[#FFC000]/30 mb-8 max-w-4xl mx-auto w-full">
              <form onSubmit={handleSearch} className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isSearching}
                  placeholder="Kısa ama detaylı şekilde müvekkilinizin veya karşılaştığınız durumu buraya yazın."
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
                    className="bg-[#9C1A15] hover:bg-[#7a1410] disabled:bg-slate-300 text-white px-8 py-3.5 rounded-xl font-bold flex items-center space-x-2 transition-colors disabled:cursor-not-allowed shadow-lg shadow-[#9C1A15]/20"
                  >
                    {isSearching ? (
                      <>
                        <Loader size={18} className="animate-spin text-white" />
                        <span>Analiz Ediliyor...</span>
                      </>
                    ) : (
                      <>
                        <Search size={18} className="text-[#FFC000]" />
                        <span>Emsal Bul</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* NASIL ÇALIŞIR & ÇİFT YÖNLÜ MOTOR */}
      <section id="arama-motorlari" className="py-24 bg-slate-50 border-y border-slate-200 mt-12">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">Çift Yönlü Motor (Dual-Engine) Teknolojisi</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Standart kelime aramalarını unutun. Emsal.AI'ın altyapısını oluşturan iki güçlü motor sayesinde davanızı hiçbir boşluk kalmayacak şekilde analiz ediyoruz.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-[#9C1A15]">
                <BookOpen size={120} />
              </div>
              <div className="bg-[#9C1A15]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-[#9C1A15]">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">1. Kanun Motoru</h3>
              <p className="text-slate-600 leading-relaxed">
                Yazdığınız olayı anlamsal (semantic) olarak tarar. Olayın direkt hangi kanun, yönetmelik veya madde kapsamına girdiğini tespit eder.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-[#FFC000]">
                <BrainCircuit size={120} />
              </div>
              <div className="bg-[#FFC000]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-[#9C1A15]">
                <BrainCircuit size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">2. Emsal & Analiz Motoru <span className="text-sm font-bold bg-gradient-to-r from-[#9C1A15] to-[#7a1410] text-[#FFC000] px-2 py-1 rounded-md ml-2 align-middle">Gemini</span></h3>
              <p className="text-slate-600 leading-relaxed">
                Google Search entegreli (Grounding) yeteneğiyle web'den emsalleri çeker. En yüksek eşleşme oranına sahip kararı "Baş Karar" olarak analiz ederek size sunar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
        <div className="max-w-[90rem] mx-auto px-4 flex flex-col items-center">
          <Scale size={32} className="text-slate-600 mb-4" />
          <p className="mb-2 text-[#FFC000] font-bold tracking-wider">Emsal.AI - GDG Hackathon DONTSMOKE Takımı</p>
          <p className="max-w-xl text-xs text-slate-500">Bu platform bir "Hakim veya Avukat" değildir, yalnızca bir "Araştırma Asistanı"dır. Son karar ve teyit her zaman insan tarafından yapılmalıdır.</p>
        </div>
      </footer>

    </div>
  );
}

export default App;

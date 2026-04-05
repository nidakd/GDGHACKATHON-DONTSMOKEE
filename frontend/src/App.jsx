import { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LawTab from './components/LawTab';
import PrecedentTab from './components/PrecedentTab';
import { Menu, X, History, Trash2,  Bot, Scale, Search, Shield, Sparkles, BookOpen, BrainCircuit, ArrowRight, Loader, ShieldCheck, Download, Gavel, FileText, Users, Clock, Database, Award, ChevronDown, Sun, Moon } from 'lucide-react';
import axios from 'axios';

function AnimatedNumber({ end, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let observer;
    if (ref.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            let start = 0;
            const duration = 2000;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(easeProgress * end));
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
            if (observer) {
               observer.disconnect();
            }
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(ref.current);
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, [end]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}


function RevealOnScroll({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    let observer;
    if (ref.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            if (observer) observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(ref.current);
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
      }}
    >
      {children}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const searchRef = useRef(null);
  const pdfRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("Initial session:", session, "Error:", error);
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event, session);
        if (event === 'SIGNED_IN') {
          setShowWelcome(true);
          setTimeout(() => setShowWelcome(false), 4000);
        }
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setSearchHistory(data);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const loadHistoryItem = (item) => {
    setQuery(item.query);
    setResults({ lawsMarkdown: item.law_result, precedentsMarkdown: item.precedent_result });
    setIsSidebarOpen(false);
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDeleteHistoryItem = async (e, id) => {
    e.stopPropagation(); // Kartın tıklanıp yüklenmesini engeller

    const confirmDelete = window.confirm("Bu geçmiş sorgulamayı silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Silme Hatası:", error);
        alert("Sorgulama silinirken bir hata oluştu.");
      } else {
        // Silinen id'yi state'ten kaldır
        setSearchHistory(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) console.error("Login failed", error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleChangeAccount = async () => {
    await supabase.auth.signOut();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          prompt: 'select_account',
        },
        redirectTo: window.location.origin,
      }
    });
    if (error) console.error("Change account failed", error.message);
  };

  const handleGoHome = () => {
    setQuery('');
    setResults(null);
    setIsSearching(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportPDF = async () => {
    // Tailwind CSS v4'ün yeni "oklch()" renk fonksiyonu henüz harici kütüphaneler 
    // (html2canvas/html2pdf) tarafından desteklenmiyor. Bu nedenle çok daha stabil, 
    // vektörel tabanlı ve metinleri seçilebilir kılan yerel tarayıcı (PDF) 
    // yazdırma işlevini (window.print) kullanıyoruz. 
    window.print();
  };

  const streamEndpoint = async (url, queryText, setPartialContent) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ olay_metni: queryText })
    });
    
    if (!response.ok) throw new Error("Ağ hatası");

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      setPartialContent(fullText);
    }
    return fullText;
  };

  const handleMoreDetails = async () => {
    setIsSearching(true);
    try {
      setResults(prev => prev ? { ...prev, precedentsMarkdown: 'Daha fazla detay analiz ediliyor...\n\nLütfen bekleyin...' } : null);
      
      const newPrecedents = await streamEndpoint('http://127.0.0.1:8000/api/precedents/stream/details', query, (text) => {
        setResults(prev => prev ? { ...prev, precedentsMarkdown: text } : null);
      });

      // Bittiğinde supabase'i güncelleyebiliriz ama opsiyonel (şimdilik eklemiyorum, sadece canlı sonuç).
    } catch (err) {
      console.error(err);
      setError('Detaylar alınırken bir hata oluştu.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleDifferentPrecedent = async () => {
    setIsSearching(true);
    try {
      setResults(prev => prev ? { ...prev, precedentsMarkdown: 'Farklı bir emsal aranıyor...\n\nLütfen bekleyin...' } : null);
      
      const newPrecedents = await streamEndpoint('http://127.0.0.1:8000/api/precedents/stream/different', query, (text) => {
        setResults(prev => prev ? { ...prev, precedentsMarkdown: text } : null);
      });

    } catch (err) {
      console.error(err);
      setError('Farklı emsal aranırken hata oluştu.');
    } finally {
      setIsSearching(false);
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
      // Başlangıçta boş değerlerle sekmeleri göster
      setResults({
        lawsMarkdown: 'Analiz başlatılıyor...',
        precedentsMarkdown: 'Emsaller aranıyor...'
      });

      const lawsPromise = streamEndpoint('http://127.0.0.1:8000/api/laws/stream', query, (text) => {
        setResults(prev => prev ? { ...prev, lawsMarkdown: text } : null);
      });
      
      const precedentsPromise = streamEndpoint('http://127.0.0.1:8000/api/precedents/stream', query, (text) => {
        setResults(prev => prev ? { ...prev, precedentsMarkdown: text } : null);
      });

      const [finalLaws, finalPrecedents] = await Promise.all([lawsPromise, precedentsPromise]);

      // Streamler bitince Supabase'e kaydet
      if (user) {
        const { data, error } = await supabase.from('search_history').insert([
          {
            user_id: user.id,
            query: query,
            law_result: finalLaws,
            precedent_result: finalPrecedents
          }
        ]).select();
        if (!error && data) {
          setSearchHistory(prev => [data[0], ...prev]);
        } else {
          console.error("Supabase Kayıt Hatası:", error);
        }
      }

    } catch (err) {
      setError('Arama sırasında bir hata oluştu. Lütfen arka plan servisinizin çalıştığından emin olun.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-[#FFC000]/30 selection:text-[#9C1A15] relative" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      {/* HOŞGELDİN TOAST (POPUP) BİLDİRİMİ */}
      <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[100] bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-[#9C1A15]/10 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-full pr-8 pl-3 py-3 flex items-center space-x-4 transform transition-all duration-700 ease-out ${showWelcome ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-16 opacity-0 scale-95 pointer-events-none'}`}>
        {user?.user_metadata?.avatar_url ? (
           <img src={user.user_metadata.avatar_url} referrerPolicy="no-referrer" alt="Avatar" className="w-12 h-12 rounded-full ring-2 ring-white shadow-md object-cover" />
        ) : (
           <div className="bg-gradient-to-br from-[#9C1A15] to-[#c7261d] text-white p-3 rounded-full shadow-md"><Sparkles size={20} /></div>
        )}
        <div className="flex flex-col justify-center">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-1.5 font-sans leading-none">
            Hoşgeldin, <span className="text-[#9C1A15] dark:text-red-400">{user?.user_metadata?.full_name?.split(' ')[0] || 'Kullanıcı'}</span> 👋
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-sans mt-1">Emsal.AI oturumun başarıyla açıldı.</span>
        </div>
      </div>

      

      {/* SIDEBAR (HISTORY) */}
      <div className={`fixed inset-0 bg-slate-900/40 z-[60] backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`fixed top-0 left-0 w-80 sm:w-96 h-full bg-white dark:bg-slate-800 z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'}`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><History size={20} className="text-[#9C1A15] dark:text-red-400" /> Geçmiş Sorgular</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 rounded-md transition-colors"><X size={24}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!user ? (
             <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-10">Geçmişi görmek için giriş yapın.</div>
          ) : searchHistory.length === 0 ? (
             <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-10 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
               Burada henüz işlem bulunmuyor.<br/><br/>Hemen bir hukuki olay aratın!
             </div>
          ) : (
            searchHistory.map((item) => (
              <div key={item.id} onClick={() => loadHistoryItem(item)} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-[#9C1A15]/40 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm cursor-pointer transition-all group relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#9C1A15] transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                 
                 <div className="flex justify-between items-start gap-4">
                   <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-3 group-hover:text-[#9C1A15] transition-colors leading-relaxed">{item.query}</p>
                   <button 
                     onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                     className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                     title="Sorguyu Sil"
                   >
                     <Trash2 size={16} />
                   </button>
                 </div>
                 
                 <p className="text-xs text-slate-400 mt-3 flex items-center gap-1 font-sans">
                   {new Date(item.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                 </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* GLOBAL SABİT ARKA PLAN YAZISI (PARALLAX + İTALİK FONT) */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-30 dark:opacity-5 overflow-hidden w-full h-full p-4">
        <span 
          className="text-slate-300 dark:text-white font-bold italic text-center whitespace-nowrap"
          style={{ 
            fontSize: 'clamp(3rem, 10vw, 8rem)', 
            fontFamily: '"Georgia", "Times New Roman", serif', 
            transform: `translateY(${-scrollY * 0.20}px) skewX(-10deg)` 
          }}
        >
          Adalet Mülkün Temelidir.
        </span>
      </div>

      
      {/* HEADER / NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {user && (
                <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 dark:text-slate-400 hover:text-[#9C1A15] transition-colors p-2 -ml-2 focus:outline-none">
                  <Menu size={26} />
                </button>
              )}
              <div className="flex items-center space-x-2 cursor-pointer" onClick={handleGoHome}>
                <div className="bg-gradient-to-br from-[#9C1A15] to-[#7a1410] p-2 rounded-lg text-white shadow-lg shadow-[#9C1A15]/30 hover:scale-105 transition-transform">
                  <Scale size={24} />
                </div>
                <span className="text-2xl font-bold text-[#9C1A15] dark:text-red-400 hover:text-[#7a1410] dark:hover:text-red-300 transition-colors" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                  Emsal.AI
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#arama-motorlari" className="text-lg font-bold text-slate-600\b hover:text-[#9C1A15] dark:hover:text-[#FFC000] transition-colors">Nasıl Çalışır?</a>

              {/* DARK MODE TOGGLE BUTTON */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full bg-slate-100\b text-slate-600 dark:text-slate-400 dark:text-[#FFC000] hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                title="Koyu / Açık Mod Değiştir"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user ? (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-slate-300 dark:border-slate-600">
                  {user.user_metadata?.avatar_url && (
                    <img src={user.user_metadata.avatar_url} referrerPolicy="no-referrer" alt="Profil" className="w-10 h-10 rounded-full border-2 border-[#9C1A15] shadow-sm object-cover" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-slate-800 dark:text-slate-200 font-bold text-sm">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <button 
                        onClick={handleChangeAccount}
                        className="text-xs text-[#9C1A15] hover:text-[#7a1410] dark:text-red-400 dark:hover:text-red-300 text-left transition-colors font-medium"
                      >
                        Hesap Değiştir
                      </button>
                      <span className="text-slate-300 text-xs">|</span>
                      <button 
                        onClick={handleLogout}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#9C1A15] text-left transition-colors font-medium"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleGoogleLogin}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                  Google ile Giriş Yap
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* APP INTERFACE (Brought to the very top as requested) */}
      <section ref={searchRef} className="min-h-screen flex flex-col justify-center bg-transparent relative pt-24 pb-12 overflow-hidden z-10">
        


        <div className="max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#9C1A15] dark:text-red-400 tracking-tight mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Hukuki Olayı Anlatın</h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">Kısa ama detaylı şekilde müvekkilinizin veya karşılaştığınız durumu buraya yazın. Çift yönlü motorumuz saniyeler içinde kanunları ve emsalleri bulsun.</p>
          </div>

          <div className="flex flex-col flex-col-reverse justify-end w-full">
            
            {/* SONUÇLAR ALANI (Genişlik max-w-4xl yerine mx-auto max-w-[90rem] kullanılarak artırıldı) */}
            <div className={`transition-all duration-700 ease-out origin-top ${results || isSearching ? 'opacity-100 scale-100 mb-12' : 'opacity-0 scale-95 h-0 overflow-hidden mb-0'}`}>
              
              {/* Eğer arama başladıysa ve HENÜZ results nesnesi oluşmadıysa spinner göster */}
              {isSearching && !results && (
                <div className="flex items-center justify-center p-12 bg-transparent">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-[#FFC000] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-3 h-3 bg-[#9C1A15] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-3 h-3 bg-[#FFC000] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="text-sm font-bold text-[#9C1A15] dark:text-red-400 animate-pulse">Emsal.AI kanun maddelerini ve emsal kararları analiz ediyor...</p>
                  </div>
                </div>
              )}

              {/* results oluştuğu andan itibaren (isSearching true olsa bile) canlı akışı ekrana bas */}
              {results && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                  
                  {/* Sonuç Özeti Başlığı ve Çıktı Butonları */}
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mt-8">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Analiz Raporu</h3>
                      {/* Analiz devam ediyorsa "Yazılıyor...", bittiyse "Başarıyla Tamamlandı" göster */}
                      {isSearching ? (
                        <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full flex items-center shadow-sm border border-blue-200 dark:border-blue-800/50">
                          <Loader size={16} className="mr-1 animate-spin"/> Canlı Analiz Ediliyor...
                        </span>
                      ) : (
                        <span className="text-sm font-medium bg-[#FFC000]/20 dark:bg-yellow-900/20 text-[#9C1A15] dark:text-yellow-400 px-3 py-1 rounded-full flex items-center shadow-sm border border-[#FFC000]/30 dark:border-yellow-700/50">
                          <ShieldCheck size={16} className="mr-1"/> Başarıyla Tamamlandı
                        </span>
                      )}
                    </div>
                    {/* PDF İndir Butonu */}
                    <button 
                      onClick={handleExportPDF}
                      className="flex items-center space-x-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500 group"
                    >
                      <Download size={18} className="text-[#9C1A15] dark:text-red-400 group-hover:-translate-y-1 transition-transform" />
                      <span>PDF İndir</span>
                    </button>
                  </div>

                  {/* PDF İÇİN REF ALANI */}
                  {/* Geri plan rengi beyaz */}
                  <div id="pdf-content" ref={pdfRef} className="grid md:grid-cols-12 gap-8 p-6 bg-white dark:bg-slate-800 rounded-2xl print:flex print:flex-col print:bg-white print:text-black print:p-0">
                    
                    {/* YALNIZCA PDF/YAZDIRMA EKRANINDA GÖZÜKEN BAŞLIK */}
                    <div className="hidden print:block text-center border-b border-slate-300 pb-6 mb-8 mt-4">
                      <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">Emsal.AI - Hukuki Analiz Raporu</h1>
                      <p className="text-sm text-slate-500">Google Gemini altyapısı ile hazırlanan yapay zeka destekli emsal ve kanun madde tespit dökümanıdır.</p>
                    </div>

                    {/* Kanunlar (Sol Kolon -> PDF'te Üst Bölüm) */}
                    <div className="md:col-span-4 relative print:w-full print:mb-10">
                      <div className="hidden print:block mb-4">
                        <h2 className="text-xl font-bold text-[#9C1A15] border-b border-[#9C1A15] pb-2 inline-block">1. Kanun Maddeleri ve Yasal Dayanaklar</h2>
                      </div>
                      <LawTab markdown={results.lawsMarkdown} />
                    </div>
                    
                    {/* Emsal Kararlar (Sağ Kolon -> PDF'te Alt Bölüm) */}
                    <div className="md:col-span-8 flex flex-col print:w-full print:border-t-2 print:border-slate-200 print:pt-10">
                      <div className="hidden print:block mb-4">
                        <h2 className="text-xl font-bold text-[#9C1A15] border-b border-[#9C1A15] pb-2 inline-block">2. Emsal Kararlar ve Yargıtay/Danıştay İçtihatları</h2>
                      </div>
                      <div className="flex-1">
                        <PrecedentTab markdown={results.precedentsMarkdown} />
                      </div>
                      
                      {/* Emsal Altı Özel Butonlar */}
                      {results && !isSearching && (
                        <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 justify-end print:hidden">
                          <button 
                            onClick={handleMoreDetails}
                            className="bg-[#9C1A15]/10 dark:bg-red-500/20 text-[#9C1A15] dark:text-red-400 hover:bg-[#9C1A15]/20 font-bold px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center text-sm"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Daha Fazla Detay
                          </button>
                          
                          <button 
                            onClick={handleDifferentPrecedent}
                            className="bg-slate-100 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center text-sm"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            Farklı Bir Emsal Bul
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* ARAMA FORMU */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-[#9C1A15]/5 border border-slate-100 dark:border-slate-800 p-2 overflow-hidden transition-all duration-500 ring-4 ring-[#FFC000]/10 focus-within:ring-[#FFC000]/30 mb-8 max-w-4xl mx-auto w-full">
              <form onSubmit={handleSearch} className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleSearch(e);
                    }
                  }}
                  disabled={isSearching}
                  placeholder="Kısa ama detaylı şekilde müvekkilinizin veya karşılaştığınız durumu buraya yazın."
                  className="w-full h-40 sm:h-48 resize-none p-6 text-lg text-slate-700 dark:text-slate-300 bg-transparent placeholder-slate-400 focus:outline-none"
                />
                <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                  <div className="flex items-center text-xs text-slate-400">
                    <Shield size={14} className="mr-1" />
                    Gizlilik güvencesi altında
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching || !query.trim()}
                    className="group bg-gradient-to-r from-[#9C1A15] to-[#7a1410] hover:from-[#7a1410] hover:to-[#5c0f0c] dark:from-[#FFC000] dark:to-yellow-500 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 text-white dark:text-slate-950 dark:disabled:text-slate-500 px-8 py-3.5 rounded-xl font-extrabold flex items-center space-x-2 transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl shadow-[#9C1A15]/20 dark:shadow-[#FFC000]/10 hover:-translate-y-0.5"
                  >
                    {isSearching ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        <span>Analiz Ediliyor...</span>
                      </>
                    ) : (
                      <>
                        <Search size={18} className="text-[#FFC000] dark:text-slate-950 group-hover:scale-110 transition-transform" />
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
      <section id="arama-motorlari" className="py-24 bg-transparent mt-12 relative z-10">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-4">Çift Yönlü Motor (Dual-Engine) Teknolojisi</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Standart kelime aramalarını unutun. Emsal.AI'ın altyapısını oluşturan iki güçlü motor sayesinde davanızı hiçbir boşluk kalmayacak şekilde analiz ediyoruz.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-[#9C1A15] dark:text-red-400">
                <BookOpen size={120} />
              </div>
              <div className="bg-[#9C1A15]/10 dark:bg-red-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-[#9C1A15] dark:text-red-400">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">1. Kanun Motoru</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Yazdığınız olayı anlamsal (semantic) olarak tarar. Olayın direkt hangi kanun, yönetmelik veya madde kapsamına girdiğini tespit eder.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-[#9C1A15] dark:text-red-400">
                <BrainCircuit size={120} />
              </div>
              <div className="bg-[#9C1A15]/10 dark:bg-red-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-[#9C1A15] dark:text-red-400">
                <BrainCircuit size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">2. Emsal & Analiz Motoru <span className="text-sm font-bold bg-gradient-to-r from-[#9C1A15] to-[#7a1410] text-[#FFC000] dark:text-yellow-400 px-2 py-1 rounded-md ml-2 align-middle">Gemini</span></h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Google Search entegreli (Grounding) yeteneğiyle web'den emsalleri çeker. En yüksek eşleşme oranına sahip kararı "Baş Karar" olarak analiz ederek size sunar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* YENİ BÖLÜM: KULLANIM ALANLARI */}
      <section className="py-24 bg-transparent relative z-10">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-[#9C1A15]/10 via-[#9C1A15]/5 to-transparent dark:from-[#FFC000]/10 dark:via-[#FFC000]/5 dark:to-transparent border border-[#9C1A15]/20 dark:border-[#FFC000]/20 text-[#9C1A15] dark:text-[#FFC000] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-sm mb-6">
              <Gavel size={16} />
              <span>Geniş Kapsamlı Analiz</span>
            </div>
            <h2 className="text-4xl font-bold text-[#9C1A15] dark:text-red-400 mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Hangi Davalarda Etkili?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Yapay Zeka destekli arama motorumuz, tüm hukuk dallarında en güncel ve en alakalı içtihatları saniyeler içinde karşınıza çıkarır.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#FFC000]/50 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#FFC000]/20 rounded-2xl flex items-center justify-center text-[#FFC000] dark:text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Borçlar & Ticaret Hukuku</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">Kira uyuşmazlıkları, tahliye davaları, alacak-verecek talepleri ve şirketler arası ticari ihtilaflar için nokta atışı kanun maddeleri ve emsaller.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#FFC000]/50 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#FFC000]/20 rounded-2xl flex items-center justify-center text-[#FFC000] dark:text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>İş & Sosyal Güvenlik</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">Kıdem tazminatı, işe iade davaları, iş kazaları ve fazla mesai ücretlerinin hesaplanmasına temel oluşturan en güncel Yargıtay 9. Hukuk Dairesi kararları.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#FFC000]/50 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#FFC000]/20 rounded-2xl flex items-center justify-center text-[#FFC000] dark:text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                <Scale size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Ceza Hukuku</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">Dolandırıcılık, taksirle yaralama veya daha ağır ceza gerektiren davalarda TCK maddeleriyle eşleşen Yargıtay Ceza Genel Kurulu emsalleri.</p>
            </div>
          </div>
        </div>
      </section>

      {/* YENİ BÖLÜM: TEKNOLOJİK ALTYAPI VE METODOLOJİ */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 relative z-10">
        <RevealOnScroll>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
             <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-blue-200 dark:border-blue-800/50">
               <Database size={16} />
               <span>Altyapı</span>
             </div>
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
               Sistemin Teknolojik Gücü
             </h2>
             <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
               Yüksek performanslı veri işleme ve tamamen hukuk dikeyine odaklanmış yapay zeka entegrasyonu ile en karmaşık kararlarda bile stabilite.
             </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-700/50 hover:shadow-xl dark:hover:shadow-black/30 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-[#9C1A15] dark:text-red-400 mb-6 shadow-sm border border-slate-100 dark:border-slate-600">
                <Award size={26} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Üretken Yapay Zeka
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Mevzuat ve emsal kararlar, Gemini LLM altyapısı ile sadece anahtar kelime değil "anlam bilimsel" (semantik) olarak işlenir.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-700/50 hover:shadow-xl dark:hover:shadow-black/30 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-[#9C1A15] dark:text-red-400 mb-6 shadow-sm border border-slate-100 dark:border-slate-600">
                <Database size={26} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Vektörel Analiz
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Standart aramalardaki harf eşleşmeleri terk edilir. Uyuşmazlığın bağlamı vektör (embedding) modelinde analiz edilir.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-700/50 hover:shadow-xl dark:hover:shadow-black/30 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-sm border border-slate-100 dark:border-slate-600">
                <Clock size={26} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Asenkron Mimari
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">FastAPI tabanlı SSE (Streaming) akışı ile sonuçlar saniyeler beklemeden, buldukça real-time olarak arayüze basılır.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-700/50 hover:shadow-xl dark:hover:shadow-black/30 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-amber-500 dark:text-amber-400 mb-6 shadow-sm border border-slate-100 dark:border-slate-600">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Çift Yönlü Doğrulama
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Kararların sahte olma ihtimaline karşın internetten veri topraklaması (Grounding) yapılarak bilgiler T.C. kararlarıyla eşleştirilir.</p>
            </div>

          </div>
        </div>
        </RevealOnScroll>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
        <div className="max-w-[90rem] mx-auto px-4 flex flex-col items-center">
          <Scale size={32} className="text-slate-600 dark:text-slate-400 mb-4" />
          <p className="mb-2 text-[#FFC000] dark:text-yellow-400 font-bold tracking-wider">Emsal.AI - GDG Hackathon DONTSMOKE Takımı</p>
          <p className="max-w-xl text-xs text-slate-500 dark:text-slate-400">Bu platform bir "Hakim veya Avukat" değildir, yalnızca bir "Araştırma Asistanı"dır. Son karar ve teyit her zaman insan tarafından yapılmalıdır.</p>
        </div>
      </footer>

    </div>
  );
}

export default App;

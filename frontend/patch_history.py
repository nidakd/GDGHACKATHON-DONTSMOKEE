import sys
import re

def patch_app():
    with open('/Users/hnidakd/Downloads/DONTSMOKEE/frontend/src/App.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update lucide-react imports
    if "Menu, X, History" not in content:
        content = re.sub(r"import \{([^}]+)\} from 'lucide-react';", 
                         r"import { Menu, X, History, \1} from 'lucide-react';", content)

    # 2. Add History States
    state_hook = """  const [user, setUser] = useState(null);"""
    new_state = """  const [user, setUser] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);"""
    if "const [searchHistory" not in content:
        content = content.replace(state_hook, new_state)

    # 3. Add fetchHistory function and loadHistoryItem
    login_funcs = """  const handleGoogleLogin = async () => {"""
    
    history_funcs = """  const fetchHistory = async () => {
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
    setResults({ laws: item.law_result, precedents: item.precedent_result });
    setIsSidebarOpen(false);
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleGoogleLogin = async () => {"""
    
    if "const fetchHistory" not in content:
        content = content.replace(login_funcs, history_funcs)

    # 4. Modify handleSearch to save to supabase
    search_success_old = """      setResults({ laws: lawRes.data, precedents: precedentRes.data });
    } catch (err) {"""
    
    search_success_new = """      setResults({ laws: lawRes.data, precedents: precedentRes.data });
      
      if (user) {
        const { data, error } = await supabase.from('search_history').insert([
          {
            user_id: user.id,
            query: query,
            law_result: lawRes.data,
            precedent_result: precedentRes.data
          }
        ]).select();
        if (!error && data) {
          setSearchHistory(prev => [data[0], ...prev]);
        }
      }
    } catch (err) {"""
    
    if "await supabase.from('search_history')" not in content:
        content = content.replace(search_success_old, search_success_new)

    # 5. Modify Navbar for Hamburger Menu
    nav_old = """            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-[#9C1A15] to-[#7a1410] p-2 rounded-lg text-white shadow-lg shadow-[#9C1A15]/30">
                <Scale size={24} />
              </div>
              <span className="text-2xl font-bold text-[#9C1A15]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Emsal.AI
              </span>
            </div>"""
            
    nav_new = """            <div className="flex items-center space-x-4">
              {user && (
                <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 hover:text-[#9C1A15] transition-colors p-2 -ml-2 focus:outline-none">
                  <Menu size={26} />
                </button>
              )}
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-[#9C1A15] to-[#7a1410] p-2 rounded-lg text-white shadow-lg shadow-[#9C1A15]/30">
                  <Scale size={24} />
                </div>
                <span className="text-2xl font-bold text-[#9C1A15]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                  Emsal.AI
                </span>
              </div>
            </div>"""
            
    if "<Menu size={26} />" not in content:
        content = content.replace(nav_old, nav_new)

    # 6. Add Sidebar JSX
    global_bg_old = """      {/* GLOBAL SABİT ARKA PLAN YAZISI (PARALLAX + İTALİK FONT) */}"""
    
    sidebar_ui = """
      {/* SIDEBAR (HISTORY) */}
      <div className={`fixed inset-0 bg-slate-900/40 z-[60] backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`fixed top-0 left-0 w-80 sm:w-96 h-full bg-white z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><History size={20} className="text-[#9C1A15]" /> Geçmiş Sorgular</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-800 p-1 rounded-md transition-colors"><X size={24}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!user ? (
             <div className="text-center text-sm text-slate-500 mt-10">Geçmişi görmek için giriş yapın.</div>
          ) : searchHistory.length === 0 ? (
             <div className="text-center text-sm text-slate-500 mt-10 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
               Burada henüz işlem bulunmuyor.<br/><br/>Hemen bir hukuki olay aratın!
             </div>
          ) : (
            searchHistory.map((item) => (
              <div key={item.id} onClick={() => loadHistoryItem(item)} className="p-4 border border-slate-200 rounded-xl hover:border-[#9C1A15]/40 hover:bg-slate-50 hover:shadow-sm cursor-pointer transition-all group relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#9C1A15] transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                 <p className="text-sm font-medium text-slate-700 line-clamp-3 group-hover:text-[#9C1A15] transition-colors leading-relaxed">{item.query}</p>
                 <p className="text-xs text-slate-400 mt-3 flex items-center gap-1 font-sans">
                   {new Date(item.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                 </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* GLOBAL SABİT ARKA PLAN YAZISI (PARALLAX + İTALİK FONT) */}"""
      
    if "SIDEBAR (HISTORY)" not in content:
        content = content.replace(global_bg_old, sidebar_ui)

    with open('/Users/hnidakd/Downloads/DONTSMOKEE/frontend/src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
        print("Successfully integrated history feature context.")

patch_app()

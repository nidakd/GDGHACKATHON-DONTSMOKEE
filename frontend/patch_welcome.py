import sys

def patch_app():
    with open('/Users/hnidakd/Downloads/DONTSMOKEE/frontend/src/App.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add showWelcome state
    state_hook = """  const [user, setUser] = useState(null);
  const [query, setQuery] = useState('');"""
    new_state = """  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [query, setQuery] = useState('');"""
    
    if "const [showWelcome" not in content:
        content = content.replace(state_hook, new_state)

    # 2. Update onAuthStateChange to trigger toast
    old_auth_listener = """    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );"""
    
    new_auth_listener = """    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setShowWelcome(true);
          setTimeout(() => setShowWelcome(false), 4000);
        }
        setUser(session?.user ?? null);
      }
    );"""
    
    if "event === 'SIGNED_IN'" not in content:
        content = content.replace(old_auth_listener, new_auth_listener)

    # 3. Update Navbar Profile UI
    old_nav = """              {user ? (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-slate-300">
                  <span className="text-slate-600 font-medium">{user.user_metadata?.full_name || user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : ("""
              
    new_nav = """              {user ? (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-slate-300">
                  {user.user_metadata?.avatar_url && (
                    <img src={user.user_metadata.avatar_url} alt="Profil" className="w-10 h-10 rounded-full border-2 border-[#9C1A15] shadow-sm" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-slate-800 font-bold text-sm">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                    <button 
                      onClick={handleLogout}
                      className="text-xs text-slate-500 hover:text-[#9C1A15] text-left transition-colors font-medium mt-0.5"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              ) : ("""
              
    if "w-10 h-10 rounded-full" not in content:
        content = content.replace(old_nav, new_nav)

    # 4. Inject Welcome Toast UI just after <div className="min-h-screen ...">
    old_screen_div = """  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#FFC000]/30 selection:text-[#9C1A15] relative" style={{ fontFamily: '"Times New Roman", Times, serif' }}>"""
    
    toast_ui = """
      {/* HOŞGELDİN TOAST (POPUP) BİLDİRİMİ */}
      <div className={`fixed top-24 right-4 z-50 bg-white border border-[#9C1A15]/20 shadow-2xl rounded-xl p-4 flex items-center space-x-4 transform transition-all duration-500 ${showWelcome ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
        {user?.user_metadata?.avatar_url ? (
           <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full border border-[#FFC000]" />
        ) : (
           <div className="bg-[#9C1A15]/10 p-2 rounded-full"><Sparkles className="text-[#9C1A15]" size={24} /></div>
        )}
        <div>
          <h4 className="text-base font-bold text-[#9C1A15]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            Hoşgeldin, {user?.user_metadata?.full_name?.split(' ')[0] || 'Kullanıcı'}!
          </h4>
          <p className="text-xs text-slate-500 font-sans mt-1">Emsal.AI'a başarıyla giriş yaptınız.</p>
        </div>
      </div>
"""
    if "HOŞGELDİN TOAST" not in content:
        content = content.replace(old_screen_div, old_screen_div + toast_ui)

    with open('/Users/hnidakd/Downloads/DONTSMOKEE/frontend/src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
        print("Successfully added welcome toast and profile picture.")

patch_app()

import sys

def patch_app():
    with open('/Users/hnidakd/Downloads/DONTSMOKEE/frontend/src/App.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add import
    import_hook = "import { useState, useRef, useEffect } from 'react';"
    if "import { supabase } from './supabaseClient';" not in content:
        content = content.replace(import_hook, import_hook + "\nimport { supabase } from './supabaseClient';")

    # 2. Add state and effect hooks inside App()
    state_hook = """  const [query, setQuery] = useState('');"""
    new_state = """  const [user, setUser] = useState(null);
  const [query, setQuery] = useState('');"""
    if "const [user, setUser]" not in content:
        content = content.replace(state_hook, new_state)

    effect_hook = """  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };"""
    new_effect = """  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
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
    };"""
    if "supabase.auth.getSession" not in content:
        content = content.replace(effect_hook, new_effect)

    # 3. Add login/logout handlers
    login_hook = """  const handleExportPDF = () => {"""
    new_login = """  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error("Login failed", error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleExportPDF = () => {"""
    if "handleGoogleLogin" not in content:
        content = content.replace(login_hook, new_login)

    # 4. Update Navbar
    old_nav = """            <div className="hidden md:flex items-center space-x-8">
              <a href="#arama-motorlari" className="text-lg font-bold text-slate-600 hover:text-[#9C1A15] transition-colors">Nasıl Çalışır?</a>
            </div>"""
    
    new_nav = """            <div className="hidden md:flex items-center space-x-6">
              <a href="#arama-motorlari" className="text-lg font-bold text-slate-600 hover:text-[#9C1A15] transition-colors">Nasıl Çalışır?</a>
              {user ? (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-slate-300">
                  <span className="text-slate-600 font-medium">{user.user_metadata?.full_name || user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleGoogleLogin}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white text-slate-700 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                  Google ile Giriş Yap
                </button>
              )}
            </div>"""
    
    if "handleGoogleLogin" not in content or "Google ile Giriş Yap" not in content:
        content = content.replace(old_nav, new_nav)

    with open('/Users/hnidakd/Downloads/DONTSMOKEE/frontend/src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
        print("Patched App.jsx successfully!")

patch_app()

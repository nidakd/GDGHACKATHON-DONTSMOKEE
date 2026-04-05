import codecs

with codecs.open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace("import { useState, useRef } from 'react';", "import { useState, useRef, useEffect } from 'react';")

# 2. Add scrollY state and effect
search_hook = "  const searchRef = useRef(null);\n  const pdfRef = useRef(null);"
replacement_hook = """  const searchRef = useRef(null);
  const pdfRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);"""
content = content.replace(search_hook, replacement_hook)

# 3. Update Global BG
old_bg = """      {/* GLOBAL SABİT ARKA PLAN YAZISI */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.03]">
        <span 
          className="text-[#9C1A15] font-bold whitespace-nowrap text-center"
          style={{ fontSize: '10vw', fontFamily: '"Times New Roman", Times, serif' }}
        >
          Adalet Mülkün Temelidir
        </span>
      </div>"""

new_bg = """      {/* GLOBAL SABİT ARKA PLAN YAZISI (PARALLAX + İTALİK FONT) */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.04]">
        <span 
          className="text-[#9C1A15] font-bold italic text-center px-4 max-w-full leading-[1.2]"
          style={{ 
            fontSize: 'clamp(4rem, 10vw, 15rem)', 
            fontFamily: '"Georgia", "Times New Roman", serif', 
            transform: `translateY(${-scrollY * 0.15}px)` 
          }}
        >
          Adalet Mülkün<br/><span className="pl-12 md:pl-24 text-[1.1em] opacity-80">Temelidir</span>
        </span>
      </div>"""

content = content.replace(old_bg, new_bg)

with codecs.open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

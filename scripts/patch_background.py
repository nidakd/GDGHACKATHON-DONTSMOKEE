import codecs

with codecs.open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Removals of local background text
old_bg_text = """        {/* Arka Plan Yazısı */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.03]">
          <span 
            className="text-[#9C1A15] font-bold whitespace-nowrap text-center"
            style={{ fontSize: '10vw', fontFamily: '"Times New Roman", Times, serif', transform: 'rotate(0deg)' }}
          >
            Adalet Mülkün Temelidir
          </span>
        </div>"""
content = content.replace(old_bg_text, "")

# 2. Insert global fixed background right after the main div
new_global_bg = """    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#FFC000]/30 selection:text-[#9C1A15] relative" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      
      {/* GLOBAL SABİT ARKA PLAN YAZISI */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.03]">
        <span 
          className="text-[#9C1A15] font-bold whitespace-nowrap text-center"
          style={{ fontSize: '10vw', fontFamily: '"Times New Roman", Times, serif' }}
        >
          Adalet Mülkün Temelidir
        </span>
      </div>
"""
content = content.replace("""    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#FFC000]/30 selection:text-[#9C1A15]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>""", new_global_bg)

# 3. Make sections transparent so the fixed background is visible

content = content.replace("""<section ref={searchRef} className="min-h-screen flex flex-col justify-center bg-white relative pt-24 pb-12 overflow-hidden">""", """<section ref={searchRef} className="min-h-screen flex flex-col justify-center bg-transparent relative pt-24 pb-12 overflow-hidden z-10">""")

content = content.replace("""<section id="arama-motorlari" className="py-24 bg-slate-50 border-y border-slate-200 mt-12">""", """<section id="arama-motorlari" className="py-24 bg-transparent border-y border-slate-200/50 mt-12 relative z-10">""")

content = content.replace("""<section className="py-24 bg-white border-y border-slate-200">""", """<section className="py-24 bg-transparent border-y border-slate-200/50 relative z-10">""")

with codecs.open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

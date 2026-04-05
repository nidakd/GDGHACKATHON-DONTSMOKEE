import sys

def replace_stats_with_tech():
    with open('src/App.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    old_stats = """      {/* YENİ BÖLÜM: AVANTAJLAR (İSTATİKLER) */}
      <section className="py-20 bg-[#9C1A14] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="p-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><Clock size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <AnimatedNumber end={90} prefix="%" />
              </h3>
              <p className="text-white/80 font-medium text-lg">Zaman Tasarrufu</p>
            </div>
            <div className="p-4 pt-8 md:pt-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><Database size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <AnimatedNumber end={10} suffix="K+" />
              </h3>
              <p className="text-white/80 font-medium text-lg">Gerçek Zamanlı Taranan İçtihat</p>
            </div>
            <div className="p-4 pt-8 md:pt-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><Award size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <AnimatedNumber end={2} suffix=" Motor" />
              </h3>
              <p className="text-white/80 font-medium text-lg">Kanun + İçtihat Doğrulaması</p>
            </div>
            <div className="p-4 pt-8 md:pt-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><ShieldCheck size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <AnimatedNumber end={100} prefix="%" />
              </h3>
              <p className="text-white/80 font-medium text-lg">Gizlilik & Güvenlik</p>
            </div>
          </div>
        </div>
      </section>"""

    new_stats_section = """      {/* YENİ BÖLÜM: TEKNOLOJİK ALTYAPI VE METODOLOJİ */}
      <section className="py-20 bg-[#9C1A14] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold text-center text-[#FFC000] mb-12" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Sistemin Teknolojik Altyapısı</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="p-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><Award size={40} /></div>
              <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Üretken Yapay Zeka
              </h3>
              <p className="text-white/80 text-sm md:text-base">Mevzuat ve emsal kararlar, Gemini LLM (Large Language Model) altyapısı ile anlam bilimsel (semantik) olarak işlenir.</p>
            </div>
            <div className="p-4 pt-8 md:pt-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><Database size={40} /></div>
              <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Vektörel Analiz
              </h3>
              <p className="text-white/80 text-sm md:text-base">Anahtar kelime yerine, uyuşmazlığın hukuki bağlamını kavrayan embedding (vektör) tabanlı tarama metodolojisi uygulanır.</p>
            </div>
            <div className="p-4 pt-8 md:pt-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><Clock size={40} /></div>
              <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Asenkron Mimari
              </h3>
              <p className="text-white/80 text-sm md:text-base">FastAPI tabanlı mikroservis mimarisi ile veri işleme süreçleri optimize edilerek anında geri bildirim sağlanır.</p>
            </div>
            <div className="p-4 pt-8 md:pt-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><ShieldCheck size={40} /></div>
              <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Çift Yönlü Doğrulama
              </h3>
              <p className="text-white/80 text-sm md:text-base">Bulunan sonuçlar; güncel kanun maddeleri ve emsal yargı kararları eşleştirilerek halüsinasyon riskine karşı filtrelenir.</p>
            </div>
          </div>
        </div>
      </section>"""
    
    if old_stats in content:
        content = content.replace(old_stats, new_stats_section)
        with open('src/App.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated stats section to technological methodology successfully.")
    else:
        print("Could not find the stats section to replace.")

replace_stats_with_tech()

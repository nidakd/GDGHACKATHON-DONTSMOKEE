import codecs

content = ""
with codecs.open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

import_old = "import { Bot, Scale, Search, Shield, Sparkles, BookOpen, BrainCircuit, ArrowRight, Loader, ShieldCheck, Download } from 'lucide-react';"
import_new = "import { Bot, Scale, Search, Shield, Sparkles, BookOpen, BrainCircuit, ArrowRight, Loader, ShieldCheck, Download, Gavel, FileText, Users, Clock, Database, Award, ChevronDown } from 'lucide-react';"

content = content.replace(import_old, import_new)

target_str = """      </section>

      {/* FOOTER */}"""

replacement_str = """      </section>

      {/* YENİ BÖLÜM: KULLANIM ALANLARI */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-[#9C1A15]/10 border border-[#9C1A15]/20 text-[#9C1A15] px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <Gavel size={16} />
              <span>Geniş Kapsamlı Analiz</span>
            </div>
            <h2 className="text-4xl font-bold text-[#9C1A15] mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Hangi Davalarda Etkili?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Yapay Zeka destekli arama motorumuz, tüm hukuk dallarında en güncel ve en alakalı içtihatları saniyeler içinde karşınıza çıkarır.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#9C1A15]/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#FFC000]/20 rounded-2xl flex items-center justify-center text-[#9C1A15] mb-6 group-hover:scale-110 transition-transform">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Borçlar & Ticaret Hukuku</h3>
              <p className="text-slate-600 text-base leading-relaxed">Kira uyuşmazlıkları, tahliye davaları, alacak-verecek talepleri ve şirketler arası ticari ihtilaflar için nokta atışı kanun maddeleri ve emsaller.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#9C1A15]/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#FFC000]/20 rounded-2xl flex items-center justify-center text-[#9C1A15] mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>İş & Sosyal Güvenlik</h3>
              <p className="text-slate-600 text-base leading-relaxed">Kıdem tazminatı, işe iade davaları, iş kazaları ve fazla mesai ücretlerinin hesaplanmasına temel oluşturan en güncel Yargıtay 9. Hukuk Dairesi kararları.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#9C1A15]/30 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#FFC000]/20 rounded-2xl flex items-center justify-center text-[#9C1A15] mb-6 group-hover:scale-110 transition-transform">
                <Scale size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Ceza Hukuku</h3>
              <p className="text-slate-600 text-base leading-relaxed">Dolandırıcılık, taksirle yaralama veya daha ağır ceza gerektiren davalarda TCK maddeleriyle eşleşen Yargıtay Ceza Genel Kurulu emsalleri.</p>
            </div>
          </div>
        </div>
      </section>

      {/* YENİ BÖLÜM: AVANTAJLAR (İSTATİKLER) */}
      <section className="py-20 bg-gradient-to-br from-[#9C1A15] to-[#7a1410] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="p-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><Clock size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>%90</h3>
              <p className="text-white/80 font-medium text-lg">Zaman Tasarrufu</p>
            </div>
            <div className="p-4 pt-8 md:pt-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><Database size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>10K+</h3>
              <p className="text-white/80 font-medium text-lg">Gerçek Zamanlı Taranan İçtihat</p>
            </div>
            <div className="p-4 pt-8 md:pt-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><Award size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Çift Motor</h3>
              <p className="text-white/80 font-medium text-lg">Kanun + İçtihat Doğrulaması</p>
            </div>
            <div className="p-4 pt-8 md:pt-4">
              <div className="flex justify-center mb-4 text-[#FFC000]"><ShieldCheck size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>%100</h3>
              <p className="text-white/80 font-medium text-lg">Gizlilik & Güvenlik</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}"""

content = content.replace(target_str, replacement_str)

with codecs.open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

import sys
import re

def insert_reveal():
    with open('src/App.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the RevealOnScroll component
    reveal_component = """
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
"""
    # Insert RevealOnScroll before function App()
    if 'function RevealOnScroll' not in content:
        content = content.replace('function App() {', reveal_component + '\nfunction App() {')
    
    # Wrap sections with RevealOnScroll.
    # We will wrap the 2 newly added sections:
    # 1. YENİ BÖLÜM: KULLANIM ALANLARI
    # 2. YENİ BÖLÜM: TEKNOLOJİK ALTYAPI VE METODOLOJİ
    
    # KULLANIM ALANLARI section replacement
    old_kullanim = """      {/* YENİ BÖLÜM: KULLANIM ALANLARI */}
      <section className="py-20 bg-slate-50 relative z-20">"""
      
    if old_kullanim in content:
        content = content.replace(old_kullanim, '      {/* YENİ BÖLÜM: KULLANIM ALANLARI */}\n      <section className="py-20 bg-slate-50 relative z-20">\n        <RevealOnScroll>')

    # The end of the KULLANIM ALANLARI section appears just before TEKNOLOJİK ALTYAPI VE METODOLOJİ
    old_end_kullanim = """      {/* YENİ BÖLÜM: TEKNOLOJİK ALTYAPI VE METODOLOJİ */}"""
    if old_end_kullanim in content and '<RevealOnScroll>' in content:
        # Before closing </section> of KULLANIM ALANLARI, insert </RevealOnScroll>
        content = content.replace("""        </div>
      </section>

      {/* YENİ BÖLÜM: TEKNOLOJİK ALTYAPI VE METODOLOJİ */}""", """        </div>
        </RevealOnScroll>
      </section>

      {/* YENİ BÖLÜM: TEKNOLOJİK ALTYAPI VE METODOLOJİ */}""")

    # TEKNOLOJİK ALTYAPI section replacement
    old_teknolojik = """      {/* YENİ BÖLÜM: TEKNOLOJİK ALTYAPI VE METODOLOJİ */}
      <section className="py-20 bg-[#8A1712] text-white relative overflow-hidden">"""
    
    if old_teknolojik in content:
         content = content.replace(old_teknolojik, '      {/* YENİ BÖLÜM: TEKNOLOJİK ALTYAPI VE METODOLOJİ */}\n      <section className="py-20 bg-[#8A1712] text-white relative overflow-hidden">\n        <RevealOnScroll>')

    old_footer = """      {/* FOOTER */}"""
    if old_footer in content and 'bg-[#8A1712]' in content:
        # Before closing </section> of TEKNOLOJİK ALTYAPI
        content = content.replace("""        </div>
      </section>

      {/* FOOTER */}""", """        </div>
        </RevealOnScroll>
      </section>

      {/* FOOTER */}""")

    with open('src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Done applying RevealOnScroll.")

insert_reveal()

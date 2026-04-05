import codecs

with codecs.open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Insert AnimatedNumber component
animated_number_code = """function AnimatedNumber({ end, prefix = '', suffix = '' }) {
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

function App() {"""

content = content.replace("function App() {", animated_number_code)

# 2. Revert the UI and add counter
old_stats = """      {/* YENİ BÖLÜM: AVANTAJLAR (İSTATİKLER) */}
      <section className="py-20 bg-[#9C1A14] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 hover:scale-150 relative z-0"></div>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="p-4 group cursor-default transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/5 rounded-2xl">
              <div className="flex justify-center mb-4 text-[#FFC000] transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"><Clock size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2 transform transition-transform duration-300 group-hover:scale-105" style={{ fontFamily: '"Times New Roman", Times, serif' }}>%90</h3>
              <p className="text-white/80 font-medium text-lg group-hover:text-white transition-colors duration-300">Zaman Tasarrufu</p>
            </div>
            <div className="p-4 pt-8 md:pt-4 group cursor-default transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/5 rounded-2xl">
              <div className="flex justify-center mb-4 text-[#FFC000] transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"><Database size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2 transform transition-transform duration-300 group-hover:scale-105" style={{ fontFamily: '"Times New Roman", Times, serif' }}>10K+</h3>
              <p className="text-white/80 font-medium text-lg group-hover:text-white transition-colors duration-300">Gerçek Zamanlı Taranan İçtihat</p>
            </div>
            <div className="p-4 pt-8 md:pt-4 group cursor-default transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/5 rounded-2xl">
              <div className="flex justify-center mb-4 text-[#FFC000] transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"><Award size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2 transform transition-transform duration-300 group-hover:scale-105" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Çift Motor</h3>
              <p className="text-white/80 font-medium text-lg group-hover:text-white transition-colors duration-300">Kanun + İçtihat Doğrulaması</p>
            </div>
            <div className="p-4 pt-8 md:pt-4 group cursor-default transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/5 rounded-2xl">
              <div className="flex justify-center mb-4 text-[#FFC000] transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"><ShieldCheck size={40} /></div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2 transform transition-transform duration-300 group-hover:scale-105" style={{ fontFamily: '"Times New Roman", Times, serif' }}>%100</h3>
              <p className="text-white/80 font-medium text-lg group-hover:text-white transition-colors duration-300">Gizlilik & Güvenlik</p>
            </div>
          </div>
        </div>
      </section>"""

new_stats = """      {/* YENİ BÖLÜM: AVANTAJLAR (İSTATİKLER) */}
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

content = content.replace(old_stats, new_stats)

with codecs.open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

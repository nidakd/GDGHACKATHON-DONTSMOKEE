import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Imports
content = content.replace("import { Bot, Scale, Search, Shield, Sparkles, BookOpen, BrainCircuit, ArrowRight, Loader, ShieldCheck } from 'lucide-react';", 
                          "import { Bot, Scale, Search, Shield, Sparkles, BookOpen, BrainCircuit, ArrowRight, Loader, ShieldCheck, Download } from 'lucide-react';\nimport html2pdf from 'html2pdf.js';")

# Export PDF Function
func_str = """
  const searchRef = useRef(null);
  const pdfRef = useRef(null);

  const handleExportPDF = () => {
    const element = pdfRef.current;
    html2pdf().from(element).save('Emsal_AI_Analiz_Raporu.pdf');
  };
"""
content = content.replace("  const searchRef = useRef(null);", func_str)

# Header Changes
content = content.replace("Haklı-Hak", "Emsal.AI")
content = content.replace("from-blue-600 to-indigo-600", "from-[#9C1A15] to-[#7a1410]")
content = content.replace("from-blue-700 to-indigo-800", "from-[#9C1A15] to-[#7a1410]")
content = content.replace("bg-[#9c1422]", "bg-[#9C1A15]")
content = content.replace("text-[#9c1422]", "text-[#9C1A15]")
content = content.replace("text-blue-600", "text-[#9C1A15]")
content = content.replace("text-blue-500", "text-[#FFC000]")
content = content.replace("bg-blue-600", "bg-[#9C1A15]")
content = content.replace("hover:bg-blue-700", "hover:bg-[#7a1410]")
content = content.replace("bg-indigo-100", "bg-[#9C1A15]/10")
content = content.replace("text-indigo-600", "text-[#9C1A15]")
content = content.replace("bg-slate-900", "bg-[#9C1A15]")
content = content.replace("hover:bg-slate-800", "hover:bg-[#7a1410]")

# Move sections (Hero <-> Search)
# I will just write a new App.jsx entirely that implements the exact requirements for a cleaner result.

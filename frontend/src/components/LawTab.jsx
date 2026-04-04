import { Book } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function LawTab({ markdown }) {
  if (!markdown) return <p className="text-slate-500">Uygun kanun maddesi bulunamadı.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-serif text-[#1e3a8a] mb-4 flex items-center gap-2">
        <Book size={24} className="text-[#1e3a8a]" /> Kanun Maddeleri
      </h2>
      <div className="bg-white p-6 rounded-xl border border-[#1e3a8a]/20 shadow-sm hover:shadow-md transition-shadow">
         <div className="prose max-w-none prose-slate prose-headings:text-[#1e3a8a] prose-h3:text-lg prose-p:leading-relaxed prose-p:text-sm prose-strong:text-slate-800 prose-ul:list-disc prose-li:my-1 prose-li:text-sm">
            <ReactMarkdown>{markdown}</ReactMarkdown>
         </div>
      </div>
    </div>
  );
}
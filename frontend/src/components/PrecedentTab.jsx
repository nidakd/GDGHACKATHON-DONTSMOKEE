import { Star, ShieldAlert, Scale } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PrecedentTab({ markdown }) {
  if (!markdown) return <p className="text-slate-500 dark:text-slate-400">Uygun emsal karar bulunamadı.</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold font-serif text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
        <Scale size={24} className="text-amber-500 dark:text-amber-400" /> Emsal Kararlar ve AI Yorumu
      </h2>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 md:p-8 border border-amber-200 dark:border-amber-900/50 shadow-md hover:shadow-lg transition-shadow">
        <div className="prose dark:prose-invert max-w-none prose-slate 
            prose-headings:text-amber-800 dark:prose-headings:text-amber-400 prose-h2:text-xl prose-h3:text-lg 
            prose-p:leading-relaxed prose-p:text-sm prose-strong:text-slate-800 dark:prose-strong:text-slate-200
            prose-ul:bg-white/60 dark:prose-ul:bg-slate-800/80 prose-ul:p-6 prose-ul:rounded-xl prose-ul:border prose-ul:border-amber-100 dark:prose-ul:border-amber-900/50
            prose-li:my-2 prose-li:text-sm
            prose-blockquote:border-l-amber-500 prose-blockquote:bg-amber-100/50 dark:prose-blockquote:bg-amber-900/30 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:italic">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>

        {/* Disclaimer Section integrated directly like in original design intent */}
        <div className="mt-8 flex items-start gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
           <ShieldAlert size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
           <div>
              <p className="text-xs text-amber-800/80 dark:text-amber-200/80 font-medium">Bu platform bir "Hakim" veya "Avukat" değildir, yalnızca bir "Araştırma Asistanı"dır. Çıkan sonuçlar sadece yasal süreç incelemelerini desteklemek amaçlıdır.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
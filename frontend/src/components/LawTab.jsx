import { Book } from 'lucide-react';

export default function LawTab({ laws }) {
  if (!laws || laws.length === 0) return <p className="text-slate-500">Uygun kanun maddesi bulunamadı.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-serif text-slate-800 mb-4 flex items-center gap-2">
        <Book size={24} className="text-indigo-500" /> Kanun Maddeleri
      </h2>
      <div className="space-y-4">
        {laws.map((law, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-slate-700">{law.title}</h3>
            <p className="mt-2 text-slate-600 leading-relaxed text-sm">"{law.description}"</p>
            <div className="mt-4 flex items-center justify-between">
               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Alaka: {law.relevance}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { Star, ShieldAlert } from 'lucide-react';

export default function PrecedentTab({ precedents }) {
  if (!precedents || precedents.length === 0) return <p className="text-slate-500">Uygun emsal karar bulunamadı.</p>;

  // Hlavní emsal (Baş Karar)
  const mainPrecedent = precedents.find((p) => p.isMain);
  // Alternatifler
  const alternativePrecedents = precedents.filter((p) => !p.isMain);

  return (
    <div className="space-y-8">
      {/* Baş Karar (Emsal) */}
      {mainPrecedent && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-md">
          <div className="flex items-center space-x-2 text-amber-700 mb-4 bg-amber-100 w-max px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
            <Star size={16} />
            <span>En Yüksek Eşleşme ({mainPrecedent.matchRate})</span>
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-800">{mainPrecedent.summary}</h2>
          <p className="mt-4 text-slate-700 leading-relaxed text-sm bg-white/60 p-4 rounded-xl shadow-inner border border-amber-100">
            "{mainPrecedent.details}"
          </p>
          <div className="mt-6">
            <h4 className="font-semibold text-slate-800 text-sm">Gemini Analizi:</h4>
            <p className="text-sm text-slate-600 mt-2">Bu karar, hayvanın bakımını üstlenen kişinin sorumluluğunu doğurduğu için olayınızla %92 oranında örtüşmektedir.</p>
          </div>
        </div>
      )}

      {/* Alternatif Görüşler */}
      {alternativePrecedents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold font-serif text-slate-700 flex items-center gap-2 mb-4 border-b pb-2">
            <ShieldAlert size={20} className="text-slate-400" />
            Alternatif Görüşler
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {alternativePrecedents.map((prec, index) => (
              <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-slate-800 text-sm line-clamp-2">{prec.summary}</h4>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{prec.matchRate}</span>
                </div>
                <p className="text-slate-500 text-xs mt-2 line-clamp-3">"{prec.details}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import sys
import re

def patch_app():
    with open('/Users/hnidakd/Downloads/DONTSMOKEE/frontend/src/App.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Provide the fetch stream helper function
    helper = """  const streamEndpoint = async (url, queryText, setPartialContent) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ olay_metni: queryText })
    });
    
    if (!response.ok) throw new Error("Ağ hatası");

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      setPartialContent(fullText);
    }
    return fullText;
  };

  const handleSearch = async (e) => {"""
    
    if "streamEndpoint =" not in content:
        content = content.replace("  const handleSearch = async (e) => {", helper)

    # 2. Modify handleSearch logic
    old_search_logic = """    try {
      const [lawRes, precedentRes] = await Promise.all([
        axios.post('http://127.0.0.1:8000/api/laws', { olay_metni: query }),
        axios.post('http://127.0.0.1:8000/api/precedents', { olay_metni: query })
      ]);

      setResults({
        lawsMarkdown: lawRes.data.kanunlar,
        precedentsMarkdown: precedentRes.data.emsaller,
      });

      if (user) {
        const { data, error } = await supabase.from('search_history').insert([
          {
            user_id: user.id,
            query: query,
            law_result: lawRes.data.kanunlar,
            precedent_result: precedentRes.data.emsaller
          }
        ]).select();
        if (!error && data) {
          setSearchHistory(prev => [data[0], ...prev]);
        } else {
          console.error("Supabase Kilit Hatası:", error);
        }
      }

    } catch (err) {"""

    new_search_logic = """    try {
      // Başlangıçta boş değerlerle sekmeleri göster
      setResults({
        lawsMarkdown: 'Analiz başlatılıyor...',
        precedentsMarkdown: 'Emsaller aranıyor...'
      });

      const lawsPromise = streamEndpoint('http://127.0.0.1:8000/api/laws/stream', query, (text) => {
        setResults(prev => prev ? { ...prev, lawsMarkdown: text } : null);
      });
      
      const precedentsPromise = streamEndpoint('http://127.0.0.1:8000/api/precedents/stream', query, (text) => {
        setResults(prev => prev ? { ...prev, precedentsMarkdown: text } : null);
      });

      // İki bağımsız stream'in tamamen bitmesini bekle
      const [finalLaws, finalPrecedents] = await Promise.all([lawsPromise, precedentsPromise]);

      // Streamler bitince Supabase'e kaydet
      if (user) {
        const { data, error } = await supabase.from('search_history').insert([
          {
            user_id: user.id,
            query: query,
            law_result: finalLaws,
            precedent_result: finalPrecedents
          }
        ]).select();
        if (!error && data) {
          setSearchHistory(prev => [data[0], ...prev]);
        } else {
          console.error("Supabase Kayıt Hatası:", error);
        }
      }

    } catch (err) {"""

    if "Analiz başlatılıyor" not in content:
        content = content.replace(old_search_logic, new_search_logic)

    with open('/Users/hnidakd/Downloads/DONTSMOKEE/frontend/src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
        print("Frontend streaming logic integrated.")

patch_app()

import sys
import re

def patch_backend():
    with open('/Users/hnidakd/Downloads/DONTSMOKEE/backend/main.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # Add StreamingResponse to imports
    if "from fastapi.responses import StreamingResponse" not in content:
        content = content.replace("from fastapi import FastAPI, HTTPException", "from fastapi import FastAPI, HTTPException\nfrom fastapi.responses import StreamingResponse")

    # Add streaming endpoints
    streaming_routes = """
@app.post("/api/laws/stream")
async def get_laws_stream(request: LawRequest):
    def generate():
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            prompt = f\"\"\"Sen uzman bir Türk Hukuku asistanısın. Görevin, kullanıcının anlattığı olaya en uygun kanun maddelerini bulmaktır.
            Olay: {request.olay_metni}
            Lütfen bu olayın hangi Türk Kanunları ve maddeleri (örneğin Türk Borçlar Kanunu Madde X, Türk Ceza Kanunu vb.) kapsamına girdiğini açıkla.\"\"\"
            
            response = model.generate_content(prompt, stream=True)
            for chunk in response:
                yield chunk.text
        except Exception as e:
            yield f"Hata: {str(e)}"
            
    return StreamingResponse(generate(), media_type="text/plain")

@app.post("/api/precedents/stream")
async def get_precedents_stream(request: PrecedentRequest):
    def generate():
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            prompt = f\"\"\"Sen uzman bir Türk Hukuku asistanısın. Görevin, kullanıcı olayına uyan Yargıtay veya Danıştay emsal kararlarını bulup analiz etmektir.
            Olay: {request.olay_metni}
            
            Aşağıdaki formatta yanıt ver:
            1. Baş Karar (Olaya en uygun emsal karar ve açıklaması)
            2. Alternatif Görüşler (Benzer diğer kararların özeti)
            3. Sorumluluk Reddi (Sadece bilgilendirme amaçlıdır uyarısı)\"\"\"
            
            response = model.generate_content(prompt, stream=True)
            for chunk in response:
                yield chunk.text
        except Exception as e:
            yield f"Hata: {str(e)}"
            
    return StreamingResponse(generate(), media_type="text/plain")

if __name__ == "__main__":
"""
    if "/api/laws/stream" not in content:
        content = content.replace('if __name__ == "__main__":', streaming_routes)
        with open('/Users/hnidakd/Downloads/DONTSMOKEE/backend/main.py', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Backend patched for streaming successfully")

patch_backend()

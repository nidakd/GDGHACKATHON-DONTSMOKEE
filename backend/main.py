import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# .env dosyasını yükle ve var olan değişkenleri ez
load_dotenv(override=True)

API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API_KEY bulunamadı! Lütfen .env dosyanızı kontrol edin.")

# Gemini'yi konfigüre et
genai.configure(api_key=API_KEY)

app = FastAPI(title="Haklı-Hak Backend API")

# Frontend'in (React) backend'e istek atabilmesi için CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme aşamasında her yere açık. Canlıda "http://localhost:5173" vs. yapılabilir.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# İstek modelleri
class LawRequest(BaseModel):
    olay_metni: str

class PrecedentRequest(BaseModel):
    olay_metni: str

@app.get("/")
def read_root():
    return {"message": "Haklı-Hak Backend Servisi Çalışıyor!"}

@app.post("/api/laws")
async def get_laws(request: LawRequest):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # Kanun bulmak için prompt
        prompt = f"""
        Sen uzman bir Türk Hukuku asistanısın. Görevin, kullanıcının anlattığı olaya en uygun kanun maddelerini bulmaktır.
        Olay: {request.olay_metni}
        
        Lütfen bu olayın hangi Türk Kanunları ve maddeleri (örneğin Türk Borçlar Kanunu Madde X, Türk Ceza Kanunu vb.) kapsamına girdiğini açıkla.
        """
        
        response = model.generate_content(prompt)
        return {"kanunlar": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/precedents")
async def get_precedents(request: PrecedentRequest):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # Emsal karar ve analiz bulmak için Prompt
        # Not: İleride Grounding with Google Search aktif edilecek.
        prompt = f"""
        Sen uzman bir Türk Hukuku asistanısın. Görevin, kullanıcı olayına uyan Yargıtay veya Danıştay emsal kararlarını bulup analiz etmektir.
        Olay: {request.olay_metni}
        
        Aşağıdaki formatta yanıt ver:
        1. Baş Karar (Olaya en uygun emsal karar ve açıklaması)
        2. Alternatif Görüşler (Benzer diğer kararların özeti)
        3. Sorumluluk Reddi (Sadece bilgilendirme amaçlıdır uyarısı)
        """
        
        response = model.generate_content(prompt)
        return {"emsaller": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/laws/stream")
async def get_laws_stream(request: LawRequest):
    def generate():
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            prompt = f"""Sen uzman bir Türk Hukuku asistanısın. Görevin, kullanıcının anlattığı olaya en uygun kanun maddelerini bulmaktır.
            Olay: {request.olay_metni}
            Lütfen bu olayın hangi Türk Kanunları ve maddeleri (örneğin Türk Borçlar Kanunu Madde X, Türk Ceza Kanunu vb.) kapsamına girdiğini açıkla."""
            
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
            prompt = f"""Sen uzman bir Türk Hukuku asistanısın. Görevin, kullanıcı olayına uyan Yargıtay veya Danıştay emsal kararlarını bulup analiz etmektir.
            Olay: {request.olay_metni}
            
            Aşağıdaki formatta yanıt ver:
            1. Baş Karar (Olaya en uygun emsal karar ve açıklaması)
            2. Alternatif Görüşler (Benzer diğer kararların özeti)
            3. Sorumluluk Reddi (Sadece bilgilendirme amaçlıdır uyarısı)"""
            
            response = model.generate_content(prompt, stream=True)
            for chunk in response:
                yield chunk.text
        except Exception as e:
            yield f"Hata: {str(e)}"
            
    return StreamingResponse(generate(), media_type="text/plain")

if __name__ == "__main__":

    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

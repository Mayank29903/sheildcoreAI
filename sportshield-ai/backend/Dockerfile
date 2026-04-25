# SportShield AI | Google Solution Challenge 2026 | First Prize Target
#
# KEY NOTES:
# - libsndfile1 + ffmpeg: required for librosa audio processing
# - libgl1 etc: required for OpenCV headless
# - Pre-download model at BUILD TIME — never on first request
# - Single worker: deepfake model NOT thread-safe across workers
# - --min-instances=1 on Cloud Run keeps this container warm

FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y \
    libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 \
    libsndfile1 ffmpeg \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -c "from transformers import pipeline; \
    p = pipeline('image-classification', \
    model='dima806/deepfake_vs_real_image_detection'); \
    print('SUCCESS: Deepfake model pre-loaded and cached in Docker layer')"
COPY . .
RUN mkdir -p /tmp/sportshield
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"]

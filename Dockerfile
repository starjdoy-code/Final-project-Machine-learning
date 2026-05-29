FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    libstdc++6 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY models/ ./models/
COPY backend/ ./backend/
COPY dist/ ./dist/

RUN pip install flask flask-cors numpy pandas scikit-learn xgboost joblib

EXPOSE 5000

CMD ["python3", "backend/server.py"]
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    default-libmysqlclient-dev gcc pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/uploads/avatars /app/uploads/covers /app/uploads/events

# Dùng shell form để $PORT được giãn ra (Railway/Render gán PORT động, mặc định 8001)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8001}

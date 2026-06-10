FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    default-libmysqlclient-dev gcc pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/uploads/avatars /app/uploads/covers /app/uploads/events

# exec-form + sh để vừa giãn được $PORT (Railway gán động) vừa cho uvicorn làm PID 1
# nhận SIGTERM trực tiếp (deploy/rollover sạch, không bị treo container).
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8001}"]

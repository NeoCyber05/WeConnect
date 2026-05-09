from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.routers import auth, users, events

app = FastAPI(
    title="WeConnect API",
    version="1.0.0",
    description="API hệ thống WeConnect — kết nối người Việt học tiếng Nhật và người Nhật tại Hà Nội",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Thu hẹp lại trong production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve ảnh upload
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1", tags=["Users & Profile"])
app.include_router(events.router, prefix="/api/v1/events", tags=["Events"])


@app.get("/health", tags=["System"])
def health():
    return {"status": "ok", "version": "1.0.0"}

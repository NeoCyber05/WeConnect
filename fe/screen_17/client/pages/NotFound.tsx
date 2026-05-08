import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] text-center px-6">
        <p className="text-brand-green text-sm font-bold tracking-widest uppercase mb-4">404</p>
        <h1 className="text-[#1B1B1D] text-3xl font-black tracking-tight mb-3">ページが見つかりません</h1>
        <p className="text-[#45464D] text-base mb-8 max-w-sm">
          このページはまだ準備中です。引き続きプロンプトで内容を追加してください。
        </p>
        <Link
          to="/"
          className="bg-brand-green hover:opacity-90 transition-opacity text-white text-sm font-bold px-6 py-3 rounded-lg"
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

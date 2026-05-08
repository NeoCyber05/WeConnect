import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-[#0F172A] font-bold text-xl">WeConnect</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Đăng nhập</h1>
        <p className="text-[#64748B] text-sm mb-8">
          Trang đăng nhập đang được xây dựng. Hãy tiếp tục nhắn để tạo nội dung cho trang này.
        </p>
        <Link
          to="/"
          className="text-[#10B981] font-semibold text-sm hover:underline"
        >
          ← Quay lại đăng ký
        </Link>
      </div>
    </div>
  );
}

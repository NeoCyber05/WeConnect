import { useState } from "react";

interface Event {
  id: number;
  name: string;
  category: string;
  date: string;
  location: string;
  maxAttendees: number;
  registered: number;
  status: "active" | "closed" | "cancelled";
  coverImage: string;
  description: string;
}

interface Props {
  event: Event;
  onClose: () => void;
  onSave: (event: Event) => void;
  onCancelEvent: (id: number) => void;
  onCloseRegistration: (id: number) => void;
}

const CATEGORIES = ["Công nghệ", "Kinh doanh", "Thiết kế", "Giáo dục", "Nghệ thuật", "Thể thao", "Khác"];

export default function EditEventModal({ event, onClose, onSave, onCancelEvent, onCloseRegistration }: Props) {
  const [form, setForm] = useState({ ...event });

  const set = (field: keyof Event, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[500px] bg-white rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] flex flex-col max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-slate-100 px-5 pt-3 pb-2">
          {/* Drag dots */}
          <div className="flex justify-center mb-1.5">
            <div className="flex items-center gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-black leading-[22px]">Chỉnh sửa sự kiện</h2>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12" stroke="#6B7280" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 4L12 12" stroke="#6B7280" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form body */}
        <div className="flex-1 px-5 py-3 flex flex-col gap-2.5">
          {/* Row 1: Event name + Category */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <label className="text-[12px] font-medium text-black leading-[18px]">Tên sự kiện</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="h-[33px] px-2.5 text-[13px] text-black border border-slate-200 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#131B2E] focus:border-[#131B2E] w-full"
              />
            </div>
            <div className="flex flex-col gap-0.5 w-[140px] flex-shrink-0">
              <label className="text-[12px] font-medium text-black leading-[18px]">Danh mục</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="h-[33px] px-2.5 text-[13px] text-black border border-slate-200 rounded-[6px] bg-white focus:outline-none focus:ring-1 focus:ring-[#131B2E] focus:border-[#131B2E] w-full appearance-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Max attendees + Date & Time */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-0.5 w-[140px] flex-shrink-0">
              <label className="text-[12px] font-medium text-black leading-[18px]">Số lượng tối đa</label>
              <input
                type="number"
                value={form.maxAttendees}
                onChange={(e) => set("maxAttendees", parseInt(e.target.value) || 0)}
                placeholder="200"
                className="h-[33px] px-2.5 text-[13px] placeholder-black/50 text-black border border-slate-200 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#131B2E] focus:border-[#131B2E] w-full"
              />
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <label className="text-[12px] font-medium text-black leading-[18px]">Ngày & Giờ</label>
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <g clipPath="url(#cal-clip)">
                    <path d="M4 1V3" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 1V3" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V10C1.5 10.5523 1.94772 11 2.5 11H9.5C10.0523 11 10.5 10.5523 10.5 10V3C10.5 2.44772 10.0523 2 9.5 2Z" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1.5 5H10.5" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="cal-clip"><rect width="12" height="12" fill="white" /></clipPath>
                  </defs>
                </svg>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className="h-[33px] pl-7 pr-2.5 text-[13px] text-black border border-slate-200 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#131B2E] focus:border-[#131B2E] w-full"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[12px] font-medium text-black leading-[18px]">Địa điểm</label>
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <g clipPath="url(#loc-clip)">
                  <path d="M10 5C10 7.4965 7.2305 10.0965 6.3005 10.8995C6.21386 10.9646 6.1084 10.9999 6 10.9999C5.8916 10.9999 5.78614 10.9646 5.6995 10.8995C4.7695 10.0965 2 7.4965 2 5C2 3.93913 2.42143 2.92172 3.17157 2.17157C3.92172 1.42143 4.93913 1 6 1C7.06087 1 8.07828 1.42143 8.82843 2.17157C9.57857 2.92172 10 3.93913 10 5Z" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 6.5C6.82843 6.5 7.5 5.82843 7.5 5C7.5 4.17157 6.82843 3.5 6 3.5C5.17157 3.5 4.5 4.17157 4.5 5C4.5 5.82843 5.17157 6.5 6 6.5Z" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <clipPath id="loc-clip"><rect width="12" height="12" fill="white" /></clipPath>
                </defs>
              </svg>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className="h-[33px] pl-7 pr-2.5 text-[13px] text-black border border-slate-200 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#131B2E] focus:border-[#131B2E] w-full"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-0.5 flex-1">
            <label className="text-[12px] font-medium text-black leading-[18px]">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="h-[52px] px-2.5 py-1.5 text-[13px] text-black border border-slate-200 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#131B2E] focus:border-[#131B2E] resize-none w-full"
            />
          </div>

          {/* Cover image */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[12px] font-medium text-black leading-[18px]">Ảnh bìa</label>
            <div className="flex items-center gap-2 h-[42px]">
              <div className="w-16 h-[42px] p-[0.8px] border border-slate-200 rounded-[4px] overflow-hidden flex-shrink-0">
                <img
                  src={form.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="flex-1 h-[34px] flex items-center justify-center border border-dashed border-slate-200 rounded-[6px] text-[11px] text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-colors">
                Thay đổi ảnh bìa
              </button>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex-shrink-0 border-t border-slate-100 px-5 pt-2 pb-3 flex flex-col gap-2">
          {/* Row 1: Cancel + Close registration */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCancelEvent(form.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-[5.8px] rounded-[6px] bg-[#EF4444] hover:bg-red-500 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <g clipPath="url(#cancel-clip)">
                  <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.4502 2.45001L9.5502 9.55001" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <clipPath id="cancel-clip"><rect width="12" height="12" fill="white" /></clipPath>
                </defs>
              </svg>
              <span className="text-[12px] font-medium text-white leading-[18px]">Hủy sự kiện</span>
            </button>
            <button
              onClick={() => onCloseRegistration(form.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-[5.8px] rounded-[6px] bg-[#F59E0B] hover:bg-amber-500 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <g clipPath="url(#lock-clip)">
                  <path d="M9.5 5.5H2.5C1.94772 5.5 1.5 5.94772 1.5 6.5V10C1.5 10.5523 1.94772 11 2.5 11H9.5C10.0523 11 10.5 10.5523 10.5 10V6.5C10.5 5.94772 10.0523 5.5 9.5 5.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.5 5.5V3.5C3.5 2.83696 3.76339 2.20107 4.23223 1.73223C4.70107 1.26339 5.33696 1 6 1C6.66304 1 7.29893 1.26339 7.76777 1.73223C8.23661 2.20107 8.5 2.83696 8.5 3.5V5.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <clipPath id="lock-clip"><rect width="12" height="12" fill="white" /></clipPath>
                </defs>
              </svg>
              <span className="text-[12px] font-medium text-white leading-[18px]">Đóng đăng ký</span>
            </button>
          </div>

          {/* Row 2: Save */}
          <div className="flex justify-end">
            <button
              onClick={() => onSave(form)}
              className="flex items-center gap-1.5 px-4 py-[6.6px] rounded-[6px] bg-[#131B2E] hover:bg-[#1e2a42] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M8.23333 1.625C8.51908 1.62907 8.79165 1.74588 8.99167 1.95L11.05 4.00833C11.2541 4.20835 11.3709 4.48092 11.375 4.76667V10.2917C11.375 10.579 11.2609 10.8545 11.0577 11.0577C10.8545 11.2609 10.579 11.375 10.2917 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V2.70833C1.625 2.42102 1.73914 2.14547 1.9423 1.9423C2.14547 1.73914 2.42102 1.625 2.70833 1.625H8.23333Z" stroke="white" strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.20866 11.375V7.58332C9.20866 7.43966 9.15159 7.30189 9.05001 7.20031C8.94843 7.09872 8.81065 7.04166 8.66699 7.04166H4.33366C4.19 7.04166 4.05222 7.09872 3.95064 7.20031C3.84906 7.30189 3.79199 7.43966 3.79199 7.58332V11.375" stroke="white" strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.79199 1.625V3.79167C3.79199 3.93533 3.84906 4.0731 3.95064 4.17468C4.05222 4.27627 4.19 4.33333 4.33366 4.33333H8.12533" stroke="white" strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-medium text-white leading-[19.5px]">Lưu thay đổi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

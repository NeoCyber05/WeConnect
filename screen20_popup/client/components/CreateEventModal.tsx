import { useState } from "react";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    tenSuKien: "",
    danhMuc: "",
    loaiSuKien: "",
    ngayGio: "",
    diaDiem: "",
    soLuong: "",
    moTa: "",
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[520px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex flex-col gap-1.5">
          {/* Drag dots */}
          <div className="flex justify-center">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>
          {/* Title row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-black leading-snug">Tạo sự kiện mới</h2>
              <p className="text-xs text-gray-500 leading-4">Điền thông tin để tạo sự kiện mới</p>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12" stroke="#6B7280" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 4L12 12" stroke="#6B7280" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Form body */}
        <div className="px-5 pt-3 pb-2 flex flex-col gap-2.5 overflow-y-auto">
          {/* Tên sự kiện */}
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-medium text-black leading-[18px]">
              Tên sự kiện <span className="text-[#FB2C36]">*</span>
            </label>
            <input
              type="text"
              placeholder="Vd: Hội thảo Digital Marketing 2024"
              value={formData.tenSuKien}
              onChange={(e) => setFormData({ ...formData, tenSuKien: e.target.value })}
              className="h-[33px] px-3 text-[13px] text-slate-400 placeholder-slate-400 border border-slate-200 rounded-md focus:outline-none focus:border-emerald-500 focus:text-slate-800 transition-colors"
            />
          </div>

          {/* Danh mục + Loại sự kiện */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5">
              <label className="text-xs font-medium text-black leading-[18px]">
                Danh mục <span className="text-[#FB2C36]">*</span>
              </label>
              <select
                value={formData.danhMuc}
                onChange={(e) => setFormData({ ...formData, danhMuc: e.target.value })}
                className="h-[33px] px-3 text-[13px] text-slate-400 border border-slate-200 rounded-md focus:outline-none focus:border-emerald-500 bg-white appearance-none transition-colors"
              >
                <option value="" disabled>Chọn danh mục</option>
                <option value="hoi-thao">Hội thảo</option>
                <option value="dao-tao">Đào tạo</option>
                <option value="giai-tri">Giải trí</option>
                <option value="the-thao">Thể thao</option>
              </select>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs font-medium text-black leading-[18px]">
                Loại sự kiện
              </label>
              <select
                value={formData.loaiSuKien}
                onChange={(e) => setFormData({ ...formData, loaiSuKien: e.target.value })}
                className="h-[33px] px-3 text-[13px] text-slate-400 border border-slate-200 rounded-md focus:outline-none focus:border-emerald-500 bg-white appearance-none transition-colors"
              >
                <option value="" disabled>Chọn loại</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Ngày & Giờ + Địa điểm */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5">
              <label className="text-xs font-medium text-black leading-[18px]">
                Ngày &amp; Giờ <span className="text-[#FB2C36]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip_cal)">
                      <path d="M4 1V3" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 1V3" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V10C1.5 10.5523 1.94772 11 2.5 11H9.5C10.0523 11 10.5 10.5523 10.5 10V3C10.5 2.44772 10.0523 2 9.5 2Z" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1.5 5H10.5" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs><clipPath id="clip_cal"><rect width="12" height="12" fill="white"/></clipPath></defs>
                  </svg>
                </span>
                <input
                  type="datetime-local"
                  value={formData.ngayGio}
                  onChange={(e) => setFormData({ ...formData, ngayGio: e.target.value })}
                  className="h-[33px] w-full pl-7 pr-2 text-[13px] text-slate-400 border border-slate-200 rounded-md focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs font-medium text-black leading-[18px]">
                Địa điểm <span className="text-[#FB2C36]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip_loc)">
                      <path d="M10 5C10 7.4965 7.2305 10.0965 6.3005 10.8995C6.21386 10.9646 6.1084 10.9999 6 10.9999C5.8916 10.9999 5.78614 10.9646 5.6995 10.8995C4.7695 10.0965 2 7.4965 2 5C2 3.93913 2.42143 2.92172 3.17157 2.17157C3.92172 1.42143 4.93913 1 6 1C7.06087 1 8.07828 1.42143 8.82843 2.17157C9.57857 2.92172 10 3.93913 10 5Z" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6.5C6.82843 6.5 7.5 5.82843 7.5 5C7.5 4.17157 6.82843 3.5 6 3.5C5.17157 3.5 4.5 4.17157 4.5 5C4.5 5.82843 5.17157 6.5 6 6.5Z" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs><clipPath id="clip_loc"><rect width="12" height="12" fill="white"/></clipPath></defs>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Nhập địa điểm..."
                  value={formData.diaDiem}
                  onChange={(e) => setFormData({ ...formData, diaDiem: e.target.value })}
                  className="h-[33px] w-full pl-7 pr-3 text-[13px] text-slate-400 placeholder-slate-400 border border-slate-200 rounded-md focus:outline-none focus:border-emerald-500 focus:text-slate-800 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Số lượng + Mô tả */}
          <div className="flex gap-2 items-start">
            <div className="flex flex-col gap-0.5 w-[140px] flex-shrink-0">
              <label className="text-xs font-medium text-black leading-[18px]">
                Số lượng tối đa <span className="text-[#FB2C36]">*</span>
              </label>
              <input
                type="number"
                placeholder="Vd: 100"
                value={formData.soLuong}
                onChange={(e) => setFormData({ ...formData, soLuong: e.target.value })}
                className="h-[33px] px-3 text-[13px] text-slate-400 placeholder-slate-400 border border-slate-200 rounded-md focus:outline-none focus:border-emerald-500 focus:text-slate-800 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <label className="text-xs font-medium text-black leading-[18px]">
                Mô tả <span className="text-[#FB2C36]">*</span>
              </label>
              <textarea
                placeholder="Mô tả nội dung, mục đích sự kiện..."
                value={formData.moTa}
                onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                rows={3}
                className="px-2.5 py-1.5 text-[13px] text-slate-400 placeholder-slate-400 border border-slate-200 rounded-md focus:outline-none focus:border-emerald-500 focus:text-slate-800 resize-none transition-colors leading-[1.5]"
              />
            </div>
          </div>

          {/* Image upload */}
          <button className="w-full h-[40px] flex items-center justify-center gap-2 border border-dashed border-slate-200 rounded-md hover:border-slate-300 hover:bg-slate-50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip_img)">
                <path d="M10.666 3.33334H14.666" stroke="#94A3B8" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.666 1.33334V5.33334" stroke="#94A3B8" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 7.66667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H8.33333" stroke="#94A3B8" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 9.99999L11.9427 7.94266C11.6926 7.6927 11.3536 7.55228 11 7.55228C10.6464 7.55228 10.3074 7.6927 10.0573 7.94266L4 14" stroke="#94A3B8" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.99935 7.33332C6.73573 7.33332 7.33268 6.73637 7.33268 5.99999C7.33268 5.26361 6.73573 4.66666 5.99935 4.66666C5.26297 4.66666 4.66602 5.26361 4.66602 5.99999C4.66602 6.73637 5.26297 7.33332 5.99935 7.33332Z" stroke="#94A3B8" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs><clipPath id="clip_img"><rect width="16" height="16" fill="white"/></clipPath></defs>
            </svg>
            <span className="text-xs text-slate-400">Tải lên ảnh bìa sự kiện</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-[13px] font-medium text-[#1B1B1D] rounded-md hover:bg-slate-100 transition-colors"
          >
            Hủy
          </button>
          <button
            className="px-4 py-1.5 text-[13px] font-medium text-white bg-[#059669] rounded-md hover:bg-emerald-700 transition-colors"
          >
            Tạo sự kiện
          </button>
        </div>
      </div>
    </div>
  );
}

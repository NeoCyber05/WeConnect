import { useState } from "react";
import EditEventModal, { Event } from "../components/EditEventModal";

const initialEvents: Event[] = [
  {
    id: 1,
    name: "Hội thảo Công nghệ Blockchain 2024",
    category: "Công nghệ",
    maxAttendees: 200,
    date: "24/05/2024, 08:30 AM",
    location: "Trung tâm Hội nghị Quốc gia",
    description:
      "Hội thảo chuyên sâu về công nghệ Blockchain và ứng dụng trong các lĩnh vực kinh tế, tài chính.",
    coverImage:
      "https://api.builder.io/api/v1/image/assets/TEMP/aece6927bc5f80fe28ed9c9383395a5207764768?width=125",
    status: "active",
  },
  {
    id: 2,
    name: "Ngày hội Khởi nghiệp Đổi mới Sáng tạo",
    category: "Kinh doanh",
    maxAttendees: 500,
    date: "10/06/2024, 09:00 AM",
    location: "Cung Văn hóa Lao động TP.HCM",
    description:
      "Sự kiện kết nối các startup, nhà đầu tư và doanh nghiệp trong hệ sinh thái khởi nghiệp Việt Nam.",
    coverImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    status: "active",
  },
  {
    id: 3,
    name: "Hội nghị Giáo dục Quốc tế 2024",
    category: "Giáo dục",
    maxAttendees: 300,
    date: "15/07/2024, 08:00 AM",
    location: "Đại học Quốc gia Hà Nội",
    description:
      "Diễn đàn trao đổi kinh nghiệm và xu hướng giáo dục hiện đại giữa các chuyên gia trong và ngoài nước.",
    coverImage:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop",
    status: "closed",
  },
  {
    id: 4,
    name: "Workshop Thiết kế UX/UI Nâng cao",
    category: "Công nghệ",
    maxAttendees: 80,
    date: "20/05/2024, 13:00 PM",
    location: "Toà nhà Keangnam, Hà Nội",
    description:
      "Workshop thực hành chuyên sâu về thiết kế giao diện người dùng với các công cụ hiện đại.",
    coverImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop",
    status: "cancelled",
  },
  {
    id: 5,
    name: "Triển lãm Văn hóa Nghệ thuật Đương đại",
    category: "Văn hóa",
    maxAttendees: 1000,
    date: "01/08/2024, 10:00 AM",
    location: "Bảo tàng Mỹ thuật Việt Nam",
    description:
      "Triển lãm quy mô lớn trưng bày các tác phẩm nghệ thuật đương đại của nghệ sĩ Việt Nam và quốc tế.",
    coverImage:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=200&fit=crop",
    status: "active",
  },
  {
    id: 6,
    name: "Giải Chạy Marathon TP.HCM 2024",
    category: "Thể thao",
    maxAttendees: 5000,
    date: "18/08/2024, 05:30 AM",
    location: "Phố đi bộ Nguyễn Huệ, TP.HCM",
    description:
      "Giải chạy marathon quy mô lớn nhất miền Nam với các cự ly 5km, 10km, 21km và 42km.",
    coverImage:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=200&fit=crop",
    status: "active",
  },
];

const statusConfig = {
  active: {
    label: "Đang diễn ra",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  closed: {
    label: "Đóng đăng ký",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  cancelled: {
    label: "Đã hủy",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
  },
};

const categoryColors: Record<string, string> = {
  "Công nghệ": "bg-blue-100 text-blue-700",
  "Giáo dục": "bg-indigo-100 text-indigo-700",
  "Kinh doanh": "bg-purple-100 text-purple-700",
  "Văn hóa": "bg-pink-100 text-pink-700",
  "Thể thao": "bg-orange-100 text-orange-700",
  "Y tế": "bg-teal-100 text-teal-700",
};

export default function Index() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = events.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSave = (updated: Event) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
    setEditingEvent(null);
  };

  const handleCancel = () => {
    if (!editingEvent) return;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === editingEvent.id ? { ...e, status: "cancelled" } : e
      )
    );
    setEditingEvent(null);
  };

  const handleCloseRegistration = () => {
    if (!editingEvent) return;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === editingEvent.id ? { ...e, status: "closed" } : e
      )
    );
    setEditingEvent(null);
  };

  const stats = {
    total: events.length,
    active: events.filter((e) => e.status === "active").length,
    closed: events.filter((e) => e.status === "closed").length,
    cancelled: events.filter((e) => e.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Nav */}
      <header className="bg-[#131B2E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <rect
                    x="2"
                    y="2"
                    width="5"
                    height="5"
                    rx="1"
                    fill="white"
                  />
                  <rect
                    x="9"
                    y="2"
                    width="5"
                    height="5"
                    rx="1"
                    fill="white"
                    opacity="0.7"
                  />
                  <rect
                    x="2"
                    y="9"
                    width="5"
                    height="5"
                    rx="1"
                    fill="white"
                    opacity="0.7"
                  />
                  <rect
                    x="9"
                    y="9"
                    width="5"
                    height="5"
                    rx="1"
                    fill="white"
                  />
                </svg>
              </div>
              <span className="font-bold text-[15px] tracking-tight">
                EventHub
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {["Dashboard", "Sự kiện", "Người dùng", "Báo cáo"].map(
                (item, i) => (
                  <button
                    key={item}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      i === 1
                        ? "bg-white/10 text-white font-medium"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </nav>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Quản lý Sự kiện
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Quản lý tất cả sự kiện của bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Tổng sự kiện",
              value: stats.total,
              color: "text-[#131B2E]",
              bg: "bg-white",
            },
            {
              label: "Đang diễn ra",
              value: stats.active,
              color: "text-emerald-600",
              bg: "bg-white",
            },
            {
              label: "Đóng đăng ký",
              value: stats.closed,
              color: "text-amber-600",
              bg: "bg-white",
            },
            {
              label: "Đã hủy",
              value: stats.cancelled,
              color: "text-red-500",
              bg: "bg-white",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-xl border border-slate-100 shadow-sm px-4 py-3`}
            >
              <div className={`text-2xl font-bold ${s.color}`}>
                {s.value}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M6.33333 11.6667C9.27885 11.6667 11.6667 9.27885 11.6667 6.33333C11.6667 3.38781 9.27885 1 6.33333 1C3.38781 1 1 3.38781 1 6.33333C1 9.27885 3.38781 11.6667 6.33333 11.6667Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 13L10.1 10.1"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-sm border border-slate-200 rounded-lg bg-white outline-none focus:border-slate-400 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white outline-none focus:border-slate-400 transition-colors appearance-none cursor-pointer pr-8"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang diễn ra</option>
              <option value="closed">Đóng đăng ký</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <button className="h-9 px-4 text-sm font-medium text-white bg-[#131B2E] hover:bg-[#1e2d4a] rounded-lg transition-colors flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1V11M1 6H11"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Thêm mới
            </button>
          </div>
        </div>

        {/* Event grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-slate-400"
              >
                <path
                  d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              Không tìm thấy sự kiện nào
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((event) => {
              const status = statusConfig[event.status];
              const catColor =
                categoryColors[event.category] ||
                "bg-gray-100 text-gray-700";
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {/* Cover image */}
                  <div className="relative h-36 overflow-hidden bg-slate-100">
                    <img
                      src={event.coverImage}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${catColor}`}
                      >
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                        />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug">
                      {event.name}
                    </h3>
                    <div className="flex flex-col gap-1 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <g clipPath="url(#cal2)">
                            <path
                              d="M4 1V3M8 1V3M9.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V10C1.5 10.5523 1.94772 11 2.5 11H9.5C10.0523 11 10.5 10.5523 10.5 10V3C10.5 2.44772 10.0523 2 9.5 2ZM1.5 5H10.5"
                              stroke="#94A3B8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="cal2">
                              <rect width="12" height="12" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <g clipPath="url(#loc2)">
                            <path
                              d="M10 5C10 7.4965 7.2305 10.0965 6.3005 10.8995C6.21386 10.9646 6.1084 10.9999 6 10.9999C5.8916 10.9999 5.78614 10.9646 5.6995 10.8995C4.7695 10.0965 2 7.4965 2 5C2 3.93913 2.42143 2.92172 3.17157 2.17157C3.92172 1.42143 4.93913 1 6 1C7.06087 1 8.07828 1.42143 8.82843 2.17157C9.57857 2.92172 10 3.93913 10 5ZM6 6.5C6.82843 6.5 7.5 5.82843 7.5 5C7.5 4.17157 6.82843 3.5 6 3.5C5.17157 3.5 4.5 4.17157 4.5 5C4.5 5.82843 5.17157 6.5 6 6.5Z"
                              stroke="#94A3B8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="loc2">
                              <rect width="12" height="12" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M10 10C10 10 10 8 6 8C2 8 2 10 2 10M6 6C7.10457 6 8 5.10457 8 4C8 2.89543 7.10457 2 6 2C4.89543 2 4 2.89543 4 4C4 5.10457 4.89543 6 6 6Z"
                            stroke="#94A3B8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {event.maxAttendees.toLocaleString()} người
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingEvent(event)}
                      className="w-full h-8 text-xs font-medium text-[#131B2E] border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z"
                          stroke="#131B2E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSave}
          onCancel={handleCancel}
          onCloseRegistration={handleCloseRegistration}
        />
      )}
    </div>
  );
}

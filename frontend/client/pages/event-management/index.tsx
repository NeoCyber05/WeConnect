import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import EditEventModal, { Event } from "@/components/EditEventModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface EventOut {
  event_id: number;
  title: string;
  category: string | null;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  image_url: string | null;
  status: string;
  registered_count: number;
  is_full: boolean;
  is_registered: boolean;
  organizer: { user_id: number; full_name: string; avatar_url?: string };
}

function formatDateTimeLocal(dateString?: string) {
  if (!dateString) return "";
  const normalized = (dateString.endsWith('Z') || dateString.includes('+')) 
    ? dateString 
    : dateString + 'Z';
    
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseAPIDateTime(dateString?: string): Date {
  if (!dateString) return new Date(0);
  // Thêm 'Z' nếu chưa có timezone info — backend trả về UTC không có suffix
  const normalized = (dateString.endsWith('Z') || dateString.includes('+') || dateString.includes('-', 10))
    ? dateString
    : dateString + 'Z';
  return new Date(normalized);
}

function mapEventOutToEvent(e: EventOut): Event {
  const apiStatus = e.status?.toUpperCase();
  const now = new Date();
  const start = parseAPIDateTime(e.start_time);
  const end = parseAPIDateTime(e.end_time);

  const isClosed = apiStatus === "CLOSED";
  const isCancelled = apiStatus === "CANCELLED";
  let timeStatus: "upcoming" | "ongoing" | "finished" = "upcoming";

  if (now < start) {
    timeStatus = "upcoming";
  } else if (now >= start && now <= end) {
    timeStatus = "ongoing";
  } else {
    timeStatus = "finished";
  }

  return {
    id: e.event_id,
    name: e.title,
    category: e.category || "",
    maxAttendees: e.capacity,
    date: formatDateTimeLocal(e.start_time),
    endDate: formatDateTimeLocal(e.end_time),
    location: e.location || "",
    description: e.description || "",
    coverImage: e.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    status: isCancelled ? "cancelled" : (isClosed ? "closed" : timeStatus),
    timeStatus,
    isClosed,
    isCancelled,
  };
}

const statusConfig = {
  upcoming: {
    label: "Sắp tới",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    dot: "bg-blue-500",
  },
  ongoing: {
    label: "Đang diễn ra",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    dot: "bg-emerald-500",
  },
  finished: {
    label: "Đã kết thúc",
    bg: "bg-slate-500/10",
    text: "text-slate-500",
    dot: "bg-slate-500",
  },
  closed: {
    label: "Đóng đăng ký",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    dot: "bg-amber-500",
  },
  cancelled: {
    label: "Đã hủy",
    bg: "bg-red-500/10",
    text: "text-red-500",
    dot: "bg-red-500",
  },
};

const categoryColors: Record<string, string> = {
  "Công nghệ": "bg-slate-900 text-white",
  "Kinh doanh": "bg-slate-900 text-white",
  "Giáo dục": "bg-slate-900 text-white",
  "Nghệ thuật": "bg-slate-900 text-white",
};

export default function Index() {
  const queryClient = useQueryClient();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: apiEvents, isLoading } = useQuery({
    queryKey: ["managed-events"],
    queryFn: () => apiFetch<EventOut[]>("/api/v1/events/managed"),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiFetch("/api/v1/events", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["managed-events"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiFetch(`/api/v1/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["managed-events"] }),
  });


  const events: Event[] = (apiEvents ?? []).map(mapEventOutToEvent);
  
  const CATEGORIES = ["Công nghệ", "Kinh doanh", "Giáo dục", "Nghệ thuật"];

  const filtered = events.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatuses.length === 0 || 
                          selectedStatuses.includes(e.status) || 
                          selectedStatuses.includes(e.timeStatus);
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(e.category);
    
    let matchesTime = true;
    if (selectedTime !== "all") {
      const now = new Date();
      const eventDate = new Date(e.date);

      if (selectedTime === "today") {
        matchesTime = eventDate.toDateString() === now.toDateString();
      } else if (selectedTime === "week") {
        // Tính toán Thứ 2 và Chủ nhật của tuần hiện tại
        const curr = new Date(now);
        const day = curr.getDay(); // 0 (CN) - 6 (T7)
        const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
        
        const monday = new Date(curr.setDate(diffToMonday));
        monday.setHours(0, 0, 0, 0);
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        
        matchesTime = eventDate >= monday && eventDate <= sunday;
      } else if (selectedTime === "month") {
        // Từ ngày 1 đến ngày cuối cùng của tháng hiện tại
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        lastDay.setHours(23, 59, 59, 999);
        
        matchesTime = eventDate >= firstDay && eventDate <= lastDay;
      }
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesTime;
  });

  const handleSave = (updated: Event) => {
    const startDate = updated.date ? new Date(updated.date) : new Date();
    const endDate = updated.endDate ? new Date(updated.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const payload: any = {
      title: updated.name,
      description: updated.description,
      location: updated.location,
      capacity: parseInt(updated.maxAttendees as any, 10) || 50,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      image_url: updated.coverImage,
      category: updated.category,
    };

    // Chỉ gửi status nếu là tạo mới hoặc người dùng chọn đóng/mở lại
    if (updated.id === 0) {
      payload.status = 'UPCOMING';
    } else if (updated.status === 'closed') {
      payload.status = 'CLOSED';
    } else if (updated.status === 'upcoming') {
      // Trường hợp re-open sự kiện đang bị đóng
      payload.status = 'UPCOMING';
    }

    if (updated.id === 0) {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate({ id: updated.id, data: payload });
    }
    setEditingEvent(null);
  };

  const handleCancel = () => {
    if (!editingEvent || editingEvent.id === 0) {
      setEditingEvent(null);
      return;
    }
    if (confirm("Bạn có chắc chắn muốn hủy sự kiện này?")) {
      updateMutation.mutate({ id: editingEvent.id, data: { status: "CANCELLED" } });
      setEditingEvent(null);
    }
  };

  const handleCloseRegistration = () => {
    if (!editingEvent || editingEvent.id === 0) {
      setEditingEvent(null);
      return;
    }
    updateMutation.mutate({ id: editingEvent.id, data: { status: "CLOSED" } });
    setEditingEvent(null);
  };

  const activeEvents = events.filter(e => !e.isCancelled);
  const stats = {
    total: activeEvents.length,
    ongoing: activeEvents.filter(e => e.timeStatus === "ongoing").length,
    upcoming: activeEvents.filter(e => e.timeStatus === "upcoming").length,
    finished: activeEvents.filter(e => e.timeStatus === "finished").length,
    cancelled: events.filter(e => e.isCancelled).length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter pb-10">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Bộ lọc sự kiện</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Tìm kiếm</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tên, địa điểm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 text-sm bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-200 transition-all"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Trạng thái</label>
                <div className="space-y-2">
                  {[
                    { id: "ongoing", label: "Đang diễn ra" },
                    { id: "upcoming", label: "Sắp tới" },
                    { id: "finished", label: "Đã kết thúc" },
                    { id: "closed", label: "Đóng đăng ký" }
                  ].map(s => (
                    <label key={s.id} className="flex items-center group cursor-pointer">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(s.id)}
                          onChange={() => {
                            setSelectedStatuses(prev => 
                              prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id]
                            );
                          }}
                          className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-slate-900 checked:border-slate-900 transition-all"
                        />
                        <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Thời gian</label>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "Tất cả" },
                    { id: "today", label: "Hôm nay" },
                    { id: "week", label: "Tuần này" },
                    { id: "month", label: "Tháng này" }
                  ].map(t => (
                    <label key={t.id} className="flex items-center group cursor-pointer">
                      <input
                        type="radio"
                        name="time"
                        checked={selectedTime === t.id}
                        onChange={() => setSelectedTime(t.id)}
                        className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-full checked:border-[6px] checked:border-slate-900 transition-all"
                      />
                      <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Danh mục</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCategories(prev => 
                          prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selectedCategories.includes(c) 
                          ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sự kiện của bạn</h1>
                <p className="text-slate-500 font-medium mt-1">Quản lý và theo dõi hiệu quả các hoạt động</p>
              </div>
              <button
                onClick={() => {
                  const d = new Date();
                  const startISO = formatDateTimeLocal(d.toISOString());
                  const endISO = formatDateTimeLocal(new Date(d.getTime() + 2 * 60 * 60 * 1000).toISOString());
                  
                  setEditingEvent({
                    id: 0,
                    name: "",
                    category: "Công nghệ",
                    maxAttendees: 50,
                    date: startISO,
                    endDate: endISO,
                    location: "",
                    description: "",
                    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
                    status: "upcoming",
                    timeStatus: "upcoming",
                    isClosed: false,
                  });
                }}
                className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-slate-200 active:scale-95"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Tạo sự kiện mới
              </button>
            </div>

            {/* Quick Stats Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: "Tổng số", value: stats.total, icon: "📊", color: "bg-blue-50 text-blue-600" },
                { label: "Đang chạy", value: stats.ongoing, icon: "⚡", color: "bg-emerald-50 text-emerald-600" },
                { label: "Sắp tới", value: stats.upcoming, icon: "📅", color: "bg-violet-50 text-violet-600" },
                { label: "Hoàn thành", value: stats.finished, icon: "✅", color: "bg-slate-100 text-slate-600" },
                { label: "Đã hủy", value: stats.cancelled, icon: "🚫", color: "bg-red-50 text-red-500" },
              ].map(s => (
                <div key={s.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
                  <div className="text-2xl font-black text-slate-900">{s.value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Event Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-[400px] bg-slate-100 rounded-3xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-slate-100 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-900">Không tìm thấy kết quả</h3>
                <p className="text-slate-500 mt-2">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((event) => {
                  const status = statusConfig[event.status] || statusConfig.upcoming;
                  const catColor = categoryColors[event.category] || "bg-slate-900 text-white";
                  return (
                    <div key={event.id} className="group bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                      <div className="relative h-48 overflow-hidden">
                        <img src={event.coverImage} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 ${catColor} text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg`}>
                            {event.category}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                          {event.isCancelled ? (
                            <span className={`px-2.5 py-1 ${statusConfig.cancelled.bg} ${statusConfig.cancelled.text} text-[10px] font-bold rounded-lg shadow-sm flex items-center gap-1.5`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.cancelled.dot}`} />
                              {statusConfig.cancelled.label}
                            </span>
                          ) : (
                            event.isClosed && (
                              <span className={`px-2.5 py-1 ${statusConfig.closed.bg} ${statusConfig.closed.text} text-[10px] font-bold rounded-lg shadow-sm flex items-center gap-1.5`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.closed.dot}`} />
                                {statusConfig.closed.label}
                              </span>
                            )
                          )}
                          {!event.isCancelled && (
                            <span className={`px-2.5 py-1 ${statusConfig[event.timeStatus].bg} ${statusConfig[event.timeStatus].text} text-[10px] font-bold rounded-lg shadow-sm flex items-center gap-1.5`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[event.timeStatus].dot}`} />
                              {statusConfig[event.timeStatus].label}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-bold text-lg leading-tight line-clamp-1">{event.name}</h3>
                          <div className="flex items-center gap-3 mt-2 text-white/80 text-xs">
                            <span className="flex items-center gap-1">📍 {event.location}</span>
                            <span className="flex items-center gap-1">👥 {event.maxAttendees} chỗ</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                          {event.description || "Không có mô tả cho sự kiện này."}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {event.date ? new Date(event.date).toLocaleString("vi-VN", { dateStyle: 'medium', timeStyle: 'short' }) : "N/A"}
                          </div>
                          <button
                            onClick={() => setEditingEvent(event)}
                            className="h-10 px-5 border-2 border-slate-100 hover:border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 text-xs font-bold rounded-xl transition-all active:scale-95"
                          >
                            Chi tiết & Sửa
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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

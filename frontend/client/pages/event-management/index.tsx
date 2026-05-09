import { useState } from "react";
import Navbar from "@/components/Navbar";
import EditEventModal, { Event } from "@/components/EditEventModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface EventOut {
  event_id: number;
  title: string;
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

function mapEventOutToEvent(e: EventOut): Event {
  const apiStatus = e.status?.toUpperCase();
  let status: "active" | "closed" | "cancelled" = "active";
  if (apiStatus === "FINISHED") status = "closed";
  else if (apiStatus === "CANCELLED") status = "cancelled";
  else if (apiStatus === "UPCOMING" || apiStatus === "ONGOING") status = "active";

  return {
    id: e.event_id,
    name: e.title,
    category: "Sự kiện",
    maxAttendees: e.capacity,
    date: e.start_time ? new Date(e.start_time).toLocaleString("vi-VN") : "",
    location: e.location,
    description: e.description,
    coverImage: e.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    status,
  };
}


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
  const queryClient = useQueryClient();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/v1/events/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["managed-events"] }),
  });

  const events: Event[] = (apiEvents ?? []).map(mapEventOutToEvent);

  const filtered = events.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSave = (updated: Event) => {
    const payload = {
      title: updated.name,
      description: updated.description,
      location: updated.location,
      capacity: updated.maxAttendees,
      start_time: updated.date,
      end_time: updated.date, // Needs proper end time handling
    };

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
    if (confirm("Bạn có chắc chắn muốn xoá sự kiện này?")) {
      deleteMutation.mutate(editingEvent.id);
      setEditingEvent(null);
    }
  };

  const handleCloseRegistration = () => {
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: { status: "CLOSED" } });
    }
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
      <Navbar />

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
            <button
              onClick={() => setEditingEvent({
                id: 0,
                name: "",
                category: "",
                maxAttendees: 50,
                date: new Date().toISOString(),
                location: "",
                description: "",
                coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
                status: "active"
              })}
              className="h-9 px-4 text-sm font-medium text-white bg-wc-green hover:bg-wc-green/90 rounded-lg transition-colors flex items-center gap-1.5"
            >
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

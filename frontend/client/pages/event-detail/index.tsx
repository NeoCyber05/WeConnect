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

interface UserOut {
  user_id: number;
  role: string;
}

function mapEventOutToEditEvent(e: EventOut): Event {
  const apiStatus = e.status?.toUpperCase();
  let status: "active" | "closed" | "cancelled" = "active";
  if (apiStatus === "FINISHED") status = "closed";
  else if (apiStatus === "CANCELLED") status = "cancelled";
  
  return {
    id: e.event_id,
    name: e.title,
    category: "Sự kiện", // Default or map if available
    maxAttendees: e.capacity,
    date: e.start_time,
    location: e.location,
    description: e.description,
    coverImage: e.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    status,
  };
}

const CalendarIcon = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip-cal)">
      <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z" fill="#009668" />
    </g>
    <defs><clipPath id="clip-cal"><rect width="18" height="20" fill="white" /></clipPath></defs>
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip-loc)">
      <path d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z" fill="#009668" />
    </g>
    <defs><clipPath id="clip-loc"><rect width="16" height="20" fill="white" /></clipPath></defs>
  </svg>
);

const BackArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="#4A6741" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Index() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<UserOut>("/api/v1/users/me"),
  });

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: () => apiFetch<EventOut>(`/api/v1/events/${id}`),
    enabled: !!id,
  });

  const registerMutation = useMutation({
    mutationFn: () => apiFetch(`/api/v1/events/${id}/register`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["event", id] }),
  });

  const unregisterMutation = useMutation({
    mutationFn: () => apiFetch(`/api/v1/events/${id}/register`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["event", id] }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<EventOut>) => apiFetch(`/api/v1/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      setIsEditing(false);
    },
  });

  const isOrganizer = user?.user_id === event?.organizer.user_id;

  const registered = event?.registered_count ?? 0;
  const total = event?.capacity ?? 1;
  const progressPct = (registered / total) * 100;

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <main className="max-w-[1180px] mx-auto px-6 py-6 pb-12">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-brand-dark-green text-sm font-semibold mb-6 hover:opacity-80 transition-opacity"
        >
          <BackArrowIcon />
          <span>Quay lại danh sách sự kiện</span>
        </Link>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && (
          <p className="text-center text-red-500 py-10">Không thể tải sự kiện.</p>
        )}

        {event && (
          <>
            <div className="relative rounded-lg overflow-hidden h-[280px] sm:h-[360px] lg:h-[450px] bg-[#F6F3F5] mb-6">
              <img
                src={event.image_url || "https://api.builder.io/api/v1/image/assets/TEMP/78e3156d16c6300089b55bfaf620fc8759e9c921?width=2264"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(19,27,46,0.85)] via-[rgba(19,27,46,0)] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="inline-flex items-center bg-brand-green px-3 py-1 rounded-sm mb-3">
                  <span className="text-white text-[10px] font-bold tracking-[1.5px] uppercase">{event.status}</span>
                </div>
                <h1 className="text-white text-3xl sm:text-4xl lg:text-[42px] font-black leading-tight tracking-[-1.2px]">
                  {event.title}
                </h1>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-lg border border-[#E4E2E4] shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] p-6">
                  <div className="pb-4 mb-5 border-b border-[#F0EDEF]">
                    <h2 className="text-[#1B1B1D] text-xl font-bold leading-7 tracking-[-0.5px]">Thông tin sự kiện</h2>
                  </div>
                  <div className="space-y-4 text-[#45464D] text-[15px] leading-[26px]">
                    <p>{event.description}</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[380px] flex-shrink-0">
                <div className="bg-white rounded-lg border border-[#E4E2E4] shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] p-6">
                  <p className="text-[#1B1B1D] text-sm font-semibold mb-5">Chi tiết sự kiện</p>

                  <div className="flex items-start gap-3.5 mb-5">
                    <div className="w-[42px] h-[42px] rounded-lg bg-brand-icon-bg flex items-center justify-center flex-shrink-0">
                      <CalendarIcon />
                    </div>
                    <div>
                      <p className="text-[#57657B] text-[10px] font-bold tracking-[1px] uppercase mb-0.5">Thời gian</p>
                      <p className="text-[#1B1B1D] text-sm font-semibold leading-5">
                        {event.start_time ? new Date(event.start_time).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric", weekday: "long" }) : ""}
                      </p>
                      <p className="text-[#45464D] text-xs leading-4">
                        {event.start_time ? new Date(event.start_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : ""}
                        {event.end_time ? ` 〜 ${new Date(event.end_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 mb-6 pb-5 border-b border-[#F0EDEF]">
                    <div className="w-[42px] h-[42px] rounded-lg bg-brand-icon-bg flex items-center justify-center flex-shrink-0">
                      <LocationIcon />
                    </div>
                    <div>
                      <p className="text-[#57657B] text-[10px] font-bold tracking-[1px] uppercase mb-0.5">Địa điểm</p>
                      <p className="text-[#1B1B1D] text-sm font-semibold leading-5">{event.location}</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[#1B1B1D] text-sm font-medium">Trạng thái tham gia</span>
                      <span className="text-brand-green text-sm font-semibold">{registered} / {total} người</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F0EDEF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-green rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[#45464D] text-xs">Đã đăng ký {registered} người</span>
                      <span className="text-[#45464D] text-xs">Còn trống {total - registered} chỗ</span>
                    </div>
                  </div>

                  {isOrganizer ? (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-[#1B1B1D] hover:bg-[#2D2D2F] transition-colors text-white text-sm font-bold py-3.5 px-6 rounded-lg"
                      >
                        Chỉnh sửa sự kiện
                      </button>
                      <Link
                        to={`/organizer/events/${id}/stats`}
                        className="w-full bg-white border border-[#E4E2E4] hover:bg-slate-50 transition-colors text-[#1B1B1D] text-sm font-bold py-3.5 px-6 rounded-lg text-center"
                      >
                        Xem thống kê chi tiết
                      </Link>
                    </div>
                  ) : event.is_full && !event.is_registered ? (
                    <button disabled className="w-full bg-gray-300 text-gray-500 text-sm font-bold py-3.5 px-6 rounded-lg cursor-not-allowed">
                      Hết chỗ
                    </button>
                  ) : event.is_registered ? (
                    <button
                      onClick={() => unregisterMutation.mutate()}
                      disabled={unregisterMutation.isPending}
                      className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white text-sm font-bold py-3.5 px-6 rounded-lg disabled:opacity-60"
                    >
                      {unregisterMutation.isPending ? "Đang xử lý..." : "Huỷ đăng ký"}
                    </button>
                  ) : (
                    <button
                      onClick={() => registerMutation.mutate()}
                      disabled={registerMutation.isPending}
                      className="w-full bg-[#1B1B1D] hover:bg-[#2D2D2F] transition-colors text-white text-sm font-bold py-3.5 px-6 rounded-lg disabled:opacity-60"
                    >
                      {registerMutation.isPending ? "Đang xử lý..." : "Đăng ký tham gia sự kiện này"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {isEditing && event && (
              <EditEventModal
                event={mapEventOutToEditEvent(event)}
                onClose={() => setIsEditing(false)}
                onSave={(updated) => {
                  updateMutation.mutate({
                    title: updated.name,
                    description: updated.description,
                    location: updated.location,
                    capacity: updated.maxAttendees,
                    start_time: updated.date,
                    // end_time: updated.date, // Need to handle end_time better
                  });
                }}
                onCancel={() => {
                  if (confirm("Bạn có chắc chắn muốn xoá sự kiện này?")) {
                    apiFetch(`/api/v1/events/${id}`, { method: "DELETE" }).then(() => {
                      window.location.href = "/events";
                    });
                  }
                }}
                onCloseRegistration={() => {
                  updateMutation.mutate({ status: "CLOSED" });
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

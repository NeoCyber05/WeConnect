import { useState } from "react";

type EventStatus = "ongoing" | "upcoming" | "ended";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  status: EventStatus;
}

const events: Event[] = [
  {
    id: 1,
    title: "Hội thảo Công nghệ Blockchain 2024",
    date: "24/05/2024 • 08:30 AM",
    location: "Trung tâm Hội nghị Quốc gia",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/05bf5311fe68605657e9581ab43ef0a429040b8b?width=421",
    status: "ongoing",
  },
  {
    id: 2,
    title: "Lễ hội Âm nhạc Mùa hè Vibes",
    date: "15/06/2024 • 16:00 PM",
    location: "Công viên Yên Sở, Hà Nội",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/fcb845c8d7664a3a0922120ea647039451d687ce?width=421",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Gala Dinner Doanh nhân Trẻ",
    date: "10/05/2024 • 19:00 PM",
    location: "Lotte Hotel, Liễu Giai",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/b4301f9e0a9169619d5e5c683f2c393555551322?width=421",
    status: "ended",
  },
  {
    id: 4,
    title: "Triển lãm Nghệ thuật Đương đại",
    date: "20/06/2024 • 09:00 AM",
    location: "Bảo tàng Mỹ thuật Việt Nam",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/09faca296faa6ba35e8eb46ab7a0df69dcc271a9?width=421",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Lễ hội Hoa Anh Đào Việt-Nhật",
    date: "28/03/2024 • 10:00 AM",
    location: "Công viên Thống Nhất, Hà Nội",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/1422688a57c40e3b331ca370b175e72171f0ba37?width=421",
    status: "ended",
  },
  {
    id: 6,
    title: "Workshop Ẩm thực Nhật Bản - Sushi Master",
    date: "12/07/2024 • 14:00 PM",
    location: "Trung tâm Văn hóa Nhật Bản",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/4aeb40ababed62a80f92e3e786ee6d4453b73429?width=421",
    status: "upcoming",
  },
  {
    id: 7,
    title: "Triển lãm Manga & Anime Việt Nam",
    date: "05/08/2024 • 09:00 AM",
    location: "SECC - Trung tâm Hội chợ Triển lãm",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/ef94699ec54bc378b122e2ae5ed31a42abd812ad?width=421",
    status: "upcoming",
  },
  {
    id: 8,
    title: "Hội nghị Kinh tế Việt-Nhật 2024",
    date: "18/09/2024 • 08:00 AM",
    location: "Khách sạn Metropole, Hà Nội",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/f0eea2078ce434d8b7fe98feb65b349b618708e8?width=421",
    status: "upcoming",
  },
];

const ITEMS_PER_PAGE = 8;
const TOTAL_PAGES = 2;

const statusConfig: Record<EventStatus, { label: string; className: string }> = {
  ongoing: {
    label: "Đang diễn ra",
    className: "bg-[#059669] text-white",
  },
  upcoming: {
    label: "Sắp tới",
    className: "bg-[#F1F5F9] text-[#475569]",
  },
  ended: {
    label: "Đã kết thúc",
    className: "bg-[#1E293B] text-white",
  },
};

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <g clipPath="url(#cal-clip)">
        <path d="M4.333 1.083V3.25" stroke="#94A3B8" strokeWidth="1.083" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.667 1.083V3.25" stroke="#94A3B8" strokeWidth="1.083" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.292 2.167H2.708C2.11 2.167 1.625 2.652 1.625 3.25V10.833C1.625 11.432 2.11 11.917 2.708 11.917H10.292C10.89 11.917 11.375 11.432 11.375 10.833V3.25C11.375 2.652 10.89 2.167 10.292 2.167Z" stroke="#94A3B8" strokeWidth="1.083" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.625 5.417H11.375" stroke="#94A3B8" strokeWidth="1.083" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="cal-clip">
          <rect width="13" height="13" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <g clipPath="url(#loc-clip)">
        <path d="M10.834 5.417C10.834 8.121 7.833 10.938 6.826 11.808C6.732 11.878 6.618 11.917 6.5 11.917C6.383 11.917 6.269 11.878 6.175 11.808C5.167 10.938 2.167 8.121 2.167 5.417C2.167 4.267 2.624 3.165 3.436 2.353C4.249 1.54 5.351 1.083 6.5 1.083C7.65 1.083 8.752 1.54 9.564 2.353C10.377 3.165 10.834 4.267 10.834 5.417Z" stroke="#94A3B8" strokeWidth="1.083" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 7.042C7.397 7.042 8.125 6.314 8.125 5.417C8.125 4.519 7.397 3.792 6.5 3.792C5.603 3.792 4.875 4.519 4.875 5.417C4.875 6.314 5.603 7.042 6.5 7.042Z" stroke="#94A3B8" strokeWidth="1.083" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="loc-clip">
          <rect width="13" height="13" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#edit-clip)">
        <path d="M10.587 3.406C10.851 3.142 11 2.783 11 2.409C11 2.036 10.852 1.677 10.587 1.413C10.323 1.148 9.964 1 9.591 1C9.217 1 8.858 1.148 8.594 1.413L1.921 8.087C1.805 8.203 1.719 8.345 1.671 8.502L1.01 10.678C0.998 10.721 0.997 10.767 1.008 10.811C1.019 10.855 1.041 10.895 1.073 10.927C1.105 10.958 1.145 10.981 1.189 10.992C1.233 11.003 1.279 11.002 1.322 10.989L3.498 10.329C3.655 10.281 3.798 10.196 3.913 10.081L10.587 3.406Z" stroke="#475569" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 2.5L9.5 4.5" stroke="#475569" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="edit-clip">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 10V5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10V2" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 10V7" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.333 12.667C10.279 12.667 12.667 10.279 12.667 7.333C12.667 4.388 10.279 2 7.333 2C4.388 2 2 4.388 2 7.333C2 10.279 4.388 12.667 7.333 12.667Z" stroke="#94A3B8" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 14L11.133 11.133" stroke="#94A3B8" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.333 8H12.667" stroke="white" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 3.333V12.667" stroke="white" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 12L6 8L10 4" stroke="#94A3B8" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12L10 8L6 4" stroke="#475569" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EventCard({ event }: { event: Event }) {
  const status = statusConfig[event.status];

  return (
    <div className="flex flex-col rounded-lg border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="relative w-full h-[155px] flex-shrink-0 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-3 right-3 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.5px] ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex flex-col p-4 gap-0 flex-1">
        <h3 className="text-sm font-bold text-black leading-5 mb-4 line-clamp-2 min-h-[40px]">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-1.5">
            <CalendarIcon />
            <span className="text-xs text-[#64748B] leading-[18px] truncate">{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LocationIcon />
            <span className="text-xs text-[#64748B] leading-[18px] truncate">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md border border-[#E2E8F0] text-[#475569] text-xs font-medium leading-[18px] hover:bg-[#F8F9FA] transition-colors">
            <EditIcon />
            Sửa
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#131B2E] text-white text-xs font-medium leading-[18px] hover:bg-[#1e2a42] transition-colors">
            <ReportIcon />
            Báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageEnd = pageStart + ITEMS_PER_PAGE;
  const pageEvents = filtered.slice(pageStart, pageEnd);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-[Inter,sans-serif]">
      <div className="max-w-[1180px] mx-auto px-6 pt-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[28px] font-bold text-black leading-9">
            Danh sách sự kiện
          </h1>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#131B2E] text-white text-sm font-medium leading-[21px] hover:bg-[#1e2a42] transition-colors">
            <PlusIcon />
            Tạo sự kiện mới
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-[43px] pl-10 pr-4 rounded-lg border border-[#E2E8F0] bg-white text-sm text-black placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#131B2E]/20 focus:border-[#131B2E]/30 transition-colors"
          />
        </div>

        {pageEvents.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-[#94A3B8] text-sm">
            Không tìm thấy sự kiện phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pageEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-9 h-9 rounded-md border border-[#E2E8F0] bg-white disabled:opacity-50 hover:bg-[#F8F9FA] transition-colors"
            >
              <ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-[#059669] text-white"
                    : "border border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8F9FA]"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-9 h-9 rounded-md border border-[#E2E8F0] bg-white disabled:opacity-50 hover:bg-[#F8F9FA] transition-colors"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

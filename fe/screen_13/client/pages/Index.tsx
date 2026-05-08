import { useState } from "react";

const games = [
  {
    id: "chess",
    name: "Cờ vua (Chess)",
    description: "Chiến thuật đỉnh cao • 1vs1",
    iconBg: "bg-blue-100",
    rooms: [
      { id: "#CH-2034", status: "Đang chờ", statusColor: "text-green-600", players: "1 / 2", canJoin: true },
      { id: "#CH-9812", status: "Đang đấu", statusColor: "text-orange-500", players: "2 / 2", canJoin: false },
    ],
    openCount: 4,
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
    icon: (
      <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
        <path d="M0 10V0H10V10H0ZM0 22.5V12.5H10V22.5H0ZM12.5 10V0H22.5V10H12.5ZM12.5 22.5V12.5H22.5V22.5H12.5ZM2.5 7.5H7.5V2.5H2.5V7.5ZM15 7.5H20V2.5H15V7.5ZM15 20H20V15H15V20ZM2.5 20H7.5V15H2.5V20Z" fill="#2563EB"/>
      </svg>
    ),
  },
  {
    id: "kanji",
    name: "Đoán từ vựng Kanji N3",
    description: "Học tập • Đồng đội • 2-4 người",
    iconBg: "bg-orange-100",
    rooms: [],
    openCount: 2,
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 25" fill="none">
        <path d="M13.875 23.75L8.5625 18.4375L10.3125 16.6875L13.875 20.25L20.9375 13.1875L22.6875 14.9375L13.875 23.75ZM0 16.25L6.0625 0H9L15.0625 16.25H12.1875L10.75 12.125H4.1875L2.75 16.25H0ZM5.0625 9.75H9.9375L7.5625 3H7.4375L5.0625 9.75Z" fill="#EA580C"/>
      </svg>
    ),
  },
  {
    id: "nihon",
    name: "Đố vui văn hóa Nhật Bản",
    description: "Kiến thức chung • 4-10 người",
    iconBg: "bg-purple-100",
    rooms: [],
    openCount: 0,
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-500",
    badgeLabel: "0 phòng chờ",
    icon: (
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
        <path d="M3.75 25V19.625C2.5625 18.5417 1.64062 17.276 0.984375 15.8281C0.328125 14.3802 0 12.8542 0 11.25C0 8.125 1.09375 5.46875 3.28125 3.28125C5.46875 1.09375 8.125 0 11.25 0C13.8542 0 16.1615 0.765625 18.1719 2.29688C20.1823 3.82812 21.4896 5.82292 22.0938 8.28125L23.7188 14.6875C23.8229 15.0833 23.75 15.4427 23.5 15.7656C23.25 16.0885 22.9167 16.25 22.5 16.25H20V20C20 20.6875 19.7552 21.276 19.2656 21.7656C18.776 22.2552 18.1875 22.5 17.5 22.5H15V25H12.5V20H17.5V13.75H20.875L19.6875 8.90625C19.2083 7.01042 18.1875 5.46875 16.625 4.28125C15.0625 3.09375 13.2708 2.5 11.25 2.5C8.83333 2.5 6.77083 3.34375 5.0625 5.03125C3.35417 6.71875 2.5 8.77083 2.5 11.1875C2.5 12.4375 2.75521 13.625 3.26562 14.75C3.77604 15.875 4.5 16.875 5.4375 17.75L6.25 18.5V25H3.75Z" fill="#9333EA"/>
      </svg>
    ),
  },
];

const categories = ["Tất cả", "Chiến thuật", "Học tập", "Giải đố"];

export default function Index() {
  const [expandedGame, setExpandedGame] = useState<string>("chess");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [gameSearch, setGameSearch] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const filteredGames = games.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(gameSearch.toLowerCase());
    if (activeCategory === "Tất cả") return matchSearch;
    if (activeCategory === "Chiến thuật") return matchSearch && g.id === "chess";
    if (activeCategory === "Học tập") return matchSearch && g.id === "kanji";
    if (activeCategory === "Giải đố") return matchSearch && g.id === "nihon";
    return matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif", background: "#F9FAF9" }}>
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8E2] shadow-sm sticky top-0 z-50">
        <div className="px-6">
          <div className="flex items-center h-16 gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <svg width="25" height="28" viewBox="0 0 30 28.75" fill="none">
                <path d="M7.5 28.75C6.45833 28.75 5.57292 28.3854 4.84375 27.6562C4.11458 26.9271 3.75 26.0417 3.75 25C3.75 23.9583 4.11458 23.0729 4.84375 22.3438C5.57292 21.6146 6.45833 21.25 7.5 21.25C7.79167 21.25 8.0625 21.2812 8.3125 21.3438C8.5625 21.4062 8.80208 21.4896 9.03125 21.5938L10.8125 19.375C10.2292 18.7292 9.82292 18 9.59375 17.1875C9.36458 16.375 9.3125 15.5625 9.4375 14.75L6.90625 13.9062C6.55208 14.4271 6.10417 14.8438 5.5625 15.1562C5.02083 15.4688 4.41667 15.625 3.75 15.625C2.70833 15.625 1.82292 15.2604 1.09375 14.5312C0.364583 13.8021 0 12.9167 0 11.875C0 10.8333 0.364583 9.94792 1.09375 9.21875C1.82292 8.48958 2.70833 8.125 3.75 8.125C4.79167 8.125 5.67708 8.48958 6.40625 9.21875C7.13542 9.94792 7.5 10.8333 7.5 11.875C7.5 11.9167 7.5 11.9583 7.5 12C7.5 12.0417 7.5 12.0833 7.5 12.125L10.0312 13C10.4479 12.25 11.0052 11.6146 11.7031 11.0938C12.401 10.5729 13.1875 10.2396 14.0625 10.0938V7.375C13.25 7.14583 12.5781 6.70312 12.0469 6.04688C11.5156 5.39062 11.25 4.625 11.25 3.75C11.25 2.70833 11.6146 1.82292 12.3438 1.09375C13.0729 0.364583 13.9583 0 15 0C16.0417 0 16.9271 0.364583 17.6562 1.09375C18.3854 1.82292 18.75 2.70833 18.75 3.75C18.75 4.625 18.4792 5.39062 17.9375 6.04688C17.3958 6.70312 16.7292 7.14583 15.9375 7.375V10.0938C16.8125 10.2396 17.599 10.5729 18.2969 11.0938C18.9948 11.6146 19.5521 12.25 19.9688 13L22.5 12.125C22.5 12.0833 22.5 12.0417 22.5 12C22.5 11.9583 22.5 11.9167 22.5 11.875C22.5 10.8333 22.8646 9.94792 23.5938 9.21875C24.3229 8.48958 25.2083 8.125 26.25 8.125C27.2917 8.125 28.1771 8.48958 28.9062 9.21875C29.6354 9.94792 30 10.8333 30 11.875C30 12.9167 29.6354 13.8021 28.9062 14.5312C28.1771 15.2604 27.2917 15.625 26.25 15.625C25.5833 15.625 24.974 15.4688 24.4219 15.1562C23.8698 14.8438 23.4271 14.4271 23.0938 13.9062L20.5625 14.75C20.6875 15.5625 20.6354 16.3698 20.4062 17.1719C20.1771 17.974 19.7708 18.7083 19.1875 19.375L20.9688 21.5625C21.1979 21.4583 21.4375 21.3802 21.6875 21.3281C21.9375 21.276 22.2083 21.25 22.5 21.25C23.5417 21.25 24.4271 21.6146 25.1562 22.3438C25.8854 23.0729 26.25 23.9583 26.25 25C26.25 26.0417 25.8854 26.9271 25.1562 27.6562C24.4271 28.3854 23.5417 28.75 22.5 28.75C21.4583 28.75 20.5729 28.3854 19.8438 27.6562C19.1146 26.9271 18.75 26.0417 18.75 25C18.75 24.5833 18.8177 24.1823 18.9531 23.7969C19.0885 23.4115 19.2708 23.0625 19.5 22.75L17.7188 20.5312C16.8646 21.0104 15.9531 21.25 14.9844 21.25C14.0156 21.25 13.1042 21.0104 12.25 20.5312L10.5 22.75C10.7292 23.0625 10.9115 23.4115 11.0469 23.7969C11.1823 24.1823 11.25 24.5833 11.25 25C11.25 26.0417 10.8854 26.9271 10.1562 27.6562C9.42708 28.3854 8.54167 28.75 7.5 28.75ZM15 18.75C15.875 18.75 16.6146 18.4479 17.2188 17.8438C17.8229 17.2396 18.125 16.5 18.125 15.625C18.125 14.75 17.8229 14.0104 17.2188 13.4062C16.6146 12.8021 15.875 12.5 15 12.5C14.125 12.5 13.3854 12.8021 12.7812 13.4062C12.1771 14.0104 11.875 14.75 11.875 15.625C11.875 16.5 12.1771 17.2396 12.7812 17.8438C13.3854 18.4479 14.125 18.75 15 18.75Z" fill="#4EDEA3"/>
              </svg>
              <span className="text-xl font-extrabold tracking-tight" style={{ color: "#2D3A3A" }}>WeConnect</span>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-stretch h-full">
              <NavItem
                icon={
                  <svg width="14" height="15" viewBox="0 0 14 15" fill="none">
                    <path d="M1.66667 13.3333H4.16667V8.33333H9.16667V13.3333H11.6667V5.83333L6.66667 2.08333L1.66667 5.83333V13.3333ZM0 15V5L6.66667 0L13.3333 5V15H7.5V10H5.83333V15H0Z" fill="currentColor"/>
                  </svg>
                }
                label="Trang chủ"
                active={false}
              />
              <NavItem
                icon={
                  <svg width="19" height="14" viewBox="0 0 19 14" fill="none">
                    <path d="M0 13.3333V11C0 10.5278 0.121528 10.0938 0.364583 9.69792C0.607639 9.30208 0.930556 9 1.33333 8.79167C2.19444 8.36111 3.06944 8.03819 3.95833 7.82292C4.84722 7.60764 5.75 7.5 6.66667 7.5C7.58333 7.5 8.48611 7.60764 9.375 7.82292C10.2639 8.03819 11.1389 8.36111 12 8.79167C12.4028 9 12.7257 9.30208 12.9688 9.69792C13.2118 10.0938 13.3333 10.5278 13.3333 11V13.3333H0ZM15 13.3333V10.8333C15 10.2222 14.8299 9.63542 14.4896 9.07292C14.1493 8.51042 13.6667 8.02778 13.0417 7.625C13.75 7.70833 14.4167 7.85069 15.0417 8.05208C15.6667 8.25347 16.25 8.5 16.7917 8.79167C17.2917 9.06944 17.6736 9.37847 17.9375 9.71875C18.2014 10.059 18.3333 10.4306 18.3333 10.8333V13.3333H15ZM6.66667 6.66667C5.75 6.66667 4.96528 6.34028 4.3125 5.6875C3.65972 5.03472 3.33333 4.25 3.33333 3.33333C3.33333 2.41667 3.65972 1.63194 4.3125 0.979167C4.96528 0.326389 5.75 0 6.66667 0C7.58333 0 8.36806 0.326389 9.02083 0.979167C9.67361 1.63194 10 2.41667 10 3.33333C10 4.25 9.67361 5.03472 9.02083 5.6875C8.36806 6.34028 7.58333 6.66667 6.66667 6.66667ZM6.66667 5C7.125 5 7.51736 4.83681 7.84375 4.51042C8.17014 4.18403 8.33333 3.79167 8.33333 3.33333C8.33333 2.875 8.17014 2.48264 7.84375 2.15625C7.51736 1.82986 7.125 1.66667 6.66667 1.66667C6.20833 1.66667 5.81597 1.82986 5.48958 2.15625C5.16319 2.48264 5 2.875 5 3.33333C5 3.79167 5.16319 4.18403 5.48958 4.51042C5.81597 4.83681 6.20833 5 6.66667 5Z" fill="currentColor"/>
                  </svg>
                }
                label="Bạn bè"
                active={false}
              />
              <NavItem
                icon={
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M0 16.6667V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H15C15.4583 0 15.8507 0.163194 16.1771 0.489583C16.5035 0.815972 16.6667 1.20833 16.6667 1.66667V11.6667C16.6667 12.125 16.5035 12.5174 16.1771 12.8438C15.8507 13.1701 15.4583 13.3333 15 13.3333H3.33333L0 16.6667ZM2.625 11.6667H15V1.66667H1.66667V12.6042L2.625 11.6667Z" fill="currentColor"/>
                  </svg>
                }
                label="Trò chuyện"
                active={false}
              />
              <NavItem
                icon={
                  <svg width="15" height="17" viewBox="0 0 15 17" fill="none">
                    <path d="M1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V3.33333C0 2.875 0.163194 2.48264 0.489583 2.15625C0.815972 1.82986 1.20833 1.66667 1.66667 1.66667H2.5V0H4.16667V1.66667H10.8333V0H12.5V1.66667H13.3333C13.7917 1.66667 14.184 1.82986 14.5104 2.15625C14.8368 2.48264 15 2.875 15 3.33333V15C15 15.4583 14.8368 15.8507 14.5104 16.1771C14.184 16.5035 13.7917 16.6667 13.3333 16.6667H1.66667ZM1.66667 15H13.3333V6.66667H1.66667V15ZM1.66667 5H13.3333V3.33333H1.66667V5Z" fill="currentColor"/>
                  </svg>
                }
                label="Sự kiện"
                active={false}
              />
              <NavItem
                icon={
                  <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                    <path d="M2.1125 11.6667C1.40417 11.6667 0.855556 11.4201 0.466667 10.9271C0.0777778 10.434 -0.0680556 9.83333 0.0291667 9.125L0.904167 2.875C1.02917 2.04167 1.40069 1.35417 2.01875 0.8125C2.63681 0.270833 3.3625 0 4.19583 0H12.4458C13.2792 0 14.0049 0.270833 14.6229 0.8125C15.241 1.35417 15.6125 2.04167 15.7375 2.875L16.6125 9.125C16.7097 9.83333 16.5639 10.434 16.175 10.9271C15.7861 11.4201 15.2375 11.6667 14.5292 11.6667C14.2375 11.6667 13.9667 11.6146 13.7167 11.5104C13.4667 11.4062 13.2375 11.25 13.0292 11.0417L11.1542 9.16667H5.4875L3.6125 11.0417C3.40417 11.25 3.175 11.4062 2.925 11.5104C2.675 11.6146 2.40417 11.6667 2.1125 11.6667ZM4.77917 6.66667H6.02917V5.20833H7.4875V3.95833H6.02917V2.5H4.77917V3.95833H3.32083V5.20833H4.77917V6.66667Z" fill="currentColor"/>
                  </svg>
                }
                label="Trò chơi"
                active={true}
              />
            </nav>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4 hidden sm:flex">
              <div className="relative w-full">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M12.45 13.5L7.725 8.775C7.35 9.075 6.91875 9.3125 6.43125 9.4875C5.94375 9.6625 5.425 9.75 4.875 9.75C3.5125 9.75 2.35938 9.27813 1.41562 8.33438C0.471875 7.39063 0 6.2375 0 4.875C0 3.5125 0.471875 2.35938 1.41562 1.41562C2.35938 0.471875 3.5125 0 4.875 0C6.2375 0 7.39063 0.471875 8.33438 1.41562C9.27813 2.35938 9.75 3.5125 9.75 4.875C9.75 5.425 9.6625 5.94375 9.4875 6.43125C9.3125 6.91875 9.075 7.35 8.775 7.725L13.5 12.45L12.45 13.5ZM4.875 8.25C5.8125 8.25 6.60938 7.92188 7.26562 7.26562C7.92188 6.60938 8.25 5.8125 8.25 4.875C8.25 3.9375 7.92188 3.14062 7.26562 2.48438C6.60938 1.82812 5.8125 1.5 4.875 1.5C3.9375 1.5 3.14062 1.82812 2.48438 2.48438C1.82812 3.14062 1.5 3.9375 1.5 4.875C1.5 5.8125 1.82812 6.60938 2.48438 7.26562C3.14062 7.92188 3.9375 8.25 4.875 8.25Z" fill="#6B7280"/>
                </svg>
                <input
                  type="text"
                  placeholder="Tìm bạn bè, bài viết..."
                  className="w-full pl-10 pr-4 py-2 rounded-full text-sm text-gray-500 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/30"
                  style={{ background: "rgba(241,245,249,0.8)" }}
                />
              </div>
            </div>

            {/* Avatar */}
            <div className="flex items-center pl-2 border-l border-[#E2E8E2] ml-auto shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden" style={{ boxShadow: "0 0 0 2px rgba(74,103,65,0.1)", background: "#E2E8F0" }}>
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/970853f39e1b18632ca69640ab7ac67726e7dc95?width=72"
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-6 px-4 sm:px-6">
        <div className="max-w-[1232px] mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">

            {/* Left Sidebar */}
            <aside className="lg:col-span-3">
              <div className="rounded-2xl border border-[#E2E8E2] bg-white shadow-sm p-5 flex flex-col gap-6">
                {/* Actions */}
                <div className="flex flex-col gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.7px] text-gray-500">Hành động</p>
                  <div className="flex flex-col gap-3">
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-white text-sm font-medium shadow-sm transition-opacity hover:opacity-90 active:opacity-80" style={{ background: "#4A6741" }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="white"/>
                      </svg>
                      Tạo phòng
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-white text-sm font-medium shadow-sm transition-opacity hover:opacity-90 active:opacity-80" style={{ background: "#4A6741" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 16V14H12.6L9.425 10.825L10.85 9.4L14 12.55V10H16V16H10ZM1.4 16L0 14.6L12.6 2H10V0H16V6H14V3.4L1.4 16ZM5.175 6.575L0 1.4L1.4 0L6.575 5.175L5.175 6.575Z" fill="white"/>
                      </svg>
                      Ngẫu nhiên
                    </button>
                  </div>
                </div>

                {/* Room Code */}
                <div className="flex flex-col gap-2 pt-4 border-t border-[#E2E8E2]">
                  <p className="text-xs font-bold uppercase tracking-[0.7px] text-gray-500">Nhập mã phòng</p>
                  <div className="relative mt-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="22" height="12" viewBox="0 0 22 12" fill="none">
                      <path d="M6 12C4.33333 12 2.91667 11.4167 1.75 10.25C0.583333 9.08333 0 7.66667 0 6C0 4.33333 0.583333 2.91667 1.75 1.75C2.91667 0.583333 4.33333 0 6 0C7.1 0 8.10833 0.275 9.025 0.825C9.94167 1.375 10.6667 2.1 11.2 3H22V9H20V12H14V9H11.2C10.6667 9.9 9.94167 10.625 9.025 11.175C8.10833 11.725 7.1 12 6 12ZM6 10C7.1 10 7.98333 9.6625 8.65 8.9875C9.31667 8.3125 9.71667 7.65 9.85 7H16V10H18V7H20V5H9.85C9.71667 4.35 9.31667 3.6875 8.65 3.0125C7.98333 2.3375 7.1 2 6 2C4.9 2 3.95833 2.39167 3.175 3.175C2.39167 3.95833 2 4.9 2 6C2 7.1 2.39167 8.04167 3.175 8.825C3.95833 9.60833 4.9 10 6 10ZM6 8C6.55 8 7.02083 7.80417 7.4125 7.4125C7.80417 7.02083 8 6.55 8 6C8 5.45 7.80417 4.97917 7.4125 4.5875C7.02083 4.19583 6.55 4 6 4C5.45 4 4.97917 4.19583 4.5875 4.5875C4.19583 4.97917 4 5.45 4 6C4 6.55 4.19583 7.02083 4.5875 7.4125C4.97917 7.80417 5.45 8 6 8Z" fill="#94A3B8"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="VD: 123456"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E2E8E2] bg-[#F8FAFC] text-sm text-gray-500 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Content */}
            <div className="lg:col-span-9 flex flex-col gap-6 lg:gap-8">

              {/* Quote Banner */}
              <div
                className="rounded-2xl border px-8 py-8 text-center"
                style={{ background: "rgba(241,245,240,0.5)", borderColor: "rgba(74,103,65,0.1)" }}
              >
                <p className="text-lg italic font-medium leading-relaxed" style={{ color: "#2D3A3A" }}>
                  "Cuộc đời là một trò chơi lớn, và mỗi người là một kỳ thủ tài ba. Hãy cùng nhau kết nối, học hỏi và chinh phục những đỉnh cao mới!"
                </p>
              </div>

              {/* Game List Section */}
              <div className="flex flex-col gap-6">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-6 rounded-full" style={{ background: "#4A6741" }} />
                    <h2 className="text-xl font-bold" style={{ color: "#2D3A3A" }}>Danh sách trò chơi</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M12.45 13.5L7.725 8.775C7.35 9.075 6.91875 9.3125 6.43125 9.4875C5.94375 9.6625 5.425 9.75 4.875 9.75C3.5125 9.75 2.35938 9.27813 1.41562 8.33438C0.471875 7.39063 0 6.2375 0 4.875C0 3.5125 0.471875 2.35938 1.41562 1.41562C2.35938 0.471875 3.5125 0 4.875 0C6.2375 0 7.39063 0.471875 8.33438 1.41562C9.27813 2.35938 9.75 3.5125 9.75 4.875C9.75 5.425 9.6625 5.94375 9.4875 6.43125C9.3125 6.91875 9.075 7.35 8.775 7.725L13.5 12.45L12.45 13.5ZM4.875 8.25C5.8125 8.25 6.60938 7.92188 7.26562 7.26562C7.92188 6.60938 8.25 5.8125 8.25 4.875C8.25 3.9375 7.92188 3.14062 7.26562 2.48438C6.60938 1.82812 5.8125 1.5 4.875 1.5C3.9375 1.5 3.14062 1.82812 2.48438 2.48438C1.82812 3.14062 1.5 3.9375 1.5 4.875C1.5 5.8125 1.82812 6.60938 2.48438 7.26562C3.14062 7.92188 3.9375 8.25 4.875 8.25Z" fill="#6B7280"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Tìm trò chơi..."
                        value={gameSearch}
                        onChange={(e) => setGameSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-full text-sm text-gray-500 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-[200px]"
                        style={{ background: "rgba(241,245,249,0.8)" }}
                      />
                    </div>

                    {/* Category Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                            activeCategory === cat
                              ? "text-white shadow-md"
                              : "border border-[#E2E8E2] bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                          style={activeCategory === cat ? { background: "#4A6741" } : {}}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Game Cards */}
                <div className="flex flex-col gap-4">
                  {filteredGames.map((game) => {
                    const isExpanded = expandedGame === game.id;
                    const hasRooms = game.rooms.length > 0;
                    return (
                      <div
                        key={game.id}
                        className="rounded-2xl border border-[#E2E8E2] bg-white shadow-sm overflow-hidden"
                      >
                        {/* Game Header Row */}
                        <button
                          className="w-full flex items-center justify-between px-5 py-5 text-left transition-colors hover:bg-gray-50/50"
                          onClick={() => setExpandedGame(isExpanded ? "" : game.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${game.iconBg}`}>
                              {game.icon}
                            </div>
                            <div>
                              <p className="text-base font-bold" style={{ color: "#2D3A3A" }}>{game.name}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5">{game.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${game.badgeBg} ${game.badgeText}`}
                            >
                              {game.badgeLabel || `${game.openCount} phòng mở`}
                            </span>
                            <svg
                              width="12"
                              height="8"
                              viewBox="0 0 12 8"
                              fill="none"
                              className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""} ${!hasRooms && game.openCount === 0 ? "opacity-50" : ""}`}
                            >
                              <path d="M6 7.4L0 1.4L1.4 0L6 4.6L10.6 0L12 1.4L6 7.4Z" fill="#6B7280"/>
                            </svg>
                          </div>
                        </button>

                        {/* Expanded Rooms */}
                        {isExpanded && game.rooms.length > 0 && (
                          <div className="border-t border-[#E2E8E2] bg-slate-50/50 px-4 py-4 flex flex-col gap-3">
                            {game.rooms.map((room) => (
                              <div
                                key={room.id}
                                className="flex items-center justify-between p-4 rounded-2xl border border-[#E2E8E2] bg-white"
                              >
                                <div className="flex items-center gap-6 flex-wrap">
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[-0.5px] text-gray-500">ID</p>
                                    <p className="text-sm font-bold mt-0.5" style={{ color: "#2D3A3A" }}>{room.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[-0.5px] text-gray-500">Trạng thái</p>
                                    <p className={`text-[11px] font-bold mt-0.5 ${room.statusColor}`}>{room.status}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[-0.5px] text-gray-500">Người chơi</p>
                                    <p className="text-sm font-medium mt-0.5" style={{ color: "#2D3A3A" }}>{room.players}</p>
                                  </div>
                                </div>
                                {room.canJoin && (
                                  <button
                                    className="px-6 py-2 rounded-lg text-white text-xs font-bold shadow-sm transition-opacity hover:opacity-90 shrink-0"
                                    style={{ background: "#4A6741" }}
                                  >
                                    Tham gia
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer self-stretch ${active ? "border-b-2" : "hover:bg-gray-50"}`}
      style={active ? { borderBottomColor: "#4A6741", color: "#4A6741" } : { color: "#6B7280" }}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-sm font-semibold whitespace-nowrap">{label}</span>
    </div>
  );
}

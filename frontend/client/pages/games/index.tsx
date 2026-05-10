import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";

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

const categories = ["all", "strategy", "learning", "puzzle"];

export default function Index() {
  const { t } = useTranslation();
  const [expandedGame, setExpandedGame] = useState<string>("chess");
  const [activeCategory, setActiveCategory] = useState("all");
  const [gameSearch, setGameSearch] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const filteredGames = games.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(gameSearch.toLowerCase());
    if (activeCategory === "all") return matchSearch;
    if (activeCategory === "strategy") return matchSearch && g.id === "chess";
    if (activeCategory === "learning") return matchSearch && g.id === "kanji";
    if (activeCategory === "puzzle") return matchSearch && g.id === "nihon";
    return matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif", background: "#F9FAF9" }}>
      <Navbar />

      {/* Main */}
      <main className="flex-1 py-6 px-4 sm:px-6">
        <div className="max-w-[1232px] mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">

            {/* Left Sidebar */}
            <aside className="lg:col-span-3">
              <div className="rounded-2xl border border-[#E2E8E2] bg-white shadow-sm p-5 flex flex-col gap-6">
                {/* Actions */}
                <div className="flex flex-col gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.7px] text-gray-500">{t("games.actions")}</p>
                  <div className="flex flex-col gap-3">
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-white text-sm font-medium shadow-sm transition-opacity hover:opacity-90 active:opacity-80" style={{ background: "#4A6741" }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="white"/>
                      </svg>
                      {t("games.createRoom")}
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-white text-sm font-medium shadow-sm transition-opacity hover:opacity-90 active:opacity-80" style={{ background: "#4A6741" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 16V14H12.6L9.425 10.825L10.85 9.4L14 12.55V10H16V16H10ZM1.4 16L0 14.6L12.6 2H10V0H16V6H14V3.4L1.4 16ZM5.175 6.575L0 1.4L1.4 0L6.575 5.175L5.175 6.575Z" fill="white"/>
                      </svg>
                      {t("games.random")}
                    </button>
                  </div>
                </div>

                {/* Room Code */}
                <div className="flex flex-col gap-2 pt-4 border-t border-[#E2E8E2]">
                  <p className="text-xs font-bold uppercase tracking-[0.7px] text-gray-500">{t("games.enterRoomCode")}</p>
                  <div className="relative mt-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="22" height="12" viewBox="0 0 22 12" fill="none">
                      <path d="M6 12C4.33333 12 2.91667 11.4167 1.75 10.25C0.583333 9.08333 0 7.66667 0 6C0 4.33333 0.583333 2.91667 1.75 1.75C2.91667 0.583333 4.33333 0 6 0C7.1 0 8.10833 0.275 9.025 0.825C9.94167 1.375 10.6667 2.1 11.2 3H22V9H20V12H14V9H11.2C10.6667 9.9 9.94167 10.625 9.025 11.175C8.10833 11.725 7.1 12 6 12ZM6 10C7.1 10 7.98333 9.6625 8.65 8.9875C9.31667 8.3125 9.71667 7.65 9.85 7H16V10H18V7H20V5H9.85C9.71667 4.35 9.31667 3.6875 8.65 3.0125C7.98333 2.3375 7.1 2 6 2C4.9 2 3.95833 2.39167 3.175 3.175C2.39167 3.95833 2 4.9 2 6C2 7.1 2.39167 8.04167 3.175 8.825C3.95833 9.60833 4.9 10 6 10ZM6 8C6.55 8 7.02083 7.80417 7.4125 7.4125C7.80417 7.02083 8 6.55 8 6C8 5.45 7.80417 4.97917 7.4125 4.5875C7.02083 4.19583 6.55 4 6 4C5.45 4 4.97917 4.19583 4.5875 4.5875C4.19583 4.97917 4 5.45 4 6C4 6.55 4.19583 7.02083 4.5875 7.4125C4.97917 7.80417 5.45 8 6 8Z" fill="#94A3B8"/>
                    </svg>
                    <input
                      type="text"
                      placeholder={t("games.roomCodePlaceholder")}
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
                  {t("games.gameQuote")}
                </p>
              </div>

              {/* Game List Section */}
              <div className="flex flex-col gap-6">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-6 rounded-full" style={{ background: "#4A6741" }} />
                    <h2 className="text-xl font-bold" style={{ color: "#2D3A3A" }}>{t("games.gameList")}</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M12.45 13.5L7.725 8.775C7.35 9.075 6.91875 9.3125 6.43125 9.4875C5.94375 9.6625 5.425 9.75 4.875 9.75C3.5125 9.75 2.35938 9.27813 1.41562 8.33438C0.471875 7.39063 0 6.2375 0 4.875C0 3.5125 0.471875 2.35938 1.41562 1.41562C2.35938 0.471875 3.5125 0 4.875 0C6.2375 0 7.39063 0.471875 8.33438 1.41562C9.27813 2.35938 9.75 3.5125 9.75 4.875C9.75 5.425 9.6625 5.94375 9.4875 6.43125C9.3125 6.91875 9.075 7.35 8.775 7.725L13.5 12.45L12.45 13.5ZM4.875 8.25C5.8125 8.25 6.60938 7.92188 7.26562 7.26562C7.92188 6.60938 8.25 5.8125 8.25 4.875C8.25 3.9375 7.92188 3.14062 7.26562 2.48438C6.60938 1.82812 5.8125 1.5 4.875 1.5C3.9375 1.5 3.14062 1.82812 2.48438 2.48438C1.82812 3.14062 1.5 3.9375 1.5 4.875C1.5 5.8125 1.82812 6.60938 2.48438 7.26562C3.14062 7.92188 3.9375 8.25 4.875 8.25Z" fill="#6B7280"/>
                      </svg>
                      <input
                        type="text"
                        placeholder={t("games.searchPlaceholder")}
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
                          {t(`games.${cat}`)}
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
                              {game.badgeLabel === "0 phòng chờ" ? t("games.noWaitingRooms") : (game.badgeLabel || t("games.roomsOpen", { count: game.openCount }))}
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
                                    <p className="text-[10px] font-bold uppercase tracking-[-0.5px] text-gray-500">{t("games.id")}</p>
                                    <p className="text-sm font-bold mt-0.5" style={{ color: "#2D3A3A" }}>{room.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[-0.5px] text-gray-500">{t("games.status")}</p>
                                    <p className={`text-[11px] font-bold mt-0.5 ${room.statusColor}`}>{room.status === "Đang chờ" ? t("games.waiting") : (room.status === "Đang đấu" ? t("games.playing") : room.status)}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[-0.5px] text-gray-500">{t("games.players")}</p>
                                    <p className="text-sm font-medium mt-0.5" style={{ color: "#2D3A3A" }}>{room.players}</p>
                                  </div>
                                </div>
                                {room.canJoin && (
                                  <button
                                    className="px-6 py-2 rounded-lg text-white text-xs font-bold shadow-sm transition-opacity hover:opacity-90 shrink-0"
                                    style={{ background: "#4A6741" }}
                                  >
                                    {t("games.join")}
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

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  searchUsers,
  sendFriendRequest,
  UserSearchOut,
} from "@/lib/friendsApi";

const API_URL = (import.meta.env.VITE_API_URL as string) || "";

const JLPT_BADGE_STYLE: Record<string, { bg: string; text: string }> = {
  N1: { bg: "bg-blue-50", text: "text-blue-600" },
  N2: { bg: "bg-[#F1F5F0]", text: "text-[#4A6741]" },
  N3: { bg: "bg-orange-50", text: "text-orange-600" },
  N4: { bg: "bg-slate-100", text: "text-slate-600" },
  N5: { bg: "bg-gray-50", text: "text-gray-600" },
  "Bản ngữ": { bg: "bg-purple-50", text: "text-purple-600" },
};

const AGE_OPTIONS = ["Tất cả", "Thế hệ 10x", "Thế hệ 20x", "Thế hệ 30x", "40 tuổi trở lên"];
const GENDER_OPTIONS = ["Tất cả", "Nam", "Nữ", "Khác"];
const LEVEL_OPTIONS = ["Tất cả", "N1", "N2", "N3", "N4", "N5", "Bản ngữ"];
const HOBBY_OPTIONS = ["Tất cả", "Âm nhạc", "Đọc sách", "Nghệ thuật", "Nấu ăn", "Chơi game", "Du lịch", "Thể thao"];

function FilterIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.66667 10.5V7H5.83333V8.16667H10.5V9.33333H5.83333V10.5H4.66667ZM0 9.33333V8.16667H3.5V9.33333H0ZM2.33333 7V5.83333H0V4.66667H2.33333V3.5H3.5V7H2.33333ZM4.66667 5.83333V4.66667H10.5V5.83333H4.66667ZM7 3.5V0H8.16667V1.16667H10.5V2.33333H8.16667V3.5H7ZM0 2.33333V1.16667H5.83333V2.33333H0Z"
        fill="#6B7280"
      />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4.93333L0 0.933333L0.933333 0L4 3.06667L7.06667 0L8 0.933333L4 4.93333Z" fill="#6B7280" />
    </svg>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <div className="px-1">
        <span className="text-[#6B7280] text-[9px] font-bold uppercase tracking-wide leading-[13.5px]">
          {label}
        </span>
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[32px] rounded-lg border border-[#E2E8E2] bg-white text-[#2D3A3A] text-[11px] font-semibold pl-2 pr-6 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741] transition-colors"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <ChevronDown />
        </span>
      </div>
    </div>
  );
}

function UserAvatar({ src, size = 40 }: { src?: string; size?: number }) {
  if (src) {
    const fullUrl = src.startsWith("http") ? src : `${API_URL}${src}`;
    return (
      <img
        src={fullUrl}
        alt=""
        className="rounded-full object-cover shrink-0 border border-[#E2E8E2]"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-[#E2E8F0] border border-[#E2E8E2] flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0Z"
          fill="#6B7280"
        />
      </svg>
    </div>
  );
}

function FriendStatusButton({
  user,
  onSend,
  isLoading,
}: {
  user: UserSearchOut;
  onSend: (id: number) => void;
  isLoading?: boolean;
}) {
  const { friendship_status, user_id } = user;

  if (friendship_status === "FRIEND") {
    return <span className="text-[#4A6741] text-[10px] font-bold">Bạn bè</span>;
  }
  if (friendship_status === "REQUEST_SENT") {
    return <span className="text-[#6B7280] text-[10px] font-bold">Đã gửi lời mời</span>;
  }
  if (friendship_status === "REQUEST_RECEIVED") {
    return (
      <Link to="/friends" className="text-[#EA580C] text-[10px] font-bold hover:underline">
        Phản hồi
      </Link>
    );
  }
  return (
    <button
      onClick={() => onSend(user_id)}
      disabled={isLoading}
      className="text-[#4A6741] text-[10px] font-bold hover:underline disabled:opacity-50"
    >
      {isLoading ? "..." : "Thêm bạn"}
    </button>
  );
}

interface SearchPopupProps {
  searchQuery: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchPopup({ searchQuery, isOpen, onClose }: SearchPopupProps) {
  const [ageFilter, setAgeFilter] = useState("Tất cả");
  const [genderFilter, setGenderFilter] = useState("Tất cả");
  const [levelFilter, setLevelFilter] = useState("Tất cả");
  const [hobbyFilter, setHobbyFilter] = useState("Tất cả");
  const [sendingId, setSendingId] = useState<number | undefined>();

  const queryClient = useQueryClient();

  // Map ageFilter to min/max age
  let min_age: number | undefined;
  let max_age: number | undefined;
  if (ageFilter === "Thế hệ 10x") { min_age = 10; max_age = 19; }
  else if (ageFilter === "Thế hệ 20x") { min_age = 20; max_age = 29; }
  else if (ageFilter === "Thế hệ 30x") { min_age = 30; max_age = 39; }
  else if (ageFilter === "40 tuổi trở lên") { min_age = 40; max_age = 99; }

  const { data, isLoading } = useQuery({
    queryKey: ["searchPopup", searchQuery, genderFilter, levelFilter, hobbyFilter, min_age, max_age],
    queryFn: () =>
      searchUsers({
        q: searchQuery || undefined,
        gender: genderFilter !== "Tất cả" ? genderFilter : undefined,
        japanese_level: levelFilter !== "Tất cả" ? levelFilter : undefined,
        hobbies: hobbyFilter !== "Tất cả" ? hobbyFilter : undefined,
        min_age,
        max_age,
        page_size: 10,
      }),
    enabled: isOpen && (!!searchQuery || genderFilter !== "Tất cả" || levelFilter !== "Tất cả" || ageFilter !== "Tất cả" || hobbyFilter !== "Tất cả"),
  });

  const sendMutation = useMutation({
    mutationFn: (receiver_id: number) => {
      setSendingId(receiver_id);
      return sendFriendRequest(receiver_id);
    },
    onSuccess: () => {
      toast.success("Đã gửi lời mời kết bạn!");
      queryClient.invalidateQueries({ queryKey: ["searchPopup"] });
      queryClient.invalidateQueries({ queryKey: ["userSearch"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Không thể gửi lời mời kết bạn");
    },
    onSettled: () => setSendingId(undefined),
  });

  if (!isOpen) return null;

  const users = data?.data ?? [];

  return (
    <div 
      className="absolute top-full left-0 mt-2 w-[500px] bg-white rounded-2xl border border-[#E2E8E2] shadow-2xl overflow-hidden z-[100]"
      onMouseDown={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      {/* Header / Filters */}
      <div className="px-4 pt-4 pb-3 flex flex-col gap-3 border-b border-[#E2E8E2] bg-[#F8FAF8]">
        <div className="flex items-center gap-1.5">
          <FilterIcon />
          <span className="text-[#6B7280] text-[10px] font-bold uppercase tracking-wider">
            Bộ lọc tìm kiếm
          </span>
        </div>
        <div className="flex gap-2">
          <FilterSelect
            label="Độ tuổi"
            value={ageFilter}
            options={AGE_OPTIONS}
            onChange={setAgeFilter}
          />
          <FilterSelect
            label="Giới tính"
            value={genderFilter}
            options={GENDER_OPTIONS}
            onChange={setGenderFilter}
          />
          <FilterSelect
            label="Sở thích"
            value={hobbyFilter}
            options={HOBBY_OPTIONS}
            onChange={setHobbyFilter}
          />
          <FilterSelect
            label="Tiếng Nhật"
            value={levelFilter}
            options={LEVEL_OPTIONS}
            onChange={setLevelFilter}
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col">
        <div className="px-4 py-2 border-b border-[rgba(226,232,226,0.3)] bg-white flex justify-between items-center">
          <span className="text-[#6B7280] text-[10px] font-bold uppercase tracking-widest">
            Kết quả ({users.length})
          </span>
          {isLoading && <span className="text-[9px] text-wc-green animate-pulse">Đang tìm...</span>}
        </div>

        <div className="max-h-[350px] overflow-y-auto">
          {!searchQuery && ageFilter === "Tất cả" && genderFilter === "Tất cả" && levelFilter === "Tất cả" && hobbyFilter === "Tất cả" ? (
            <div className="px-4 py-8 text-center text-[#6B7280] text-[11px]">
              Nhập từ khóa hoặc chọn bộ lọc để tìm kiếm...
            </div>
          ) : users.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#6B7280] text-[11px]">
              {isLoading ? "Đang tải kết quả..." : "Không tìm thấy người dùng phù hợp."}
            </div>
          ) : (
            users.map((user, idx) => (
              <div
                key={user.user_id}
                className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#F9FAF9] transition-colors ${
                  idx !== 0 ? "border-t border-[rgba(226,232,226,0.2)]" : ""
                }`}
              >
                <UserAvatar src={user.avatar_url} size={40} />
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/profile/${user.user_id}`}
                      className="text-[#2D3A3A] text-sm font-bold truncate hover:underline"
                      onClick={onClose}
                    >
                      {user.full_name}
                    </Link>
                    {user.japanese_level && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${JLPT_BADGE_STYLE[user.japanese_level]?.bg || "bg-gray-50"} ${JLPT_BADGE_STYLE[user.japanese_level]?.text || "text-gray-600"}`}>
                        {user.japanese_level}
                      </span>
                    )}
                  </div>
                  <span className="text-[#6B7280] text-[11px] truncate">
                    {user.location || "Chưa cập nhật địa điểm"}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Link 
                    to={`/profile/${user.user_id}`}
                    className="text-[#4A6741] text-[11px] font-bold hover:underline"
                    onClick={onClose}
                  >
                    Xem hồ sơ
                  </Link>
                  <FriendStatusButton
                    user={user}
                    onSend={(id) => sendMutation.mutate(id)}
                    isLoading={sendingId === user.user_id}
                  />
                </div>
              </div>
            ))
          )}
          {users.length >= 10 && (
            <Link
              to={`/search?q=${encodeURIComponent(searchQuery)}`}
              className="block px-4 py-3 text-center border-t border-[rgba(226,232,226,0.3)] bg-[#F8FAF8] hover:bg-[#F1F5F1] transition-colors"
              onClick={onClose}
            >
              <span className="text-wc-green text-[11px] font-bold">
                Xem tất cả kết quả...
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

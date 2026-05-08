import { useState } from "react";

const JLPT_BADGE: Record<string, { bg: string; text: string }> = {
  N1: { bg: "bg-blue-50", text: "text-blue-600" },
  N2: { bg: "bg-[#F1F5F0]", text: "text-[#4A6741]" },
  N2g: { bg: "bg-green-50", text: "text-green-600" },
  N3: { bg: "bg-orange-50", text: "text-orange-600" },
  N4: { bg: "bg-slate-100", text: "text-slate-600" },
  母国語: { bg: "bg-purple-50", text: "text-purple-600" },
};

interface Person {
  id: number;
  name: string;
  badge: string;
  badgeKey: string;
  info: string;
  avatarUrl?: string;
  age: number;
  gender: string;
  hobby: string;
  level: string;
}

const PEOPLE: Person[] = [
  {
    id: 1,
    name: "ミン・アイン（ハナ）",
    badge: "N2",
    badgeKey: "N2",
    info: "友達 • 22 歳 • 外向的",
    avatarUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/26982b5d03d04105c9c8d651554b7c0e4f06b327?width=80",
    age: 22,
    gender: "女性",
    hobby: "音楽",
    level: "N2",
  },
  {
    id: 2,
    name: "グエン・ニャット・ミン",
    badge: "N1",
    badgeKey: "N1",
    info: "同僚 ・ 28 歳 ・ 穏やか",
    age: 28,
    gender: "男性",
    hobby: "読書",
    level: "N1",
  },
  {
    id: 3,
    name: "ミン・トリエット",
    badge: "N3",
    badgeKey: "N3",
    info: "最近 • 20 歳 • クリエイティブ",
    age: 20,
    gender: "男性",
    hobby: "アート",
    level: "N3",
  },
  {
    id: 4,
    name: "ホアン・ミン・タム",
    badge: "母国語",
    badgeKey: "母国語",
    info: "顧客 • 32 歳 • 専門家",
    avatarUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/d47b11540b990b3a08f0348a2706340a9ec5a6be?width=80",
    age: 32,
    gender: "女性",
    hobby: "料理",
    level: "母国語",
  },
  {
    id: 5,
    name: "ブー・ドゥク・ミン",
    badge: "N4",
    badgeKey: "N4",
    info: "新人 • 19 歳 • 熱意あり",
    age: 19,
    gender: "男性",
    hobby: "ゲーム",
    level: "N4",
  },
  {
    id: 6,
    name: "ミン・ハン",
    badge: "N2",
    badgeKey: "N2g",
    info: "友達 • 25 歳 • 楽しい",
    age: 25,
    gender: "女性",
    hobby: "旅行",
    level: "N2",
  },
  {
    id: 7,
    name: "タン・ヴァン・アン",
    badge: "N3",
    badgeKey: "N3",
    info: "知人 • 24 歳 • 親切",
    age: 24,
    gender: "男性",
    hobby: "スポーツ",
    level: "N3",
  },
  {
    id: 8,
    name: "レ・ティ・フオン",
    badge: "N1",
    badgeKey: "N1",
    info: "同僚 • 30 歳 • 真剣",
    age: 30,
    gender: "女性",
    hobby: "読書",
    level: "N1",
  },
];

const AGE_OPTIONS = ["すべて", "10代", "20代", "30代", "40代以上"];
const GENDER_OPTIONS = ["すべて", "男性", "女性"];
const HOBBY_OPTIONS = ["すべて", "音楽", "読書", "アート", "料理", "ゲーム", "旅行", "スポーツ"];
const LEVEL_OPTIONS = ["すべて", "N1", "N2", "N3", "N4", "N5", "母国語"];

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z"
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

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function FilterSelect({ label, value, options, onChange }: SelectProps) {
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
          className="w-full h-[38px] rounded-lg border border-[#E2E8E2] bg-white text-[#2D3A3A] text-[11px] font-semibold pl-3 pr-7 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741] transition-colors"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
          <ChevronDown />
        </span>
      </div>
    </div>
  );
}

function Avatar({ url, name }: { url?: string; name: string }) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="w-10 h-10 rounded-full border border-[#E2E8E2] object-cover flex-shrink-0"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full border border-[#E2E8E2] bg-[#E2E8F0] flex items-center justify-center flex-shrink-0">
      <UserIcon />
    </div>
  );
}

function Badge({ label, badgeKey }: { label: string; badgeKey: string }) {
  const style = JLPT_BADGE[badgeKey] ?? JLPT_BADGE["N2"];
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight leading-[13.5px] ${style.bg} ${style.text}`}
    >
      {label}
    </span>
  );
}

function PersonRow({ person, isFirst }: { person: Person; isFirst: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 ${
        !isFirst ? "border-t border-[rgba(226,232,226,0.3)]" : ""
      }`}
    >
      <Avatar url={person.avatarUrl} name={person.name} />
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#2D3A3A] text-sm font-bold leading-5 truncate">
            {person.name}
          </span>
          <Badge label={person.badge} badgeKey={person.badgeKey} />
        </div>
        <span className="text-[#6B7280] text-[11px] font-normal leading-[16.5px]">
          {person.info}
        </span>
      </div>
      <button className="flex-shrink-0 text-[#4A6741] text-[11px] font-bold leading-[16.5px] hover:text-[#3a5433] hover:underline transition-colors whitespace-nowrap text-right">
        プロフィール
        <br />
        を見る
      </button>
    </div>
  );
}

export default function Index() {
  const [ageFilter, setAgeFilter] = useState("すべて");
  const [genderFilter, setGenderFilter] = useState("すべて");
  const [hobbyFilter, setHobbyFilter] = useState("すべて");
  const [levelFilter, setLevelFilter] = useState("すべて");

  const filtered = PEOPLE.filter((p) => {
    if (ageFilter !== "すべて") {
      const decade = Math.floor(p.age / 10) * 10;
      const label = decade >= 40 ? "40代以上" : `${decade}代`;
      if (label !== ageFilter) return false;
    }
    if (genderFilter !== "すべて" && p.gender !== genderFilter) return false;
    if (hobbyFilter !== "すべて" && p.hobby !== hobbyFilter) return false;
    if (levelFilter !== "すべて" && p.level !== levelFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAF8] to-[#EDF2ED] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[550px] rounded-2xl border border-[#E2E8E2] bg-white shadow-2xl overflow-hidden">
        {/* Filter Header */}
        <div className="px-4 pt-4 pb-3 flex flex-col gap-3 border-b border-[#E2E8E2] bg-[rgba(248,250,252,0.5)]">
          {/* Title */}
          <div className="flex items-center gap-1">
            <FilterIcon />
            <span className="text-[#6B7280] text-[10px] font-bold uppercase tracking-[0.5px] leading-[15px]">
              検索フィルター
            </span>
          </div>
          {/* Filters row */}
          <div className="flex items-end gap-2">
            <FilterSelect
              label="年齢"
              value={ageFilter}
              options={AGE_OPTIONS}
              onChange={setAgeFilter}
            />
            <FilterSelect
              label="性別"
              value={genderFilter}
              options={GENDER_OPTIONS}
              onChange={setGenderFilter}
            />
            <FilterSelect
              label="趣味"
              value={hobbyFilter}
              options={HOBBY_OPTIONS}
              onChange={setHobbyFilter}
            />
            <FilterSelect
              label="日本語"
              value={levelFilter}
              options={LEVEL_OPTIONS}
              onChange={setLevelFilter}
            />
          </div>
        </div>

        {/* Results list */}
        <div className="flex flex-col">
          {/* Results count header */}
          <div className="px-4 py-2 border-b border-[rgba(226,232,226,0.3)] bg-white">
            <span className="text-[#6B7280] text-[10px] font-bold uppercase tracking-[1px] leading-[15px]">
              結果 ({filtered.length})
            </span>
          </div>

          {/* Scrollable list */}
          <div className="max-h-[400px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-[#6B7280] text-[11px]">
                条件に合うユーザーが見つかりませんでした。
              </div>
            ) : (
              filtered.map((person, index) => (
                <PersonRow key={person.id} person={person} isFirst={index === 0} />
              ))
            )}
            {/* Scroll hint */}
            {filtered.length > 4 && (
              <div className="px-4 py-4 border-t border-[rgba(226,232,226,0.3)] text-center">
                <span className="text-[rgba(107,114,128,0.6)] text-[11px] font-medium leading-[16.5px]">
                  スクロールしてさらに結果を表示します...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { apiFetch } from "@/lib/api";
import { useShiritoriRoom } from "./useShiritoriRoom";

interface GameRoomOut {
  room_id: number;
  code: string;
  host_id: number;
  room_type: string;
  max_players: number;
  status: string;
  room_settings?: {
    script_mode: string;
    min_mora: number;
    max_mora: number;
    start_kana: string;
    turn_seconds: number;
    match_minutes: number;
  } | null;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function ShiritoriRoomView({ roomCode }: { roomCode: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const s = useShiritoriRoom(roomCode);
  const [wordInput, setWordInput] = useState("");
  const [showResult, setShowResult] = useState(false);

  const { data: roomData } = useQuery({
    queryKey: ["game-room", roomCode],
    queryFn: () => apiFetch<GameRoomOut>(`/api/v1/games/rooms/code/${roomCode}`),
    enabled: !!roomCode,
  });

  useEffect(() => {
    if (s.gameStatus === "ENDED") setShowResult(true);
  }, [s.gameStatus]);

  const handleSubmit = async () => {
    if (!wordInput.trim()) return;
    await s.submit(wordInput.trim());
    setWordInput("");
  };

  const settings = s.state?.settings ?? roomData?.room_settings;
  const currentPlayer = s.leaderboard.find((p) => p.user_id === s.state?.current_turn_user_id);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F3F4F6", fontFamily: "Inter, sans-serif" }}>
      <header className="flex-shrink-0 px-6 bg-white border-b border-[#E2E8E2] shadow-sm">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/games")} className="text-sm font-bold text-[#4A6741] hover:underline">
              ← {t("games.gameList")}
            </button>
            <span className="text-lg font-extrabold text-[#2D3A3A]">しりとり</span>
            <span className="text-xs font-bold text-gray-500 bg-slate-100 px-3 py-1 rounded-full">{roomCode}</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold">
            {s.gameStatus === "PLAYING" && (
              <>
                <span className="text-gray-500">{t("shiritori.matchTime")}: <span className="text-[#4A6741]">{formatTime(s.matchSecondsLeft)}</span></span>
                <span className="text-gray-500">{t("shiritori.turnTime")}: <span className="text-orange-600">{formatTime(s.turnSecondsLeft)}</span></span>
              </>
            )}
            <button onClick={s.leave} className="text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50">
              {t("gameRoom.leave")}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex gap-4 p-4 max-w-6xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 bg-white rounded-2xl border border-[#E2E8E2] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#E2E8E2]">
            <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">{t("gameRoom.participants")}</p>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {s.leaderboard.map((p) => (
                <div key={p.user_id} className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#2D3A3A] truncate">{p.full_name}</span>
                  <span className="font-bold text-[#4A6741]">{p.score}</span>
                </div>
              ))}
            </div>
          </div>
          {settings && (
            <div className="p-4 text-xs text-gray-600 space-y-1 border-b border-[#E2E8E2]">
              <p><b>{t("shiritori.script")}:</b> {settings.script_mode === "KATAKANA" ? "Katakana" : "Hiragana"}</p>
              <p><b>{t("shiritori.wordLength")}:</b> {settings.min_mora}–{settings.max_mora} {t("shiritori.mora")}</p>
              <p><b>{t("shiritori.turnTime")}:</b> {settings.turn_seconds}s</p>
              <p><b>{t("shiritori.matchTime")}:</b> {settings.match_minutes} {t("shiritori.minutes")}</p>
            </div>
          )}
          {s.isHost && s.gameStatus === "PLAYING" && (
            <button onClick={s.end} className="m-4 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
              {t("gameRoom.endEarly")}
            </button>
          )}
        </aside>

        {/* Game area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {s.gameStatus === "WAITING" ? (
            <div className="flex-1 bg-white rounded-3xl border border-[#E2E8E2] p-8 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">🔗</div>
              <h2 className="text-2xl font-black text-[#2D3A3A] mb-2">{t("shiritori.title")}</h2>
              <p className="text-gray-500 mb-6 max-w-md">{s.isHost ? t("gameRoom.hostWaitingMsg") : t("gameRoom.guestWaitingMsg")}</p>
              {settings && (
                <div className="mb-6 text-sm text-left bg-slate-50 rounded-2xl p-4 border border-[#E2E8E2] space-y-1">
                  <p>{t("shiritori.script")}: {settings.script_mode}</p>
                  <p>{t("shiritori.startKana")}: {settings.start_kana === "RANDOM" ? t("shiritori.random") : settings.start_kana}</p>
                  <p>{t("shiritori.turnTime")}: {settings.turn_seconds}s · {t("shiritori.matchTime")}: {settings.match_minutes} {t("shiritori.minutes")}</p>
                </div>
              )}
              {s.isHost ? (
                <button onClick={s.start} className="px-8 py-3 bg-[#4A6741] text-white font-bold rounded-2xl hover:opacity-90">
                  {t("gameRoom.startMatch")}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-[#4A6741] text-sm font-bold">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  {t("gameRoom.waitingHost")}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-3xl border border-[#E2E8E2] p-6 flex flex-col">
              <div className="text-center mb-6">
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">{t("shiritori.nextKana")}</p>
                <div className="text-6xl font-black text-[#4A6741] mb-2">{s.state?.required_kana}</div>
                <p className="text-sm text-gray-500">
                  {s.state?.is_my_turn
                    ? t("shiritori.yourTurn")
                    : t("shiritori.waitingTurn", { name: currentPlayer?.full_name ?? "..." })}
                </p>
              </div>

              {s.state?.is_my_turn && (
                <div className="flex gap-2 mb-4 max-w-md mx-auto w-full">
                  <input
                    type="text"
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder={settings?.script_mode === "KATAKANA" ? "カタカナで入力" : "ひらがなで入力"}
                    className="flex-1 px-4 py-3 rounded-2xl border border-[#E2E8E2] text-lg focus:ring-2 focus:ring-[#4A6741]/30 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-[#4A6741] text-white font-bold rounded-2xl hover:opacity-90"
                  >
                    {t("shiritori.submit")}
                  </button>
                </div>
              )}

              {s.error && (
                <p className="text-center text-red-600 text-sm font-semibold mb-4">{s.error}</p>
              )}

              <div className="flex-1 overflow-y-auto border-t border-[#E2E8E2] pt-4">
                <p className="text-xs font-bold uppercase text-gray-500 mb-3">{t("shiritori.history")}</p>
                <div className="space-y-2">
                  {[...(s.state?.history ?? [])].reverse().map((h, i) => (
                    <div key={i} className="flex justify-between items-center text-sm bg-slate-50 rounded-xl px-4 py-2">
                      <div>
                        <span className="font-bold text-[#2D3A3A]">{h.word}</span>
                        <span className="text-gray-500 ml-2">({h.meaning})</span>
                        <span className="text-gray-400 ml-2 text-xs">— {h.full_name}</span>
                      </div>
                      <span className="font-bold text-[#4A6741]">+{h.points}</span>
                    </div>
                  ))}
                  {(s.state?.history?.length ?? 0) === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">{t("shiritori.noWordsYet")}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
            <h3 className="text-xl font-black mb-4">{t("gameRoom.matchEnded")}</h3>
            <div className="space-y-2 mb-6">
              {[...s.leaderboard].sort((a, b) => b.score - a.score).map((p, i) => (
                <div key={p.user_id} className="flex justify-between text-sm font-semibold">
                  <span>{i + 1}. {p.full_name}</span>
                  <span className="text-[#4A6741]">{p.score} {t("gameRoom.points")}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/games")} className="px-6 py-2 bg-[#4A6741] text-white font-bold rounded-xl">
              {t("gameRoom.backToLobby")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
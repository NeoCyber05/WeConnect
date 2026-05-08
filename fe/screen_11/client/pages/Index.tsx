import { useState } from "react";

export default function Index() {
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Blurred background */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/d016ee311c55ddad38e268d8fbe71ce56346aa97?width=2560"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "blur(20px)", transform: "scale(1.05)" }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.00) 40%, rgba(0,0,0,0.00) 60%, rgba(0,0,0,0.60) 100%)",
        }}
      />

      {/* Back button */}
      <button
        className="absolute top-8 left-8 z-10 flex items-center justify-center w-10 h-10 rounded-full"
        style={{ background: "rgba(0,0,0,0.20)", backdropFilter: "blur(2px)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z"
            fill="white"
            fillOpacity="0.7"
          />
        </svg>
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-16 px-8">
        {/* Top: Avatar + Name + Status */}
        <div className="flex flex-col items-center gap-2 pt-10">
          {/* Avatar with ring */}
          <div className="relative flex items-center justify-center">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f3a5d8a258ce97a335764d6f5c2410195bfb5645?width=320"
              alt="Mai Phương (Lily)"
              className="w-40 h-40 rounded-full object-cover"
              style={{
                border: "4px solid rgba(255,255,255,0.10)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              }}
            />
            {/* Outer decorative ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "calc(100% + 32px)",
                height: "calc(100% + 32px)",
                border: "2px solid rgba(255,255,255,0.20)",
                opacity: 0.2,
              }}
            />
          </div>

          {/* Name */}
          <div className="pt-6 flex flex-col items-center gap-2">
            <h1
              className="text-white font-bold text-center"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "36px",
                lineHeight: "40px",
                letterSpacing: "-0.9px",
              }}
            >
              Mai Phương (Lily)
            </h1>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 block" />
              <span
                className="text-center"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "18px",
                  fontWeight: 500,
                  lineHeight: "28px",
                  color: "rgba(255,255,255,0.80)",
                }}
              >
                Đang gọi...
              </span>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex flex-col items-center gap-10">
          {/* Mute + Speaker row */}
          <div className="flex items-center gap-10">
            {/* Mute button */}
            <button
              onClick={() => setMuted((v) => !v)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="flex w-16 h-16 items-center justify-center rounded-full"
                style={{
                  border: "1px solid rgba(255,255,255,0.20)",
                  background: muted
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
                  <path
                    d="M8.75 15C7.70833 15 6.82292 14.6354 6.09375 13.9062C5.36458 13.1771 5 12.2917 5 11.25V3.75C5 2.70833 5.36458 1.82292 6.09375 1.09375C6.82292 0.364583 7.70833 0 8.75 0C9.79167 0 10.6771 0.364583 11.4062 1.09375C12.1354 1.82292 12.5 2.70833 12.5 3.75V11.25C12.5 12.2917 12.1354 13.1771 11.4062 13.9062C10.6771 14.6354 9.79167 15 8.75 15ZM7.5 23.75V19.9062C5.33333 19.6146 3.54167 18.6458 2.125 17C0.708333 15.3542 0 13.4375 0 11.25H2.5C2.5 12.9792 3.10938 14.4531 4.32812 15.6719C5.54688 16.8906 7.02083 17.5 8.75 17.5C10.4792 17.5 11.9531 16.8906 13.1719 15.6719C14.3906 14.4531 15 12.9792 15 11.25H17.5C17.5 13.4375 16.7917 15.3542 15.375 17C13.9583 18.6458 12.1667 19.6146 10 19.9062V23.75H7.5ZM8.75 12.5C9.10417 12.5 9.40104 12.3802 9.64062 12.1406C9.88021 11.901 10 11.6042 10 11.25V3.75C10 3.39583 9.88021 3.09896 9.64062 2.85938C9.40104 2.61979 9.10417 2.5 8.75 2.5C8.39583 2.5 8.09896 2.61979 7.85938 2.85938C7.61979 3.09896 7.5 3.39583 7.5 3.75V11.25C7.5 11.6042 7.61979 11.901 7.85938 12.1406C8.09896 12.3802 8.39583 12.5 8.75 12.5Z"
                    fill="white"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  lineHeight: "16px",
                  color: "rgba(255,255,255,0.60)",
                }}
              >
                Tắt tiếng
              </span>
            </button>

            {/* Speaker button */}
            <button
              onClick={() => setSpeaker((v) => !v)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="flex w-16 h-16 items-center justify-center rounded-full"
                style={{
                  border: "1px solid rgba(255,255,255,0.20)",
                  background: speaker
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <svg width="23" height="22" viewBox="0 0 23 22" fill="none">
                  <path
                    d="M13.75 21.875V19.3125C15.625 18.7708 17.1354 17.7292 18.2812 16.1875C19.4271 14.6458 20 12.8958 20 10.9375C20 8.97917 19.4271 7.22917 18.2812 5.6875C17.1354 4.14583 15.625 3.10417 13.75 2.5625V0C16.3333 0.583333 18.4375 1.89062 20.0625 3.92188C21.6875 5.95312 22.5 8.29167 22.5 10.9375C22.5 13.5833 21.6875 15.9219 20.0625 17.9531C18.4375 19.9844 16.3333 21.2917 13.75 21.875ZM0 14.7188V7.21875H5L11.25 0.96875V20.9688L5 14.7188H0ZM13.75 15.9688V5.90625C14.7292 6.36458 15.4948 7.05208 16.0469 7.96875C16.599 8.88542 16.875 9.88542 16.875 10.9688C16.875 12.0312 16.599 13.0156 16.0469 13.9219C15.4948 14.8281 14.7292 15.5104 13.75 15.9688ZM8.75 7.03125L6.0625 9.71875H2.5V12.2188H6.0625L8.75 14.9062V7.03125Z"
                    fill="white"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  lineHeight: "16px",
                  color: "rgba(255,255,255,0.60)",
                }}
              >
                Loa ngoài
              </span>
            </button>
          </div>

          {/* End call button */}
          <div className="flex flex-col items-center gap-3">
            <button
              className="relative flex w-20 h-20 items-center justify-center rounded-full bg-red-500"
              style={{
                boxShadow:
                  "0 0 0 8px rgba(239,68,68,0.20), 0 25px 50px -12px rgba(0,0,0,0.25)",
              }}
            >
              <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
                <path
                  d="M1.11369 17.9782C3.3234 15.7685 5.98831 14.067 9.10842 12.8738C12.2285 11.6805 15.5564 11.0839 19.0919 11.0839C22.6274 11.0839 25.9552 11.6805 29.0754 12.8738C32.1955 14.067 34.8604 15.7685 37.0701 17.9782C37.3883 18.2964 37.5474 18.6676 37.5474 19.0919C37.5474 19.5162 37.3883 19.8874 37.0701 20.2056L32.7744 24.5013C32.5269 24.7487 32.222 24.8857 31.8596 24.9123C31.4972 24.9388 31.1834 24.8548 30.9183 24.6604L26.5165 21.6375C26.1983 21.39 25.9685 21.1425 25.8271 20.895C25.6857 20.6475 25.615 20.3824 25.615 20.0995L25.5884 14.9288C24.5808 14.6283 23.529 14.4161 22.433 14.2924C21.337 14.1687 20.2144 14.1156 19.0654 14.1333C17.9694 14.1333 16.8866 14.1996 15.8171 14.3322C14.7476 14.4648 13.6825 14.6725 12.6219 14.9553V19.9404C12.6219 20.2586 12.5335 20.5857 12.3567 20.9215C12.1799 21.2574 11.9501 21.5314 11.6673 21.7435L7.26553 24.6604C6.94733 24.8371 6.61587 24.9123 6.27116 24.8857C5.92644 24.8592 5.63918 24.7311 5.40937 24.5013L1.11369 20.2056C0.795495 19.8874 0.636397 19.5162 0.636397 19.0919C0.636397 18.6676 0.795495 18.2964 1.11369 17.9782ZM28.6113 15.9364V19.4366L31.5547 21.4784L33.9146 19.1184C33.1014 18.482 32.2618 17.8898 31.3956 17.3418C30.5293 16.7938 29.6013 16.3253 28.6113 15.9364ZM9.62549 15.9364C8.63555 16.3253 7.69421 16.7894 6.80149 17.3285C5.90876 17.8677 5.07349 18.4732 4.29568 19.1449L6.62913 21.4784L9.62549 19.4896L9.62549 15.9364Z"
                  fill="white"
                />
              </svg>
            </button>
            <span
              className="text-white font-bold tracking-widest uppercase"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "1.4px",
              }}
            >
              Kết thúc
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

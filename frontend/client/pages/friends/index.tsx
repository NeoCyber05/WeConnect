import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";

// ── SVG Icons ──────────────────────────────────────────────────────────────
function LogoIcon() {
  return (
    <svg width="26" height="28" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 28.75C6.45833 28.75 5.57292 28.3854 4.84375 27.6562C4.11458 26.9271 3.75 26.0417 3.75 25C3.75 23.9583 4.11458 23.0729 4.84375 22.3438C5.57292 21.6146 6.45833 21.25 7.5 21.25C7.79167 21.25 8.0625 21.2812 8.3125 21.3438C8.5625 21.4062 8.80208 21.4896 9.03125 21.5938L10.8125 19.375C10.2292 18.7292 9.82292 18 9.59375 17.1875C9.36458 16.375 9.3125 15.5625 9.4375 14.75L6.90625 13.9062C6.55208 14.4271 6.10417 14.8438 5.5625 15.1562C5.02083 15.4688 4.41667 15.625 3.75 15.625C2.70833 15.625 1.82292 15.2604 1.09375 14.5312C0.364583 13.8021 0 12.9167 0 11.875C0 10.8333 0.364583 9.94792 1.09375 9.21875C1.82292 8.48958 2.70833 8.125 3.75 8.125C4.79167 8.125 5.67708 8.48958 6.40625 9.21875C7.13542 9.94792 7.5 10.8333 7.5 11.875C7.5 11.9167 7.5 11.9583 7.5 12C7.5 12.0417 7.5 12.0833 7.5 12.125L10.0312 13C10.4479 12.25 11.0052 11.6146 11.7031 11.0938C12.401 10.5729 13.1875 10.2396 14.0625 10.0938V7.375C13.25 7.14583 12.5781 6.70312 12.0469 6.04688C11.5156 5.39062 11.25 4.625 11.25 3.75C11.25 2.70833 11.6146 1.82292 12.3438 1.09375C13.0729 0.364583 13.9583 0 15 0C16.0417 0 16.9271 0.364583 17.6562 1.09375C18.3854 1.82292 18.75 2.70833 18.75 3.75C18.75 4.625 18.4792 5.39062 17.9375 6.04688C17.3958 6.70312 16.7292 7.14583 15.9375 7.375V10.0938C16.8125 10.2396 17.599 10.5729 18.2969 11.0938C18.9948 11.6146 19.5521 12.25 19.9688 13L22.5 12.125C22.5 12.0833 22.5 12.0417 22.5 12C22.5 11.9583 22.5 11.9167 22.5 11.875C22.5 10.8333 22.8646 9.94792 23.5938 9.21875C24.3229 8.48958 25.2083 8.125 26.25 8.125C27.2917 8.125 28.1771 8.48958 28.9062 9.21875C29.6354 9.94792 30 10.8333 30 11.875C30 12.9167 29.6354 13.8021 28.9062 14.5312C28.1771 15.2604 27.2917 15.625 26.25 15.625C25.5833 15.625 24.974 15.4688 24.4219 15.1562C23.8698 14.8438 23.4271 14.4271 23.0938 13.9062L20.5625 14.75C20.6875 15.5625 20.6354 16.3698 20.4062 17.1719C20.1771 17.974 19.7708 18.7083 19.1875 19.375L20.9688 21.5625C21.1979 21.4583 21.4375 21.3802 21.6875 21.3281C21.9375 21.276 22.2083 21.25 22.5 21.25C23.5417 21.25 24.4271 21.6146 25.1562 22.3438C25.8854 23.0729 26.25 23.9583 26.25 25C26.25 26.0417 25.8854 26.9271 25.1562 27.6562C24.4271 28.3854 23.5417 28.75 22.5 28.75C21.4583 28.75 20.5729 28.3854 19.8438 27.6562C19.1146 26.9271 18.75 26.0417 18.75 25C18.75 24.5833 18.8177 24.1823 18.9531 23.7969C19.0885 23.4115 19.2708 23.0625 19.5 22.75L17.7188 20.5312C16.8646 21.0104 15.9531 21.25 14.9844 21.25C14.0156 21.25 13.1042 21.0104 12.25 20.5312L10.5 22.75C10.7292 23.0625 10.9115 23.4115 11.0469 23.7969C11.1823 24.1823 11.25 24.5833 11.25 25C11.25 26.0417 10.8854 26.9271 10.1562 27.6562C9.42708 28.3854 8.54167 28.75 7.5 28.75ZM3.75 13.125C4.10417 13.125 4.40104 13.0052 4.64062 12.7656C4.88021 12.526 5 12.2292 5 11.875C5 11.5208 4.88021 11.224 4.64062 10.9844C4.40104 10.7448 4.10417 10.625 3.75 10.625C3.39583 10.625 3.09896 10.7448 2.85938 10.9844C2.61979 11.224 2.5 11.5208 2.5 11.875C2.5 12.2292 2.61979 12.526 2.85938 12.7656C3.09896 13.0052 3.39583 13.125 3.75 13.125ZM7.5 26.25C7.85417 26.25 8.15104 26.1302 8.39062 25.8906C8.63021 25.651 8.75 25.3542 8.75 25C8.75 24.6458 8.63021 24.349 8.39062 24.1094C8.15104 23.8698 7.85417 23.75 7.5 23.75C7.14583 23.75 6.84896 23.8698 6.60938 24.1094C6.36979 24.349 6.25 24.6458 6.25 25C6.25 25.3542 6.36979 25.651 6.60938 25.8906C6.84896 26.1302 7.14583 26.25 7.5 26.25ZM15 5C15.3542 5 15.651 4.88021 15.8906 4.64062C16.1302 4.40104 16.25 4.10417 16.25 3.75C16.25 3.39583 16.1302 3.09896 15.8906 2.85938C15.651 2.61979 15.3542 2.5 15 2.5C14.6458 2.5 14.349 2.61979 14.1094 2.85938C13.8698 3.09896 13.75 3.39583 13.75 3.75C13.75 4.10417 13.8698 4.40104 14.1094 4.64062C14.349 4.88021 14.6458 5 15 5ZM15 18.75C15.875 18.75 16.6146 18.4479 17.2188 17.8438C17.8229 17.2396 18.125 16.5 18.125 15.625C18.125 14.75 17.8229 14.0104 17.2188 13.4062C16.6146 12.8021 15.875 12.5 15 12.5C14.125 12.5 13.3854 12.8021 12.7812 13.4062C12.1771 14.0104 11.875 14.75 11.875 15.625C11.875 16.5 12.1771 17.2396 12.7812 17.8438C13.3854 18.4479 14.125 18.75 15 18.75ZM22.5 26.25C22.8542 26.25 23.151 26.1302 23.3906 25.8906C23.6302 25.651 23.75 25.3542 23.75 25C23.75 24.6458 23.6302 24.349 23.3906 24.1094C23.151 23.8698 22.8542 23.75 22.5 23.75C22.1458 23.75 21.849 23.8698 21.6094 24.1094C21.3698 24.349 21.25 24.6458 21.25 25C21.25 25.3542 21.3698 25.651 21.6094 25.8906C21.849 26.1302 22.1458 26.25 22.5 26.25ZM26.25 13.125C26.6042 13.125 26.901 13.0052 27.1406 12.7656C27.3802 12.526 27.5 12.2292 27.5 11.875C27.5 11.5208 27.3802 11.224 27.1406 10.9844C26.901 10.7448 26.6042 10.625 26.25 10.625C25.8958 10.625 25.599 10.7448 25.3594 10.9844C25.1198 11.224 25 11.5208 25 11.875C25 12.2292 25.1198 12.526 25.3594 12.7656C25.599 13.0052 25.8958 13.125 26.25 13.125Z" fill="#4EDEA3"/>
    </svg>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none">
      <path d="M1.66667 13.3333H4.16667V8.33333H9.16667V13.3333H11.6667V5.83333L6.66667 2.08333L1.66667 5.83333V13.3333ZM0 15V5L6.66667 0L13.3333 5V15H7.5V10H5.83333V15H0Z" fill={active ? "#4A6741" : "#6B7280"} />
    </svg>
  );
}

function FriendsIcon({ active }: { active?: boolean }) {
  return (
    <svg width="19" height="14" viewBox="0 0 19 14" fill="none">
      <path d="M0 13.3333V11C0 10.5278 0.121528 10.0938 0.364583 9.69792C0.607639 9.30208 0.930556 9 1.33333 8.79167C2.19444 8.36111 3.06944 8.03819 3.95833 7.82292C4.84722 7.60764 5.75 7.5 6.66667 7.5C7.58333 7.5 8.48611 7.60764 9.375 7.82292C10.2639 8.03819 11.1389 8.36111 12 8.79167C12.4028 9 12.7257 9.30208 12.9688 9.69792C13.2118 10.0938 13.3333 10.5278 13.3333 11V13.3333H0ZM15 13.3333V10.8333C15 10.2222 14.8299 9.63542 14.4896 9.07292C14.1493 8.51042 13.6667 8.02778 13.0417 7.625C13.75 7.70833 14.4167 7.85069 15.0417 8.05208C15.6667 8.25347 16.25 8.5 16.7917 8.79167C17.2917 9.06944 17.6736 9.37847 17.9375 9.71875C18.2014 10.059 18.3333 10.4306 18.3333 10.8333V13.3333H15ZM6.66667 6.66667C5.75 6.66667 4.96528 6.34028 4.3125 5.6875C3.65972 5.03472 3.33333 4.25 3.33333 3.33333C3.33333 2.41667 3.65972 1.63194 4.3125 0.979167C4.96528 0.326389 5.75 0 6.66667 0C7.58333 0 8.36806 0.326389 9.02083 0.979167C9.67361 1.63194 10 2.41667 10 3.33333C10 4.25 9.67361 5.03472 9.02083 5.6875C8.36806 6.34028 7.58333 6.66667 6.66667 6.66667ZM15 3.33333C15 4.25 14.6736 5.03472 14.0208 5.6875C13.3681 6.34028 12.5833 6.66667 11.6667 6.66667C11.5139 6.66667 11.3194 6.64931 11.0833 6.61458C10.8472 6.57986 10.6528 6.54167 10.5 6.5C10.875 6.05556 11.1632 5.5625 11.3646 5.02083C11.566 4.47917 11.6667 3.91667 11.6667 3.33333C11.6667 2.75 11.566 2.1875 11.3646 1.64583C11.1632 1.10417 10.875 0.611111 10.5 0.166667C10.6944 0.0972222 10.8889 0.0520833 11.0833 0.03125C11.2778 0.0104167 11.4722 0 11.6667 0C12.5833 0 13.3681 0.326389 14.0208 0.979167C14.6736 1.63194 15 2.41667 15 3.33333ZM1.66667 11.6667H11.6667V11C11.6667 10.8472 11.6285 10.7083 11.5521 10.5833C11.4757 10.4583 11.375 10.3611 11.25 10.2917C10.5 9.91667 9.74306 9.63542 8.97917 9.44792C8.21528 9.26042 7.44444 9.16667 6.66667 9.16667C5.88889 9.16667 5.11806 9.26042 4.35417 9.44792C3.59028 9.63542 2.83333 9.91667 2.08333 10.2917C1.95833 10.3611 1.85764 10.4583 1.78125 10.5833C1.70486 10.7083 1.66667 10.8472 1.66667 11V11.6667ZM6.66667 5C7.125 5 7.51736 4.83681 7.84375 4.51042C8.17014 4.18403 8.33333 3.79167 8.33333 3.33333C8.33333 2.875 8.17014 2.48264 7.84375 2.15625C7.51736 1.82986 7.125 1.66667 6.66667 1.66667C6.20833 1.66667 5.81597 1.82986 5.48958 2.15625C5.16319 2.48264 5 2.875 5 3.33333C5 3.79167 5.16319 4.18403 5.48958 4.51042C5.81597 4.83681 6.20833 5 6.66667 5Z" fill={active ? "#4A6741" : "#6B7280"} />
    </svg>
  );
}

function ChatIcon({ active }: { active?: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M0 16.6667V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H15C15.4583 0 15.8507 0.163194 16.1771 0.489583C16.5035 0.815972 16.6667 1.20833 16.6667 1.66667V11.6667C16.6667 12.125 16.5035 12.5174 16.1771 12.8438C15.8507 13.1701 15.4583 13.3333 15 13.3333H3.33333L0 16.6667ZM2.625 11.6667H15V1.66667H1.66667V12.6042L2.625 11.6667ZM1.66667 11.6667V1.66667V11.6667Z" fill={active ? "#4A6741" : "#6B7280"} />
    </svg>
  );
}

function EventIcon({ active }: { active?: boolean }) {
  return (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="none">
      <path d="M1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V3.33333C0 2.875 0.163194 2.48264 0.489583 2.15625C0.815972 1.82986 1.20833 1.66667 1.66667 1.66667H2.5V0H4.16667V1.66667H10.8333V0H12.5V1.66667H13.3333C13.7917 1.66667 14.184 1.82986 14.5104 2.15625C14.8368 2.48264 15 2.875 15 3.33333V15C15 15.4583 14.8368 15.8507 14.5104 16.1771C14.184 16.5035 13.7917 16.6667 13.3333 16.6667H1.66667ZM1.66667 15H13.3333V6.66667H1.66667V15ZM1.66667 5H13.3333V3.33333H1.66667V5ZM7.5 10C7.26389 10 7.06597 9.92014 6.90625 9.76042C6.74653 9.60069 6.66667 9.40278 6.66667 9.16667C6.66667 8.93056 6.74653 8.73264 6.90625 8.57292C7.06597 8.41319 7.26389 8.33333 7.5 8.33333C7.73611 8.33333 7.93403 8.41319 8.09375 8.57292C8.25347 8.73264 8.33333 8.93056 8.33333 9.16667C8.33333 9.40278 8.25347 9.60069 8.09375 9.76042C7.93403 9.92014 7.73611 10 7.5 10ZM4.16667 10C3.93056 10 3.73264 9.92014 3.57292 9.76042C3.41319 9.60069 3.33333 9.40278 3.33333 9.16667C3.33333 8.93056 3.41319 8.73264 3.57292 8.57292C3.73264 8.41319 3.93056 8.33333 4.16667 8.33333C4.40278 8.33333 4.60069 8.41319 4.76042 8.57292C4.92014 8.73264 5 8.93056 5 9.16667C5 9.40278 4.92014 9.60069 4.76042 9.76042C4.60069 9.92014 4.40278 10 4.16667 10ZM10.8333 10C10.5972 10 10.3993 9.92014 10.2396 9.76042C10.0799 9.60069 10 9.40278 10 9.16667C10 8.93056 10.0799 8.73264 10.2396 8.57292C10.3993 8.41319 10.5972 8.33333 10.8333 8.33333C11.0694 8.33333 11.2674 8.41319 11.4271 8.57292C11.5868 8.73264 11.6667 8.93056 11.6667 9.16667C11.6667 9.40278 11.5868 9.60069 11.4271 9.76042C11.2674 9.92014 11.0694 10 10.8333 10ZM7.5 13.3333C7.26389 13.3333 7.06597 13.2535 6.90625 13.0938C6.74653 12.934 6.66667 12.7361 6.66667 12.5C6.66667 12.2639 6.74653 12.066 6.90625 11.9062C7.06597 11.7465 7.26389 11.6667 7.5 11.6667C7.73611 11.6667 7.93403 11.7465 8.09375 11.9062C8.25347 12.066 8.33333 12.2639 8.33333 12.5C8.33333 12.7361 8.25347 12.934 8.09375 13.0938C7.93403 13.2535 7.73611 13.3333 7.5 13.3333ZM4.16667 13.3333C3.93056 13.3333 3.73264 13.2535 3.57292 13.0938C3.41319 12.934 3.33333 12.7361 3.33333 12.5C3.33333 12.2639 3.41319 12.066 3.57292 11.9062C3.73264 11.7465 3.93056 11.6667 4.16667 11.6667C4.40278 11.6667 4.60069 11.7465 4.76042 11.9062C4.92014 12.066 5 12.2639 5 12.5C5 12.7361 4.92014 12.934 4.76042 13.0938C4.60069 13.2535 4.40278 13.3333 4.16667 13.3333ZM10.8333 13.3333C10.5972 13.3333 10.3993 13.2535 10.2396 13.0938C10.0799 12.934 10 12.7361 10 12.5C10 12.2639 10.0799 12.066 10.2396 11.9062C10.3993 11.7465 10.5972 11.6667 10.8333 11.6667C11.0694 11.6667 11.2674 11.7465 11.4271 11.9062C11.5868 12.066 11.6667 12.2639 11.6667 12.5C11.6667 12.7361 11.5868 12.934 11.4271 13.0938C11.2674 13.2535 11.0694 13.3333 10.8333 13.3333Z" fill={active ? "#4A6741" : "#6B7280"} />
    </svg>
  );
}

function GameIcon({ active }: { active?: boolean }) {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
      <path d="M2.1125 11.6667C1.40417 11.6667 0.855556 11.4201 0.466667 10.9271C0.0777778 10.434 -0.0680556 9.83333 0.0291667 9.125L0.904167 2.875C1.02917 2.04167 1.40069 1.35417 2.01875 0.8125C2.63681 0.270833 3.3625 0 4.19583 0H12.4458C13.2792 0 14.0049 0.270833 14.6229 0.8125C15.241 1.35417 15.6125 2.04167 15.7375 2.875L16.6125 9.125C16.7097 9.83333 16.5639 10.434 16.175 10.9271C15.7861 11.4201 15.2375 11.6667 14.5292 11.6667C14.2375 11.6667 13.9667 11.6146 13.7167 11.5104C13.4667 11.4062 13.2375 11.25 13.0292 11.0417L11.1542 9.16667H5.4875L3.6125 11.0417C3.40417 11.25 3.175 11.4062 2.925 11.5104C2.675 11.6146 2.40417 11.6667 2.1125 11.6667Z" fill={active ? "#4A6741" : "#6B7280"} />
    </svg>
  );
}

function SearchIcon({ color = "#6B7280" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12.45 13.5L7.725 8.775C7.35 9.075 6.91875 9.3125 6.43125 9.4875C5.94375 9.6625 5.425 9.75 4.875 9.75C3.5125 9.75 2.35938 9.27813 1.41562 8.33438C0.471875 7.39063 0 6.2375 0 4.875C0 3.5125 0.471875 2.35938 1.41562 1.41562C2.35938 0.471875 3.5125 0 4.875 0C6.2375 0 7.39063 0.471875 8.33438 1.41562C9.27813 2.35938 9.75 3.5125 9.75 4.875C9.75 5.425 9.6625 5.94375 9.4875 6.43125C9.3125 6.91875 9.075 7.35 8.775 7.725L13.5 12.45L12.45 13.5ZM4.875 8.25C5.8125 8.25 6.60938 7.92188 7.26562 7.26562C7.92188 6.60938 8.25 5.8125 8.25 4.875C8.25 3.9375 7.92188 3.14062 7.26562 2.48438C6.60938 1.82812 5.8125 1.5 4.875 1.5C3.9375 1.5 3.14062 1.82812 2.48438 2.48438C1.82812 3.14062 1.5 3.9375 1.5 4.875C1.5 5.8125 1.82812 6.60938 2.48438 7.26562C3.14062 7.92188 3.9375 8.25 4.875 8.25Z" fill={color} />
    </svg>
  );
}

function MessageBubbleIcon() {
  return (
    <svg width="17" height="18" viewBox="0 0 17 18" fill="none">
      <path d="M0 16.6667V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H15C15.4583 0 15.8507 0.163194 16.1771 0.489583C16.5035 0.815972 16.6667 1.20833 16.6667 1.66667V11.6667C16.6667 12.125 16.5035 12.5174 16.1771 12.8438C15.8507 13.1701 15.4583 13.3333 15 13.3333H3.33333L0 16.6667ZM2.625 11.6667H15V1.66667H1.66667V12.6042L2.625 11.6667Z" fill="#4A6741" />
    </svg>
  );
}

function RemoveFriendIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <path d="M12.5 5.83333V4.16667H17.5V5.83333H12.5ZM6.66667 6.66667C5.75 6.66667 4.96528 6.34028 4.3125 5.6875C3.65972 5.03472 3.33333 4.25 3.33333 3.33333C3.33333 2.41667 3.65972 1.63194 4.3125 0.979167C4.96528 0.326389 5.75 0 6.66667 0C7.58333 0 8.36806 0.326389 9.02083 0.979167C9.67361 1.63194 10 2.41667 10 3.33333C10 4.25 9.67361 5.03472 9.02083 5.6875C8.36806 6.34028 7.58333 6.66667 6.66667 6.66667ZM0 13.3333V11C0 10.5278 0.121528 10.0938 0.364583 9.69792C0.607639 9.30208 0.930556 9 1.33333 8.79167C2.19444 8.36111 3.06944 8.03819 3.95833 7.82292C4.84722 7.60764 5.75 7.5 6.66667 7.5C7.58333 7.5 8.48611 7.60764 9.375 7.82292C10.2639 8.03819 11.1389 8.36111 12 8.79167C12.4028 9 12.7257 9.30208 12.9688 9.69792C13.2118 10.0938 13.3333 10.5278 13.3333 11V13.3333H0ZM1.66667 11.6667H11.6667V11C11.6667 10.8472 11.6285 10.7083 11.5521 10.5833C11.4757 10.4583 11.375 10.3611 11.25 10.2917C10.5 9.91667 9.74306 9.63542 8.97917 9.44792C8.21528 9.26042 7.44444 9.16667 6.66667 9.16667C5.88889 9.16667 5.11806 9.26042 4.35417 9.44792C3.59028 9.63542 2.83333 9.91667 2.08333 10.2917C1.95833 10.3611 1.85764 10.4583 1.78125 10.5833C1.70486 10.7083 1.66667 10.8472 1.66667 11V11.6667ZM6.66667 5C7.125 5 7.51736 4.83681 7.84375 4.51042C8.17014 4.18403 8.33333 3.79167 8.33333 3.33333C8.33333 2.875 8.17014 2.48264 7.84375 2.15625C7.51736 1.82986 7.125 1.66667 6.66667 1.66667C6.20833 1.66667 5.81597 1.82986 5.48958 2.15625C5.16319 2.48264 5 2.875 5 3.33333C5 3.79167 5.16319 4.18403 5.48958 4.51042C5.81597 4.83681 6.20833 5 6.66667 5Z" fill="#DC2626" />
    </svg>
  );
}

function AddFriendIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
      <path d="M12.75 7.5V5.25H10.5V3.75H12.75V1.5H14.25V3.75H16.5V5.25H14.25V7.5H12.75ZM6 6C5.175 6 4.46875 5.70625 3.88125 5.11875C3.29375 4.53125 3 3.825 3 3C3 2.175 3.29375 1.46875 3.88125 0.88125C4.46875 0.29375 5.175 0 6 0C6.825 0 7.53125 0.29375 8.11875 0.88125C8.70625 1.46875 9 2.175 9 3C9 3.825 8.70625 4.53125 8.11875 5.11875C7.53125 5.70625 6.825 6 6 6ZM0 12V9.9C0 9.475 0.109375 9.08437 0.328125 8.72812C0.546875 8.37187 0.8375 8.1 1.2 7.9125C1.975 7.525 2.7625 7.23438 3.5625 7.04063C4.3625 6.84688 5.175 6.75 6 6.75C6.825 6.75 7.6375 6.84688 8.4375 7.04063C9.2375 7.23438 10.025 7.525 10.8 7.9125C11.1625 8.1 11.4531 8.37187 11.6719 8.72812C11.8906 9.08437 12 9.475 12 9.9V12H0ZM1.5 10.5H10.5V9.9C10.5 9.7625 10.4656 9.6375 10.3969 9.525C10.3281 9.4125 10.2375 9.325 10.125 9.2625C9.45 8.925 8.76875 8.67188 8.08125 8.50313C7.39375 8.33438 6.7 8.25 6 8.25C5.3 8.25 4.60625 8.33438 3.91875 8.50313C3.23125 8.67188 2.55 8.925 1.875 9.2625C1.7625 9.325 1.67188 9.4125 1.60312 9.525C1.53437 9.6375 1.5 9.7625 1.5 9.9V10.5ZM6 4.5C6.4125 4.5 6.76562 4.35312 7.05937 4.05937C7.35312 3.76562 7.5 3.4125 7.5 3C7.5 2.5875 7.35312 2.23438 7.05937 1.94062C6.76562 1.64687 6.4125 1.5 6 1.5C5.5875 1.5 5.23438 1.64687 4.94063 1.94062C4.64688 2.23438 4.5 2.5875 4.5 3C4.5 3.4125 4.64688 3.76562 4.94063 4.05937C5.23438 4.35312 5.5875 4.5 6 4.5Z" fill="#4A6741" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="13" height="9" viewBox="0 0 13 9" fill="none">
      <path d="M1.275 9L3 6C2.175 6 1.46875 5.70625 0.88125 5.11875C0.29375 4.53125 0 3.825 0 3C0 2.175 0.29375 1.46875 0.88125 0.88125C1.46875 0.29375 2.175 0 3 0C3.825 0 4.53125 0.29375 5.11875 0.88125C5.70625 1.46875 6 2.175 6 3C6 3.2875 5.96562 3.55312 5.89687 3.79688C5.82812 4.04063 5.725 4.275 5.5875 4.5L3 9H1.275ZM8.025 9L9.75 6C8.925 6 8.21875 5.70625 7.63125 5.11875C7.04375 4.53125 6.75 3.825 6.75 3C6.75 2.175 7.04375 1.46875 7.63125 0.88125C8.21875 0.29375 8.925 0 9.75 0C10.575 0 11.2812 0.29375 11.8687 0.88125C12.4562 1.46875 12.75 2.175 12.75 3C12.75 3.2875 12.7156 3.55312 12.6469 3.79688C12.5781 4.04063 12.475 4.275 12.3375 4.5L9.75 9H8.025Z" fill="#4A6741" />
    </svg>
  );
}

function UserPlaceholderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0Z" fill="#6B7280" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
      <path d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z" fill="#4A6741" />
    </svg>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────
const friendRequests = [
  {
    id: 1,
    name: "Minh Anh (Hana)",
    meta: "4 bạn chung • Hà Nội",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/8c8bafd5230dccaf3fe5e242b138303400c2f5d6?width=128",
  },
  {
    id: 2,
    name: "Quốc Bảo (Kenji)",
    meta: "12 bạn chung • TP.HCM",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/61afea3af0514d4233ff4ac84f157a41db25ac42?width=128",
  },
  {
    id: 3,
    name: "Trần Thị Mai",
    meta: "8 bạn chung • Đà Nẵng",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/226e674b15644bc278f4e417257ec58047fb1c87?width=128",
  },
];

const myFriends = [
  {
    id: 1,
    name: "Hoàng Nam",
    status: "Ngoại tuyến • Hải Phòng",
    img: null,
  },
  {
    id: 2,
    name: "Minh Anh (Hana)",
    status: "Đang trực tuyến • Hà Nội",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/ed3c347509be483244f4bbf49b8e6ac6afa6f3b9?width=112",
  },
  {
    id: 3,
    name: "Quốc Bảo (Kenji)",
    status: "Truy cập 5 phút trước • TP.HCM",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/61afea3af0514d4233ff4ac84f157a41db25ac42?width=112",
  },
];

const suggestions = [
  {
    id: 1,
    name: "Minh Anh (Hana)",
    meta: "22 tuổi • Hà Nội",
    tags: ["N3 Japanese", "Game"],
    match: "98%",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/44f473e4387daf47f645da8834b4b9424a6c82d8?width=112",
  },
  {
    id: 2,
    name: "Quốc Bảo (Kenji)",
    meta: "24 tuổi • TP.HCM",
    tags: ["N1 JLPT", "Kinh doanh"],
    match: "85%",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/0e84ec6bddc5b970695c1cf74858fd8b7898eb18?width=112",
  },
  {
    id: 3,
    name: "Mai Phương (Lily)",
    meta: "23 tuổi • Đà Nẵng",
    tags: ["N2 JLPT", "Du lịch"],
    match: "72%",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/226e674b15644bc278f4e417257ec58047fb1c87?width=112",
  },
];

// ── Nav links config ─────────────────────────────────────────────────────────
const navLinks = [
  { label: "Trang chủ", path: "/", icon: HomeIcon },
  { label: "Bạn bè", path: "/", icon: FriendsIcon },
  { label: "Trò chuyện", path: "/chat", icon: ChatIcon },
  { label: "Sự kiện", path: "/events", icon: EventIcon },
  { label: "Trò chơi", path: "/games", icon: GameIcon },
];

// ── Header ───────────────────────────────────────────────────────────────────
function Header() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8E2] shadow-sm">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nav */}
          <div className="flex items-center gap-8 flex-1 min-w-0">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <LogoIcon />
              <span className="text-[#2D3A3A] font-extrabold text-xl leading-5 tracking-tight">
                WeConnect
              </span>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-stretch h-16 gap-1">
              {navLinks.map(({ label, path, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "text-[#4A6741] border-b-2 border-[#4A6741]"
                        : "text-[#6B7280] rounded-lg hover:bg-[#F1F5F9]"
                    }`}
                  >
                    <Icon active={active} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Search */}
          <div className="hidden sm:flex items-center justify-center px-8 flex-1 max-w-[512px]">
            <div className="relative flex items-center w-full max-w-[448px]">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng ,bạn bè..."
                className="w-full pl-10 pr-4 py-[7px] rounded-full bg-[#F1F5F9]/80 text-sm text-[#6B7280] placeholder-[#6B7280] border-none outline-none focus:ring-2 focus:ring-[#4A6741]/20"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon />
              </span>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center pl-2">
            <div className="pl-4 border-l border-[#E2E8E2]">
              <Link to="/profile">
                <div className="w-9 h-9 rounded-full bg-[#E2E8F0] ring-2 ring-[#4A6741]/10 overflow-hidden flex-shrink-0">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/970853f39e1b18632ca69640ab7ac67726e7dc95?width=72"
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Friend Request Card ───────────────────────────────────────────────────────
function FriendRequestCard({
  name,
  meta,
  img,
}: {
  name: string;
  meta: string;
  img: string;
}) {
  const [accepted, setAccepted] = useState(false);
  const [ignored, setIgnored] = useState(false);

  if (ignored) return null;

  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[310px] flex items-center gap-4 p-4 rounded-2xl border border-[#E2E8E2] bg-white">
      <img
        src={img}
        alt={name}
        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex flex-col gap-2 min-w-0">
        <div>
          <p className="text-sm font-bold text-[#2D3A3A] truncate">{name}</p>
          <p className="text-[10px] text-[#6B7280]">{meta}</p>
        </div>
        {accepted ? (
          <p className="text-xs font-semibold text-[#4A6741]">Đã chấp nhận!</p>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setAccepted(true)}
              className="px-3 py-1 rounded-md bg-[#4A6741] text-white text-xs font-semibold hover:bg-[#3a5232] transition-colors"
            >
              Chấp nhận
            </button>
            <button
              onClick={() => setIgnored(true)}
              className="px-3 py-1 rounded-md bg-[#F1F5F9] text-[#6B7280] text-xs font-semibold hover:bg-[#E2E8E2] transition-colors"
            >
              Bỏ qua
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Suggestion Card ───────────────────────────────────────────────────────────
function SuggestionCard({
  name,
  meta,
  tags,
  match,
  img,
}: {
  name: string;
  meta: string;
  tags: string[];
  match: string;
  img: string;
}) {
  return (
    <div className="flex items-center gap-4">
      {/* Avatar + match badge */}
      <div className="relative flex-shrink-0">
        <img
          src={img}
          alt={name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-[#F1F5F9]"
        />
        <span className="absolute -bottom-1 -right-1 flex items-center px-[6px] py-[2px] rounded-full border-2 border-white bg-[#4A6741] text-[8px] font-bold text-white leading-3">
          {match}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-sm font-bold text-[#2D3A3A] truncate">{name}</p>
        <p className="text-[10px] text-[#6B7280]">{meta}</p>
        <div className="flex gap-1 mt-1 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-[6px] py-[2px] text-[8px] font-medium text-[#6B7280] bg-[#F1F5F9] rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Add button */}
      <button className="flex-shrink-0 p-2 rounded-lg bg-[#4A6741]/10 hover:bg-[#4A6741]/20 transition-colors">
        <AddFriendIcon />
      </button>
    </div>
  );
}

// ── Friends Page ──────────────────────────────────────────────────────────────
export default function Index() {
  const [search, setSearch] = useState("");

  const filteredFriends = myFriends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAF9] font-inter">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left Column ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Friend Requests Section */}
          <section className="flex flex-col gap-6">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 rounded-full bg-[#4A6741]" />
                  <h2 className="text-xl font-bold text-[#2D3A3A]">
                    Lời mời kết bạn
                  </h2>
                </div>
                <span className="text-[11px] italic text-[#6B7280] opacity-75">
                  (Cuộn ngang để xem thêm)
                </span>
              </div>
              <span className="px-[10px] py-1 rounded-full bg-[#4A6741]/10 text-[11px] font-bold text-[#4A6741]">
                3 yêu cầu mới
              </span>
            </div>

            {/* Horizontally scrollable request cards */}
            <div className="relative overflow-hidden">
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-[#E2E8E2] scrollbar-track-transparent">
                {friendRequests.map((req) => (
                  <FriendRequestCard key={req.id} {...req} />
                ))}
                {/* Scroll hint arrow */}
                <div className="flex-shrink-0 flex items-center">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E2E8E2] shadow-sm hover:bg-[#F1F5F9] transition-colors">
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* My Friends Section */}
          <section className="flex flex-col gap-6">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 rounded-full bg-[#4A6741]" />
                  <h2 className="text-xl font-bold text-[#2D3A3A]">
                    Bạn bè của tôi
                  </h2>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5 ml-4">
                  Danh sách những người bạn đã kết nối
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Tìm kiếm trong danh sách bạn bè..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-[9px] rounded-lg border border-[#E2E8E2] bg-white text-sm text-[#6B7280] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#4A6741]/20"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <SearchIcon color="#94A3B8" />
                </span>
              </div>
            </div>

            {/* Friends list */}
            <div className="rounded-2xl border border-[#E2E8E2] bg-white shadow-sm overflow-hidden">
              {filteredFriends.map((friend, i) => (
                <div
                  key={friend.id}
                  className={`flex items-center gap-4 px-4 py-4 ${
                    i !== filteredFriends.length - 1
                      ? "border-b border-[#E2E8E2]"
                      : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-[#E2E8F0] flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {friend.img ? (
                      <img
                        src={friend.img}
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserPlaceholderIcon />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-[#2D3A3A] truncate">
                      {friend.name}
                    </p>
                    <p className="text-xs text-[#6B7280]">{friend.status}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-0 hover:opacity-70 transition-opacity">
                      <MessageBubbleIcon />
                    </button>
                    <button className="p-2 rounded-lg bg-[#FEF2F2] hover:bg-red-100 transition-colors">
                      <RemoveFriendIcon />
                    </button>
                  </div>
                </div>
              ))}

              {filteredFriends.length === 0 && (
                <div className="py-12 text-center text-sm text-[#6B7280]">
                  Không tìm thấy bạn bè nào
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── Right Column ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Friend Suggestions */}
          <div className="rounded-2xl border border-[#E2E8E2] bg-white shadow-sm p-6 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-[#2D3A3A]">Gợi ý kết bạn</h2>
            <div className="flex flex-col gap-6">
              {suggestions.map((s) => (
                <SuggestionCard key={s.id} {...s} />
              ))}
            </div>
          </div>

          {/* Community Quote */}
          <div className="rounded-2xl border border-[#4A6741]/10 bg-[#F0F4F0] shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <QuoteIcon />
              <h3 className="text-sm font-bold text-[#4A6741]">
                Lời khuyên từ cộng đồng
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-xs font-medium italic text-[#2D3A3A] leading-[1.625]">
                "Những người bạn tốt cũng giống như tài khoản trong ngân hàng
                niềm tin.Bạn càng giữ được lâu thì càng giá trị."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#4A6741]/20 flex-shrink-0" />
                <span className="text-[10px] text-[#6B7280]">
                  — Thành viên từ 2021
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

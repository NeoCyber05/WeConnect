import { useState, useEffect, useRef } from "react";

type MessageType = "system" | "other" | "me";

interface Message {
  id: number;
  name: string;
  text: string;
  type: MessageType;
}

const WeConnectLogo = () => (
  <svg width="25" height="28" viewBox="0 0 30 28.75" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 28.75C6.45833 28.75 5.57292 28.3854 4.84375 27.6562C4.11458 26.9271 3.75 26.0417 3.75 25C3.75 23.9583 4.11458 23.0729 4.84375 22.3438C5.57292 21.6146 6.45833 21.25 7.5 21.25C7.79167 21.25 8.0625 21.2812 8.3125 21.3438C8.5625 21.4062 8.80208 21.4896 9.03125 21.5938L10.8125 19.375C10.2292 18.7292 9.82292 18 9.59375 17.1875C9.36458 16.375 9.3125 15.5625 9.4375 14.75L6.90625 13.9062C6.55208 14.4271 6.10417 14.8438 5.5625 15.1562C5.02083 15.4688 4.41667 15.625 3.75 15.625C2.70833 15.625 1.82292 15.2604 1.09375 14.5312C0.364583 13.8021 0 12.9167 0 11.875C0 10.8333 0.364583 9.94792 1.09375 9.21875C1.82292 8.48958 2.70833 8.125 3.75 8.125C4.79167 8.125 5.67708 8.48958 6.40625 9.21875C7.13542 9.94792 7.5 10.8333 7.5 11.875C7.5 11.9167 7.5 11.9583 7.5 12C7.5 12.0417 7.5 12.0833 7.5 12.125L10.0312 13C10.4479 12.25 11.0052 11.6146 11.7031 11.0938C12.401 10.5729 13.1875 10.2396 14.0625 10.0938V7.375C13.25 7.14583 12.5781 6.70312 12.0469 6.04688C11.5156 5.39062 11.25 4.625 11.25 3.75C11.25 2.70833 11.6146 1.82292 12.3438 1.09375C13.0729 0.364583 13.9583 0 15 0C16.0417 0 16.9271 0.364583 17.6562 1.09375C18.3854 1.82292 18.75 2.70833 18.75 3.75C18.75 4.625 18.4792 5.39062 17.9375 6.04688C17.3958 6.70312 16.7292 7.14583 15.9375 7.375V10.0938C16.8125 10.2396 17.599 10.5729 18.2969 11.0938C18.9948 11.6146 19.5521 12.25 19.9688 13L22.5 12.125C22.5 12.0833 22.5 12.0417 22.5 12C22.5 11.9583 22.5 11.9167 22.5 11.875C22.5 10.8333 22.8646 9.94792 23.5938 9.21875C24.3229 8.48958 25.2083 8.125 26.25 8.125C27.2917 8.125 28.1771 8.48958 28.9062 9.21875C29.6354 9.94792 30 10.8333 30 11.875C30 12.9167 29.6354 13.8021 28.9062 14.5312C28.1771 15.2604 27.2917 15.625 26.25 15.625C25.5833 15.625 24.974 15.4688 24.4219 15.1562C23.8698 14.8438 23.4271 14.4271 23.0938 13.9062L20.5625 14.75C20.6875 15.5625 20.6354 16.3698 20.4062 17.1719C20.1771 17.974 19.7708 18.7083 19.1875 19.375L20.9688 21.5625C21.1979 21.4583 21.4375 21.3802 21.6875 21.3281C21.9375 21.276 22.2083 21.25 22.5 21.25C23.5417 21.25 24.4271 21.6146 25.1562 22.3438C25.8854 23.0729 26.25 23.9583 26.25 25C26.25 26.0417 25.8854 26.9271 25.1562 27.6562C24.4271 28.3854 23.5417 28.75 22.5 28.75C21.4583 28.75 20.5729 28.3854 19.8438 27.6562C19.1146 26.9271 18.75 26.0417 18.75 25C18.75 24.5833 18.8177 24.1823 18.9531 23.7969C19.0885 23.4115 19.2708 23.0625 19.5 22.75L17.7188 20.5312C16.8646 21.0104 15.9531 21.25 14.9844 21.25C14.0156 21.25 13.1042 21.0104 12.25 20.5312L10.5 22.75C10.7292 23.0625 10.9115 23.4115 11.0469 23.7969C11.1823 24.1823 11.25 24.5833 11.25 25C11.25 26.0417 10.8854 26.9271 10.1562 27.6562C9.42708 28.3854 8.54167 28.75 7.5 28.75ZM3.75 13.125C4.10417 13.125 4.40104 13.0052 4.64062 12.7656C4.88021 12.526 5 12.2292 5 11.875C5 11.5208 4.88021 11.224 4.64062 10.9844C4.40104 10.7448 4.10417 10.625 3.75 10.625C3.39583 10.625 3.09896 10.7448 2.85938 10.9844C2.61979 11.224 2.5 11.5208 2.5 11.875C2.5 12.2292 2.61979 12.526 2.85938 12.7656C3.09896 13.0052 3.39583 13.125 3.75 13.125ZM7.5 26.25C7.85417 26.25 8.15104 26.1302 8.39062 25.8906C8.63021 25.651 8.75 25.3542 8.75 25C8.75 24.6458 8.63021 24.349 8.39062 24.1094C8.15104 23.8698 7.85417 23.75 7.5 23.75C7.14583 23.75 6.84896 23.8698 6.60938 24.1094C6.36979 24.349 6.25 24.6458 6.25 25C6.25 25.3542 6.36979 25.651 6.60938 25.8906C6.84896 26.1302 7.14583 26.25 7.5 26.25ZM15 5C15.3542 5 15.651 4.88021 15.8906 4.64062C16.1302 4.40104 16.25 4.10417 16.25 3.75C16.25 3.39583 16.1302 3.09896 15.8906 2.85938C15.651 2.61979 15.3542 2.5 15 2.5C14.6458 2.5 14.349 2.61979 14.1094 2.85938C13.8698 3.09896 13.75 3.39583 13.75 3.75C13.75 4.10417 13.8698 4.40104 14.1094 4.64062C14.349 4.88021 14.6458 5 15 5ZM15 18.75C15.875 18.75 16.6146 18.4479 17.2188 17.8438C17.8229 17.2396 18.125 16.5 18.125 15.625C18.125 14.75 17.8229 14.0104 17.2188 13.4062C16.6146 12.8021 15.875 12.5 15 12.5C14.125 12.5 13.3854 12.8021 12.7812 13.4062C12.1771 14.0104 11.875 14.75 11.875 15.625C11.875 16.5 12.1771 17.2396 12.7812 17.8438C13.3854 18.4479 14.125 18.75 15 18.75ZM22.5 26.25C22.8542 26.25 23.151 26.1302 23.3906 25.8906C23.6302 25.651 23.75 25.3542 23.75 25C23.75 24.6458 23.6302 24.349 23.3906 24.1094C23.151 23.8698 22.8542 23.75 22.5 23.75C22.1458 23.75 21.849 23.8698 21.6094 24.1094C21.3698 24.349 21.25 24.6458 21.25 25C21.25 25.3542 21.3698 25.651 21.6094 25.8906C21.849 26.1302 22.1458 26.25 22.5 26.25ZM26.25 13.125C26.6042 13.125 26.901 13.0052 27.1406 12.7656C27.3802 12.526 27.5 12.2292 27.5 11.875C27.5 11.5208 27.3802 11.224 27.1406 10.9844C26.901 10.7448 26.6042 10.625 26.25 10.625C25.8958 10.625 25.599 10.7448 25.3594 10.9844C25.1198 11.224 25 11.5208 25 11.875C25 12.2292 25.1198 12.526 25.3594 12.7656C25.599 13.0052 25.8958 13.125 26.25 13.125Z" fill="#4EDEA3"/>
  </svg>
);

const GameControllerIcon = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.535 14C1.685 14 1.02667 13.7042 0.56 13.1125C0.0933333 12.5208 -0.0816667 11.8 0.035 10.95L1.085 3.45C1.235 2.45 1.68083 1.625 2.4225 0.975C3.16417 0.325 4.035 0 5.035 0H14.935C15.935 0 16.8058 0.325 17.5475 0.975C18.2892 1.625 18.735 2.45 18.885 3.45L19.935 10.95C20.0517 11.8 19.8767 12.5208 19.41 13.1125C18.9433 13.7042 18.285 14 17.435 14C17.085 14 16.76 13.9375 16.46 13.8125C16.16 13.6875 15.885 13.5 15.635 13.25L13.385 11H6.585L4.335 13.25C4.085 13.5 3.81 13.6875 3.51 13.8125C3.21 13.9375 2.885 14 2.535 14ZM2.935 11.85L5.785 9H14.185L17.035 11.85C17.0683 11.8833 17.2017 11.9333 17.435 12C17.6183 12 17.7642 11.9458 17.8725 11.8375C17.9808 11.7292 18.0183 11.5833 17.985 11.4L16.885 3.7C16.8183 3.21667 16.6017 2.8125 16.235 2.4875C15.8683 2.1625 15.435 2 14.935 2H5.035C4.535 2 4.10167 2.1625 3.735 2.4875C3.36833 2.8125 3.15167 3.21667 3.085 3.7L1.985 11.4C1.95167 11.5833 1.98917 11.7292 2.0975 11.8375C2.20583 11.9458 2.35167 12 2.535 12C2.56833 12 2.70167 11.95 2.935 11.85ZM14.985 8C15.2683 8 15.5058 7.90417 15.6975 7.7125C15.8892 7.52083 15.985 7.28333 15.985 7C15.985 6.71667 15.8892 6.47917 15.6975 6.2875C15.5058 6.09583 15.2683 6 14.985 6C14.7017 6 14.4642 6.09583 14.2725 6.2875C14.0808 6.47917 13.985 6.71667 13.985 7C13.985 7.28333 14.0808 7.52083 14.2725 7.7125C14.4642 7.90417 14.7017 8 14.985 8ZM12.985 5C13.2683 5 13.5058 4.90417 13.6975 4.7125C13.8892 4.52083 13.985 4.28333 13.985 4C13.985 3.71667 13.8892 3.47917 13.6975 3.2875C13.5058 3.09583 13.2683 3 12.985 3C12.7017 3 12.4642 3.09583 12.2725 3.2875C12.0808 3.47917 11.985 3.71667 11.985 4C11.985 4.28333 12.0808 4.52083 12.2725 4.7125C12.4642 4.90417 12.7017 5 12.985 5ZM5.735 8H7.235V6.25H8.985V4.75H7.235V3H5.735V4.75H3.985V6.25H5.735V8Z" fill="#4A6741"/>
  </svg>
);

const LeaveIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.16667 10.5C0.845833 10.5 0.571181 10.3858 0.342708 10.1573C0.114236 9.92882 0 9.65417 0 9.33333V1.16667C0 0.845833 0.114236 0.571181 0.342708 0.342708C0.571181 0.114236 0.845833 0 1.16667 0H5.25V1.16667H1.16667V9.33333H5.25V10.5H1.16667ZM7.58333 8.16667L6.78125 7.32083L8.26875 5.83333H3.5V4.66667H8.26875L6.78125 3.17917L7.58333 2.33333L10.5 5.25L7.58333 8.16667Z" fill="#DC2626"/>
  </svg>
);

const TimerIcon = () => (
  <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 9H6V7.5C6 6.95 5.80417 6.47917 5.4125 6.0875C5.02083 5.69583 4.55 5.5 4 5.5C3.45 5.5 2.97917 5.69583 2.5875 6.0875C2.19583 6.47917 2 6.95 2 7.5V9ZM0 10V9H1V7.5C1 6.99167 1.11875 6.51458 1.35625 6.06875C1.59375 5.62292 1.925 5.26667 2.35 5C1.925 4.73333 1.59375 4.37708 1.35625 3.93125C1.11875 3.48542 1 3.00833 1 2.5V1H0V0H8V1H7V2.5C7 3.00833 6.88125 3.48542 6.64375 3.93125C6.40625 4.37708 6.075 4.73333 5.65 5C6.075 5.26667 6.40625 5.62292 6.64375 6.06875C6.88125 6.51458 7 6.99167 7 7.5V9H8V10H0Z" fill="white"/>
  </svg>
);

const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.425 7.4125L5 6.4625L6.575 7.425L6.1625 5.625L7.55 4.425L5.725 4.2625L5 2.5625L4.275 4.25L2.45 4.4125L3.8375 5.625L3.425 7.4125ZM1.9125 9.5L2.725 5.9875L0 3.625L3.6 3.3125L5 0L6.4 3.3125L10 3.625L7.275 5.9875L8.0875 9.5L5 7.6375L1.9125 9.5Z" fill="#4A6741"/>
  </svg>
);

const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z" fill="#4F46E5"/>
  </svg>
);

const InviteIcon = () => (
  <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.91667 5.83333V4.08333H8.16667V2.91667H9.91667V1.16667H11.0833V2.91667H12.8333V4.08333H11.0833V5.83333H9.91667ZM4.66667 4.66667C4.025 4.66667 3.47569 4.43819 3.01875 3.98125C2.56181 3.52431 2.33333 2.975 2.33333 2.33333C2.33333 1.69167 2.56181 1.14236 3.01875 0.685417C3.47569 0.228472 4.025 0 4.66667 0C5.30833 0 5.85764 0.228472 6.31458 0.685417C6.77153 1.14236 7 1.69167 7 2.33333C7 2.975 6.77153 3.52431 6.31458 3.98125C5.85764 4.43819 5.30833 4.66667 4.66667 4.66667ZM0 9.33333V7.7C0 7.36944 0.0850694 7.06563 0.255208 6.78854C0.425347 6.51146 0.651389 6.3 0.933333 6.15417C1.53611 5.85278 2.14861 5.62674 2.77083 5.47604C3.39306 5.32535 4.025 5.25 4.66667 5.25C5.30833 5.25 5.94028 5.32535 6.5625 5.47604C7.18472 5.62674 7.79722 5.85278 8.4 6.15417C8.68194 6.3 8.90799 6.51146 9.07812 6.78854C9.24826 7.06563 9.33333 7.36944 9.33333 7.7V9.33333H0ZM1.16667 8.16667H8.16667V7.7C8.16667 7.59306 8.13993 7.49583 8.08646 7.40833C8.03299 7.32083 7.9625 7.25278 7.875 7.20417C7.35 6.94167 6.82014 6.74479 6.28542 6.61354C5.75069 6.48229 5.21111 6.41667 4.66667 6.41667C4.12222 6.41667 3.58264 6.48229 3.04792 6.61354C2.51319 6.74479 1.98333 6.94167 1.45833 7.20417C1.37083 7.25278 1.30035 7.32083 1.24688 7.40833C1.1934 7.49583 1.16667 7.59306 1.16667 7.7V8.16667ZM4.66667 3.5C4.9875 3.5 5.26215 3.38576 5.49062 3.15729C5.7191 2.92882 5.83333 2.65417 5.83333 2.33333C5.83333 2.0125 5.7191 1.73785 5.49062 1.50937C5.26215 1.2809 4.9875 1.16667 4.66667 1.16667C4.34583 1.16667 4.07118 1.2809 3.84271 1.50937C3.61424 1.73785 3.5 2.0125 3.5 2.33333C3.5 2.65417 3.61424 2.92882 3.84271 3.15729C4.07118 3.38576 4.34583 3.5 4.66667 3.5Z" fill="#6B7280"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6667 16.6667L13.3333 13.3333H5C4.54167 13.3333 4.14931 13.1701 3.82292 12.8438C3.49653 12.5174 3.33333 12.125 3.33333 11.6667V10.8333H12.5C12.9583 10.8333 13.3507 10.6701 13.6771 10.3438C14.0035 10.0174 14.1667 9.625 14.1667 9.16667V3.33333H15C15.4583 3.33333 15.8507 3.49653 16.1771 3.82292C16.5035 4.14931 16.6667 4.54167 16.6667 5V16.6667ZM1.66667 8.47917L2.64583 7.5H10.8333V1.66667H1.66667V8.47917ZM0 12.5V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H10.8333C11.2917 0 11.684 0.163194 12.0104 0.489583C12.3368 0.815972 12.5 1.20833 12.5 1.66667V7.5C12.5 7.95833 12.3368 8.35069 12.0104 8.67708C11.684 9.00347 11.2917 9.16667 10.8333 9.16667H3.33333L0 12.5ZM1.66667 7.5V1.66667V7.5Z" fill="#6B7280"/>
  </svg>
);

const BellIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 9.91667V8.75H1.16667V4.66667C1.16667 3.85972 1.40972 3.14271 1.89583 2.51562C2.38194 1.88854 3.01389 1.47778 3.79167 1.28333V0.875C3.79167 0.631944 3.87674 0.425347 4.04688 0.255208C4.21701 0.0850694 4.42361 0 4.66667 0C4.90972 0 5.11632 0.0850694 5.28646 0.255208C5.4566 0.425347 5.54167 0.631944 5.54167 0.875V1.28333C6.31944 1.47778 6.95139 1.88854 7.4375 2.51562C7.92361 3.14271 8.16667 3.85972 8.16667 4.66667V8.75H9.33333V9.91667H0ZM4.66667 11.6667C4.34583 11.6667 4.07118 11.5524 3.84271 11.324C3.61424 11.0955 3.5 10.8208 3.5 10.5H5.83333C5.83333 10.8208 5.7191 11.0955 5.49062 11.324C5.26215 11.5524 4.9875 11.6667 4.66667 11.6667ZM2.33333 8.75H7V4.66667C7 4.025 6.77153 3.47569 6.31458 3.01875C5.85764 2.56181 5.30833 2.33333 4.66667 2.33333C4.025 2.33333 3.47569 2.56181 3.01875 3.01875C2.56181 3.47569 2.33333 4.025 2.33333 4.66667V8.75Z" fill="#4A6741"/>
  </svg>
);

const SmallPersonIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.66667 4.66667C4.025 4.66667 3.47569 4.43819 3.01875 3.98125C2.56181 3.52431 2.33333 2.975 2.33333 2.33333C2.33333 1.69167 2.56181 1.14236 3.01875 0.685417C3.47569 0.228472 4.025 0 4.66667 0C5.30833 0 5.85764 0.228472 6.31458 0.685417C6.77153 1.14236 7 1.69167 7 2.33333C7 2.975 6.77153 3.52431 6.31458 3.98125C5.85764 4.43819 5.30833 4.66667 4.66667 4.66667ZM0 9.33333V7.7C0 7.36944 0.0850694 7.06563 0.255208 6.78854C0.425347 6.51146 0.651389 6.3 0.933333 6.15417C1.53611 5.85278 2.14861 5.62674 2.77083 5.47604C3.39306 5.32535 4.025 5.25 4.66667 5.25C5.30833 5.25 5.94028 5.32535 6.5625 5.47604C7.18472 5.62674 7.79722 5.85278 8.4 6.15417C8.68194 6.3 8.90799 6.51146 9.07812 6.78854C9.24826 7.06563 9.33333 7.36944 9.33333 7.7V9.33333H0ZM1.16667 8.16667H8.16667V7.7C8.16667 7.59306 8.13993 7.49583 8.08646 7.40833C8.03299 7.32083 7.9625 7.25278 7.875 7.20417C7.35 6.94167 6.82014 6.74479 6.28542 6.61354C5.75069 6.48229 5.21111 6.41667 4.66667 6.41667C4.12222 6.41667 3.58264 6.48229 3.04792 6.61354C2.51319 6.74479 1.98333 6.94167 1.45833 7.20417C1.37083 7.25278 1.30035 7.32083 1.24688 7.40833C1.1934 7.49583 1.16667 7.59306 1.16667 7.7V8.16667ZM4.66667 3.5C4.9875 3.5 5.26215 3.38576 5.49062 3.15729C5.7191 2.92882 5.83333 2.65417 5.83333 2.33333C5.83333 2.0125 5.7191 1.73785 5.49062 1.50937C5.26215 1.2809 4.9875 1.16667 4.66667 1.16667C4.34583 1.16667 4.07118 1.2809 3.84271 1.50937C3.61424 1.73785 3.5 2.0125 3.5 2.33333C3.5 2.65417 3.61424 2.92882 3.84271 3.15729C4.07118 3.38576 4.34583 3.5 4.66667 3.5Z" fill="#4F46E5"/>
  </svg>
);

const EmojiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 9C13.9167 9 14.2708 8.85417 14.5625 8.5625C14.8542 8.27083 15 7.91667 15 7.5C15 7.08333 14.8542 6.72917 14.5625 6.4375C14.2708 6.14583 13.9167 6 13.5 6C13.0833 6 12.7292 6.14583 12.4375 6.4375C12.1458 6.72917 12 7.08333 12 7.5C12 7.91667 12.1458 8.27083 12.4375 8.5625C12.7292 8.85417 13.0833 9 13.5 9ZM6.5 9C6.91667 9 7.27083 8.85417 7.5625 8.5625C7.85417 8.27083 8 7.91667 8 7.5C8 7.08333 7.85417 6.72917 7.5625 6.4375C7.27083 6.14583 6.91667 6 6.5 6C6.08333 6 5.72917 6.14583 5.4375 6.4375C5.14583 6.72917 5 7.08333 5 7.5C5 7.91667 5.14583 8.27083 5.4375 8.5625C5.72917 8.85417 6.08333 9 6.5 9ZM10 15.5C11.1333 15.5 12.1625 15.1792 13.0875 14.5375C14.0125 13.8958 14.6833 13.05 15.1 12H13.45C13.0833 12.6167 12.5958 13.1042 11.9875 13.4625C11.3792 13.8208 10.7167 14 10 14C9.28333 14 8.62083 13.8208 8.0125 13.4625C7.40417 13.1042 6.91667 12.6167 6.55 12H4.9C5.31667 13.05 5.9875 13.8958 6.9125 14.5375C7.8375 15.1792 8.86667 15.5 10 15.5ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#6B7280"/>
  </svg>
);

const SendIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 9.33333V0L11.0833 4.66667L0 9.33333ZM1.16667 7.58333L8.07917 4.66667L1.16667 1.75V3.79167L4.66667 4.66667L1.16667 5.54167V7.58333ZM1.16667 7.58333V4.66667V1.75V3.79167V5.54167V7.58333Z" fill="white"/>
  </svg>
);

export default function Index() {
  const [time, setTime] = useState(585); // 09:45 in seconds
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      name: "Hệ thống",
      text: "Phòng game đã sẵn sàng. Chúc người chơi có những giây phút thư giãn!",
      type: "system",
    },
    {
      id: 2,
      name: "Hoàng Anh",
      text: "Mọi người đã sẵn sàng chưa? Trận này sẽ gay cấn lắm đây!",
      type: "other",
    },
    {
      id: 3,
      name: "Bạn (Lê Minh)",
      text: "Bắt đầu luôn thôi nào! Đang rất hào hứng đây.",
      type: "me",
    },
  ]);
  const [newMessageCount, setNewMessageCount] = useState(3);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "Bạn (Lê Minh)",
        text: message.trim(),
        type: "me",
      },
    ]);
    setMessage("");
    setNewMessageCount(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "#F3F4F6", fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif" }}
    >
      {/* ── Header ── */}
      <header
        className="flex-shrink-0 px-4 md:px-6"
        style={{ background: "#FFF", borderBottom: "1px solid #E2E8E2", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
      >
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo + Room Info */}
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            {/* Brand */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <WeConnectLogo />
              <span
                className="text-[18px] leading-7 tracking-[-0.45px]"
                style={{ color: "#2D3A3A", fontWeight: 800 }}
              >
                WeConnect
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6" style={{ background: "#E2E8E2" }} />

            {/* Room */}
            <div className="hidden sm:flex items-center gap-2">
              <GameControllerIcon />
              <span className="text-[14px] font-semibold leading-5" style={{ color: "#2D3A3A" }}>
                Phòng game giải trí
              </span>
              <span className="text-[14px] leading-5" style={{ color: "#6B7280" }}>
                #ROOM-2034
              </span>
            </div>
          </div>

          {/* Right: Status + Leave */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            {/* Status badge */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full"
              style={{ border: "1px solid rgba(74,103,65,0.20)", background: "#F1F5F0" }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: "#22C55E" }} />
              <span
                className="text-[11px] font-bold tracking-[0.55px] uppercase"
                style={{ color: "#4A6741" }}
              >
                Trận đấu đang diễn ra
              </span>
            </div>

            {/* Leave button */}
            <button
              className="flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ border: "1px solid #FEE2E2", background: "#FEF2F2" }}
            >
              <LeaveIcon />
              <span className="text-[12px] font-bold" style={{ color: "#DC2626" }}>
                Rời phòng
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">

        {/* ── Sidebar ── */}
        <aside
          className="flex-shrink-0 w-full md:w-80 flex flex-col overflow-hidden"
          style={{ background: "#FFF", borderRight: "1px solid #E2E8E2" }}
        >
          {/* Timer section */}
          <div
            className="flex flex-col items-center gap-3 p-6"
            style={{ borderBottom: "1px solid #E2E8E2", background: "rgba(248,250,252,0.50)" }}
          >
            <span
              className="text-[10px] font-bold tracking-[2px] uppercase"
              style={{ color: "#6B7280" }}
            >
              Thời gian trận đấu
            </span>
            <div
              className="flex flex-col items-center justify-center gap-2 w-full rounded-2xl p-4"
              style={{ background: "#2D3A3A", boxShadow: "0 2px 4px 0 rgba(0,0,0,0.05) inset" }}
            >
              <span
                className="text-[36px] leading-10 tracking-[3.6px]"
                style={{ color: "#FFF", fontWeight: 900 }}
              >
                {formatTime(time)}
              </span>
              <div className="flex items-center gap-1 opacity-60">
                <TimerIcon />
                <span
                  className="text-[10px] font-bold uppercase"
                  style={{ color: "#FFF" }}
                >
                  Tổng cộng
                </span>
              </div>
            </div>
          </div>

          {/* Players section */}
          <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
            <span
              className="text-[10px] font-bold tracking-[1px] uppercase"
              style={{ color: "#6B7280" }}
            >
              Người tham gia (2/4)
            </span>

            {/* Player 1 - Me */}
            <div
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ border: "1px solid rgba(74,103,65,0.20)", background: "#F1F5F0" }}
            >
              <div className="relative flex-shrink-0">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/08734dc7e6f32576640b5b297b7cb45eae53c6fa?width=96"
                  alt="Lê Minh"
                  className="w-12 h-12 rounded-2xl"
                  style={{ boxShadow: "0 0 0 2px #FFF, 0 1px 2px 0 rgba(0,0,0,0.05)" }}
                />
                {/* Star badge */}
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full"
                  style={{ border: "1px solid #E2E8E2", background: "#FFF" }}
                >
                  <StarIcon />
                </div>
                {/* Online dot */}
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full"
                  style={{ border: "2px solid #FFF", background: "#22C55E" }}
                />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[14px] font-bold leading-5 truncate" style={{ color: "#2D3A3A" }}>
                  Bạn (Lê Minh)
                </span>
                <span
                  className="text-[10px] font-semibold tracking-[0.25px] uppercase"
                  style={{ color: "#4A6741" }}
                >
                  Trạng thái: Sẵn sàng
                </span>
              </div>
            </div>

            {/* Player 2 - Hoàng Anh */}
            <div
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ border: "1px solid #E2E8E2", background: "#F8FAFC" }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-2xl"
                  style={{ background: "#E0E7FF", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
                >
                  <PersonIcon />
                </div>
                {/* Online dot */}
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full"
                  style={{ border: "2px solid #FFF", background: "#22C55E" }}
                />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[14px] font-bold leading-5 truncate" style={{ color: "#2D3A3A" }}>
                  Hoàng Anh
                </span>
                <span
                  className="text-[10px] font-semibold tracking-[0.25px] uppercase"
                  style={{ color: "#6B7280" }}
                >
                  Trạng thái: Đang chờ
                </span>
              </div>
            </div>

            {/* Invite button */}
            <button
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl transition-colors hover:bg-gray-50"
              style={{ border: "2px dashed #E2E8E2" }}
            >
              <InviteIcon />
              <span className="text-[12px] font-bold" style={{ color: "#6B7280" }}>
                Mời bạn bè
              </span>
            </button>
          </div>

          {/* Bottom actions */}
          <div
            className="flex gap-2 p-4"
            style={{ borderTop: "1px solid #E2E8E2" }}
          >
            <button
              className="flex-1 py-2 rounded-lg text-[12px] font-bold transition-colors hover:bg-slate-200"
              style={{ background: "#F1F5F9", color: "#2D3A3A" }}
            >
              Dừng trận
            </button>
            <button
              className="flex-1 py-2 rounded-lg text-[12px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "#4A6741" }}
            >
              Sẵn sàng
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Game Board */}
          <div
            className="flex-1 flex items-center justify-center overflow-hidden"
            style={{ background: "#F1F5F9" }}
          >
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: "radial-gradient(70.71% 70.71% at 50% 50%, #E5E7EB 3.54%, rgba(229,231,235,0.00) 3.54%)",
              }}
            >
              {/* Decorative game element */}
              <div
                className="w-16 h-10 rounded-full opacity-60"
                style={{ background: "#D1D5DB" }}
              />
            </div>
          </div>

          {/* ── Chat Panel ── */}
          <div
            className="flex-shrink-0 flex flex-col"
            style={{ height: "256px", borderTop: "1px solid #E2E8E2", background: "#FFF" }}
          >
            {/* Chat header */}
            <div
              className="flex items-center justify-between px-6 py-3 flex-shrink-0"
              style={{ borderBottom: "1px solid #E2E8E2", background: "rgba(248,250,252,0.80)" }}
            >
              <div className="flex items-center gap-3">
                <ChatIcon />
                <span
                  className="text-[12px] font-bold tracking-[1.2px] uppercase"
                  style={{ color: "#2D3A3A" }}
                >
                  Phòng chờ &amp; Phản hồi
                </span>
                {newMessageCount > 0 && (
                  <div
                    className="px-2 py-0.5 rounded-full"
                    style={{ background: "#F1F5F0" }}
                  >
                    <span className="text-[10px] font-bold" style={{ color: "#4A6741" }}>
                      {newMessageCount} tin nhắn mới
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4"
            >
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.type === "system" && (
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ background: "rgba(74,103,65,0.10)" }}
                      >
                        <BellIcon />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[11px] font-bold leading-[16.5px]" style={{ color: "#4A6741" }}>
                          Hệ thống
                        </span>
                        <div
                          className="px-2 py-2 rounded-tr-lg rounded-br-lg rounded-bl-lg"
                          style={{ background: "rgba(241,245,240,0.50)" }}
                        >
                          <p className="text-[12px] leading-[18px]" style={{ color: "#2D3A3A" }}>
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.type === "other" && (
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ background: "#E0E7FF" }}
                      >
                        <SmallPersonIcon />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[11px] font-bold leading-[16.5px]" style={{ color: "#2D3A3A" }}>
                          {msg.name}
                        </span>
                        <div
                          className="px-2 py-2 rounded-tr-lg rounded-br-lg rounded-bl-lg"
                          style={{ background: "#F1F5F9" }}
                        >
                          <p className="text-[12px] leading-[18px]" style={{ color: "#2D3A3A" }}>
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.type === "me" && (
                    <div className="flex items-start gap-3 justify-end">
                      <div className="flex flex-col items-end gap-1 min-w-0">
                        <span className="text-[11px] font-bold leading-[16.5px]" style={{ color: "#2D3A3A" }}>
                          {msg.name}
                        </span>
                        <div
                          className="px-2 py-2 rounded-tl-lg rounded-br-lg rounded-bl-lg"
                          style={{ background: "#4A6741" }}
                        >
                          <p className="text-[12px] leading-[18px]" style={{ color: "#FFF" }}>
                            {msg.text}
                          </p>
                        </div>
                      </div>
                      <div
                        className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ background: "#0F172A" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.08333 7.14583C3.87917 7.14583 3.7066 7.07535 3.56562 6.93437C3.42465 6.7934 3.35417 6.62083 3.35417 6.41667C3.35417 6.2125 3.42465 6.03993 3.56562 5.89896C3.7066 5.75799 3.87917 5.6875 4.08333 5.6875C4.2875 5.6875 4.46007 5.75799 4.60104 5.89896C4.74201 6.03993 4.8125 6.2125 4.8125 6.41667C4.8125 6.62083 4.74201 6.7934 4.60104 6.93437C4.46007 7.07535 4.2875 7.14583 4.08333 7.14583ZM7.58333 7.14583C7.37917 7.14583 7.2066 7.07535 7.06563 6.93437C6.92465 6.7934 6.85417 6.62083 6.85417 6.41667C6.85417 6.2125 6.92465 6.03993 7.06563 5.89896C7.2066 5.75799 7.37917 5.6875 7.58333 5.6875C7.7875 5.6875 7.96007 5.75799 8.10104 5.89896C8.24201 6.03993 8.3125 6.2125 8.3125 6.41667C8.3125 6.62083 8.24201 6.7934 8.10104 6.93437C7.96007 7.07535 7.7875 7.14583 7.58333 7.14583ZM5.83333 10.5C7.13611 10.5 8.23958 10.0479 9.14375 9.14375C10.0479 8.23958 10.5 7.13611 10.5 5.83333C10.5 5.6 10.4854 5.37396 10.4563 5.15521C10.4271 4.93646 10.3736 4.725 10.2958 4.52083C10.0917 4.56944 9.8875 4.6059 9.68333 4.63021C9.47917 4.65451 9.26528 4.66667 9.04167 4.66667C8.15694 4.66667 7.32083 4.47708 6.53333 4.09792C5.74583 3.71875 5.075 3.18889 4.52083 2.50833C4.20972 3.26667 3.76493 3.92535 3.18646 4.48438C2.60799 5.0434 1.93472 5.46389 1.16667 5.74583C1.16667 5.76528 1.16667 5.77986 1.16667 5.78958C1.16667 5.79931 1.16667 5.81389 1.16667 5.83333C1.16667 7.13611 1.61875 8.23958 2.52292 9.14375C3.42708 10.0479 4.53056 10.5 5.83333 10.5ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667ZM5.04583 1.23958C5.45417 1.92014 6.00833 2.46701 6.70833 2.88021C7.40833 3.2934 8.18611 3.5 9.04167 3.5C9.17778 3.5 9.30903 3.49271 9.43542 3.47813C9.5618 3.46354 9.69306 3.44653 9.82917 3.42708C9.42083 2.74653 8.86667 2.19965 8.16667 1.78646C7.46667 1.37326 6.68889 1.16667 5.83333 1.16667C5.69722 1.16667 5.56597 1.17396 5.43958 1.18854C5.31319 1.20312 5.18194 1.22014 5.04583 1.23958ZM1.41458 4.36042C1.91042 4.07847 2.34306 3.71389 2.7125 3.26667C3.08194 2.81944 3.35903 2.31875 3.54375 1.76458C3.04792 2.04653 2.61528 2.41111 2.24583 2.85833C1.87639 3.30556 1.59931 3.80625 1.41458 4.36042Z" fill="white"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div
              className="flex items-center gap-4 px-4 py-4 flex-shrink-0"
              style={{ borderTop: "1px solid #E2E8E2", background: "#FFF" }}
            >
              <div
                className="flex items-center gap-3 flex-1 px-4 py-2 rounded-2xl"
                style={{ border: "1px solid #E2E8E2", background: "#F8FAFC" }}
              >
                <EmojiIcon />
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tin nhắn trao đổi tại đây..."
                  className="flex-1 bg-transparent text-[14px] outline-none min-w-0"
                  style={{
                    color: "#2D3A3A",
                    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                />
              </div>
              <button
                onClick={handleSend}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-white transition-opacity hover:opacity-90 flex-shrink-0"
                style={{
                  background: "#4A6741",
                  boxShadow: "0 10px 15px -3px rgba(74,103,65,0.20), 0 4px 6px -4px rgba(74,103,65,0.20)",
                }}
              >
                <span className="text-[14px] font-bold">Gửi</span>
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

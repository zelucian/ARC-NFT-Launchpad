import React from "react";

export function MetaMaskIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28.8 3L17.7 11.2L19.8 6.1L28.8 3Z" fill="#E17726" />
      <path d="M3.2 3L12.1 6.2L14.2 11.2L3.2 3Z" fill="#E17726" />
      <path d="M24.8 22.8L21.8 27.4L28 29.1L29.7 22.9L24.8 22.8Z" fill="#E17726" />
      <path d="M2.3 22.9L4 29.1L10.2 27.4L7.2 22.8L2.3 22.9Z" fill="#E17726" />
      <path d="M9.9 14L7.8 17.1L14.9 17.5L14.6 9.8L9.9 14Z" fill="#E17726" />
      <path d="M22.1 14L17.3 9.8L17 17.5L24.1 17.1L22.1 14Z" fill="#E17726" />
      <path d="M10.2 27.4L13.8 25.6L10.7 23L7.2 22.8L10.2 27.4Z" fill="#E2761B" />
      <path d="M21.8 27.4L24.8 22.8L21.3 23L24.8 27.4Z" fill="#E2761B" />
      <path d="M28 29.1L21.8 27.4L23.4 29.8L28 29.1Z" fill="#E2761B" />
      <path d="M4 29.1L8.6 29.8L10.2 27.4L4 29.1Z" fill="#E2761B" />
      <path d="M8.6 29.8L13.6 27.3L13.8 25.6L10.2 27.4L8.6 29.8Z" fill="#D7C1B3" />
      <path d="M23.4 29.8L21.8 27.4L21.8 25.6L23.4 29.8Z" fill="#D7C1B3" />
      <path d="M13.6 27.3L13.7 22.4L10.7 23L13.8 25.6L13.6 27.3Z" fill="#233438" />
      <path d="M18.4 27.3L18.2 25.6L21.3 23L18.3 22.4L18.4 27.3Z" fill="#233438" />
      <path d="M3.2 3L9.7 14L7.8 17.1L2.3 22.9L3.2 3Z" fill="#F6851B" />
      <path d="M28.8 3L29.7 22.9L24.1 17.1L22.2 14L28.8 3Z" fill="#F6851B" />
      <path d="M14.9 17.5L9.9 14L14.6 9.8L14.8 4.2L17.2 4.2L17.3 9.8L22.1 14L17 17.5L16.4 21.2L15.6 21.2L14.9 17.5Z" fill="#F6851B" />
      <path d="M17 17.5L22.1 14L24.1 17.1L18.3 22.4L17 17.5Z" fill="#C0AD9E" />
      <path d="M14.9 17.5L13.7 22.4L7.8 17.1L9.9 14L14.9 17.5Z" fill="#C0AD9E" />
    </svg>
  );
}

export function CoinbaseIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#0052FF" />
      <path
        d="M16 6C10.4772 6 6 10.4772 6 16C6 21.5228 10.4772 26 16 26C21.5228 26 26 21.5228 26 16C26 10.4772 21.5228 6 16 6ZM12.5 19.5C11.6716 19.5 11 18.8284 11 18V14C11 13.1716 11.6716 12.5 12.5 12.5H19.5C20.3284 12.5 21 13.1716 21 14V18C21 18.8284 20.3284 19.5 19.5 19.5H12.5Z"
        fill="white"
      />
    </svg>
  );
}

export function RabbyIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#8697FF" />
      <path
        d="M23.5 13.8C23.5 9.5 19.8 6 15.3 6C10.7 6 7 9.5 7 13.8C7 16.6 8.5 19 10.8 20.4L9.5 24.5L14.2 22.8C14.6 22.9 14.9 22.9 15.3 22.9C19.8 22.9 23.5 19.4 23.5 13.8Z"
        fill="white"
      />
      <circle cx="12.5" cy="13.5" r="1.5" fill="#8697FF" />
      <circle cx="18.1" cy="13.5" r="1.5" fill="#8697FF" />
    </svg>
  );
}

export function BitgetIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#00F0FF" />
      <path
        d="M8.5 8.5H17.5C20.8137 8.5 23.5 11.1863 23.5 14.5C23.5 17.8137 20.8137 20.5 17.5 20.5H14.5V23.5H8.5V8.5ZM14.5 14.5H17.5C17.5 14.5 17.5 14.5 17.5 14.5C17.5 14.5 17.5 14.5 17.5 14.5H14.5V14.5Z"
        fill="#000000"
      />
    </svg>
  );
}

export function WalletConnectIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#3B99FC" />
      <path
        d="M10.1 12.2C13.4 9 18.6 9 21.9 12.2L22.6 12.9L20.4 15.1L19.9 14.6C17.7 12.4 14.3 12.4 12.1 14.6L11.5 15.1L9.4 12.9L10.1 12.2ZM24.4 14.6L26.5 16.7L21.9 21.3L18.8 18.2L19.4 17.6C20.8 16.2 23 16.2 24.4 17.6L24.4 14.6ZM7.6 14.6L12.2 19.2L13.2 18.2L12.6 17.6C11.2 16.2 9 16.2 7.6 17.6L5.5 15.5L7.6 14.6Z"
        fill="white"
      />
    </svg>
  );
}

export function OKXIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#000000" />
      <rect x="7" y="7" width="6" height="6" fill="white" />
      <rect x="19" y="7" width="6" height="6" fill="white" />
      <rect x="13" y="13" width="6" height="6" fill="white" />
      <rect x="7" y="19" width="6" height="6" fill="white" />
      <rect x="19" y="19" width="6" height="6" fill="white" />
    </svg>
  );
}

export function PhantomIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#AB9FF2" />
      <path
        d="M24 16C24 20.4 20.4 24 16 24C13.8 24 11.8 23.1 10.3 21.7L9.5 24H7V16C7 11.6 10.6 8 15 8C19.4 8 23 11.6 23 16V16Z"
        fill="white"
      />
      <circle cx="13" cy="14" r="1.5" fill="#AB9FF2" />
      <circle cx="18" cy="14" r="1.5" fill="#AB9FF2" />
    </svg>
  );
}

export function InjectedWalletIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="url(#injected_grad)" />
      <path
        d="M22 12H10C8.9 12 8 12.9 8 14V20C8 21.1 8.9 22 10 22H22C23.1 22 24 21.1 24 20V14C24 12.9 23.1 12 22 12ZM20 18C19.2 18 18.5 17.3 18.5 16.5C18.5 15.7 19.2 15 20 15C20.8 15 21.5 15.7 21.5 16.5C21.5 17.3 20.8 18 20 18Z"
        fill="white"
      />
      <defs>
        <linearGradient id="injected_grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

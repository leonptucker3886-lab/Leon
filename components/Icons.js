const PATHS = {
  today: (
    <>
      <path d="M6 20v-9.5a6 6 0 0 1 12 0V20" />
      <path d="M3.5 20h17" />
      <path d="M15 14.5v2" />
    </>
  ),
  studio: (
    <>
      <path d="M12 6.6C10 5.2 7.6 5 5.5 5.4v12c2.1-.4 4.5-.2 6.5 1.2 2-1.4 4.4-1.6 6.5-1.2v-12C16.4 5 14 5.2 12 6.6Z" />
      <path d="M12 6.6v12" />
    </>
  ),
  wheel: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="1.4" />
      <path d="M12 3.8v3M12 17.2v3M3.8 12h3M17.2 12h3" />
      <path d="M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.6" y="5.6" width="16.8" height="14.8" />
      <path d="M3.6 10.2h16.8M8 3.6v4M16 3.6v4" />
    </>
  ),
  notes: (
    <>
      <path d="M6 3.6h9l4 4v12.8H6z" />
      <path d="M15 3.6v4h4" />
      <path d="M9 12h6.5M9 15.4h6.5M9 8.6h3" />
    </>
  ),
  bounds: (
    <>
      <path d="M3.5 16.4h17" />
      <path d="M7.5 16.4V8.2M16.5 16.4V8.2" />
      <path d="M5.4 8.2h4.2M14.4 8.2h4.2" />
    </>
  ),
  chair: (
    <>
      <path d="M6.5 15.4h11" />
      <path d="M7.6 15.4V6.2A1.6 1.6 0 0 1 9.2 4.6h5.6a1.6 1.6 0 0 1 1.6 1.6v9.2" />
      <path d="M8.4 15.4V20M15.6 15.4V20" />
    </>
  ),
  arrowRight: <path d="M4 12h15M14 6.4l5.6 5.6L14 17.6" />,
  arrowLeft: <path d="M20 12H5M10 6.4L4.4 12 10 17.6" />,
  chevronLeft: <path d="M14.6 6.4 9 12l5.6 5.6" />,
  chevronRight: <path d="M9.4 6.4 15 12l-5.6 5.6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M4.8 12.6l4.7 4.8L19.2 6.2" />,
  lock: (
    <>
      <rect x="5.4" y="10.4" width="13.2" height="9.2" />
      <path d="M8.4 10.4V7.6a3.6 3.6 0 0 1 7.2 0v2.8" />
    </>
  ),
  spin: (
    <>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20.4 4.2v4.2h-4.2" />
    </>
  ),
  copy: (
    <>
      <rect x="8.4" y="8.4" width="11.2" height="11.2" />
      <path d="M15.6 8.4V4.4H4.4v11.2h4" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V4.6h5V7" />
      <path d="M6.6 7l.8 12.4h9.2L17.4 7" />
      <path d="M10.4 10.6v5.6M13.6 10.6v5.6" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="2" />,
};

export default function Icon({ name, size = 18, className = "", strokeWidth = 1.4 }) {
  const shape = PATHS[name];
  if (!shape) return null;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {shape}
    </svg>
  );
}

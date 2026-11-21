"use client";

import { useEffect } from "react";
import Icon from "./Icons";

export function Mark({ size = 34, className = "" }) {
  return (
    <span className={`mark ${className}`} style={{ fontSize: size }} aria-label="us.">
      us<span>.</span>
    </span>
  );
}

export function Eyebrow({ children, gold = false, className = "" }) {
  return <div className={`eyebrow${gold ? " gold" : ""} ${className}`}>{children}</div>;
}

export function Rule({ short = false }) {
  return <div className={short ? "rule-short" : "rule"} />;
}

export function Meter({ value = 0, color = "var(--gold)" }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="meter" role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100}>
      <div className="meter-fill" style={{ width: `${v}%`, background: color }} />
    </div>
  );
}

export function Plate({
  src,
  alt,
  meta,
  title,
  deck,
  mark,
  done = false,
  onClick,
  wide = false,
  children,
  style,
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      className={`plate${wide ? " plate-wide" : ""}`}
      onClick={onClick}
      type={onClick ? "button" : undefined}
      aria-label={onClick ? title : undefined}
      style={style}
    >
      <div className="plate-art">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt || ""} loading="lazy" decoding="async" />
        <div className="plate-scrim" />
        {mark && <span className="plate-mark">{mark}</span>}
        {done && <span className="plate-done">Completed</span>}
        <div className="plate-copy">
          {meta && <div className="plate-meta">{meta}</div>}
          <div className="plate-title">{title}</div>
          {deck && <div className="plate-deck">{deck}</div>}
        </div>
        {children}
      </div>
    </Tag>
  );
}

export function Sheet({ title, onClose, children, eyebrow }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <div className="sheet-title" style={{ marginTop: eyebrow ? 7 : 0 }}>
              {title}
            </div>
          </div>
          <button className="x-btn" onClick={onClose} aria-label="Close" type="button">
            <Icon name="close" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ title, children }) {
  return (
    <div className="empty">
      <div className="display-sm">{title}</div>
      <p>{children}</p>
    </div>
  );
}

export function SavedLine({ children }) {
  return (
    <div className="saved-line">
      <Icon name="check" size={13} />
      <span>{children}</span>
    </div>
  );
}

export function Switch({ on, onChange, label }) {
  return (
    <button
      type="button"
      className={`switch${on ? " on" : ""}`}
      onClick={() => onChange(!on)}
      aria-pressed={on}
    >
      <span className="switch-track">
        <span className="switch-knob" />
      </span>
      {label}
    </button>
  );
}

export function Field({ label, children }) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export function Numeral({ children }) {
  return <span className="num">{children}</span>;
}

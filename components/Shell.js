"use client";

import { useEffect, useState } from "react";
import { Mark, Eyebrow, Sheet } from "./ui";
import Icon from "./Icons";
import { forgetSeat, clearSession, seatById } from "@/lib/store";
import SyncLine from "./SyncLine";

export const NAV = [
  { id: "today", numeral: "I", label: "Today", short: "Today", icon: "today" },
  { id: "studio", numeral: "II", label: "Studio", short: "Studio", icon: "studio" },
  { id: "wheel", numeral: "III", label: "Wheel", short: "Wheel", icon: "wheel" },
  { id: "calendar", numeral: "IV", label: "Calendar", short: "Dates", icon: "calendar" },
  { id: "notes", numeral: "V", label: "Notes", short: "Notes", icon: "notes" },
  { id: "bounds", numeral: "VI", label: "Boundaries", short: "Lines", icon: "bounds" },
  { id: "chair", numeral: "VII", label: "Third Chair", short: "Chair", icon: "chair" },
];

function RoomSheet({ room, seat, onClose, onLeave }) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Sheet title="The room" eyebrow="Two seats" onClose={onClose}>
      <div className="code-display" aria-label={`Room code ${room.code}`}>
        {room.code}
      </div>
      <div className="btn-row" style={{ marginBottom: 22 }}>
        <button className="btn btn-sm" onClick={copy} type="button">
          <Icon name="copy" size={13} />
          {copied ? "Copied" : "Copy code"}
        </button>
        <span className="eyebrow" style={{ lineHeight: 1.6 }}>
          {room.seats.length < 2 ? "One seat still open" : "Both seats taken"}
        </span>
      </div>

      <Eyebrow>Seated</Eyebrow>
      <div style={{ marginBottom: 20 }}>
        {room.seats.map((s) => (
          <div className="seat-line" key={s.id}>
            <span>{s.name}</span>
            {s.id === seat.seatId && <span className="you">You</span>}
          </div>
        ))}
        {room.seats.length < 2 && (
          <div className="seat-line" style={{ color: "rgba(139,131,120,.7)" }}>
            <span>The second chair</span>
            <span className="you" style={{ color: "rgba(139,131,120,.7)" }}>
              Empty
            </span>
          </div>
        )}
      </div>

      <p className="lede" style={{ fontSize: 12, marginBottom: 10 }}>
        Everything you write belongs to this code, and to the two of you. There
        is no account and no directory; the code is the key.
      </p>
      <SyncLine className="room-sync" />

      {!confirming ? (
        <button
          className="btn btn-quiet btn-sm"
          style={{ paddingLeft: 0 }}
          onClick={() => setConfirming(true)}
          type="button"
        >
          Leave this seat
        </button>
      ) : (
        <div className="btn-row">
          <button
            className="btn btn-sm"
            onClick={() => {
              forgetSeat(room.code, seat.seatId);
              clearSession();
              onLeave();
            }}
            type="button"
          >
            Leave the room
          </button>
          <button className="btn btn-quiet btn-sm" onClick={() => setConfirming(false)} type="button">
            Stay
          </button>
        </div>
      )}
    </Sheet>
  );
}

export default function Shell({ room, seat, view, onNav, onOpenRoom, roomOpen, onCloseRoom, onLeave, hideNav = false, children }) {
  const me = seatById(room, seat.seatId);
  const partner = room.seats.find((s) => s.id !== seat.seatId);

  useEffect(() => {
    if (roomOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [roomOpen]);

  return (
    <div className="shell">
      <aside className="rail">
        <div className="rail-top">
          <div>
            <Mark size={38} />
            <div className="rail-sub">A room for two</div>
          </div>
        </div>

        <nav className="rail-nav" aria-label="Sections">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`rail-link${view === item.id ? " on" : ""}`}
              onClick={() => onNav(item.id)}
              type="button"
              aria-current={view === item.id ? "page" : undefined}
            >
              <span className="num">{item.numeral}</span>
              <span className="rail-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="rail-foot">
          <button className="room-button" onClick={onOpenRoom} type="button">
            <span>
              <span className="room-code">{room.code}</span>
              <span className="room-names" style={{ display: "block" }}>
                {me?.name}
                {partner ? ` and ${partner.name}` : ", alone for now"}
              </span>
            </span>
            <Icon name="chevronRight" size={13} />
          </button>
        </div>
      </aside>

      <header className="topbar">
        <Mark size={28} />
        <div className="topbar-right">
          <span className="topbar-code">{room.code}</span>
          <button className="room-button" style={{ width: "auto" }} onClick={onOpenRoom} type="button" aria-label="The room">
            <span className="seat-line" style={{ border: 0, padding: 0, gap: 8 }}>
              <span style={{ fontSize: 12, color: "var(--bone-dim)" }}>{me?.name}</span>
              <Icon name="chevronRight" size={12} />
            </span>
          </button>
        </div>
      </header>

      <main className="main">{children}</main>

      {!hideNav && (
        <nav className="mobile-bar" aria-label="Sections">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`mob-link${view === item.id ? " on" : ""}`}
              onClick={() => onNav(item.id)}
              type="button"
              aria-current={view === item.id ? "page" : undefined}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.short}</span>
            </button>
          ))}
        </nav>
      )}

      {roomOpen && (
        <RoomSheet
          room={room}
          seat={seat}
          onClose={onCloseRoom}
          onLeave={onLeave}
        />
      )}
    </div>
  );
}

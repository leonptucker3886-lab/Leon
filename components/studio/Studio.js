"use client";

import { useState } from "react";
import { categories, sessions } from "@/lib/data";
import { Eyebrow, Meter, Plate } from "../ui";

const ALT = {
  foundation: "Two hands resting close on linen",
  deep: "A dim room seen through a half-open door",
  play: "Two glasses and a low candle on a dark table",
  growth: "A path through pines at first light",
  daily: "Morning light across a bed and two cups",
};

export default function Studio({ room, seat, openSession }) {
  const [cat, setCat] = useState("all");
  const done = room.data.done?.[seat.seatId] || {};
  const partner = room.seats.find((s) => s.id !== seat.seatId);
  const partnerDone = partner ? room.data.done?.[partner.id] || {} : {};
  const doneCount = Object.keys(done).length;
  const list = cat === "all" ? sessions : sessions.filter((s) => s.cat === cat);
  const active = categories.find((c) => c.id === cat);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>Studio</Eyebrow>
          <h1 className="display">
            Twenty sessions.
            <br />
            <em>No small talk.</em>
          </h1>
          <p className="lede">
            Five categories, four ways of answering. Some give you a profile.
            Others give you a score. The open ones give you each other, but only
            after you have written yours.
          </p>
        </div>
        <div className="page-head-side">
          <div className="head-count">
            {doneCount}
            <span style={{ color: "var(--ash)", fontSize: 16 }}> / {sessions.length}</span>
          </div>
          <div className="head-count-label">Completed by you</div>
        </div>
      </header>

      <div className="studio-progress">
        <Meter value={(doneCount / sessions.length) * 100} />
        <span className="count">
          {doneCount === 0
            ? "Not started"
            : doneCount === sessions.length
            ? "All written"
            : `${sessions.length - doneCount} remaining`}
        </span>
      </div>

      <div className="cat-row" role="tablist" aria-label="Categories">
        <button
          className={`cat-tab${cat === "all" ? " on" : ""}`}
          onClick={() => setCat("all")}
          role="tab"
          aria-selected={cat === "all"}
          type="button"
        >
          All <span className="num">·</span> {sessions.length}
        </button>
        {categories.map((c) => {
          const count = sessions.filter((s) => s.cat === c.id).length;
          return (
            <button
              key={c.id}
              className={`cat-tab${cat === c.id ? " on" : ""}`}
              onClick={() => setCat(c.id)}
              role="tab"
              aria-selected={cat === c.id}
              type="button"
            >
              {c.name} <span className="num">{c.numeral}</span>{" "}
              <span className="num">{count}</span>
            </button>
          );
        })}
      </div>

      {active && (
        <p className="lede" style={{ marginTop: -14, marginBottom: 24, fontSize: 12.5 }}>
          {active.line}
        </p>
      )}

      <div className="session-grid stagger">
        {list.map((s, i) => {
          const meta = active
            ? `${active.numeral} — ${active.name}`
            : `${categories.find((c) => c.id === s.cat)?.numeral} — ${
                categories.find((c) => c.id === s.cat)?.name
              }`;
          return (
            <Plate
              key={s.id}
              src={`/plates/${s.cat}.jpg`}
              alt={ALT[s.cat]}
              meta={meta}
              title={s.title}
              deck={s.deck}
              mark={`${s.minutes === "open" ? "Open" : `${s.minutes} min`}${
                partnerDone[s.id] ? " · Both" : ""
              }`}
              done={!!done[s.id]}
              onClick={() => openSession(s.id)}
              style={{ animationDelay: `${Math.min(i * 35, 350)}ms` }}
            />
          );
        })}
      </div>

      <div className="divider-label" style={{ marginTop: 36 }}>
        <span>How the answers work</span>
      </div>
      <div className="home-columns">
        <p className="lede" style={{ fontSize: 13 }}>
          Choice sessions tally into a written profile. Scales give you a
          percentage and a reading. Pairs are compared round by round. The
          long-form sessions stay sealed until you have written your own answers
          — you cannot read them first.
        </p>
        <p className="lede" style={{ fontSize: 13 }}>
          Nothing is scored against you. There is no streak to keep, no one
          waiting on your progress, and no result that leaves this room.
        </p>
      </div>
    </div>
  );
}

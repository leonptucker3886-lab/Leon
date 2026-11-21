"use client";

import { useMemo, useRef, useState } from "react";
import { dateIdeas } from "@/lib/data/dates";
import { ideasFor } from "@/lib/store";
import { Eyebrow } from "./ui";
import Icon from "./Icons";

const COLORS = [
  { fill: "#c8a558", dark: true },
  { fill: "#d98b4a", dark: true },
  { fill: "#7f9682", dark: true },
  { fill: "#5d8f93", dark: true },
  { fill: "#9c4a32", dark: false },
  { fill: "#cfc6b6", dark: true },
  { fill: "#8b8378", dark: false },
  { fill: "#b08a6a", dark: true },
];

export default function Wheel({ room, seat, update }) {
  const ideas = useMemo(() => ideasFor(room, dateIdeas), [room]);
  const extras = useMemo(() => Object.values(room.data.ideas || {}).flat(), [room]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [newIdea, setNewIdea] = useState("");
  const timer = useRef(null);

  const n = Math.max(ideas.length, 1);
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;

  const segments = ideas.map((idea, i) => {
    const start = (i / n) * Math.PI * 2 - Math.PI / 2;
    const end = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    const mid = (start + end) / 2;
    const tx = cx + r * 0.63 * Math.cos(mid);
    const ty = cy + r * 0.63 * Math.sin(mid);
    let angle = (mid * 180) / Math.PI;
    if (angle > 90 && angle < 270) angle += 180;
    const color = COLORS[i % COLORS.length];
    return {
      d: `M${cx},${cy}L${x1},${y1}A${r},${r},0,${large},1,${x2},${y2}Z`,
      tx,
      ty,
      angle,
      color,
      label: idea,
    };
  });

  const spin = () => {
    if (spinning || ideas.length < 2) return;
    setWinner(null);
    setSpinning(true);
    const total = rotation + (4 + Math.random() * 3) * 360 + Math.random() * 360;
    setRotation(total);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const offset = ((360 - (total % 360)) % 360) / 360;
      const index = Math.floor(offset * n + 0.5) % n;
      setWinner(ideas[(index + n) % n]);
      setSpinning(false);
    }, 4500);
  };

  const add = () => {
    const clean = newIdea.trim().slice(0, 60);
    if (!clean) return;
    const exists = ideas.some((i) => i.toLowerCase() === clean.toLowerCase());
    if (exists) {
      setNewIdea("");
      return;
    }
    update((draft) => {
      draft.data.ideas = draft.data.ideas || {};
      draft.data.ideas[seat.seatId] = [...(draft.data.ideas[seat.seatId] || []), clean];
    });
    setNewIdea("");
  };

  const remove = (idea) => {
    update((draft) => {
      const ideasMap = draft.data.ideas || {};
      Object.keys(ideasMap).forEach((seatId) => {
        ideasMap[seatId] = ideasMap[seatId].filter((x) => x !== idea);
      });
    });
  };

  const isExtra = (idea) => extras.includes(idea);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>III — Wheel</Eyebrow>
          <h1 className="display">
            Let it <em>decide.</em>
          </h1>
          <p className="lede">
            Every idea either of you adds lands on the wheel. Then neither of you
            has to be the one who chose.
          </p>
        </div>
        <div className="page-head-side">
          <div className="head-count">{ideas.length}</div>
          <div className="head-count-label">Ideas on the wheel</div>
        </div>
      </header>

      <div className="wheel-layout">
        <div className="wheel-stage">
          <div className="wheel-holder">
            <div className="wheel-pointer" aria-hidden="true">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M8 1v11" />
                <path d="M2.5 8.5 8 14.5l5.5-6" />
              </svg>
            </div>
            <svg
              className="wheel-svg"
              viewBox={`0 0 ${size} ${size}`}
              style={{ transform: `rotate(${rotation}deg)` }}
              role="img"
              aria-label="Date wheel"
            >
              {segments.map((s, i) => (
                <g key={`${s.label}-${i}`}>
                  <path d={s.d} fill={s.color.fill} stroke="#0a0c0e" strokeWidth="1.2" />
                  <text
                    x={s.tx}
                    y={s.ty}
                    fill={s.color.dark ? "#0a0c0e" : "#f2ebdf"}
                    fontSize={n > 20 ? 7 : n > 14 ? 8 : 9}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${s.angle},${s.tx},${s.ty})`}
                    style={{ fontFamily: "var(--text)", letterSpacing: "0.02em" }}
                  >
                    {s.label.length > 14 ? `${s.label.slice(0, 13)}…` : s.label}
                  </text>
                </g>
              ))}
              <circle cx={cx} cy={cy} r="30" fill="#0a0c0e" stroke="#c8a558" strokeWidth="1" />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fill="#f2ebdf"
                fontSize="14"
                style={{ fontFamily: "var(--display)", fontStyle: "italic" }}
              >
                us.
              </text>
            </svg>
          </div>

          <button
            className="btn btn-gold"
            type="button"
            onClick={spin}
            disabled={spinning || ideas.length < 2}
          >
            <Icon name="spin" size={14} />
            {spinning ? "Turning" : "Spin the wheel"}
          </button>

          {winner && (
            <div className="wheel-result">
              <Eyebrow gold>Your next date</Eyebrow>
              <div className="display-sm">{winner}</div>
              <p className="lede" style={{ fontSize: 12, marginTop: 8, marginInline: "auto" }}>
                It is on the wheel, so it is allowed. Put it in the calendar
                before either of you finds a reason not to.
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="wheel-side-head">
            <Eyebrow>Each other&apos;s ideas</Eyebrow>
            <span className="eyebrow">{ideas.length}</span>
          </div>

          <div className="idea-list">
            {ideas.map((idea) => (
              <span className="idea-chip" key={idea}>
                {idea}
                {isExtra(idea) && (
                  <button onClick={() => remove(idea)} type="button" aria-label={`Remove ${idea}`}>
                    <Icon name="close" size={10} />
                  </button>
                )}
              </span>
            ))}
          </div>

          <div className="divider-label">
            <span>Add one</span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="Something you would actually do"
              maxLength={60}
              onKeyDown={(e) => {
                if (e.key === "Enter") add();
              }}
            />
            <button className="btn" type="button" onClick={add} disabled={!newIdea.trim()}>
              <Icon name="plus" size={13} />
            </button>
          </div>

          <p className="lede" style={{ fontSize: 12, marginTop: 16 }}>
            Anything either of you adds can be removed by either of you. No quiet
            vetoes — take it off the wheel, or leave it there and live with the
            consequence.
          </p>
        </div>
      </div>
    </div>
  );
}

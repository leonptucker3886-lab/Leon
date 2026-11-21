"use client";

import { useState } from "react";
import { newId } from "@/lib/store";
import { Eyebrow, Empty } from "./ui";
import Icon from "./Icons";

const CATEGORIES = [
  { id: "emotional", numeral: "i", label: "Emotional", note: "What you will and will not hold." },
  { id: "physical", numeral: "ii", label: "Physical", note: "Touch, space, and your body." },
  { id: "financial", numeral: "iii", label: "Financial", note: "Money, debt, and what is shared." },
  { id: "social", numeral: "iv", label: "Social", note: "Other people, family, and time." },
  { id: "digital", numeral: "v", label: "Digital", note: "Phones, passwords, and privacy." },
  { id: "intimate", numeral: "vi", label: "Intimate", note: "What is only ever between you." },
  { id: "other", numeral: "vii", label: "Other", note: "Anything the others do not cover." },
];

export default function Boundaries({ room, seat, update }) {
  const [text, setText] = useState("");
  const [cat, setCat] = useState("emotional");
  const bounds = room.data.boundaries || [];

  const add = () => {
    const clean = text.trim().slice(0, 220);
    if (!clean) return;
    update((draft) => {
      draft.data.boundaries = [
        ...(draft.data.boundaries || []),
        {
          id: newId(),
          text: clean,
          cat,
          byId: seat.seatId,
          by: seat.name,
          added: Date.now(),
        },
      ];
    });
    setText("");
  };

  const remove = (id) => {
    update((draft) => {
      draft.data.boundaries = (draft.data.boundaries || []).filter((b) => b.id !== id);
    });
  };

  const groups = CATEGORIES.map((c) => ({
    ...c,
    items: bounds.filter((b) => b.cat === c.id),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>VI — Boundaries</Eyebrow>
          <h1 className="display">
            Said once, <em>and kept.</em>
          </h1>
          <p className="lede">
            A boundary is a sentence about what you need. Not a punishment, not a
            test, not something to be guessed. Write it here so it is known.
          </p>
        </div>
        <div className="page-head-side">
          <div className="head-count">{bounds.length}</div>
          <div className="head-count-label">On the wall</div>
        </div>
      </header>

      <div className="bound-layout">
        <div className="tag-row" style={{ marginBottom: 12 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`tag${cat === c.id ? " on" : ""}`}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="bound-add">
          <input
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What do you need them to know?"
            maxLength={220}
            onKeyDown={(e) => {
              if (e.key === "Enter") add();
            }}
          />
          <button className="btn btn-gold" type="button" onClick={add} disabled={!text.trim()}>
            Add to the wall
          </button>
        </div>
        <p className="lede" style={{ fontSize: 11.5 }}>
          {CATEGORIES.find((c) => c.id === cat)?.note} Both of you can read every
          line. You can remove your own.
        </p>

        {bounds.length === 0 ? (
          <div style={{ marginTop: 26 }}>
            <Empty title="The wall is empty.">
              Start with one thing you have already said out loud. Writing it
              down makes it harder to forget.
            </Empty>
          </div>
        ) : (
          groups.map((group) => (
            <section className="bound-group" key={group.id}>
              <div className="bound-group-head">
                <span className="num">{group.numeral}</span>
                <span className="name">{group.label}</span>
              </div>
              {group.items.map((b) => (
                <div className="bound-item" key={b.id}>
                  <div>
                    <div className="bound-text">{b.text}</div>
                    <div className="bound-by">{b.by}</div>
                  </div>
                  {b.byId === seat.seatId ? (
                    <button
                      type="button"
                      className="bound-del"
                      onClick={() => remove(b.id)}
                      aria-label="Remove boundary"
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  ) : (
                    <Icon name="lock" size={13} />
                  )}
                </div>
              ))}
            </section>
          ))
        )}
      </div>
    </div>
  );
}

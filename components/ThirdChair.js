"use client";

import { useState } from "react";
import { newId } from "@/lib/store";
import { readCase } from "@/lib/reader";
import { shortDate } from "@/lib/format";
import { Eyebrow, Empty, Plate } from "./ui";
import Icon from "./Icons";

export default function ThirdChair({ room, seat, update }) {
  const [topic, setTopic] = useState("");
  const [openId, setOpenId] = useState(null);
  const cases = room.data.cases || [];
  const active = cases.find((c) => c.id === openId);
  const partnerSeat = room.seats.find((s) => s.id !== seat.seatId);

  const create = () => {
    const clean = topic.trim().slice(0, 120);
    if (!clean) return;
    const item = { id: newId(), topic: clean, createdAt: Date.now(), sides: {}, reading: null };
    update((draft) => {
      draft.data.cases = [item, ...(draft.data.cases || [])];
    });
    setTopic("");
    setOpenId(item.id);
  };

  const statusOf = (item) => {
    if (item.reading) return { label: "Reading in", cls: "read" };
    const mine = !!item.sides?.[seat.seatId];
    const theirs = partnerSeat ? !!item.sides?.[partnerSeat.id] : false;
    if (mine && theirs) return { label: "Ready for a reading", cls: "ready" };
    if (mine && !partnerSeat) return { label: "Alone in the room", cls: "" };
    if (mine) return { label: `Waiting on ${partnerSeat?.name}`, cls: "" };
    if (theirs) return { label: "Your side is missing", cls: "" };
    return { label: "Open", cls: "" };
  };

  if (active) {
    return (
      <CaseView
        key={active.id}
        item={active}
        room={room}
        seat={seat}
        update={update}
        onBack={() => setOpenId(null)}
      />
    );
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>VII — Third Chair</Eyebrow>
          <h1 className="display">
            Someone <em>impartial.</em>
          </h1>
          <p className="lede">
            You both write your side. The reading is composed from the two
            accounts — not to decide who is right, but to show each of you what
            you are actually asking for, and one next step that belongs to you
            both.
          </p>
        </div>
      </header>

      <div className="chair-intro">
        <div>
          <div className="btn-row">
            <input
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What is the disagreement about?"
              maxLength={120}
              onKeyDown={(e) => {
                if (e.key === "Enter") create();
              }}
            />
            <button className="btn btn-gold" type="button" onClick={create} disabled={!topic.trim()}>
              Open a case
            </button>
          </div>
          <p className="lede" style={{ fontSize: 12, marginTop: 14 }}>
            No model, no key, no account. The reading is composed on this device
            from what you both wrote, and stays inside the room.
          </p>
          {!partnerSeat && (
            <div className="locked" style={{ marginTop: 18 }}>
              <Icon name="lock" size={15} />
              <span>
                A reading needs both accounts. Share the room code; the third
                chair stays empty until they take it.
              </span>
            </div>
          )}
        </div>
        <div className="today-art" style={{ maxWidth: 230, justifySelf: "end" }}>
          <Plate
            src="/plates/chair.jpg"
            alt="Three chairs in a dark room, light on the empty one"
            meta="Plate VII"
            title="One empty chair, on purpose."
            wide
          />
        </div>
      </div>

      {cases.length === 0 ? (
        <Empty title="No cases yet.">
          Open one when a disagreement keeps circling. Write it while you are
          still annoyed — the reading is more useful before you have rehearsed
          your defence.
        </Empty>
      ) : (
        <div className="chair-cases">
          {cases.map((item) => {
            const status = statusOf(item);
            return (
              <button
                key={item.id}
                type="button"
                className="case-card"
                onClick={() => setOpenId(item.id)}
              >
                <div className="case-topic">{item.topic}</div>
                <div className="case-status">
                  <span className={status.cls}>{status.label}</span>
                  <span>{shortDate(new Date(item.createdAt))}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CaseView({ item, room, seat, update, onBack }) {
  const partnerSeat = room.seats.find((s) => s.id !== seat.seatId);
  const mine = item.sides?.[seat.seatId];
  const partner = partnerSeat ? item.sides?.[partnerSeat.id] : null;
  const both = !!mine && !!partner;
  const [text, setText] = useState(mine?.text || "");
  const [editing, setEditing] = useState(!mine);
  const [busy, setBusy] = useState(false);

  const patch = (fn) => {
    update((draft) => {
      const found = (draft.data.cases || []).find((c) => c.id === item.id);
      if (found) fn(found);
    });
  };

  const submit = () => {
    const clean = text.trim();
    if (!clean) return;
    patch((c) => {
      c.sides = c.sides || {};
      c.sides[seat.seatId] = { name: seat.name, text: clean, at: Date.now() };
      c.reading = null;
    });
    setEditing(false);
  };

  const request = () => {
    const accounts = room.seats
      .map((s) => ({ name: s.name, text: item.sides?.[s.id]?.text || "" }))
      .filter((s) => s.text);
    if (accounts.length < 2) return;
    setBusy(true);
    const reading = readCase({ topic: item.topic, sides: accounts });
    setTimeout(() => {
      if (reading) patch((c) => { c.reading = reading; });
      setBusy(false);
    }, 420);
  };

  const sideList = room.seats.map((s, i) => ({
    key: s.id,
    label: i === 0 ? "A" : "B",
    name: s.name,
    side: item.sides?.[s.id],
    isMe: s.id === seat.seatId,
  }));

  return (
    <div className="page">
      <div className="session-top">
        <button className="link-quiet" type="button" onClick={onBack}>
          <Icon name="arrowLeft" size={12} /> Third chair
        </button>
        <span className="session-count">VII · The case</span>
      </div>

      <div className="case-head">
        <div>
          <Eyebrow gold>Case</Eyebrow>
          <h1 className="case-title" style={{ marginTop: 10 }}>
            {item.topic}
          </h1>
        </div>
        <span className="tag-static">
          {item.reading ? "Reading in" : both ? "Both accounts in" : "One account in"}
        </span>
      </div>

      <div className="sides" style={{ marginBottom: 22 }}>
        {sideList.map((row) => (
          <div className="side" key={row.key}>
            <div className="side-head">
              <span className="side-name">{row.name}</span>
              <span className="tag-static">{row.label}</span>
            </div>
            {row.side ? (
              <p className="side-text">{row.side.text}</p>
            ) : (
              <p className="side-empty">
                {row.isMe
                  ? "You have not written your side yet."
                  : `${row.name} has not written theirs yet.`}
              </p>
            )}
          </div>
        ))}
      </div>

      {editing ? (
        <div className="side-form">
          <Eyebrow gold>{mine ? "Revise your account" : "Your side"}</Eyebrow>
          <p className="lede" style={{ fontSize: 12.5, margin: "8px 0 12px" }}>
            Say what happened, what it meant to you, and what you want. Do not
            write their side for them — the reading can tell.
          </p>
          <textarea
            className="textarea"
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start with the thing you would say if you were not afraid of the answer."
            autoFocus={!mine}
          />
          <div className="btn-row" style={{ marginTop: 14 }}>
            <button className="btn btn-gold" type="button" onClick={submit} disabled={!text.trim()}>
              {mine ? "Replace my account" : "Submit my side"}
            </button>
            {mine && (
              <button className="btn btn-quiet" type="button" onClick={() => { setEditing(false); setText(mine.text); }}>
                Cancel
              </button>
            )}
          </div>
          {item.reading && (
            <p className="lede" style={{ fontSize: 11.5, marginTop: 12 }}>
              Replacing your account withdraws the current reading. You will need
              to request a new one.
            </p>
          )}
        </div>
      ) : (
        <div className="btn-row" style={{ justifyContent: "space-between" }}>
          <button className="btn btn-quiet" type="button" onClick={() => setEditing(true)}>
            Revise my side
          </button>
          {both && !item.reading && (
            <button className="btn btn-gold" type="button" onClick={request} disabled={busy}>
              {busy ? "Reading" : "Request the reading"}
              {!busy && <Icon name="arrowRight" size={13} />}
            </button>
          )}
        </div>
      )}

      {!both && !editing && (
        <div className="locked" style={{ marginTop: 18 }}>
          <Icon name="lock" size={15} />
          <span>
            {mine
              ? `A reading needs both accounts. ${partnerSeat?.name || "They"} still has the chair.`
              : "Write your side first. You will see the reading only after both accounts are in."}
          </span>
        </div>
      )}

      {item.reading && (
        <div className="reading">
          <div className="reading-head">
            <div className="reading-title">{item.reading.headline}</div>
            <span className="tag-static">Impartial</span>
          </div>

          <div className="reading-block">
            <h4>What you both said</h4>
            <p>{item.reading.shared}</p>
          </div>

          {item.reading.reads.map((read) => (
            <div className="reading-block" key={read.name}>
              <h4>{read.name}</h4>
              <p>{read.text}</p>
            </div>
          ))}

          <div className="reading-block">
            <h4>One next step</h4>
            <p className="reading-step">{item.reading.step}</p>
          </div>

          <div className="reading-foot">{item.reading.note}</div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { newId } from "@/lib/store";
import { shortDate, truncate } from "@/lib/format";
import { Eyebrow, Empty, Switch } from "./ui";
import Icon from "./Icons";

export default function Notes({ room, seat, update }) {
  const notes = room.data.notes || [];
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState({ title: "", body: "", shared: false });
  const [isNew, setIsNew] = useState(false);

  const mine = useMemo(
    () => notes.filter((n) => n.byId === seat.seatId).sort((a, b) => b.updated - a.updated),
    [notes, seat.seatId]
  );
  const theirs = useMemo(
    () => notes.filter((n) => n.byId !== seat.seatId && n.shared).sort((a, b) => b.updated - a.updated),
    [notes, seat.seatId]
  );
  const selected = notes.find((n) => n.id === selectedId) || null;
  const readonly = !!selected && selected.byId !== seat.seatId;

  const startNew = () => {
    setSelectedId(null);
    setIsNew(true);
    setDraft({ title: "", body: "", shared: false });
  };

  const open = (note) => {
    setIsNew(false);
    setSelectedId(note.id);
    setDraft({ title: note.title, body: note.body, shared: note.shared });
  };

  const save = () => {
    if (readonly) return;
    if (!draft.title.trim() && !draft.body.trim()) return;
    const id = isNew || !selected ? newId() : selected.id;
    const note = {
      id,
      title: draft.title.trim(),
      body: draft.body.trim(),
      shared: draft.shared,
      byId: seat.seatId,
      by: seat.name,
      updated: Date.now(),
    };
    update((roomDraft) => {
      roomDraft.data.notes = [note, ...(roomDraft.data.notes || []).filter((n) => n.id !== id)];
    });
    setSelectedId(id);
    setIsNew(false);
  };

  const remove = () => {
    if (!selected || readonly) return;
    update((roomDraft) => {
      roomDraft.data.notes = (roomDraft.data.notes || []).filter((n) => n.id !== selected.id);
    });
    setSelectedId(null);
    setIsNew(false);
    setDraft({ title: "", body: "", shared: false });
  };

  const showEditor = isNew || !!selected;

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>V — Notes</Eyebrow>
          <h1 className="display">
            Kept, or <em>handed over.</em>
          </h1>
          <p className="lede">
            Write for yourself, or share it with them. A shared note is readable
            by both of you and editable only by its author.
          </p>
        </div>
        <div className="page-head-side">
          <button className="btn" type="button" onClick={startNew}>
            <Icon name="plus" size={13} />
            New note
          </button>
        </div>
      </header>

      <div className="notes-layout">
        <div className="notes-list">
          {mine.length === 0 && theirs.length === 0 && (
            <div style={{ padding: "20px 0" }}>
              <p className="lede" style={{ fontSize: 13 }}>
                Nothing written yet.
              </p>
            </div>
          )}

          {mine.length > 0 && (
            <>
              <div className="note-group-label">
                <Eyebrow>Yours</Eyebrow>
              </div>
              {mine.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  className={`note-item${selectedId === note.id ? " on" : ""}`}
                  onClick={() => open(note)}
                >
                  <div className="note-title">{note.title || "Untitled"}</div>
                  <div className="note-meta">
                    <span>{note.shared ? "Shared" : "Private"}</span>
                    <span>·</span>
                    <span>{shortDate(new Date(note.updated))}</span>
                  </div>
                  <div className="note-preview">{truncate(note.body, 60) || "Empty"}</div>
                </button>
              ))}
            </>
          )}

          {theirs.length > 0 && (
            <>
              <div className="note-group-label">
                <Eyebrow>From {theirs[0].by}</Eyebrow>
              </div>
              {theirs.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  className={`note-item${selectedId === note.id ? " on" : ""}`}
                  onClick={() => open(note)}
                >
                  <div className="note-title">{note.title || "Untitled"}</div>
                  <div className="note-meta">
                    <span style={{ color: "var(--gold)" }}>Shared</span>
                    <span>·</span>
                    <span>{shortDate(new Date(note.updated))}</span>
                  </div>
                  <div className="note-preview">{truncate(note.body, 60) || "Empty"}</div>
                </button>
              ))}
            </>
          )}
        </div>

        <div className="note-pane">
          {!showEditor ? (
            <Empty title="Nothing open.">
              Choose a note, or start one. Nothing here is visible outside this
              room, and private notes are not visible to them either.
            </Empty>
          ) : (
            <>
              <div className="note-editor-head">
                <Eyebrow>
                  {isNew ? "New note" : readonly ? `Written by ${selected?.by}` : "Your note"}
                </Eyebrow>
                {readonly && <span className="tag-static">Read only</span>}
              </div>
              <input
                className="note-title-input"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="Title"
                readOnly={readonly}
                maxLength={90}
              />
              <textarea
                className="note-body-input"
                value={draft.body}
                onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                placeholder={readonly ? "" : "Write anything. No one is grading it."}
                readOnly={readonly}
              />
              <div className="note-foot">
                {readonly ? (
                  <span className="eyebrow">Shared with you</span>
                ) : (
                  <Switch
                    on={draft.shared}
                    onChange={(next) => setDraft((d) => ({ ...d, shared: next }))}
                    label={draft.shared ? "Shared with them" : "Private to you"}
                  />
                )}
                <div className="btn-row">
                  {!readonly && selected && !isNew && (
                    <button className="link-quiet" type="button" onClick={remove}>
                      Delete
                    </button>
                  )}
                  {!readonly && (
                    <button
                      className="btn btn-sm btn-gold"
                      type="button"
                      onClick={save}
                      disabled={!draft.title.trim() && !draft.body.trim()}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

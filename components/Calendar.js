"use client";

import { useState } from "react";
import { newId } from "@/lib/store";
import {
  todayISO,
  isoOf,
  parseISO,
  monthCells,
  monthName,
  shortDate,
  dayOfMonth,
  monthShort,
  relativeDay,
} from "@/lib/format";
import { Eyebrow, Sheet, Empty } from "./ui";
import Icon from "./Icons";

const TYPES = [
  { id: "date", label: "Date" },
  { id: "anniversary", label: "Anniversary" },
  { id: "birthday", label: "Birthday" },
  { id: "reminder", label: "Reminder" },
  { id: "other", label: "Other" },
];

const TYPE_COLOR = {
  date: "var(--gold)",
  anniversary: "var(--ember)",
  birthday: "var(--rust)",
  reminder: "var(--sea)",
  other: "var(--sage)",
};

const blankForm = (date) => ({ title: "", date, type: "date", note: "" });

export default function CalendarView({ room, seat, update }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankForm(todayISO()));

  const events = room.data.events || [];
  const cells = monthCells(year, month);
  const today = todayISO();
  const monthEvents = events.filter((e) => {
    const d = parseISO(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  const upcoming = [...events]
    .filter((e) => e.date >= today)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .slice(0, 8);

  const move = (delta) => {
    const next = new Date(year, month + delta, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
  };

  const startAdd = (date) => {
    setEditingId(null);
    setForm(blankForm(date || todayISO()));
    setOpen(true);
  };

  const startEdit = (event) => {
    setEditingId(event.id);
    setForm({ title: event.title, date: event.date, type: event.type, note: event.note || "" });
    setOpen(true);
  };

  const save = () => {
    const title = form.title.trim();
    if (!title || !form.date) return;
    update((draft) => {
      draft.data.events = draft.data.events || [];
      if (editingId) {
        draft.data.events = draft.data.events.map((e) =>
          e.id === editingId
            ? { ...e, title, date: form.date, type: form.type, note: form.note.trim() }
            : e
        );
      } else {
        draft.data.events.push({
          id: newId(),
          title,
          date: form.date,
          type: form.type,
          note: form.note.trim(),
          by: seat.name,
          byId: seat.seatId,
          createdAt: Date.now(),
        });
      }
    });
    setOpen(false);
    setEditingId(null);
  };

  const remove = () => {
    if (!editingId) return;
    update((draft) => {
      draft.data.events = (draft.data.events || []).filter((e) => e.id !== editingId);
    });
    setOpen(false);
    setEditingId(null);
  };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>IV — Calendar</Eyebrow>
          <h1 className="display">
            Things you have <em>promised.</em>
          </h1>
          <p className="lede">
            Dates, anniversaries, birthdays, reminders. One calendar, visible to
            both of you, editable by both of you.
          </p>
        </div>
        <div className="page-head-side">
          <button className="btn" type="button" onClick={() => startAdd(todayISO())}>
            <Icon name="plus" size={13} />
            Add
          </button>
        </div>
      </header>

      <div className="cal-layout">
        <section>
          <div className="cal-head">
            <div className="cal-month">
              {monthName(month)}
              <span>{year}</span>
            </div>
            <div className="cal-nav">
              <button type="button" onClick={() => move(-1)} aria-label="Previous month">
                <Icon name="chevronLeft" size={14} />
              </button>
              <button type="button" onClick={() => move(1)} aria-label="Next month">
                <Icon name="chevronRight" size={14} />
              </button>
            </div>
          </div>

          <div className="cal-week" aria-hidden="true">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={`${d}-${i}`}>{d}</div>
            ))}
          </div>

          <div className="cal-grid" role="grid" aria-label={`${monthName(month)} ${year}`}>
            {cells.map((day, i) => {
              if (!day) return <div className="cal-cell blank" key={`blank-${i}`} aria-hidden="true" />;
              const iso = isoOf(new Date(year, month, day));
              const dayEvents = monthEvents.filter((e) => parseISO(e.date).getDate() === day);
              const isToday = iso === today;
              return (
                <div className={`cal-cell${isToday ? " today" : ""}`} key={iso} role="gridcell">
                  <button
                    className="cal-day cal-day-btn"
                    type="button"
                    onClick={() => startAdd(iso)}
                    aria-label={`Add an event on ${day} ${monthName(month)}`}
                    style={{ background: "none", border: 0, padding: 0, textAlign: "left", cursor: "pointer" }}
                  >
                    {String(day).padStart(2, "0")}
                  </button>
                  {dayEvents.slice(0, 2).map((event) => (
                    <button
                      className="cal-event"
                      type="button"
                      key={event.id}
                      onClick={() => startEdit(event)}
                      style={{ color: TYPE_COLOR[event.type] || TYPE_COLOR.other }}
                      title={event.title}
                    >
                      {event.title}
                    </button>
                  ))}
                  {dayEvents.length > 2 && <span className="cal-more">+{dayEvents.length - 2}</span>}
                  <span className="cal-dot" style={{ background: TYPE_COLOR[dayEvents[0]?.type] || "transparent" }} />
                </div>
              );
            })}
          </div>

          <p className="lede" style={{ fontSize: 11.5, marginTop: 12 }}>
            Click a day number to add something to it.
          </p>
        </section>

        <aside>
          <div className="section-head">
            <h2>Next</h2>
            <span className="eyebrow">{upcoming.length}</span>
          </div>

          {upcoming.length === 0 ? (
            <Empty title="Nothing yet.">
              A shared calendar is mostly a promise you can both see. Put the
              first thing in it.
            </Empty>
          ) : (
            <div className="upcoming">
              {upcoming.map((event) => (
                <button
                  className="upcoming-item upcoming-btn"
                  key={event.id}
                  type="button"
                  onClick={() => startEdit(event)}
                >
                  <div className="upcoming-date">
                    {dayOfMonth(event.date)}
                    <span>{monthShort(event.date)}</span>
                  </div>
                  <div>
                    <div className="upcoming-title">{event.title}</div>
                    <div className="upcoming-meta">
                      {relativeDay(event.date) || shortDate(event.date)}
                      {" · "}
                      {TYPES.find((t) => t.id === event.type)?.label}
                      {event.by ? ` · ${event.by}` : ""}
                    </div>
                  </div>
                  <span
                    className="event-type"
                    style={{ background: TYPE_COLOR[event.type] || TYPE_COLOR.other }}
                  />
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>

      {open && (
        <Sheet
          title={editingId ? "The event" : "Add to the calendar"}
          eyebrow={editingId ? "Edit" : "New"}
          onClose={() => {
            setOpen(false);
            setEditingId(null);
          }}
        >
          <label className="field">
            <span className="label">What is it</span>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Dinner, their birthday, the thing you keep postponing"
              autoFocus
              maxLength={80}
            />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label className="field">
              <span className="label">Date</span>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </label>
            <label className="field">
              <span className="label">Kind</span>
              <select
                className="select"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                {TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span className="label">Note, if it matters</span>
            <textarea
              className="textarea"
              rows={3}
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Optional."
            />
          </label>

          <div className="btn-row" style={{ marginTop: 6, justifyContent: "space-between" }}>
            {editingId ? (
              <button className="btn btn-quiet" type="button" onClick={remove}>
                <Icon name="trash" size={13} />
                Remove
              </button>
            ) : (
              <span />
            )}
            <div className="btn-row">
              <button
                className="btn btn-quiet"
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-gold"
                type="button"
                onClick={save}
                disabled={!form.title.trim() || !form.date}
              >
                {editingId ? "Save changes" : "Add it"}
              </button>
            </div>
          </div>
        </Sheet>
      )}
    </div>
  );
}

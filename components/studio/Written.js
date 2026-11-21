"use client";

import { useState } from "react";
import { categories, sessionNumeral } from "@/lib/data";
import { Eyebrow } from "../ui";
import Icon from "../Icons";
import { shortDate, todayISO } from "@/lib/format";

function SessionHead({ quiz, onBack, right }) {
  const cat = categories.find((c) => c.id === quiz.cat);
  return (
    <div className="session-top">
      <button className="link-quiet" type="button" onClick={onBack}>
        <Icon name="arrowLeft" size={12} /> Studio
      </button>
      <span className="session-count">
        {cat?.numeral} — {cat?.name} · {sessionNumeral(quiz)}
        {right ? ` · ${right}` : ""}
      </span>
    </div>
  );
}

function Locked({ name }) {
  return (
    <div className="locked">
      <Icon name="lock" size={15} />
      <span>
        {name ? `${name}’s answers stay sealed` : "Their answers stay sealed"}{" "}
        until you have written yours. That is the whole rule.
      </span>
    </div>
  );
}

function usePersist(update, seat, quiz) {
  return (payload) => {
    update((draft) => {
      const d = draft.data;
      d.answers = d.answers || {};
      d.answers[seat.seatId] = d.answers[seat.seatId] || {};
      d.answers[seat.seatId][quiz.id] = payload;
      d.done = d.done || {};
      d.done[seat.seatId] = d.done[seat.seatId] || {};
      d.done[seat.seatId][quiz.id] = Date.now();
    });
  };
}

function Intro({ quiz, onBack }) {
  const cat = categories.find((c) => c.id === quiz.cat);
  return (
    <div className="page-head" style={{ borderBottom: 0, marginBottom: 10, paddingBottom: 0 }}>
      <div>
        <Eyebrow gold>
          {cat?.numeral} — {cat?.name}
        </Eyebrow>
        <h1 className="display" style={{ fontSize: 34, marginTop: 10, marginBottom: 8 }}>
          {quiz.title}
        </h1>
        <p className="lede">{quiz.deck}</p>
      </div>
      <div className="page-head-side">
        <button className="link-quiet" type="button" onClick={onBack}>
          Studio
        </button>
      </div>
    </div>
  );
}

export default function Written({ quiz, room, seat, update, onBack }) {
  if (quiz.kind === "open") return <OpenFlow quiz={quiz} room={room} seat={seat} update={update} onBack={onBack} />;
  if (quiz.kind === "toggle") return <ToggleFlow quiz={quiz} room={room} seat={seat} update={update} onBack={onBack} />;
  if (quiz.kind === "mirror") return <MirrorFlow quiz={quiz} room={room} seat={seat} update={update} onBack={onBack} />;
  return <CheckInFlow quiz={quiz} room={room} seat={seat} update={update} onBack={onBack} />;
}

/* ── long form, sealed ─────────────────────────────────────── */

function OpenFlow({ quiz, room, seat, update, onBack }) {
  const stored = room.data.answers?.[seat.seatId]?.[quiz.id];
  const mine = stored?.kind === "open" ? stored : null;
  const partnerSeat = room.seats.find((s) => s.id !== seat.seatId);
  const partnerStored = partnerSeat ? room.data.answers?.[partnerSeat.id]?.[quiz.id] : null;
  const partner = partnerStored?.kind === "open" ? partnerStored : null;

  const [values, setValues] = useState(mine?.values || {});
  const [editing, setEditing] = useState(!mine);
  const persist = usePersist(update, seat, quiz);
  const filled = quiz.questions.filter((q) => (values[q.id] || "").trim()).length;

  const save = () => {
    if (!filled) return;
    persist({ kind: "open", values, savedAt: Date.now(), ts: Date.now() });
    setEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      <SessionHead quiz={quiz} onBack={onBack} right={quiz.minutes === "open" ? "Open" : undefined} />
      <div className="quiz-wrap">
        <Intro quiz={quiz} onBack={onBack} />

        {editing ? (
          <>
            <div className="divider-label">
              <span>{quiz.questions.length} questions</span>
            </div>
            {quiz.questions.map((q, i) => (
              <div className="prompt-block" key={q.id}>
                <div className="prompt-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="prompt-q">{q.q}</div>
                {q.hint && <div className="prompt-hint">{q.hint}</div>}
                <textarea
                  className="textarea"
                  rows={3}
                  value={values[q.id] || ""}
                  placeholder="Write it plainly."
                  onChange={(e) => setValues((prev) => ({ ...prev, [q.id]: e.target.value }))}
                />
              </div>
            ))}
            <div className="btn-row" style={{ marginTop: 24 }}>
              <button className="btn btn-gold" type="button" onClick={save} disabled={!filled}>
                Seal my answers
              </button>
              <span className="eyebrow" style={{ lineHeight: 1.6 }}>
                {filled} of {quiz.questions.length} written
              </span>
            </div>
            <p className="lede" style={{ fontSize: 12, marginTop: 14 }}>
              You will not see their answers until your own are saved. You can
              revise yours afterwards, but not before.
            </p>
          </>
        ) : (
          <>
            <div className="saved-line">
              <Icon name="check" size={13} />
              <span>Sealed {shortDate(new Date(mine?.savedAt || Date.now()))}</span>
            </div>
            <p className="lede" style={{ marginBottom: 8, fontSize: 13 }}>
              Your answers are below. Theirs appear beside each question now that
              yours are written.
            </p>
            {!partner && <Locked name={partnerSeat?.name} />}

            {quiz.questions.map((q) => (
              <div className="prompt-block" key={q.id}>
                <div className="prompt-q" style={{ fontSize: 17 }}>
                  {q.q}
                </div>
                <p className="answer-mine">{values[q.id] || "—"}</p>
                {partner && (
                  <div className="partner-answer">
                    <div className="who">{partnerSeat?.name}</div>
                    <p>{partner.values?.[q.id] || "They left this one blank."}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="btn-row" style={{ marginTop: 26, justifyContent: "space-between" }}>
              <button className="btn btn-quiet" type="button" onClick={() => setEditing(true)}>
                Revise my answers
              </button>
              <button className="btn" type="button" onClick={onBack}>
                Back to the studio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── never have I ever ─────────────────────────────────────── */

function ToggleFlow({ quiz, room, seat, update, onBack }) {
  const stored = room.data.answers?.[seat.seatId]?.[quiz.id];
  const mine = stored?.kind === "toggle" ? stored : null;
  const partnerSeat = room.seats.find((s) => s.id !== seat.seatId);
  const partnerStored = partnerSeat ? room.data.answers?.[partnerSeat.id]?.[quiz.id] : null;
  const partner = partnerStored?.kind === "toggle" ? partnerStored : null;

  const [values, setValues] = useState(mine?.values || {});
  const [editing, setEditing] = useState(!mine);
  const persist = usePersist(update, seat, quiz);
  const marked = Object.values(values).filter(Boolean).length;

  const save = () => {
    persist({ kind: "toggle", values, savedAt: Date.now(), ts: Date.now() });
    setEditing(false);
  };

  return (
    <div className="page">
      <SessionHead quiz={quiz} onBack={onBack} />
      <div className="quiz-wrap">
        <Intro quiz={quiz} onBack={onBack} />

        {editing ? (
          <>
            <p className="eyebrow" style={{ margin: "18px 0 6px" }}>
              Mark what is true. {marked} marked.
            </p>
            <div style={{ borderTop: "1px solid var(--line-soft)", marginTop: 8 }}>
              {quiz.questions.map((q) => {
                const on = !!values[q.id];
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`toggle-row${on ? " on" : ""}`}
                    onClick={() => setValues((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                    aria-pressed={on}
                  >
                    <span className="toggle-box">{on && <Icon name="check" size={10} strokeWidth={2} />}</span>
                    <span>Never have I ever {q.q}.</span>
                  </button>
                );
              })}
            </div>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <button className="btn btn-gold" type="button" onClick={save}>
                Seal my answers
              </button>
              <span className="eyebrow">Marks are revealed together</span>
            </div>
          </>
        ) : (
          <>
            <div className="saved-line">
              <Icon name="check" size={13} />
              <span>Sealed. {marked} marked true.</span>
            </div>
            {!partner && <Locked name={partnerSeat?.name} />}
            {quiz.questions.map((q) => {
              const my = !!values[q.id];
              const their = partner ? !!partner.values?.[q.id] : null;
              return (
                <div className="toggle-compare" key={q.id}>
                  <div className="toggle-compare-q">Never have I ever {q.q}.</div>
                  <div className="compare-line">
                    <span className={my ? "yes" : ""}>You — {my ? "true" : "not true"}</span>
                    {partner && (
                      <span className={their ? "yes" : ""}>
                        {partnerSeat?.name} — {their ? "true" : "not true"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="btn-row" style={{ marginTop: 26, justifyContent: "space-between" }}>
              <button className="btn btn-quiet" type="button" onClick={() => setEditing(true)}>
                Change my marks
              </button>
              <button className="btn" type="button" onClick={onBack}>
                Back to the studio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── how well do you know me ───────────────────────────────── */

function MirrorFlow({ quiz, room, seat, update, onBack }) {
  const stored = room.data.answers?.[seat.seatId]?.[quiz.id];
  const mine = stored?.kind === "mirror" ? stored : null;
  const partnerSeat = room.seats.find((s) => s.id !== seat.seatId);
  const partnerStored = partnerSeat ? room.data.answers?.[partnerSeat.id]?.[quiz.id] : null;
  const partner = partnerStored?.kind === "mirror" ? partnerStored : null;

  const [self, setSelf] = useState(mine?.self || {});
  const [guess, setGuess] = useState(mine?.guess || {});
  const [editing, setEditing] = useState(!mine);
  const persist = usePersist(update, seat, quiz);
  const filled = quiz.questions.filter((q) => (self[q.id] || "").trim()).length;

  const save = () => {
    if (!filled) return;
    persist({ kind: "mirror", self, guess, savedAt: Date.now(), ts: Date.now() });
    setEditing(false);
  };

  const norm = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const matches = (a, b) => norm(a).length > 0 && norm(a) === norm(b);
  const myRight = partner
    ? quiz.questions.filter((q) => matches(guess[q.id], partner.self?.[q.id])).length
    : 0;
  const theirRight = partner
    ? quiz.questions.filter((q) => matches(partner.guess?.[q.id], self[q.id])).length
    : 0;

  return (
    <div className="page">
      <SessionHead quiz={quiz} onBack={onBack} />
      <div className="quiz-wrap">
        <Intro quiz={quiz} onBack={onBack} />

        {editing ? (
          <>
            <p className="lede" style={{ fontSize: 13, marginTop: 18, marginBottom: 6 }}>
              For each one: your own answer, then what you think theirs is. You
              are allowed to be wrong.
            </p>
            {quiz.questions.map((q, i) => (
              <div className="prompt-block" key={q.id}>
                <div className="prompt-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="prompt-q">{q.q}</div>
                <div className="mirror-form">
                  <div>
                    <span className="mini-label">You</span>
                    <textarea
                      className="textarea"
                      rows={2}
                      value={self[q.id] || ""}
                      placeholder="Your answer."
                      onChange={(e) => setSelf((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    />
                  </div>
                  <div>
                    <span className="mini-label">Your guess of them</span>
                    <textarea
                      className="textarea"
                      rows={2}
                      value={guess[q.id] || ""}
                      placeholder="What you think they wrote."
                      onChange={(e) => setGuess((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="btn-row" style={{ marginTop: 24 }}>
              <button className="btn btn-gold" type="button" onClick={save} disabled={!filled}>
                Seal my answers
              </button>
              <span className="eyebrow">
                {filled} of {quiz.questions.length}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="saved-line">
              <Icon name="check" size={13} />
              <span>Sealed {shortDate(new Date(mine?.savedAt || Date.now()))}</span>
            </div>

            {partner ? (
              <div className="match-stats">
                <div className="match-stat">
                  <div className="match-num">{myRight}</div>
                  <div className="match-label">
                    You read {partnerSeat?.name} right, exactly, out of {quiz.questions.length}
                  </div>
                </div>
                <div className="match-stat">
                  <div className="match-num">{theirRight}</div>
                  <div className="match-label">
                    They read you right, exactly, out of {quiz.questions.length}
                  </div>
                </div>
              </div>
            ) : (
              <Locked name={partnerSeat?.name} />
            )}

            {quiz.questions.map((q, i) => (
              <div className="mirror-block" key={q.id}>
                <div className="prompt-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="prompt-q" style={{ fontSize: 17, marginBottom: 12 }}>
                  {q.q}
                </div>
                <div className="mirror-cols">
                  <div>
                    <div className="mini-label">You wrote</div>
                    <p>{self[q.id] || "—"}</p>
                  </div>
                  <div>
                    <div className="mini-label">{partnerSeat?.name} wrote</div>
                    <p>{partner ? partner.self?.[q.id] || "—" : "Sealed"}</p>
                  </div>
                </div>
                <div className="mirror-cols mirror-guesses">
                  <div>
                    <div className="mini-label">Your guess of them</div>
                    <p>{guess[q.id] || "—"}</p>
                  </div>
                  <div>
                    <div className="mini-label">Their guess of you</div>
                    <p>{partner ? partner.guess?.[q.id] || "—" : "Sealed"}</p>
                  </div>
                </div>
                {partner && matches(guess[q.id], partner.self?.[q.id]) && (
                  <div className="match-flag">Read exactly</div>
                )}
              </div>
            ))}

            <div className="btn-row" style={{ marginTop: 26, justifyContent: "space-between" }}>
              <button className="btn btn-quiet" type="button" onClick={() => setEditing(true)}>
                Revise my answers
              </button>
              <button className="btn" type="button" onClick={onBack}>
                Back to the studio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── daily / weekly check-in ───────────────────────────────── */

function readValue(field, value) {
  if (value === undefined || value === null || value === "") return "—";
  if (field.type === "slider") return `${value} / 10`;
  return String(value);
}

function CheckInFlow({ quiz, room, seat, update, onBack }) {
  const stored = room.data.answers?.[seat.seatId]?.[quiz.id];
  const mine = stored?.kind === "checkin" ? stored : null;
  const partnerSeat = room.seats.find((s) => s.id !== seat.seatId);
  const partnerStored = partnerSeat ? room.data.answers?.[partnerSeat.id]?.[quiz.id] : null;
  const partner = partnerStored?.kind === "checkin" ? partnerStored : null;

  const [values, setValues] = useState(mine?.values || {});
  const [editing, setEditing] = useState(!mine);
  const persist = usePersist(update, seat, quiz);
  const isToday = mine?.day === todayISO();

  const save = () => {
    persist({
      kind: "checkin",
      values,
      day: todayISO(),
      savedAt: Date.now(),
      ts: Date.now(),
    });
    setEditing(false);
  };

  return (
    <div className="page">
      <SessionHead quiz={quiz} onBack={onBack} right={isToday && mine ? "Today" : undefined} />
      <div className="quiz-wrap">
        <Intro quiz={quiz} onBack={onBack} />

        {editing ? (
          <div style={{ marginTop: 22 }}>
            {quiz.fields.map((field) => (
              <div className="checkin-field" key={field.id}>
                <div className="checkin-label">{field.label}</div>
                {field.type === "slider" && (
                  <>
                    <div className="slider-value">{values[field.id] ?? 5}</div>
                    <input
                      className="slider"
                      type="range"
                      min={field.min || 1}
                      max={field.max || 10}
                      value={values[field.id] ?? 5}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [field.id]: Number(e.target.value) }))
                      }
                      aria-label={field.label}
                    />
                    <div className="slider-scale">
                      <span>{field.min || 1}</span>
                      <span>{field.max || 10}</span>
                    </div>
                  </>
                )}
                {field.type === "text" && (
                  <textarea
                    className="textarea"
                    rows={field.rows || 2}
                    value={values[field.id] || ""}
                    placeholder={field.placeholder || "Write it here."}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                    }
                  />
                )}
                {field.type === "choice" && (
                  <div className="tag-row">
                    {field.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`tag${values[field.id] === option ? " on" : ""}`}
                        onClick={() =>
                          setValues((prev) => ({
                            ...prev,
                            [field.id]: prev[field.id] === option ? "" : option,
                          }))
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="btn-row" style={{ marginTop: 24 }}>
              <button className="btn btn-gold" type="button" onClick={save}>
                {mine ? "Update my answers" : "Save today"}
              </button>
              {mine && (
                <button className="btn btn-quiet" type="button" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="saved-line">
              <Icon name="check" size={13} />
              <span>
                {isToday ? "Written today" : `Last written ${shortDate(new Date(mine?.savedAt || Date.now()))}`}
              </span>
            </div>

            <div className="sides">
              <div className="side">
                <div className="side-head">
                  <span className="side-name">You</span>
                  <span className="tag-static">Today</span>
                </div>
                {quiz.fields.map((field) => (
                  <div className="read-row" key={field.id}>
                    <div className="read-label">{field.label}</div>
                    <div className="read-value">{readValue(field, values[field.id])}</div>
                  </div>
                ))}
              </div>
              <div className="side">
                <div className="side-head">
                  <span className="side-name">{partnerSeat?.name || "Them"}</span>
                  {partner && (
                    <span className="tag-static">
                      {partner.day === todayISO()
                        ? "Today"
                        : shortDate(new Date(partner.savedAt || partner.ts))}
                    </span>
                  )}
                </div>
                {partner ? (
                  quiz.fields.map((field) => (
                    <div className="read-row" key={field.id}>
                      <div className="read-label">{field.label}</div>
                      <div className="read-value">
                        {readValue(field, partner.values?.[field.id])}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="side-empty">
                    {partnerSeat
                      ? `Nothing from ${partnerSeat.name} yet. They will appear here after they write theirs.`
                      : "The second chair is still empty."}
                  </p>
                )}
              </div>
            </div>

            <div className="btn-row" style={{ marginTop: 22, justifyContent: "space-between" }}>
              <button className="btn btn-quiet" type="button" onClick={() => setEditing(true)}>
                {isToday ? "Update today" : "Write again"}
              </button>
              <button className="btn" type="button" onClick={onBack}>
                Back to the studio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

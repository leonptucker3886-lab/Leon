"use client";

import { categories, sessions, byId, sessionNumeral } from "@/lib/data";
import { longDate, greeting, shortDate, relativeDay, todayISO } from "@/lib/format";
import { Eyebrow, Plate, Meter } from "./ui";
import Icon from "./Icons";

export default function Today({ room, seat, go, openSession, openRoom }) {
  const me = room.seats.find((s) => s.id === seat.seatId);
  const partner = room.seats.find((s) => s.id !== seat.seatId);
  const done = room.data.done?.[seat.seatId] || {};
  const doneCount = Object.keys(done).length;
  const now = greeting(me?.name);
  const today = todayISO();
  const upcoming = [...(room.data.events || [])]
    .filter((e) => e.date >= today)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, 4);

  const nextUp = sessions.filter((s) => !done[s.id]).slice(0, 4);
  const checkIn = byId["check-in"];
  const sharedNotes = (room.data.notes || []).filter((n) => n.shared).length;

  return (
    <div className="page">
      <section className="today-hero">
        <div>
          <Eyebrow>{longDate()}</Eyebrow>
          <h1 className="today-greet">
            {now.text}
            <br />
            <em>{me?.name || "you"}</em>.
          </h1>
          <p className="today-line">
            {partner
              ? `${partner.name} has the other chair. Nothing written here is seen by anyone else.`
              : "The second chair is empty for now. Give them the code when you are ready — the room stays closed to everyone else."}
          </p>
          <div className="btn-row">
            <button className="btn btn-gold" type="button" onClick={() => openSession("check-in")}>
              The daily check-in
              <Icon name="arrowRight" size={14} />
            </button>
            <button className="btn btn-quiet" type="button" onClick={() => go("studio")}>
              Twenty sessions
            </button>
          </div>
        </div>

        <div className="today-art">
          <Plate
            src="/plates/daily.jpg"
            alt="Morning light across an unmade bed and two cups"
            meta="V — Daily"
            title="Six questions, once a day."
            deck="Do not perform the answers."
            mark={sessionNumeral(checkIn)}
            onClick={() => openSession("check-in")}
          />
        </div>
      </section>

      <section className="stat-row" aria-label="The room at a glance">
        <div className="stat stat-gold">
          <div className="stat-num">{upcoming.length}</div>
          <div className="stat-label">Ahead</div>
        </div>
        <div className="stat">
          <div className="stat-num">
            {doneCount}
            <span style={{ fontSize: 14, color: "var(--ash)" }}> / {sessions.length}</span>
          </div>
          <div className="stat-label">Sessions by you</div>
        </div>
        <div className="stat stat-sage">
          <div className="stat-num">{sharedNotes}</div>
          <div className="stat-label">Shared notes</div>
        </div>
        <div className="stat stat-sea">
          <div className="stat-num">{(room.data.boundaries || []).length}</div>
          <div className="stat-label">Boundaries</div>
        </div>
      </section>

      <div className="home-columns">
        <section>
          <div className="section-head">
            <h2>To sit with</h2>
            <button className="link-quiet" type="button" onClick={() => go("studio")}>
              All sessions
            </button>
          </div>

          <div className="studio-progress" style={{ marginBottom: 18 }}>
            <Meter value={(doneCount / sessions.length) * 100} />
            <span className="count">
              {doneCount} of {sessions.length}
            </span>
          </div>

          {nextUp.length === 0 ? (
            <div className="empty">
              <div className="display-sm">Every session has been written.</div>
              <p>
                Go back through the ones that moved something. The second time is
                usually a different conversation.
              </p>
            </div>
          ) : (
            <div className="row-list">
              {nextUp.map((s) => (
                <button
                  key={s.id}
                  className="row"
                  type="button"
                  onClick={() => openSession(s.id)}
                >
                  <span className="row-num">{sessionNumeral(s)}</span>
                  <span>
                    <span className="row-title">{s.title}</span>
                    <span className="row-meta">
                      {s.minutes === "open" ? "Open-ended" : `${s.minutes} min`} ·{" "}
                      {categories.find((c) => c.id === s.cat)?.name}
                    </span>
                  </span>
                  <span className="row-arrow">
                    <Icon name="arrowRight" size={15} />
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <aside>
          {!partner && (
            <div className="aside-note" style={{ marginBottom: 22 }}>
              <Eyebrow gold>The second chair</Eyebrow>
              <div className="aside-code">{room.code}</div>
              <p>
                Give this code to them. It is the only key to this room, and it
                seats exactly one more person.
              </p>
              <button
                className="btn btn-sm"
                style={{ marginTop: 14 }}
                type="button"
                onClick={openRoom}
              >
                Share the code
              </button>
            </div>
          )}

          <div className="section-head">
            <h2>Ahead</h2>
            <button className="link-quiet" type="button" onClick={() => go("calendar")}>
              Calendar
            </button>
          </div>

          {upcoming.length === 0 ? (
            <div className="empty" style={{ padding: "26px 20px" }}>
              <div className="display-sm" style={{ fontSize: 20 }}>
                Nothing on the calendar.
              </div>
              <p>Put one thing there. A date is easier to keep once it is written.</p>
            </div>
          ) : (
            <div className="upcoming">
              {upcoming.map((event) => (
                <div className="upcoming-item" key={event.id}>
                  <div className="upcoming-date">
                    {shortDate(event.date).split(" ")[0]}
                    <span>{shortDate(event.date).split(" ")[1]}</span>
                  </div>
                  <div>
                    <div className="upcoming-title">{event.title}</div>
                    <div className="upcoming-meta">
                      {relativeDay(event.date) || shortDate(event.date)}
                      {event.by ? ` · ${event.by}` : ""}
                    </div>
                  </div>
                  <span
                    className="event-type"
                    style={{
                      background:
                        event.type === "anniversary"
                          ? "var(--gold)"
                          : event.type === "birthday"
                          ? "var(--rust)"
                          : event.type === "reminder"
                          ? "var(--sea)"
                          : "var(--sage)",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="aside-note" style={{ marginTop: 28 }}>
            <Eyebrow>The room</Eyebrow>
            <p style={{ marginTop: 8 }}>
              {me?.name}
              {partner ? ` and ${partner.name}` : " — one seat open"}. Code{" "}
              <span style={{ color: "var(--gold)", letterSpacing: ".16em" }}>
                {room.code}
              </span>
              . No account, no server, no third party.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { createRoom, joinRoom, localSeats, getRoom, writeSession } from "@/lib/store";
import { pullRoom, pushRoom } from "@/lib/cloud";
import { Mark, Eyebrow, Plate } from "./ui";
import Icon from "./Icons";
import SyncLine from "./SyncLine";

export default function Onboarding({ onReady }) {
  const [step, setStep] = useState("landing");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [seats, setSeats] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSeats(
      localSeats().filter((entry) => {
        const room = getRoom(entry.code);
        return !!room && room.seats.some((s) => s.id === entry.seatId);
      })
    );
  }, []);

  const create = () => {
    if (busy) return;
    const result = createRoom(name);
    if (result.error) {
      setError(result.error);
      return;
    }
    onReady(result.session, result.room);
    pushRoom(result.room);
  };

  const join = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    /* On a device that has never held this room, fetch it before claiming a seat. */
    await pullRoom(code);
    const result = joinRoom(code, name);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onReady(result.session, result.room);
    pushRoom(result.room);
  };

  const resume = (entry) => {
    const room = getRoom(entry.code);
    if (!room) return;
    const session = { code: entry.code, seatId: entry.seatId, name: entry.name };
    writeSession(session);
    onReady(session, room);
  };

  const pairLabel = useMemo(() => {
    if (!seats.length) return null;
    return seats.length === 1 ? "One room on this device" : "Rooms on this device";
  }, [seats]);

  return (
    <div className="gate">
      <div className="gate-left">
        <Mark size={92} />
        <h1 className="gate-claim">
          A private room
          <br />
          for <em>two.</em>
        </h1>
        <p className="gate-note">
          No feed. No audience. Twenty guided sessions, a shared calendar, and a
          third chair for the things you cannot say to each other yet.
        </p>

        {step === "landing" && (
          <div className="gate-form">
            <div className="btn-row">
              <button
                className="btn btn-gold"
                onClick={() => {
                  setStep("create");
                  setError("");
                }}
                type="button"
              >
                Create a room
                <Icon name="arrowRight" size={14} />
              </button>
              <button
                className="btn btn-quiet"
                onClick={() => {
                  setStep("join");
                  setError("");
                }}
                type="button"
              >
                Join with a code
              </button>
            </div>
            <p className="eyebrow" style={{ marginTop: 26, lineHeight: 1.9 }}>
              Two seats. Everything inside is private to the two of you.
            </p>
            <SyncLine className="gate-sync" />

            {seats.length > 0 && (
              <div className="gate-return">
                <Eyebrow>{pairLabel}</Eyebrow>
                <div style={{ marginTop: 8 }}>
                  {seats.map((entry) => (
                    <button
                      key={`${entry.code}-${entry.seatId}`}
                      className="seat-return"
                      onClick={() => resume(entry)}
                      type="button"
                    >
                      <span>
                        Continue as {entry.name}
                      </span>
                      <span className="code">{entry.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === "create" && (
          <div className="gate-form">
            <button
              className="link-quiet gate-back"
              onClick={() => {
                setStep("landing");
                setError("");
              }}
              type="button"
            >
              <Icon name="arrowLeft" size={12} /> Back
            </button>
            <Eyebrow gold>First seat</Eyebrow>
            <h2 className="display-sm" style={{ margin: "9px 0 6px" }}>
              What should we call you?
            </h2>
            <p className="lede" style={{ fontSize: 13, marginBottom: 20 }}>
              Your name is the only thing you need. You will get a six-character
              code to give them.
            </p>
            <input
              className="input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Your name"
              maxLength={40}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") create();
              }}
            />
            {error && <div className="gate-error">{error}</div>}
            <button
              className="btn btn-gold btn-block"
              style={{ marginTop: 14 }}
              onClick={create}
              type="button"
            >
              Create the room
            </button>
          </div>
        )}

        {step === "join" && (
          <div className="gate-form">
            <button
              className="link-quiet gate-back"
              onClick={() => {
                setStep("landing");
                setError("");
              }}
              type="button"
            >
              <Icon name="arrowLeft" size={12} /> Back
            </button>
            <Eyebrow gold>Second seat</Eyebrow>
            <h2 className="display-sm" style={{ margin: "9px 0 6px" }}>
              Join them.
            </h2>
            <p className="lede" style={{ fontSize: 13, marginBottom: 20 }}>
              They will have a six-character code. The code is the only key to
              the room.
            </p>
            <input
              className="input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Your name"
              maxLength={40}
              autoFocus
              style={{ marginBottom: 10 }}
            />
            <input
              className="input code-input"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                setError("");
              }}
              placeholder="CODE"
              maxLength={6}
              aria-label="Six character room code"
              onKeyDown={(e) => {
                if (e.key === "Enter") join();
              }}
            />
            {error && <div className="gate-error">{error}</div>}
            <button
              className="btn btn-gold btn-block"
              style={{ marginTop: 14 }}
              onClick={join}
              type="button"
              disabled={code.length !== 6 || busy}
            >
              {busy ? "Looking for the room" : "Enter the room"}
            </button>
          </div>
        )}
      </div>

      <div className="gate-right" aria-hidden="true">
        <div className="gate-plate-wrap">
          <Plate
            src="/plates/daily.jpg"
            alt="Morning light across linen and two stoneware cups"
            meta="Plate I"
            title="The ordinary upkeep of two people."
            mark="us."
            wide
          />
          <div className="gate-plate-caption">
            <span>Private by design</span>
            <span>No accounts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

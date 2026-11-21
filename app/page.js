"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getRoom,
  getSession,
  saveRoom,
  watchRoom,
  clearSession,
} from "@/lib/store";
import { queuePush, watchCloud } from "@/lib/cloud";
import { byId } from "@/lib/data";
import Shell from "@/components/Shell";
import Onboarding from "@/components/Onboarding";
import Today from "@/components/Today";
import Studio from "@/components/studio/Studio";
import SessionEntry from "@/components/studio/Session";
import Wheel from "@/components/Wheel";
import CalendarView from "@/components/Calendar";
import Notes from "@/components/Notes";
import Boundaries from "@/components/Boundaries";
import ThirdChair from "@/components/ThirdChair";
import { Mark } from "@/components/ui";

export default function Page() {
  const [phase, setPhase] = useState("loading");
  const [session, setSession] = useState(null);
  const [room, setRoom] = useState(null);
  const [view, setView] = useState("today");
  const [openId, setOpenId] = useState(null);
  const [roomOpen, setRoomOpen] = useState(false);
  const roomRef = useRef(null);

  useEffect(() => {
    const existing = getSession();
    if (existing) {
      const found = getRoom(existing.code);
      if (found) {
        roomRef.current = found;
        setSession(existing);
        setRoom(found);
        setPhase("ready");
        return;
      }
    }
    setPhase("gate");
  }, []);

  useEffect(() => {
    if (!session?.code) return undefined;
    return watchRoom(session.code, () => {
      const fresh = getRoom(session.code);
      if (!fresh) return;
      roomRef.current = fresh;
      setRoom(fresh);
      setSession((prev) => {
        if (!prev) return prev;
        const seat = fresh.seats.find((s) => s.id === prev.seatId);
        if (!seat) return prev;
        return { ...prev, name: seat.name };
      });
    });
  }, [session?.code]);

  /* A second device in the same room writes here; the room is theirs too. */
  useEffect(() => {
    if (!session?.code) return undefined;
    return watchCloud(session.code, (fresh) => {
      roomRef.current = fresh;
      setRoom(fresh);
      setSession((prev) => {
        if (!prev) return prev;
        const seat = fresh.seats.find((s) => s.id === prev.seatId);
        if (!seat) return prev;
        return { ...prev, name: seat.name };
      });
    });
  }, [session?.code]);

  const update = useCallback((mutator) => {
    const current = roomRef.current;
    if (!current) return;
    const draft =
      typeof structuredClone === "function"
        ? structuredClone(current)
        : JSON.parse(JSON.stringify(current));
    mutator(draft);
    roomRef.current = draft;
    saveRoom(draft);
    queuePush(draft);
    setRoom(draft);
  }, []);

  const ready = (seatSession, seatRoom) => {
    roomRef.current = seatRoom;
    setSession(seatSession);
    setRoom(seatRoom);
    setView("today");
    setOpenId(null);
    setPhase("ready");
  };

  const leave = () => {
    clearSession();
    roomRef.current = null;
    setSession(null);
    setRoom(null);
    setOpenId(null);
    setRoomOpen(false);
    setPhase("gate");
  };

  const go = (next) => {
    setOpenId(null);
    setView(next);
    setRoomOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSession = (id) => {
    if (!byId[id]) return;
    setOpenId(id);
    setView("studio");
    setRoomOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (phase === "loading") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <Mark size={54} className="breathe" />
        <div className="eyebrow">Opening the room</div>
      </div>
    );
  }

  if (phase === "gate" || !session || !room) {
    return <Onboarding onReady={ready} />;
  }

  const quiz = openId ? byId[openId] : null;

  return (
    <Shell
      room={room}
      seat={session}
      view={view}
      onNav={go}
      onOpenRoom={() => setRoomOpen(true)}
      roomOpen={roomOpen}
      onCloseRoom={() => setRoomOpen(false)}
      onLeave={leave}
      hideNav={!!quiz}
    >
      {quiz ? (
        <SessionEntry
          key={quiz.id}
          quiz={quiz}
          room={room}
          seat={session}
          update={update}
          onBack={() => {
            setOpenId(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ) : view === "today" ? (
        <Today
          room={room}
          seat={session}
          go={go}
          openSession={openSession}
          openRoom={() => setRoomOpen(true)}
        />
      ) : view === "studio" ? (
        <Studio room={room} seat={session} openSession={openSession} />
      ) : view === "wheel" ? (
        <Wheel room={room} seat={session} update={update} />
      ) : view === "calendar" ? (
        <CalendarView room={room} seat={session} update={update} />
      ) : view === "notes" ? (
        <Notes room={room} seat={session} update={update} />
      ) : view === "bounds" ? (
        <Boundaries room={room} seat={session} update={update} />
      ) : (
        <ThirdChair room={room} seat={session} update={update} />
      )}
    </Shell>
  );
}

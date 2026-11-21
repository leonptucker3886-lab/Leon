"use client";

const PREFIX = "us.room.";
const SESSION_KEY = "us.seat";
const SEATS_KEY = "us.seats.v1";
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function hasWindow() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function emptyRoom(code) {
  return {
    v: 1,
    code,
    createdAt: Date.now(),
    seats: [],
    data: {
      events: [],
      ideas: {},
      notes: [],
      boundaries: [],
      cases: [],
      answers: {},
      done: {},
    },
  };
}

export function newCode() {
  let out = "";
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint8Array(6);
    crypto.getRandomValues(buf);
    for (let i = 0; i < 6; i += 1) out += ALPHABET[buf[i] % ALPHABET.length];
    return out;
  }
  for (let i = 0; i < 6; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function normaliseRoom(room) {
  const base = emptyRoom(room.code);
  return {
    ...base,
    ...room,
    seats: Array.isArray(room.seats) ? room.seats : [],
    data: { ...base.data, ...(room.data || {}) },
  };
}

export function getRoom(code) {
  if (!hasWindow() || !code) return null;
  try {
    const raw = window.localStorage.getItem(PREFIX + code);
    if (!raw) return null;
    return normaliseRoom(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveRoom(room) {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(PREFIX + room.code, JSON.stringify(room));
  } catch {
    /* storage full or unavailable; the session keeps working in memory */
  }
}

export function createRoom(name) {
  const clean = String(name || "").trim().slice(0, 40);
  if (!clean) return { error: "A name is required." };
  let code = newCode();
  let guard = 0;
  while (getRoom(code) && guard < 20) {
    code = newCode();
    guard += 1;
  }
  const room = emptyRoom(code);
  const seat = { id: newId(), name: clean, at: Date.now() };
  room.seats = [seat];
  saveRoom(room);
  const session = { code, seatId: seat.id, name: clean };
  writeSession(session);
  rememberSeat(room, session);
  return { room, session };
}

export function joinRoom(rawCode, name) {
  const code = String(rawCode || "").trim().toUpperCase();
  const clean = String(name || "").trim().slice(0, 40);
  if (!clean) return { error: "A name is required." };
  if (code.length !== 6) return { error: "A room code is six characters." };
  const room = getRoom(code);
  if (!room) return { error: "No room with that code. Check it with them." };

  const existing = room.seats.find(
    (s) => s.name.toLowerCase() === clean.toLowerCase()
  );
  if (existing) {
    const session = { code, seatId: existing.id, name: existing.name };
    writeSession(session);
    rememberSeat(room, session);
    return { room, session };
  }
  if (room.seats.length >= 2) {
    return { error: "Both seats in this room are taken." };
  }
  const seat = { id: newId(), name: clean, at: Date.now() };
  room.seats = [...room.seats, seat];
  saveRoom(room);
  const session = { code, seatId: seat.id, name: clean };
  writeSession(session);
  rememberSeat(room, session);
  return { room, session };
}

export function getSession() {
  if (!hasWindow()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || !s.code || !s.seatId) return null;
    const room = getRoom(s.code);
    if (!room) return null;
    const seat = room.seats.find((x) => x.id === s.seatId);
    if (!seat) return null;
    return { code: s.code, seatId: seat.id, name: seat.name };
  } catch {
    return null;
  }
}

export function writeSession(session) {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function localSeats() {
  if (!hasWindow()) return [];
  try {
    const raw = window.localStorage.getItem(SEATS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function rememberSeat(room, session) {
  if (!hasWindow() || !session) return;
  try {
    const raw = window.localStorage.getItem(SEATS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    const entry = {
      code: room.code,
      seatId: session.seatId,
      name: session.name,
      at: Date.now(),
    };
    const next = [
      entry,
      ...list.filter((x) => !(x.code === entry.code && x.seatId === entry.seatId)),
    ].slice(0, 8);
    window.localStorage.setItem(SEATS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function forgetSeat(code, seatId) {
  if (!hasWindow()) return;
  try {
    const raw = window.localStorage.getItem(SEATS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    window.localStorage.setItem(
      SEATS_KEY,
      JSON.stringify(list.filter((x) => !(x.code === code && x.seatId === seatId)))
    );
  } catch {
    /* ignore */
  }
}

export function seatById(room, seatId) {
  if (!room) return null;
  return room.seats.find((s) => s.id === seatId) || null;
}

export function partnerOf(room, seatId) {
  if (!room) return null;
  return room.seats.find((s) => s.id !== seatId) || null;
}

export function seatName(room, seatId) {
  const seat = seatById(room, seatId);
  return seat ? seat.name : "—";
}

export function ideasFor(room, base) {
  const extra = Object.values(room?.data?.ideas || {}).flat();
  const seen = new Set();
  const out = [];
  [...base, ...extra].forEach((idea) => {
    const key = String(idea).trim().toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(String(idea).trim());
  });
  return out;
}

export function watchRoom(code, onChange) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event) => {
    if (event.key === PREFIX + code) onChange();
  };
  const onFocus = () => onChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", onFocus);
  document.addEventListener("visibilitychange", onFocus);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("focus", onFocus);
    document.removeEventListener("visibilitychange", onFocus);
  };
}

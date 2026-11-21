"use client";

import { getRoom, saveRoom, normaliseRoom } from "./store.js";

/*
 * Firebase is optional. With no NEXT_PUBLIC_FIREBASE_* variables the app is a
 * local-only room on this device, exactly as before. With them set, the room
 * document in Firestore is the shared truth and every seat sees the same room.
 *
 * Nothing here runs until the app is in a browser and a config exists, so the
 * Firebase SDK is only downloaded when it is actually used.
 */

const FIRESTORE_COLLECTION = "rooms";

function readConfig() {
  const cfg = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  Object.keys(cfg).forEach((key) => {
    cfg[key] = typeof cfg[key] === "string" ? cfg[key].trim() : "";
  });
  if (!cfg.apiKey || !cfg.projectId || !cfg.appId) return null;
  return cfg;
}

export function cloudConfig() {
  return readConfig();
}

export function cloudEnabled() {
  return readConfig() !== null;
}

/* ---------------------------------------------------------------- status -- */

let state = {
  mode: cloudEnabled() ? "syncing" : "local",
  note: "",
  at: 0,
};

const listeners = new Set();

export function statusSnapshot() {
  return state;
}

export function subscribeStatus(cb) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function setStatus(patch) {
  state = { ...state, ...patch };
  listeners.forEach((cb) => cb());
}

function readable(err) {
  const code = err && err.code ? String(err.code) : "";
  if (code === "permission-denied") return "The database refused the room. Check the Firestore rules.";
  if (code === "failed-precondition") return "This project has no Firestore database yet.";
  if (code === "unavailable") return "The room is unreachable right now.";
  if (code === "unauthenticated") return "The database wants a sign-in this room does not use.";
  return "The room could not be reached.";
}

/* ------------------------------------------------------------------- sdk -- */

let sdkPromise = null;
let lastWrite = 0;

async function sdk() {
  const cfg = readConfig();
  if (!cfg) return null;
  if (!sdkPromise) {
    sdkPromise = (async () => {
      const appMod = await import("firebase/app");
      const dbMod = await import("firebase/firestore");
      const app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(cfg);
      const db = dbMod.getFirestore(app);
      return { db, ...dbMod };
    })().catch((err) => {
      sdkPromise = null;
      setStatus({ mode: "error", note: readable(err) });
      throw err;
    });
  }
  return sdkPromise;
}

/* --------------------------------------------------------------- payload -- */

/*
 * A note marked private belongs to the person who wrote it on the device that
 * wrote it, so it is never sent anywhere. Shared notes travel with the room.
 */
export function stripPrivate(room) {
  const data = room && room.data ? room.data : {};
  return {
    v: room.v || 1,
    code: room.code,
    createdAt: room.createdAt || Date.now(),
    seats: Array.isArray(room.seats) ? room.seats : [],
    data: {
      ...data,
      notes: (Array.isArray(data.notes) ? data.notes : []).filter((n) => n && n.shared),
    },
  };
}

/*
 * The database owns the shared half of the room. The only thing kept from this
 * device is what was never shared: private notes, and a seat this device has
 * already claimed (so a slow write can never orphan either person).
 */
export function mergeRooms(local, remote) {
  const out = normaliseRoom(remote);
  const seats = [];
  const seen = new Set();
  [...(out.seats || []), ...((local && local.seats) || [])].forEach((seat) => {
    if (!seat || !seat.id || seen.has(seat.id) || seats.length >= 2) return;
    seen.add(seat.id);
    seats.push(seat);
  });
  out.seats = seats;

  const privateNotes = ((local && local.data && local.data.notes) || []).filter(
    (n) => n && !n.shared
  );
  const seenNotes = new Set();
  /* Nothing private is ever adopted from the database, whatever it contains. */
  out.data.notes = [
    ...(out.data.notes || []).filter((n) => n && n.shared),
    ...privateNotes,
  ].filter((n) => {
    if (!n || seenNotes.has(n.id)) return false;
    seenNotes.add(n.id);
    return true;
  });
  return out;
}

function sameSynced(a, b) {
  try {
    return (
      JSON.stringify(stripPrivate(a).data) === JSON.stringify(stripPrivate(b).data) &&
      JSON.stringify(a.seats) === JSON.stringify(b.seats)
    );
  } catch {
    return false;
  }
}

/* ----------------------------------------------------------------- reads -- */

/*
 * Pull one room from the database into this device before a seat is claimed,
 * so joining works on a phone that has never seen the room.
 */
export async function pullRoom(code) {
  if (!readConfig()) return false;
  try {
    const s = await sdk();
    const snap = await s.getDoc(s.doc(s.db, FIRESTORE_COLLECTION, code));
    if (!snap.exists()) return false;
    const payload = snap.data() || {};
    if (!payload.room) return false;
    const remote = mergeRooms(getRoom(code), { code, ...payload.room });
    saveRoom(remote);
    setStatus({ mode: "synced", note: "", at: payload.updated || Date.now() });
    return true;
  } catch (err) {
    setStatus({ mode: "error", note: readable(err) });
    return false;
  }
}

/* ---------------------------------------------------------------- writes -- */

export async function pushRoom(room) {
  if (!readConfig() || !room || !room.code) return;
  try {
    const s = await sdk();
    const updated = Date.now();
    lastWrite = updated;
    await s.setDoc(s.doc(s.db, FIRESTORE_COLLECTION, room.code), {
      room: stripPrivate(room),
      updated,
    });
    setStatus({ mode: "synced", note: "", at: updated });
  } catch (err) {
    setStatus({ mode: "error", note: readable(err) });
  }
}

let pending = null;
let timer = null;

/* Coalesces a burst of edits into a single write. */
export function queuePush(room) {
  if (!readConfig() || !room) return;
  pending = room;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    const next = pending;
    pending = null;
    timer = null;
    if (next) pushRoom(next);
  }, 320);
}

/* --------------------------------------------------------------- watch -- */

export function watchCloud(code, onRoom) {
  if (!readConfig() || typeof window === "undefined") return () => {};
  let stop = () => {};
  let dead = false;

  (async () => {
    try {
      const s = await sdk();
      const ref = s.doc(s.db, FIRESTORE_COLLECTION, code);
      const unsub = s.onSnapshot(
        ref,
        (snap) => {
          if (dead) return;
          if (!snap.exists()) {
            const local = getRoom(code);
            if (local) pushRoom(local);
            return;
          }
          const payload = snap.data() || {};
          if (!payload.room) return;
          const remote = normaliseRoom({ code, ...payload.room });
          const local = getRoom(code);
          if (!local) return;
          if (sameSynced(local, remote)) {
            setStatus({ mode: "synced", note: "", at: payload.updated || Date.now() });
            return;
          }
          /* Our own write coming back, or a snapshot older than what we hold. */
          if (payload.updated && payload.updated < lastWrite) return;
          const merged = mergeRooms(local, remote);
          saveRoom(merged);
          setStatus({ mode: "synced", note: "", at: payload.updated || Date.now() });
          onRoom(merged);
        },
        (err) => setStatus({ mode: "error", note: readable(err) })
      );
      if (dead) unsub();
      else stop = unsub;
    } catch (err) {
      setStatus({ mode: "error", note: readable(err) });
    }
  })();

  return () => {
    dead = true;
    stop();
  };
}

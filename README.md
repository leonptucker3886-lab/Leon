# us.

A private room for two. Twenty guided sessions, a date wheel, a shared
calendar, notes, a boundary wall, and a third chair for the things that are
hard to say directly.

No accounts. No analytics. No third-party scripts. No environment variables
needed to run it on one device. Add your own Firebase project and the same
room opens on both your phones; leave it out and nothing leaves the browser.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run build
npm start
```

## The two seats

A room is created with a name and a six-character code. The code is the only
key; there is exactly one second seat. A partner joins with the code and their
own name.

State is stored under `us.room.<CODE>` in `localStorage` and, when Firebase is
configured, mirrored to a Firestore document with the same code. Either way
the room is private to the code: no account, no directory, no way to list
rooms.

Without Firebase the room lives on the browser profile that holds it. A second
tab joined with the code takes the second seat, and the two tabs sync live
through storage events. The seat picker on the gate remembers rooms already
used on this device.

With Firebase the two of you can sit in the room from different phones or
laptops. Every edit is written to the room document and every other open seat
receives it within a moment. Private notes are the exception: a note you have
not shared is never uploaded, so it stays on the device that wrote it. Shared
notes, answers, dates and boundaries travel.

The code plus a name is the identity check in both modes. Treat the code the
way you would treat a key.

## Firebase (optional)

The app runs without it. To share a room between devices:

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com),
   add a **Web app**, and copy the config values it shows.
2. Create a **Firestore database** in production mode.
3. Publish the rules in `firestore.rules`. They allow reading and writing a
   room by its exact code, refuse listing the collection, and close everything
   else.
4. Copy `.env.example` to `.env.local` and fill in the six values.
5. Restart `npm run dev`.

The variables are read at build time, so a deploy needs them set in the host's
environment. Nothing runs until the app is in a browser and a config exists;
without one the Firebase SDK is never downloaded.

Two things the rules cannot do: prove that whoever holds a code earned it, and
keep one seat from overwriting the room. The code is the whole key, so share it
as you would share a key, and expect the last write to win if you both save in
the same instant.

## Sessions

Five categories, four answer shapes:

- **Choice** — tallied into a written profile and a percentage breakdown.
- **Scale** — ten statements, a score, and a reading for the band you land in.
- **Pairs** — this-or-that; each side is compared round by round.
- **Written** — long answers and toggles. Your partner's answers stay sealed
  until your own are saved. The "how well do you know me" session additionally
  asks you to guess their answers and scores the exact matches.
- **Check-in** — daily and weekly forms with sliders, text, and choices.

Choice, scale, and pair results are stored per seat so both partners can
compare. A completed session can be written again; that clears only your own
answers.

## The third chair

Both partners write their side of a disagreement. The reading names where the
accounts overlap, reflects what each person is actually asking for, and gives
one concrete next step. It deliberately does not declare a winner.

The reading is composed locally by `lib/reader.js` from the two accounts. It
uses no model, no key, and no network, so the feature works out of the box and
nothing intimate leaves the device. The result is saved into the case so both
partners see the same reading.

## Design

Ink ground, film grain, gold hairlines, bone type. Fraunces for display and
Inter for text, loaded through `next/font` at build time (self-hosted, no
runtime request to a third party). Custom 1.4px line icons; no emoji anywhere.

Photographic plates live in `public/plates/` and appear at 3:4 inside a thin
gold frame with a bottom scrim and a serif title.

## Structure

```
app/                 layout, page shell, global styles
components/
  studio/            hub, runners, written flows, results
  Shell.js           rail, mobile bar, room sheet
  Onboarding.js      create / join / return
  Today.js           home
  Wheel.js           date wheel
  Calendar.js        shared calendar
  Notes.js           private and shared notes
  Boundaries.js      boundary wall
  ThirdChair.js      mediation
lib/
  data/              twenty sessions, categories, date ideas
  store.js           local room model
  cloud.js           optional Firebase sync
  reader.js          local impartial reading
  format.js          date helpers
```

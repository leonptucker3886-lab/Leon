import { foundation } from "./foundation";
import { deep } from "./deep";
import { play } from "./play";
import { growth } from "./growth";
import { daily } from "./daily";

export const categories = [
  {
    id: "foundation",
    numeral: "I",
    name: "Foundation",
    line: "How each of you is built.",
    plate: "/plates/foundation.jpg",
  },
  {
    id: "deep",
    numeral: "II",
    name: "Deep",
    line: "The rooms you rarely open.",
    plate: "/plates/deep.jpg",
  },
  {
    id: "play",
    numeral: "III",
    name: "Play",
    line: "Light, and more revealing than it looks.",
    plate: "/plates/play.jpg",
  },
  {
    id: "growth",
    numeral: "IV",
    name: "Growth",
    line: "Where this is going.",
    plate: "/plates/growth.jpg",
  },
  {
    id: "daily",
    numeral: "V",
    name: "Daily",
    line: "The ordinary upkeep of two people.",
    plate: "/plates/daily.jpg",
  },
];

export const sessions = [...foundation, ...deep, ...play, ...growth, ...daily];

export const byId = Object.fromEntries(sessions.map((s) => [s.id, s]));

export function categoryOf(id) {
  return categories.find((c) => c.id === id) || categories[0];
}

export const sessionCount = sessions.length;

export function sessionNumeral(session) {
  const list = sessions.filter((s) => s.cat === session.cat);
  const index = list.findIndex((s) => s.id === session.id);
  return `${categoryOf(session.cat).numeral}.${index + 1}`;
}

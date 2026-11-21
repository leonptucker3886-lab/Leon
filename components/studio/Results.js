"use client";

import { categories, sessionNumeral } from "@/lib/data";
import { Eyebrow, Meter } from "../ui";
import Icon from "../Icons";

const PALETTE = ["#c8a558", "#d98b4a", "#7f9682", "#5d8f93", "#9c4a32"];

function ResultHead({ quiz, children }) {
  return (
    <div className="result-hero">
      <div className="result-kicker">
        {categories.find((c) => c.id === quiz.cat)?.numeral} —{" "}
        {categories.find((c) => c.id === quiz.cat)?.name} · {sessionNumeral(quiz)}
      </div>
      {children}
    </div>
  );
}

function Actions({ onBack, onRetake, retakeLabel = "Write it again" }) {
  return (
    <div className="btn-row" style={{ marginTop: 30, justifyContent: "space-between" }}>
      <button className="btn btn-quiet" type="button" onClick={onBack}>
        <Icon name="arrowLeft" size={13} />
        Back to the studio
      </button>
      <button className="btn" type="button" onClick={onRetake}>
        {retakeLabel}
      </button>
    </div>
  );
}

export function ChoiceResult({ quiz, payload, onBack, onRetake }) {
  const profile = quiz.profiles?.[payload.key];
  const total = payload.tally.reduce((sum, t) => sum + t.count, 0) || 1;
  return (
    <div className="quiz-wrap">
      <ResultHead quiz={quiz}>
        <div className="result-name">{profile?.title || "Your profile"}</div>
        <div className="eyebrow" style={{ marginTop: 4 }}>
          {quiz.title}
        </div>
      </ResultHead>

      <p className="result-body">{profile?.body}</p>

      <div className="breakdown">
        <Eyebrow>Your full breakdown</Eyebrow>
        <div style={{ marginTop: 14 }}>
          {payload.tally.map((row, i) => {
            const name = quiz.profiles?.[row.key]?.short || quiz.profiles?.[row.key]?.title || row.key;
            const pct = Math.round((row.count / total) * 100);
            return (
              <div className="breakdown-row" key={row.key}>
                <span className="breakdown-name">{name}</span>
                <Meter value={pct} color={PALETTE[i % PALETTE.length]} />
                <span className="breakdown-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="lede" style={{ fontSize: 12, marginTop: 26 }}>
        A profile is a starting point, not a diagnosis. Read it aloud to them
        and see which sentences you want to argue with — those are the useful
        ones.
      </p>

      <Actions onBack={onBack} onRetake={onRetake} />
    </div>
  );
}

export function ScaleResult({ quiz, payload, onBack, onRetake }) {
  const band =
    (quiz.bands || []).find((b) => payload.score >= b.min) || quiz.bands?.[0];
  return (
    <div className="quiz-wrap">
      <ResultHead quiz={quiz}>
        <div className="result-num">
          {payload.score}
          <small>%</small>
        </div>
        <div className="result-name" style={{ fontSize: 26, marginTop: 14 }}>
          {band?.title}
        </div>
      </ResultHead>

      <div className="band-note">{band?.text}</div>

      <p className="lede" style={{ fontSize: 12, marginTop: 20 }}>
        This is a pulse, not a verdict. It is one afternoon&apos;s honesty, not
        the truth of the relationship.
      </p>

      <Actions onBack={onBack} onRetake={onRetake} />
    </div>
  );
}

export function PairsResult({ quiz, payload, partnerPayload, partnerName, onBack, onRetake }) {
  const picks = payload.picks || [];
  const mineA = picks.filter((p) => p === "a").length;
  const mineB = picks.length - mineA;
  const theirs = partnerPayload?.picks || [];
  const theirA = theirs.filter((p) => p === "a").length;
  const theirB = theirs.length - theirA;

  return (
    <div className="quiz-wrap">
      <ResultHead quiz={quiz}>
        <div className="result-name" style={{ fontSize: 30 }}>
          Your answers
        </div>
        <div className="eyebrow" style={{ marginTop: 4 }}>
          {quiz.title}
        </div>
      </ResultHead>

      <div className="sides" style={{ marginBottom: 22 }}>
        <div className="side">
          <div className="side-head">
            <span className="side-name">You</span>
          </div>
          <div className="result-num" style={{ fontSize: 42 }}>
            {mineA}
            <small> / {mineB}</small>
          </div>
          <div className="stat-label" style={{ marginTop: 9 }}>
            A / B
          </div>
        </div>
        <div className="side">
          <div className="side-head">
            <span className="side-name">{partnerName || "Them"}</span>
            {!partnerPayload && <span className="tag-static">No answers yet</span>}
          </div>
          {partnerPayload ? (
            <>
              <div className="result-num" style={{ fontSize: 42, color: "var(--sea)" }}>
                {theirA}
                <small> / {theirB}</small>
              </div>
              <div className="stat-label" style={{ marginTop: 9 }}>
                A / B
              </div>
            </>
          ) : (
            <p className="lede" style={{ fontSize: 12.5, marginTop: 8 }}>
              Their side fills in when they take it. Compare after.
            </p>
          )}
        </div>
      </div>

      <div className="divider-label">
        <span>Round by round</span>
      </div>

      <div>
        {quiz.questions.map((pair, i) => {
          const mine = picks[i];
          const theirsPick = partnerPayload ? theirs[i] : null;
          return (
            <div className="pair-result" key={i}>
              <span className={`pair-result-side${mine === "a" ? " on" : ""}`}>{pair.a}</span>
              <span className="pair-result-vs">or</span>
              <span className={`pair-result-side${mine === "b" ? " on" : ""}`}>{pair.b}</span>
              {partnerPayload && theirsPick && theirsPick !== mine && (
                <span className="pair-partner">
                  They chose {theirsPick === "a" ? pair.a : pair.b}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <Actions onBack={onBack} onRetake={onRetake} />
    </div>
  );
}

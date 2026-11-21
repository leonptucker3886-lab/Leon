"use client";

import { useState } from "react";
import { categories, sessionNumeral } from "@/lib/data";
import { Eyebrow, Meter } from "../ui";
import Icon from "../Icons";
import { ChoiceResult, ScaleResult, PairsResult } from "./Results";
import Written from "./Written";

function Head({ quiz, onBack, right }) {
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

function Beat({ step, total, color = "var(--gold)" }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="eyebrow">
          Question {step + 1} of {total}
        </span>
        <span className="eyebrow gold">{Math.round(((step + 1) / total) * 100)}%</span>
      </div>
      <Meter value={((step + 1) / total) * 100} color={color} />
    </>
  );
}

export default function SessionEntry(props) {
  const { quiz } = props;
  if (["open", "toggle", "mirror", "checkin"].includes(quiz.kind)) {
    return <Written {...props} />;
  }
  return <Objective {...props} />;
}

function Objective({ quiz, room, seat, update, onBack }) {
  const stored = room.data.answers?.[seat.seatId]?.[quiz.id];
  const partnerSeat = room.seats.find((s) => s.id !== seat.seatId);
  const partnerStored = partnerSeat
    ? room.data.answers?.[partnerSeat.id]?.[quiz.id]
    : null;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(null);
  const [retake, setRetake] = useState(false);

  const expected = quiz.kind === "choice" ? "choice" : quiz.kind === "scale" ? "scale" : "pairs";
  const saved = stored && stored.kind === expected ? stored : null;
  const shown = saving || saved;
  const cat = categories.find((c) => c.id === quiz.cat);

  const persist = (payload) => {
    update((draft) => {
      const d = draft.data;
      d.answers = d.answers || {};
      d.answers[seat.seatId] = d.answers[seat.seatId] || {};
      d.answers[seat.seatId][quiz.id] = payload;
      d.done = d.done || {};
      d.done[seat.seatId] = d.done[seat.seatId] || {};
      d.done[seat.seatId][quiz.id] = Date.now();
    });
    setSaving(payload);
    setRetake(false);
  };

  const reset = () => {
    update((draft) => {
      const d = draft.data;
      if (d.answers?.[seat.seatId]) delete d.answers[seat.seatId][quiz.id];
      if (d.done?.[seat.seatId]) delete d.done[seat.seatId][quiz.id];
    });
    setSaving(null);
    setAnswers({});
    setStep(0);
    setRetake(true);
  };

  const finish = (all) => {
    const values = Object.values(all);
    if (quiz.kind === "choice") {
      const counts = {};
      values.forEach((v) => {
        counts[v] = (counts[v] || 0) + 1;
      });
      const order = Object.keys(quiz.profiles || {});
      const tally = order
        .map((key) => ({ key, count: counts[key] || 0 }))
        .sort((a, b) => b.count - a.count || order.indexOf(a.key) - order.indexOf(b.key));
      persist({ kind: "choice", key: tally[0]?.key, tally, ts: Date.now() });
    } else if (quiz.kind === "scale") {
      const score = Math.round(
        (values.reduce((sum, v) => sum + Number(v), 0) / (values.length * 5)) * 100
      );
      persist({ kind: "scale", score, ts: Date.now() });
    } else {
      persist({
        kind: "pairs",
        picks: quiz.questions.map((_, i) => all[i] || "a"),
        ts: Date.now(),
      });
    }
  };

  const choose = (value) => {
    const next = { ...answers, [step]: value };
    setAnswers(next);
    if (step < quiz.questions.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 190);
    } else {
      setTimeout(() => finish(next), 320);
    }
  };

  if (shown && !retake) {
    return (
      <div className="page">
        <Head quiz={quiz} onBack={onBack} />
        {shown.kind === "choice" ? (
          <ChoiceResult quiz={quiz} payload={shown} onBack={onBack} onRetake={reset} />
        ) : shown.kind === "scale" ? (
          <ScaleResult quiz={quiz} payload={shown} onBack={onBack} onRetake={reset} />
        ) : (
          <PairsResult
            quiz={quiz}
            payload={shown}
            partnerPayload={partnerStored?.kind === "pairs" ? partnerStored : null}
            partnerName={partnerSeat?.name}
            onBack={onBack}
            onRetake={reset}
          />
        )}
      </div>
    );
  }

  const q = quiz.questions[step];
  const progress = ((step + 1) / quiz.questions.length) * 100;

  return (
    <div className="page">
      <Head quiz={quiz} onBack={onBack} />
      <div className="quiz-wrap">
        <Eyebrow gold>{quiz.title}</Eyebrow>
        <div style={{ marginTop: 16 }}>
          <Beat step={step} total={quiz.questions.length} />
        </div>

        <div key={step} className="fade-in">
          <h2 className="quiz-q">{q.q}</h2>

          {quiz.kind === "choice" && (
            <div className="options">
              {q.opts.map((opt, i) => (
                <button
                  key={opt.key + i}
                  className={`option${answers[step] === opt.key ? " on" : ""}`}
                  onClick={() => choose(opt.key)}
                  type="button"
                >
                  <span className="option-key">{String.fromCharCode(65 + i)}</span>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>
          )}

          {quiz.kind === "scale" && (
            <div>
              <div className="scale-row">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={`scale-btn${answers[step] === n ? " on" : ""}`}
                    onClick={() => choose(n)}
                    type="button"
                    aria-label={`${n} out of 5`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="scale-ends">
                <span>Not true</span>
                <span>Completely true</span>
              </div>
            </div>
          )}

          {quiz.kind === "pairs" && (
            <div className="pair-options">
              <button
                className={`pair-btn${answers[step] === "a" ? " on" : ""}`}
                onClick={() => choose("a")}
                type="button"
              >
                {q.a}
              </button>
              <div className="pair-vs">or</div>
              <button
                className={`pair-btn${answers[step] === "b" ? " on" : ""}`}
                onClick={() => choose("b")}
                type="button"
              >
                {q.b}
              </button>
            </div>
          )}
        </div>

        <div className="quiz-actions">
          <button
            className="link-quiet"
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.35 : 1 }}
          >
            <Icon name="arrowLeft" size={11} /> Previous
          </button>
          <span className="eyebrow">
            {progress === 100 ? "Last one" : `${quiz.questions.length - step - 1} left`}
          </span>
        </div>
      </div>
    </div>
  );
}

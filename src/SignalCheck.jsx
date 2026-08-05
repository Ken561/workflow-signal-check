import { useState, useMemo } from "react";

const FONTS_LINK = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,650;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

const LAYERS = [
  {
    id: 1,
    name: "Individual velocity",
    tag: "LAYER 01",
    desc: "Time returned for one person, on a task they repeat.",
  },
  {
    id: 2,
    name: "Workflow redesign",
    tag: "LAYER 02",
    desc: "The process itself changes shape around the tool.",
  },
  {
    id: 3,
    name: "Organizational compounding",
    tag: "LAYER 03",
    desc: "One team's pattern becomes the next team's starting point.",
  },
];

const EXAMPLE = {
  name: "Release notes from merged PRs",
  current:
    "At the end of each cycle, someone manually reads every merged PR and writes a summary. Takes about half a day, usually falls to whoever's least busy.",
  layer: 1,
  justifies: "yes",
  measurable: "yes",
  measureWhat: "Time spent per cycle, and whether the draft needs a heavy edit or just a light pass.",
};

function Gauge({ value, verdict }) {
  const angle = -90 + (value / 100) * 180;
  const color = verdict ? verdict.color : "#C1873A";
  const r = 78;
  const cx = 100;
  const cy = 100;
  const describeArc = (startAngle, endAngle) => {
    const toXY = (a) => {
      const rad = ((a - 90) * Math.PI) / 180;
      return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
    };
    const [x1, y1] = toXY(startAngle);
    const [x2, y2] = toXY(endAngle);
    const large = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div style={{ position: "relative", width: 200, height: 130, margin: "0 auto" }}>
      <svg viewBox="0 0 200 118" width="200" height="118">
        <path
          d={describeArc(0, 180)}
          fill="none"
          stroke="#E2E4DB"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d={describeArc(0, (value / 100) * 180)}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          style={{ transition: "all 700ms cubic-bezier(.4,1.4,.4,1)" }}
        />
        <g style={{ transition: "transform 700ms cubic-bezier(.4,1.4,.4,1)", transform: `rotate(${angle}deg)`, transformOrigin: "100px 100px" }}>
          <line x1="100" y1="100" x2="100" y2="34" stroke="#182019" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="7" fill="#182019" />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: -4,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "#4B564E",
        }}
      >
        {verdict ? verdict.gaugeLabel : `SIGNAL ${Math.round(value)}%`}
      </div>
    </div>
  );
}

function Shell({ children, step, total }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F3F4EF",
        backgroundImage:
          "linear-gradient(#E2E4DB 1px, transparent 1px), linear-gradient(90deg, #E2E4DB 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: "#182019",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 20px 80px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 640 }}>
        <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.14em", color: "#4B564E" }}>
            SIGNAL&nbsp;CHECK
          </div>
          {step !== undefined && (
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.1em", color: "#4B564E" }}>
              READING {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </div>
          )}
        </header>
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E4DB",
            borderRadius: 14,
            padding: "36px 34px",
            boxShadow: "0 1px 2px rgba(24,32,25,0.04), 0 12px 32px -16px rgba(24,32,25,0.18)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label
        style={{
          display: "block",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "#4B564E",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: 12.5, color: "#8A9188", marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #D8DBD1",
  borderRadius: 8,
  padding: "11px 13px",
  fontSize: 15,
  fontFamily: "'IBM Plex Sans', sans-serif",
  color: "#182019",
  background: "#FBFBF9",
  outline: "none",
};

function TextInput(props) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />;
}
function TextArea(props) {
  return <textarea {...props} style={{ ...inputStyle, minHeight: 84, resize: "vertical", lineHeight: 1.5, ...(props.style || {}) }} />;
}

function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#D8DBD1" : "#182019",
        color: disabled ? "#8A9188" : "#F3F4EF",
        border: "none",
        borderRadius: 8,
        padding: "12px 22px",
        fontSize: 14.5,
        fontWeight: 600,
        fontFamily: "'IBM Plex Sans', sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 150ms",
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: "#4B564E",
        border: "1px solid #D8DBD1",
        borderRadius: 8,
        padding: "12px 18px",
        fontSize: 14.5,
        fontFamily: "'IBM Plex Sans', sans-serif",
        cursor: "pointer",
        marginRight: 10,
      }}
    >
      {children}
    </button>
  );
}

function ChoiceCard({ active, onClick, tag, title, desc }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: active ? "#182019" : "#FBFBF9",
        color: active ? "#F3F4EF" : "#182019",
        border: `1px solid ${active ? "#182019" : "#D8DBD1"}`,
        borderRadius: 10,
        padding: "16px 18px",
        marginBottom: 10,
        cursor: "pointer",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10.5,
          letterSpacing: "0.1em",
          color: active ? "#C1873A" : "#8A9188",
          marginBottom: 4,
        }}
      >
        {tag}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: active ? "#C7CCC3" : "#4B564E", lineHeight: 1.4 }}>{desc}</div>
    </button>
  );
}

function YesNo({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {["yes", "no"].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            flex: 1,
            padding: "11px 0",
            borderRadius: 8,
            border: `1px solid ${value === v ? "#182019" : "#D8DBD1"}`,
            background: value === v ? "#182019" : "#FBFBF9",
            color: value === v ? "#F3F4EF" : "#182019",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 14.5,
            fontWeight: 600,
            cursor: "pointer",
            textTransform: "capitalize",
          }}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

function computeVerdict(d) {
  let layer = d.layer;
  let downgraded = false;

  if (layer === 3 && d.layer3Proven === "no") {
    layer = 2;
    downgraded = true;
  }

  if (layer === 1) {
    if (d.justifies === "no") {
      return {
        title: "Not worth it as currently framed",
        color: "#A8432E",
        gaugeLabel: "STOP",
        value: 18,
        reasoning: [
          "This is a layer 1 workflow, individual velocity only.",
          "You've said the time saved doesn't justify the build and maintenance cost on its own.",
          "That's a legitimate answer. Not everything needs to be built.",
        ],
        downgraded,
      };
    }
    if (d.measurable === "no") {
      return {
        title: "Worth building, but define measurement first",
        color: "#B8862B",
        gaugeLabel: "DEFINE FIRST",
        value: 55,
        reasoning: [
          "Layer 1, and you've said the time saved is worth it.",
          "But you can't currently measure the before and after.",
          "Fix that before you build, or you won't be able to prove it worked.",
        ],
        downgraded,
      };
    }
    return {
      title: "Worth building now",
      color: "#2F6B4F",
      gaugeLabel: "BUILD NOW",
      value: 82,
      reasoning: [
        "Layer 1, measurable, and worth the effort on its own terms.",
        "Small and real beats big and hypothetical. Build it.",
      ],
      downgraded,
    };
  }

  // layer === 2 (including downgraded from 3)
  const redesignSubstantial = (d.redesign || "").trim().length >= 40;

  if (!redesignSubstantial) {
    return {
      title: "Need more information before deciding",
      color: "#56636C",
      gaugeLabel: "INCOMPLETE",
      value: 40,
      reasoning: [
        downgraded
          ? "This was pitched as layer 3, but there's no proven layer 2 underneath it yet, and the redesign itself isn't described in enough detail either."
          : "You said this is a workflow redesign, but the actual new shape of the process isn't described in enough detail to evaluate.",
        "Go back and write out what the process actually looks like once the tool is built in, step by step.",
      ],
      downgraded,
    };
  }

  if (d.measurable === "no") {
    return {
      title: "Worth building, but scope it down until you can measure it",
      color: "#B8862B",
      gaugeLabel: "SCOPE DOWN",
      value: 58,
      reasoning: [
        downgraded
          ? "Pitched as layer 3. There's no proven layer 2 yet, so that's what you're actually evaluating right now."
          : "This is a real workflow redesign, not just a time-saver.",
        "But you can't currently measure the before and after, which means you won't be able to prove it worked either.",
        "Narrow the scope to something you can actually measure, then expand once it's proven.",
      ],
      downgraded,
    };
  }

  return {
    title: "Worth building now",
    color: "#2F6B4F",
    gaugeLabel: "BUILD NOW",
    value: downgraded ? 78 : 88,
    reasoning: downgraded
      ? [
          "Pitched as layer 3, but layer 2 was never actually proven. That's the tell, most things pitched as organizational compounding are really an unproven workflow redesign wearing a bigger title.",
          "Build and prove it at layer 2 first. Once a team is actually running the redesigned workflow, layer 3 packaging becomes a real next step instead of a guess.",
        ]
      : [
          "The redesign is described specifically enough to build, and it's measurable.",
          "This is where the real step change lives. Worth the investment.",
        ],
  };
}

const emptyData = {
  name: "",
  current: "",
  layer: null,
  justifies: null,
  layer3Proven: null,
  redesign: "",
  layer3Requirement: "",
  measurable: null,
  measureWhat: "",
};

export default function SignalCheck() {
  const [step, setStep] = useState("intro");
  const [d, setD] = useState(emptyData);
  const [showCorrection, setShowCorrection] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = (patch) => setD((prev) => ({ ...prev, ...patch }));

  const stepOrder = ["workflow", "layer", "deepen", "measure", "verdict"];
  const totalSteps = 4;
  const stepIndex = stepOrder.indexOf(step) + 1;

  const runningValue = useMemo(() => {
    if (step === "intro") return 0;
    if (step === "workflow") return 12;
    if (step === "layer") return d.layer ? 30 : 22;
    if (step === "deepen") return 55;
    if (step === "measure") return 70;
    return 0;
  }, [step, d.layer]);

  const verdict = step === "verdict" ? computeVerdict(d) : null;

  const goDeepenFromLayer = () => {
    if (d.layer === 3) {
      setStep("layer3check");
    } else {
      setStep("deepen");
    }
  };

  const handleLayer3Answer = (val) => {
    update({ layer3Proven: val });
    if (val === "no") {
      setShowCorrection(true);
      setTimeout(() => {
        setShowCorrection(false);
        setStep("deepen");
      }, 2200);
    } else {
      setStep("deepen");
    }
  };

  const loadExample = () => {
    setD({ ...emptyData, ...EXAMPLE });
    setStep("workflow");
  };

  const reset = () => {
    setD(emptyData);
    setShowCorrection(false);
    setStep("intro");
  };

  const markdown = useMemo(() => {
    if (!verdict) return "";
    return `## Workflow: ${d.name || "Untitled"}

**Current state:** ${d.current || "not described"}

**Layer targeted:** ${verdict.downgraded ? `Layer 3, downgraded to Layer 2 (no proven pattern yet)` : `Layer ${d.layer}`}

**Verdict:** ${verdict.title}

**Reasoning:**
${verdict.reasoning.map((r) => `- ${r}`).join("\n")}
`;
  }, [verdict, d]);

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <>
      <link rel="stylesheet" href={FONTS_LINK} />

      {step === "intro" && (
        <Shell>
          <div style={{ textAlign: "center", padding: "8px 4px 4px" }}>
            <Gauge value={0} verdict={null} />
            <h1
              style={{
                fontSize: 30,
                fontWeight: 650,
                margin: "18px 0 10px",
                letterSpacing: "-0.01em",
              }}
            >
              Is this AI workflow<br />actually worth building?
            </h1>
            <p style={{ color: "#4B564E", fontSize: 15.5, lineHeight: 1.55, maxWidth: 440, margin: "0 auto 28px" }}>
              Five questions. An honest read on whether an AI-assisted workflow idea
              deserves real investment, or whether it's smaller than it sounds.
            </p>
            <div>
              <PrimaryButton onClick={() => setStep("workflow")}>Start the check</PrimaryButton>
            </div>
            <button
              onClick={loadExample}
              style={{
                marginTop: 18,
                background: "none",
                border: "none",
                color: "#8A9188",
                fontSize: 13,
                textDecoration: "underline",
                cursor: "pointer",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              or load a worked example
            </button>
          </div>
        </Shell>
      )}

      {step === "workflow" && (
        <Shell step={1} total={totalSteps}>
          <Gauge value={runningValue} verdict={null} />
          <h2 style={{ fontSize: 20, fontWeight: 650, margin: "22px 0 4px" }}>The workflow</h2>
          <p style={{ color: "#4B564E", fontSize: 14, marginBottom: 22 }}>
            Describe it as it happens today. Specific beats vague, "sometimes" and "a while" aren't answers.
          </p>
          <Field label="WORKFLOW NAME">
            <TextInput
              value={d.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="e.g. Drafting release notes from merged PRs"
            />
          </Field>
          <Field label="HOW IT WORKS TODAY" hint="Who does it, how often, how long does it actually take.">
            <TextArea
              value={d.current}
              onChange={(e) => update({ current: e.target.value })}
              placeholder="Describe the current process..."
            />
          </Field>
          <div style={{ marginTop: 26 }}>
            <PrimaryButton disabled={!d.name || !d.current} onClick={() => setStep("layer")}>
              Continue
            </PrimaryButton>
          </div>
        </Shell>
      )}

      {step === "layer" && (
        <Shell step={2} total={totalSteps}>
          <Gauge value={runningValue} verdict={null} />
          <h2 style={{ fontSize: 20, fontWeight: 650, margin: "22px 0 4px" }}>Which layer is this targeting</h2>
          <p style={{ color: "#4B564E", fontSize: 14, marginBottom: 18 }}>
            Be honest. Don't reach for layer 3 because it sounds better in a pitch, the tool will check.
          </p>
          {LAYERS.map((l) => (
            <ChoiceCard
              key={l.id}
              tag={l.tag}
              title={l.name}
              desc={l.desc}
              active={d.layer === l.id}
              onClick={() => update({ layer: l.id })}
            />
          ))}
          <div style={{ marginTop: 20, display: "flex" }}>
            <GhostButton onClick={() => setStep("workflow")}>Back</GhostButton>
            <PrimaryButton disabled={!d.layer} onClick={goDeepenFromLayer}>
              Continue
            </PrimaryButton>
          </div>
        </Shell>
      )}

      {step === "layer3check" && (
        <Shell step={2} total={totalSteps}>
          <Gauge value={showCorrection ? 24 : 30} verdict={null} />
          {!showCorrection ? (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 650, margin: "22px 0 4px" }}>
                Before we go further
              </h2>
              <p style={{ color: "#4B564E", fontSize: 14.5, lineHeight: 1.55, marginBottom: 18 }}>
                Organizational compounding means one team's pattern becomes another team's
                starting point. That only works if the pattern's actually proven somewhere first.
              </p>
              <Field label="HAS THIS ALREADY BEEN PROVEN AT LAYER 2? A REAL TEAM, ACTUALLY RUNNING THE REDESIGNED WORKFLOW.">
                <YesNo value={d.layer3Proven} onChange={handleLayer3Answer} />
              </Field>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  color: "#A8432E",
                  marginBottom: 10,
                }}
              >
                SIGNAL CORRECTED
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.55, color: "#182019", maxWidth: 440, margin: "0 auto" }}>
                That's the tell. Layer 3 needs a proven layer 2 underneath it.
                <br />
                Let's actually evaluate this at layer 2.
              </p>
            </div>
          )}
        </Shell>
      )}

      {step === "deepen" && (
        <Shell step={3} total={totalSteps}>
          <Gauge value={runningValue} verdict={null} />
          {d.layer === 1 && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 650, margin: "22px 0 4px" }}>Is it worth it on its own</h2>
              <p style={{ color: "#4B564E", fontSize: 14, marginBottom: 18 }}>
                Layer 1 gains are real but small. Is the individual time saved genuinely
                worth the build and maintenance cost, without assuming it grows into something bigger.
              </p>
              <Field label="DOES THE TIME SAVED JUSTIFY BUILDING THIS">
                <YesNo value={d.justifies} onChange={(v) => update({ justifies: v })} />
              </Field>
            </>
          )}
          {(d.layer === 2 || d.layer === 3) && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 650, margin: "22px 0 4px" }}>
                {d.layer3Proven === "yes" ? "What would the layer 3 artifact be" : "What does the redesign actually look like"}
              </h2>
              <p style={{ color: "#4B564E", fontSize: 14, marginBottom: 18 }}>
                {d.layer3Proven === "yes"
                  ? "Not 'AI helps with X.' The actual template, pattern, or shared context another team would start from."
                  : "Not \"AI helps with X.\" The actual new shape of the process, with the tool built in rather than bolted on."}
              </p>
              <Field label={d.layer3Proven === "yes" ? "THE ARTIFACT ANOTHER TEAM WOULD REUSE" : "THE REDESIGNED WORKFLOW, STEP BY STEP"}>
                <TextArea
                  value={d.redesign}
                  onChange={(e) => update({ redesign: e.target.value })}
                  placeholder="Describe it specifically..."
                  style={{ minHeight: 110 }}
                />
              </Field>
            </>
          )}
          <div style={{ marginTop: 20, display: "flex" }}>
            <GhostButton onClick={() => setStep("layer")}>Back</GhostButton>
            <PrimaryButton
              disabled={d.layer === 1 ? !d.justifies : (d.redesign || "").trim().length === 0}
              onClick={() => setStep("measure")}
            >
              Continue
            </PrimaryButton>
          </div>
        </Shell>
      )}

      {step === "measure" && (
        <Shell step={4} total={totalSteps}>
          <Gauge value={runningValue} verdict={null} />
          <h2 style={{ fontSize: 20, fontWeight: 650, margin: "22px 0 4px" }}>The honest measurability check</h2>
          <p style={{ color: "#4B564E", fontSize: 14, marginBottom: 18 }}>
            Can you actually measure the before and after, or would you be relying on a
            feeling that it's better? Say now, don't discover it three months in.
          </p>
          <Field label="CAN YOU MEASURE IT">
            <YesNo value={d.measurable} onChange={(v) => update({ measurable: v })} />
          </Field>
          {d.measurable && (
            <Field label={d.measurable === "yes" ? "WHAT YOU'D MEASURE" : "WHY NOT, HONESTLY"}>
              <TextArea
                value={d.measureWhat}
                onChange={(e) => update({ measureWhat: e.target.value })}
                placeholder={d.measurable === "yes" ? "Time per occurrence, error rate, whatever's real..." : "What's missing to make this measurable..."}
                style={{ minHeight: 70 }}
              />
            </Field>
          )}
          <div style={{ marginTop: 20, display: "flex" }}>
            <GhostButton onClick={() => setStep("deepen")}>Back</GhostButton>
            <PrimaryButton disabled={!d.measurable} onClick={() => setStep("verdict")}>
              Get the verdict
            </PrimaryButton>
          </div>
        </Shell>
      )}

      {step === "verdict" && verdict && (
        <Shell>
          <Gauge value={verdict.value} verdict={verdict} />
          {verdict.downgraded && (
            <div
              style={{
                textAlign: "center",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "#A8432E",
                marginTop: 8,
              }}
            >
              DOWNGRADED FROM LAYER 3, NO PROVEN LAYER 2 YET
            </div>
          )}
          <h2 style={{ fontSize: 23, fontWeight: 650, textAlign: "center", margin: "16px 0 4px", color: verdict.color }}>
            {verdict.title}
          </h2>
          <p style={{ textAlign: "center", color: "#8A9188", fontSize: 13, marginBottom: 22, fontFamily: "'IBM Plex Mono', monospace" }}>
            {d.name || "Untitled workflow"}
          </p>
          <div
            style={{
              background: "#FBFBF9",
              border: "1px solid #E2E4DB",
              borderRadius: 10,
              padding: "18px 20px",
              marginBottom: 22,
            }}
          >
            {verdict.reasoning.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i === verdict.reasoning.length - 1 ? 0 : 10 }}>
                <div style={{ width: 5, height: 5, borderRadius: 3, background: verdict.color, marginTop: 7, flexShrink: 0 }} />
                <div style={{ fontSize: 14.5, lineHeight: 1.55 }}>{r}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: "#182019",
              borderRadius: 10,
              padding: "16px 18px",
              marginBottom: 22,
            }}
          >
            <pre
              style={{
                margin: 0,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12.5,
                color: "#D8DBD1",
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              {markdown}
            </pre>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <GhostButton onClick={reset}>Check another workflow</GhostButton>
            <PrimaryButton onClick={copyMarkdown}>{copied ? "Copied" : "Copy as markdown"}</PrimaryButton>
          </div>
        </Shell>
      )}
    </>
  );
}

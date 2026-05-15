/* Interactive demos for each project card */

const { useState: useStateD, useEffect: useEffectD } = React;

/* ========== Demo 1: Population Health KPI (animated bar chart with toggle) ========== */
const DemoPopHealth = () => {
  const [view, setView] = useStateD("engagement");
  const data = {
    engagement: [62, 68, 64, 71, 78, 82, 86, 91],
    efficacy: [55, 58, 63, 67, 73, 79, 84, 88],
    cost: [88, 84, 79, 76, 72, 68, 64, 60],
  };
  const colors = { engagement: "var(--accent)", efficacy: "var(--accent-2)", cost: "var(--warn)" };
  const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"];
  const cur = data[view];
  const max = Math.max(...cur);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="seg">
          <button className={view === "engagement" ? "active" : ""} onClick={() => setView("engagement")}>Engagement</button>
          <button className={view === "efficacy" ? "active" : ""} onClick={() => setView("efficacy")}>Efficacy</button>
          <button className={view === "cost" ? "active" : ""} onClick={() => setView("cost")}>Cost</button>
        </div>
        <span className="tag mint" style={{ fontSize: 10 }}>+{cur[cur.length-1] - cur[0]}% vs Jan</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110, padding: "0 4px" }}>
        {cur.map((v, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: "100%",
              height: `${(v / 100) * 100}%`,
              background: `linear-gradient(180deg, ${colors[view]}, oklch(0.5 0.10 165))`,
              borderRadius: "3px 3px 0 0",
              transition: "height 0.6s cubic-bezier(.2,.8,.2,1)",
              opacity: 0.85,
              minHeight: 4,
            }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-3)" }}>{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== Demo 2: Lean Six Sigma DMAIC stepper ========== */
const DemoDMAIC = () => {
  const [step, setStep] = useStateD(0);
  const steps = [
    { letter: "D", name: "Define", detail: "Map clinical workflow in Epic, identify scope" },
    { letter: "M", name: "Measure", detail: "Baseline: 14 steps avg, 8 non-value-added" },
    { letter: "A", name: "Analyze", detail: "Root cause: redundant approvals & handoffs" },
    { letter: "I", name: "Improve", detail: "Streamlined to 9 steps, eliminated 5 NVA" },
    { letter: "C", name: "Control", detail: "60 hrs/mo saved · 15% cost reduction" },
  ];
  useEffectD(() => {
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} style={{
            flex: 1, padding: "8px 4px", textAlign: "center",
            background: i === step ? "oklch(0.78 0.18 165 / 0.15)" : "var(--panel)",
            border: `1px solid ${i === step ? "var(--accent)" : "var(--line)"}`,
            borderRadius: 5, cursor: "pointer", transition: "all 0.25s",
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600,
                          color: i === step ? "var(--accent)" : "var(--text-3)" }}>
              {s.letter}
            </div>
            <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: i === step ? "var(--text)" : "var(--text-3)", textTransform: "uppercase", letterSpacing: 0.04 }}>
              {s.name}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: 10, background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 5, fontSize: 11.5, color: "var(--text-2)", minHeight: 44 }}>
        <b style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 0.06, textTransform: "uppercase" }}>{steps[step].name} · </b>
        {steps[step].detail}
      </div>
    </div>
  );
};

/* ========== Demo 3: SQL Medallion (Bronze→Silver→Gold) ========== */
const DemoMedallion = () => {
  const [stage, setStage] = useStateD(0);
  useEffectD(() => {
    const id = setInterval(() => setStage(s => (s + 1) % 4), 1600);
    return () => clearInterval(id);
  }, []);
  const layers = [
    { name: "Bronze", color: "oklch(0.55 0.10 50)", desc: "Raw ingest", count: "1.2M rows" },
    { name: "Silver", color: "oklch(0.75 0.02 250)", desc: "Cleansed", count: "1.18M rows" },
    { name: "Gold", color: "oklch(0.78 0.15 95)", desc: "Star schema", count: "12 marts" },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 16px 1fr 16px 1fr", alignItems: "center", gap: 6, marginBottom: 12 }}>
        {layers.map((l, i) => (
          <React.Fragment key={i}>
            <div style={{
              padding: "10px 8px", borderRadius: 6,
              background: stage > i ? `${l.color.replace(")", " / 0.18)")}` : "var(--panel)",
              border: `1px solid ${stage > i ? l.color : "var(--line)"}`,
              transition: "all 0.4s", textAlign: "center",
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: stage > i ? l.color : "var(--text-3)", letterSpacing: 0.06 }}>{l.name.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 2 }}>{l.desc}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", marginTop: 4 }}>{l.count}</div>
            </div>
            {i < 2 && (
              <div style={{ textAlign: "center", color: stage > i ? layers[i+1].color : "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: 14, transition: "color 0.4s" }}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", padding: "8px 10px", background: "var(--panel)", borderRadius: 5, border: "1px solid var(--line)" }}>
        <span style={{ color: "var(--accent)" }}>$</span> dbt run --models marts.* <span style={{ color: "var(--accent)" }}>✓</span>
      </div>
    </div>
  );
};

/* ========== Demo 4: Gap Analysis pre/post ========== */
const DemoGap = () => {
  const [show, setShow] = useStateD("post");
  const metrics = [
    { name: "Quarterly Authorizations", pre: 800, post: 1000, unit: "" },
    { name: "Patient Volume", pre: 100, post: 130, unit: "%" },
    { name: "Referral Cycle Time", pre: 14, post: 9, unit: "d", inverse: true },
  ];
  return (
    <div>
      <div className="seg" style={{ marginBottom: 10 }}>
        <button className={show === "pre" ? "active" : ""} onClick={() => setShow("pre")}>Pre</button>
        <button className={show === "post" ? "active" : ""} onClick={() => setShow("post")}>Post</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {metrics.map((m, i) => {
          const v = show === "pre" ? m.pre : m.post;
          const ratio = m.inverse ? (m.pre - v + 5) / (m.pre + 5) : v / Math.max(m.pre, m.post);
          const good = show === "post";
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 70px", gap: 10, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-2)", marginBottom: 3 }}>{m.name}</div>
                <div style={{ height: 5, background: "var(--bg)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${ratio * 100}%`,
                    background: good ? "var(--accent)" : "var(--text-3)",
                    transition: "width 0.5s, background 0.3s",
                    borderRadius: 3,
                  }} />
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: good ? "var(--accent)" : "var(--text-2)", textAlign: "right" }}>
                {v}{m.unit}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ========== Demo 5: Qualtrics survey response stream ========== */
const DemoQualtrics = () => {
  const [responses, setResponses] = useStateD(247);
  useEffectD(() => {
    const id = setInterval(() => setResponses(r => r + Math.floor(Math.random() * 4) + 1), 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: 0.05, textTransform: "uppercase" }}>Live Responses</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)", letterSpacing: -0.02 }}>
            {responses.toLocaleString()}
          </div>
        </div>
        <span className="tag live" style={{ fontSize: 10 }}>STREAMING</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { src: "Member Portal", n: 142, c: "var(--accent)" },
          { src: "Email Campaign", n: 67, c: "var(--accent-2)" },
          { src: "QR / On-site", n: 38, c: "var(--warn)" },
        ].map((s, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 30px", gap: 8, alignItems: "center", fontSize: 10, fontFamily: "var(--font-mono)" }}>
            <span style={{ color: "var(--text-3)" }}>{s.src}</span>
            <div style={{ height: 4, background: "var(--bg)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${(s.n / 142) * 100}%`, height: "100%", background: s.c, borderRadius: 2 }} />
            </div>
            <span style={{ color: "var(--text-2)", textAlign: "right" }}>{s.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== Demo 6: Workflow redesign before/after ========== */
const DemoWorkflow = () => {
  const [mode, setMode] = useStateD("after");
  const before = ["Request", "Email A", "Email B", "Approve A", "Email C", "Approve B", "Schedule"];
  const after = ["Request", "ServiceNow Ticket", "Auto-route", "Approve", "Schedule"];
  const cur = mode === "after" ? after : before;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div className="seg">
          <button className={mode === "before" ? "active" : ""} onClick={() => setMode("before")}>Before</button>
          <button className={mode === "after" ? "active" : ""} onClick={() => setMode("after")}>After</button>
        </div>
        <span className="tag mint" style={{ fontSize: 10 }}>{mode === "after" ? "+35% efficiency" : "Baseline"}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, minHeight: 90 }}>
        {cur.map((s, i) => (
          <React.Fragment key={`${mode}-${i}`}>
            <div style={{
              padding: "5px 8px",
              background: mode === "after" ? "oklch(0.78 0.18 165 / 0.1)" : "var(--panel)",
              border: `1px solid ${mode === "after" ? "var(--accent)" : "var(--line)"}`,
              borderRadius: 4,
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              color: mode === "after" ? "var(--accent)" : "var(--text-2)",
              animation: `slideIn 0.3s ${i * 0.05}s both`,
            }}>{s}</div>
            {i < cur.length - 1 && <span style={{ color: "var(--text-3)", fontSize: 11 }}>→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ========== Demo 7: PHI compliance log ========== */
const DemoPHI = () => {
  const items = [
    { t: "09:42", req: "REQ-44218", typ: "Legal", status: "✓" },
    { t: "09:51", req: "REQ-44219", typ: "Insurance", status: "✓" },
    { t: "10:03", req: "REQ-44220", typ: "Patient", status: "✓" },
    { t: "10:14", req: "REQ-44221", typ: "Legal", status: "✓" },
    { t: "10:22", req: "REQ-44222", typ: "Insurance", status: "✓" },
  ];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: 0.06, textTransform: "uppercase" }}>HIPAA Audit Log</span>
        <span className="tag mint" style={{ fontSize: 10 }}>100% compliant</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, fontFamily: "var(--font-mono)", fontSize: 10 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "40px 80px 1fr 16px",
            gap: 8, padding: "5px 8px",
            background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 4,
            animation: `slideIn 0.3s ${i * 0.08}s both`,
          }}>
            <span style={{ color: "var(--text-3)" }}>{it.t}</span>
            <span style={{ color: "var(--text)" }}>{it.req}</span>
            <span style={{ color: "var(--text-2)" }}>{it.typ}</span>
            <span style={{ color: "var(--accent)", textAlign: "right" }}>{it.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== Demo 8: Claims denial heatmap (payer × reason) ========== */
const DemoHeatmap = () => {
  const payers = ["Aetna", "BCBS", "Cigna", "Humana", "United", "TRICARE"];
  const reasons = ["Auth", "Coding", "Elig", "Bundle", "Timely", "Other"];
  // deterministic pseudo-random matrix
  const matrix = payers.map((_, r) =>
    reasons.map((_, c) => ((Math.sin((r + 1) * 7.3 + (c + 1) * 2.1) + 1) * 0.5))
  );
  const [hover, setHover] = useStateD(null);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: 0.06, textTransform: "uppercase" }}>
          Denials · payer × reason
        </span>
        <span className="tag mint" style={{ fontSize: 10 }}>
          {hover ? `${payers[hover[0]]} · ${reasons[hover[1]]} · ${(matrix[hover[0]][hover[1]] * 100).toFixed(0)}%` : "73 payers · YTD"}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 6 }}>
        <div />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${reasons.length}, 1fr)`, gap: 2 }}>
          {reasons.map((r) => (
            <div key={r} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-3)", textAlign: "center" }}>{r}</div>
          ))}
        </div>
        {payers.map((p, r) => (
          <React.Fragment key={p}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}>{p}</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${reasons.length}, 1fr)`, gap: 2 }}>
              {matrix[r].map((v, c) => (
                <div
                  key={c}
                  onMouseEnter={() => setHover([r, c])}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    aspectRatio: "1.4 / 1",
                    background: `oklch(0.78 ${0.04 + v * 0.16} 165 / ${0.10 + v * 0.85})`,
                    borderRadius: 2,
                    border: hover && hover[0] === r && hover[1] === c ? "1px solid var(--text)" : "1px solid transparent",
                    transition: "border-color 0.1s",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ========== Demo 9: Risk-score cohort distribution ========== */
const DemoRiskCohort = () => {
  const buckets = [
    { label: "<0.5",  n: 18, c: "oklch(0.78 0.18 165 / 0.6)" },
    { label: "0.5-1", n: 42, c: "oklch(0.78 0.18 165 / 0.8)" },
    { label: "1-1.5", n: 56, c: "var(--accent)" },
    { label: "1.5-2", n: 38, c: "var(--warn)" },
    { label: "2-3",   n: 22, c: "oklch(0.68 0.18 50)" },
    { label: "3+",    n: 9,  c: "var(--danger)" },
  ];
  const max = Math.max(...buckets.map(b => b.n));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: 0.06, textTransform: "uppercase" }}>HCC Risk Score · 185K members</span>
        <span className="tag" style={{ fontSize: 10 }}>μ 1.07 · σ 0.62</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 110 }}>
        {buckets.map((b, i) => (
          <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-2)" }}>{b.n}K</span>
            <div style={{
              width: "100%", height: `${(b.n / max) * 78}%`,
              background: b.c, borderRadius: "3px 3px 0 0",
              animation: `slideIn 0.5s ${i * 0.06}s both`, minHeight: 6,
            }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-3)" }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { DemoPopHealth, DemoDMAIC, DemoMedallion, DemoGap, DemoQualtrics, DemoWorkflow, DemoPHI, DemoHeatmap, DemoRiskCohort });

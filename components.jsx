/* Components for the BI Portfolio
   Exports to window so other Babel scripts can use them
*/

const { useState, useEffect, useRef, useMemo } = React;

/* ========= SVG ICONS (simple, no fancy paths) ========= */
const Icon = ({ name, size = 14 }) => {
  const paths = {
    home: <><path d="M3 9 L8 4 L13 9 V13 H3 Z" /><path d="M7 13 V10 H9 V13" /></>,
    chart: <><path d="M2 13 H14" /><rect x="3" y="8" width="2" height="5" /><rect x="7" y="5" width="2" height="8" /><rect x="11" y="9" width="2" height="4" /></>,
    flow: <><circle cx="3.5" cy="3.5" r="1.5" /><circle cx="12.5" cy="3.5" r="1.5" /><circle cx="3.5" cy="12.5" r="1.5" /><circle cx="12.5" cy="12.5" r="1.5" /><path d="M5 3.5 H11 M3.5 5 V11 M12.5 5 V11 M5 12.5 H11" /></>,
    book: <><path d="M3 3 H13 V13 H3 Z" /><path d="M3 3 V13" /><path d="M6 6 H11 M6 8.5 H11" /></>,
    user: <><circle cx="8" cy="6" r="2.5" /><path d="M3 13 C3 10 5 9 8 9 C11 9 13 10 13 13" /></>,
    spark: <><path d="M2 12 L5 7 L8 9 L11 4 L14 6" /></>,
    plus: <><path d="M8 3 V13 M3 8 H13" /></>,
    search: <><circle cx="7" cy="7" r="4" /><path d="M10 10 L13 13" /></>,
    bell: <><path d="M5 7 C5 5 6 3 8 3 C10 3 11 5 11 7 V10 H5 Z" /><path d="M7 12 C7 13 8 13 8 13 C8 13 9 13 9 12" /></>,
    arrow: <><path d="M3 8 H13 M9 4 L13 8 L9 12" /></>,
    download: <><path d="M8 3 V11 M5 8 L8 11 L11 8" /><path d="M3 13 H13" /></>,
    mail: <><rect x="2" y="4" width="12" height="9" /><path d="M2 4 L8 9 L14 4" /></>,
    link: <><path d="M7 9 L9 7 M5 11 L4 12 C2 14 0 12 2 10 L4 8 M9 5 L11 4 C13 2 14 4 12 6 L11 7" /></>,
    file: <><path d="M4 2 H10 L13 5 V14 H4 Z" /><path d="M10 2 V5 H13" /></>,
    filter: <><path d="M2 3 H14 L9 8 V13 L7 12 V8 Z" /></>,
    play: <><path d="M5 3 L13 8 L5 13 Z" /></>,
    pause: <><rect x="4" y="3" width="3" height="10" /><rect x="9" y="3" width="3" height="10" /></>,
    db: <><ellipse cx="8" cy="4" rx="5" ry="2" /><path d="M3 4 V8 C3 9 5 10 8 10 C11 10 13 9 13 8 V4" /><path d="M3 8 V12 C3 13 5 14 8 14 C11 14 13 13 13 12 V8" /></>,
    code: <><path d="M5 5 L2 8 L5 11 M11 5 L14 8 L11 11 M9 4 L7 12" /></>,
    cube: <><path d="M8 2 L14 5 V11 L8 14 L2 11 V5 Z" /><path d="M2 5 L8 8 L14 5 M8 8 V14" /></>,
    grid: <><rect x="2" y="2" width="5" height="5" /><rect x="9" y="2" width="5" height="5" /><rect x="2" y="9" width="5" height="5" /><rect x="9" y="9" width="5" height="5" /></>,
    health: <><path d="M8 13 C5 10 2 8 2 6 C2 4 4 3 5.5 3 C7 3 8 4 8 5 C8 4 9 3 10.5 3 C12 3 14 4 14 6 C14 8 11 10 8 13 Z" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
};

/* ========= SPARKLINE ========= */
const Sparkline = ({ data, color = "var(--accent)", height = 32, fill = true }) => {
  const w = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const path = pts.map(([x, y], i) => (i === 0 ? `M${x} ${y}` : `L${x} ${y}`)).join(" ");
  const fillPath = `${path} L${w} ${height} L0 ${height} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {fill && <path d={fillPath} fill={color} opacity="0.12" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2" fill={color} />
    </svg>
  );
};

/* ========= AREA CHART (multiseries) ========= */
const AreaChart = ({ series, height = 240 }) => {
  // series: [{name, color, data}]
  const w = 600;
  const allVals = series.flatMap(s => s.data);
  const max = Math.max(...allVals) * 1.1;
  const min = 0;
  const n = series[0].data.length;

  const xFor = (i) => 30 + (i / (n - 1)) * (w - 50);
  const yFor = (v) => 20 + (1 - (v - min) / (max - min)) * (height - 50);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => min + (max - min) * t);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      {/* grid */}
      {yTicks.map((v, i) => (
        <g key={i}>
          <line x1={30} y1={yFor(v)} x2={w - 20} y2={yFor(v)} stroke="var(--line)" strokeWidth="1" strokeDasharray="2 3" />
          <text x={6} y={yFor(v) + 3} fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">{Math.round(v)}</text>
        </g>
      ))}
      {series[0].data.map((_, i) => i % 2 === 0 && (
        <text key={i} x={xFor(i)} y={height - 6} fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)" textAnchor="middle">
          {["Q1'22","Q2'22","Q3'22","Q4'22","Q1'23","Q2'23","Q3'23","Q4'23","Q1'24","Q2'24","Q3'24","Q4'24"][i]}
        </text>
      ))}
      {series.map((s, idx) => {
        const path = s.data.map((v, i) => `${i === 0 ? "M" : "L"}${xFor(i)} ${yFor(v)}`).join(" ");
        const fill = `${path} L${xFor(n - 1)} ${yFor(0)} L${xFor(0)} ${yFor(0)} Z`;
        return (
          <g key={idx}>
            <path d={fill} fill={s.color} opacity="0.12" />
            <path d={path} fill="none" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  style={{ strokeDasharray: 1500, strokeDashoffset: 1500, animation: `draw 2s ${idx * 0.2}s forwards cubic-bezier(.2,.8,.2,1)` }} />
            {s.data.map((v, i) => (
              <circle key={i} cx={xFor(i)} cy={yFor(v)} r="2.5" fill="var(--bg)" stroke={s.color} strokeWidth="1.6" />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

/* ========= COUNT-UP NUMBER ========= */
const CountUp = ({ to, duration = 1200, decimals = 0, suffix = "" }) => {
  const [v, setV] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(to * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toFixed(decimals)}{suffix}</span>;
};

/* ========= REVEAL WRAPPER ========= */
const Reveal = ({ children, delay = 0, as: Tag = "div", ...rest }) => {
  const ref = useRef();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${shown ? "in" : ""} ${rest.className || ""}`}
         style={{ transitionDelay: `${delay}s`, ...(rest.style || {}) }}>
      {children}
    </Tag>
  );
};

/* ========= LIVE OUTCOMES TICKER ========= */
const LiveTicker = ({ items }) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="ticker">
      <div className="ticker-rail">
        <span className="ticker-led" />
        <span className="ticker-label">LIVE · IMPACT FEED</span>
        <span className="ticker-clock">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <div className="ticker-stream">
        {items.map((it, i) => (
          <div key={i} className="ticker-row" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="ticker-dot" style={{ background: it.color || "var(--accent)" }} />
            <span className="ticker-time">{it.t}</span>
            <span className="ticker-metric">{it.metric}</span>
            <span className="ticker-value" style={{ color: it.color || "var(--accent)" }}>{it.value}</span>
            <span className="ticker-source">{it.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { Icon, Sparkline, AreaChart, CountUp, Reveal, LiveTicker });

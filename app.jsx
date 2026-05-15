/* Main app for Salman's BI Portfolio */

const { useState: useS, useEffect: useE, useRef: useR } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "clinical",
  "accent": "mint",
  "density": "comfortable",
  "showTicker": true
}/*EDITMODE-END*/;

// Each direction is a complete look: clinical (dark dashboard), editorial (light public-health),
// notebook (Jupyter-style monospaced).
const DIRECTIONS = {
  clinical:  { theme: "dark",  accent: "mint"   },
  editorial: { theme: "light", accent: "editorial" },
  notebook:  { theme: "dark",  accent: "notebook"  },
};

const ACCENTS = {
  mint:      { c1: "oklch(0.78 0.18 165)", c2: "oklch(0.72 0.16 240)" },
  cobalt:    { c1: "oklch(0.72 0.16 240)", c2: "oklch(0.78 0.18 165)" },
  amber:     { c1: "oklch(0.78 0.16 70)",  c2: "oklch(0.68 0.20 25)"  },
  violet:    { c1: "oklch(0.72 0.18 295)", c2: "oklch(0.78 0.18 165)" },
  editorial: { c1: "oklch(0.55 0.15 30)",  c2: "oklch(0.50 0.10 200)" }, // terracotta + slate-blue
  notebook:  { c1: "oklch(0.78 0.16 70)",  c2: "oklch(0.72 0.16 240)" }, // amber + cobalt
};

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeNav, setActiveNav] = useS("overview");
  const [chartView, setChartView] = useS("impact");
  const [filter, setFilter] = useS("all");

  // Apply direction (clinical/editorial/notebook) -> theme + accent
  useE(() => {
    const root = document.documentElement;
    const dir = DIRECTIONS[tweaks.direction] || DIRECTIONS.clinical;
    root.dataset.direction = tweaks.direction;
    root.dataset.theme = dir.theme;
    root.dataset.density = tweaks.density;
    const a = ACCENTS[dir.accent] || ACCENTS.mint;
    root.style.setProperty("--accent", a.c1);
    root.style.setProperty("--accent-2", a.c2);
  }, [tweaks]);

  // Scroll spy for nav
  useE(() => {
    const ids = ["overview", "reports", "skills", "experience", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveNav(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // KPI sparkline data
  const sparks = {
    efficiency: [50, 55, 58, 62, 68, 72, 78, 82, 86, 88, 92, 95],
    cost: [100, 96, 92, 90, 88, 85, 83, 80, 78, 76, 74, 72],
    volume: [60, 65, 70, 72, 78, 84, 88, 92, 96, 102, 108, 115],
    engagement: [55, 58, 62, 65, 68, 71, 74, 77, 80, 83, 86, 88],
  };

  // Hero chart series — quarterly impact rollup
  const series = [
    { name: "Process Efficiency", color: "var(--accent)", data: [10, 18, 24, 30, 38, 42, 50, 58, 64, 72, 80, 88] },
    { name: "Member Engagement", color: "var(--accent-2)", data: [8, 14, 20, 26, 32, 38, 44, 52, 60, 68, 76, 82] },
    { name: "Cost Reduction (cum)", color: "oklch(0.78 0.16 70)", data: [2, 4, 7, 11, 15, 20, 26, 32, 39, 45, 52, 60] },
  ];

  // Live impact ticker items
  const tickerItems = [
    { t: "09:42", metric: "Risk-adjusted PMPM",        value: "\u2193 4.2%",  source: "Tabular model \u00b7 DAX",           color: "var(--accent)" },
    { t: "09:51", metric: "Authorizations / quarter",  value: "+ 200",        source: "Orlando Health \u00b7 SQL",          color: "var(--accent-2)" },
    { t: "10:03", metric: "Revenue opportunity / mo",  value: "$64K",         source: "Epic EHR billing",                   color: "var(--accent)" },
    { t: "10:14", metric: "Program efficacy YoY",      value: "\u25b2 25%",   source: "Power BI \u00b7 Exos",                color: "var(--warn)" },
    { t: "10:22", metric: "Paid claims recovered / mo",value: "+ 251",        source: "Denial root-cause",                   color: "var(--accent-2)" },
    { t: "10:36", metric: "BUs unified \u00b7 semantic model", value: "4 \u2192 1", source: "TRS \u00b7 Admin Services",     color: "var(--accent)" },
  ];

  // Project list
  const reports = [
    {
      id: "trs-claims-heatmap",
      cat: "bi",
      title: "Claims Denial Heatmap \u00b7 73 Payers",
      org: "Health Plan Reporting",
      impact: "$64K / mo recovered",
      tags: ["Power BI", "DAX", "Heatmap", "Risk Score"],
      Demo: window.DemoHeatmap,
      tag: { label: "Viz", className: "mint" },
    },
    {
      id: "trs-risk-cohort",
      cat: "bi",
      title: "HCC Risk-Score Cohort Distribution",
      org: "Health Plan Member Analytics",
      impact: "185K members modeled",
      tags: ["Power BI", "DAX", "HCC", "Cohort"],
      Demo: window.DemoRiskCohort,
      tag: { label: "Viz", className: "mint" },
    },
    {
      id: "trs-exec",
      cat: "bi",
      title: "Executive Power BI Dashboard · Admin Services",
      org: "Teacher Retirement System of TX",
      impact: "4 BUs unified",
      tags: ["Power BI", "DAX", "Semantic Model", "Executive"],
      Demo: window.DemoPopHealth,
      tag: { label: "Power BI", className: "mint" },
    },
    {
      id: "orlando-revenue",
      cat: "bi",
      title: "Epic EHR SQL Analysis · Radiology Revenue",
      org: "Orlando Health · Reporting Analyst Intern",
      impact: "$64K / mo opportunity",
      tags: ["SQL", "Epic EHR", "Feature Engineering", "Billing"],
      Demo: window.DemoGap,
      tag: { label: "Analysis", className: "mint" },
    },
    {
      id: "trs-qualtrics",
      cat: "data",
      title: "Qualtrics → Databricks → Power BI Pipeline",
      org: "Teacher Retirement System of TX",
      impact: "API-based · automated",
      tags: ["Databricks", "Qualtrics", "Power BI", "API"],
      Demo: window.DemoMedallion,
      tag: { label: "Data Eng", className: "cobalt" },
    },
    {
      id: "orlando-workqueue",
      cat: "process",
      title: "Work Queue Operational Impact Analysis",
      org: "Orlando Health · Reporting Analyst Intern",
      impact: "+1.3pp insurance pay rate",
      tags: ["SQL", "Workflow Analysis", "Radiology", "KPI"],
      Demo: window.DemoWorkflow,
      tag: { label: "Process", className: "amber" },
    },
    {
      id: "exos",
      cat: "bi",
      title: "Population Health KPI Dashboard",
      org: "Exos · Member Information Specialist",
      impact: "+25% program efficacy",
      tags: ["Power BI", "DAX", "Power Query", "KPI"],
      Demo: window.DemoPopHealth,
      tag: { label: "Power BI", className: "mint" },
    },
    {
      id: "trs-ombuds",
      cat: "process",
      title: "Ombuds Office Intake & Case Management",
      org: "Teacher Retirement System of TX",
      impact: "Legacy Access → Qualtrics",
      tags: ["Qualtrics", "Power BI", "Process Design", "Migration"],
      Demo: window.DemoQualtrics,
      tag: { label: "Platform", className: "cobalt" },
    },
    {
      id: "verisma",
      cat: "data",
      title: "PHI Disclosure & Clinical Datasets",
      org: "Verisma · Release of Information",
      impact: "1,000+ recs/mo · 100%",
      tags: ["Epic EHR", "HIPAA", "Jira", "Compliance"],
      Demo: window.DemoPHI,
      tag: { label: "Compliance", className: "mint" },
    },
  ];

  const filtered = filter === "all" ? reports : reports.filter(r => r.cat === filter);

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">SC</div>
          <div className="brand-info">
            <b>Salman Chaudhry</b>
            <span>portfolio.v3</span>
          </div>
        </div>

        <div className="workspace-pill">
          <span className="ws-name">
            <span className="dot-pulse"></span>
            <span>Available · Austin, TX</span>
          </span>
        </div>

        <nav className="nav-group">
          <div className="nav-group-label">Workspace</div>
          <a href="#overview" className={`nav-item ${activeNav === "overview" ? "active" : ""}`}>
            <span style={{ display: "flex", alignItems: "center" }}><span className="ico"><Icon name="home" /></span>Overview</span>
          </a>
          <a href="#reports" className={`nav-item ${activeNav === "reports" ? "active" : ""}`}>
            <span style={{ display: "flex", alignItems: "center" }}><span className="ico"><Icon name="chart" /></span>Reports</span>
            <span className="badge">7</span>
          </a>
          <a href="#skills" className={`nav-item ${activeNav === "skills" ? "active" : ""}`}>
            <span style={{ display: "flex", alignItems: "center" }}><span className="ico"><Icon name="cube" /></span>Capabilities</span>
          </a>
          <a href="#experience" className={`nav-item ${activeNav === "experience" ? "active" : ""}`}>
            <span style={{ display: "flex", alignItems: "center" }}><span className="ico"><Icon name="flow" /></span>Experience</span>
          </a>
          <a href="#contact" className={`nav-item ${activeNav === "contact" ? "active" : ""}`}>
            <span style={{ display: "flex", alignItems: "center" }}><span className="ico"><Icon name="mail" /></span>Contact</span>
          </a>
        </nav>

        <nav className="nav-group">
          <div className="nav-group-label">Resources</div>
          <a href="Salman_Chaudhry_Resume.pdf" target="_blank" className="nav-item">
            <span style={{ display: "flex", alignItems: "center" }}><span className="ico"><Icon name="file" /></span>Download my resume</span>
            <span className="badge">PDF</span>
          </a>
          <a href="https://github.com/salmanzchaudhry" target="_blank" className="nav-item">
            <span style={{ display: "flex", alignItems: "center" }}><span className="ico"><Icon name="code" /></span>GitHub</span>
            <span className="badge">↗</span>
          </a>
          <a href="https://linkedin.com/in/salmanzchaudhry" target="_blank" className="nav-item">
            <span style={{ display: "flex", alignItems: "center" }}><span className="ico"><Icon name="link" /></span>LinkedIn</span>
            <span className="badge">↗</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">SC</div>
          <div className="who">
            <b>Salman C.</b>
            <span>Business Analyst</span>
          </div>
          <span className="status-dot"></span>
        </div>
      </aside>

      {/* MAIN */}
      <main className="canvas">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="breadcrumb">
            <span>workspace</span>
            <span className="sep">/</span>
            <b>{activeNav}</b>
          </div>

          <div className="dir-switcher" role="tablist" aria-label="Design direction">
            <span className="dir-switcher-label">Direction</span>
            {[
              ["clinical",  "Clinical"],
              ["editorial", "Editorial"],
              ["notebook",  "Notebook"],
            ].map(([k, l]) => (
              <button key={k}
                      className={`dir-chip ${tweaks.direction === k ? "active" : ""}`}
                      onClick={() => setTweak("direction", k)}
                      title={`Switch to ${l} direction`}>
                <span className={`dir-swatch dir-swatch-${k}`} />
                {l}
              </button>
            ))}
          </div>

          <div className="search">
            <Icon name="search" size={12} />
            <span>Search projects, tools, methods…</span>
            <kbd>⌘K</kbd>
          </div>
          <button className="iconbtn" title="Notifications"><Icon name="bell" size={13} /></button>
          <a href="mailto:schaudhry1219@gmail.com" className="cta-ghost email-pill"><Icon name="mail" size={12} />schaudhry1219@gmail.com</a>
          <a href="Salman_Chaudhry_Resume.pdf" target="_blank" className="cta"><Icon name="download" size={12} />Download my resume</a>
        </div>

        {/* PAGE */}
        <div className="page" id="overview">
          {/* HERO HEAD */}
          <Reveal className="page-head">
            <div>
              <div className="page-title-row">
                <h1 className="page-title">Overview</h1>
                <span className="tag live">LIVE · updated April 2026</span>
                <span className="tag">v3.0</span>
              </div>
              <p className="page-sub">
                Health data visualization analyst with an MS in Health Informatics. I build Power BI tabular
                models, write DAX measures over claims, enrollment, and risk-score data, and turn high-volume
                health data into accessible dashboards that drive executive and policy decisions.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="#reports" className="cta-ghost"><Icon name="grid" size={12} />View Reports</a>
              <a href="#contact" className="cta"><Icon name="arrow" size={12} />Get in touch</a>
            </div>
          </Reveal>

          {/* LIVE TICKER */}
          {tweaks.showTicker && (
            <Reveal>
              <LiveTicker items={tickerItems} />
            </Reveal>
          )}

          {/* KPI GRID */}
          <div className="kpi-grid">
            <Reveal className="kpi" delay={0}>
              <div className="kpi-head"><span>Revenue Opportunity</span><span className="delta">/ mo</span></div>
              <div className="kpi-value">$<CountUp to={64} />K</div>
              <div className="kpi-sub">surfaced via SQL @ Orlando Health</div>
              <div className="kpi-spark"><Sparkline data={sparks.efficiency} color="var(--accent)" /></div>
            </Reveal>
            <Reveal className="kpi" delay={0.05}>
              <div className="kpi-head"><span>Epic EHR Records</span><span className="delta">cleaned</span></div>
              <div className="kpi-value"><CountUp to={94.5} decimals={1} />K<span className="unit">+</span></div>
              <div className="kpi-sub">SQL transforms across billing tables</div>
              <div className="kpi-spark"><Sparkline data={sparks.volume} color="var(--accent-2)" /></div>
            </Reveal>
            <Reveal className="kpi" delay={0.10}>
              <div className="kpi-head"><span>Paid Claims Recovered</span><span className="delta">/ mo</span></div>
              <div className="kpi-value"><CountUp to={251} /></div>
              <div className="kpi-sub">root-cause analysis · 73+ payers</div>
              <div className="kpi-spark"><Sparkline data={sparks.engagement} color="oklch(0.78 0.16 70)" /></div>
            </Reveal>
            <Reveal className="kpi" delay={0.15}>
              <div className="kpi-head"><span>Program Efficacy</span><span className="delta">▲ 25%</span></div>
              <div className="kpi-value"><CountUp to={25} suffix="%" /></div>
              <div className="kpi-sub">Power BI + DAX @ Exos</div>
              <div className="kpi-spark"><Sparkline data={sparks.cost} color="var(--accent)" /></div>
            </Reveal>
          </div>

          {/* HERO BOARD: chart + intro */}
          <div className="hero-board">
            <Reveal className="board" delay={0.1}>
              <div className="board-head">
                <div>
                  <div className="board-title">Cumulative impact across roles</div>
                  <div className="board-sub">Q1'22 — Q4'24 · indexed to baseline</div>
                </div>
                <div className="seg">
                  <button className={chartView === "impact" ? "active" : ""} onClick={() => setChartView("impact")}>Impact</button>
                  <button className={chartView === "delta" ? "active" : ""} onClick={() => setChartView("delta")}>QoQ</button>
                </div>
              </div>
              <div className="chart-area">
                <AreaChart series={series} height={220} />
              </div>
              <div style={{ display: "flex", gap: 18, paddingTop: 10, borderTop: "1px solid var(--line)", marginTop: 6 }}>
                {series.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-2)" }}>
                    <span style={{ width: 10, height: 2, background: s.color, borderRadius: 1 }} />
                    {s.name}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="hero-overview" delay={0.2}>
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  <span className="tag mint">Power BI</span>
                  <span className="tag cobalt">SQL</span>
                  <span className="tag amber">Lean Six Sigma</span>
                </div>
                <h1>Turning <span className="accent">health data</span> into decisions executives can act on.</h1>
              </div>
              <p>
                Across claims, enrollment, risk scores, and member analytics — I build the tabular models,
                write the DAX, and design the dashboards that boards and stakeholders use to set policy.
              </p>
              <div className="actions">
                <a href="#reports" className="cta"><Icon name="grid" size={12} />Explore Work</a>
                <a href="Salman_Chaudhry_Resume.pdf" target="_blank" className="cta-ghost"><Icon name="file" size={12} />Get my resume</a>
              </div>
              <div className="meta">
                <div><b>3+ yrs</b><span>Experience</span></div>
                <div><b>3.8 GPA</b><span>MS Health Informatics</span></div>
                <div><b>3</b><span>Certifications</span></div>
              </div>
            </Reveal>
          </div>

          {/* REPORTS */}
          <section className="section" id="reports">
            <Reveal className="section-head">
              <div>
                <div className="section-title">
                  Reports <span className="count">{filtered.length} of {reports.length}</span>
                </div>
                <div className="section-sub">Real projects with measurable outcomes. Each card is interactive — click around.</div>
              </div>
              <div className="filter-bar">
                <Icon name="filter" size={12} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: 0.06, textTransform: "uppercase" }}>Filter</span>
                {[
                  ["all", "All"], ["bi", "BI / Analytics"], ["process", "Process"], ["data", "Data Eng"]
                ].map(([k, l]) => (
                  <span key={k} className={`filter-chip ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>{l}</span>
                ))}
              </div>
            </Reveal>

            <div className="report-grid">
              {filtered.map((r, i) => {
                const Demo = r.Demo;
                return (
                  <Reveal className="report" delay={(i % 3) * 0.06} key={r.id}>
                    <div className="report-head">
                      <div>
                        <div className="report-org">{r.org}</div>
                        <div className="report-title">{r.title}</div>
                      </div>
                      <span className="report-impact">{r.impact}</span>
                    </div>
                    <div className="report-demo">
                      {Demo ? <Demo /> : <div style={{ color: "var(--text-3)" }}>demo</div>}
                    </div>
                    <div className="report-foot">
                      <div className="report-tags">
                        {r.tags.slice(0, 4).map(t => <span key={t} className="report-tag">{t}</span>)}
                      </div>
                      <span className="report-link">Open report <Icon name="arrow" size={11} /></span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* SKILLS */}
          <section className="section" id="skills">
            <Reveal className="section-head">
              <div>
                <div className="section-title">Capabilities <span className="count">2 panels</span></div>
                <div className="section-sub">A toolkit at the intersection of healthcare, business analysis, and analytics.</div>
              </div>
            </Reveal>

            <div className="skills-grid">
              <Reveal className="skill-panel">
                <div className="skill-panel-head">
                  <div className="skill-panel-title">Languages, BI & Methods</div>
                  <div className="skill-panel-meta">self-rated</div>
                </div>
                {[
                  ["Power BI / DAX", 90],
                  ["Advanced Excel", 93],
                  ["Power Query", 88],
                  ["SQL (T-SQL, BigQuery)", 80],
                  ["Lean Six Sigma", 88],
                  ["Gap & Requirements Analysis", 92],
                  ["Python (Pandas, NumPy)", 65],
                  ["Databricks / PySpark", 60],
                ].map(([n, p]) => <SkillBar key={n} name={n} pct={p} />)}
              </Reveal>

              <Reveal className="skill-panel" delay={0.1}>
                <div className="skill-panel-head">
                  <div className="skill-panel-title">Full Toolkit</div>
                  <div className="skill-panel-meta">25 tools</div>
                </div>
                <div className="tools-grid">
                  {[
                    "Power BI","DAX","SQL","Python","Power Query","Databricks","PySpark","Excel",
                    "SAS JMP","SSMS","Git","Epic EHR","ServiceNow","Visio","Jira","Qualtrics",
                    "BPMN","KPI Design","Lean Six Sigma","Agile","ETL / ELT","EDA","HIPAA","Star Schema",
                  ].map(t => <div key={t} className="tool">{t}</div>)}
                </div>
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <Cert label="Sterling Academy" value="Lean Six Sigma · Green Belt" />
                  <Cert label="Coursera" value="Google Data Analytics" />
                  <Cert label="UT Austin" value="Business Analysis" />
                  <Cert label="Microsoft" value="Power BI Data Analyst · in progress" />
                  <Cert label="DataCamp" value="Data Analyst in Python · in progress" />
                </div>
              </Reveal>
            </div>
          </section>

          {/* EXPERIENCE */}
          <section className="section" id="experience">
            <Reveal className="section-head">
              <div>
                <div className="section-title">Experience <span className="count">4 roles</span></div>
                <div className="section-sub">From healthcare ops to enterprise BA — the through-line is data-driven decisions.</div>
              </div>
            </Reveal>

            <Reveal className="timeline-board">
              <TLRow when={["Sept 2024", "Present · Austin, TX"]} title="Business Analyst Associate" org="Teacher Retirement System of Texas"
                body="Led end-to-end design and delivery of an integrated Power BI dashboard for the Chief of Administrative Services, architecting a semantic model that consolidated four business units. Scoped a Qualtrics→Databricks→Power BI API pipeline. Owns the annual member satisfaction survey, with findings presented to the Board of Trustees."
                stats={[["BUs unified", "4"], ["Pipeline", "automated"]]} />
              <TLRow when={["May — Aug 2024", "Orlando, FL"]} title="Business Development Reporting Analyst Intern" org="Orlando Health"
                body="Wrote complex SQL to clean and transform 94,500+ Epic EHR records, joining disparate billing tables and engineering features (e.g., scheduling-accuracy flags) that surfaced a $64K/mo revenue opportunity. Evaluated Work Queue impact across radiology and identified payer-segmented denial root causes."
                stats={[["Revenue opp / mo", "$64K"], ["Paid claims / mo", "+251"]]} />
              <TLRow when={["June 2022 — Feb 2024", "Orlando, FL"]} title="Member Information Specialist" org="Exos"
                body="Built and maintained Power BI dashboards (DAX + Power Query) tracking population health KPIs. Analyzed health program datasets in advanced Excel to monitor engagement and churn drivers; recommended evidence-based incentive programs."
                stats={[["Program efficacy", "+25%"], ["Participation", "+15%"]]} />
              <TLRow when={["Jan — Aug 2023", "Remote"]} title="Release of Information Specialist" org="Verisma"
                body="Interpreted medical records and legal authorizations to manage 1,000+ monthly PHI disclosures with full HIPAA/HITECH compliance. Navigated Epic EHR to extract documentation for legal & insurance stakeholders; managed 50+ daily ROI requests in Jira."
                stats={[["Disclosures / mo", "1,000+"], ["Compliance", "100%"]]} />
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
              <Reveal className="board" delay={0.05}>
                <div className="board-head">
                  <div className="board-title">Education · Graduate</div>
                  <div className="board-sub">Aug 2024</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Nova Southeastern University</div>
                <div style={{ color: "var(--text-2)", fontSize: 12, marginTop: 2 }}>MS, Health Informatics</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", marginTop: 8 }}>GPA 3.8 · Davie, FL</div>
              </Reveal>
              <Reveal className="board" delay={0.1}>
                <div className="board-head">
                  <div className="board-title">Education · Undergraduate</div>
                  <div className="board-sub">Dec 2021</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>University of Central Florida</div>
                <div style={{ color: "var(--text-2)", fontSize: 12, marginTop: 2 }}>BS, Kinesiology</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", marginTop: 8 }}>GPA 3.7 · Orlando, FL</div>
              </Reveal>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact">
            <Reveal className="contact-band">
              <div>
                <h2>Open to <span className="accent">Data Analyst</span> & <span className="accent">Business Analyst</span> roles.</h2>
                <p>Where health-domain expertise, business intuition, and data skills create measurable impact. Based in Austin, open to hybrid + remote.</p>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <span className="tag live">Available now</span>
                  <span className="tag">Austin, TX</span>
                  <span className="tag">Remote / Hybrid</span>
                </div>
              </div>
              <div className="contact-actions">
                <a href="mailto:schaudhry1219@gmail.com" className="contact-link">
                  <span className="label"><Icon name="mail" size={13} />schaudhry1219@gmail.com</span>
                  <span className="arrow">→</span>
                </a>
                <a href="https://linkedin.com/in/salmanzchaudhry" target="_blank" className="contact-link">
                  <span className="label"><Icon name="link" size={13} />linkedin.com/in/salmanzchaudhry</span>
                  <span className="arrow">↗</span>
                </a>
                <a href="Salman_Chaudhry_Resume.pdf" target="_blank" className="contact-link">
                  <span className="label"><Icon name="file" size={13} />Download my resume</span>
                  <span className="arrow">↓</span>
                </a>
              </div>
            </Reveal>
          </section>

          <footer>
            <span>© 2026 · Salman Chaudhry · Built as a BI workspace</span>
            <span>v3.0 · last refresh 12s ago</span>
          </footer>
        </div>
      </main>

      {/* TWEAKS PANEL */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Design Direction">
          <TweakRadio label="Look" value={tweaks.direction}
                       options={[["clinical", "Clinical"], ["editorial", "Editorial"], ["notebook", "Notebook"]]}
                       onChange={v => setTweak("direction", v)} />
          <div style={{ fontSize: 11, color: "var(--text-3)", lineHeight: 1.5, padding: "4px 2px" }}>
            {tweaks.direction === "clinical"  && "Dense Epic/Tableau dashboard \u2014 dark, mint, data-rich."}
            {tweaks.direction === "editorial" && "Public-health editorial \u2014 light, calm, infographic."}
            {tweaks.direction === "notebook"  && "Jupyter notebook \u2014 monospaced, In/Out cells, code-led."}
          </div>
        </TweakSection>
        <TweakSection title="Layout">
          <TweakRadio label="Density" value={tweaks.density} options={[["comfortable", "Comfy"], ["compact", "Compact"]]}
                       onChange={v => setTweak("density", v)} />
          <TweakToggle label="Live impact ticker" value={tweaks.showTicker}
                       onChange={v => setTweak("showTicker", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function SkillBar({ name, pct }) {
  const ref = useR();
  const fillRef = useR();
  useE(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${pct / 100})`;
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);
  return (
    <div className="skill-row" ref={ref}>
      <span className="name">{name}</span>
      <div className="skill-track"><div ref={fillRef} className="skill-fill" /></div>
      <span className="pct">{pct}</span>
    </div>
  );
}

function Cert({ label, value }) {
  return (
    <div style={{ padding: 10, background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 6 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-3)", letterSpacing: 0.08, textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text)" }}>{value}</div>
    </div>
  );
}

function TLRow({ when, title, org, body, stats }) {
  return (
    <div className="tl-row">
      <div className="tl-when">
        <b>{when[0]}</b>
        {when[1]}
      </div>
      <div className="tl-body">
        <h3>{title}</h3>
        <div className="org">{org}</div>
        <p>{body}</p>
      </div>
      <div className="tl-impact">
        {stats.map(([k, v]) => (
          <div key={k} className="stat"><span>{k}</span><b>{v}</b></div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

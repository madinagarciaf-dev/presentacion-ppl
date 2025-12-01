import React, { useEffect, useMemo, useState } from "react";
import "./index.css";

export default function App() {
  const slides = useMemo(
    () => [
      { id: "oferta", label: "Oferta", node: (props) => <SlideOferta {...props} /> },
      { id: "caso", label: "Caso", node: (props) => <SlideCasoTransformacion {...props} /> },
    ],
    []
  );

  const [current, setCurrent] = useState(0);
  const [detail, setDetail] = useState(() => {
    const v = localStorage.getItem("ppl_detail");
    return v ? v === "1" : false;
  });

  useEffect(() => localStorage.setItem("ppl_detail", detail ? "1" : "0"), [detail]);

  const go = (idx) => setCurrent(Math.max(0, Math.min(slides.length - 1, idx)));
  const next = () => setCurrent((v) => (v + 1) % slides.length);
  const prev = () => setCurrent((v) => (v - 1 + slides.length) % slides.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key.toLowerCase() === "d") setDetail((s) => !s); // atajo: D
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Slide = slides[current].node;

  return (
    <div className="appRoot">
      <main className="stage">
        <div className="deck">
          <div className="card">
            <Slide detail={detail} setDetail={setDetail} />
          </div>

          <button className="navArrow left" onClick={prev} aria-label="Anterior">
            ‹
          </button>
          <button className="navArrow right" onClick={next} aria-label="Siguiente">
            ›
          </button>

          <div className="navDots" aria-label="Navegación">
            {slides.map((s, i) => (
              <button
                key={s.id}
                className={"dot" + (i === current ? " active" : "")}
                onClick={() => go(i)}
                aria-label={`Ir a ${s.label}`}
                title={s.label}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------------------------- helpers -------------------------- */

function cut(list, n, detail) {
  return detail ? list : list.slice(0, n);
}

/* --------------------------- GENERIC UI --------------------------- */

function SlideShell({ badge, title, subtitle, children, rightNote, detail, setDetail }) {
  return (
    <section className="slide">
      <header className="slideHeader">
        <div className="slideHeaderLeft">
          <BrandIcon />
          <div className="slideHeaderText">
            <div className="slideBadgeRow">
              <span className="slideBadge">{badge}</span>
              <span className="slideBadgeSoft">Transformación continua</span>
              <span className="slideBadgeSoft">Power Platform · Azure · Datos · IA</span>
            </div>
            <div className="slideTitle">{title}</div>
            <div className="slideSubtitle">{subtitle}</div>
          </div>
        </div>

        <div className="slideHeaderRight">
          <div className="hkLogo">h&amp;k</div>
          <div className="hkTagline">Smart Tech · Human Touch</div>

          <button
            className={"modeToggle" + (detail ? " on" : "")}
            onClick={() => setDetail((v) => !v)}
            title="Atajo teclado: D"
            aria-label="Cambiar modo de detalle"
          >
            <span className="modeDot" />
            {detail ? "Detalle" : "Resumen"}
          </button>

          {rightNote ? <div className="hkNote">{rightNote}</div> : null}
        </div>
      </header>

      <div className="slideBody">{children}</div>
    </section>
  );
}

function Section({ eyebrow, title, children, right }) {
  return (
    <div className="section">
      <div className="sectionHead">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <div className="sectionTitle">{title}</div>
        </div>
        {right ? <div className="sectionRight">{right}</div> : null}
      </div>
      <div className="sectionBody">{children}</div>
    </div>
  );
}

function Metric({ label, value, hint, tone = "teal" }) {
  return (
    <div className={"metric metric-" + tone}>
      <div className="metricValue">{value}</div>
      <div className="metricLabel">{label}</div>
      {hint ? <div className="metricHint">{hint}</div> : null}
    </div>
  );
}

function Chip({ children, tone = "soft" }) {
  return <span className={"chip chip-" + tone}>{children}</span>;
}

function PillList({ items }) {
  return (
    <div className="pillList">
      {items.map((t) => (
        <span className="pill" key={t}>
          {t}
        </span>
      ))}
    </div>
  );
}

function RoleCard({ role, competencyTitle, competencies, taskTitle, tasks, detail }) {
  const comp = cut(competencies, 2, detail);
  const tsk = cut(tasks, 2, detail);

  return (
    <div className="roleCard">
      <div className="roleTop">
        <div className="roleTopRow">
          <div className="roleName">{role}</div>
          <span className="roleTag">Competencias</span>
        </div>
        <div className="roleTopTitle">{competencyTitle}</div>
        <ul className="roleList roleListTop">
          {comp.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        {!detail && competencies.length > 3 ? (
          <div className="moreHint">+ {competencies.length - 3} más en modo Detalle</div>
        ) : null}
      </div>

      <div className="roleBottom">
        <div className="roleBottomRow">
          <span className="roleTagAlt">Tareas dentro del proceso</span>
        </div>
        <div className="roleBottomTitle">{taskTitle}</div>
        <ul className="roleList">
          {tsk.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        {!detail && tasks.length > 3 ? (
          <div className="moreHint dark">+ {tasks.length - 3} más en modo Detalle</div>
        ) : null}
      </div>
    </div>
  );
}

function CapabilityGroup({ title, items, icon, detail }) {
  const list = cut(items, 2, detail);
  return (
    <div className="capGroup">
      <div className="capHead">
        <span className="capIcon" aria-hidden="true">
          {icon}
        </span>
        <div className="capTitle">{title}</div>
      </div>
      <div className="capItems">
        {list.map((x) => (
          <div className="capItem" key={x}>
            <span className="capDot" aria-hidden="true" />
            <span>{x}</span>
          </div>
        ))}
      </div>
      {!detail && items.length > 2 ? <div className="capHint">Ver + en Detalle</div> : null}
    </div>
  );
}

function ProcessLane({ steps, detail }) {
  const list = detail ? steps : steps.map((s) => ({ ...s, text: s.textShort ?? s.text }));
  return (
    <div className="processLane">
      {list.map((s, idx) => (
        <div className="processStep" key={s.title}>
          <div className="processIndex">{idx + 1}</div>
          <div className="processContent">
            <div className="processTitle">{s.title}</div>
            <div className="processText">{detail ? s.text : s.textShort}</div>
            {s.tags?.length ? <PillList items={detail ? s.tags : s.tags.slice(0, 2)} /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function BrandIcon() {
  return (
    <div className="brandIcon" aria-hidden="true">
      <div className="brandSquare" />
      <div className="brandLines">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

/* --------------------------- SLIDE 1 --------------------------- */

function SlideOferta({ detail, setDetail }) {
  const pillars = [
    {
      title: "Propósito",
      kicker: "Transformación continua: portfolio vivo de soluciones, no proyectos sueltos.",
      bullets: [
        "Backlog vivo, priorizado por impacto con CIO.",
        "Cadencia de entregas + evolución constante.",
        "Seguimiento compartido: avance, stoppers y decisiones.",
      ],
      chips: ["Transformación continua", "Prioridad CIO", "Transparencia"],
      icon: <SvgTarget />,
    },
    {
      title: "Personas",
      kicker: "Convertimos conocimiento tácito en proceso digital gobernado (uso real, no PPTs).",
      bullets: [
        "Discovery con stakeholders y empatía con el proceso real.",
        "Definición funcional clara + optimización cuando aplica.",
        "Adopción por rol: formación, mensajes clave y soporte.",
      ],
      chips: ["Discovery", "Definición", "Adopción"],
      icon: <SvgUsers />,
    },
    {
      title: "Plataforma",
      kicker: "Microsoft (Power Platform + Azure + Datos + IA) aplicado con ALM y gobierno.",
      bullets: [
        "Datos y seguridad: modelo + roles/permisos (RLS).",
        "Apps multicanal + agentes end-to-end.",
        "Integración bidireccional (conectores y APIs).",
      ],
      chips: ["Dataverse", "Automate", "IA", "ALM"],
      icon: <SvgPlatform />,
    },
  ];

  const steps = [
    { name: "Discovery", hint: "proceso real" },
    { name: "Definición", hint: "requisitos" },
    { name: "Prioridad", hint: "backlog" },
    { name: "Construcción", hint: "sprints + ALM" },
    { name: "Evolución", hint: "uso real" },
  ];

  const roleMini = [
    {
      name: "Negocio · Discovery & Prioridad",
      badge: "1–3",
      do: ["Entrevistas clave", "Backlog y criterios de valor"],
      know: ["Empatía + visión transversal", "Necesidad → requisito"],
    },
    {
      name: "Arquitectura · Diseño & Viabilidad",
      badge: "2–3",
      do: ["Patrón: core/módulo/satélite", "Modelo datos + roles/permisos"],
      know: ["Escalabilidad sin redundancias", "Coste, riesgo y viabilidad"],
    },
    {
      name: "Desarrollo · Construcción",
      badge: "4",
      do: ["Apps + lógica + validaciones", "Agentes, integraciones y hardening"],
      know: ["Buenas prácticas PP + técnica", "Gestión de stoppers"],
    },
    {
      name: "Adopción & Gobierno · Continuidad",
      badge: "5",
      do: ["Plan adopción + soporte inicial", "Gobierno (DLP/ALM) + KPIs uso"],
      know: ["Gestión del cambio", "Sostenibilidad del portfolio"],
    },
  ];

  return (
    <SlideShell
      badge="Lo que ofrecemos"
      title="Transformación continua con Power Platform"
      subtitle="Propósito · Personas · Plataforma: un modelo integrado para construir un portfolio vivo de soluciones digitales."
      rightNote="Pulsa D para Detalle"
      detail={detail}
      setDetail={setDetail}
    >
      <div className="offerWrap">
        {/* HERO */}
        <div className="offerHero">
          <div className="offerHeroLeft">
            <div className="offerEyebrow">En 10 segundos</div>
            <div className="offerHeadline">La transformación no es una entrega. Es un sistema operativo.</div>
            <p className="offerSub">
              Identificamos necesidades, las convertimos en definición clara, priorizamos con CIO y construimos
              soluciones en producción con un ritmo continuo (y gobernado).
            </p>
          </div>

          <div className="offerHeroRight">
            <div className="offerKpis">
              <div className="kpiCard">
                <div className="kpiLabel">Enfoque</div>
                <div className="kpiValue">Impacto</div>
                <div className="kpiHint">valor &gt; entregables</div>
              </div>
              <div className="kpiCard">
                <div className="kpiLabel">Modelo</div>
                <div className="kpiValue">Continuo</div>
                <div className="kpiHint">no one-shot</div>
              </div>
              <div className="kpiCard">
                <div className="kpiLabel">Cadencia</div>
                <div className="kpiValue">Iterativa</div>
                <div className="kpiHint">agile + transparencia</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 BLOQUES GIGANTES */}
        <div className="offerPillars">
          {pillars.map((p) => (
            <div className="pillarBig" key={p.title}>
              <div className="pillarBar" />
              <div className="pillarHead">
                <div className="pillarIcon">{p.icon}</div>
                <div>
                  <div className="pillarTitle">{p.title}</div>
                  <div className="pillarKicker">{p.kicker}</div>
                </div>
              </div>

              <ul className="pillarList">
                {cut(p.bullets, 2, detail).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              <div className="pillarChips">
                {cut(p.chips, 3, detail).map((c) => (
                  <span className="pill" key={c}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ABAJO: PROCESO + ROLES (resumen) */}
        <div className="offerBottom">
          <div className="block">
            <div className="blockTitle">Cómo operamos</div>
            <div className="blockSub">De discovery a evolución, con backlog vivo y ritmo continuo.</div>
            <div className="stepRow">
              {steps.map((s, i) => (
                <div className="stepPill" key={s.name}>
                  <div className="stepNum">{i + 1}</div>
                  <div>
                    <span className="stepText">{s.name}</span>
                    <span className="stepHint">· {s.hint}</span>
                  </div>
                </div>
              ))}
            </div>

            {detail && (
              <>
                <hr className="hrSoft" />
                {/* En detalle, ya metes tu ProcessLane antiguo (si quieres) */}
                <div className="blockTitle" style={{ fontSize: 14, marginBottom: 8 }}>
                  Detalle (fases)
                </div>
                {/* Reusa tu steps anterior si quieres, o el ProcessLane existente */}
                {/* <ProcessLane steps={...} detail={detail} /> */}
              </>
            )}
          </div>

          <div className="block">
            <div className="blockTitle">Roles (valor en cada fase)</div>
            <div className="blockSub">4 perfiles que convierten necesidad en solución adoptada.</div>

            <div className="roleMiniGrid">
              {roleMini.map((r) => (
                <div className="roleMini" key={r.name}>
                  <div className="roleMiniHead">
                    <div className="roleMiniName">{r.name}</div>
                    <div className="roleMiniBadge">Fase {r.badge}</div>
                  </div>

                  <div className="roleMiniBody">
                    <div className="rolePane do">
                      <div className="rolePaneTitle">Qué hace</div>
                      <ul>
                        {cut(r.do, 2, detail).map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </div>
                    <div className="rolePane know">
                      <div className="rolePaneTitle">Qué aporta</div>
                      <ul>
                        {cut(r.know, 2, detail).map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {detail && (
              <>
                <hr className="hrSoft" />
                {/* Aquí, en detalle, puedes volver a mostrar tus RoleCard grandes si quieres */}
                {/* <div className="rolesGrid"> ... RoleCard ... </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}



/* --------------------------- SLIDE 2 --------------------------- */

function SlideCasoTransformacion({ detail, setDetail }) {
  const process = [
    {
      title: "Discovery",
      textShort: "Captura de necesidades con stakeholders y proceso real (tácito).",
      text:
        "Necesidades captadas con stakeholders, empatía y entendimiento del proceso real. " +
        "Se documenta el “cómo se hace” para que deje de vivir solo en personas clave.",
      tags: ["Negocio", "Stakeholders", "Proceso"],
    },
    {
      title: "Definición + Optimización",
      textShort: "Requisitos claros + optimización del flujo + patrón de solución elegido.",
      text:
        "Requerimientos claros, optimización del flujo si aplica, definición funcional y técnica; " +
        "decisión del patrón (core / módulo / satélite) y estimación de costes.",
      tags: ["Arquitectura", "Viabilidad", "Coste"],
    },
    {
      title: "Priorización y Backlog",
      textShort: "Backlog vivo priorizado con CIO + transparencia de avance/stoppers.",
      text:
        "Backlog vivo priorizado con CIO: valor, urgencia, dependencias y capacidad. " +
        "Transparencia de avance, stoppers y decisiones (reporting adaptado al decisor).",
      tags: ["CIO", "Backlog", "Transparencia"],
    },
    {
      title: "Construcción iterativa",
      textShort: "Sprints, demos, calidad y despliegues gobernados (ALM).",
      text:
        "Sprints, demos recurrentes, control de calidad, y despliegues gobernados (ALM). " +
        "Se evoluciona lo ya desplegado mientras se entrega nuevo valor.",
      tags: ["Agile", "ALM", "Entrega"],
    },
    {
      title: "Adopción y Evolución",
      textShort: "Formación por rol + monitorización + nuevas oportunidades al backlog.",
      text:
        "Formación por rol, acompañamiento y monitorización del uso. " +
        "Se detectan nuevas oportunidades y se retroalimenta el backlog: transformación continua.",
      tags: ["Adopción", "KPIs", "Evolución"],
    },
  ];

  return (
    <SlideShell
      badge="Caso de uso"
      title="Transformación continua: programa real (12 meses)"
      subtitle="Necesidades → definición → backlog → entregas en producción → evolución (misma estructura, mismo idioma para CIO y negocio)."
      rightNote="Resumen/Detalle ajusta densidad"
      detail={detail}
      setDetail={setDetail}
    >
      <div className="grid2">
        <div className="col">
          <Section
            eyebrow="PROPÓSITO"
            title="Un flujo constante de valor (no un proyecto aislado)"
            right={
              <div className="metricsRow">
                <Metric label="Mes 0–6" value="22" hint="necesidades detectadas" tone="teal" />
                <Metric label="En producción" value="5" hint="soluciones entregadas" tone="blue" />
                <Metric label="Mes 7–12" value="25" hint="nuevos casos de uso" tone="teal" />
                <Metric label="En producción" value="10" hint="soluciones entregadas" tone="blue" />
              </div>
            }
          >
            <div className="callout">
              <div className="calloutTitle">
                6 meses: 22 necesidades → 5 soluciones. Siguientes 6 meses: +capacidad → 10 soluciones y 25 nuevos casos.
              </div>
              <div className="calloutText">
                El motor del resultado: <strong>stakeholders</strong> + <strong>backlog con CIO</strong> +{" "}
                <strong>plataforma gobernada</strong>. Sin esto, todo se vuelve one-shot.
              </div>
              <div className="calloutChips">
                <Chip tone="strong">Ritual CIO (visión)</Chip>
                <Chip tone="strong">Ritual PO (por solución)</Chip>
                <Chip tone="strong">Stoppers visibles</Chip>
              </div>
            </div>

            <Section eyebrow="CICLO OPERATIVO" title="El mismo sistema operativo, aplicado al caso">
              <ProcessLane steps={process} detail={detail} />
            </Section>
          </Section>
        </div>

        <div className="col">
          <Section eyebrow="PLATAFORMA (PATRONES)" title="3 tipos de solución dentro del programa">
            <div className="solutionGrid">
              <SolutionCard
                title="1) Aisladas"
                tag="rápidas y específicas"
                text="Módulos independientes, sin dependencias. Time-to-value máximo."
                bullets={[
                  "App o agente puntual",
                  "Bajo acoplamiento",
                  "Entrega rápida",
                ]}
              />
              <SolutionCard
                title="2) Módulos conectados"
                tag="input ERP → output ERP"
                text="Toman datos del ERP/CRM, orquestan acciones/validaciones y devuelven datos enriquecidos."
                bullets={[
                  "Integración bidireccional",
                  "Validaciones y aprobaciones",
                  "Trazabilidad end-to-end",
                ]}
              />
              <SolutionCard
                title="3) Núcleos nuevos"
                tag="la plataforma como base"
                text="Sin sistema previo: creamos el modelo completo (datos maestros + operación) y alimentamos módulos del ERP o nueva línea de negocio."
                bullets={[
                  "Dataverse como core",
                  "Roles/permisos + ALM",
                  "Escalable a múltiples módulos",
                ]}
              />
            </div>
          </Section>

          <Section eyebrow="PERSONAS + GOBIERNO" title="Backlog, seguimiento y decisiones (lo que hace que escale)">
            <div className="twoCards">
              <div className="tightCard">
                <div className="tightCardTitle">Backlog con CIO</div>
                <div className="tightCardText">
                  Un backlog único priorizado por valor, urgencia, dependencias y capacidad. Cambios de prioridad sin fricción.
                </div>
                <PillList items={detail ? ["Valor", "Urgencia", "Dependencias", "Riesgo", "Capacidad"] : ["Valor", "Capacidad"]} />
              </div>
              <div className="tightCard">
                <div className="tightCardTitle">Seguimiento transparente</div>
                <div className="tightCardText">
                  Estado real: avance, bloqueos, próximos hitos. Comunicación adaptada al decisor (síntesis o detalle).
                </div>
                <PillList items={detail ? ["Demos", "Stoppers", "Hitos", "Decisiones"] : ["Demos", "Stoppers"]} />
              </div>
            </div>

            <div className="miniNote">
              <strong>Resultado:</strong> al mantener <strong>modelo reusable</strong> + <strong>gobierno</strong> +{" "}
              <strong>backlog vivo</strong>, cada solución nueva cuesta menos y llega antes a producción.
            </div>
          </Section>
        </div>
      </div>
    </SlideShell>
  );
}

function SolutionCard({ title, tag, text, bullets }) {
  return (
    <div className="solutionCard">
      <div className="solutionTop">
        <div className="solutionTitle">{title}</div>
        <span className="chip chip-soft">{tag}</span>
      </div>
      <div className="solutionText">{text}</div>
      <div className="solutionBullets">
        {bullets.map((b) => (
          <div key={b}>• {b}</div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- ICONS (SVG) --------------------------- */

function SvgDb() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3c4.4 0 8 1.34 8 3s-3.6 3-8 3-8-1.34-8-3 3.6-3 8-3Zm8 6v4c0 1.66-3.6 3-8 3s-8-1.34-8-3V9c1.73 1.33 4.82 2 8 2s6.27-.67 8-2Zm0 7v4c0 1.66-3.6 3-8 3s-8-1.34-8-3v-4c1.73 1.33 4.82 2 8 2s6.27-.67 8-2Z"
        fill="currentColor"
      />
    </svg>
  );
}
function SvgApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 5a2 2 0 0 1 2-2h6v6H4V5Zm10-2h4a2 2 0 0 1 2 2v4h-6V3ZM4 11h8v10H6a2 2 0 0 1-2-2V11Zm10 0h6v8a2 2 0 0 1-2 2h-4V11Z"
        fill="currentColor"
      />
    </svg>
  );
}
function SvgFlow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 7a3 3 0 1 1 2.83-4H20v2H9.83A3 3 0 0 1 7 7Zm10 4a3 3 0 0 1 2.83 2H20v2h-.17A3 3 0 1 1 17 11ZM4 13h8v-2H4v2Zm0 6h10v-2H4v2Z"
        fill="currentColor"
      />
    </svg>
  );
}
function SvgLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.59 13.41a1 1 0 0 1 0-1.41l2.83-2.83a1 1 0 0 1 1.41 1.41L12 13.41a1 1 0 0 1-1.41 0ZM7 17a4 4 0 0 1 0-5.66l2-2 1.41 1.41-2 2A2 2 0 0 0 11.24 15l.59-.59 1.41 1.41-.59.59A4 4 0 0 1 7 17Zm10-10a4 4 0 0 1 0 5.66l-2 2-1.41-1.41 2-2A2 2 0 0 0 12.76 9l-.59.59-1.41-1.41.59-.59A4 4 0 0 1 17 7Z"
        fill="currentColor"
      />
    </svg>
  );
}
function SvgAi() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 3h6v2h2a2 2 0 0 1 2 2v2h2v2h-2v2a2 2 0 0 1-2 2h-2v2H9v-2H7a2 2 0 0 1-2-2v-2H3v-2h2V7a2 2 0 0 1 2-2h2V3Zm8 4H7v10h10V7Zm-7 2h2v2h-2V9Zm4 0h2v2h-2V9Zm-4 4h6v2h-6v-2Z"
        fill="currentColor"
      />
    </svg>
  );
}
function SvgShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Zm0 4.2L6 8.9V12c0 3.7 2.3 6.9 6 7.8 3.7-.9 6-4.1 6-7.8V8.9l-6-2.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PillarCard({ icon, title, kicker, bullets, detail }) {
  return (
    <div className="pillarCard">
      <div className="pillarAccent" />
      <div className="pillarHead">
        <div className="pillarIcon">{icon}</div>
        <div>
          <div className="pillarTitle">{title}</div>
          <div className="pillarKicker">{kicker}</div>
        </div>
      </div>
      <ul className="pillarList">
        {cut(bullets, 2, detail).map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function SvgTarget() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm0-13a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3Z"
        fill="currentColor"
      />
    </svg>
  );
}
function SvgUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4ZM8 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.31 0-6 1.79-6 4v1h12v-1c0-2.21-2.69-4-6-4Zm8 0c-.62 0-1.21.06-1.77.17A5.3 5.3 0 0 1 18 18v1h4v-1c0-2.21-2.69-4-6-4Z"
        fill="currentColor"
      />
    </svg>
  );
}
function SvgPlatform() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 4h8v8H3V4Zm10 0h8v5h-8V4ZM3 14h8v6H3v-6Zm10-3h8v9h-8v-9Z"
        fill="currentColor"
      />
    </svg>
  );
}

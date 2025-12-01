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

/* --------------------------- SLIDE 1: OFERTA (SECUENCIAL) --------------------------- */

/* --------------------------- SLIDE 1: OFERTA (MEGA DETALLE) --------------------------- */

function SlideOferta({ detail, setDetail }) {
  
  // Fases del Proceso (Secuencial)
  const phases = [
    { id: 1, title: "Consultoría & Análisis", sub: "Entender vs. Pedir", icon: "🧠" },
    { id: 2, title: "Arquitectura & Diseño", sub: "Datos + Seguridad", icon: "📐" },
    { id: 3, title: "Desarrollo Iterativo", sub: "Sprints + Calidad", icon: "⚙️" },
    { id: 4, title: "Adopción & Formación", sub: "Gestión del Cambio", icon: "🚀" },
    { id: 5, title: "Evolución Continua", sub: "Mejora constante", icon: "📈" },
  ];

  return (
    <SlideShell
      badge="Manifiesto Operativo"
      title="Propuesta de Valor Real: Personas + Tecnología"
      subtitle="La tecnología es el vehículo, pero el valor lo crea un equipo que sabe analizar, modelar y operacionalizar procesos."
      rightNote="Vista Detallada Activa"
      detail={detail}
      setDetail={setDetail}
    >
      <div className="megaWrapper">
        
        {/* --- 1. DIAGRAMA SECUENCIAL (El Flujo) --- */}
        <div className="sequenceRail">
          {phases.map((p, i) => (
            <div className="seqNode" key={p.id}>
              <div className="seqNodeHeader">
                <span className="seqIcon">{p.icon}</span>
                <span className="seqIndex">0{p.id}</span>
              </div>
              <div className="seqTitle">{p.title}</div>
              <div className="seqSub">{p.sub}</div>
              {i < phases.length - 1 && <div className="seqConnect"></div>}
            </div>
          ))}
        </div>

        {/* --- 2. EL MOTOR (3 COLUMNAS DENSAS) --- */}
        <div className="deepDiveGrid">
          
          {/* COLUMNA 1: ROLES (PERSONAS) */}
          <div className="deepCol">
            <div className="deepHeader col-teal">
              <div className="deepIcon">👥</div>
              <div>
                <div className="deepTitle">El Equipo (Roles)</div>
                <div className="deepSub">Orquestación de perfiles clave</div>
              </div>
            </div>
            <div className="deepContent">
              <RoleDetailBox 
                title="Negocio & Consultoría"
                desc="Convierten un 'quiero un Excel' en un modelo real."
                items={[
                  "Analizan procesos y detectan riesgos.",
                  "Priorizan casos de uso por valor.",
                  "Ordenan y guían al cliente (consultoría)."
                ]}
              />
              <RoleDetailBox 
                title="Arquitectos Técnicos"
                desc="Estructura, seguridad y coherencia."
                items={[
                  "Definen modelo de datos y relaciones.",
                  "Evalúan integración (SAP, Salesforce).",
                  "Aseguran escalabilidad y permisos."
                ]}
              />
              <RoleDetailBox 
                title="Desarrolladores (Makers + Pro)"
                desc="Calidad, código eficiente y lógica."
                items={[
                  "Lógica compleja, Power FX optimizado.",
                  "Integraciones via APIs y Azure Functions.",
                  "Gestión de errores y logs."
                ]}
              />
               <RoleDetailBox 
                title="Expertos en Adopción"
                desc="Para que la solución no muera."
                items={[
                  "Formaciones por rol y mensajes clave.",
                  "Acompañamiento post-go-live.",
                  "Garantía de uso real."
                ]}
              />
            </div>
          </div>

          {/* COLUMNA 2: CAPACIDADES (QUÉ HACEMOS) */}
          <div className="deepCol">
            <div className="deepHeader col-blue">
              <div className="deepIcon">🏭</div>
              <div>
                <div className="deepTitle">Lo que construimos</div>
                <div className="deepSub">Módulos digitales alrededor del ERP</div>
              </div>
            </div>
            <div className="deepContent">
              <div className="capBox">
                <div className="capTitle">1. Ecosistema Integrado</div>
                <div className="capText">
                  No somos una isla. Nos unimos a <strong>SAP, Salesforce, Dynamics, Oracle</strong> mediante conectores estándar o Custom Connectors (APIs).
                </div>
              </div>
              <div className="capBox">
                <div className="capTitle">2. Capa de Datos (Dataverse)</div>
                <div className="capText">
                  Creamos nuevas tablas, relaciones complejas y seguridad nivel registro (RLS) que el ERP no permite o encarece.
                </div>
              </div>
              <div className="capBox">
                <div className="capTitle">3. Lógica de Negocio</div>
                <div className="capText">
                  Apps (Canvas/Model) con validaciones, navegación guiada, notificaciones y experiencia móvil/escritorio fluida.
                </div>
              </div>
              <div className="capBox">
                <div className="capTitle">4. Agentes & Automatización</div>
                <div className="capText">
                  <ul className="miniList">
                    <li>Gestión de aprobaciones complejas.</li>
                    <li>Generación de documentos (PDF, Excel).</li>
                    <li>Movimiento de datos entre sistemas.</li>
                    <li>Orquestación con IA (clasificación, análisis).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 3: PLATAFORMA (TECNOLOGÍA) */}
          <div className="deepCol">
            <div className="deepHeader col-purple">
              <div className="deepIcon">💻</div>
              <div>
                <div className="deepTitle">Plataforma Tecnológica</div>
                <div className="deepSub">Microsoft Cloud Stack</div>
              </div>
            </div>
            <div className="deepContent">
              <TechStackItem 
                area="Power Platform (Core)"
                tools={["Power Apps", "Power Automate", "Dataverse", "Copilot Studio", "Power Pages"]}
              />
              <TechStackItem 
                area="Azure (Pro-Code & IA)"
                tools={["Azure Functions", "API Management", "Azure OpenAI", "Azure SQL", "Logic Apps"]}
              />
              <TechStackItem 
                area="Datos & Analytics"
                tools={["Microsoft Fabric", "Power BI", "Data Lake", "Purview"]}
              />
              <TechStackItem 
                area="Colaboración (M365)"
                tools={["Microsoft Teams", "SharePoint Online", "Outlook", "OneDrive"]}
              />
              <div className="almBox">
                <strong>Fundamento ALM:</strong> Entornos, Pipelines, Variables, Soluciones gestionadas y Seguridad controlada.
              </div>
            </div>
          </div>

        </div>

        {/* --- 3. MODELO DE RELACIÓN (FOOTER) --- */}
        <div className="modelFooter">
          <div className="modelBox bad">
            <div className="modelTitle">❌ Proveedor de "One-Shot"</div>
            <div className="modelText">Proyectos rígidos, tensión por el alcance, presupuesto cerrado que bloquea cambios. Se entrega y se olvida.</div>
          </div>
          <div className="modelArrow">TRANSICIÓN A</div>
          <div className="modelBox good">
            <div className="modelTitle">✅ Partner de Transformación Continua</div>
            <div className="modelText">
              Equipo estable (Funcional + Dev + Adopción). Backlog vivo priorizado por valor. Se paga por <strong>capacidad</strong>, se entrega <strong>impacto</strong> constante.
            </div>
          </div>
        </div>

      </div>
    </SlideShell>
  );
}

// Sub-componente para detalles de rol
function RoleDetailBox({ title, desc, items }) {
  return (
    <div className="roleDetailCard">
      <div className="rdTitle">{title}</div>
      <div className="rdDesc">{desc}</div>
      <ul className="rdList">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
}

// Sub-componente para stack tecnológico
function TechStackItem({ area, tools }) {
  return (
    <div className="techItem">
      <div className="tiArea">{area}</div>
      <div className="tiTools">
        {tools.map(t => <span key={t} className="tiTag">{t}</span>)}
      </div>
    </div>
  );
}

function TechCard({ title, items, icon }) {
  return (
    <div className="infoCard techCardStyle">
      <div className="techCardHead">
        <span className="techIconBox">{icon}</span>
        <span className="infoTitle">{title}</span>
      </div>
      <div className="techTagsList">
        {items.map(i => <span key={i} className="miniTechTag">{i}</span>)}
      </div>
    </div>
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

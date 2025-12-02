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

/* --------------------------- SLIDE 1: OFERTA (TECHNICAL APPROACH) --------------------------- */

function SlideOferta({ detail, setDetail }) {
  const steps = [
    {
      tone: "seq-teal",
      number: "01",
      title: "Discovery",
      desc:
        "Afloramos el proceso real (tácito), riesgos, stoppers y objetivo. Convertimos necesidad difusa en un alcance entendible y accionable.",
      descShort: "Proceso real, riesgos y objetivo. De difuso a accionable.",
      roles: ["Tech Lead"],
      stack: [], // <- vacío a propósito
    },
    {
      tone: "seq-blue",
      number: "02",
      title: "Definición",
      desc:
        "Diseño funcional y técnico: modelo de datos, permisos (RLS), pantallas por rol, integraciones y patrón de solución.",
      descShort: "Arquitectura: datos, permisos, UX por rol e integraciones.",
      roles: ["Tech Lead", "Developer"],
      stack: [
        "Power Platform (Power Apps, Power Pages, Power Automate, Dataverse, AI HUB, Copilot Studio)",
        "Azure (Azure Functions, Azure Automation, Azure AI Foundry)",
        "Microsoft 365 (Teams, SharePoint, Outlook)",
        "Integraciones (sistemas de información fuera de Microsoft)",
      ],
    },
    {
      tone: "seq-purple",
      number: "03",
      title: "Construcción",
      desc:
        "Construcción iterativa por sprints: apps, automatizaciones, integraciones pro-code, agentes IA y validación de calidad.",
      descShort: "Sprints: apps, automatización, integraciones, agentes IA y calidad.",
      roles: ["Developer", "QA"],
      stack: [
        "Power Platform (Power Apps, Power Pages, Power Automate, Dataverse, AI HUB, Copilot Studio)",
        "Azure (Azure Functions, Azure Automation, Azure AI Foundry)",
        "Microsoft 365 (Teams, SharePoint, Outlook)",
        "Integraciones (sistemas de información fuera de Microsoft)",
      ],
    },
    {
      tone: "seq-teal",
      number: "04",
      title: "Adopción",
      desc:
        "Activamos uso real: formación por rol, materiales, acompañamiento y ajuste fino para que la solución se quede.",
      descShort: "Formación por rol + acompañamiento para asegurar uso real.",
      roles: ["Adopción", "Tech Lead"],
      stack: [], // <- vacío a propósito
    },
    {
      tone: "seq-blue",
      number: "05",
      title: "Evolución",
      desc:
        "Transformación continua: telemetría, soporte, mejoras y roadmap vivo priorizado por valor (menos burocracia, más impacto).",
      descShort: "Telemetría + soporte + roadmap vivo priorizado por valor.",
      roles: ["Soporte", "Tech Lead", "Developer"],
      stack: [], // <- vacío a propósito
    },
  ];

  return (
    <SlideShell
      badge="Technical Approach"
      title="Metodología de Transformación Digital"
      subtitle="Método + Roles + Tecnología unidos en una secuencia de ejecución (orientado a valor y escalabilidad)."
      rightNote={detail ? "Modo Detalle: Activado" : "Resumen Ejecutivo"}
      detail={detail}
      setDetail={setDetail}
    >
      <div className="opOffer">

        {/* 1) MISIÓN */}
        <div className="missionBar">
          <span className="missionLabel">NUESTRA MISIÓN:</span>
          <span className="missionText">
            Operacionalizar el conocimiento de negocio mediante tecnología escalable, transformando procesos manuales en activos digitales gobernados.
          </span>
        </div>

        {/* 2) PROPUESTA (VALOR): DIAGRAMA SECUENCIAL */}
        <div className="block">
          <div className="blockTitle">Propuesta</div>
          <div className="blockSub">
            La secuencia que convierte necesidades en entregas reales en producción (sin dependencias de “proyectos one-shot”).
          </div>

          <SeqDiagram steps={steps} detail={detail} />
        </div>

        {/* 3) ROLES */}
        <div className="block">
          <div className="blockTitle">Roles</div>
          <div className="blockSub">
            Los 5 roles clave de h&k que permiten entregar soluciones de extremo a extremo.
          </div>

          <RolesLegend detail={detail} />
        </div>


        {/* 4) TECNOLOGÍA (STACK) */}
        <div className="block">
          <div className="blockTitle">Tecnología (stack)</div>
          <div className="blockSub">
            Power Platform para velocidad · Azure para potencia e IA · M365 para integración operativa · Fabric para datos y observabilidad.
          </div>

          <TechLegend detail={detail} />
        </div>
      </div>
    </SlideShell>
  );
}

/* =========================
   BLOQUES (SlideOferta)
   ========================= */

function SeqDiagram({ steps, detail }) {
  return (
    <div className="seqWrapper">
      <div
        className="seqContainer"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
          gridTemplateRows: "auto auto auto", // 1: fases, 2: roles, 3: stack
          gap: "12px",
        }}
      >
        {/* FILA 1 — CABECERAS DE FASE */}
        {steps.map((s, i) => (
          <div key={s.number} className="seqCol" style={{ gridRow: 1, gridColumn: i + 1 }}>
            <div className={"seqHeader " + s.tone}>
              <div className="seqNumber">{s.number}</div>
              <div className="seqTitle">{s.title}</div>
              <div className="seqDesc">{detail ? s.desc : s.descShort}</div>
            </div>
          </div>
        ))}

        {/* FILA 2 — ROLES (toda la anchura) */}
        <div
          className="seqRolesRowFull"
          style={{
            gridRow: 2,
            gridColumn: `1 / span ${steps.length}`,
            paddingBottom: "8px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div className="seqLabelInside">ROLES</div>

          <div className="seqRolesGrid">
            {steps.map((s) => (
              <div key={s.number} className="seqRoleCell">
                {s.roles.map((r) => (
                  <span key={r} className="seqTag role">
                    {r}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* FILA 3 — STACK (tarjeta única bajo Definición + Construcción) */}
        <div
          className="seqStackRowFull"
          style={{
            gridRow: 3,
            gridColumn: `1 / span ${steps.length}`, // fila completa, como ROLES
          }}
        >
          <div className="seqLabelInside">STACK</div>

          <div className="seqStackGrid">
            {/* Tarjeta alineada con columnas 2 y 3 (Definición + Construcción) */}
            <div className="seqStackCard">
              <div className="seqStackLines">

                {/* 01 — Power Platform */}
                <div className="stackLine">
                  <span className="seqTag tech stackMainTag">Power Platform</span>
                  <span className="seqTag tech stackChildTag">Power Apps</span>
                  <span className="seqTag tech stackChildTag">Power Pages</span>
                  <span className="seqTag tech stackChildTag">Power Automate</span>
                  <span className="seqTag tech stackChildTag">Dataverse</span>
                  <span className="seqTag tech stackChildTag">AI HUB</span>
                  <span className="seqTag tech stackChildTag">Copilot Studio</span>
                </div>

                {/* 02 — Azure */}
                <div className="stackLine">
                  <span className="seqTag tech stackMainTag">Azure</span>
                  <span className="seqTag tech stackChildTag">Azure Functions</span>
                  <span className="seqTag tech stackChildTag">Azure Automation</span>
                  <span className="seqTag tech stackChildTag">Azure AI Foundry</span>
                </div>

                {/* 03 — Microsoft 365 */}
                <div className="stackLine">
                  <span className="seqTag tech stackMainTag">Microsoft 365</span>
                  <span className="seqTag tech stackChildTag">Teams</span>
                  <span className="seqTag tech stackChildTag">SharePoint</span>
                  <span className="seqTag tech stackChildTag">Outlook</span>
                  <span className="seqTag tech stackChildTag">OneDrive</span>
                </div>

                {/* 04 — Integraciones externas */}
                <div className="stackLine">
                  <span className="seqTag tech stackMainTag">Integraciones externas</span>
                  <span className="seqTag tech stackChildTag">SAP</span>
                  <span className="seqTag tech stackChildTag">Salesforce</span>
                  <span className="seqTag tech stackChildTag">Oracle</span>
                  <span className="seqTag tech stackChildTag">APIs REST / otros</span>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


function RolesLegend({ detail }) {
  const roles = [
    {
      name: "Tech Lead",
      tone: "teal",
      badge: "Arquitecto / Consultor / PM",
      headline: "Liderazgo técnico y funcional del proyecto",
      do: [
        "Diseña el modelo de datos, permisos y arquitectura.",
        "Define patrones de desarrollo y mejores prácticas.",
        "Lidera la relación funcional con negocio.",
        "Asegura coherencia técnica en todo el ciclo."
      ],
      know: [
        "Power Platform avanzado (Dataverse, FX, PA, PCF).",
        "Integraciones con Azure (Functions, Automation).",
        "Diseño funcional y técnico de procesos.",
        "Gobierno, ALM, seguridad, entornos y despliegues."
      ]
    },
    {
      name: "Developer",
      tone: "teal",
      badge: "Developer Power Platform · IA · Data",
      headline: "Construcción de aplicaciones, automatizaciones y agentes",
      do: [
        "Desarrollo de Apps, flujos y lógica compleja.",
        "Implementación de agentes IA y copilots.",
        "Integración con APIs, Azure y sistemas externos.",
        "Diseño de vistas, validaciones y experiencia de usuario."
      ],
      know: [
        "Power Apps, Power Automate, PCF, Dataverse.",
        "Azure Functions, Azure Automation, AI Foundry.",
        "Prompt engineering, LangChain y orquestadores IA.",
        "Modelado de datos y optimización de performance."
      ]
    },
    {
      name: "QA / Tester",
      tone: "teal",
      badge: "Testing funcional y técnico",
      headline: "Garantiza calidad, fiabilidad y seguridad",
      do: [
        "Diseño y ejecución de pruebas.",
        "Validación de lógica, seguridad y roles.",
        "Detección de bugs, regresiones e incoherencias.",
        "Asegura criterios de aceptación y UAT."
      ],
      know: [
        "Procesos funcionales del cliente.",
        "Casos de uso, escenarios, datos y roles.",
        "Buenas prácticas de testing en Power Platform.",
        "Pruebas automatizadas cuando aplica."
      ]
    },
    {
      name: "Adopción",
      tone: "teal",
      badge: "Consultor · Formador",
      headline: "Que la solución se use, escale y quede implantada",
      do: [
        "Formación por roles con materiales personalizados.",
        "Plan de adopción y comunicaciones clave.",
        "Acompañamiento durante las primeras semanas.",
        "Recogida de feedback y mejora temprana."
      ],
      know: [
        "Gestión del cambio.",
        "Diseño instruccional.",
        "Comunicación efectiva.",
        "Introducción progresiva de nuevas funcionalidades."
      ]
    },
    {
      name: "Soporte",
      tone: "teal",
      badge: "Developer Power Platform · IA · Data",
      headline: "Mantenimiento evolutivo y resolución rápida",
      do: [
        "Corrección de incidencias en producción.",
        "Mejoras continuas basadas en uso real.",
        "Evolutivos funcionales y técnicos.",
        "Monitorización y prevención de errores."
      ],
      know: [
        "Power Platform a nivel avanzado.",
        "Monitorización y logging.",
        "Integraciones con M365 y Azure.",
        "Despliegues y ALM en cliente."
      ]
    }
  ];


  return (
    <div className="rolesLegendRow">
      {roles.map((r) => (
        <RoleLegendCard key={r.name} {...r} detail={detail} />
      ))}
    </div>
  );
}

function RoleLegendCard({ tone, name, badge, headline, do: doList = [], know: knowList = [], detail }) {
  // Convertimos badge en tags individuales automáticamente
  const tags = badge ? badge.split(/[·/]/).map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className={"roleLegendCard tone-" + tone}>
      <div className="roleLegendName">{name}</div>

      {/* TAGS INDIVIDUALES BAJO EL NOMBRE */}
      <div className="roleLegendTags">
        {tags.map((t) => (
          <span key={t} className="roleLegendTag">{t}</span>
        ))}
      </div>

      {/* HEADLINE */}
      <div className="roleLegendDef">{headline}</div>

      {/* DETALLE: DO + KNOW */}
      {detail && (
        <ul className="roleLegendList">
          {doList.map((item) => (
            <li key={item}>{item}</li>
          ))}
          {knowList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}


function TechLegend({ detail }) {
  const cards = [
    {
      tone: "teal",
      title: "Power Platform",
      subtitle: "Velocidad para procesos y UX",
      desc: "Apps, automatización y datos con gobierno y ALM.",
      tags: ["Power Apps", "Power Pages", "Power Automate", "Dataverse", "AI Hub", "Copilot Studio"],
    },
    {
      tone: "blue",
      title: "Azure",
      subtitle: "Pro-code, integración e IA",
      desc: "Extensiones, orquestación y capacidades avanzadas.",
      tags: ["Azure Functions", "Azure Automation", "Azure AI Foundry", "Azure OpenAI", "API Management"],
    },
    {
      tone: "purple",
      title: "Microsoft 365",
      subtitle: "Integración operativa",
      desc: "Canales, documentos y colaboración dentro de la solución.",
      tags: ["Teams", "SharePoint", "Outlook", "OneDrive", "Loop"],
    },
    {
      tone: "teal",
      title: "Integraciones externas",
      subtitle: "Sistemas fuera de Microsoft",
      desc: "Conectamos ERP/CRM/legacy vía conectores y APIs.",
      tags: ["SAP", "Salesforce", "Oracle", "APIs REST", "SFTP/Files"],
    },
    {
      tone: "blue",
      title: "Fabric",
      subtitle: "Datos, analítica y observabilidad",
      desc: "KPIs, lakehouse, pipelines y monitorización.",
      tags: ["Lakehouse", "Pipelines", "Modelado", "KPIs", "Real-Time"],
    },
  ];

  return (
    <div className="techLegendGrid">
      {cards.map((c) => (
        <TechLegendCard key={c.title} {...c} detail={detail} />
      ))}
    </div>
  );
}


function TechLegendCard({ tone, title, subtitle, desc, tags = [], detail }) {
  const shown = detail ? tags : tags.slice(0, 4);
  return (
    <div className={"techLegendCard tone-" + tone}>
      <div className="techLegendTitle">{title}</div>
      <div className="techLegendSub">{subtitle}</div>
      {desc ? <div className="techLegendDesc">{desc}</div> : null}
      <div className="techLegendTags">
        {shown.map((t) => (
          <span key={t} className="techLegendTag">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}


function PillarBox({ title, subtitle, text }) {
  return (
    <div className="pillarDef">
      <div className="pillarHead">
        <span className="pillarTitle">{title}</span>
        <span className="pillarSub">{subtitle}</span>
      </div>
      <div className="pillarBody">{text}</div>
    </div>
  );
}

function RolesSection({ detail }) {
  return (
    <Section
      eyebrow="LOS ROLES"
      title="Personas que hacen posible la transformación"
    >
      <div className="rolesGrid">

        {/* --- TECH LEAD --- */}
        <RoleCard
          role="Tech Lead"
          competencyTitle="Arquitectura · Negocio · Orquestación"
          competencies={[
            "Conecta negocio y tecnología",
            "Define modelo de datos y permisos",
            "Diseña la arquitectura funcional y técnica",
            "Controla alcance, prioridades y backlog",
            "Gobierna el ritmo del proyecto (rituales, demos, decisiones)",
            "Asegura coherencia entre módulos y reutilización"
          ]}
          taskTitle="Tareas clave dentro del proceso"
          tasks={[
            "Discovery con stakeholders",
            "Optimización del proceso",
            "Diseño funcional (UX, roles, validaciones)",
            "Modelo de datos + RLS",
            "Priorización con CIO",
            "Supervisión de calidad y evolución"
          ]}
          detail={detail}
        />

        {/* --- DEVELOPER (Power Platform + Azure) + IA DEVELOPER --- */}
        <RoleCard
          role="Developer + IA Developer"
          competencyTitle="Construcción · Integraciones · IA aplicada"
          competencies={[
            "Construcción de apps (Power Apps) y flujos complejos (Power Automate)",
            "Integración con sistemas (APIs, Azure Functions, APIM)",
            "Modelo técnico: lógica, validaciones, seguridad y rendimiento",
            "ALM: pipelines, entornos, variables, despliegues gobernados",
            "Agentes inteligentes con Azure OpenAI y Power Automate",
            "RAG: embeddings, vector DB, chunking e indexación",
            "Copilots especializados (Copilot Studio + Azure Foundry)",
            "Orquestación con LangChain / AI Hub",
          ]}
          taskTitle="Tareas clave dentro del proceso"
          tasks={[
            "Construcción iterativa por sprints",
            "Implementación de integraciones (REST, SAP, Salesforce, etc.)",
            "Creación de agentes autónomos (aprobaciones, validaciones, lógica)",
            "Optimización de rendimiento y logs técnicos",
            "Procesamiento de documentos/emails con IA",
            "Soporte a QA y corrección técnica",
            "Evolución del modelo técnico y del proceso"
          ]}
          detail={detail}
        />

        {/* --- QA / TESTER --- */}
        <RoleCard
          role="QA · Tester"
          competencyTitle="Calidad funcional y técnica"
          competencies={[
            "Diseño de casos de prueba",
            "Pruebas por rol y regresión",
            "Validación funcional y técnica",
            "Detección de escenarios límite y errores",
            "Garantía de robustez y experiencia consistente"
          ]}
          taskTitle="Tareas clave dentro del proceso"
          tasks={[
            "Pruebas funcionales por módulo",
            "Pruebas de regresión en cada sprint",
            "Validación antes de despliegue (UAT)",
            "Detección de incoherencias",
            "Soporte en la estabilización post-producción"
          ]}
          detail={detail}
        />

        {/* --- ADOPCIÓN --- */}
        <RoleCard
          role="Adopción & Formación"
          competencyTitle="Cambio organizacional y uso real"
          competencies={[
            "Diseño de materiales de adopción por rol",
            "Sesiones formativas efectivas",
            "Comunicación del cambio",
            "Acompañamiento a usuarios clave",
            "Detección de fricciones de uso"
          ]}
          taskTitle="Tareas clave dentro del proceso"
          tasks={[
            "Formación por rol",
            "Acompañamiento inicial (primeras semanas)",
            "Materiales (vídeos, guías, FAQs)",
            "Gestionar feedback real y mejoras",
            "Conectar casos de uso con negocio"
          ]}
          detail={detail}
        />

        {/* --- SOPORTE / EVOLUCIÓN --- */}
        <RoleCard
          role="Soporte & Evolución"
          competencyTitle="Continuidad · Telemetría · Roadmap"
          competencies={[
            "Monitorización del uso",
            "Resolución de bugs y fricciones",
            "Mejoras incrementales",
            "Lectura de telemetría y KPIs",
            "Detección de nuevas oportunidades para el backlog"
          ]}
          taskTitle="Tareas clave dentro del proceso"
          tasks={[
            "Telemetría en producción",
            "Corrección rápida de incidencias",
            "Mejoras evolutivas",
            "Propuestas basadas en datos",
            "Alineamiento con Tech Lead para roadmap continuo"
          ]}
          detail={detail}
        />

      </div>
    </Section>
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

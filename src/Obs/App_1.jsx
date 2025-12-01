import React, { useEffect, useMemo, useState } from "react";
import "./index.css";

export default function App() {
  const slides = useMemo(
    () => [
      { id: "oferta", label: "Oferta", node: <SlideOferta /> },
      { id: "caso", label: "Caso", node: <SlideCasoTransformacion /> },
    ],
    []
  );

  const [current, setCurrent] = useState(0);

  const go = (idx) => setCurrent(Math.max(0, Math.min(slides.length - 1, idx)));
  const next = () => setCurrent((v) => (v + 1) % slides.length);
  const prev = () => setCurrent((v) => (v - 1 + slides.length) % slides.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="appRoot">
      <main className="stage">
        <div className="deck">
          <div className="card">{slides[current].node}</div>

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

/* --------------------------- GENERIC UI --------------------------- */

function SlideShell({ badge, title, subtitle, children, rightNote }) {
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

function RoleCard({ role, competencyTitle, competencies, taskTitle, tasks }) {
  return (
    <div className="roleCard">
      <div className="roleTop">
        <div className="roleTopRow">
          <div className="roleName">{role}</div>
          <span className="roleTag">Competencias</span>
        </div>
        <div className="roleTopTitle">{competencyTitle}</div>
        <ul className="roleList roleListTop">
          {competencies.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
      <div className="roleBottom">
        <div className="roleBottomRow">
          <span className="roleTagAlt">Tareas dentro del proceso</span>
        </div>
        <div className="roleBottomTitle">{taskTitle}</div>
        <ul className="roleList">
          {tasks.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CapabilityGroup({ title, items, icon }) {
  return (
    <div className="capGroup">
      <div className="capHead">
        <span className="capIcon" aria-hidden="true">
          {icon}
        </span>
        <div className="capTitle">{title}</div>
      </div>
      <div className="capItems">
        {items.map((x) => (
          <div className="capItem" key={x}>
            <span className="capDot" aria-hidden="true" />
            <span>{x}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessLane({ steps }) {
  return (
    <div className="processLane">
      {steps.map((s, idx) => (
        <div className="processStep" key={s.title}>
          <div className="processIndex">{idx + 1}</div>
          <div className="processContent">
            <div className="processTitle">{s.title}</div>
            <div className="processText">{s.text}</div>
            {s.tags?.length ? <PillList items={s.tags} /> : null}
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

function SlideOferta() {
  const steps = [
    {
      title: "Propósito y alcance",
      text:
        "Convertimos necesidades de negocio en soluciones digitales vivas, escalables y gobernadas. " +
        "No vendemos “apps sueltas”: construimos un portfolio que evoluciona con el negocio.",
      tags: ["Propósito", "Impacto", "Transversalidad"],
    },
    {
      title: "Personas clave y entendimiento del proceso",
      text:
        "Nos apoyamos en stakeholders que conocen el proceso real (tácito) y lo llevamos a definición clara. " +
        "Aportamos empatía, estructuración y visión end-to-end.",
      tags: ["Empatía", "Descubrimiento", "Requisitos"],
    },
    {
      title: "Backlog y priorización compartida",
      text:
        "Gestionamos y mantenemos un backlog vivo: priorización por valor/urgencia con CIO y responsables. " +
        "Transparencia de avance, stoppers y decisiones (lo enseñamos como el decisor lo necesita).",
      tags: ["Backlog", "Priorización CIO", "Seguimiento"],
 said: null,
    },
    {
      title: "Diseño + construcción con plataforma Microsoft",
      text:
        "Traemos la tecnología a la definición: datos, roles, pantallas, agentes, integraciones e IA; " +
        "estimamos costes y elegimos el patrón correcto (core, módulo conectado o satélite).",
      tags: ["Plataforma", "Arquitectura", "Viabilidad"],
    },
    {
      title: "Entrega, adopción y evolución continua",
      text:
        "Desarrollamos iterativamente, desplegamos con ALM y gobernanza, acompañamos la adopción y mejoramos en ciclos. " +
        "Lo importante es mantener el ritmo de valor y la mejora constante.",
      tags: ["Agile", "ALM", "Adopción"],
    },
  ];

  return (
    <SlideShell
      badge="Lo que ofrecemos"
      title="Propósito · Personas · Plataforma (unidos en un único modelo operativo)"
      subtitle="Unidad de Transformación Digital: identificamos, definimos, priorizamos, construimos y evolucionamos soluciones digitales en ciclo continuo."
      rightNote="2 slides · mensaje ejecutivo + caso real"
    >
      <div className="grid2">
        <div className="col">
          <Section
            eyebrow="PROPÓSITO"
            title="De retos de negocio a un portfolio de soluciones en producción (y en evolución)"
            right={
              <div className="metricsRow">
                <Metric label="Enfoque" value="Impacto" hint="valor > entregables" tone="blue" />
                <Metric label="Modelo" value="Continuo" hint="no one-shot" tone="teal" />
                <Metric label="Cadencia" value="Iterativa" hint="agile + transparencia" tone="teal" />
              </div>
            }
          >
            <div className="callout">
              <div className="calloutTitle">
                “La tecnología es el vehículo. El valor lo crean las personas que saben diseñar y operacionalizar procesos.”
              </div>
              <div className="calloutText">
                Trabajamos con un modelo estructurado: <strong>descubrimiento</strong> →{" "}
                <strong>definición</strong> → <strong>priorización</strong> →{" "}
                <strong>construcción</strong> → <strong>adopción</strong> →{" "}
                <strong>evolución</strong>.
              </div>
              <div className="calloutChips">
                <Chip tone="strong">Backlog vivo</Chip>
                <Chip tone="strong">Seguimiento compartido</Chip>
                <Chip tone="strong">Decisiones con CIO</Chip>
              </div>
            </div>

            <ProcessLane steps={steps} />
          </Section>

          <Section
            eyebrow="PLATAFORMA (CAPACIDADES)"
            title="Lo que habilita Microsoft (y cómo lo usamos)"
          >
            <div className="capsGrid">
              <CapabilityGroup
                title="Datos & Seguridad"
                items={[
                  "Dataverse como núcleo de datos (modelo robusto)",
                  "Roles/permisos por tabla y fila",
                  "Auditoría, trazabilidad y control de acceso real",
                ]}
                icon={<SvgDb />}
              />
              <CapabilityGroup
                title="Apps & Experiencia"
                items={[
                  "Apps web/móvil/tablet con UX guiada",
                  "Validaciones, vistas por rol, navegación fluida",
                  "Interfaz adaptable sin miedo a romper (SaaS)",
                ]}
                icon={<SvgApp />}
              />
              <CapabilityGroup
                title="Agentes & Automatización"
                items={[
                  "Power Automate para flujos end-to-end",
                  "Aprobaciones, generación de docs (PDF/Excel/Word)",
                  "Orquestación con Azure Functions/Automation cuando conviene",
                ]}
                icon={<SvgFlow />}
              />
              <CapabilityGroup
                title="Integración & APIs"
                items={[
                  "Conectores estándar + personalizados",
                  "Consumo y exposición de APIs (bidireccional)",
                  "Conexión con ERP/CRM/HR/SharePoint/Teams/Outlook",
                ]}
                icon={<SvgLink />}
              />
              <CapabilityGroup
                title="IA aplicada a proceso"
                items={[
                  "Clasificación y extracción documental",
                  "Asistentes/Copilots y RAG corporativo",
                  "Decisiones contextuales en flujos (proactivo)",
                ]}
                icon={<SvgAi />}
              />
              <CapabilityGroup
                title="ALM & Gobierno"
                items={[
                  "Entornos, pipelines, variables, despliegues controlados",
                  "DLP, cumplimiento y control de conectores",
                  "Monitorización + evolución continua del portfolio",
                ]}
                icon={<SvgShield />}
              />
            </div>
          </Section>
        </div>

        <div className="col">
          <Section eyebrow="PERSONAS (ROLES)" title="Roles y valor aportado en cada fase">
            <div className="rolesGrid">
              <RoleCard
                role="Negocio · Discovery & Prioridad"
                competencyTitle="Entender, estructurar y priorizar"
                competencies={[
                  "Empatía con usuarios y visión transversal",
                  "Capacidad de traducir necesidad → requisito",
                  "Detección de riesgos e ineficiencias",
                  "Comunicación adaptada al decisor (detalle vs delegación)",
                ]}
                taskTitle="Qué hace dentro del proceso"
                tasks={[
                  "Entrevistas con stakeholders clave",
                  "Mapeo y optimización del proceso",
                  "Backlog de necesidades y criterios de valor",
                  "Priorización con CIO / responsables",
                ]}
              />
              <RoleCard
                role="Arquitectura · Diseño & Viabilidad"
                competencyTitle="Diseñar soluciones que escalan"
                competencies={[
                  "Arquitectura de datos sin redundancias",
                  "Diseño funcional y técnico consistente",
                  "Integración con sistemas existentes y nuevos",
                  "Evaluación de coste, riesgo y viabilidad",
                ]}
                taskTitle="Qué hace dentro del proceso"
                tasks={[
                  "Decide patrón: core / módulo / satélite",
                  "Modelo de datos + roles/permisos",
                  "Diseño de pantallas, reglas y agentes",
                  "Estimación (incl. costes recurrentes/licencias)",
                ]}
              />
              <RoleCard
                role="Desarrollo · Construcción"
                competencyTitle="Construir bien, rápido y mantenible"
                competencies={[
                  "Buenas prácticas PP + técnica (eficiencia/código)",
                  "Gestión de stoppers e incidencias",
                  "Modularidad e integración API",
                  "IA aplicada y automatización avanzada",
                ]}
                taskTitle="Qué hace dentro del proceso"
                tasks={[
                  "Desarrolla apps (UX, lógica, validaciones)",
                  "Flujos/agentes (aprobaciones, cálculos, docs)",
                  "Integraciones (ERP/CRM/HR/APIs/SharePoint)",
                  "Pruebas, hardening y despliegues",
                ]}
              />
              <RoleCard
                role="Adopción & Gobierno · Continuidad"
                competencyTitle="Garantizar uso real y control"
                competencies={[
                  "Formación por rol + gestión del cambio",
                  "Gobernanza (DLP/entornos/seguridad)",
                  "Observabilidad del uso y mejora continua",
                  "Estandarización y sostenibilidad",
                ]}
                taskTitle="Qué hace dentro del proceso"
                tasks={[
                  "Plan de adopción + mensajes clave",
                  "Acompañamiento inicial + soporte dudas",
                  "Gobierno ALM/DLP y control de conectores",
                  "Seguimiento de KPIs de uso y evolución",
                ]}
              />
            </div>

            <div className="miniNote">
              <strong>Clave:</strong> el valor no está en “usar Power Apps”, sino en unir{" "}
              <strong>propósito</strong>, <strong>roles</strong> y{" "}
              <strong>plataforma</strong> con método y cadencia.
            </div>
          </Section>
        </div>
      </div>
    </SlideShell>
  );
}

/* --------------------------- SLIDE 2 --------------------------- */

function SlideCasoTransformacion() {
  const process = [
    {
      title: "Discovery",
      text:
        "Necesidades captadas con stakeholders, empatía y entendimiento del proceso real. " +
        "Se documenta el “cómo se hace” para que deje de vivir solo en personas clave.",
      tags: ["Negocio", "Stakeholders", "Proceso"],
    },
    {
      title: "Definición + Optimización",
      text:
        "Requerimientos claros, optimización del flujo si aplica, definición funcional y técnica; " +
        "decisión del patrón (core / módulo / satélite) y estimación de costes.",
      tags: ["Arquitectura", "Viabilidad", "Coste"],
    },
    {
      title: "Priorización y Backlog",
      text:
        "Backlog vivo priorizado con CIO: valor, urgencia, dependencias y capacidad. " +
        "Transparencia de avance, stoppers y decisiones (reporting adaptado al decisor).",
      tags: ["CIO", "Backlog", "Transparencia"],
    },
    {
      title: "Construcción iterativa",
      text:
        "Sprints, demos recurrentes, control de calidad, y despliegues gobernados (ALM). " +
        "Se evoluciona lo ya desplegado mientras se entrega nuevo valor.",
      tags: ["Agile", "ALM", "Entrega"],
    },
    {
      title: "Adopción y Evolución",
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
      subtitle="Un modelo operativo que escala: detecta necesidades, prioriza con CIO, entrega soluciones en producción y evoluciona el portfolio sin fricción."
      rightNote="Las 2 fases y los 3 tipos de solución"
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
                En 6 meses: de 22 necesidades a 5 soluciones en producción. En los siguientes 6 meses: más capacidad, 10 soluciones y 25 nuevos casos.
              </div>
              <div className="calloutText">
                El programa se sostiene en tres pilares:{" "}
                <strong>personas clave</strong> (descubrimiento/validación),{" "}
                <strong>priorización compartida</strong> (CIO + negocio) y{" "}
                <strong>plataforma gobernada</strong> (ALM, seguridad, integraciones).
              </div>
              <div className="calloutChips">
                <Chip tone="strong">Ritual CIO (visión general)</Chip>
                <Chip tone="strong">Ritual PO (por solución)</Chip>
                <Chip tone="strong">Backlog dinámico</Chip>
              </div>
            </div>

            <Section
              eyebrow="PERSONAS (EN EL PROGRAMA)"
              title="Cómo se organiza la colaboración y el seguimiento"
            >
              <div className="twoCards">
                <div className="tightCard">
                  <div className="tightCardTitle">Gobierno del backlog</div>
                  <div className="tightCardText">
                    Backlog único, visible y priorizado por valor. Cambios de prioridad
                    sin fricción (capacidad por horas), con trazabilidad de decisiones.
                  </div>
                  <PillList items={["Criterios de valor", "Dependencias", "Riesgo", "Capacidad"]} />
                </div>
                <div className="tightCard">
                  <div className="tightCardTitle">Seguimiento transparente</div>
                  <div className="tightCardText">
                    Estado de cada solución (avance, bloqueos, próximos hitos). Reporte
                    adaptado al decisor: desde “¿está validado?” a detalle técnico cuando se necesita.
                  </div>
                  <PillList items={["Demos", "Stoppers", "Hitos", "Decisiones"]} />
                </div>
              </div>
            </Section>

            <Section eyebrow="CICLO OPERATIVO" title="De discovery a evolución (misma estructura que la oferta)">
              <ProcessLane steps={process} />
            </Section>
          </Section>
        </div>

        <div className="col">
          <Section eyebrow="PLATAFORMA (PATRONES)" title="3 tipos de soluciones dentro del programa">
            <div className="solutionGrid">
              <div className="solutionCard">
                <div className="solutionTop">
                  <div className="solutionTitle">1) Aisladas</div>
                  <Chip tone="soft">rápidas y específicas</Chip>
                </div>
                <div className="solutionText">
                  Módulos independientes que no dependen ni alimentan otros sistemas. Resuelven un
                  problema acotado con velocidad y mínima complejidad.
                </div>
                <div className="solutionBullets">
                  <div>• App o agente puntual</div>
                  <div>• Bajo acoplamiento</div>
                  <div>• Time-to-value máximo</div>
                </div>
              </div>

              <div className="solutionCard">
                <div className="solutionTop">
                  <div className="solutionTitle">2) Módulos conectados</div>
                  <Chip tone="soft">input ERP → output ERP</Chip>
                </div>
                <div className="solutionText">
                  Soluciones que toman datos del sistema base (ERP/CRM), orquestan acciones/validaciones
                  y devuelven datos enriquecidos al core de la compañía.
                </div>
                <div className="solutionBullets">
                  <div>• Integración bidireccional</div>
                  <div>• Validaciones y aprobaciones</div>
                  <div>• Trazabilidad end-to-end</div>
                </div>
              </div>

              <div className="solutionCard">
                <div className="solutionTop">
                  <div className="solutionTitle">3) Núcleos nuevos</div>
                  <Chip tone="soft">la plataforma como base</Chip>
                </div>
                <div className="solutionText">
                  Cuando no existe sistema, creamos un modelo completo (datos maestros + operación),
                  con apps de administración y procesos que alimentan módulos del ERP o una nueva línea de negocio.
                </div>
                <div className="solutionBullets">
                  <div>• Dataverse como core</div>
                  <div>• Roles/permisos + ALM</div>
                  <div>• Escalable a múltiples módulos</div>
                </div>
              </div>
            </div>
          </Section>

          <Section eyebrow="CAPACIDADES CLAVE" title="Qué se activa en este caso (y por qué funciona)">
            <div className="capsGridCompact">
              <div className="capPill">
                <span className="capPillDot" />
                Modelo de datos + Seguridad (roles/perfila)
              </div>
              <div className="capPill">
                <span className="capPillDot" />
                Apps multicanal con UX guiada (web/móvil)
              </div>
              <div className="capPill">
                <span className="capPillDot" />
                Agentes (aprobaciones, docs, cálculos, vigilancia de coherencias)
              </div>
              <div className="capPill">
                <span className="capPillDot" />
                Integración (ERP/CRM/APIs/conectores)
              </div>
              <div className="capPill">
                <span className="capPillDot" />
                IA aplicada: clasificación, extracción, copilots
              </div>
              <div className="capPill">
                <span className="capPillDot" />
                ALM + Gobierno: entornos, pipelines, DLP, despliegues
              </div>
              <div className="capPill">
                <span className="capPillDot" />
                Estimación de coste recurrente (licencias/consumos)
              </div>
              <div className="capPill">
                <span className="capPillDot" />
                Transparencia de estado (avance/stoppers/decisiones)
              </div>
            </div>

            <div className="miniNote">
              <strong>Resultado clave:</strong> al mantener un{" "}
              <strong>backlog vivo</strong> y un{" "}
              <strong>modelo de datos/arquitectura reusable</strong>, cada solución
              nueva cuesta menos, se entrega antes y se integra mejor.
            </div>
          </Section>
        </div>
      </div>
    </SlideShell>
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

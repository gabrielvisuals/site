import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";

type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  x: string;
  y: string;
  size: string;
  rotate: number;
  color: "blue" | "sand";
  italic?: boolean;
  hasLogo?: boolean;
};

type Logo = {
  id: string;
  name: string;
  type: string;
  year: string;
  description: string;
  symbol: string;
};

const BLUE = "#2D4096";

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "BIGGROUP",
    category: "Brand Identity",
    year: "2026",
    description:
      "A visual refresh exploring recognition, precision and the relationship between a brand and the communication around it.",
    x: "5%",
    y: "6%",
    size: "5.2vw",
    rotate: -2,
    color: "blue",
    hasLogo: true,
  },
  {
    id: "02",
    title: "NORDVIK",
    category: "Identity / Digital",
    year: "2025",
    description:
      "A restrained visual identity built around structure, typography and a contemporary visual language.",
    x: "31%",
    y: "20%",
    size: "3vw",
    rotate: 1,
    color: "sand",
    italic: true,
  },
  {
    id: "03",
    title: "ATLAS",
    category: "Art Direction",
    year: "2025",
    description:
      "An experimental graphic system built around scale, contrast and movement.",
    x: "55%",
    y: "9%",
    size: "4.8vw",
    rotate: -1,
    color: "sand",
  },
  {
    id: "04",
    title: "MERIDIAN",
    category: "Typography",
    year: "2024",
    description:
      "A typographic exploration questioning how much structure is actually necessary.",
    x: "9%",
    y: "45%",
    size: "1.9vw",
    rotate: 0,
    color: "sand",
  },
  {
    id: "05",
    title: "SONDER",
    category: "Motion / Digital",
    year: "2024",
    description:
      "A visual identity experiment where static forms become an active visual language.",
    x: "40%",
    y: "57%",
    size: "3.6vw",
    rotate: 2,
    color: "sand",
  },
  {
    id: "06",
    title: "BUREAU",
    category: "Graphic Design",
    year: "2023",
    description:
      "A graphic system built from simple elements, controlled spacing and deliberate imperfections.",
    x: "63%",
    y: "50%",
    size: "5.4vw",
    rotate: -1,
    color: "sand",
  },
];

const LOGOS: Logo[] = [
  {
    id: "A01",
    name: "ARC",
    type: "Symbol",
    year: "2026",
    description:
      "An abstract mark built around tension between open and closed geometry.",
    symbol: "⌒",
  },
  {
    id: "A02",
    name: "NOVA",
    type: "Wordmark",
    year: "2026",
    description:
      "A compact identity designed for digital-first applications.",
    symbol: "N",
  },
  {
    id: "A03",
    name: "FORM",
    type: "Symbol",
    year: "2025",
    description:
      "A modular geometric mark with multiple possible configurations.",
    symbol: "◫",
  },
  {
    id: "A04",
    name: "MONO",
    type: "Wordmark",
    year: "2025",
    description:
      "A minimal typographic identity based on rhythm and proportion.",
    symbol: "M",
  },
  {
    id: "A05",
    name: "ORBIT",
    type: "Symbol",
    year: "2024",
    description:
      "A circular mark exploring movement, continuity and repetition.",
    symbol: "○",
  },
  {
    id: "A06",
    name: "VOID",
    type: "Abstract",
    year: "2024",
    description:
      "A reductionist identity built around negative space.",
    symbol: "V",
  },
];

const SECTIONS = [
  { id: "home", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "logos", label: "Logos" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [cursorMode, setCursorMode] = useState("default");
  const [activeSection, setActiveSection] = useState("home");
  const [activeLogo, setActiveLogo] = useState<Logo | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredProject, setHoveredProject] =
    useState<Project | null>(null);

  const raf = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoaded(true);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const move = (event: globalThis.MouseEvent) => {
      if (raf.current) cancelAnimationFrame(raf.current);

      raf.current = requestAnimationFrame(() => {
        setMouse({
          x: event.clientX,
          y: event.clientY,
        });
      });
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;

      setScrollProgress(height > 0 ? scrollTop / height : 0);

      const sections = SECTIONS.map((section) =>
        document.getElementById(section.id),
      );

      let current = "home";

      sections.forEach((section) => {
        if (!section) return;

        const rect = section.getBoundingClientRect();

        if (rect.top <= window.innerHeight * 0.35) {
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div
      className={`experience ${loaded ? "loaded" : ""}`}
      style={
        {
          "--mouse-x": `${mouse.x}px`,
          "--mouse-y": `${mouse.y}px`,
        } as React.CSSProperties
      }
    >
      {!loaded && <IntroLoader />}

      <InteractiveCursor mode={cursorMode} />

      <SideProgress
        active={activeSection}
        progress={scrollProgress}
        onNavigate={goTo}
      />

      <Navigation
        active={activeSection}
        onNavigate={goTo}
        onHover={setCursorMode}
      />

      <main>
        <Hero
          mouse={mouse}
          onNavigate={goTo}
          onHover={setCursorMode}
        />

        <WorkSection
          hoveredProject={hoveredProject}
          setHoveredProject={setHoveredProject}
          onHover={setCursorMode}
        />

        <LogoSection
          activeLogo={activeLogo}
          setActiveLogo={setActiveLogo}
          onHover={setCursorMode}
        />

        <AboutSection onHover={setCursorMode} />

        <ContactSection
          onNavigate={goTo}
          onHover={setCursorMode}
        />
      </main>

      {activeLogo && (
        <LogoOverlay
          logo={activeLogo}
          onClose={() => setActiveLogo(null)}
          onHover={setCursorMode}
        />
      )}

      <footer>
        <span>© 2026 Gabriel</span>
        <span>Graphic Design / Art Direction / Digital</span>
        <span>Poland ↗</span>
      </footer>
    </div>
  );
}

/* --------------------------------------------------
LOADER
-------------------------------------------------- */

function IntroLoader() {
  return (
    <div className="intro-loader">
      <div className="loader-symbol">
        <BrandMark />
      </div>

      <div className="loader-bottom">
        <span>GABRIEL</span>
        <span>DESIGN / 2026</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------
BRAND MARK
-------------------------------------------------- */

function BrandMark() {
  return (
    <div className="brand-mark">
      <div className="brand-circle" />
      <div className="brand-square" />
    </div>
  );
}

/* --------------------------------------------------
CURSOR
-------------------------------------------------- */

function InteractiveCursor({
  mode,
}: {
  mode: string;
}) {
  return (
    <>
      <div className="cursor-cross">
        <span />
        <span />
      </div>

      <div className={`cursor-system cursor-${mode}`}>
        {mode === "view" && <span>VIEW</span>}
        {mode === "select" && <span>SELECT</span>}
        {mode === "open" && <span>OPEN ↗</span>}
        {mode === "drag" && <span>DRAG</span>}
        {mode === "default" && <span>+</span>}
      </div>
    </>
  );
}

/* --------------------------------------------------
NAVIGATION
-------------------------------------------------- */

function Navigation({
  active,
  onNavigate,
  onHover,
}: {
  active: string;
  onNavigate: (id: string) => void;
  onHover: (mode: string) => void;
}) {
  return (
    <header className="navigation">
      <button
        className="nav-brand"
        onClick={() => onNavigate("home")}
        onMouseEnter={() => onHover("open")}
        onMouseLeave={() => onHover("default")}
      >
        <BrandMark />
        <span>Gabriel</span>
      </button>

      <button
        className="nav-contact"
        onClick={() => onNavigate("contact")}
        onMouseEnter={() => onHover("open")}
        onMouseLeave={() => onHover("default")}
      >
        Contact ↗
      </button>
    </header>
  );
}

/* --------------------------------------------------
SIDE PROGRESS
-------------------------------------------------- */

function SideProgress({
  active,
  progress,
  onNavigate,
}: {
  active: string;
  progress: number;
  onNavigate: (id: string) => void;
}) {
  return (
    <aside className="side-progress">
      <div className="progress-line">
        <div
          className="progress-fill"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      <div className="progress-sections">
        {SECTIONS.map((section, index) => (
          <button
            key={section.id}
            className={active === section.id ? "active" : ""}
            onClick={() => onNavigate(section.id)}
          >
            <span>{String(index).padStart(2, "0")}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

/* --------------------------------------------------
HERO
-------------------------------------------------- */

function Hero({
  mouse,
  onNavigate,
  onHover,
}: {
  mouse: { x: number; y: number };
  onNavigate: (id: string) => void;
  onHover: (mode: string) => void;
}) {
  const centerX =
    typeof window !== "undefined"
      ? mouse.x / window.innerWidth - 0.5
      : 0;

  const centerY =
    typeof window !== "undefined"
      ? mouse.y / window.innerHeight - 0.5
      : 0;

  return (
    <section id="home" className="hero-experience">
      <div className="hero-noise" />

      <div className="hero-meta">
        <span>Independent designer</span>
        <span>01 — Introduction</span>
        <span>Poznań / PL</span>
      </div>

      <div className="hero-stage">
        <div
          className="hero-logo"
          style={{
            transform: `translate3d(${centerX * 24}px, ${
              centerY * 24
            }px, 0) rotate(${centerX * 3}deg)`,
          }}
          onMouseEnter={() => onHover("drag")}
          onMouseLeave={() => onHover("default")}
        >
          <BrandMark />
        </div>

        <div className="hero-word hero-word-one">artistic.</div>

        <div className="hero-word hero-word-two">aesthetic.</div>

        <div className="hero-word hero-word-three">
          minimalistic.
        </div>

        <div className="hero-coordinate">
          <span>52°24′ N</span>
          <span>16°55′ E</span>
        </div>

        <div className="hero-blue-orb" />
      </div>

      <div className="hero-bottom">
        <div className="hero-description">
          <span>GABRIEL / GRAPHIC DESIGN</span>
          <p>
            I create visual identities, digital experiences and
            graphic systems somewhere between structure and
            experimentation.
          </p>
        </div>

        <button
          className="hero-enter"
          onClick={() => onNavigate("work")}
          onMouseEnter={() => onHover("open")}
          onMouseLeave={() => onHover("default")}
        >
          <span>Enter the archive</span>
          <strong>↓</strong>
        </button>
      </div>

      <div className="hero-scroll-text">MOVE / SCROLL / EXPLORE</div>
    </section>
  );
}

/* --------------------------------------------------
WORK
-------------------------------------------------- */

function WorkSection({
  hoveredProject,
  setHoveredProject,
  onHover,
}: {
  hoveredProject: Project | null;
  setHoveredProject: (project: Project | null) => void;
  onHover: (mode: string) => void;
}) {
  return (
    <section id="work" className="work-experience">
      <div className="work-header">
        <div className="section-label">
          <span>01</span>
          <span>Selected Work</span>
        </div>

        <div className="work-heading">
          <span>Not a grid.</span>
          <span>A collection of things.</span>
        </div>

        <div className="work-counter">
          <span>06</span>
          <span>PROJECTS</span>
        </div>
      </div>

      <div className="spatial-archive">
        <div className="archive-center">
          <span>MOVE</span>
          <i>THE</i>
          <span>CURSOR</span>
        </div>

        {PROJECTS.map((project) => (
          <SpatialProject
            key={project.id}
            project={project}
            hovered={hoveredProject?.id === project.id}
            onEnter={() => {
              setHoveredProject(project);
              onHover("view");
            }}
            onLeave={() => {
              setHoveredProject(null);
              onHover("default");
            }}
          />
        ))}
      </div>

      <div className="archive-footer">
        <span>2023—2026</span>

        <span className="archive-status">
          <i />
          Archive online
        </span>

        <span>Scroll to continue ↓</span>
      </div>
    </section>
  );
}

function SpatialProject({
  project,
  hovered,
  onEnter,
  onLeave,
}: {
  project: Project;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <article
      className={`spatial-project-text ${hovered ? "hovered" : ""} ${
        project.italic ? "italic" : ""
      }`}
      style={
        {
          "--x": project.x,
          "--y": project.y,
          "--r": `${project.rotate}deg`,
          "--size": project.size,
          "--tcolor":
            project.color === "blue" ? "var(--blue)" : "var(--sand)",
        } as React.CSSProperties
      }
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span className="project-title">{project.title}</span>

      {project.hasLogo && (
        <div className="project-logo-placeholder">
          <span>LOGO</span>
        </div>
      )}

      <div className="project-hover-info">
        <span>{project.id}</span>
        <span>
          {project.category} — {project.year}
        </span>
        <span>VIEW ↗</span>
      </div>
    </article>
  );
}

/* --------------------------------------------------
LOGOS
-------------------------------------------------- */

function LogoSection({
  activeLogo,
  setActiveLogo,
  onHover,
}: {
  activeLogo: Logo | null;
  setActiveLogo: (logo: Logo | null) => void;
  onHover: (mode: string) => void;
}) {
  return (
    <section id="logos" className="logos-experience">
      <div className="logo-header">
        <div className="section-label blue-label">
          <span>02</span>
          <span>Available Marks</span>
        </div>

        <div className="logo-intro">
          <h2>
            Some identities
            <br />
            are waiting
            <br />
            for a name.
          </h2>

          <p>
            Unused marks created independently and available for
            licensing, adaptation or further development.
          </p>
        </div>
      </div>

      <div className="logo-orbit">
        <div className="orbit-ring orbit-one" />
        <div className="orbit-ring orbit-two" />
        <div className="orbit-center">
          <BrandMark />
          <span>MARK / SYSTEM</span>
        </div>

        {LOGOS.map((logo, index) => (
          <button
            key={logo.id}
            className={`orbit-logo orbit-logo-${index + 1}`}
            onClick={() => setActiveLogo(logo)}
            onMouseEnter={() => onHover("select")}
            onMouseLeave={() => onHover("default")}
          >
            <small>{logo.id}</small>
            <strong>{logo.symbol}</strong>
            <span>{logo.name}</span>
          </button>
        ))}
      </div>

      <div className="logo-bottom">
        <span>SELECT A MARK</span>
        <span>CLICK TO INSPECT</span>
        <span>LICENSING AVAILABLE ↗</span>
      </div>
    </section>
  );
}

/* --------------------------------------------------
LOGO OVERLAY
-------------------------------------------------- */

function LogoOverlay({
  logo,
  onClose,
  onHover,
}: {
  logo: Logo;
  onClose: () => void;
  onHover: (mode: string) => void;
}) {
  return (
    <div className="logo-overlay">
      <button
        className="overlay-close"
        onClick={onClose}
        onMouseEnter={() => onHover("open")}
        onMouseLeave={() => onHover("default")}
      >
        Close ×
      </button>

      <div className="overlay-top">
        <span>{logo.id}</span>
        <span>{logo.year}</span>
      </div>

      <div className="overlay-symbol">
        <span>{logo.symbol}</span>
      </div>

      <div className="overlay-info">
        <div>
          <span>{logo.type}</span>
          <h2>{logo.name}</h2>
        </div>

        <div className="overlay-description">
          <p>{logo.description}</p>

          <button
            onMouseEnter={() => onHover("open")}
            onMouseLeave={() => onHover("default")}
          >
            Request this mark ↗
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------
ABOUT
-------------------------------------------------- */

function AboutSection({
  onHover,
}: {
  onHover: (mode: string) => void;
}) {
  const services = [
    "Brand Identity",
    "Typography",
    "Art Direction",
    "Motion",
    "Digital",
    "Editorial",
    "Print",
  ];

  return (
    <section id="about" className="about-experience">
      <div className="about-header">
        <div className="section-label">
          <span>03</span>
          <span>About</span>
        </div>

        <span>PERSONAL / PRACTICE</span>
      </div>

      <div className="about-main">
        <div className="about-statement">
          <span>I DON'T REALLY</span>
          <span className="italic">DESIGN THINGS.</span>
          <span>I DESIGN HOW</span>
          <span>THEY FEEL.</span>
        </div>

        <div className="about-mark">
          <BrandMark />
        </div>
      </div>

      <div className="about-details">
        <div className="about-copy">
          <p>
            My work sits somewhere between graphic design, art
            direction and visual experimentation.
          </p>

          <p>
            I am interested in the space between a clear idea and
            the visual language that gives it character.
          </p>

          <p>
            I do not want every project to look the same. I want
            every project to feel like itself.
          </p>
        </div>

        <div className="about-services">
          {services.map((service, index) => (
            <button
              key={service}
              onMouseEnter={() => onHover("open")}
              onMouseLeave={() => onHover("default")}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{service}</span>
              <span>↗</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------
CONTACT
-------------------------------------------------- */

function ContactSection({
  onNavigate,
  onHover,
}: {
  onNavigate: (id: string) => void;
  onHover: (mode: string) => void;
}) {
  return (
    <section id="contact" className="contact-experience">
      <div className="contact-background-word">HELLO</div>

      <div className="contact-header">
        <span>04 / Contact</span>
        <span>Let's make something exist.</span>
      </div>

      <div className="contact-center">
        <span className="contact-small">HAVE A PROJECT?</span>

        <h2>
          LET'S
          <br />
          MAKE
          <br />
          <i>IT.</i>
        </h2>

        <a
          href="mailto:hello.gabrielvisuals@gmail.com"
          onMouseEnter={() => onHover("open")}
          onMouseLeave={() => onHover("default")}
        >
          <span>hello.gabrielvisuals@gmail.com</span>
          <strong>↗</strong>
        </a>
      </div>

      <div className="contact-footer">
        <div>
          <span>Gabriel</span>
          <span>Poznań / Poland</span>
        </div>

        <div>
          <button
            onClick={() => onNavigate("work")}
            onMouseEnter={() => onHover("open")}
            onMouseLeave={() => onHover("default")}
          >
            Work
          </button>

          <button
            onClick={() => onNavigate("logos")}
            onMouseEnter={() => onHover("open")}
            onMouseLeave={() => onHover("default")}
          >
            Logos
          </button>

          <button
            onClick={() => onNavigate("about")}
            onMouseEnter={() => onHover("open")}
            onMouseLeave={() => onHover("default")}
          >
            About
          </button>
        </div>
      </div>
    </section>
  );
}
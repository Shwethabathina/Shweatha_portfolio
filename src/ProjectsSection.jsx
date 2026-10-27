
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Github,
  FileText,
} from "lucide-react";

import FlyingButton from "./FlyingButton.jsx";
import CertificationsDepthCarousel from "./CertificationsDepthCarousel.jsx";
import "./ProjectsSection.css";

const PROJECTS = [
  {
    id: "hana",
    title: "Hana Matsuri: Festival After Dusk",
    category: "3D Graphics & Game Development",
    description:
      "An immersive Japanese festival featuring cinematic rendering, animated environments, NPC behavior, and interactive minigames.",
    tags: [
      "3D Rendering",
      "Animation",
      "NPC AI",
      "Gameplay",
    ],
    image: "/projects/hana-matsuri.jpg",
    github:
      "https://github.com/Shwethabathina/hana-matsuri",
    live: "https://hana-matsuri.vercel.app/",
    tone: "violet",
  },
  {
    id: "role",
    title: "RoleReady",
    category: "Agentic AI & Career Intelligence",
    description:
      "An evidence-first AI career tool that analyzes resume-to-role fit, identifies gaps, and creates personalized interview preparation plans.",
    tags: [
      "Python",
      "RAG",
      "LangGraph",
      "Streamlit",
    ],
    image: "/projects/roleready.jpg",
    github:
      "https://github.com/Shwethabathina/RoleReady",
    live:
      "https://roleready-l8qtaxf2fmr9swhvbqhry3.streamlit.app/",
    tone: "blue",
  },
  {
    id: "fire",
    title: "The Bot is on Fire",
    category: "Artificial Intelligence & Pathfinding",
    description:
      "Developed AI agents using BFS, Dijkstra-based search, and risk-aware pathfinding to navigate a dynamically spreading-fire environment.",
    tags: [
      "Python",
      "BFS",
      "Dijkstra",
      "AI Search",
    ],
    image: "/projects/fire-bot.jpg",
    github:
      "https://github.com/Shwethabathina/AI_PROJECT-Fire-and-Bot",
    tone: "cyan",
    imageLabel: "Concept visualization",
  },
  {
    id: "phishing",
    title:
      "PHISHING - AWARE: A NEURO-FUZZY APPROACH FOR ANTI-PHISHING ON FOG NETWORKS",
    category:
      "Cybersecurity & Intelligent Threat Detection",
    description:
      "Explored neuro-fuzzy anti-phishing techniques for identifying threats and improving security across fog-network environments.",
    tags: [
      "Java",
      "MySQL",
      "Neuro-Fuzzy",
      "Cybersecurity",
    ],
    image: "/projects/phishing-report-real.jpg",
    github:
      "https://github.com/Shwethabathina/Phishing-Aware-Neuro-Fuzzy-Anti-Phishing-System-",
    tone: "teal",
  },
  {
    id: "fourpl",
    title: "4PL Supply Chain Integration",
    category: "Research Publication · INCET 2024",
    description:
      "Published research exploring how fourth-party logistics and emerging technologies improve supply chain management efficiency.",
    tags: [
      "Research",
      "4PL",
      "Supply Chain",
      "INCET",
    ],
    image: "/projects/research-4pl-preview.jpg",
    paper:
      "https://www.researchgate.net/publication/382605039_Enhancing_Supply_Chain_Management_Efficiency_Through_4PL_Integration_Leveraging_Recent_Technological_Advancement",
    tone: "yellow",
    imageLabel: "Logistics illustration",
  },
  {
    id: "face",
    title: "Face Recognition Attendance System",
    category: "Computer Vision & Research",
    description:
      "Developed a face-recognition attendance prototype exploring automated identification and real-time database-backed attendance tracking.",
    tags: [
      "Python",
      "Computer Vision",
      "Firebase",
      "Research",
    ],
    image: "/projects/attendance-demo.png",
    paper:
      "https://www.ijirset.com/upload/2024/july/79_Face.pdf",
    github:
      "https://github.com/Shwethabathina/face-recognition-based-attendance-system-using-realtime-db",
    tone: "red",
    imageLabel: "Simulated UI mockup",
  },
];


// Uses the same maskWordWindow, maskWordReveal and maskWordTexture
// classes already defined in the portfolio's main style.css.
function MaskedHeading({ text }) {
  const headingRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = headingRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <h2 className="portfolio-exact-masked-heading" ref={headingRef} aria-label={text}>
      {visible ? (
        <span className="maskedName">
          {text.split(" ").map((word, index, words) => (
            <React.Fragment key={`${word}-${index}`}>
              <span className="maskWordWindow">
                <span
                  className="maskWordReveal"
                  aria-hidden="true"
                  style={{ animationDelay: `${0.2 + index * 0.18}s` }}
                >
                  <span className="maskWordTexture">{word}</span>
                </span>
              </span>
              {index < words.length - 1 ? " " : null}
            </React.Fragment>
          ))}
        </span>
      ) : (
        <span style={{ visibility: "hidden" }} aria-hidden="true">{text}</span>
      )}
    </h2>
  );
}

function ProjectImage({ project }) {
  return (
    <div className="sbnew-media">
      <img
        src={project.image}
        alt={`${project.title} project preview`}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.opacity = "0";
        }}
      />

      {project.imageLabel && (
        <span className="sbnew-image-label">
          {project.imageLabel}
        </span>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  const cardRef = useRef(null);

  const primaryLink =
    project.live || project.paper || project.github;

  function handlePointerMove(event) {
    const card = cardRef.current;

    if (
      !card ||
      event.pointerType === "touch" ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX =
      (0.5 - y / rect.height) * 4;

    const rotateY =
      (x / rect.width - 0.5) * 4;

    card.style.setProperty(
      "--mouse-x",
      `${x}px`
    );

    card.style.setProperty(
      "--mouse-y",
      `${y}px`
    );

    card.style.setProperty(
      "--rotate-x",
      `${rotateX}deg`
    );

    card.style.setProperty(
      "--rotate-y",
      `${rotateY}deg`
    );
  }

  function handlePointerLeave() {
    const card = cardRef.current;

    if (!card) return;

    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
  }

  return (
    <article
      ref={cardRef}
      className={`sbnew-card sbnew-tone-${project.tone}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <a
        href={primaryLink}
        target="_blank"
        rel="noopener noreferrer"
        className="sbnew-card-main"
        aria-label={`Open ${project.title}`}
      >
        <ProjectImage project={project} />

        <div className="sbnew-card-body">
          <div className="sbnew-project-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <h3>{project.title}</h3>

          <p>{project.description}</p>

          <span className="sbnew-explore">
            {project.live
              ? "Explore live project"
              : project.paper
                ? "Read research"
                : "View project"}

            <ArrowUpRight size={16} />
          </span>
        </div>
      </a>

      <div className="sbnew-card-links">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={17} />
            <span>GitHub</span>
          </a>
        )}

        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ArrowUpRight size={17} />
            <span>Live Demo</span>
          </a>
        )}

        {project.paper && (
          <a
            href={project.paper}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText size={17} />
            <span>Read Paper</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;

    if (!grid) return;

    const cards =
      grid.querySelectorAll(".sbnew-card");

    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) => {
        card.classList.add("is-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 50px 0px",
      }
    );

    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  function handleGridPointerMove(event) {
    const grid = gridRef.current;

    if (!grid || event.pointerType === "touch") {
      return;
    }

    const bounds =
      grid.getBoundingClientRect();

    grid.style.setProperty(
      "--grid-x",
      `${event.clientX - bounds.left}px`
    );

    grid.style.setProperty(
      "--grid-y",
      `${event.clientY - bounds.top}px`
    );

    grid.classList.add("spotlight-active");
  }

  function handleGridPointerLeave() {
    gridRef.current?.classList.remove(
      "spotlight-active"
    );
  }

  return (
    <section
      id="projects"
      className="sbnew-section"
    >
      {/* PROJECTS HEADER */}
      <div className="sbnew-header">
        <MaskedHeading text="Projects" />

        <p>
          Intelligent systems, interactive experiences,
          and research brought to life through code.
        </p>
      </div>

      {/* SIX CHROMA PROJECT CARDS */}
      <div
        ref={gridRef}
        className="sbnew-grid"
        onPointerMove={handleGridPointerMove}
        onPointerLeave={handleGridPointerLeave}
      >
        <div
          className="sbnew-grid-spotlight"
          aria-hidden="true"
        />

        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>

      {/* FLYING GITHUB BUTTON */}
      <div className="sbnew-github-cta">
        <FlyingButton />
      </div>

      {/* CERTIFICATIONS DEPTH CAROUSEL */}
      <CertificationsDepthCarousel />
    </section>
  );
}

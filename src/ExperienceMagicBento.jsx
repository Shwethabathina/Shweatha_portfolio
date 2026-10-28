
import React, { useEffect, useRef, useState } from "react";
import "./ExperienceMagicBento.css";

const EXPERIENCES = [
  {
    category: "WEB DEVELOPMENT",
    role: "Website Developer Intern",
    organization: "Rutgers Democracy Lab - Eagleton Institute of Politics",
    affiliation: "New Brunswick, NJ",
    dates: "Sep – Nov 2025",
    banner: "democracy",
    headline: "Improved web experiences serving 1,000+ users",
    details:
      "Enhanced the performance and accessibility of an academic web platform serving 1,000+ users. Built reusable blog and event modules using HTML, CSS, JavaScript, and MySQL, simplifying content updates and collaborating with stakeholders to deliver production-ready features.",
    skills: ["JavaScript", "HTML & CSS", "MySQL", "Accessibility"],
  },
  {
    category: "SOFTWARE QUALITY",
    role: "Teaching Assistant / Grader — Software Methodology",
    organization: "Rutgers University",
    affiliation: "New Brunswick, NJ",
    dates: "Sep 2025 – Jan 2026",
    banner: "rutgers",
    headline: "Reviewed 100+ Java software projects for correctness and quality",
    details:
      "Reviewed and debugged 100+ Java project submissions, assessing correctness, JUnit test coverage, exception handling, and object-oriented design. Evaluated applications of MVC, Factory, and Singleton patterns and provided feedback on code quality and maintainability.",
    skills: ["Java", "JUnit", "OOP", "Design Patterns"],
  },
  {
    category: "TECHNICAL MENTORSHIP",
    role: "Computer Science Trainer",
    organization: "Edu-Ideal Academy",
    affiliation: "Chennai, India",
    dates: "Jun – Dec 2024",
    banner: "academy",
    headline: "Taught programming and problem-solving to 200+ students",
    details:
      "Delivered hands-on instruction in Python, C, and C++ to 200+ students, emphasizing algorithms, debugging, and logical problem-solving. Guided students through coding projects, offered individualized technical feedback, and tracked learning progress using cloud-based platforms.",
    skills: ["Python", "C", "C++", "Algorithms"],
  },
  {
    category: "FRONTEND DEVELOPMENT",
    role: "Web Developer Intern",
    organization: "The Website Makers",
    affiliation: "India",
    dates: "Jun – Jul 2023",
    banner: "makers",
    headline: "Developed responsive, component-based React interfaces",
    details:
      "Built responsive web interfaces with React.js, JavaScript, HTML, and CSS. Developed reusable UI components and interactive page layouts, applying frontend development practices to improve usability across screen sizes.",
    skills: ["React.js", "JavaScript", "HTML5", "CSS3"],
  },
];

function ExperienceCard({
  experience,
  enableTilt,
  enableStars,
  enableMagnetism,
}) {
  const cardRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [active, setActive] = useState(false);
const handleMove = (event) => {
    const card = cardRef.current;
    if (!card || event.pointerType === "touch") return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const nx = (x / rect.width - 0.5) * 2;
    const ny = (y / rect.height - 0.5) * 2;

    card.style.setProperty("--magic-x", `${x}px`);
    card.style.setProperty("--magic-y", `${y}px`);

    card.style.setProperty(
      "--magic-rotate-x",
      `${enableTilt ? -ny * 5 : 0}deg`
    );

    card.style.setProperty(
      "--magic-rotate-y",
      `${enableTilt ? nx * 5 : 0}deg`
    );

    card.style.setProperty(
      "--magic-move-x",
      `${enableMagnetism ? nx * 5 : 0}px`
    );

    card.style.setProperty(
      "--magic-move-y",
      `${enableMagnetism ? ny * 5 : 0}px`
    );
  };

  const handleEnter = (event) => {
    if (event.pointerType === "touch") return;
    setActive(true);

    if (!enableStars) return;

    const particles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: ((i * 67 + 17) % 91) + 4,
      y: ((i * 43 + 11) % 84) + 8,
      delay: (i * 0.13) % 1.5,
      duration: 1.9 + (i % 5) * 0.37,
      size: 2 + (i % 3),
    }));

    setStars(particles);
  };

  const handleLeave = () => {
    setActive(false);
    setStars([]);

    const card = cardRef.current;
    if (!card) return;

    [
      "--magic-rotate-x",
      "--magic-rotate-y",
      "--magic-move-x",
      "--magic-move-y",
    ].forEach((prop) => {
      card.style.removeProperty(prop);
    });
  };

  return (
    <div className="experienceTimelineEntry">
      <div className="experienceTimelineDate">
        {experience.dates}
      </div>

      <span
        className="experienceTimelineNode"
        aria-hidden="true"
      />

      <article
        ref={cardRef}
        className={`experienceMagicCard ${active ? "isHovered" : ""}`}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onPointerMove={handleMove}
        onFocus={handleEnter}
        onBlur={handleLeave}
        tabIndex={0}
        aria-label={`${experience.role}, ${experience.organization}, ${experience.dates}`}
      >
        {/* Interactive spotlight */}
        <div
          className="experienceMagicGlow"
          aria-hidden="true"
        />

        {/* Magic Bento stars */}
        <div
          className="experienceMagicStars"
          aria-hidden="true"
        >
          {stars.map((star) => (
            <span
              key={star.id}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Organization banner */}
        <div
          className={`experienceBanner experienceBanner--${experience.banner}`}
          aria-label={experience.organization}
        >
          <div className="experienceBannerCopy">
            <span className="experienceCompanyGradient">
              {experience.organization}
            </span>

            <small>{experience.affiliation}</small>
          </div>
        </div>

        {/* Experience details */}
        <div className="experienceCardContent">
          <div className="experienceCardKicker">
            <span>{experience.category}</span>
            <span className="experienceMobileDate">
              {experience.dates}
            </span>
          </div>

          <h3>{experience.role}</h3>

          <h4>{experience.headline}</h4>

          <p>{experience.details}</p>

          <div className="experienceCardFooter">
            <div className="experienceTechnologyTags">
              {experience.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function ExperienceMagicBento({
  gap = 13,
  rowHeight = 215,
  enableTilt = true,
  enableStars = true,
  enableMagnetism = true,
}) {
  const timelineRef = useRef(null);

  /* Same scroll-controlled filling effect as Education */
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let frame = null;

    const clamp = (value, min, max) =>
      Math.min(max, Math.max(min, value));

    function updateTimeline() {
      frame = null;

      const bounds = timeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const startPoint = viewportHeight * 0.75;
      const endPoint = viewportHeight * 0.25;

      const totalDistance =
        bounds.height + startPoint - endPoint;

      const distanceTraveled =
        startPoint - bounds.top;

      const progress = reducedMotion.matches
        ? 1
        : clamp(
            distanceTraveled / Math.max(totalDistance, 1),
            0,
            1
          );

      timeline.style.setProperty(
        "--experience-fill-progress",
        String(progress)
      );

      const entries = timeline.querySelectorAll(
        ".experienceTimelineEntry"
      );

      entries.forEach((entry) => {
        const node = entry.querySelector(
          ".experienceTimelineNode"
        );

        if (!node) return;

        const nodeBounds = node.getBoundingClientRect();

        const nodeY =
          nodeBounds.top +
          nodeBounds.height / 2 -
          bounds.top;

        const filledHeight =
          progress * bounds.height;

        entry.classList.toggle(
          "experienceNodeReached",
          reducedMotion.matches ||
            filledHeight >= nodeY
        );
      });
    }

    function requestUpdate() {
      if (frame !== null) return;

      frame = window.requestAnimationFrame(
        updateTimeline
      );
    }

    requestUpdate();

    window.addEventListener(
      "scroll",
      requestUpdate,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      requestUpdate
    );

    reducedMotion.addEventListener?.(
      "change",
      requestUpdate
    );

    return () => {
      window.removeEventListener(
        "scroll",
        requestUpdate
      );

      window.removeEventListener(
        "resize",
        requestUpdate
      );

      reducedMotion.removeEventListener?.(
        "change",
        requestUpdate
      );

      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <div
      ref={timelineRef}
      className="experienceMagicTimeline"
      style={{
        "--experience-gap": `${gap}px`,
        "--experience-row-height": `${rowHeight}px`,
        "--experience-fill-progress": 0,
      }}
    >
      {EXPERIENCES.map((experience, index) => (
        <ExperienceCard
          key={`${experience.organization}-${index}`}
          experience={experience}
          enableTilt={enableTilt}
          enableStars={enableStars}
          enableMagnetism={enableMagnetism}
        />
      ))}
    </div>
  );
}

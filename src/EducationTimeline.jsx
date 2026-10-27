
import React, { useEffect, useRef, useState } from "react";
import "./EducationTimeline.css";

// Coursework is selected from the uploaded academic transcripts.
const schools = [
  {
    name: "Rutgers, The State University of New Jersey",
    subtitle: "New Brunswick, New Jersey · USA",
    degree: "Master of Science in Computer Science",
    dates: "Jan 2025 –  Dec 2026",
    gpa: "3.78 / 4.00",
    highlight:
      "Graduate studies in AI, machine learning, data systems, and software engineering foundations.",
    courses: [
      "CS536 : Machine Learning",
      "CS550 : Mass Data Mining",
      "CS523 : Computer Graphics",
      "CS520 : Introduction to Artificial Intelligence",
      "CS580 : Computer Structures",
      "CS527 : Database systems for Datascience"
    ],
    kind: "masters"
  },
  {
    name: "R.M.D. Engineering College, Anna University",
    subtitle: "Chennai, India",
    degree:
      "Bachelor of Engineering in Computer Science and Engineering",
    dates: "2020 – 2024",
    gpa: "9.24 / 10",
    distinction: "First Class with Distinction",
    highlight:
      "A strong grounding in the core computer science subjects used in software engineering and technical interviews.",
    courses: [
      "Data Structures and Algorithms",
      "Design and Analysis of Algorithms",
      "Object Oriented Programming",
      "Operating Systems",
      "Software Engineering",
      "Cloud Computing",
      "Artificial Intelligence"
    ],
    kind: "bachelors"
  }
];

function EducationMagicCard({
  school,
  children,
  enableTilt = true,
  enableStars = true,
  enableMagnetism = true
}) {
  const ref = useRef(null);
  const [stars, setStars] = useState([]);
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const precisePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    const update = () =>
      setCanAnimate(
        !reduced.matches && precisePointer.matches
      );

    update();

    reduced.addEventListener?.("change", update);
    precisePointer.addEventListener?.("change", update);

    return () => {
      reduced.removeEventListener?.("change", update);
      precisePointer.removeEventListener?.("change", update);
    };
  }, []);

  function handleMove(event) {
    const card = ref.current;

    if (!card || !canAnimate) return;

    const bounds = card.getBoundingClientRect();

    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    const dx = (x / bounds.width - 0.5) * 2;
    const dy = (y / bounds.height - 0.5) * 2;

    card.style.setProperty("--edu-magic-x", `${x}px`);
    card.style.setProperty("--edu-magic-y", `${y}px`);

    card.style.setProperty(
      "--edu-rotate-x",
      `${enableTilt ? -dy * 5 : 0}deg`
    );

    card.style.setProperty(
      "--edu-rotate-y",
      `${enableTilt ? dx * 5 : 0}deg`
    );

    card.style.setProperty(
      "--edu-move-x",
      `${enableMagnetism ? dx * 5 : 0}px`
    );

    card.style.setProperty(
      "--edu-move-y",
      `${enableMagnetism ? dy * 5 : 0}px`
    );
  }

  function handleEnter() {
    if (!canAnimate || !enableStars) return;

    setStars(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: ((i * 67 + 17) % 91) + 4,
        y: ((i * 43 + 11) % 84) + 8,
        delay: (i * 0.13) % 1.5,
        duration: 1.9 + (i % 5) * 0.37,
        size: 2 + (i % 3)
      }))
    );
  }

  function handleLeave() {
    setStars([]);

    const card = ref.current;
    if (!card) return;

    [
      "--edu-rotate-x",
      "--edu-rotate-y",
      "--edu-move-x",
      "--edu-move-y"
    ].forEach(prop =>
      card.style.removeProperty(prop)
    );
  }

  return (
    <div
      ref={ref}
      className="educationTimelineCard educationMagicCard"
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
      aria-label={`${school.name}, ${school.degree}`}
    >
      <div
        className="educationMagicGlow"
        aria-hidden="true"
      />

      <div
        className="educationMagicStars"
        aria-hidden="true"
      >
        {stars.map(star => (
          <span
            key={star.id}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
      </div>

      <div className="educationMagicContent">
        {children}
      </div>
    </div>
  );
}

export default function EducationTimeline({
  heading,
  gap = 13,
  rowHeight = 215,
  enableTilt = true,
  enableStars = true,
  enableMagnetism = true
}) {
  const timelineRef = useRef(null);

  /*
   * Scroll-controlled timeline fill.
   *
   * The fill begins when Education approaches
   * the lower part of the viewport.
   *
   * It progresses downward as the user scrolls,
   * and reverses when scrolling upward.
   */
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

      // Start filling when the timeline reaches
      // 75% down the viewport.
      const startPoint = viewportHeight * 0.75;

      // Complete filling when its bottom approaches
      // 25% down the viewport.
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
        "--edu-fill-progress",
        String(progress)
      );

      // Light up each node as the progress
      // reaches its position on the rail.
      const markerEntries = timeline.querySelectorAll(
        ".educationEntry"
      );

      markerEntries.forEach(entry => {
        const marker = entry.querySelector(
          ".educationTimelineMarker"
        );

        if (!marker) return;

        const markerBounds =
          marker.getBoundingClientRect();

        const markerY =
          markerBounds.top +
          markerBounds.height / 2 -
          bounds.top;

        const filledHeight =
          progress * bounds.height;

        entry.classList.toggle(
          "educationNodeReached",
          reducedMotion.matches ||
            filledHeight >= markerY
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
    <section
      className="section educationTimelineSection"
      id="education"
      aria-labelledby="education-heading"
    >
      <h2
        className="educationTimelineHeading"
        id="education-heading"
      >
        {heading || "Education"}
      </h2>

      <div
        ref={timelineRef}
        className="educationTimeline"
        aria-label="Academic qualifications"
        style={{
          "--education-bento-gap": `${gap}px`,
          "--education-bento-row-height": `${rowHeight}px`,
          "--edu-fill-progress": 0
        }}
      >
        {schools.map(school => (
          <article
            className={`educationEntry educationEntry--${school.kind}`}
            key={school.name}
          >
            <div
              className="educationTimelineMarker"
              aria-hidden="true"
            >
              <span />
            </div>

            <EducationMagicCard
              school={school}
              enableTilt={enableTilt}
              enableStars={enableStars}
              enableMagnetism={enableMagnetism}
            >
              <div className="educationTimelineCardTop">
                <div className="educationTimelineSchool">
                  <h3>{school.name}</h3>
                  <p>{school.subtitle}</p>
                </div>

                <span className="educationTimelineDate">
                  {school.dates}
                </span>
              </div>

              <h4>{school.degree}</h4>

              <div className="educationTimelineAccolades">
                <span>
                  GPA: <strong>{school.gpa}</strong>
                </span>

                {school.distinction && (
                  <span>
                    {school.distinction}
                  </span>
                )}
              </div>

              <p className="educationTimelineSummary">
                {school.highlight}
              </p>

              <div className="educationCourseworkBlock">
                <h5>Coursework:</h5>
                <ul className="educationTimelineCourses">
                  {school.courses.map(course => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </div>
            </EducationMagicCard>
          </article>
        ))}
      </div>
    </section>
  );
}

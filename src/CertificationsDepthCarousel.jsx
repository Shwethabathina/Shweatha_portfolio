import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import "./CertificationsDepthCarousel.css";

const CERTIFICATES = [
  { title: "Google Analytics Certification", img: "/Certifications/GoogleAnalytics.png" },
  { title: "Google Cloud Certification", img: "/Certifications/GoogleCloud.png" },
  { title: "Wipro Java Fullstack Certification", img: "/Certifications/wipro.png" },
  { title: "GUVI Python Certification", img: "/Certifications/Guvipython.png" },
  { title: "Java Certification", img: "/Certifications/Java.png" },
  { title: "JDBC Certification", img: "/Certifications/JDBC.png" },
  { title: "C++ Certification", img: "/Certifications/cpp.png" },
  { title: "NPTEL Certification - Design and Analysis", img: "/Certifications/Nptel.png" },
  { title: "NPTEL Certification - DBMS", img: "/Certifications/NPTEL1.png" },
];

const TRANSITION_MS = 650;
const VISIBLE_DEPTH = 4;

function MaskedCertificationsHeading() {
  const [visible, setVisible] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    const element = headingRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <h2 ref={headingRef} className="certDepthHeadingText">
      <span className="maskedName" aria-label="Certifications">
        <span className="maskWordWindow">
          {visible ? (
            <span className="maskWordReveal" aria-hidden="true">
              <span className="maskWordTexture">Certifications</span>
            </span>
          ) : (
            <span style={{ visibility: "hidden" }} aria-hidden="true">
              Certifications
            </span>
          )}
        </span>
      </span>
    </h2>
  );
}

export default function CertificationsDepthCarousel() {
  const [active, setActive] = useState(0);
  const [moving, setMoving] = useState(null);
  const busy = useRef(false);
  const timer = useRef(null);
  const touchX = useRef(null);
  const total = CERTIFICATES.length;

  useEffect(() => () => clearTimeout(timer.current), []);

  function navigate(direction) {
    if (busy.current) return;
    busy.current = true;
    setMoving(direction);
    timer.current = setTimeout(() => {
      setActive((previous) => (previous + direction + total) % total);
      setMoving(null);
      busy.current = false;
    }, TRANSITION_MS);
  }

  const next = () => navigate(1);
  const previous = () => navigate(-1);

  function handleKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    }
  }

  const activeCertificate = CERTIFICATES[active];
  const visible = Array.from({ length: Math.min(VISIBLE_DEPTH, total) }, (_, depth) => {
    const index = (active + depth) % total;
    return { ...CERTIFICATES[index], index, depth };
  });

  return (
    <section className="certDepthSection" aria-label="Certifications">
      <header className="certDepthHeader">
        <MaskedCertificationsHeading />
        <p>Credentials &amp; Continuous Learning</p>
      </header>

      <div
        className={`certDepthCarousel ${moving === 1 ? "is-next" : moving === -1 ? "is-previous" : ""}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={(event) => { touchX.current = event.changedTouches[0].clientX; }}
        onTouchEnd={(event) => {
          if (touchX.current == null) return;
          const delta = event.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(delta) > 45) navigate(delta < 0 ? 1 : -1);
        }}
        aria-label="Certificate depth carousel, use left and right arrow keys"
      >
        <button className="certDepthArrow certDepthArrowLeft" type="button" onClick={previous} disabled={moving !== null} aria-label="Previous certificate">
          <ArrowLeft size={22} />
        </button>

        <div className="certDepthStage">
          {visible.map((cert) => (
            <article
              key={cert.img}
              className={`certDepthCard certDepthLayer${cert.depth}`}
              aria-hidden={cert.depth !== 0}
              style={{ zIndex: VISIBLE_DEPTH - cert.depth }}
            >
              <div className="certDepthImageWrap">
                <img src={cert.img} alt={cert.depth === 0 ? cert.title : ""} loading="lazy" draggable="false" />
                {cert.depth === 0 && (
                  <button
                    className="certDepthFrontClick"
                    type="button"
                    onClick={next}
                    disabled={moving !== null}
                    aria-label="Move this certificate to the back of the stack"
                  />
                )}
              </div>
              <div className="certDepthFooter">
                <span>{cert.title}</span>
                {cert.depth === 0 && (
                  <a href={cert.img} target="_blank" rel="noopener noreferrer" className="certDepthOpen" aria-label={`View full ${cert.title}`}>
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <button className="certDepthArrow certDepthArrowRight" type="button" onClick={next} disabled={moving !== null} aria-label="Next certificate">
          <ArrowRight size={22} />
        </button>
      </div>

      <div className="certDepthDots" aria-label="Certificate position">
        {CERTIFICATES.map((cert, index) => (
          <span key={cert.img} className={`certDepthDot ${index === active ? "active" : ""}`} aria-label={`${index + 1} of ${total}: ${cert.title}`} />
        ))}
      </div>
      <p className="certDepthCaption" aria-live="polite">
        {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {activeCertificate.title}
      </p>
      <p className="certDepthHint">Click the front certificate to move it to the back · Click ↗ to view full size</p>
    </section>
  );
}

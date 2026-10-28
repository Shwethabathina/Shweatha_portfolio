
import React, { useRef, useState } from "react";
import "./AboutMagicBento.css";

/**
 * Magic Bento effects for the About section.
 *
 * Preserves the existing BorderGlow cards and their content.
 * Effects:
 * - Mouse-following spotlight
 * - Interactive card tilt
 * - Magnetic movement
 * - Animated stars on hover
 */
export default function AboutMagicBento({
  children,
  enableTilt = true,
  enableStars = true,
  enableMagnetism = true,
}) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [stars, setStars] = useState([]);

  const onMove = (event) => {
    const card = ref.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const nx = (x / rect.width - 0.5) * 2;
    const ny = (y / rect.height - 0.5) * 2;

    card.style.setProperty("--about-magic-x", `${x}px`);
    card.style.setProperty("--about-magic-y", `${y}px`);

    card.style.setProperty(
      "--about-magic-rx",
      `${enableTilt ? -ny * 5 : 0}deg`
    );

    card.style.setProperty(
      "--about-magic-ry",
      `${enableTilt ? nx * 5 : 0}deg`
    );

    card.style.setProperty(
      "--about-magic-mx",
      `${enableMagnetism ? nx * 5 : 0}px`
    );

    card.style.setProperty(
      "--about-magic-my",
      `${enableMagnetism ? ny * 5 : 0}px`
    );
  };

  const onEnter = (event) => {
    if (event.pointerType === "touch") return;

    setHovered(true);

    if (enableStars) {
      setStars(
        Array.from({ length: 12 }, (_, i) => ({
          id: i,
          x: ((i * 67 + 17) % 91) + 4,
          y: ((i * 43 + 11) % 84) + 8,
          delay: (i * 0.13) % 1.5,
          duration: 1.9 + (i % 5) * 0.37,
          size: 2 + (i % 3),
        }))
      );
    }
  };

  const onLeave = () => {
    setHovered(false);
    setStars([]);

    const card = ref.current;
    if (!card) return;

    [
      "--about-magic-rx",
      "--about-magic-ry",
      "--about-magic-mx",
      "--about-magic-my",
    ].forEach((key) => card.style.removeProperty(key));
  };

  return (
    <div
      ref={ref}
      className={`aboutMagicBento ${hovered ? "isHovered" : ""}`}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {children}

      <span
        className="aboutMagicSpotlight"
        aria-hidden="true"
      />

      <span
        className="aboutMagicStars"
        aria-hidden="true"
      >
        {stars.map((star) => (
          <i
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
      </span>
    </div>
  );
}

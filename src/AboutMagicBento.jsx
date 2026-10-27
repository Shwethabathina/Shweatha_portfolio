import React, { useEffect, useRef, useState } from 'react';
import './AboutMagicBento.css';

/** Adds the Experience Magic Bento spotlight, tilt, magnetism, and stars
 *  without replacing the existing BorderGlow cards or their content. */
export default function AboutMagicBento({ children, enableTilt = true, enableStars = true, enableMagnetism = true }) {
  const ref = useRef(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setMotionAllowed(!reduced.matches && fine.matches);
    update();
    reduced.addEventListener?.('change', update);
    fine.addEventListener?.('change', update);
    return () => {
      reduced.removeEventListener?.('change', update);
      fine.removeEventListener?.('change', update);
    };
  }, []);

  const onMove = (event) => {
    if (!motionAllowed || !ref.current) return;
    const card = ref.current;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const nx = (x / rect.width - 0.5) * 2;
    const ny = (y / rect.height - 0.5) * 2;
    card.style.setProperty('--about-magic-x', `${x}px`);
    card.style.setProperty('--about-magic-y', `${y}px`);
    card.style.setProperty('--about-magic-rx', `${enableTilt ? -ny * 5 : 0}deg`);
    card.style.setProperty('--about-magic-ry', `${enableTilt ? nx * 5 : 0}deg`);
    card.style.setProperty('--about-magic-mx', `${enableMagnetism ? nx * 5 : 0}px`);
    card.style.setProperty('--about-magic-my', `${enableMagnetism ? ny * 5 : 0}px`);
  };

  const onEnter = () => {
    setHovered(true);
    if (motionAllowed && enableStars) {
      setStars(Array.from({ length: 12 }, (_, i) => ({
        id: i, x: ((i * 67 + 17) % 91) + 4,
        y: ((i * 43 + 11) % 84) + 8,
        delay: (i * .13) % 1.5, duration: 1.9 + (i % 5) * .37,
        size: 2 + (i % 3)
      })));
    }
  };

  const onLeave = () => {
    setHovered(false);
    setStars([]);
    const card = ref.current;
    if (card) ['--about-magic-rx','--about-magic-ry','--about-magic-mx','--about-magic-my'].forEach(key => card.style.removeProperty(key));
  };

  return (
    <div ref={ref} className={`aboutMagicBento ${hovered ? 'isHovered' : ''}`}
      onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {children}
      <span className="aboutMagicSpotlight" aria-hidden="true" />
      <span className="aboutMagicStars" aria-hidden="true">
        {stars.map(star => <i key={star.id} style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` }} />)}
      </span>
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import "./SubtleStardustCursor.css";

/**
 * Decorative cursor for fine-pointer desktop devices.
 * Leaves the native cursor intact for usability.
 * No extra packages or modifications to existing components required.
 */
export default function SubtleStardustCursor() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduceMotion.matches) return;

    const halo = root.querySelector(".stardustHalo");
    const sparkleLayer = root.querySelector(".stardustParticles");
    const position = { x: -100, y: -100, currentX: -100, currentY: -100 };
    const particles = new Set();
    let frame = 0;
    let lastSparkleAt = 0;
    let lastSparkleX = -100;
    let lastSparkleY = -100;
    let active = false;

    const setActive = (enabled) => {
      active = enabled;
      root.classList.toggle("stardustVisible", enabled);
    };

    const spawn = (x, y, isClick = false) => {
      if (particles.size >= 5) return;
      const dot = document.createElement("span");
      dot.className = `stardustParticle${isClick ? " stardustClickParticle" : ""}`;
      const dx = (Math.random() - 0.5) * (isClick ? 17 : 9);
      const dy = (Math.random() - 0.5) * (isClick ? 17 : 9);
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.style.setProperty("--drift-x", `${dx}px`);
      dot.style.setProperty("--drift-y", `${dy}px`);
      sparkleLayer.appendChild(dot);
      particles.add(dot);
      dot.addEventListener("animationend", () => {
        particles.delete(dot);
        dot.remove();
      }, { once: true });
    };

    const onMove = (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      position.x = event.clientX;
      position.y = event.clientY;
      setActive(true);
      const target = event.target instanceof Element ? event.target : null;
      const isInput = !!target?.closest("input, textarea, select, [contenteditable='true'], [role='textbox']");
      const isInteractive = !isInput && !!target?.closest("a, button, [role='button'], summary");
      root.classList.toggle("stardustHover", isInteractive);
      root.classList.toggle("stardustTyping", isInput);
      const now = performance.now();
      const distance = Math.hypot(position.x - lastSparkleX, position.y - lastSparkleY);
      if (!isInput && now - lastSparkleAt > 85 && distance > 16) {
        spawn(position.x, position.y);
        lastSparkleAt = now;
        lastSparkleX = position.x;
        lastSparkleY = position.y;
      }
    };

    const onDown = (event) => {
      if (!active || (event.pointerType && event.pointerType !== "mouse")) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      spawn(event.clientX + 5, event.clientY - 5, true);
      spawn(event.clientX - 4, event.clientY + 3, true);
    };

    const onLeave = () => setActive(false);
    const onEnter = () => setActive(true);
    const animate = () => {
      position.currentX += (position.x - position.currentX) * 0.22;
      position.currentY += (position.y - position.currentY) * 0.22;
      halo.style.transform = `translate3d(${position.currentX}px, ${position.currentY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("blur", onLeave);
      for (const dot of particles) dot.remove();
      particles.clear();
    };
  }, []);

  return (
    <div className="stardustCursor" ref={rootRef} aria-hidden="true">
      <div className="stardustHalo" />
      <div className="stardustParticles" />
    </div>
  );
}


import React, { useState } from "react";
import { Github, ArrowUpRight } from "lucide-react";
import "./FlyingButton.css";

/** Independent GitHub CTA. Its stationary hover area prevents takeoff flicker. */
export default function FlyingButton() {
  const [flying, setFlying] = useState(false);

  return (
    <div className="shwe-flying-container">
      <div
        className={`shwe-flight ${flying ? "is-flying" : ""}`}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") setFlying(true);
        }}
        onPointerLeave={() => setFlying(false)}
        onFocus={() => setFlying(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFlying(false);
          }
        }}
      >
        <span
          className="shwe-flight-ground-shadow"
          aria-hidden="true"
        />
        <span
          className="shwe-flight-flame shwe-flight-flame-left"
          aria-hidden="true"
        />
        <span
          className="shwe-flight-flame shwe-flight-flame-right"
          aria-hidden="true"
        />
        <span
          className="shwe-flight-vapor"
          aria-hidden="true"
        />

        <a
          className="shwe-flying-button"
          href="https://github.com/Shwethabathina?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={19} aria-hidden="true" />
          <span>View My GitHub</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

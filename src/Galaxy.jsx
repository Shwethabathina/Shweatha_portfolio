
import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Galaxy.css";

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;
uniform float uDensity;
uniform float uSpeed;
uniform float uGlow;
uniform float uTwinkle;
uniform vec3 uTint;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec3 stars(
  vec2 uv,
  float gridSize,
  float layer,
  float time
) {
  vec2 p = uv * gridSize;
  vec2 cell = floor(p);
  vec2 local = fract(p) - 0.5;

  vec3 total = vec3(0.0);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 id = cell + offset;

      float seed = hash21(id + layer * 18.71);

      float threshold =
        0.72 - (uDensity - 0.8) * 0.12;

      float active = step(threshold, seed);

      vec2 center = vec2(
        hash21(id + layer * 4.13),
        hash21(id + layer * 9.67)
      ) - 0.5;

      vec2 delta = local - offset - center;
      float d = length(delta);

      float variation = hash21(id + layer * 28.9);

      // Larger than the old shader's nearly invisible points.
      float radius = mix(0.035, 0.09, variation);

      float core =
        1.0 - smoothstep(0.0, radius, d);

      float halo =
        1.0 - smoothstep(0.0, radius * 3.5, d);

      float pulse =
        0.78 +
        0.22 * sin(
          time * (0.55 + variation * 1.5)
          + seed * 18.0
        );

      float shimmer = mix(
        1.0,
        pulse,
        uTwinkle
      );

      vec3 tint = mix(
        vec3(0.93, 0.93, 1.0),
        uTint,
        variation * 0.65
      );

      float brightness = active * shimmer *
        (core + halo * uGlow * 0.24);

      total += tint * brightness;
    }
  }

  return total;
}

void main() {
  vec2 uv = vUv;

  // Maintain circular stars on wide screens.
  uv.x *= uResolution.x / uResolution.y;

  float t = uTime * uSpeed;

  vec2 layerOne = uv + vec2(t * 0.0014, 0.0);
  vec2 layerTwo = uv - vec2(t * 0.0008, t * 0.0004);
  vec2 layerThree = uv + vec2(0.0, t * 0.0007);

  vec3 color = vec3(0.0);

  color += stars(layerOne, 15.0, 1.0, uTime) * 0.76;
  color += stars(layerTwo, 25.0, 2.0, uTime) * 0.57;
  color += stars(layerThree, 39.0, 3.0, uTime) * 0.38;

  float intensity = max(
    max(color.r, color.g),
    color.b
  );

  float alpha = clamp(intensity * 1.4, 0.0, 0.95);

  gl_FragColor = vec4(
    color,
    alpha
  );
}
`;

export default function Galaxy({
  density = 0.95,
  speed = 0.25,
  glowIntensity = 0.4,
  twinkleIntensity = 0.5,
  color = [0.77, 0.68, 1.0]
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer;
    let frameId;
    let observer;
    let disposed = false;
    let onResize = null;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });

      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      const geometry = new Triangle(gl);

      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uResolution: {
            value: new Float32Array([1, 1])
          },
          uTime: { value: 0 },
          uDensity: { value: density },
          uSpeed: { value: speed },
          uGlow: { value: glowIntensity },
          uTwinkle: { value: twinkleIntensity },
          uTint: {
            value: new Float32Array(color)
          }
        }
      });

      const mesh = new Mesh(gl, {
        geometry,
        program
      });

      container.appendChild(gl.canvas);

      onResize = () => {
        if (disposed) return;

        const w = Math.max(1, container.clientWidth);
        const h = Math.max(1, container.clientHeight);

        renderer.setSize(w, h);

        program.uniforms.uResolution.value =
          new Float32Array([
            gl.canvas.width,
            gl.canvas.height
          ]);
      };

      onResize();

      if ("ResizeObserver" in window) {
        observer = new ResizeObserver(onResize);
        observer.observe(container);
      } else {
        window.addEventListener("resize", onResize);
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const start = performance.now();

      const draw = () => {
        if (disposed) return;

        program.uniforms.uTime.value = reducedMotion
          ? 0
          : (performance.now() - start) / 1000;

        renderer.render({ scene: mesh });

        if (!reducedMotion) {
          frameId = requestAnimationFrame(draw);
        }
      };

      draw();

      return () => {
        disposed = true;

        cancelAnimationFrame(frameId);
        observer?.disconnect();

        if (onResize) {
          window.removeEventListener("resize", onResize);
        }

        if (gl.canvas.parentNode === container) {
          container.removeChild(gl.canvas);
        }

        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    } catch (error) {
      console.error("Galaxy background:", error);

      return () => {
        disposed = true;

        if (renderer?.gl?.canvas?.parentNode === container) {
          container.removeChild(renderer.gl.canvas);
        }
      };
    }
  }, [
    density,
    speed,
    glowIntensity,
    twinkleIntensity,
    color[0],
    color[1],
    color[2]
  ]);

  return (
    <div
      ref={containerRef}
      className="galaxy-container"
      aria-hidden="true"
    />
  );
}

import React, { useCallback, useRef } from 'react';
import './BorderGlow.css';

// Adapted from React Bits Border Glow (JavaScript + CSS variant).
// Cursor-relative angle and proximity drive the real mesh-gradient border.
function glowVariables(hsl, intensity) {
  const parts = String(hsl).match(/[\d.]+/g)?.map(Number) || [270, 90, 80];
  const [h, s, l] = parts;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  return Object.fromEntries(opacities.map((n, i) => [
    `--glow-color${i ? `-${n}` : ''}`,
    `hsl(${h}deg ${s}% ${l}% / ${Math.min(n * intensity, 100)}%)`
  ]));
}
const positions = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const names = ['one','two','three','four','five','six','seven'];
function gradientVariables(colors) {
  const result = { '--gradient-base': `linear-gradient(${colors[0]} 0 100%)` };
  positions.forEach((position, i) => {
    result[`--gradient-${names[i]}`] = `radial-gradient(at ${position}, ${colors[[0,1,2,0,1,2,1][i] % colors.length]} 0px, transparent 50%)`;
  });
  return result;
}
export default function BorderGlow({
  children, className = '', edgeSensitivity = 30,
  glowColor = '270 90 80', backgroundColor = '#120f20',
  borderRadius = 24, glowRadius = 32, glowIntensity = 0.9,
  coneSpread = 25, colors = ['#af8aff', '#d9acff', '#7384ff'],
  fillOpacity = 0.4
}) {
  const ref = useRef(null);
  const move = useCallback((event) => {
    const element = ref.current;
    if (!element) return;
    const box = element.getBoundingClientRect();
    const x = event.clientX - box.left, y = event.clientY - box.top;
    const cx = box.width / 2, cy = box.height / 2;
    const dx = x - cx, dy = y - cy;
    const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
    const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    let angle = (Math.atan2(dy, dx) * 180 / Math.PI + 90 + 360) % 360;
    element.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
    element.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }, []);
  return (
    <div ref={ref} onPointerMove={move}
      className={`border-glow-card ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...glowVariables(glowColor, glowIntensity),
        ...gradientVariables(colors)
      }}>
      <span className="edge-light" aria-hidden="true" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}

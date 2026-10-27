import React, { useState } from 'react';
import './PillNav.css';

// Pill navigation with refined rising fill and rolling labels; no indicator dots.
// Works with both anchor navigation (main navbar) and button filters (Skills).
export default function PillNav({
  items = [],
  initialActiveIndex = -1,
  activeIndex: controlledActiveIndex,
  onChange,
  onSelect,
  ariaLabel = 'Navigation',
  className = '',
}) {
  const [localIndex, setLocalIndex] = useState(initialActiveIndex);
  const activeIndex = controlledActiveIndex === undefined ? localIndex : controlledActiveIndex;
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  function choose(index, item, event) {
    if (controlledActiveIndex === undefined) setLocalIndex(index);
    onChange?.(index, item, event);
    onSelect?.(index, item, event);
  }

  return (
    <nav className={`pill-nav ${className}`.trim()} aria-label={ariaLabel}>
      <div className="pill-nav-list" onMouseLeave={() => setHoveredIndex(-1)}>
        {items.map((item, index) => {
          const selected = index === activeIndex;
          const classes = `pill-nav-link ${selected ? 'is-active' : ''} ${hoveredIndex === index ? 'is-hovered' : ''}`;
          const common = {
            key: `${item.href || item.label}-${index}`,
            className: classes,
            onClick: event => choose(index, item, event),
            onPointerMove: event => {
              const rect = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty('--specular-x', `${event.clientX - rect.left}px`);
              event.currentTarget.style.setProperty('--specular-y', `${event.clientY - rect.top}px`);
            },
            onMouseEnter: () => setHoveredIndex(index),
            onFocus: () => setHoveredIndex(index),
            onBlur: () => setHoveredIndex(-1),
          };
          const content = (
            <>
              <span className="pill-nav-fill" aria-hidden="true" />
              <span className="pill-nav-specular" aria-hidden="true" />
              <span className="pill-nav-label" aria-hidden="true">
                <span className="pill-nav-label-normal">{item.label}</span>
                <span className="pill-nav-label-roll">{item.label}</span>
              </span>
              <span className="pill-nav-sr">{item.label}</span>
            </>
          );
          return item.href ? (
            <a {...common} href={item.href} aria-current={selected ? 'location' : undefined}>{content}</a>
          ) : (
            <button {...common} type="button" aria-pressed={selected}>{content}</button>
          );
        })}
      </div>
    </nav>
  );
}

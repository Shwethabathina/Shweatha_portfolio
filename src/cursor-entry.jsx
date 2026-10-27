import React from "react";
import { createRoot } from "react-dom/client";
import SplashCursor from "./SplashCursor.jsx";

// Independent React root: your main.jsx and portfolio stay unchanged.
// Remove the cursor-entry.jsx script from index.html to turn this effect off.
let host = document.getElementById("portfolio-cursor-root");
if (!host) {
  host = document.createElement("div");
  host.id = "portfolio-cursor-root";
  document.body.appendChild(host);
}

class CursorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Splash Cursor error (portfolio stays mounted):", error, info);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

createRoot(host).render(
  <CursorErrorBoundary>
    <SplashCursor
      colors={["#a855f7", "#d926b2", "#200f70"]}
      rainbow={false}
      intensity={0.7}
      size={2}
      force={0.6}
      swirl={0}
      trail={1.5}
      momentum={1.9}
      glow={0.1}
      shading={1}
      quality="high"
      clickSplash={false}
      intro={true}
      contained={false}
      theme="dark"
      zIndex={9999}
    />
  </CursorErrorBoundary>
);

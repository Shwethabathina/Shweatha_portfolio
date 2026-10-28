
import React from "react";
import "./LogoLoop.css";

// Devicon "original" SVGs preserve each technology's recognizable brand colors.
// You can edit the order or remove items without changing the animation.
const ICON_ROOT = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const TECHNOLOGIES = [
  { name: "Python", path: "python/python-original.svg" },
  { name: "React", path: "react/react-original.svg" },
  { name: "Java", path: "java/java-original.svg" },
  { name: "JavaScript", path: "javascript/javascript-original.svg" },
  { name: "TypeScript", path: "typescript/typescript-original.svg" },
  { name: "TensorFlow", path: "tensorflow/tensorflow-original.svg" },
  { name: "PyTorch", path: "pytorch/pytorch-original.svg" },
  { name: "OpenCV", path: "opencv/opencv-original.svg" },
  { name: "Docker", path: "docker/docker-original.svg" },
  { name: "Amazon Web Services", path: "/icons/aws.svg" },
  { name: "PostgreSQL", path: "postgresql/postgresql-original.svg" },
  { name: "MongoDB", path: "mongodb/mongodb-original.svg" },
  { name: "Git", path: "git/git-original.svg" },
  { name: "HTML5", path: "html5/html5-original.svg" },
  { name: "CSS3", path: "css3/css3-original.svg" },
  { name: "MySQL", path: "mysql/mysql-original.svg" },
];

function LogoItem({ item }) {
  return (
    <div className="techLoopItem" title={item.name}>
      <img
        src={item.path.startsWith("/") ? item.path : `${ICON_ROOT}/${item.path}`}
        alt=""
        width="52"
        height="52"
        loading="lazy"
        draggable="false"
      />
      <span>{item.name}</span>
    </div>
  );
}

export default function LogoLoop() {
  return (
    <div className="techLoopSection">
      <div className="techLoopFrame" aria-label="Technology logos">
        <div className="techLoopTrack">
          <div className="techLoopGroup">
            {TECHNOLOGIES.map(item => (
              <LogoItem key={item.name} item={item} />
            ))}
          </div>
          <div className="techLoopGroup" aria-hidden="true">
            {TECHNOLOGIES.map(item => (
              <LogoItem key={`repeat-${item.name}`} item={item} />
            ))}
          </div>
        </div>
      </div>
      <p className="techLoopFootnote">Always learning, always building.</p>
    </div>
  );
}

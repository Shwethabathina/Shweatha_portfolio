 import React, { useEffect, useRef, useState } from "react";

 import PillNav from "./PillNav.jsx";

 import ExperienceMagicBento from "./ExperienceMagicBento.jsx";

 import EducationTimeline from "./EducationTimeline.jsx";

 import ProjectsSection from "./ProjectsSection.jsx";

 import ContactSection from "./ContactSection.jsx";

import MusicPlayer from "./MusicPlayer.jsx";

 import AboutMagicBento from "./AboutMagicBento.jsx";

 import BorderGlow from "./BorderGlow.jsx";

 import LogoLoop from "./LogoLoop.jsx";

 import { motion, useInView, AnimatePresence } from "motion/react";

 import { Code2, BrainCircuit, ShieldCheck, BookOpen, Workflow, Download } from "lucide-react";

 import { createRoot } from "react-dom/client";

 import {

   ArrowUpRight,

   ChevronDown,

   Github,

   Linkedin,

   Mail,

   Menu,

   MessageCircle,

   Snowflake,

   Volume2,

   VolumeX,

   X,

   Send,

   LoaderCircle

 } from "lucide-react";

 import { INTRO } from "./intro-config.js";

 import { PROFILE } from "./portfolio-data.js";

 import "./style.css";
import "./MobileOptimizations.css";

 /* A layered nebula with large glowing starbursts. The actual nebula image

   is served from public/galaxy-nebula.webp. No WebGL dependency required. */

 // A few softly twinkling highlights; the nebula texture supplies the rest.

 const BRIGHT_STARS = [

   [7, 45, 5, 0.2], [22, 19, 4, 1.8], [30, 8, 6, 0.6],

   [39, 82, 4, 1.4], [64, 19, 5, 2.3], [71, 9, 4, 0.3],

   [82, 84, 4, 1.5], [92, 16, 4, 1.9]

 ];

 function GalaxyBackground() {

   return (

     <div className="galaxyLayer" aria-hidden="true">

       <div className="nebulaImage" />

       <div className="nebulaVeil" />

       <div className="starDust starDustNear" />

       <div className="starDust starDustFar" />

       {BRIGHT_STARS.map(([x, y, size, delay], i) => (

         <span

           className="brightStar"

           key={i}

           style={{

             left: `${x}%`,

             top: `${y}%`,

             '--star-size': `${size}px`,

             '--star-delay': `${delay}s`

           }}

         />

       ))}

     </div>

   );

 }

 /* Purple electric frame inspired by the React Bits Electric Border effect.

   Pure React + SVG, so no additional package is required. */

 function ElectricMemojiBorder({ children }) {

   return (

     <div className="electricMemojiShell">

       <svg

         className="electricMemojiSvg"

         viewBox="0 0 400 460"

         preserveAspectRatio="none"

         aria-hidden="true"

         focusable="false"

       >

         <defs>

           <filter id="memojiElectricDistortion" x="-30%" y="-30%" width="160%" height="160%">

             <feTurbulence type="fractalNoise" baseFrequency="0.014 0.038" numOctaves="2" seed="8" result="noise">

               <animate attributeName="baseFrequency" values="0.014 0.038;0.025 0.052;0.014 0.038" dur="3.5s" repeatCount="indefinite" />

             </feTurbulence>

             <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />

           </filter>

         </defs>

         <rect className="electricMemojiGlow" x="8" y="8" width="384" height="444" rx="29" ry="29" />

         <rect className="electricMemojiArc" x="8" y="8" width="384" height="444" rx="29" ry="29" />

         <rect className="electricMemojiHighlight" x="8" y="8" width="384" height="444" rx="29" ry="29" />

       </svg>

       {children}

     </div>

   );

 }

 /* =========================================

   TEXT ANIMATIONS

 ========================================= */

 function MaskedName({ text }) {

   const words = text.split(" ");

   return (

     <span className="maskedName" aria-label={text}>

       {words.map((word, i) => (

         <React.Fragment key={i}>

           <span className="maskWordWindow">

             <span

               className="maskWordReveal"

               aria-hidden="true"

               style={{

                 animationDelay: `${0.2 + i * 0.18}s`

               }}

             >

               <span className="maskWordTexture">{word}</span>

             </span>

           </span>

           {i < words.length - 1 ? " " : null}

         </React.Fragment>

       ))}

     </span>

   );

 }

 function ScrollMaskedAboutHeading() {

   const headingRef = useRef(null);

   const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {

     const element = headingRef.current;

     if (!element) return;

     if (!("IntersectionObserver" in window)) {

       setIsVisible(true);

       return;

     }

     const observer = new IntersectionObserver(([entry]) => {

       if (entry.isIntersecting) {

         setIsVisible(true);

         observer.disconnect();

       }

     }, { threshold: 0.3 });

     observer.observe(element);

     return () => observer.disconnect();

   }, []);

   return (

     <h2 className="aboutSectionTitle" ref={headingRef}>

       {isVisible ? (

         <MaskedName text="About Me" />

       ) : (

         <span style={{ visibility: "hidden" }} aria-hidden="true">About Me</span>

       )}

     </h2>

   );

 }

 function AnimatedGradientText({ children }) {

   return (

     <span className="animatedGradientText">

       {children}

     </span>

   );

 }

 /* =========================================

   MEET SHWETHA BUTTON

 ========================================= */

 function SpecularButton({

   children,

   onClick,

   href,

   download,

   className = "",

   variant = "primary",

   type = "button",

   ...otherProps

 }) {

   const ref = useRef(null);

   function handlePointerMove(event) {

     const rect = ref.current?.getBoundingClientRect();

     if (!rect) return;

     ref.current.style.setProperty("--light-x", `${event.clientX - rect.left}px`);

     ref.current.style.setProperty("--light-y", `${event.clientY - rect.top}px`);

   }

   function resetLight() {

     ref.current?.style.setProperty("--light-x", "50%");

     ref.current?.style.setProperty("--light-y", "50%");

   }

   const Component = href ? "a" : "button";

   return (

     <Component

       ref={ref}

       className={`specularButton ${variant === "outline" ? "specularButton--outline" : ""} ${className}`.trim()}

       {...(href ? { href, ...(download ? { download } : {}) } : { type })}

       onClick={onClick}

       onPointerMove={handlePointerMove}

       onPointerLeave={resetLight}

       {...otherProps}

     >

       <span className="specularShine" aria-hidden="true" />

       <span className="specularContent">{children}</span>

     </Component>

   );

 }

 /* =========================================

   ORIGINAL MEMOJI

 ========================================= */

 const MEMOJI = {

   neutral: "/memoji/neutral.png",

   smile: "/memoji/smile.png",

   wink: "/memoji/wink.png",

   wave: "/memoji/wave.png"

 };

 function AvatarWidget({ expression, waving }) {

   return (

     <div className={`realMemoji ${waving ? "isWaving" : ""}`}>

       <img

         src={MEMOJI[expression] || MEMOJI.neutral}

         alt="Shwetha's original Memoji"

         draggable="false"

       />

     </div>

   );

 }

 /* =========================================

   ASSISTANT FALLBACK

 ========================================= */

 function fallbackAnswer(question) {

   const q = question.toLowerCase();

   if (/project|research|built|portfolio/.test(q)) {

     return (

       "Shwetha's featured projects include " +

       PROFILE.projects.map(p => p.name).join(", ") +

       ". You can explore them in the Projects section."

     );

   }

   if (/skill|technolog|programming|stack|language/.test(q)) {

     return (

       "Shwetha's showcased technical skills include " +

       PROFILE.skills.join(", ") +

       ". Visit the Skills section for more details."

     );

   }

   if (/experience|intern|job|work|teaching/.test(q)) {

     return (

       "Shwetha has experience as a Website Developer Intern " +

       "at Rutgers Democracy Lab, a Software Methodology " +

       "TA/Grader at Rutgers, and a Computer Science Trainer."

     );

   }

   if (/education|university|degree|rutgers|college/.test(q)) {

     return (

       "Shwetha is pursuing an MS in Computer Science " +

       "at Rutgers University, with expected graduation " +

       "in December 2026."

     );

   }

   if (/contact|email|hire|reach|connect/.test(q)) {

     return (

       "You can contact Shwetha using the professional " +

       "links in the Contact section."

     );

   }

   return (

     "I'm Shwe's Personal Assistant. Ask me about " +

     "her projects, skills, education, or experience."

   );

 }

 function cleanText(value) {

   return String(value || "")

     .replace(/\*\*(.*?)\*\*/g, "$1")

     .replace(/__(.*?)__/g, "$1")

     .replace(/^\s*#{1,6}\s+/gm, "")

     .replace(/^\s*[-*]\s+/gm, "")

     .trim();

 }

 // Skills Explorer: independent of the decorative Logo Loop above.

 // Colored SVG logos are supplied by Devicon; everything else stays local.

 const SKILL_ICON_ROOT = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

 const SKILL_CATEGORIES = [

   "All", "Languages", "Frontend", "Backend", "AI & ML", "Cloud & DevOps", "Databases", "Data Tools"

 ];

 const EXPLORE_SKILLS = [

   { name: "Python", group: "Languages", icon: "python/python-original.svg" },

   { name: "Java", group: "Languages", icon: "java/java-original.svg" },

   { name: "C++", group: "Languages", icon: "cplusplus/cplusplus-original.svg" },

   { name: "JavaScript", group: "Languages", icon: "javascript/javascript-original.svg" },

   { name: "SQL", group: "Languages", icon: null, badge: "SQL" },

   { name: "C", group: "Languages", icon: "c/c-original.svg" },

   { name: "TypeScript", group: "Languages", icon: "typescript/typescript-original.svg" },

   { name: "React", group: "Frontend", icon: "react/react-original.svg" },

   { name: "HTML5", group: "Frontend", icon: "html5/html5-original.svg" },

   { name: "CSS3", group: "Frontend", icon: "css3/css3-original.svg" },

   { name: "Three.js", group: "Frontend", icon: "threejs/threejs-original.svg" },

   { name: "REST APIs", group: "Backend", icon: null, badge: "API" },

   { name: "Spring Boot", group: "Backend", icon: "spring/spring-original.svg" },

   { name: "Node.js", group: "Backend", icon: "nodejs/nodejs-original.svg" },

   { name: "Docker", group: "Cloud & DevOps", icon: "docker/docker-original.svg" },

   { name: "Kubernetes", group: "Cloud & DevOps", icon: "kubernetes/kubernetes-original.svg" },

   { name: "AWS", group: "Cloud & DevOps", icon: "amazonwebservices/amazonwebservices-original-wordmark.svg" },

   { name: "GCP", group: "Cloud & DevOps", icon: "googlecloud/googlecloud-original.svg" },

   { name: "Git", group: "Cloud & DevOps", icon: "git/git-original.svg" },

   { name: "PostgreSQL", group: "Databases", icon: "postgresql/postgresql-original.svg" },

   { name: "MySQL", group: "Databases", icon: "mysql/mysql-original.svg" },

   { name: "MongoDB", group: "Databases", icon: "mongodb/mongodb-original.svg" },

   { name: "Cassandra", group: "Databases", icon: "cassandra/cassandra-original.svg" },

   { name: "Pandas", group: "Data Tools", icon: "pandas/pandas-original.svg" },

   { name: "NumPy", group: "Data Tools", icon: "numpy/numpy-original.svg" },

   { name: "TensorFlow", group: "AI & ML", icon: "tensorflow/tensorflow-original.svg" },

   { name: "PyTorch", group: "AI & ML", icon: "pytorch/pytorch-original.svg" },

   { name: "Scikit-Learn", group: "AI & ML", icon: "scikitlearn/scikitlearn-original.svg" },

   { name: "Keras", group: "AI & ML", icon: "keras/keras-original.svg" },

   { name: "OpenCV", group: "AI & ML", icon: "opencv/opencv-original.svg" }

 ];

 // React Bits Animated List interaction: scroll-based scale/fade, gliding

 // selection highlight, keyboard navigation, and gradient fades.

 function AnimatedSkillItem({ skill, index, selected, onSelect }) {

   const itemRef = useRef(null);

   const visible = useInView(itemRef, { amount: 0.5, once: false });

   return (

     <motion.div

       ref={itemRef}

       data-skill-index={index}

       className="rbSkillItem"

       initial={{ opacity: 0, scale: 0.7 }}

       animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}

       transition={{ duration: 0.2, delay: 0.1 }}

     >

       <button

         type="button"

         className={`rbSkillRow ${selected ? "isSelected" : ""}`}

         onMouseEnter={onSelect}

         onFocus={onSelect}

         onClick={onSelect}

         aria-label={`${skill.name} — ${skill.group}`}

         aria-pressed={selected}

       >

         {selected && (

           <motion.span

             layoutId="rbSkillSelection"

             className="rbSkillSelection"

             transition={{ type: "spring", stiffness: 360, damping: 31 }}

             aria-hidden="true"

           />

         )}

         <span className="rbSkillLogo" aria-hidden="true">

           {skill.icon ? (

             <img src={`${SKILL_ICON_ROOT}/${skill.icon}`} alt="" loading="lazy" />

           ) : (

             <span className="skillTileTextIcon">{skill.badge}</span>

           )}

         </span>

         <span className="rbSkillText">

           <strong>{skill.name}</strong>

           <small>{skill.group}</small>

         </span>

       </button>

     </motion.div>

   );

 }

 function AnimatedSkillsList({ skills, category }) {

   const scrollRef = useRef(null);

   const [selectedIndex, setSelectedIndex] = useState(-1);

   const [keyboardNav, setKeyboardNav] = useState(false);

   const [fadeTop, setFadeTop] = useState(0);

   const [fadeBottom, setFadeBottom] = useState(1);

   const updateFades = () => {

     const el = scrollRef.current;

     if (!el) return;

     setFadeTop(Math.min(1, el.scrollTop / 30));

     setFadeBottom(Math.min(1, (el.scrollHeight - el.clientHeight - el.scrollTop) / 30));

   };

   useEffect(() => {

     const frame = requestAnimationFrame(updateFades);

     return () => cancelAnimationFrame(frame);

   }, [skills.length]);

   useEffect(() => {

     if (!keyboardNav || selectedIndex < 0) return;

     const item = scrollRef.current?.querySelector(`[data-skill-index="${selectedIndex}"]`);

     item?.scrollIntoView({ behavior: "smooth", block: "nearest" });

     setKeyboardNav(false);

   }, [selectedIndex, keyboardNav]);

   const handleKeyDown = (event) => {

     if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

     event.preventDefault();

     setKeyboardNav(true);

     setSelectedIndex(index => {

       if (event.key === "ArrowDown") return Math.min(skills.length - 1, index + 1);

       return Math.max(0, index - 1);

     });

   };

   return (

     <div className="rbSkillsWrap" role="region" aria-label={`${category} skills animated list`}>

       <div

         className="rbSkillsScroll"

         ref={scrollRef}

         tabIndex={0}

         onKeyDown={handleKeyDown}

         onScroll={updateFades}

         aria-label="Browse skills using scroll or arrow keys"

       >

         <AnimatePresence mode="popLayout" initial={false}>

           {skills.map((skill, index) => (

             <AnimatedSkillItem

               key={skill.name}

               skill={skill}

               index={index}

               selected={selectedIndex === index}

               onSelect={() => setSelectedIndex(index)}

             />

           ))}

         </AnimatePresence>

       </div>

       <span className="rbSkillFade rbSkillFadeTop" style={{ opacity: fadeTop }} aria-hidden="true" />

       <span className="rbSkillFade rbSkillFadeBottom" style={{ opacity: fadeBottom }} aria-hidden="true" />

     </div>

   );

 }

 function App() {

   const [chatOpen, setChatOpen] = useState(false);

   const [mobileMenu, setMobileMenu] = useState(false);

   const [navCompact, setNavCompact] = useState(false);

   const [navActiveIndex, setNavActiveIndex] = useState(-1);

   const [activeSkillCategory, setActiveSkillCategory] = useState("All");

   const NAV_ITEMS = [

     { label: "About", href: "#about" },

     { label: "Skills", href: "#expertise" },

     { label: "Experience", href: "#experience" },

     { label: "Education", href: "#education" },

     { label: "Projects", href: "#projects" },

     { label: "Contact", href: "#contact" }

   ];

   const [expression, setExpression] = useState("neutral");

   const [waving, setWaving] = useState(false);

   const [introPlaying, setIntroPlaying] = useState(false);

   const [muted, setMuted] = useState(false);

   const [busy, setBusy] = useState(false);

   const [notice, setNotice] = useState("");

   const [draft, setDraft] = useState("");

   const [messages, setMessages] = useState([

     {

       role: "assistant",

       text:

         "Hey there! I'm Shwe's Personal Assistant. " +

         "Ask me about her projects, skills, or experience!"

     }

   ]);

   useEffect(() => {

     const ids = ["about", "expertise", "experience", "education", "projects", "contact"];

     let ticking = false;

     const updateNavigation = () => {

       setNavCompact(window.scrollY > 70);

       const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 220);

       let selected = -1;

       ids.forEach((id, index) => {

         const element = document.getElementById(id);

         if (element && element.getBoundingClientRect().top + window.scrollY <= marker) selected = index;

       });

       setNavActiveIndex(selected < 0 ? -1 : NAV_ITEMS.findIndex(item => item.href === `#${ids[selected]}`));

       ticking = false;

     };

     const onScroll = () => {

       if (!ticking) {

         ticking = true;

         window.requestAnimationFrame(updateNavigation);

       }

     };

     updateNavigation();

     window.addEventListener("scroll", onScroll, { passive: true });

     window.addEventListener("resize", onScroll);

     return () => {

       window.removeEventListener("scroll", onScroll);

       window.removeEventListener("resize", onScroll);

     };

   }, []);

   const waveTimerRef = useRef(null);

   const idleTimerRef = useRef(null);

   const reactionTimerRef = useRef(null);

   const chatEndRef = useRef(null);

   const requestRef = useRef(null);

   const busyRef = useRef(false);

   const speechSessionRef = useRef(0);

   const introActiveRef = useRef(false);

   /* CHAT AUTO-SCROLL */

   useEffect(() => {

     if (chatOpen) {

       chatEndRef.current?.scrollIntoView({

         behavior: "smooth",

         block: "nearest"

       });

     }

   }, [chatOpen, messages, busy]);

   /* MEMOJI — WAVE ONCE, THEN IDLE REACTIONS */

   useEffect(() => {

     const reducedMotion = window.matchMedia(

       "(prefers-reduced-motion: reduce)"

     ).matches;

     if (!reducedMotion) {

       setExpression("wave");

       setWaving(true);

       waveTimerRef.current = setTimeout(() => {

         setWaving(false);

         setExpression("neutral");

       }, 1600);

       let nextWink = false;

       idleTimerRef.current = setInterval(() => {

         if (introActiveRef.current) return;

         nextWink = !nextWink;

         setExpression(nextWink ? "wink" : "smile");

         clearTimeout(reactionTimerRef.current);

         reactionTimerRef.current = setTimeout(() => {

           setExpression("neutral");

         }, 1300);

       }, 11000);

     }

     return () => {

       clearTimeout(waveTimerRef.current);

       clearInterval(idleTimerRef.current);

       clearTimeout(reactionTimerRef.current);

     };

   }, []);

   /* CLEANUP */

   useEffect(() => {

     return () => {

       requestRef.current?.abort();

       if ("speechSynthesis" in window) {

         window.speechSynthesis.cancel();

       }

     };

   }, []);

   /* BROWSER VOICE */

   function stopAudio() {

     speechSessionRef.current += 1;

     introActiveRef.current = false;

     if ("speechSynthesis" in window) {

       window.speechSynthesis.cancel();

     }

     setIntroPlaying(false);

     setExpression("neutral");

   }

   function speakIntroduction() {

     if (introActiveRef.current) {

       stopAudio();

       return;

     }

     if (muted) {

       setNotice("Unmute to hear the introduction.");

       return;

     }

     if (!("speechSynthesis" in window)) {

       setNotice("Speech is not supported by this browser.");

       return;

     }

     stopAudio();

     setNotice("");

     clearTimeout(reactionTimerRef.current);

     introActiveRef.current = true;

     setExpression("neutral");

     const sessionId = speechSessionRef.current;

     const utterance = new SpeechSynthesisUtterance(

       INTRO.script

     );

     utterance.lang = "en-US";

     utterance.rate = 0.94;

     utterance.pitch = 1.03;

     utterance.volume = 1;

     const voices = window.speechSynthesis.getVoices();

     const selectedVoice =

       voices.find(

         voice =>

           voice.lang.startsWith("en") &&

           /female|zira|aria|jenny|samantha/i.test(

             voice.name

           )

       ) ||

       voices.find(voice => voice.lang.startsWith("en"));

     if (selectedVoice) utterance.voice = selectedVoice;

     utterance.onstart = () => {

       if (sessionId !== speechSessionRef.current) return;

       setIntroPlaying(true);

     };

     utterance.onend = () => {

       if (sessionId !== speechSessionRef.current) return;

       introActiveRef.current = false;

       setIntroPlaying(false);

       setExpression("neutral");

     };

     utterance.onerror = event => {

       if (sessionId !== speechSessionRef.current) return;

       introActiveRef.current = false;

       setIntroPlaying(false);

       setExpression("neutral");

       if (

         event.error !== "canceled" &&

         event.error !== "interrupted"

       ) {

         setNotice("The introduction voice could not play.");

       }

     };

     window.speechSynthesis.speak(utterance);

   }

   /* GEMINI CHAT */

   async function sendMessage(text = draft) {

     const question = String(text).trim();

     if (!question || busyRef.current) return;

     busyRef.current = true;

     setBusy(true);

     setDraft("");

     const history = [

       ...messages,

       { role: "user", text: question }

     ];

     setMessages(history);

     const controller = new AbortController();

     requestRef.current = controller;

     const timeout = setTimeout(() => controller.abort(), 25000);

     let answer;

     try {

       const response = await fetch("/api/chat", {

         method: "POST",

         headers: {

           "Content-Type": "application/json"

         },

         body: JSON.stringify({ messages: history }),

         signal: controller.signal

       });

       if (!response.ok) {

         throw new Error(`Gemini HTTP ${response.status}`);

       }

       const data = await response.json();

       if (

         typeof data.reply !== "string" ||

         !data.reply.trim()

       ) {

         throw new Error("Gemini returned an empty reply.");

       }

       answer = cleanText(data.reply);

       setNotice("");

     } catch (error) {

       console.error("Personal Assistant:", error);

       answer = fallbackAnswer(question);

       setNotice(

         error.name === "AbortError"

           ? "Gemini took too long. Showing a basic answer."

           : "Gemini is unavailable. Showing a basic answer."

       );

     } finally {

       clearTimeout(timeout);

       requestRef.current = null;

       busyRef.current = false;

       setBusy(false);

     }

     setMessages(previous => [

       ...previous,

       { role: "assistant", text: answer }

     ]);

   }

   function openChat() {

     setChatOpen(true);

   }

   function toggleMute() {

     if (!muted) stopAudio();

     setMuted(value => !value);

   }

   return (

     <div className="site">

       {/* GALAXY */}

       <div className="cosmicHaze" aria-hidden="true" />

       <div className="cosmicCloud cloudOne" aria-hidden="true" />

       <div className="cosmicCloud cloudTwo" aria-hidden="true" />

       <div className="cosmicCloud cloudThree" aria-hidden="true" />

       <GalaxyBackground />

       {/* NAVIGATION */}

         <header className={`navShell ${navCompact ? "navCompact" : ""}`}>

           <a className="navMonogram" href="#home" aria-label="SBM — return to top" onClick={() => setMobileMenu(false)}>

               <img

                 src="/sbm-lunar.png"

                 alt="SBM Lunar Elegance logo"

                 width="74"

                 height="42"

                 style={{ display: "block", width: "74px", height: "42px", objectFit: "contain" }}

               />

             </a>

           <div className={`navGooeyWrap navPillWrap ${mobileMenu ? "open" : ""}`}>

             <PillNav

               items={NAV_ITEMS}

               initialActiveIndex={-1}

               activeIndex={navActiveIndex}

               onChange={(index) => { setNavActiveIndex(index); setMobileMenu(false); }}

               theme="dark"

               size="md"

               frame={false}

               color="#bc9bfc"

               activeTextColor="#180d2b"

             />

           </div>

           <div className="navActions">

             <a className="navGithub" href={PROFILE.github || "https://github.com/Shwethabathina"

 } target="_blank" rel="noopener noreferrer"

                 onPointerMove={event => {

                   const rect = event.currentTarget.getBoundingClientRect();

                   event.currentTarget.style.setProperty('--specular-x', `${event.clientX - rect.left}px`);

                   event.currentTarget.style.setProperty('--specular-y', `${event.clientY - rect.top}px`);

                 }}>

               <Github size={18} /> GitHub <ArrowUpRight size={14} />

             </a>

             <button className="menuBtn" type="button" onClick={() => setMobileMenu(v => !v)}

               aria-label="Toggle navigation" aria-expanded={mobileMenu}>

               {mobileMenu ? <X size={22} /> : <Menu size={22} />}

             </button>

           </div>

         </header>

       <main>

         {/* HERO */}

         <section className="hero" id="home">

           <div className="heroContent">

             {/* ORIGINAL MEMOJI */}

             <div className="heroPortraitColumn">

             <ElectricMemojiBorder>

               <div className="heroMemojiContainer">

                 <button

                   className="heroMemojiButton"

                   type="button"

                   onClick={openChat}

                   aria-label="Open Shwe's Personal Assistant"

                 >

                   <AvatarWidget expression={expression} waving={waving} />

                 </button>

               </div>

             </ElectricMemojiBorder>

             <a className="memojiScrollCue" href="#about" aria-label="Scroll to About section">

               <span>Scroll to explore</span>

               <span className="scrollMouse" aria-hidden="true"><i /></span>

             </a>

             </div>

             {/* ANIMATED TEXT */}

             <div className="heroText">

               <h1 className="heroName">

                 <MaskedName

                   text="Hi, I am Shweatha Bathina Mallikarjuna."

                 />

               </h1>

               <h2 className="heroWelcome">

                 <AnimatedGradientText>

                   Welcome to my portfolio.

                 </AnimatedGradientText>

               </h2>

               <p className="heroRole">

                 Computer Science Graduate Student

                 <span className="roleDot">✦</span>

                 AI & Software Engineering

               </p>

               <p className="heroQuote">

                 Turning curiosity into what's next. <span aria-hidden="true" className="quoteSpark"></span>

               </p>

               <div className="heroButtons">

                 <SpecularButton onClick={speakIntroduction}>

                   <Volume2 size={18} />

                   {introPlaying

                     ? "Stop introduction"

                     : "Meet Shwetha"}

                 </SpecularButton>

                 <SpecularButton variant="outline" className="assistantHeroButton" onClick={openChat}>

                   <MessageCircle size={18} />

                   Ask Shwe's Assistant

                 </SpecularButton>

               </div>

               {notice && (

                 <p className="statusNotice" role="status">

                   {notice}

                 </p>

               )}

             </div>

           </div>

         </section>

         {/* ABOUT */}

         <section className="section about aboutShowcase" id="about">

           <div className="aboutIntroTop aboutHeaderRow">

             <div className="aboutPortraitFrame">

               <img

                 src="/about-portrait.jpeg"

                 alt="Portrait of Shweatha Bathina Mallikarjuna"

                 className="aboutPortrait"

                 loading="lazy"

               />

             </div>

             <div className="aboutShowcaseHead">

               <ScrollMaskedAboutHeading />

             </div>

           </div>

           <div className="aboutShowcaseGrid">

             <div className="aboutNarrative">

               <h3 className="aboutStatement">

                 AI &amp; Software Engineer | Building Intelligent Systems &amp; Real-World Solutions

               </h3>

               <p className="aboutLead">

                 I'm a Computer Science graduate student at Rutgers University, passionate about developing intelligent software that addresses real-world challenges.

               </p>

               <p>

                 I enjoy breaking down complex ideas and transforming them into practical, well-engineered solutions. My experience spans full-stack development, AI-powered applications, and machine learning, with interests in agentic AI, computer vision, and cybersecurity.

               </p>

               <p>

                 What drives me is understanding how technology works beneath the surface—from designing system architectures and developing AI workflows to creating intuitive user experiences. I'm particularly interested in combining the capabilities of artificial intelligence with the reliability and scalability of strong software engineering.

               </p>

               <p>

                 I'm always eager to tackle new challenges, explore emerging technologies, and turn what I learn into applications that make a meaningful difference.

               </p>

               <div className="aboutActions">

                 <SpecularButton href="#contact" className="aboutPrimaryButton">

                     Get in touch

                   </SpecularButton>

                   <SpecularButton

                     href="/resume.pdf"

                     download="Shweatha_Bathina_Mallikarjuna_CV.pdf"

                     variant="outline"

                     className="aboutResumeButton"

                   >

                     <Download size={17} /> Download CV

                   </SpecularButton>

               </div>

             </div>

             <div className="aboutExpertiseGrid" aria-label="Areas of expertise">

               <AboutMagicBento enableTilt enableStars enableMagnetism>

               <BorderGlow className="aboutExpertiseCard" glowColor="268 88 76" colors={['#9e80fa','#d5b9ff','#6d75df']}>

                 <Code2 className="aboutExpertiseIcon" size={31} strokeWidth={1.6} />

                 <h3>Software &amp; Web Development</h3>

                 <p>Engineering responsive, scalable web applications with modern frameworks, APIs, and databases, prioritizing performance, accessibility, and maintainable code.</p>

               </BorderGlow>

               </AboutMagicBento>

               <AboutMagicBento enableTilt enableStars enableMagnetism>

               <BorderGlow className="aboutExpertiseCard" glowColor="285 88 78" colors={['#b782fa','#e9b7fb','#7584fa']}>

                 <BrainCircuit className="aboutExpertiseIcon" size={31} strokeWidth={1.6} />

                 <h3>AI Engineering &amp; Intelligent Systems</h3>

                 <p>Developing AI-powered applications with LLMs, retrieval-augmented generation, and agentic workflows that transform complex information into actionable insights.</p>

               </BorderGlow>

               </AboutMagicBento>

               <AboutMagicBento enableTilt enableStars enableMagnetism>

               <BorderGlow className="aboutExpertiseCard" glowColor="253 84 76" colors={['#9480ed','#bdaaff','#678ec6']}>

                 <Workflow className="aboutExpertiseIcon" size={31} strokeWidth={1.6} />

                 <h3>Machine Learning &amp; Automation</h3>

                 <p>Applying machine learning and computer vision to identify patterns, automate repetitive processes, and deliver practical, data-driven solutions.</p>

               </BorderGlow>

               </AboutMagicBento>

               <AboutMagicBento enableTilt enableStars enableMagnetism>

               <BorderGlow className="aboutExpertiseCard" glowColor="296 86 77" colors={['#c28df4','#f1c6fa','#9078e4']}>

                 <ShieldCheck className="aboutExpertiseIcon" size={31} strokeWidth={1.6} />

                 <h3>Cybersecurity &amp; Secure Systems</h3>

                 <p>Exploring AI-driven security techniques, including neuro-fuzzy phishing detection, to identify threats and develop security-focused applications.</p>

               </BorderGlow>

               </AboutMagicBento>

             </div>

           </div>

         </section>

         {/* SKILLS */}

         <section className="section skills" id="expertise">

           <div className="sectionLabel">

           </div>

           <h2 className="skillsHeadline"><MaskedName text="My Tech Stack." /></h2>

           <LogoLoop />

           <div className="skillsExplorer">

             <div className="skillsExplorerHeader">

               <h3>Explore My Skills</h3>

             </div>

             <div className="skillFilterBar" role="group" aria-label="Filter skills by category">

               <PillNav

                 className="skillsPillNav"

                 ariaLabel="Explore skills categories"

                 items={SKILL_CATEGORIES.map(category => ({ label: category }))}

                 activeIndex={SKILL_CATEGORIES.indexOf(activeSkillCategory)}

                 onChange={(index) => setActiveSkillCategory(SKILL_CATEGORIES[index])}

               />

             </div>

             <AnimatedSkillsList

               key={activeSkillCategory}

               category={activeSkillCategory}

               skills={EXPLORE_SKILLS.filter(skill =>

                 activeSkillCategory === "All" || skill.group === activeSkillCategory

               )}

             />

           </div>

         </section>

         {/* EXPERIENCE — Magic Bento timeline */}

         <section className="section experienceSection" id="experience">

           <h2 className="extraSectionTitle experienceMaskedHeading"><MaskedName text="Experience" /></h2>

           <ExperienceMagicBento gap={13} rowHeight={215} enableTilt enableStars enableMagnetism />

         </section>

         {/* EDUCATION — transcript-grounded academic timeline */}

         <EducationTimeline heading={<MaskedName text="Education" />} />

         {/* PROJECTS & PUBLICATIONS — interactive Chroma showcase */}

         <ProjectsSection heading={<MaskedName text="Projects" />} />

         {/* CONTACT — final section */}

         <ContactSection

           github={PROFILE.github}

           linkedin={PROFILE.linkedin}

         />

       </main>

       <footer>

         <span>

           © {new Date().getFullYear()} {PROFILE.name}.

           Made with imagination.

         </span>

       </footer>

       {/* BACKGROUND MUSIC */}

      <MusicPlayer />

      {/* GEMINI ASSISTANT */}

       <div className="buddyDock">

         <div

           className={`buddyPopover ${chatOpen ? "show" : ""}`}

           role="dialog"

           aria-label="Shwe's Personal Assistant"

           aria-hidden={!chatOpen}

         >

           <div className="chatHeader">

             <div className="chatAvatar">✦</div>

             <div>

               <strong>Shwe's Personal Assistant</strong>

               <span>

                 <i /> AI PORTFOLIO GUIDE

               </span>

             </div>

             <button

               className="iconButton"

               type="button"

               onClick={() => setChatOpen(false)}

               aria-label="Close chat"

             >

               <X size={18} />

             </button>

           </div>

           <div className="chatMessages">

             {messages.map((message, i) => (

               <div

                 key={i}

                 className={`bubble ${message.role}`}

               >

                 {message.text}

               </div>

             ))}

             {busy && (

               <div className="bubble assistant loadingBubble">

                 <LoaderCircle size={16} />

                 Thinking...

               </div>

             )}

             <div ref={chatEndRef} />

           </div>

           <div className="quickReplies">

             {[

               "Tell me about Shwe",

               "What projects?",

               "What skills?"

             ].map(question => (

               <button

                 key={question}

                 type="button"

                 disabled={busy}

                 onClick={() => sendMessage(question)}

               >

                 {question}

               </button>

             ))}

           </div>

           <form

             className="chatForm"

             onSubmit={event => {

               event.preventDefault();

               sendMessage();

             }}

           >

             <input

               value={draft}

               onChange={event => setDraft(event.target.value)}

               placeholder="Ask me anything..."

               aria-label="Ask Shwe's Personal Assistant"

             />

             <button

               type="submit"

               disabled={busy}

               aria-label="Send message"

             >

               <Send size={17} />

             </button>

           </form>

         </div>

         <div className="buddyRow">

           <span className="assistantTinyLabel">

             Hi, I'm Shweatha's Personal Assistant

           </span>

           <button

             className="chatLaunchButton"

             type="button"

             onClick={() => setChatOpen(value => !value)}

             aria-label={chatOpen ? "Close Shwe's Assistant" : "Open Shwe's Assistant"}

             aria-expanded={chatOpen}

             title="Ask Shweatha's Personal Assistant"

           >

             <Snowflake size={30} strokeWidth={1.8} />

           </button>

         </div>

       </div>

     </div>

   );

 }

 createRoot(document.getElementById("root")).render(<App />);


import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import "./ContactSection.css";

/* =========================================
   CONTACT INFORMATION
========================================= */

const EMAIL = "sb2808@scarletmail.rutgers.edu";
const PHONE = "+16093757916";

const LINKEDIN =
  "https://www.linkedin.com/in/shweatha-bathina-6a796b266/";

const INSTAGRAM =
  "https://www.instagram.com/shweta_arjunn/?hl=en";

const GITHUB =
  "https://github.com/Shwethabathina";

/* =========================================
   MASKED CONTACT HEADING
========================================= */

function MaskedContactHeading() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const words = ["Let's", "Connect"];

  return (
    <h2
      ref={ref}
      className="contactNewHeading"
      aria-label="Let's Connect"
    >
      {visible ? (
        <span className="maskedName" aria-hidden="true">
          {words.map((word, index) => (
            <React.Fragment key={word}>
              <span className="maskWordWindow">
                <span
                  className="maskWordReveal"
                  style={{
                    animationDelay: `${0.12 + index * 0.16}s`,
                  }}
                >
                  <span className="maskWordTexture">
                    {word}
                  </span>
                </span>
              </span>

              {index < words.length - 1 ? " " : null}
            </React.Fragment>
          ))}
        </span>
      ) : (
        <span
          aria-hidden="true"
          style={{ visibility: "hidden" }}
        >
          Let's Connect
        </span>
      )}
    </h2>
  );
}

/* =========================================
   CONTACT SECTION
========================================= */

export default function ContactSection() {
  const spotlightRef = useRef(null);
  const [magicStars, setMagicStars] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [submitError, setSubmitError] = useState(false);

  /* Full Magic Bento effect on the existing message form card. */
  function handleSpotlight(event) {
    const card = spotlightRef.current;
    if (!card || event.pointerType === "touch") return;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const nx = (x / rect.width - 0.5) * 2;
    const ny = (y / rect.height - 0.5) * 2;
    card.style.setProperty("--contact-x", `${x}px`);
    card.style.setProperty("--contact-y", `${y}px`);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      card.style.setProperty("--contact-rotate-x", `${-ny * 5}deg`);
      card.style.setProperty("--contact-rotate-y", `${nx * 5}deg`);
      card.style.setProperty("--contact-move-x", `${nx * 5}px`);
      card.style.setProperty("--contact-move-y", `${ny * 5}px`);
    }
  }

  function startMagic(event) {
    if (event.pointerType === "touch" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMagicStars(Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: ((i * 67 + 17) % 91) + 4,
      y: ((i * 43 + 11) % 84) + 8,
      delay: (i * 0.13) % 1.5,
      duration: 1.9 + (i % 5) * 0.37,
      size: 2 + (i % 3),
    })));
  }

  function resetSpotlight() {
    setMagicStars([]);
    const card = spotlightRef.current;
    if (!card) return;
    ["--contact-rotate-x", "--contact-rotate-y",
      "--contact-move-x", "--contact-move-y"].forEach(key => {
      card.style.removeProperty(key);
    });
  }

  /* Copy email */

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  /* Submit portfolio inquiries to the configured Formspree form. */
  async function sendMessage(event) {
    event.preventDefault();
    if (sending) return;

    const name = form.name.trim();
    const from = form.email.trim();
    const message = form.message.trim();
    if (!name || !from || !message) return;

    setSending(true);
    setSubmitError(false);
    setSubmitStatus("");

    try {
      const response = await fetch("https://formspree.io/f/xrppaljo", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams({
          name,
          email: from,
          message,
          _subject: `Portfolio inquiry from ${name}`,
        }),
      });

      // Formspree returns a successful HTTP status when it accepts a submission.
      if (!response.ok) {
        let details = "";
        try {
          const result = await response.json();
          details = Array.isArray(result?.errors)
            ? result.errors.map((item) => item.message).filter(Boolean).join(" ")
            : String(result?.error || result?.message || "").trim();
        } catch {
          // Preserve a useful fallback when an error response is not JSON.
        }
        throw new Error(details || "The message could not be submitted. Please try again.");
      }

      setForm({ name: "", email: "", message: "" });
      setSubmitStatus("Message sent successfully! Thanks for reaching out.");
    } catch (error) {
      console.error("Contact form submission:", error);
      setSubmitError(true);
      setSubmitStatus(
        error instanceof TypeError
          ? "Unable to connect to the email service. Please try again later."
          : error.message || "Message could not be sent. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      id="contact"
      className="contactNewSection"
      aria-label="Let's Connect"
    >
      {/* =====================================
          MAIN HEADING
      ===================================== */}

      <div className="contactNewIntro">
        <MaskedContactHeading />

        <p>
          Have an opportunity, project, or idea? I'd love
          to connect and build something meaningful.
        </p>
      </div>

      <div className="contactNewGrid">
        {/* =====================================
            LEFT — CONTACT DETAILS
        ===================================== */}

        <div className="contactNewDetails">
          <span className="contactNewEyebrow">
            CONTACT DETAILS
          </span>

          <h3>Reach Out</h3>

          <p className="contactNewLead">
            I'm open to software engineering and AI
            opportunities, collaborations, and interesting
            conversations.
          </p>

          <div className="contactNewItems">
            {/* EMAIL */}

            <div className="contactNewItem">
              <span className="contactNewItemIcon">
                <Mail size={26} strokeWidth={1.9} />
              </span>

              <div className="contactNewItemText">
                <strong>Email</strong>

                <a href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
              </div>

              <button
                type="button"
                className="contactNewCopy"
                onClick={copyEmail}
                aria-label="Copy email address"
                title={copied ? "Copied!" : "Copy email"}
              >
                {copied ? (
                  <Check size={18} />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>

            {/* PHONE */}

            <div className="contactNewItem">
              <span className="contactNewItemIcon">
                <Phone size={26} strokeWidth={1.9} />
              </span>

              <div className="contactNewItemText">
                <strong>Phone</strong>

                <a href={`tel:${PHONE}`}>
                  +1 (609) 375-7916
                </a>
              </div>
            </div>

            {/* LOCATION */}

            <div className="contactNewItem">
              <span className="contactNewItemIcon">
                <MapPin size={27} strokeWidth={1.9} />
              </span>

              <div className="contactNewItemText">
                <strong>Location</strong>
                <span>New Jersey, USA</span>
              </div>
            </div>
          </div>

          {/* =====================================
              SOCIAL MEDIA — ALWAYS VISIBLE
          ===================================== */}

          <div className="contactNewSocials">
            <strong>Connect With Me</strong>

            <div className="contactNewSocialIcons">
              {/* LINKEDIN */}

              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                title="LinkedIn"
                className="contactSocialLinkedin"
              >
                <Linkedin size={27} strokeWidth={2} />
              </a>

              {/* INSTAGRAM */}

              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @shweta_arjunn"
                title="Instagram @shweta_arjunn"
                className="contactSocialInstagram"
              >
                <Instagram size={27} strokeWidth={2} />
              </a>

              {/* GITHUB */}

              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                title="GitHub"
                className="contactSocialGithub"
              >
                <Github size={27} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>

        {/* =====================================
            RIGHT — MESSAGE FORM
        ===================================== */}

        <div
          ref={spotlightRef}
          onPointerMove={handleSpotlight}
          onPointerEnter={startMagic}
          onPointerLeave={resetSpotlight}
          className="contactNewFormCard contactMagicBento"
        >
          <div className="contactMagicStars" aria-hidden="true">
            {magicStars.map(star => (
              <span key={star.id} style={{
                left: `${star.x}%`, top: `${star.y}%`,
                width: star.size, height: star.size,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }} />
            ))}
          </div>
          <div className="contactNewFormContent">
            <h3>Send a Message</h3>

            <form
              onSubmit={sendMessage}
              className="contactNewForm"
            >
              {/* NAME */}

              <label htmlFor="contact-name">
                Your Name
              </label>

              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                required
                maxLength={100}
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />

              {/* EMAIL */}

              <label htmlFor="contact-email">
                Your Email
              </label>

              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                maxLength={254}
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />

              {/* MESSAGE */}

              <label htmlFor="contact-message">
                Your Message
              </label>

              <textarea
                id="contact-message"
                rows={5}
                placeholder="Hi, I'd love to talk about..."
                required
                maxLength={4000}
                value={form.message}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    message: event.target.value,
                  }))
                }
              />

              {/* SEND BUTTON */}

              <button
                type="submit"
                className="contactNewSubmit"
                disabled={sending}
                aria-busy={sending}
              >
                {sending ? "Sending..." : "Send"} <Send size={18} />
              </button>
              {submitStatus && (
                <p
                  role={submitError ? "alert" : "status"}
                  aria-live="polite"
                  className={`contactSubmitFeedback ${submitError ? "isError" : "isSuccess"}`}
                >
                  {submitStatus}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

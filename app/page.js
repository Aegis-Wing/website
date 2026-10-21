"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const navItems = ["Services", "Method", "Reports", "Contact"];

export default function Home() {
  const [navVisible, setNavVisible] = useState(true);
  const previousY = useRef(0);
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const eagleY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 40]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 36 || y < previousY.current - 5) setNavVisible(true);
      else if (y > previousY.current + 5) setNavVisible(false);
      previousY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="page-shell">
      <motion.header
        className="site-header"
        initial={false}
        animate={{ y: navVisible ? 0 : -120 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <a className="brand" href="#top" aria-label="Aegis Wing home">
          <img className="brand-mark" src="/brand-mark.png" alt="" />
          <span className="brand-name">AEGIS WING</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a href={`#${item.toLowerCase()}`} key={item}>
              {item}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#contact">
          Request an Assessment <span aria-hidden="true">↗</span>
        </a>
      </motion.header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-grid" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => <span key={i} />)}
        </div>
        <motion.div
          className="shield-shape"
          aria-hidden="true"
          initial={{ opacity: 0, y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.15 }}
        />
        <motion.img
          className="hero-eagle"
          src="/hero-eagle.png"
          alt=""
          aria-hidden="true"
          style={{ y: eagleY }}
          initial={{ x: 30 }}
          animate={{ x: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="hero-copy">
          <p className="eyebrow"><span /> Independent offensive security · Chennai, India</p>
          <h1 aria-label="We break in so they can’t.">
            <span className="headline-line">We <em>break</em> in</span>
            <span className="headline-line">so they</span>
            <span className="headline-line">can’t.</span>
          </h1>
          <p className="hero-description">
            Penetration testing, offensive security and compliance readiness for companies that would rather find the holes themselves.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#contact">Request an assessment <span aria-hidden="true">→</span></a>
            <a className="text-action" href="#method">See our method <span aria-hidden="true">↓</span></a>
          </div>
        </div>

        <div className="hero-caption"><span className="status-dot" /> VAPT · RED TEAM · COMPLIANCE</div>
        <div className="hero-facts" aria-label="Assessment coverage and location">
          <span>WEB · MOBILE · API · NETWORK</span>
          <span>AUTHORIZED TESTING</span>
          <span>CHENNAI, IN</span>
        </div>
      </section>
    </main>
  );
}

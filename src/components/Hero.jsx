import { useState, useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const REPEL_RADIUS   = 140;   // px from letter centre to trigger repulsion
const REPEL_STRENGTH = 60;    // max px a directly-hit letter moves
const RIPPLE_FALLOFF = 0.58;  // neighbour proximity multiplier per step away
const RIPPLE_STEPS   = 4;     // how many neighbours each side to ripple

// Accent gold from CSS var, as RGB so we can lerp
const ACCENT_R = 232, ACCENT_G = 200, ACCENT_B = 122;
const BASE_R   = 240, BASE_G   = 236, BASE_B   = 228;

// Smooth colour lerp  (t = 0..1)
function lerpColor(t) {
  const r = Math.round(BASE_R + (ACCENT_R - BASE_R) * t);
  const g = Math.round(BASE_G + (ACCENT_G - BASE_G) * t);
  const b = Math.round(BASE_B + (ACCENT_B - BASE_B) * t);
  return `rgb(${r},${g},${b})`;
}

// Typewriter hook
const useTypewriter = (text, speed = 80, startDelay = 500) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete]   = useState(false);

  useEffect(() => {
    let timeout;
    let i = 0;
    const type = () => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i++));
        timeout = setTimeout(type, speed);
      } else {
        setIsComplete(true);
      }
    };
    timeout = setTimeout(type, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayText, isComplete };
};

// ─── SINGLE REPELLING LETTER ──────────────────────────────────────────────────
const RepelLetter = ({ char, letterIndex, totalLetters, mouseRef, proximityArr }) => {
  const domRef  = useRef(null);
  const springX = useSpring(0, { stiffness: 160, damping: 18, mass: 0.5 });
  const springY = useSpring(0, { stiffness: 160, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (char === ' ') return;
    let raf;

    const tick = () => {
      const el = domRef.current;
      if (!el) { raf = requestAnimationFrame(tick); return; }

      const { left, top, width, height } = el.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top  + height / 2;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Own raw proximity  0..1
      const ownProx = dist < REPEL_RADIUS && dist > 0
        ? 1 - dist / REPEL_RADIUS
        : 0;

      // Write to shared array
      proximityArr.current[letterIndex] = ownProx;

      // ── Ripple: read neighbours with exponential falloff ──────────────────
      let rippleProx = 0;
      for (let step = 1; step <= RIPPLE_STEPS; step++) {
        const falloff = Math.pow(RIPPLE_FALLOFF, step);
        const li = letterIndex - step;
        const ri = letterIndex + step;
        if (li >= 0)           rippleProx += (proximityArr.current[li] || 0) * falloff;
        if (ri < totalLetters) rippleProx += (proximityArr.current[ri] || 0) * falloff;
      }

      const totalInfluence = Math.min(1, ownProx + rippleProx * 0.35);

      // ── Displacement ──────────────────────────────────────────────────────
      if (ownProx > 0) {
        const force = ownProx * REPEL_STRENGTH;
        springX.set(-(dx / dist) * force);
        springY.set(-(dy / dist) * force);
      } else {
        // Ripple carries a gentile vertical bob
        const bob = rippleProx * 0.35 * REPEL_STRENGTH;
        springX.set(0);
        springY.set(-bob);
      }

      // ── Colour: set directly on DOM — zero React re-renders ──────────────
      if (el) el.style.color = lerpColor(totalInfluence);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [char, letterIndex, totalLetters, mouseRef, proximityArr, springX, springY]);

  if (char === ' ') {
    return <span style={{ display: 'inline-block', minWidth: '0.25em' }}>&nbsp;</span>;
  }

  return (
    <motion.span
      ref={domRef}
      style={{
        display: 'inline-block',
        x: springX,
        y: springY,
        cursor: 'default',
        willChange: 'transform, color',
        transition: 'color 0.08s linear',
      }}
    >
      {char}
    </motion.span>
  );
};

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
const FULL_NAME = 'Tanmay Tyagi';

const Hero = ({ id }) => {
  const { displayText, isComplete } = useTypewriter(FULL_NAME, 80, 500);

  // Shared mouse position ref — updated without re-renders
  const mouseRef    = useRef({ x: -9999, y: -9999 });
  // Shared proximity array for ripple propagation
  const proximityArr = useRef(new Array(FULL_NAME.length).fill(0));

  useEffect(() => {
    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section id={id} style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Vignette */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.8 }}>
        <div style={{
          position: 'absolute', top: '-6%', left: 0, width: '100%', height: '116%',
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.08) 12%, rgba(10,10,10,0.26) 48%, rgba(10,10,10,0.4) 72%, rgba(10,10,10,0.22) 100%)',
          filter: 'blur(6px)',
        }} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', zIndex: 1, pointerEvents: 'none' }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-label"
          style={{ marginBottom: '1.5rem', color: 'var(--color-accent)' }}
        >
          Available for work
        </motion.p>

        <h1
          className="text-hero"
          style={{
            overflow: 'visible', lineHeight: 1.12,
            marginBottom: '1rem', paddingBottom: '0.14em', minHeight: '1.2em',
            pointerEvents: 'auto',        /* letters must receive getBoundingClientRect */
          }}
        >
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            style={{ display: 'inline-block' }}
          >
            {displayText.split('').map((char, i) => (
              <RepelLetter
                key={i}
                char={char}
                letterIndex={i}
                totalLetters={FULL_NAME.length}
                mouseRef={mouseRef}
                proximityArr={proximityArr}
              />
            ))}
            {!isComplete && (
              <span style={{
                display: 'inline-block', width: '4px', height: '0.9em',
                backgroundColor: 'var(--color-accent)', marginLeft: '4px',
                animation: 'blink 1s infinite', verticalAlign: 'middle',
              }} />
            )}
          </motion.span>
        </h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 300,
            color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '600px',
          }}
        >
          Systems Programmer &amp; C/C++ Developer
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="text-body"
          style={{ maxWidth: '600px', marginBottom: '3rem' }}
        >
          I build high-performance systems and renderers—from procedural terrain engines to optimized video pipelines.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.9 }}
          style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', pointerEvents: 'auto', flexWrap: 'wrap' }}
        >
          <a
            href="#projects"
            style={{
              background: 'var(--color-accent)', color: 'var(--color-bg)',
              padding: '12px 32px', borderRadius: '4px', fontWeight: 500,
              transition: 'transform 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            View My Work
          </a>
          <a
            href="/assets/resume.pdf" target="_blank"
            style={{
              color: 'var(--color-text-primary)',
              borderBottom: '1px solid var(--color-border)', paddingBottom: '4px',
              transition: 'border-color 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            Download Resume
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{ position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)' }}
        className="animate-pulse-arrow"
      >
        <ArrowDown size={32} color="var(--color-text-secondary)" />
      </motion.div>
    </section>
  );
};

export default Hero;

import { useEffect, useRef } from 'react';

// ─── RIPPLE CANVAS ────────────────────────────────────────────────────────────
// Renders click/tap ripple rings on a full-screen canvas overlay
const RippleCanvas = () => {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Spawn a ripple on click OR touch
    const spawnRipple = (x, y) => {
      ripplesRef.current.push({ x, y, radius: 0, opacity: 0.7, born: performance.now() });
    };
    const onClick = (e) => spawnRipple(e.clientX, e.clientY);
    const onTouch = (e) => {
      for (const t of e.touches) spawnRipple(t.clientX, t.clientY);
    };
    window.addEventListener('click',     onClick,  { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });

    // Also spawn a gentle ripple on mouse movement (throttled)
    let lastMoveTime = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - lastMoveTime < 400) return;   // max 1 ripple per 400ms from movement
      lastMoveTime = now;
      ripplesRef.current.push({ x: e.clientX, y: e.clientY, radius: 0, opacity: 0.22, born: now, move: true });
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const MAX_RADIUS =  260;
    const DURATION   = 1400; // ms a ripple lives

    let raf;
    const draw = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripplesRef.current = ripplesRef.current.filter(r => now - r.born < DURATION);

      for (const r of ripplesRef.current) {
        const t = (now - r.born) / DURATION;           // 0 → 1
        const eased = 1 - Math.pow(1 - t, 3);          // ease-out-cubic
        const radius = eased * MAX_RADIUS;
        const opacity = r.opacity * (1 - t);

        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(232, 200, 122, ${opacity})`;
        ctx.lineWidth = r.move ? 0.8 : 1.5;
        ctx.stroke();

        // Second inner ring for click ripples only
        if (!r.move && eased > 0.15) {
          const r2 = Math.max(0, radius - 40);
          ctx.beginPath();
          ctx.arc(r.x, r.y, r2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(232, 200, 122, ${opacity * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',      resize);
      window.removeEventListener('click',       onClick);
      window.removeEventListener('touchstart',  onTouch);
      window.removeEventListener('mousemove',   onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none',
        zIndex: 4,                    // above orbs, below content
        opacity: 1,
      }}
      aria-hidden="true"
    />
  );
};

// ─── AMBIENT SOUND ENGINE ─────────────────────────────────────────────────────
// Pure Web Audio API — no external files.
// Creates layered space pads: two slowly-evolving drones, a shimmer oscillator,
// and long reverb tails for a lonely cosmos feel.
class SpaceAmbience {
  constructor() {
    this.ctx  = null;
    this.reverb = null;
    this.nodes  = [];
    this.masterGain = null;
    this._running = false;
  }

  async _buildReverb(ctx) {
    const sampleRate = ctx.sampleRate;
    const length     = sampleRate * 6;          // 6-second IR
    const ir         = ctx.createBuffer(2, length, sampleRate);
    for (let c = 0; c < 2; c++) {
      const ch = ir.getChannelData(c);
      for (let i = 0; i < length; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3.2);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = ir;
    return conv;
  }

  _addDrone(freq, gainVal, detune = 0) {
    const ctx  = this.ctx;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type      = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.detune.setValueAtTime(detune, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 8);  // slow fade-in
    osc.connect(gain);
    gain.connect(this.reverb);
    gain.connect(this.masterGain);
    osc.start();
    this.nodes.push(osc, gain);
  }

  _addShimmer(freq, gainVal, lfoRate) {
    const ctx  = this.ctx;
    const osc  = ctx.createOscillator();
    const lfo  = ctx.createOscillator();
    const lfoG = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(lfoRate, ctx.currentTime);
    lfoG.gain.setValueAtTime(freq * 0.004, ctx.currentTime);

    lfo.connect(lfoG);
    lfoG.connect(osc.frequency);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 12);

    osc.connect(gain);
    gain.connect(this.reverb);
    osc.start(); lfo.start();
    this.nodes.push(osc, lfo, lfoG, gain);
  }

  async start() {
    if (this._running) return;
    this._running = true;

    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') await this.ctx.resume();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.38, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.reverb = await this._buildReverb(this.ctx);
    this.reverb.connect(this.masterGain);

    // Deep space drones (slightly detuned for beating / chorus)
    this._addDrone( 55, 0.18,   0);    // low root
    this._addDrone( 55, 0.10,  +7);    // slight detune → slow beating
    this._addDrone(110, 0.09,  -5);    // octave
    this._addDrone(165, 0.055,  0);    // perfect 5th
    this._addDrone(220, 0.035,  0);    // 2nd octave

    // Shimmer layer (high partial, very quiet)
    this._addShimmer(880, 0.018, 0.07);
    this._addShimmer(660, 0.012, 0.04);
  }

  fadeOut() {
    if (!this.masterGain) return;
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 3);
    setTimeout(() => this.stop(), 3500);
  }

  stop() {
    this.nodes.forEach(n => { try { n.disconnect(); n.stop && n.stop(); } catch(_) {} });
    this.nodes = [];
    if (this.ctx) { this.ctx.close(); this.ctx = null; }
    this._running = false;
  }
}

// ─── MUSIC BUTTON ─────────────────────────────────────────────────────────────
// Plays the real audio file from /assets/images/audio.webm
const MusicToggle = () => {
  const audioRef   = useRef(null);
  const playingRef = useRef(false);
  const btnRef     = useRef(null);
  const fadeRef    = useRef(null);

  useEffect(() => {
    const audio = new Audio('/assets/images/audio.webm');
    audio.loop   = true;
    audio.volume = 0;          // start silent — fade in
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const setIcon = (active) => {
    const btn  = btnRef.current;
    if (!btn) return;
    btn.title = active ? 'Disable space ambience' : 'Enable space ambience';
    btn.setAttribute('aria-label', btn.title);
    const icon = btn.querySelector('.music-icon');
    if (icon) icon.style.opacity = active ? '1' : '0.4';
  };

  const fadeVolume = (from, to, durationMs) => {
    const audio = audioRef.current;
    if (!audio) return;
    clearInterval(fadeRef.current);
    const steps    = 40;
    const interval = durationMs / steps;
    const delta    = (to - from) / steps;
    let step = 0;
    audio.volume = from;
    fadeRef.current = setInterval(() => {
      step++;
      audio.volume = Math.min(1, Math.max(0, from + delta * step));
      if (step >= steps) {
        clearInterval(fadeRef.current);
        if (to === 0) audio.pause();
      }
    }, interval);
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playingRef.current) {
      fadeVolume(audio.volume, 0, 2000);   // fade out over 2s then pause
      playingRef.current = false;
      setIcon(false);
    } else {
      await audio.play().catch(() => {});  // browser may block autoplay; ok
      fadeVolume(0, 0.5, 3000);            // fade in to 50% over 3s
      playingRef.current = true;
      setIcon(true);
    }
  };

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      title="Enable space ambience"
      aria-label="Enable space ambience"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 500,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'rgba(10,10,10,0.72)',
        border: '1px solid rgba(232,200,122,0.35)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease, transform 0.2s ease',
      }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(232,200,122,0.85)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'rgba(232,200,122,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {/* Sound-wave icon (SVG) */}
      <svg
        className="music-icon"
        width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="#e8c87a" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ opacity: 0.4, transition: 'opacity 0.3s ease' }}
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6"  cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    </button>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
const BackgroundDots = () => {
  const shellRef  = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.72 });
  const scrollRef  = useRef(0);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;

    let animationFrameId = 0;
    let scrollTarget = window.scrollY;

    const updateShell = (time) => {
      scrollRef.current += (scrollTarget - scrollRef.current) * 0.08;
      const scrollInfluence = Math.min(scrollRef.current / 1200, 1);
      shell.style.setProperty('--veil-x',      `${pointerRef.current.x * 100}%`);
      shell.style.setProperty('--veil-y',      `${pointerRef.current.y * 100}%`);
      shell.style.setProperty('--veil-scroll', `${scrollInfluence}`);
      shell.style.setProperty('--veil-rot',    `${time * 0.004}deg`);
      animationFrameId = window.requestAnimationFrame(updateShell);
    };

    const onScroll       = () => { scrollTarget = window.scrollY; };
    const onPointerMove  = (e) => { pointerRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }; };
    const onPointerLeave = ()  => { pointerRef.current = { x: 0.5, y: 0.72 }; };

    window.addEventListener('scroll',       onScroll,      { passive: true });
    window.addEventListener('pointermove',  onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    animationFrameId = window.requestAnimationFrame(updateShell);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll',       onScroll);
      window.removeEventListener('pointermove',  onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <>
      {/* Original ambient orb layer */}
      <div ref={shellRef} className="uncertainty-veil" aria-hidden="true">
        <div className="uncertainty-orb orb-a" />
        <div className="uncertainty-orb orb-b" />
        <div className="uncertainty-orb orb-c" />
        <div className="uncertainty-orb orb-d" />
        <div className="uncertainty-halo" />
        <div className="uncertainty-ribbon ribbon-a" />
        <div className="uncertainty-ribbon ribbon-b" />
      </div>

      {/* Gold ripple canvas on click/tap/move */}
      <RippleCanvas />

      {/* Space ambience toggle */}
      <MusicToggle />
    </>
  );
};

export default BackgroundDots;

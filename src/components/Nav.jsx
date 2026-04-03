import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MagneticWrapper = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = e.clientX - (left + width / 2);
    const middleY = e.clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};

const LINKS = [
  { id: 'about',    label: 'About' },
  { id: 'skills',   label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact',  label: 'Contact' },
];

const Nav = ({ activeSection }) => {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [isMobileNav, setIsMobileNav] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsMobileNav(window.innerWidth < 768);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 200,
          padding: '20px 5vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: scrolled || menuOpen ? 'rgba(10, 10, 10, 0.92)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
          borderBottom: scrolled && !menuOpen ? '1px solid var(--color-border)' : '1px solid transparent',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Logo */}
        <MagneticWrapper>
          <a
            href="#hero"
            onClick={closeMenu}
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600 }}
          >
            Art comes from within.
          </a>
        </MagneticWrapper>

        {/* Desktop links */}
        {!isMobileNav && (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <ul style={{ display: 'flex', gap: '24px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' }}>
              {LINKS.map((link) => (
                <li key={link.id} style={{ position: 'relative' }}>
                  <MagneticWrapper>
                    <a
                      href={`#${link.id}`}
                      style={{
                        color: activeSection === link.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        transition: 'color 0.2s ease',
                        display: 'block',
                        padding: '8px',
                      }}
                    >
                      {link.label}
                    </a>
                  </MagneticWrapper>
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      style={{
                        position: 'absolute',
                        bottom: '-4px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px', height: '4px',
                        borderRadius: '50%',
                        background: 'var(--color-accent)',
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>

            <MagneticWrapper>
              <a
                href="/assets/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.9rem',
                  padding: '8px 16px',
                  border: '1px solid var(--color-accent)',
                  borderRadius: '4px',
                  color: 'var(--color-accent)',
                  display: 'inline-block',
                }}
              >
                Resume ↗
              </a>
            </MagneticWrapper>
          </div>
        )}

        {/* Mobile hamburger button */}
        {isMobileNav && (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              zIndex: 201,
            }}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'block', width: '24px', height: '2px', background: 'var(--color-text-primary)', borderRadius: '2px' }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'block', width: '24px', height: '2px', background: 'var(--color-text-primary)', borderRadius: '2px' }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'block', width: '24px', height: '2px', background: 'var(--color-text-primary)', borderRadius: '2px' }}
            />
          </button>
        )}
      </motion.nav>

      {/* Mobile full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && isMobileNav && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 199,
              background: 'rgba(10, 10, 10, 0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0',
            }}
          >
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 3rem 0', textAlign: 'center' }}>
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.4, ease: 'easeOut' }}
                  style={{ marginBottom: '2rem' }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={closeMenu}
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: 'clamp(2rem, 10vw, 3.5rem)',
                      color: activeSection === link.id ? 'var(--color-accent)' : 'var(--color-text-primary)',
                      fontWeight: 400,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              href="/assets/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.85rem',
                padding: '10px 24px',
                border: '1px solid var(--color-accent)',
                borderRadius: '4px',
                color: 'var(--color-accent)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Resume ↗
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;

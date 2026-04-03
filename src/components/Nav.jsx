import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MagneticWrapper = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
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

const Nav = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80;
      setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '24px 5vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}
    >
      <MagneticWrapper>
        <a href="#hero" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 600 }}>
          Art comes from within.
        </a>
      </MagneticWrapper>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <ul style={{ display: 'flex', gap: '24px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' }}>
          {links.map((link) => (
            <li key={link.id} style={{ position: 'relative' }}>
              <MagneticWrapper>
                <a 
                  href={`#${link.id}`}
                  style={{
                    color: activeSection === link.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    padding: '8px'
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
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)'
                  }}
                />
              )}
            </li>
          ))}
        </ul>
        <MagneticWrapper>
          <motion.a 
            href="/assets/resume.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ 
              backgroundColor: 'var(--color-accent)', 
              color: 'var(--color-bg)',
              boxShadow: '0 0 15px var(--color-accent-soft)'
            }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.9rem',
              padding: '8px 16px',
              border: '1px solid var(--color-accent)',
              borderRadius: '4px',
              color: 'var(--color-accent)',
              display: 'inline-block'
            }}
          >
            Resume ↗
          </motion.a>
        </MagneticWrapper>
      </div>
    </motion.nav>
  );
};

export default Nav;

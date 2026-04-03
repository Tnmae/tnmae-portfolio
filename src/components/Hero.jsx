import {  useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';


// Typewriter effect hook
const useTypewriter = (text, speed = 100, startDelay = 300) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout;
    let currentIndex = 0;

    const startTyping = () => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
        timeout = setTimeout(startTyping, speed);
      } else {
        setIsComplete(true);
      }
    };

    timeout = setTimeout(startTyping, startDelay);

    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayText, isComplete };
};

const Hero = ({ id }) => {
  const { displayText, isComplete } = useTypewriter('Tanmay Tyagi', 80, 500);

  return (
    <section id={id} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* 3D Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.8 }}>
        <div style={{
          position: 'absolute',
          top: '-6%',
          left: 0,
          width: '100%',
          height: '116%',
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.08) 12%, rgba(10,10,10,0.26) 48%, rgba(10,10,10,0.4) 72%, rgba(10,10,10,0.22) 100%)',
          filter: 'blur(6px)'
        }} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', zIndex: 1, pointerEvents: 'none' }}>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-label" 
          style={{ marginBottom: '1.5rem', color: 'var(--color-accent)' }}
        >
          Available for work
        </motion.p>
        
        <h1 className="text-hero" style={{ 
          overflow: 'visible', 
          lineHeight: 1.12, 
          marginBottom: '1rem', 
          paddingBottom: '0.14em',
          minHeight: '1.2em'
        }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            style={{ display: 'inline-block' }}
          >
            {displayText.split('').map((char, index) => (
              <motion.span
                key={index}
                whileHover={{ y: -10, color: 'var(--color-accent)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                style={{ display: 'inline-block', minWidth: char === ' ' ? '0.25em' : 'auto', cursor: 'default' }}
              >
                {char}
              </motion.span>
            ))}
            {!isComplete && (
              <span style={{ 
                display: 'inline-block',
                width: '4px',
                height: '0.9em',
                backgroundColor: 'var(--color-accent)',
                marginLeft: '4px',
                animation: 'blink 1s infinite',
                verticalAlign: 'middle'
              }} />
            )}
          </motion.span>
        </h1>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 300, color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '600px' }}
        >
          Systems Programmer & C/C++ Developer
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="text-body"
          style={{ maxWidth: '600px', marginBottom: '3rem' }}
        >
          I build high-performance systems and renderers—from procedural terrain engines to optimized video pipelines.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.9 }}
          style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', pointerEvents: 'auto', flexWrap: 'wrap' }}
        >
          <a href="#projects" style={{
            background: 'var(--color-accent)',
            color: 'var(--color-bg)',
            padding: '12px 32px',
            borderRadius: '4px',
            fontWeight: 500,
            transition: 'transform 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            View My Work
          </a>
          <a href="/assets/resume.pdf" target="_blank" style={{
            color: 'var(--color-text-primary)',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '4px',
            transition: 'border-color 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            Download Resume
          </a>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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

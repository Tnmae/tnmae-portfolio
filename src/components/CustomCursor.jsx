import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

// Detect touch/coarse pointer devices — no mouse cursor needed there
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none), (pointer: coarse)').matches;

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Don't render anything on touch / mobile devices
  if (isTouchDevice()) return null;
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Outer ring spring configuration for smooth trailing
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  // Inner dot spring configuration for fast tracking
  const dotConfig = { damping: 20, stiffness: 400, mass: 0.1 };
  const dotX = useSpring(mouseX, dotConfig);
  const dotY = useSpring(mouseY, dotConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      // Find closest anchor tag or element with an explicit hover class
      const target = e.target.closest('a, button, input, textarea, .hoverable-target');
      setIsHovering(!!target);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        className="custom-cursor-dot"
        animate={{ scale: isClicking ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference'
        }}
      />
      <motion.div
        className="custom-cursor-ring"
        initial={{ scale: 1 }}
        animate={{ 
          scale: isHovering ? 2.2 : (isClicking ? 0.8 : 1),
          backgroundColor: isHovering ? 'var(--color-text-primary)' : 'transparent',
          borderColor: isHovering ? 'transparent' : 'var(--color-accent)'
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference'
        }}
      />
    </>
  );
};

export default CustomCursor;

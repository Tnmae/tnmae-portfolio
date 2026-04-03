import { useEffect, useRef } from 'react';

const BackgroundDots = () => {
  const shellRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.72 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) {
      return undefined;
    }

    let animationFrameId = 0;
    let scrollTarget = window.scrollY;

    const updateShell = (time) => {
      scrollRef.current += (scrollTarget - scrollRef.current) * 0.08;

      const scrollInfluence = Math.min(scrollRef.current / 1200, 1);
      const pointerX = pointerRef.current.x;
      const pointerY = pointerRef.current.y;

      shell.style.setProperty('--veil-x', `${pointerX * 100}%`);
      shell.style.setProperty('--veil-y', `${pointerY * 100}%`);
      shell.style.setProperty('--veil-scroll', `${scrollInfluence}`);
      shell.style.setProperty('--veil-rot', `${time * 0.004}deg`);

      animationFrameId = window.requestAnimationFrame(updateShell);
    };

    const onScroll = () => {
      scrollTarget = window.scrollY;
    };

    const onPointerMove = (event) => {
      pointerRef.current = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight
      };
    };

    const onPointerLeave = () => {
      pointerRef.current = { x: 0.5, y: 0.72 };
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    animationFrameId = window.requestAnimationFrame(updateShell);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div ref={shellRef} className="uncertainty-veil" aria-hidden="true">
      <div className="uncertainty-orb orb-a" />
      <div className="uncertainty-orb orb-b" />
      <div className="uncertainty-orb orb-c" />
      <div className="uncertainty-orb orb-d" />
      <div className="uncertainty-halo" />
      <div className="uncertainty-ribbon ribbon-a" />
      <div className="uncertainty-ribbon ribbon-b" />
    </div>
  );
};

export default BackgroundDots;

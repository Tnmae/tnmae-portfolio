import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import BackgroundDots from './components/BackgroundDots';
import Scene3D from './components/Scene3D';
import CustomCursor from './components/CustomCursor';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [warpSpeed, setWarpSpeed] = useState(false);

  useEffect(() => {
    // 🐣 Easter Egg: Console Message
    console.log(
      "%c🚀 Welcome to the outer rim. If you're inspecting this, we should talk. ttyagi.2505@gmail.com",
      "color: #e8c87a; font-size: 14px; font-weight: bold; background: #0a0a0a; padding: 10px; border-radius: 5px;"
    );

    // 🐣 Easter Egg: Konami Code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase() || e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setWarpSpeed(prev => !prev);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
    let ticking = false;

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let current = 'hero';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          current = section;
        }
      }

      setActiveSection((prev) => (prev === current ? prev : current));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className={`app-shell ${warpSpeed ? 'warp-speed-active' : ''}`}>
      <CustomCursor />
      <div className="ambient-gradient-bg" aria-hidden="true" />
      <Scene3D warpSpeed={warpSpeed} />
      <BackgroundDots />
      <div className="grain-overlay" />
      <Nav activeSection={activeSection} />
      <main>
        <Hero id="hero" />
        <About id="about" />
        <Skills id="skills" />
        <Projects id="projects" />
        <Contact id="contact" />
      </main>
    </div>
  );
}

export default App;

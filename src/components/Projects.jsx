import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const hardwareProjects = [
  {
    title: 'ESP32 BLE Mouse Controller',
    points: [
      'Gesture-based mouse controller built on ESP32 with Bluetooth Low Energy.',
      'Turns embedded hardware input into a wireless pointing device.',
      'Designed for a low-latency control loop and responsive interaction.'
    ],
    tags: ['ESP32', 'BLE', 'Embedded Systems'],
    liveUrl: 'https://github.com/Tnmae/ESP32-BLE-Mouse-Controller',
    repoUrl: 'https://github.com/Tnmae/ESP32-BLE-Mouse-Controller',
    image: 'esp32-ble-mouse.webp'
  },
  {
    title: 'ESP8266 Chat App',
    points: [
      'Web-based decentralized chat app hosted directly on an ESP8266 web server.',
      'Combines embedded networking with a lightweight browser UI.',
      'Shows how a small microcontroller can serve interactive web experiences.'
    ],
    tags: ['ESP8266', 'Networking', 'Web Server'],
    liveUrl: 'https://github.com/Tnmae/ESP8266-Chat-App',
    repoUrl: 'https://github.com/Tnmae/ESP8266-Chat-App',
    image: 'esp8266-chat-app.webp'
  }
];

const softwareProjects = [
  {
    title: 'OpenGL Rendering Engine',
    points: [
      'Modern OpenGL rendering pipeline using GLAD, Assimp, and stb_image.',
      'Added Blinn–Phong lighting, fog, depth buffering, and camera controls.',
      'Migrated the build system to CMake to reduce setup time by 40%.'
    ],
    tags: ['C++', 'OpenGL', 'CMake'],
    liveUrl: 'https://github.com/Tnmae/OpenGL',
    repoUrl: 'https://github.com/Tnmae/OpenGL',
    image: 'opengl-engine.webp',
    preview: '/assets/images/opengl-engine.gif'
  },
  {
    title: 'OpenEnv Meta',
    points: [
      'Built as part of the Meta OpenEnv hackathon submission flow.',
      'Focused on round-one development and submission readiness.',
      'Uses a lightweight Python-based workflow to structure the project.'
    ],
    tags: ['Python', 'Hackathon', 'Meta OpenEnv'],
    liveUrl: 'https://github.com/Tnmae/openenv-meta',
    repoUrl: 'https://github.com/Tnmae/openenv-meta',
    image: 'openenv-meta.png',
    preview: '/assets/images/openenv-meta.png'
  },
  {
    title: 'Procedural Terrain Generator',
    points: [
      'Noise-based procedural terrain with chunked mesh generation.',
      'Implemented Perlin and Value Noise from scratch.',
      'Integrated with an OpenGL renderer and free-fly camera.'
    ],
    tags: ['C++', 'OpenGL', 'Math'],
    liveUrl: 'https://github.com/Tnmae/Perlin-Implementation',
    repoUrl: 'https://github.com/Tnmae/Perlin-Implementation',
    image: 'terrain-engine.webp',
    preview: '/assets/images/terrain-engine.gif'
  },
  {
    title: 'Video Processing Pipeline',
    points: [
      'Triple buffering and producer-consumer pipeline for efficient video encoding and decoding.',
      'Achieved real-time processing of 4K 30fps video.',
      'Added live Video-to-ASCII post-processing using streaming textures.'
    ],
    tags: ['C', 'Shell', 'Multi-threading'],
    liveUrl: 'https://github.com/Tnmae/Vid2ASCII',
    repoUrl: 'https://github.com/Tnmae/Vid2ASCII',
    image: 'video-pipeline.webp',
    preview: '/assets/images/video-pipeline.gif'
  },
  {
    title: 'GPU Accelerated Optimization',
    points: [
      'Whale Optimization Algorithm and Improved-WOA implemented on CPU and GPU.',
      'CUDA kernels use CURAND for population initialization.',
      'Achieved roughly 120x speedup over the CPU version.'
    ],
    tags: ['C++', 'CUDA', 'OpenCL'],
    liveUrl: 'https://github.com/Tnmae/WOA-GPU',
    repoUrl: 'https://github.com/Tnmae/WOA-GPU',
    image: 'woa-gpu.webp',
    preview: '/assets/images/woa-gpu.png'
  }
];

const TiltCard = ({ project, i }) => {
  const ref = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = ((y / height) - 0.5) * -15; // Increased tilt angle for more 3D feel
    const rotateY = ((x / width) - 0.5) * 15;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className="hoverable-target"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(232,200,122,0.12)' }}
      animate={{ rotateX: rotation.x, rotateY: rotation.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
      style={{
        transformStyle: 'preserve-3d',
        background: 'linear-gradient(150deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
        backdropFilter: 'blur(14px) saturate(120%)',
        WebkitBackdropFilter: 'blur(14px) saturate(120%)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.16)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'default'
      }}
    >
      <div style={{
        width: '100%',
        height: '240px',
        backgroundColor: 'rgba(8, 10, 18, 0.56)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        position: 'relative'
      }}>
        {project.preview ? (
          <img
            src={project.preview}
            alt={project.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'saturate(0.9) contrast(1.02)'
            }}
          />
        ) : (
          <p className="font-mono" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', zIndex: 1 }}>
            [ {project.image} ]
          </p>
        )}

        {/* Subtle golden duotone effect overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: project.preview ? 'linear-gradient(180deg, rgba(10,10,10,0.08), rgba(10,10,10,0.3))' : 'var(--color-accent-soft)',
          transition: 'opacity 0.3s ease'
        }} className="project-overlay" />
        <style>{`.project-overlay:hover { opacity: 0; }`}</style>
      </div>

      <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', transform: 'translateZ(30px)' }}>
        <h4 className="text-card-title" style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          {project.title}
        </h4>
        <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.1rem', flexGrow: 1 }}>
          {project.points.map((point) => (
            <li key={point} className="text-body" style={{ marginBottom: '0.75rem' }}>
              {point}
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
          {project.tags.map((tag, j) => (
            <span key={j} className="text-label" style={{ color: 'var(--color-text-secondary)' }}>
              {tag}{j < project.tags.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', transform: 'translateZ(20px)' }}>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{
            color: 'var(--color-accent)', fontWeight: 500, fontSize: '0.9rem'
          }}>
            Live Demo ↗
          </a>
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" style={{
            color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '0.9rem'
          }}>
            Source Code ↗
          </a>
        </div>
      </div>
    </motion.div>
  )
}

const ProjectGroup = ({ title, projects }) => {
  return (
    <section style={{ minHeight: 'auto', padding: 0, marginBottom: '4rem', perspective: 1000 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 className="text-section-title" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)' }}>
          {title}
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {projects.map((project, i) => (
          <TiltCard key={project.title} project={project} i={i} />
        ))}
      </div>
    </section>
  );
};

const Projects = ({ id }) => {
  const [activeCategory, setActiveCategory] = useState('software');
  const activeProjects = activeCategory === 'hardware' ? hardwareProjects : softwareProjects;

  return (
    <section id={id}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-label" style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>
            03 / PROJECTS
          </p>
          <h2 className="text-section-title" style={{ marginBottom: '4rem' }}>
            Things I've built
          </h2>

          <div style={{
            display: 'inline-flex',
            gap: '8px',
            marginBottom: '2.5rem',
            paddingBottom: '10px',
            borderBottom: '1px solid var(--color-border)',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'hardware', label: 'Hardware Projects', count: hardwareProjects.length },
              { id: 'software', label: 'Software Projects', count: softwareProjects.length }
            ].map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className="font-mono"
                  style={{
                    position: 'relative',
                    padding: '8px 6px',
                    border: 'none',
                    background: 'transparent',
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                    zIndex: 1,
                    transition: 'color 0.25s ease, border-color 0.25s ease'
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 1, paddingBottom: '8px', borderBottom: isActive ? '1px solid var(--color-accent)' : '1px solid transparent' }}>
                    {category.label}
                  </span>
                  <span style={{ position: 'relative', zIndex: 1, marginLeft: '8px', opacity: 0.72 }}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <ProjectGroup
                title={activeCategory === 'hardware' ? 'Embedded and device-driven work' : 'Systems, graphics, and performance work'}
                projects={activeProjects}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
export default Projects;

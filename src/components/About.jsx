import { motion } from 'framer-motion';

const About = ({ id }) => {
  return (
    <section id={id}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-label" style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>
            01 / ABOUT
          </p>
          <h2 className="text-section-title" style={{ marginBottom: '3rem' }}>
            A little about me
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            <div>
              <p className="text-body" style={{ marginBottom: '1.5rem' }}>
                I am Tanmay Tyagi, a B.Tech student at Netaji Subhas University of Technology (2023-2027) with a deep interest in systems programming, graphics, and performance optimization.
              </p>
              <p className="text-body" style={{ marginBottom: '1.5rem' }}>
                My technical journey has been driven by a curiosity to understand how things work under the hood. From building an OpenGL rendering pipeline in C++ with Blinn-Phong lighting to writing CUDA kernels for GPU accelerated algorithms that achieve 120x speedups, I love tackling computationally dense problems.
              </p>
              <p className="text-body">
                When I am not debugging memory issues with Valgrind or exploring the complexities of procedural terrain generation, I enjoy participating in competitive programming as an Executive Member of D'Code and contributing to open-source projects.
              </p>
            </div>
            
            <div style={{ position: 'relative' }}>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: 'var(--color-surface)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-secondary)',
                  overflow: 'hidden'
              }}>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  src="/assets/images/Tanmay_Tyagi.jpeg"
                  alt="Tanmay Tyagi"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0.3, top: '20px', left: '-20px' }}
                whileHover={{ opacity: 0.6, top: '10px', left: '-10px' }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  border: '1px solid var(--color-accent)',
                  borderRadius: '8px',
                  zIndex: -1,
                  pointerEvents: 'none'
                }} 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

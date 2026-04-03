import { motion } from 'framer-motion';

const skillsData = [
  { group: 'Languages', items: ['C', 'C++', 'Rust', 'Python', 'JavaScript', 'TypeScript'] },
  { group: 'Graphics & APIs', items: ['OpenGL', 'CUDA', 'OpenCL', 'GLAD', 'GLFW'] },
  { group: 'Full Stack', items: ['React.js', 'Express.js', 'React Native'] },
  { group: 'Tools & DBs', items: ['Docker', 'CMake', 'Datagrip', 'Postman', 'Git'] },
  { group: 'Profiler/Debug', items: ['Valgrind', 'AddressSanitizer', 'GDB', 'GProf'] },
  { group: 'OS & Scripting', items: ['Linux', 'Bash', 'Batch', 'VirtManager'] }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "backOut" }
  }
};

const Skills = ({ id }) => {
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
            02 / SKILLS
          </p>
          <h2 className="text-section-title" style={{ marginBottom: '4rem' }}>
            What I work with
          </h2>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}
          >
            {skillsData.map((category, i) => (
              <motion.div key={i} variants={itemVariants}>
                <h3 className="font-mono" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
                  {category.group}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {category.items.map((skill, j) => (
                    <motion.span
                      key={j}
                      variants={tagVariants}
                      className="hoverable-target"
                      style={{
                        background: 'var(--color-tag)',
                        padding: '6px 16px',
                        borderRadius: '16px',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'JetBrains Mono, monospace',
                        border: '1px solid var(--color-border)',
                        cursor: 'default'
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
export default Skills;

import { motion } from 'framer-motion';

const Contact = ({ id }) => {
  return (
    <section
      id={id}
      style={{
        minHeight: '80vh',
        borderTop: '1px solid var(--color-border)',
        marginTop: '4rem',
        position: 'relative', /* needed for absolute footer credit */
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', textAlign: 'center', mixBlendMode: 'difference', color: '#fff' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-label" style={{ color: '#fff', marginBottom: '1rem' }}>
            04 / CONTACT
          </p>
          <h2 className="text-section-title" style={{ marginBottom: '2rem', color: '#fff' }}>
            Let's work together
          </h2>
          <p className="text-body" style={{ maxWidth: '600px', margin: '0 auto 4rem auto', color: '#ccc' }}>
            I'm currently open to full-time and freelance opportunities. Drop me a line and I'll get back to you within 24 hours.
          </p>

          <div style={{ marginBottom: '3rem', overflowWrap: 'break-word', wordBreak: 'break-all' }}>
            <a
              href="mailto:ttyagi.2505@gmail.com"
              className="email-link"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(1.3rem, 5vw, 5rem)', /* tighter min for mobile */
                color: '#fff',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              ttyagi.2505@gmail.com
              <span style={{
                position: 'absolute',
                bottom: 0, left: 0, width: '100%', height: '2px',
                background: '#fff',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
              }} className="email-hover-line" />
              <style>{`
                .email-link:hover .email-hover-line {
                  transform: scaleX(1) !important;
                }
              `}</style>
            </a>
          </div>

          <div style={{ marginBottom: '5rem' }}>
            <a
              href="tel:+919871662394"
              className="font-mono"
              style={{
                color: '#ccc',
                fontSize: '0.95rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
              onMouseOut={(e) => e.currentTarget.style.color = '#ccc'}
            >
              +91-9871662394
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            {[
              { name: 'GitHub',   url: 'https://github.com/Tnmae' },
              { name: 'LinkedIn', url: 'https://www.linkedin.com/in/tanmay-tyagi-557159307/' },
              { name: 'Resume',   url: '/assets/resume.pdf' },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.url}
                target={social.name !== 'Resume' ? '_blank' : undefined}
                rel={social.name !== 'Resume' ? 'noopener noreferrer' : undefined}
                className="font-mono hoverable-target"
                whileHover={{ y: -5, color: 'var(--color-accent)', textShadow: '0 4px 12px var(--color-accent-soft)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{
                  color: '#ccc',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'inline-block',
                }}
              >
                {social.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ position: 'absolute', bottom: '24px', left: 0, width: '100%', textAlign: 'center', mixBlendMode: 'difference' }}>
        <p className="font-mono" style={{ color: '#aaa', fontSize: '0.75rem' }}>
          Designed &amp; built by Tanmay Tyagi · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
};
export default Contact;


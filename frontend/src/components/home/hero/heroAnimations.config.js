export const heroAnimations = {
  // Page Load Sequence Delays
  sequence: {
    bgFadeInDuration: 0.5,
    headingDelay: 0, // Spring handles entrance natively, but structural delay if needed
    subtitleDelay: 0.25,
    ctaDelay: 0.5,
  },

  // Heading Spring Config
  headingSpring: {
    initial: { opacity: 0, y: 80, scale: 0.92, rotateX: 10 },
    animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 14,
      mass: 0.8,
    },
  },

  // Subtitle Config
  subtitle: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.25, duration: 0.6, ease: "easeOut" },
  },

  // CTA Buttons Config
  cta: {
    initial: { opacity: 0, y: 10, scale: 0.85 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { delay: 0.5, duration: 0.6, ease: "easeOut" },
  },

  // Chips Entrance
  chipEntrance: {
    initial: { opacity: 0, y: 30, scale: 0.7 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },

  // Mouse Parallax Spring Config
  parallaxSpring: {
    stiffness: 80,
    damping: 20,
  },

  // GSAP Scroll Parallax Velocities
  scrollParallax: {
    textSpeed: 0.85,
    chipsSpeed: 0.7,
    bgSpeed: 0.5,
  },
};

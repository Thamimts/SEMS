/**
 * Animation effects and utilities for futuristic UI
 */

export const animationVariants = {
  // Entrance animations
  slideInLeft: {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  },
  slideInRight: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0 },
  },
  slideInTop: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  slideInBottom: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
  
  // Pulse animations
  pulse: {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 2, repeat: Infinity },
  },
  quickPulse: {
    animate: { opacity: [1, 0.4, 1] },
    transition: { duration: 1, repeat: Infinity },
  },
  
  // Glow animations
  neonGlow: {
    animate: { 
      textShadow: [
        '0 0 10px rgba(0, 212, 255, 0.5)',
        '0 0 20px rgba(0, 212, 255, 0.8)',
        '0 0 10px rgba(0, 212, 255, 0.5)',
      ],
    },
    transition: { duration: 2, repeat: Infinity },
  },
  redGlow: {
    animate: { 
      textShadow: [
        '0 0 10px rgba(255, 45, 85, 0.5)',
        '0 0 20px rgba(255, 45, 85, 0.8)',
        '0 0 10px rgba(255, 45, 85, 0.5)',
      ],
    },
    transition: { duration: 1.5, repeat: Infinity },
  },
  
  // Siren effect
  sirenPulse: {
    animate: { 
      boxShadow: [
        'inset 0 0 0 0 rgba(255,45,85,0)',
        'inset 0 0 80px 20px rgba(255,45,85,0.15)',
        'inset 0 0 0 0 rgba(255,45,85,0)',
      ],
    },
    transition: { duration: 1, repeat: Infinity },
  },
};

export const transitionConfig = {
  fast: { duration: 0.2 },
  normal: { duration: 0.3 },
  smooth: { duration: 0.5 },
  slow: { duration: 0.8 },
};

/**
 * Typewriter effect text animation
 */
export const typewriterEffect = (text, speed = 50) => {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { staggerChildren: speed / 1000, delayChildren: 0 },
  };
};

/**
 * Glitch effect animation
 */
export const glitchEffect = {
  animate: {
    x: [0, -2, 2, -2, 0],
    opacity: [1, 0.8, 1, 0.8, 1],
  },
  transition: {
    duration: 0.4,
    repeat: 3,
  },
};

/**
 * Scanning animation
 */
export const scanningEffect = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 1],
    x: ['-100%', '100%'],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatDelay: 1,
  },
};

/**
 * Float animation
 */
export const floatAnimation = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

/**
 * Bounce animation
 */
export const bounceAnimation = {
  animate: {
    y: [0, -20, 0],
  },
  transition: {
    duration: 0.8,
    repeat: Infinity,
    ease: 'easeOut',
  },
};

/**
 * Rotate animation
 */
export const rotateAnimation = {
  animate: { rotate: 360 },
  transition: { duration: 2, repeat: Infinity, linear: true },
};

/**
 * Map pulse (for emergency radius)
 */
export const mapPulseAnimation = {
  animate: {
    r: [0, 50, 100],
    opacity: [1, 0.5, 0],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
  },
};

/**
 * Text flickering effect
 */
export const flickerEffect = {
  animate: { opacity: [1, 0.2, 1, 0.8, 1] },
  transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 },
};

export default animationVariants;

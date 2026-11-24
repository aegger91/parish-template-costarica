import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Scroll fade-in. Hidden only while JS + motion are available and the
 * element has not yet entered the viewport. Fallbacks (no-js CSS, reduced
 * motion CSS, and a ~1.5s post-load class) force opacity 1 so content never
 * stays blank. No fill-mode leaves opacity stuck at 0.
 */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

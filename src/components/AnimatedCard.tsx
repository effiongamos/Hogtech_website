import React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

export interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  index?: number;
  delay?: number;
  distance?: number;
}

/**
 * AnimatedCard provides a subtle entrance animation (fade-in & slide-up)
 * using Motion (Framer Motion) and Tailwind CSS transitions.
 * - Triggers when the element enters the viewport (whileInView)
 * - Automatically staggers entrance based on item index
 * - Respects the user's `prefers-reduced-motion` accessibility setting
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  index = 0,
  delay,
  distance = 20,
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Stagger entrance slightly based on grid position (clamped between 0 and 0.3s)
  const calculatedDelay = delay ?? Math.min((index % 6) * 0.06, 0.3);

  if (shouldReduceMotion) {
    return (
      <div className={className} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
      transition={{
        duration: 0.45,
        delay: calculatedDelay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;

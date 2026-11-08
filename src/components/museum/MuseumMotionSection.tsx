"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

type MuseumMotionSectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export function MuseumMotionSection({
  id,
  className,
  children,
}: MuseumMotionSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const ySpring = useSpring(parallaxY, {
    stiffness: 52,
    damping: 32,
    mass: 0.6,
  });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.88, ease: [0.16, 1, 0.3, 1] as const }}
      className={className}
    >
      <motion.div
        className="w-full will-change-transform"
        style={{ y: ySpring }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

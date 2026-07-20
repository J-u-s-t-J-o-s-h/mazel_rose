"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Soft entrance that never hides SSR content.
 * Starting at opacity 0 left the page blank when JS failed to hydrate
 * (common when opening the LAN IP before allowedDevOrigins was set).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

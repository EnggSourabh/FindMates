import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function AnimatedBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const x1 = useTransform(springX, [-1, 1], [-30, 30]);
  const y1 = useTransform(springY, [-1, 1], [-30, 30]);
  const x2 = useTransform(springX, [-1, 1], [40, -40]);
  const y2 = useTransform(springY, [-1, 1], [40, -40]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* Subtle warm blobs */}
      <motion.div
        style={{ x: x1, y: y1 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[15%] right-[10%] h-[50vh] w-[50vw] rounded-full bg-red-50 blur-[120px] opacity-60"
      />
      <motion.div
        style={{ x: x2, y: y2 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[10%] left-[5%] h-[40vh] w-[40vw] rounded-full bg-gray-100 blur-[100px] opacity-50"
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-40" />
    </div>
  );
}

export default AnimatedBackground;

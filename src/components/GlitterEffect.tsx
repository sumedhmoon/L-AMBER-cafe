import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shimmerSpeed: number;
  shimmerOffset: number;
}

export const GlitterEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isFirstMove = useRef(true);

  // Palettes of dark boutique cafe theme glitter:
  // Mix of bright gold, luxury champagne, warm bronze, and dark obsidian/amber.
  const colors = [
    "#d4af37", // Bright gold
    "#c5a880", // Warm bronze/champagne
    "#8a6d3b", // Deep amber gold
    "#1a1105", // Rich espresso black (dark glitter)
    "#3d2d1d", // Dark charcoal amber
    "#aa8144", // Vintage brass
  ];

  const createParticle = (x: number, y: number, isBurst = false): Particle => {
    // Random direction and velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = isBurst 
      ? Math.random() * 4 + 1.5 // Faster spread on click/tap burst
      : Math.random() * 1.2 + 0.3; // Gentle trail

    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed + (isBurst ? -0.5 : 0.2); // Slower fall or float up first

    // Dark glitter sizing: fine dust to small glowing flakes
    const size = isBurst 
      ? Math.random() * 4 + 1.5 
      : Math.random() * 2.5 + 0.8;

    // Decay rate (how fast it fades out)
    const decay = isBurst 
      ? Math.random() * 0.015 + 0.012 
      : Math.random() * 0.02 + 0.015;

    return {
      x,
      y,
      vx,
      vy,
      size,
      alpha: 1.0,
      decay,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      shimmerSpeed: Math.random() * 0.2 + 0.05,
      shimmerOffset: Math.random() * 100,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high-DPI displays
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse movement: Spawn fine glitter trail
    const handlePointerMove = (e: PointerEvent) => {
      // Create particles only if it's a fine pointer (mouse/stylus on desktop/laptop)
      const isMouse = e.pointerType === "mouse";
      
      const currentX = e.clientX;
      const currentY = e.clientY;

      if (isFirstMove.current) {
        lastMousePos.current = { x: currentX, y: currentY };
        isFirstMove.current = false;
        return;
      }

      if (isMouse) {
        // Interpolate between last position and current position to avoid gaps in fast moves
        const dx = currentX - lastMousePos.current.x;
        const dy = currentY - lastMousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.min(Math.floor(dist / 4), 10); // cap to prevent particle explosion

        for (let i = 0; i <= steps; i++) {
          const t = steps === 0 ? 1 : i / steps;
          const x = lastMousePos.current.x + dx * t;
          const y = lastMousePos.current.y + dy * t;
          
          // Spawn 1-2 particles per step for elegant density
          if (Math.random() < 0.6) {
            particlesRef.current.push(createParticle(x, y, false));
          }
        }
      }

      lastMousePos.current = { x: currentX, y: currentY };
    };

    // Click or Tap: Spawn premium dark glitter burst
    const handlePointerDown = (e: PointerEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      // Tap/Click burst: create a nice cluster of particles
      const burstCount = e.pointerType === "touch" ? 22 : 16;
      for (let i = 0; i < burstCount; i++) {
        particlesRef.current.push(createParticle(currentX, currentY, true));
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // Gentle gravity
        p.vx *= 0.98; // Friction
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        // Skip drawing if invisible
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Shimmer effect (sinusoidal opacity oscillation)
        const shimmer = Math.sin(Date.now() * p.shimmerSpeed + p.shimmerOffset) * 0.35 + 0.65;
        const currentAlpha = Math.max(0, Math.min(1, p.alpha * shimmer));

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Draw diamond-shaped or star-shaped glitter sparkles
        ctx.beginPath();
        const halfSize = p.size / 2;
        
        // Custom 4-point sparkling star path for high-end feel
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(0, 0, p.size, 0);
        ctx.quadraticCurveTo(0, 0, 0, p.size);
        ctx.quadraticCurveTo(0, 0, -p.size, 0);
        ctx.quadraticCurveTo(0, 0, 0, -p.size);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.color === "#d4af37" || p.color === "#c5a880" ? 6 : 0; // Gentle glow for light values
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "screen" }}
      id="global-glitter-canvas"
    />
  );
};

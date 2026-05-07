import React, { useRef, useEffect } from 'react';

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
}

interface PlexusShapeProps {
  backgroundColor: string;
  dotColor: string;
  lineColor: string; // RGB string, e.g. "236, 2, 139"
  className?: string;
  density?: number;
}

const PlexusShape: React.FC<PlexusShapeProps> = ({
  backgroundColor,
  dotColor,
  lineColor,
  className = '',
  density = 60
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);
  const dots = useRef<Dot[]>([]);
  const mouse = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing
    let width = container.clientWidth;
    let height = container.clientHeight;

    const initDots = () => {
      dots.current = [];
      const spacing = 40 - (density / 5); // spacing based on density
      const padding = 10;

      for (let x = padding; x < width - padding; x += spacing) {
        for (let y = padding; y < height - padding; y += spacing) {
          dots.current.push({
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            radius: 1, // smaller dots for premium look
          });
        }
      }
    };

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        canvas.width = width;
        canvas.height = height;
        initDots();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Initial setup
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
    initDots();

    // Mouse interaction relative to canvas
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      // Clear the canvas properly to prevent streaking with transparent backgrounds
      ctx.clearRect(0, 0, width, height);
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      const time = Date.now() / 1000; // Base time for breathing wave

      dots.current.forEach(dot => {
        let targetX = dot.baseX;
        let targetY = dot.baseY;

        // 1. Global Breathing Pulse
        // Creates a slow, organic wave across the grid based on coordinates and time
        const wave = Math.sin(time * 1.5 + (dot.baseX * 0.005) + (dot.baseY * 0.005));
        let dotOpacity = 0.2 + (0.15 * wave); // Breath oscillates between 0.05 and 0.35
        let currentRadius = dot.radius + (0.3 * wave);

        // 2. Interactive Mouse Pulsation
        if (mouse.current.x !== null && mouse.current.y !== null) {
          const dx = mouse.current.x - dot.baseX;
          const dy = mouse.current.y - dot.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxInfluence = 250; // Radius of mouse flashlight effect

          if (dist < maxInfluence) {
            // Force is strongest (1.0) at cursor center, falls off to 0 at edge
            const force = Math.max(0, 1 - dist / maxInfluence);
            // Exponential curve for more dramatic core glow
            const intensity = Math.pow(force, 2);

            // Mild gravity pull towards the mouse
            targetX += (dx / dist) * intensity * 8;
            targetY += (dy / dist) * intensity * 8;

            // Spike opacity and size near mouse
            dotOpacity = Math.min(1, dotOpacity + (intensity * 0.8));
            currentRadius += intensity * 2.5;
          }
        }

        // Apply calculated transformations
        dot.x = targetX;
        dot.y = targetY;

        // Draw dot with calculated opacity
        ctx.globalAlpha = Math.max(0, dotOpacity);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(0.1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = dotColor;

        // Add a neon glow if the dot is highly stimulated (mouse hover)
        if (currentRadius > dot.radius * 2) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = dotColor;
          ctx.fill();
          ctx.shadowBlur = 0; // Reset for performance on normal dots
        } else {
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0; // Reset alpha for next frame

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, [backgroundColor, dotColor, lineColor, density]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default PlexusShape;

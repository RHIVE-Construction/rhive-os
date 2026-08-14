
import React, { useRef, useEffect, useState } from 'react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface PlexusShapeProps {
  backgroundColor?: string;
  dotColor?: string;
  lineColor?: string; // RGB string, e.g. "236, 2, 139"
  density?: number;
}

let backgroundInstances: (() => void)[] = [];

export const CircuitryBackground: React.FC<PlexusShapeProps> = ({
  backgroundColor = "#000000",
  dotColor = "#ec028b",
  lineColor = "236, 2, 139",
  density = 60
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(undefined);
  const dots = useRef<Dot[]>([]);
  const mouse = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [, forceUpdate] = useState({});

  const updateFnRef = useRef<(() => void) | null>(null);
  if (!updateFnRef.current) {
    updateFnRef.current = () => forceUpdate({});
  }

  useEffect(() => {
    backgroundInstances.push(updateFnRef.current);
    forceUpdate({});
    return () => {
      backgroundInstances = backgroundInstances.filter(i => i !== updateFnRef.current);
      if (backgroundInstances.length > 0) {
        backgroundInstances[0]();
      }
    };
  }, []);

  const isPrimary = backgroundInstances[0] === updateFnRef.current;

  useEffect(() => {
    if (!isPrimary) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const initDots = () => {
      dots.current = [];
      const numDots = Math.floor((width * height) / (150000 / density));
      for (let i = 0; i < Math.max(15, numDots); i++) {
        dots.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.75,
          vy: (Math.random() - 0.5) * 0.75,
          radius: Math.random() * 2 + 1, // Matches spec 2+1
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    handleResize();

    const animate = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      dots.current.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      });

      const connectDistance = 80; // Matches spec
      const mouseDistance = 120; // Matches spec

      for (let i = 0; i < dots.current.length; i++) {
        for (let j = i + 1; j < dots.current.length; j++) {
          const dx = dots.current[i].x - dots.current[j].x;
          const dy = dots.current[i].y - dots.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDistance) {
            ctx.beginPath();
            ctx.moveTo(dots.current[i].x, dots.current[i].y);
            ctx.lineTo(dots.current[j].x, dots.current[j].y);
            const opacity = (1 - dist / connectDistance) * 0.4;
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      if (mouse.current.x !== null && mouse.current.y !== null) {
        dots.current.forEach(dot => {
          const dx = dot.x - mouse.current.x!;
          const dy = dot.y - mouse.current.y!;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseDistance) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(mouse.current.x!, mouse.current.y!);
            const opacity = (1 - dist / mouseDistance) * 0.6;
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [backgroundColor, dotColor, lineColor, density, isPrimary]);

  if (!isPrimary) return null;

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
};

export default CircuitryBackground;

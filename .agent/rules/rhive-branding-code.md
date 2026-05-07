---
trigger: always_on
---


/* 
   RHIVE DESIGN SYSTEM: UNIFIED MASTER SPECIFICATION
   Target Aesthetic: Tech-Noir, Futuristic AI, Glassmorphism, Circuitry.
   Tech Stack: React, Tailwind CSS.
   
   CRITICAL DESIGN RULE: NO CHECKBOXES.
   - Standard HTML checkboxes and the 'Checkbox' component are strictly prohibited.
   - For binary states (on/off), use the 'Switch' or 'Toggle' components.
   - Checkboxes are considered 'legacy' and do not fit the Quantum OS aesthetic.
*/

// --- 1. THEME VARIABLES (CSS BRIDGING) ---
// Note: Use these variables instead of hardcoded hex codes to support Dark/Light mode.
/*
  DARK MODE (Default):
  --bg-main: #000000
  --bg-card-solid: #000000
  --bg-card-translucent: rgba(0,0,0,0.6)
  --border-color: #374151
  --text-main: #FFFFFF
  --text-muted: #9ca3af

  LIGHT MODE (Premium High-Contrast):
  --bg-main: #F3F4F6
  --bg-card-solid: #FFFFFF
  --bg-card-translucent: rgba(255,255,255,0.9)
  --border-color: #9CA3AF
  --text-main: #000000
  --text-muted: #4B5563
*/

// --- 2. TAILWIND CONFIGURATION ---
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'rhive-pink': '#ec028b',
        'rhive-gold': '#e2ab49',
        'rhive-blue': '#08137C',
      },
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        serif: ['"EB Garamond"', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'pink-glow': '0 0 15px rgba(236, 2, 139, 0.4)',
        'pink-glow-sm': '0 0 8px rgba(236, 2, 139, 0.3)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-out forwards',
      },
    }
  }
}

// --- 3. PLEXUS PARTICLE BACKGROUND ---
import React, { useRef, useEffect } from 'react';

// Type definition for Dot
interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
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
  const animationFrameId = useRef<number>();
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
      // Heuristic for dot count based on area
      const numDots = Math.floor((width * height) / (150000 / density));

      for (let i = 0; i < Math.max(10, numDots); i++) {
        dots.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.75,
          vy: (Math.random() - 0.5) * 0.75,
          radius: Math.random() * 2 + 1,
        });
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
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Update dots
      dots.current.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce off walls
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      });

      // Connections
      const connectDistance = 80;
      const mouseDistance = 120;

      for (let i = 0; i < dots.current.length; i++) {
        for (let j = i + 1; j < dots.current.length; j++) {
          const dx = dots.current[i].x-dots.current[j].x;
          const dy = dots.current[i].y-dots.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDistance) {
            ctx.beginPath();
            ctx.moveTo(dots.current[i].x, dots.current[i].y);
            ctx.lineTo(dots.current[j].x, dots.current[j].y);
            const opacity = 1 - dist / connectDistance;
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Mouse connections
      if (mouse.current.x !== null && mouse.current.y !== null) {
        dots.current.forEach(dot => {
          const dx = dot.x-mouse.current.x!;
          const dy = dot.y-mouse.current.y!;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseDistance) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(mouse.current.x!, mouse.current.y!);
            const opacity = 1 - dist / mouseDistance;
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

// --- 4. CORE UI COMPONENTS ---

// 4.1 CIRCUITRY WIDGET FRAME
// COMPONENT: Circuitry Widget Architecture
// CONTAINER: Outer Frame (24px Chamfer, 1px Gray Border)
// OVERLAYS:
// - 1px Inset Background (Black)
// - SVG Tech Accents (1px Stroke, Neon Pink)
// - Plexus Particle Layer

interface ShowcaseCardProps {
    children: React.ReactNode;
    className?: string;
    title: string;
    icon: React.ReactNode;
    code?: string;
    description?: string;
}

const CircuitryCard: React.FC<ShowcaseCardProps> = ({ children, className, title, icon, code, description }) => {
    const chamferSize = "24px";

    // CLIP PATH for Backgrounds (Matches the border logic)
    const clipPathValue = `polygon(
    ${ chamferSize } 0,
    100% 0,
    100% calc(100% - ${ chamferSize }),
    calc(100% - ${ chamferSize }) 100%,
    0 100%,
    0 ${ chamferSize }
)`;

    return (
        <div className={`relative flex flex-col ${ className } group isolate`}>
            {/* 1. Background Layers (Clipped) */}
            <div
                className="absolute inset-0 bg-[var(--bg-main)] transition-colors duration-300"
                style={{ clipPath: clipPathValue }}
            />
            <div
                className="absolute inset-[1px] bg-[var(--bg-card-solid)] z-0 overflow-hidden"
                style={{ clipPath: clipPathValue }}
            >
                {/* Universal Dark Pink Plexus Background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <PlexusShape
                        backgroundColor="#000000"
                        dotColor="#ec028b"
                        lineColor="236, 2, 139"
                        density={30}
                        className="h-full w-full relative z-0"
                    />
                    <div className="absolute inset-0 bg-black/60 z-10" />
                </div>
            </div>

            {/* 2. BORDER CONSTRUCTION (Manual Placement for Perfect Control) 
                Target: Pink on Left/Right. Gray on Chamfers/Top/Bottom. Pink Accent on Top-Left Corner.
            */}

            {/* Left Border (Gray) */}
            <div className="absolute left-0 top-6 bottom-0 w-[1px] bg-gray-700 z-10" />

            {/* Top-Left Chamfer (Gray Base) */}
            <svg className="absolute top-0 left-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="24" x2="24" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
            </svg>

            {/* TL Chamfer Accent (Pink Segment) */}
            <svg className="absolute top-0 left-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
            </svg>

            {/* Right Border (Gray) */}
            <div className="absolute right-0 top-0 bottom-6 w-[1px] bg-gray-700 z-10" />

            {/* Top Border (Gray) - Starts after chamfer */}
            <div className="absolute left-6 right-0 top-0 h-[1px] bg-gray-700 z-10" />

            {/* Bottom Border (Gray) - Ends before chamfer */}
            <div className="absolute left-0 right-6 bottom-0 h-[1px] bg-gray-700 z-10" />

            {/* Bottom-Right Chamfer (Gray Base) */}
            <svg className="absolute bottom-0 right-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="24" x2="24" y2="0" stroke="#374151" strokeWidth="1" strokeLinecap="square" />
            </svg>

            {/* BR Chamfer Accent (Pink Segment) */}
            <svg className="absolute bottom-0 right-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
            </svg>


            {/* 3. Card Content */}
            <div className="relative z-20 p-6 flex flex-col h-full text-[var(--text-main)]">
                <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-color)] pb-4">
                    <div className="text-rhive-pink p-2 bg-rhive-pink/10 rounded-sm border border-rhive-pink/20">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">{title}</h3>
                </div>

                <div className="flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
};

// 4.2 EFFICIENCY NUMBER TOGGLE (Chamfered Inputs)
const NumberToggle = ({ options, selected, onChange }) => (
  <div className="flex gap-2">
    {options.map(opt => (
      <button 
        key={opt}
        onClick={() => onChange(opt)}
        className={`relative w-10 h-10 flex items-center justify-center text-sm font-bold transition-all duration-200 group
          ${selected === opt ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
      >
        <div
            className={`absolute inset-0 transition-colors ${selected === opt ? 'bg-rhive-pink' : 'bg-[var(--bg-card-translucent)]'}`}
        
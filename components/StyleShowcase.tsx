import React, { useState, useEffect, useRef } from 'react';
import PlexusShape from './PlexusShape';

// Simple icon placeholder component for StyleShowcase
const IconPlaceholder: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
);

// Create icon namespace with all needed icons as placeholders
const Icons = {
    HomeIcon: IconPlaceholder,
    Trash2: IconPlaceholder,
    Plus: IconPlaceholder,
    Download: IconPlaceholder,
    Upload: IconPlaceholder,
    Search: IconPlaceholder,
    Settings: IconPlaceholder,
    User: IconPlaceholder,
    Mail: IconPlaceholder,
    Phone: IconPlaceholder,
    Calendar: IconPlaceholder,
    Clock: IconPlaceholder,
    MapPin: IconPlaceholder,
    Building: IconPlaceholder,
    File: IconPlaceholder,
    Folder: IconPlaceholder,
    Image: IconPlaceholder,
    Video: IconPlaceholder,
    Music: IconPlaceholder,
    Code: IconPlaceholder,
    Database: IconPlaceholder,
    Server: IconPlaceholder,
    Cloud: IconPlaceholder,
    Lock: IconPlaceholder,
    Unlock: IconPlaceholder,
    Key: IconPlaceholder,
    Shield: IconPlaceholder,
    AlertCircle: IconPlaceholder,
    CheckCircle: IconPlaceholder,
    Info: IconPlaceholder,
    X: IconPlaceholder,
    Check: IconPlaceholder,
    ChevronDown: IconPlaceholder,
    ChevronUp: IconPlaceholder,
    ChevronLeft: IconPlaceholder,
    ChevronRight: IconPlaceholder,
    ArrowLeft: IconPlaceholder,
    ArrowRight: IconPlaceholder,
    ArrowUp: IconPlaceholder,
    ArrowDown: IconPlaceholder,
    ExternalLink: IconPlaceholder,
    Link: IconPlaceholder,
    Copy: IconPlaceholder,
    Edit: IconPlaceholder,
    Trash: IconPlaceholder,
    Save: IconPlaceholder,
    Refresh: IconPlaceholder,
    MoreVertical: IconPlaceholder,
    MoreHorizontal: IconPlaceholder,
    Menu: IconPlaceholder,
    Grid: IconPlaceholder,
    List: IconPlaceholder,
    Filter: IconPlaceholder,
    Sort: IconPlaceholder,
    Star: IconPlaceholder,
    Heart: IconPlaceholder,
    Bookmark: IconPlaceholder,
    Tag: IconPlaceholder,
    Flag: IconPlaceholder,
    Bell: IconPlaceholder,
    Notification: IconPlaceholder,
    Message: IconPlaceholder,
    Send: IconPlaceholder,
    Inbox: IconPlaceholder,
    Archive: IconPlaceholder,
    Trash2Icon: IconPlaceholder,
    Eye: IconPlaceholder,
    EyeOff: IconPlaceholder,
    Zap: IconPlaceholder,
    Target: IconPlaceholder,
    TrendingUp: IconPlaceholder,
    TrendingDown: IconPlaceholder,
    Activity: IconPlaceholder,
    BarChart: IconPlaceholder,
    PieChart: IconPlaceholder,
    LineChart: IconPlaceholder,
    Layers: IconPlaceholder,
    Layout: IconPlaceholder,
    Maximize: IconPlaceholder,
    Minimize: IconPlaceholder,
    Sidebar: IconPlaceholder,
    Package: IconPlaceholder,
    Box: IconPlaceholder,
    Briefcase: IconPlaceholder,
    ShoppingCart: IconPlaceholder,
    CreditCard: IconPlaceholder,
    DollarSign: IconPlaceholder,
    Percent: IconPlaceholder,
    Hash: IconPlaceholder,
    AtSign: IconPlaceholder,
    Globe: IconPlaceholder,
    Wifi: IconPlaceholder,
    Bluetooth: IconPlaceholder,
    Battery: IconPlaceholder,
    Power: IconPlaceholder,
    Sun: IconPlaceholder,
    Moon: IconPlaceholder,
    CloudRain: IconPlaceholder,
    CloudSnow: IconPlaceholder,
    Wind: IconPlaceholder,
    Droplet: IconPlaceholder,
    Thermometer: IconPlaceholder,
    Umbrella: IconPlaceholder,
    Coffee: IconPlaceholder,
    Smile: IconPlaceholder,
    Frown: IconPlaceholder,
    Meh: IconPlaceholder,
    ThumbsUp: IconPlaceholder,
    ThumbsDown: IconPlaceholder,
    Award: IconPlaceholder,
    Gift: IconPlaceholder,
    Truck: IconPlaceholder,
    Anchor: IconPlaceholder,
    Aperture: IconPlaceholder,
    Disc: IconPlaceholder,
    Radio: IconPlaceholder,
    Tv: IconPlaceholder,
    Monitor: IconPlaceholder,
    Smartphone: IconPlaceholder,
    Tablet: IconPlaceholder,
    Watch: IconPlaceholder,
    Headphones: IconPlaceholder,
    Mic: IconPlaceholder,
    Camera: IconPlaceholder,
    Film: IconPlaceholder,
    Printer: IconPlaceholder,
    HardDrive: IconPlaceholder,
    Cpu: IconPlaceholder,
    Feather: IconPlaceholder,
    Pen: IconPlaceholder,
    Tool: IconPlaceholder,
    Wrench: IconPlaceholder,
    Scissors: IconPlaceholder,
    Paperclip: IconPlaceholder,
    Type: IconPlaceholder,
    Bold: IconPlaceholder,
    Italic: IconPlaceholder,
    Underline: IconPlaceholder,
    AlignLeft: IconPlaceholder,
    AlignCenter: IconPlaceholder,
    AlignRight: IconPlaceholder,
    AlignJustify: IconPlaceholder,
    Columns: IconPlaceholder,
    Sidebar2: IconPlaceholder,
    PanelLeft: IconPlaceholder,
    PanelRight: IconPlaceholder,
    HelpCircle: IconPlaceholder,
    RefreshCw: IconPlaceholder,
    HeartIcon: IconPlaceholder,
    RhiveLogo: IconPlaceholder,
    XMarkIcon: IconPlaceholder,
    DocumentTextIcon: IconPlaceholder,
    Databases: IconPlaceholder,
};

// -- 1. SYSTEM DEFINITIONS (For Display & Master Prompt) --

const TAILWIND_CONFIG = `tailwind.config = {
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
}`;

const PLEXUS_COMPONENT = `import React, { useRef, useEffect } from 'react';

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
            ctx.strokeStyle = \`rgba(\${lineColor}, \${opacity})\`;
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
            ctx.strokeStyle = \`rgba(\${lineColor}, \${opacity})\`;
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
    <div ref={containerRef} className={\`relative w-full h-full overflow-hidden \${className}\`}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default PlexusShape;`;

const CIRCUITRY_CARD_COMPONENT = `// COMPONENT: Circuitry Widget Architecture
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
    const clipPathValue = \`polygon(
    \${ chamferSize } 0,
    100% 0,
    100% calc(100% - \${ chamferSize }),
    calc(100% - \${ chamferSize }) 100%,
    0 100%,
    0 \${ chamferSize }
)\`;

    return (
        <div className={\`relative flex flex-col \${ className } group isolate\`}>
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
};`;

const MASTER_SYSTEM_PROMPT = `
/* 
   RHIVE DESIGN SYSTEM: UNIFIED MASTER SPECIFICATION
   Target Aesthetic: Tech-Noir, Futuristic AI, Glassmorphism, Circuitry.
   Tech Stack: React, Tailwind CSS.
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
${TAILWIND_CONFIG}

// --- 3. PLEXUS PARTICLE BACKGROUND ---
${PLEXUS_COMPONENT}

// --- 4. CORE UI COMPONENTS ---

// 4.1 CIRCUITRY WIDGET FRAME
${CIRCUITRY_CARD_COMPONENT}

// 4.2 EFFICIENCY NUMBER TOGGLE (Chamfered Inputs)
const NumberToggle = ({ options, selected, onChange }) => (
  <div className="flex gap-2">
    {options.map(opt => (
      <button 
        key={opt}
        onClick={() => onChange(opt)}
        className={\`relative w-10 h-10 flex items-center justify-center text-sm font-bold transition-all duration-200 group
          \${selected === opt ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}\`}
      >
        <div
            className={\`absolute inset-0 transition-colors \${selected === opt ? 'bg-rhive-pink' : 'bg-[var(--bg-card-translucent)]'}\`}
            style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
        />
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
                d="M 6 0 L 40 0 L 40 34 L 34 40 L 0 40 L 0 6 Z"
                fill="none"
                stroke={selected === opt ? "#ec028b" : "var(--border-color)"}
                strokeWidth="1"
            />
        </svg>
        <span className="relative z-10">{opt}</span>
      </button>
    ))}
  </div>
);

// --- 5. DESIGN PRINCIPLES ---
// 1. Chamfers: Every major container must have 24px chamfers on Top-Left and Bottom-Right.
// 2. Neon Accents: Use #ec028b (Rhive Pink) sparingly for interactive "active" states or micro-accents.
// 3. Typography: Titles use Rubik (700/800), Data uses Monospace, Reports use EB Garamond.
// 4. Motion: Use 'fade-in' animation on page load. Pulse effects on active status indicators.
`;

const TYPOGRAPHY_CODE = `// COMPONENT: Typography & Layout
// CONTAINER: Circuitry Card (24px Chamfer, 1px Gray Border)
// CONTENT SPECS:
fontFamily: {
  sans: ['Rubik', 'sans-serif'], // UI Elements
  serif: ['"EB Garamond"', 'serif'], // Long form text
  mono: ['ui-monospace', 'monospace'], // Data display
}`;

const INTERACTIVE_CODE = `// COMPONENT: Text Input Field
// CONTAINER: Circuitry Card (Chamfered)
// INPUT FIELD SPECS:
// - Shape: Chamfered 8px (via SVG Overlay & ClipPath)
// - Background: bg-black (High contrast)
// - Border: SVG Overlay (Gray-700 inactive, Rhive-Pink active)
// - Focus State: Pink SVG Stroke + Pink Glow Shadow
// - Note: Use <ChamferedInput /> component for consistent rendering

/* Moved to Efficiency UI as part of layout consolidation */`;

const NUMBER_SELECTOR_CODE = `// COMPONENT: Efficiency Number Toggle
// CONTAINER: Flexible Row
// BUTTON SPECS:
// - Dimensions: 10x10 (w-10 h-10)
// - Shape: Chamfered 6px (polygon clip-path)
// - Border: 1px Solid (Gray-700 inactive, Rhive-Pink active)
// - Background: Black/60 (inactive), Rhive-Pink (active)

const NumberToggle = ({ options, selected, onChange }: { options: string[], selected: string, onChange: (val: string) => void }) => (
    <div className="flex gap-2">
        {options.map((opt) => {
            const isActive = selected === opt;
            return (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={\`relative w-10 h-10 flex items-center justify-center text-sm font-bold transition-all duration-200 group
              \${ isActive ? 'text-white shadow-[0_0_10px_rgba(236,2,139,0.3)]' : 'text-gray-500 hover:text-white' } \`}
                >
                    {/* Background Layer */}
                    <div
                        className={\`absolute inset-0 transition-colors duration-200 
                  \${ isActive ? 'bg-rhive-pink' : 'bg-[var(--bg-card-translucent)] group-hover:bg-[var(--bg-card-overlay)]' } \`}
                        style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                    />

                    {/* SVG Border Layer (Solid Stroke) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        <path
                            d="M 6 0 L 40 0 L 40 34 L 34 40 L 0 40 L 0 6 Z"
                            fill="none"
                            stroke={isActive ? "#ec028b" : "var(--border-color)"}
                            strokeWidth="1"
                            strokeLinecap="square"
                            className={\`transition-colors duration-200 \${ !isActive && 'group-hover:stroke-[var(--text-main)]' } \`}
                        />
                    </svg>

                    <span className="relative z-10">{opt}</span>
                </button>
            );
        })}
    </div>
);`;

const ASSET_MANAGER_CODE = `// COMPONENT: Image Asset Card
// CONTAINER: Circuitry Card (24px Chamfer, 1px Gray Border)
// INNER CARD SPECS:
// - Design: Hexagon Shape Clip Path
// - Background: bg-black/60
// - Border: Simulated via SVG or container

// Note: This is an extract of the core Asset display logic.
// See ImageLinkBuilder for full drag-and-drop implementation.

const AssetGrid = ({ assets, onDelete, onCopy }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {assets.map((asset) => (
            <div key={asset.id} className="bg-[var(--bg-card-translucent)] border border-[var(--border-color)] rounded-sm p-3 flex gap-3 items-start group hover:border-rhive-pink/30 transition-colors relative">
                {/* HEXAGON CONTAINER FOR ASSET */}
                <div
                    className="w-16 h-16 bg-[var(--bg-card-solid)] flex items-center justify-center overflow-hidden border-0 relative shrink-0"
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                    {/* Transparent BG Checker pattern simulation */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] [background-size:8px_8px]"></div>
                    <img src={asset.url} alt={asset.name} className="max-w-[70%] max-h-[70%] object-contain relative z-10" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--text-main)] truncate" title={asset.name}>{asset.name}</p>
                    <div className="flex items-center justify-between mt-0.5">
                        <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase">{asset.type}</p>
                        {!asset.isSystem && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(asset.id); }}
                                className="text-gray-600 hover:text-red-500"
                                title="Delete Asset"
                            >
                                <Icons.Trash2 className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onCopy(asset.url, 'url')}
                            className="flex-1 text-[10px] bg-gray-800 hover:bg-rhive-pink hover:text-white text-gray-400 px-2 py-1 rounded-sm transition-colors border border-gray-700"
                        >
                            URL
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);`;

const PALETTE_CODE = `// COMPONENT: Color Palette
// SHAPE: Hexagon (Polygon Clip Path)
// BORDER: 1px via container
colors: {
  'rhive-pink': '#ec028b',
  'rhive-gold': '#e2ab49',
  'rhive-blue': '#08137C',
}`;

const LAYOUT_CODE = `// COMPONENT: Circuitry Widget Architecture
// CONTAINER: Outer Frame (24px Chamfer, 1px Gray Border)
// OVERLAYS:
// - 1px Inset Background (Black)
// - SVG Tech Accents (1px Stroke, Neon Pink)
// - Plexus Particle Layer

const CircuitryCard = ({ title, children }) => {
  // Chamfer Shape
  // Chamfer Shape (Top-Left & Bottom-Right)
  const clipStyle = {
    clipPath: "polygon(24px 0, 100% 0, 100% 100%, calc(100% - 24px) 100%, 0 100%, 0 24px)"
  };
  // ... implementation
};`;

const PLEXUS_FULL_CODE = `import React, { useRef, useEffect } from 'react';
// ... (Standard Plexus Implementation)
export default PlexusShape;`;

const TAILWIND_FULL_CODE = `module.exports = {
  theme: {
    extend: {
      colors: {
        'rhive-pink': '#ec028b',
        // ...
      },
      // ...
    }
  }
};`;

const DATA_CODE = `// COMPONENT: Data Metric Card
// CONTAINER: Circuitry Card
// CONTENT SPECS:
// - Value: Font Mono (Rubik/Space Mono)
// - Trend: Font Mono + Arrow Indicator
// - Visualization: SVG Line Chart (Non-scaling stroke)

<div className="bg-[var(--bg-card-overlay)] border border-[var(--border-color)] p-4 rounded-lg flex flex-col justify-between h-32 relative overflow-hidden group hover:border-rhive-pink/50 transition-colors">
    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 rounded-full bg-rhive-pink animate-pulse"></div>
    </div>
    <div>
        <div className="text-xs text-[var(--text-muted)] uppercase font-medium">Monthly Revenue</div>
        <div className="text-2xl font-mono text-[var(--text-main)] mt-1">$3.2M</div>
    </div>
    <div className="text-xs text-rhive-pink flex items-center gap-1 font-mono">
        ▲ 12% <span className="text-[var(--text-muted)] font-sans">vs last month</span>
    </div>
    {/* SVG Chart Overlay */}
    <svg className="absolute bottom-0 left-0 w-full h-12 opacity-30" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 30 L20 25 L40 32 L60 15 L80 20 L100 5" fill="none" stroke="#ec028b" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M0 30 L20 25 L40 32 L60 15 L80 20 L100 5 V 40 H 0 Z" fill="url(#grad1)" stroke="none" />
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ec028b', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: '#ec028b', stopOpacity: 0 }} />
            </linearGradient>
        </defs>
    </svg>
</div>`;

const VISUAL_FX_CODE = `// COMPONENT: Plexus Visual FX
// PROPS:
// - backgroundColor: Hex Color (Background)
// - dotColor: Hex Color (Particles)
// - lineColor: RGB String (Lines, for opacity handling)

// EXAMPLE 1: Dark Pink (Standard)
<PlexusShape 
    backgroundColor="#000000" 
    dotColor="#ec028b" 
    lineColor="236, 2, 139" 
/>

// EXAMPLE 2: Light Pink (Inverted)
<PlexusShape 
    backgroundColor="#FFFFFF" 
    dotColor="#ec028b" 
    lineColor="236, 2, 139" 
/>

// EXAMPLE 3: Light Gold (Accent)
<PlexusShape 
    backgroundColor="#FFFFFF" 
    dotColor="#e2ab49" 
    lineColor="226, 171, 73" 
/>`;


// --- Helpers & Hooks ---


function useElementSize<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        if (!ref.current) return;
        const observer = new ResizeObserver((entries) => {
            // Use borderBoxSize for accuracy including padding/border, fallback to getBoundingClientRect
            const entry = entries[0];
            let width, height;

            if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
                width = entry.borderBoxSize[0].inlineSize;
                height = entry.borderBoxSize[0].blockSize;
            } else {
                const rect = entry.target.getBoundingClientRect();
                width = rect.width;
                height = rect.height;
            }

            setSize({ width, height });
        });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return { ref, width: size.width, height: size.height };
}

const ChamferedBorder = ({ width, height, chamfer = 12, stroke = "currentColor", strokeWidth = 1, dashed = false, className = "" }: any) => {
    if (width === 0 || height === 0) return null;
    // Top-Left and Bottom-Right Chamfer only (Rhive Style)
    // Path: Start (0, chamfer) -> (chamfer, 0) -> (width, 0) -> (width, height-chamfer) -> (width-chamfer, height) -> (0, height) -> Close
    const path = `
        M 0 ${chamfer}
        L ${chamfer} 0 
        L ${width} 0 
        L ${width} ${height - chamfer} 
        L ${width - chamfer} ${height} 
        L 0 ${height}
Z
    `;
    return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible ${className} `}>
            <path
                d={path}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={dashed ? "8 6" : undefined}
                strokeLinecap="square"
            />
        </svg>
    );
};

// --- Data & Constants ---

// -- Components --

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
    <div className="mt-6 bg-[var(--bg-code)] border border-[var(--border-color)] overflow-hidden relative z-20">
        <div className="flex justify-between items-center px-4 py-2 bg-[var(--bg-card-overlay)] border-b border-[var(--border-color)]">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Design Spec / Code</span>
            <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-xs font-medium text-rhive-pink hover:opacity-80 transition-opacity"
                title="Copy to clipboard"
            >
                COPY CODE
            </button>
        </div>
        <div className="p-4 overflow-x-auto max-h-96">
            <pre className="text-xs font-mono text-[var(--text-main)] leading-relaxed whitespace-pre-wrap selection:bg-rhive-pink/30 selection:text-white opacity-80">
                {code}
            </pre>
        </div>
    </div>
);

interface ShowcaseCardProps {
    children: React.ReactNode;
    className?: string;
    title: string;
    icon: React.ReactNode;
    code?: string;
    description?: string;
}

// Updated Component with "Tech-Noir" Chamfers (TL & BR) & Pink Accents
// Updated Component with "Tech-Noir" Chamfers (TL & BR) & Pink Accents
const ShowcaseCard: React.FC<ShowcaseCardProps & { isDark?: boolean }> = ({ children, className, title, icon, code, description, isDark = true }) => {
    const chamferSize = "24px";

    // Dynamic Colors based on isDark prop (for Plexus/SVG that can't use CSS vars easily)
    // Note: Main DOM elements use CSS variables defined in StyleShowcase
    const plexusBg = isDark ? "#000000" : "#FFFFFF"; // Solid background for canvas
    const plexusDot = isDark ? "#ec028b" : "#ec028b"; // Keep pink dots
    const plexusLine = isDark ? "236, 2, 139" : "236, 2, 139";

    // SVG Strokes
    const strokeMain = isDark ? "#374151" : "#e5e7eb"; // gray-700 vs gray-200

    // CLIP PATH for Backgrounds
    const clipPathValue = `polygon(
    ${chamferSize} 0,
    100% 0,
    100% calc(100% - ${chamferSize}),
    calc(100% - ${chamferSize}) 100%,
    0 100%,
    0 ${chamferSize}
)`;

    return (
        <div className={`relative flex flex-col ${className} group isolate`}>
            {/* 1. Background Layers (Clipped) */}
            <div
                className="absolute inset-0 bg-[var(--bg-card-solid)] transition-colors duration-300"
                style={{ clipPath: clipPathValue }}
            />
            <div
                className="absolute inset-[1px] bg-[var(--bg-card-solid)] z-0 overflow-hidden"
                style={{ clipPath: clipPathValue }}
            >
                {/* Plexus Background */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                    <PlexusShape
                        backgroundColor={plexusBg}
                        dotColor={plexusDot}
                        lineColor={plexusLine}
                        density={30}
                        className="h-full w-full relative z-0"
                    />
                    <div className="absolute inset-0 bg-[var(--bg-card-overlay)] z-10" />
                </div>
            </div>

            {/* 2. BORDER CONSTRUCTION (Manual Placement) */}
            {/* Left Border */}
            <div className="absolute left-0 top-6 bottom-0 w-[1px] bg-[var(--border-color)] z-10" />

            {/* Top-Left Chamfer */}
            <svg className="absolute top-0 left-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="24" x2="24" y2="0" stroke={strokeMain} strokeWidth="1" strokeLinecap="square" />
            </svg>

            {/* TL Chamfer Accent */}
            <svg className="absolute top-0 left-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
            </svg>

            {/* Right Border */}
            <div className="absolute right-0 top-0 bottom-6 w-[1px] bg-[var(--border-color)] z-10" />

            {/* Top Border */}
            <div className="absolute left-6 right-0 top-0 h-[1px] bg-[var(--border-color)] z-10" />

            {/* Bottom Border */}
            <div className="absolute left-0 right-6 bottom-0 h-[1px] bg-[var(--border-color)] z-10" />

            {/* Bottom-Right Chamfer */}
            <svg className="absolute bottom-0 right-0 w-6 h-6 z-10 overflow-visible pointer-events-none">
                <line x1="0" y1="24" x2="24" y2="0" stroke={strokeMain} strokeWidth="1" strokeLinecap="square" />
            </svg>

            {/* BR Chamfer Accent */}
            <svg className="absolute bottom-0 right-0 w-6 h-6 z-20 overflow-visible pointer-events-none">
                <line x1="8" y1="16" x2="16" y2="8" stroke="#ec028b" strokeWidth="2" strokeLinecap="square" className="drop-shadow-[0_0_3px_rgba(236,2,139,0.8)]" />
            </svg>

            {/* 3. Card Content */}
            <div className="relative z-20 p-6 flex flex-col h-full text-[var(--text-main)]">
                <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-color)] pb-4">
                    <div className="text-rhive-pink p-2 bg-rhive-pink/10 rounded-sm border border-rhive-pink/20">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-[var(--text-main)]">{title}</h3>
                </div>

                {/* Description */}
                {description && (
                    <div className="mb-6 relative overflow-hidden group/desc">
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-rhive-blue to-transparent"></div>
                        <div className="bg-gradient-to-r from-rhive-blue/10 to-transparent p-4 pl-5 rounded-r-sm border border-l-0 border-[var(--border-color)]">
                            <h4 className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                Design Logic
                            </h4>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed font-sans opacity-90">
                                {description}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex-grow">
                    {children}
                </div>
                {code && <CodeBlock code={code} />}
            </div>
        </div>
    );
};

const SimpleTooltip = ({ children, content }: { children: React.ReactNode, content: string }) => {
    return (
        <div className="relative group/tooltip inline-block">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--bg-card-solid)] border border-[var(--border-color)] rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                <p className="text-xs text-[var(--text-main)] text-center">{content}</p>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--border-color)]" />
            </div>
        </div>
    );
};

const ColorSwatch = ({ name, hex, textColor = "text-gray-500" }: { name: string, hex: string, textColor?: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group text-center cursor-pointer" onClick={handleCopy}>
            <div className="relative">
                {/* Hexagon Shape for Color Box */}
                <div
                    className={`w-16 h-16 mx-auto flex items-center justify-center relative shadow-pink-glow-sm transition-transform duration-300 group-hover:scale-110`}
                    style={{
                        backgroundColor: hex,
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                    }}
                >
                    {/* Inner Border for visibility on dark/light backgrounds */}
                    <div className="absolute inset-0 border-2 border-white/20" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                </div>

                {/* Copied Overlay */}
                <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 z-20 ${copied ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="bg-[var(--bg-card-solid)] text-[var(--text-main)] text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm shadow-xl border border-[var(--border-color)]">
                        COPIED
                    </div>
                </div>
            </div>

            <p className={`mt-3 text-xs font-bold text-[var(--text-main)] transition-colors group-hover:text-rhive-pink`}>{name}</p>
            <p className={`text-[10px] font-mono text-[var(--text-muted)]`}>{hex}</p>
        </div>
    );
};

// --- Reusable Chamfered Input Component ---
interface ChamferedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

const ChamferedInput = React.forwardRef<HTMLInputElement, ChamferedInputProps>(({ className, icon, onFocus, onBlur, ...props }, ref) => {
    const { ref: containerRef, width, height } = useElementSize<HTMLDivElement>();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div ref={containerRef} className={`relative w-full h-12 group ${className || ''}`}>
            {/* SVG Border Overlay */}
            <ChamferedBorder
                width={width}
                height={height}
                chamfer={8} // Smaller chamfer for inputs
                stroke={isFocused ? "#ec028b" : "var(--border-color)"}
                strokeWidth={1}
                className={`transition-colors duration-200 pointer-events-none ${!isFocused && 'group-hover:stroke-[var(--text-muted)]'}`}
            />

            {/* Background (Clipped) */}
            <div
                className="absolute inset-0 bg-[var(--input-bg,var(--bg-card-solid))] pointer-events-none"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
            />

            {/* Glow Effect on Focus */}
            <div
                className={`absolute inset-0 transition-opacity duration-200 pointer-events-none -z-10 ${isFocused ? 'opacity-100 shadow-[0_0_10px_rgba(236,2,139,0.2)]' : 'opacity-0'}`}
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
            />

            {/* Input Element */}
            <div className="relative z-10 w-full h-full flex items-center">
                {icon && <div className="pl-4 text-[var(--text-muted)]">{icon}</div>}
                <input
                    ref={ref}
                    {...props}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full h-full bg-transparent border-none outline-none text-[var(--text-main)] placeholder-[var(--text-muted)] px-4 ${icon ? 'pl-2' : ''} text-sm font-sans`}
                />
            </div>
        </div>
    );
});
ChamferedInput.displayName = 'ChamferedInput';

// --- Helper Components for Estimation UI ---

const NumberToggle = ({ options, selected, onChange }: { options: string[], selected: string, onChange: (val: string) => void }) => (
    <div className="flex gap-2">
        {options.map((opt) => {
            const isActive = selected === opt;
            return (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`relative w-10 h-10 flex items-center justify-center text-sm font-bold transition-all duration-200 group/toggle
              ${isActive ? 'text-white shadow-pink-glow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'} `}
                    style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                >
                    {/* Background Layer */}
                    <div
                        className={`absolute inset-0 transition-colors duration-200 
                  ${isActive ? 'bg-rhive-pink' : 'bg-[var(--bg-card-translucent)] group-hover/toggle:bg-[var(--bg-card-overlay)]'} `}
                    />

                    {/* SVG Border Layer (Solid Stroke) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        <path
                            d="M 6 0 L 40 0 L 40 34 L 34 40 L 0 40 L 0 6 Z"
                            fill="none"
                            stroke={isActive ? "#ec028b" : "var(--border-color)"}
                            strokeWidth="1.5"
                            strokeLinecap="square"
                            className={`transition-colors duration-200 ${!isActive && 'group-hover/toggle:stroke-[var(--text-main)]'} `}
                        />
                    </svg>

                    <span className="relative z-10">{opt}</span>
                </button>
            );
        })}
    </div>
);

const BuildingCard = ({ label, sqft, selected, onToggle }: { label: string, sqft: string, selected: boolean, onToggle: () => void }) => {
    // Logic: 
    // OFF -> Title Pink, Border Gray, BG Dark (Black/40)
    // ON -> Title White, Border Pink, BG Glass (Pink/10)
    const chamfer = 12;

    return (
        <div
            onClick={onToggle}
            className={`cursor-pointer relative w-40 h-24 flex flex-col justify-center p-4 transition-all group/building`}
        >
            {/* Background Layer (Clipped) */}
            <div
                className={`absolute inset-0 transition-colors duration-300
                    ${selected ? 'bg-rhive-pink shadow-pink-glow-sm' : 'bg-[var(--bg-card-translucent)] group-hover/building:bg-[var(--bg-card-overlay)]'}
`}
                style={{ clipPath: `polygon(${chamfer}px 0, 100% 0, 100% calc(100% - ${chamfer}px), calc(100% - ${chamfer}px) 100%, 0 100%, 0 ${chamfer}px)` }}
            />

            {/* SVG Border Layer (Solid Stroke) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
                <path
                    d={`M ${chamfer} 0 L 160 0 L 160 ${96 - chamfer} L ${160 - chamfer} 96 L 0 96 L 0 ${chamfer} Z`}
                    fill="none"
                    stroke={selected ? "#ec028b" : "var(--border-color)"}
                    strokeWidth="1"
                    strokeLinecap="square"
                    className={`transition-colors duration-200 ${!selected && 'group-hover/building:stroke-[var(--text-main)]'} `}
                />
            </svg>



            {/* Content */}
            <div className="relative z-20 pl-2 text-center w-full">
                <h4 className={`font-bold text-sm transition-colors ${selected ? 'text-white' : 'text-rhive-pink'} `}>
                    {label}
                </h4>
                <span className="text-xs font-mono text-[var(--text-muted)] mt-1 block">{sqft} SQ</span>
            </div>
        </div>
    );
};

// --- Estimation UI Showcase ---
const EstimationPreview = () => {
    const [layers, setLayers] = useState('1');
    const [counts, setCounts] = useState({ chimneys: '0', swamp: '0', skylights: '0' });
    const [selectedBuildings, setSelectedBuildings] = useState<Set<string>>(new Set(['Main House']));
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Google Places Autocomplete Implementation
    useEffect(() => {
        const loadScript = (url: string, callback: () => void) => {
            const existingScript = document.querySelector(`script[src="${url}"]`);
            if (existingScript) {
                if ((window as any).google && (window as any).google.maps) {
                    callback();
                } else {
                    existingScript.addEventListener('load', callback);
                }
                return;
            }
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.async = true;
            script.defer = true;
            script.onload = callback;
            document.head.appendChild(script);
        };

        const initAutocomplete = () => {
            if (!inputRef.current || !(window as any).google) return;

            const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
                types: ['address'],
                componentRestrictions: { country: 'us' }, // Start with US restriction, remove if international needed
                fields: ['address_components', 'geometry', 'formatted_address']
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                console.log("Selected Place:", place);
                if (place.formatted_address) {
                    // You could setState here if you need to store the address address
                    // setAddress(place.formatted_address); 
                }
            });
        };

        const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
        if (apiKey) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`,
                initAutocomplete
            );
        } else {
            console.warn("Google Maps API Key not found in environment variables.");
        }
    }, []);

    const toggleBuilding = (name: string) => {
        const newSet = new Set(selectedBuildings);
        if (newSet.has(name)) newSet.delete(name);
        else newSet.add(name);
        setSelectedBuildings(newSet);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const capitalized = val.replace(/\b\w/g, char => char.toUpperCase());
        setName(capitalized);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 10) val = val.slice(0, 10);

        // Format (XXX) XXX-XXXX
        let formatted = val;
        if (val.length > 6) {
            formatted = `(${val.slice(0, 3)}) ${val.slice(3, 6)} -${val.slice(6)} `;
        } else if (val.length > 3) {
            formatted = `(${val.slice(0, 3)}) ${val.slice(3)} `;
        } else if (val.length > 0) {
            formatted = `(${val}`;
        }

        setPhone(formatted);
    };

    return (
        <div className="space-y-8">
            {/* Building Select */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-[var(--text-muted)]">Select buildings to include in estimate:</h4>
                <div className="flex flex-wrap gap-4">
                    <BuildingCard
                        label="Main House"
                        sqft="25.18"
                        selected={selectedBuildings.has('Main House')}
                        onToggle={() => toggleBuilding('Main House')}
                    />
                    <BuildingCard
                        label="Outbuilding 1"
                        sqft="5.04"
                        selected={selectedBuildings.has('Outbuilding 1')}
                        onToggle={() => toggleBuilding('Outbuilding 1')}
                    />
                </div>
            </div>

            {/* Main Option Card */}
            <div className="relative group">
                {/* Outer Border (1px) */}
                <div
                    className="absolute inset-0 bg-[var(--border-color)]"
                    style={{ clipPath: "polygon(24px 0, 100% 0, 100% 100%, calc(100% - 24px) 100%, 0 100%, 0 24px)" }}
                />
                {/* Inner Content (Inset 1px) - FIXED BG to Black */}
                <div
                    className="relative bg-[var(--bg-card-solid)] p-8 inset-[1px]"
                    style={{
                        clipPath: "polygon(24px 0, 100% 0, 100% 100%, calc(100% - 24px) 100%, 0 100%, 0 24px)",
                        height: "calc(100% - 2px)",
                        width: "calc(100% - 2px)",
                        borderBottom: "1px solid var(--border-color)" // Forcing bottom border visibility if clip-path cuts it
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-sm bg-rhive-pink/20 border border-rhive-pink flex items-center justify-center text-rhive-pink">
                            <Icons.HomeIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text-main)]">Project Details</h3>
                    </div>

                    {/* Inputs Section */}
                    <div className="mb-8 space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-muted)]">Your Name</label>
                            <ChamferedInput
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Phone Input - NEW */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-muted)]">Phone Number</label>
                            <ChamferedInput
                                type="text"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="(555) 555-5555"
                                className="font-mono"
                            />
                        </div>

                        {/* Address Input - with Google Autocomplete */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-muted)] flex justify-between">
                                Project Address
                                <span className="text-[10px] text-blue-400 flex items-center gap-1"><Icons.MapPin className="w-3 h-3" /> Auto-fill active</span>
                            </label>
                            <div className="relative">
                                {/* Wrap in relative for absolute icon? No, ChamferedInput handles icon prop */}
                                <ChamferedInput
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Start typing address..."
                                    icon={<Icons.MapPin className="w-4 h-4" />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Layer Count */}
                    <div className="mb-8">
                        <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3 block">Roof Options</h4>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">
                            How many layers are on your project?*
                            <SimpleTooltip content="Each layer of existing roofing material adds to the removal cost.">
                                <Icons.HelpCircle className="inline w-4 h-4 ml-1 text-[var(--text-muted)] hover:text-rhive-pink transition-colors cursor-help" />
                            </SimpleTooltip>
                        </label>
                        <NumberToggle
                            options={['1', '2', '3', '4', 'IDK', 'Other']}
                            selected={layers}
                            onChange={setLayers}
                        />
                    </div>

                    <div className="h-px bg-[var(--border-color)] w-full mb-8" />

                    {/* Feature Counts */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-medium text-[var(--text-muted)]">Indicate the quantity of each feature:</h4>

                        {[
                            { id: 'chimneys', label: 'Chimneys' },
                            { id: 'swamp', label: 'Swamp Coolers' },
                            { id: 'skylights', label: 'Skylights' }
                        ].map((feature) => (
                            <div key={feature.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-[var(--border-color)] rounded-sm bg-[var(--bg-card-translucent)]">
                                <span className="text-[var(--text-muted)] flex items-center gap-2">
                                    {feature.label}
                                    <SimpleTooltip content={`Specify the number of ${feature.label.toLowerCase()} to be flashed or replaced.`}>
                                        <Icons.HelpCircle className="w-4 h-4 text-[var(--text-muted)] hover:text-rhive-pink transition-colors cursor-help" />
                                    </SimpleTooltip>
                                </span>
                                <NumberToggle
                                    options={['0', '1', '2', '3', '4+']}
                                    // @ts-ignore
                                    selected={counts[feature.id]}
                                    // @ts-ignore
                                    onChange={(val) => setCounts(prev => ({ ...prev, [feature.id]: val }))}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-[var(--border-color)] w-full my-8" />

                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Estimated Total</span>
                        <span className="text-[10px] font-mono text-rhive-pink uppercase tracking-wider animate-pulse">Live Spec</span>
                    </div>
                    <div className="text-4xl font-bold text-[var(--text-main)] font-mono">$24,500.00</div>
                </div>
            </div>

            {/* CTA Buttons - Back & Continue */}
            <div className="flex justify-center gap-4 pb-1">
                {<CTAButtons />}
            </div>
        </div>
    );
};

// Extracted Sub-component to manage ResizeObservers cleanly
const CTAButtons = () => {
    const { ref: backRef, width: backW, height: backH } = useElementSize<HTMLButtonElement>();
    const { ref: contRef, width: contW, height: contH } = useElementSize<HTMLButtonElement>();

    return (
        <>
            {/* Back Button (Unselected Style) */}
            <button
                ref={backRef}
                onClick={() => { }} // Add handler if needed
                className="relative group/cta w-48 h-12 flex items-center justify-center text-[var(--text-muted)] font-bold text-lg hover:text-[var(--text-main)] transition-all transform hover:scale-105"
            >
                {/* SVG Border Overlay */}
                <ChamferedBorder
                    width={backW}
                    height={backH}
                    chamfer={12}
                    stroke="var(--border-color)"
                    className="group-hover/cta:stroke-[var(--text-muted)] transition-colors"
                />

                {/* Clip Background */}
                <div
                    className="absolute inset-0 bg-[var(--bg-card-translucent)] transition-colors -z-10"
                    style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
                />

                <span className="relative z-10">Back</span>
            </button>

            {/* Continue Button (Selected/CTA Style) */}
            <button
                ref={contRef}
                className="relative group/cta w-48 h-12 flex items-center justify-center text-rhive-pink font-bold text-lg hover:text-rhive-pink hover:brightness-110 transition-all animate-pulse hover:animate-none hover:scale-105"
            >
                {/* SVG Border Overlay */}
                <ChamferedBorder
                    width={contW}
                    height={contH}
                    chamfer={12}
                    stroke="currentColor"
                    className="text-rhive-pink/50 group-hover/cta:text-rhive-pink/50 transition-colors"
                />

                {/* Clip Background */}
                <div
                    className="absolute inset-0 bg-rhive-pink/10 group-hover:bg-rhive-pink/20 transition-colors -z-10 drop-shadow-[0_0_15px_rgba(236,2,139,0.4)]"
                    style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
                />

                <span className="relative z-10 drop-shadow-md">Continue</span>
            </button>
        </>
    );
};

// --- Animated Logo Loader ---
const AnimatedLogoLoader = () => {
    return (
        <div className="relative w-16 h-16 group">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes draw - logo {
    0% { stroke- dashoffset: 100; opacity: 0;
}
                    20% { stroke- dashoffset: 100; opacity: 1; }
80% { stroke- dashoffset: 0; opacity: 1; }
100% { stroke- dashoffset: 0; opacity: 1; }
                }
                .logo - path {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: draw - logo 3s ease -in -out infinite alternate;
}
`}} />
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full text-rhive-pink drop-shadow-pink-glow"
            >
                <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" className="logo-path" />
                <path d="M9 7l6 0c1.5 0 2 1 2 2.5S16 12 14 12h-2v3l4 4" className="logo-path" style={{ animationDelay: '0.5s' }} />
                <path d="M9 16v-9" className="logo-path" style={{ animationDelay: '1s' }} />
            </svg>

            {/* Building effect particles */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full border border-rhive-pink/30 rounded-full animate-ping absolute opacity-20"></div>
            </div>
        </div>
    );
};

// --- Image Link Builder Component ---
interface Asset {
    id: string;
    name: string;
    url: string;
    type: 'logo' | 'photo';
    isSystem?: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

// --- Brand Assets & Link Builder ---
const ImageLinkBuilder = ({ isDark = true }: { isDark?: boolean }) => {
    // Initialize state from localStorage if available
    const [assets, setAssets] = useState<Asset[]>(() => {
        const saved = localStorage.getItem('rhive_assets');
        const initialSystemAssets: Asset[] = [
            { id: '1', name: 'White Logo (Black BG)', url: 'https://i.imgur.com/t0VcSgJ.png', type: 'logo', isSystem: true },
            { id: '2', name: 'Black Logo (White BG)', url: 'https://i.imgur.com/EyBDHoK.png', type: 'logo', isSystem: true }
        ];

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return parsed.length > 0 ? parsed : initialSystemAssets;
            } catch (e) {
                return initialSystemAssets;
            }
        }
        return initialSystemAssets;
    });

    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Persist assets to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('rhive_assets', JSON.stringify(assets));
    }, [assets]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        // Simple size check to prevent localStorage from filling up too fast (Limit ~500KB)
        if (file.size > 500 * 1024) {
            alert("File is too large for local storage demo. Please use files under 500KB.");
            return;
        }

        setUploading(true);

        try {
            // Convert file to Base64 to persist it across refreshes
            const base64Url = await fileToBase64(file);

            // Simulate upload delay
            setTimeout(() => {
                const newAsset: Asset = {
                    id: Date.now().toString(),
                    name: file.name,
                    url: base64Url,
                    type: 'photo',
                    isSystem: false
                };
                setAssets(prev => [...prev, newAsset]);
                setUploading(false);
            }, 1500);
        } catch (error) {
            console.error("Error converting file:", error);
            setUploading(false);
        }
    };

    const deleteAsset = (id: string) => {
        if (window.confirm('Are you sure you want to remove this asset?')) {
            setAssets(prev => prev.filter(a => a.id !== id));
        }
    };

    const copyLink = (url: string, format: 'url' | 'img') => {
        const text = format === 'img' ? `[img]${url} [/img]` : url;
        navigator.clipboard.writeText(text);
    };

    const { ref: uploadRef, width: uploadW, height: uploadH } = useElementSize<HTMLDivElement>();

    return (
        <ShowcaseCard
            title="Brand Assets & Img Link Builder"
            icon={<Icons.Image className="w-6 h-6" />}
            code={ASSET_MANAGER_CODE}
            description="A utility to upload brand assets and generate persistent links, ensuring consistent imagery across distributed systems."
            isDark={isDark}
        >
            {/* Upload Area with Solid Chamfered Border (Dashed SVG) */}
            <div
                ref={uploadRef}
                className={`rounded-sm p-8 text-center transition-all cursor-pointer relative overflow-hidden group/upload ${dragActive ? 'bg-rhive-pink/10' : 'bg-[var(--bg-card-translucent)]'} `}
                style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                {/* SVG Border Overlay */}
                <ChamferedBorder
                    width={uploadW}
                    height={uploadH}
                    chamfer={12}
                    stroke={dragActive ? "#ec028b" : "var(--border-color)"}
                    strokeWidth={2}
                    dashed={true}
                    className="group-hover/upload:stroke-rhive-pink transition-colors"
                />
                {/* Simple Responsive SVG via internal hook or just CSS hack? 
                        CSS hack: absolute div with border, clipped. 
                        But standard CSS border gets clipped in half. 
                        Solution: inset the clip path of the container, or outset the border?
                        Let's stick to the Plan: ResizeObserver/Ref in the component logic would be ideal, but for this snippet I'll use a `rect` with `width = '100%' height = '100%'` and a JS-calculated path if possible? 
                        Actually, let's just use the "Separate Lines" method for the dashed box if dashed, or Solid SVG for solid.
                        Since I can't easily execute JS here without changing the component body significantly... 
                        I'll use the `vector - effect` on a huge rect and clip it? 
                        
                        Wait, `NumberToggle` uses `M 6 0...`.
                        Let's wrap the content in a div that handles the layout and use a dedicated SVG overlay that calculates perfectly.
                        
                        I will update the `ImageLinkBuilder` component body to include a ref and resize observer in a separate step if needed. 
                        For now, let's assume `w-full` logic might fail with hardcoded percts.
                        
                        Actually, I'll switch this replacement to just updating the `className` to remove the border, and I'll add the Ref logic in a separate modification to the function body.
                    */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* <SvgChamferBorder dashed={true} active={dragActive} /> */}
                </div>
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                    accept="image/*"
                />
                {uploading ? (
                    <div className="flex flex-col items-center justify-center">
                        <Icons.RefreshCw className="w-8 h-8 text-rhive-pink animate-spin mb-2" />
                        <span className="text-sm text-[var(--text-muted)]">Uploading & Generating Link...</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Icons.Upload className="w-10 h-10 text-[var(--text-muted)] mb-3" />
                        <h4 className="text-sm font-bold text-[var(--text-main)]">Upload Marketing Asset</h4>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Drag & drop or click to upload. Persists locally.</p>
                    </div>
                )}
            </div>

            {/* Asset Grid */}
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase">Asset Library</h4>
                    <span className="text-[10px] text-[var(--text-muted)]">{assets.length} items</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {assets.map((asset) => (
                        <div key={asset.id} className="bg-[var(--bg-card-translucent)] border border-[var(--border-color)] rounded-sm p-3 flex gap-3 items-start group hover:border-rhive-pink/30 transition-colors relative">
                            {/* HEXAGON CONTAINER FOR ASSET */}
                            <div
                                className="w-16 h-16 bg-[var(--bg-card-overlay)] flex items-center justify-center overflow-hidden border-0 relative shrink-0"
                                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                            >
                                {/* Transparent BG Checker pattern simulation */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] [background-size:8px_8px]"></div>
                                <img src={asset.url} alt={asset.name} className="max-w-[70%] max-h-[70%] object-contain relative z-10" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[var(--text-main)] truncate" title={asset.name}>{asset.name}</p>
                                <div className="flex items-center justify-between mt-0.5">
                                    <p className="text-[10px] text-gray-500 font-mono uppercase">{asset.type}</p>
                                    {!asset.isSystem && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteAsset(asset.id); }}
                                            className="text-gray-600 hover:text-red-500"
                                            title="Delete Asset"
                                        >
                                            <Icons.Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => copyLink(asset.url, 'url')}
                                        className="flex-1 text-[10px] bg-gray-800 hover:bg-rhive-pink hover:text-white text-gray-400 px-2 py-1 rounded-sm transition-colors border border-gray-700"
                                    >
                                        URL
                                    </button>
                                    <button
                                        onClick={() => copyLink(asset.url, 'img')}
                                        className="flex-1 text-[10px] bg-gray-800 hover:bg-rhive-blue hover:text-white text-gray-400 px-2 py-1 rounded-sm transition-colors border border-gray-700"
                                    >
                                        [IMG]
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </ShowcaseCard >
    );
};

// --- Advanced Icon Showcase Component ---
const IconShowcase = ({ isDark = true }: { isDark?: boolean }) => {
    const [selectedColor, setSelectedColor] = useState('#ec028b');
    const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    // Persistent State
    const [favorites, setFavorites] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('rhive_fav_icons');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [recent, setRecent] = useState<string[]>(() => {
        const saved = localStorage.getItem('rhive_recent_icons');
        return saved ? JSON.parse(saved) : [];
    });

    // AI State
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState<any>(null);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('rhive_fav_icons', JSON.stringify([...favorites]));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('rhive_recent_icons', JSON.stringify(recent));
    }, [recent]);

    // Consolidate icons and filter duplicates/aliases
    const allIcons = Object.entries(Icons).filter(([name]) =>
        name !== 'default' &&
        !['CodeIcon', 'LayersIcon', 'ToggleIcon', 'BlueprintPlan', 'CodeBrackets', 'SettingsSliders', 'SettingsGear', 'RhiveLogoAbstract', 'MenuTech', 'UserProfileHex', 'TeamGroup', 'LoginLogout', 'MenuGrid'].includes(name)
    );

    // Helper Data for Search Categories
    const CATEGORY_TAGS: Record<string, string[]> = {
        social: ['Instagram', 'Facebook', 'LinkedIn', 'TwitterX', 'TikTok', 'YouTube', 'WhatsApp', 'Slack', 'Discord', 'Zoom', 'Spotify', 'Github', 'Figma', 'Twitch', 'Youtube'],
        media: ['Instagram', 'Facebook', 'LinkedIn', 'TwitterX', 'TikTok', 'YouTube', 'WhatsApp', 'Slack', 'Discord', 'Zoom', 'Spotify', 'Github', 'Figma', 'Twitch', 'Youtube'],
        app: ['Instagram', 'Facebook', 'LinkedIn', 'TwitterX', 'TikTok', 'YouTube', 'WhatsApp', 'Slack', 'Discord', 'Zoom', 'Spotify', 'Github', 'Figma', 'Twitch', 'Youtube'],
        brand: ['HexagonOutline', 'HexagonFilled', 'HexagonGrid', 'RhiveLogoAbstract', 'RhiveLogo'],
        ui: ['MenuTech', 'MenuGrid', 'SettingsGear', 'SettingsSliders', 'Dashboard', 'Search', 'Notification', 'Calendar'],
        construction: ['Truck', 'Home', 'HexagonOutline', 'Anchor', 'Tool', 'Hammer'],
        data: ['PieChart', 'BarChart2', 'TrendingUp', 'Activity', 'Database', 'Server'],
    };

    // Smart Search Logic
    const getFilteredIcons = () => {
        const query = searchQuery.toLowerCase().trim();

        if (!query) return allIcons;

        // Check category match
        let categoryMatch: string[] = [];
        Object.entries(CATEGORY_TAGS).forEach(([cat, icons]) => {
            if (query.includes(cat)) {
                categoryMatch = [...categoryMatch, ...icons];
            }
        });

        if (categoryMatch.length > 0) {
            return allIcons.filter(([name]) => categoryMatch.includes(name));
        }

        // Default text search
        return allIcons.filter(([name]) => name.toLowerCase().includes(query));
    };

    const filteredIcons = getFilteredIcons();

    const handleCopy = (name: string) => {
        const colorAttr = selectedColor.startsWith('#')
            ? `style = {{ color: "${selectedColor}" }}`
            : `className = "${selectedColor}"`;

        const code = `< ${name} ${colorAttr} width = { 24} height = { 24} /> `;
        navigator.clipboard.writeText(code);

        setCopiedIcon(name);
        setTimeout(() => setCopiedIcon(null), 2000);

        // Add to recent
        setRecent(prev => {
            const newRecent = [name, ...prev.filter(i => i !== name)].slice(0, 8);
            return newRecent;
        });
    };

    const toggleFavorite = (e: React.MouseEvent, name: string) => {
        e.stopPropagation();
        setFavorites(prev => {
            const newFavs = new Set(prev);
            if (newFavs.has(name)) newFavs.delete(name);
            else newFavs.add(name);
            return newFavs;
        });
    };

    const handleAIGenerate = () => {
        if (!prompt) return;
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedResult({ name: 'CustomAIIcon', component: Icons.Grid });
        }, 2000);
    };

    const handleAddCustomIcon = () => {
        if (generatedResult) {
            setIsAIModalOpen(false);
            setRecent(prev => ['CustomAIIcon', ...prev]); // Simulating adding custom icon to recent list
            setPrompt('');
            setGeneratedResult(null);
        }
    };

    const handleCopySystemRules = () => {
        const iconList = allIcons.map(([name]) => name).join(', ');
        const rulePrompt = `
RHIVE DESIGN SYSTEM - ICONOGRAPHY RULES & CATALOG

1. SYSTEM COMPONENT:
   All icons are React components wrapping standard SVGs.
   - Base wrapper applies: viewBox="0 0 24 24", fill="none", stroke="currentColor", strokeWidth="1.5", strokeLinecap="round", strokeLinejoin="round".
   - Props: Accepts all SVGProps (className, style, etc).

2. IMPORT PATTERN:
   import * as Icons from './components/icons';

   // Usage
   <Icons.IconName className="w-6 h-6 mx-auto text-rhive-pink" />

3. COMPLETE ICON CATALOG (${allIcons.length} available icons):
   ${iconList}

   * Note: Use these exact names. Do not import from 'lucide-react' directly; use these local components to ensure consistency.
`;
        navigator.clipboard.writeText(rulePrompt);
        setCopiedIcon("SYSTEM RULES"); // Re-using this state for feedback
        setTimeout(() => setCopiedIcon(null), 2000);
    };

    return (
        <ShowcaseCard
            title="Premium Iconography & Catalog"
            icon={<Icons.Grid className="w-6 h-6" />}
            description="A comprehensive library of system icons, featuring search functionality and one-click code generation."
            isDark={isDark}
        >
            <div className="space-y-6">
                {/* Controls */}
                <div className="flex flex-col gap-4 bg-[var(--bg-card-translucent)] p-4 rounded-sm border border-[var(--border-color)]" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
                    <div className="relative h-10 w-full group">
                        {/* Search Input Chamfered Border */}
                        <div
                            className="absolute inset-0 bg-[var(--border-color)] group-focus-within:bg-rhive-pink transition-colors"
                            style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                        />
                        {/* Inner Search Input Background */}
                        <div
                            className="absolute inset-[1px] bg-[var(--bg-card-solid)]"
                            style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                        >
                            <input
                                type="text"
                                placeholder="Search 150+ icons (e.g. 'Social Media', 'Roof', 'Analytics')..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-full bg-transparent border-none outline-none pl-9 pr-4 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] font-mono"
                            />
                        </div>
                        <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4 pointer-events-none" />
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[var(--text-muted)]">Color Preview:</span>
                            <div className="flex items-center gap-2">
                                {['#ec028b', '#e2ab49', '#08137C', (isDark ? '#FFFFFF' : '#000000')].map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className="w-6 h-6 relative flex items-center justify-center group focus:outline-none transition-transform hover:scale-110"
                                        title={color}
                                    >
                                        {/* Selection Ring (active state) */}
                                        {selectedColor === color && (
                                            <div className={`absolute inset-[-2px] ${isDark ? 'bg-white' : 'bg-black'} opacity-80`} style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                                        )}
                                        {/* Hexagon Color */}
                                        <div className="w-full h-full" style={{ backgroundColor: color, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                                    </button>
                                ))}

                                <div className="relative flex items-center ml-2 border-l border-[var(--border-color)] pl-2 gap-2">
                                    <div className="relative w-8 h-8 group overflow-hidden">
                                        <input
                                            type="color"
                                            value={selectedColor}
                                            onChange={(e) => setSelectedColor(e.target.value)}
                                            className="absolute inset-0 w-[150%] h-[150%] -left-1/4 -top-1/4 cursor-pointer p-0 border-0 opacity-0 z-10"
                                        />
                                        <div className="w-full h-full bg-[var(--bg-code)] flex items-center justify-center text-[10px] font-mono text-[var(--text-main)] pointer-events-none" style={{ backgroundColor: selectedColor }}>
                                            <span className={`${isDark ? 'bg-black/50' : 'bg-white/70'} px-1 rounded backdrop-blur-sm`}>{selectedColor.slice(0, 4)}</span>
                                        </div>
                                        {/* Hexagon Mask for custom picker display */}
                                        <div className="absolute inset-0 pointer-events-none border border-[var(--border-color)]" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                                    </div>

                                    {/* Hexagon Plus Button for AI Generation */}
                                    <button
                                        onClick={() => setIsAIModalOpen(true)}
                                        className="w-8 h-8 relative flex items-center justify-center group hover:scale-110 transition-transform"
                                        title="Create Custom Icon with AI"
                                    >
                                        <div className="absolute inset-0 bg-[var(--border-color)] group-hover:bg-rhive-pink transition-colors" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                                        <div className="absolute inset-[1px] bg-[var(--bg-card-solid)] group-hover:bg-[var(--bg-card-overlay)] flex items-center justify-center" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                                            <Icons.Plus className="w-4 h-4 text-rhive-pink" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* COPY SYSTEM RULES BUTTON */}
                        <button
                            onClick={handleCopySystemRules}
                            className="bg-[var(--bg-card-translucent)] hover:bg-rhive-pink/10 border border-[var(--border-color)] hover:border-rhive-pink text-[var(--text-muted)] hover:text-[var(--text-main)] px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-2 group shadow-sm"
                        >
                            {copiedIcon === "SYSTEM RULES" ? (
                                <>
                                    <Icons.Check className="w-3 h-3 text-rhive-pink" />
                                    <span>Rules Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Icons.Copy className="w-3 h-3 group-hover:text-rhive-pink transition-colors" />
                                    <span>Copy Icon Context</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Favorites Section */}
                {favorites.size > 0 && !searchQuery && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-mono text-rhive-pink uppercase flex items-center gap-2">
                            <Icons.HeartIcon className="w-3 h-3 fill-current" /> Favorites
                        </h4>
                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                            {[...favorites].map(name => {
                                const Entry = allIcons.find(i => i[0] === name);
                                if (!Entry) return null;
                                const [_, IconComponent] = Entry;
                                return (
                                    <div
                                        key={name}
                                        onClick={() => handleCopy(name)}
                                        className="group relative p-2 cursor-pointer flex justify-center transition-transform hover:scale-110 h-10 w-10 items-center"
                                    >
                                        <div className="absolute inset-0 bg-gray-800 group-hover:bg-rhive-pink transition-colors" style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }} />
                                        <div className="absolute inset-[1px] bg-gray-900 flex items-center justify-center" style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                                            {/* @ts-ignore */}
                                            <IconComponent className="w-5 h-5" style={{ color: selectedColor }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Recents Section */}
                {recent.length > 0 && !searchQuery && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2">
                            <Icons.Clock className="w-3 h-3" /> Recently Used
                        </h4>
                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                            {recent.map(name => {
                                const Entry = allIcons.find(i => i[0] === name);
                                let IconComponent = Entry ? Entry[1] : Icons.Grid;
                                if (name === 'CustomAIIcon') IconComponent = Icons.RhiveLogo;

                                return (
                                    <div
                                        key={name}
                                        onClick={() => handleCopy(name)}
                                        className="group relative p-2 cursor-pointer flex justify-center transition-transform hover:scale-110 h-10 w-10 items-center"
                                    >
                                        <div className="absolute inset-0 bg-[var(--border-color)] group-hover:bg-rhive-pink transition-colors" style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }} />
                                        <div className="absolute inset-[1px] bg-[var(--bg-card-solid)] flex items-center justify-center" style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                                            {/* @ts-ignore */}
                                            <IconComponent className="w-5 h-5" style={selectedColor.startsWith('#') ? { color: selectedColor } : {}} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar p-1">
                    {filteredIcons.map(([name, IconComponent]) => (
                        <div
                            key={name}
                            onClick={() => handleCopy(name)}
                            className="bg-[var(--bg-card-translucent)] border border-[var(--border-color)] rounded-sm p-3 aspect-square flex flex-col items-center justify-center relative group/icon cursor-pointer hover:border-rhive-pink/30 hover:bg-[var(--bg-card-overlay)] transition-all"
                        >
                            <IconComponent
                                // @ts-ignore
                                style={selectedColor.startsWith('#') ? { color: selectedColor } : {}}
                                // @ts-ignore
                                className={`${!selectedColor.startsWith('#') ? selectedColor : ''} w-8 h-8 mb-2 transition-transform group-hover/icon:scale-110`}
                            />
                            <span className="text-[9px] font-mono text-[var(--text-muted)] truncate w-full text-center group-hover/icon:text-[var(--text-main)]">
                                {name}
                            </span>

                            {/* Favorite Button */}
                            <button
                                onClick={(e) => toggleFavorite(e, name)}
                                className={`absolute top-1 right-1 p-1 rounded-full z-20 transition-opacity ${favorites.has(name) ? 'opacity-100 text-rhive-pink' : 'opacity-0 group-hover/icon:opacity-100 text-gray-600 hover:text-rhive-pink'} `}
                            >
                                <Icons.HeartIcon className={`w-3 h-3 ${favorites.has(name) ? 'fill-current' : ''} `} />
                            </button>

                            {/* Copied Tooltip */}
                            {copiedIcon === name && (
                                <div className="absolute inset-0 bg-rhive-pink/90 backdrop-blur-sm flex items-center justify-center z-30" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                                    <span className="text-white text-[10px] font-bold animate-pulse">COPIED</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredIcons.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                            No icons found for "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>

            {/* AI Creation Modal */}
            {isAIModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="relative z-10 bg-[var(--bg-card-solid)] border border-[var(--border-color)] p-8 max-w-md w-full shadow-2xl"
                        style={{ clipPath: "polygon(32px 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%, 0 32px)" }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                                <Icons.Cpu className="text-rhive-pink w-6 h-6" />
                                Generate Custom Icon
                            </h3>
                            <button onClick={() => setIsAIModalOpen(false)} className="text-[var(--text-muted)] hover:text-rhive-pink">
                                <Icons.XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-[var(--text-muted)] mb-1 block">Description Prompt</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. A stylized roof outline with a lightning bolt"
                                    className="w-full bg-[var(--bg-card-translucent)] border border-[var(--border-color)] rounded-sm p-3 text-sm text-[var(--text-main)] focus:border-rhive-pink outline-none min-h-[80px]"
                                />
                            </div>

                            {/* Preview Area */}
                            <div className="h-32 bg-[var(--bg-card-translucent)] border border-[var(--border-color)] rounded-sm flex items-center justify-center relative">
                                {isGenerating ? (
                                    <div className="flex flex-col items-center">
                                        <Icons.RefreshCw className="w-8 h-8 text-rhive-pink animate-spin mb-2" />
                                        <span className="text-rhive-pink text-xs font-mono animate-pulse">GENERATING...</span>
                                    </div>
                                ) : generatedResult ? (
                                    <div className="flex flex-col items-center animate-fade-in">
                                        {/* @ts-ignore */}
                                        <generatedResult.component className="w-16 h-16 text-rhive-pink drop-shadow-pink-glow" />
                                        <span className="text-[10px] text-green-400 mt-2 font-mono uppercase">Asset Created</span>
                                    </div>
                                ) : (
                                    <span className="text-[var(--text-muted)] text-xs italic">Result will appear here</span>
                                )}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleAIGenerate}
                                    disabled={!prompt || isGenerating}
                                    className="flex-1 bg-[var(--bg-card-solid)] border border-[var(--border-color)] text-[var(--text-main)] py-2 rounded-sm hover:bg-[var(--bg-card-overlay)] transition-colors text-sm font-medium"
                                >
                                    Generate
                                </button>
                                <button
                                    onClick={handleAddCustomIcon}
                                    disabled={!generatedResult}
                                    className="flex-1 bg-rhive-pink text-white py-2 rounded-sm hover:bg-opacity-90 transition-colors text-sm font-bold shadow-pink-glow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add to Library
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Plexus Background for Modal */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                        <PlexusShape backgroundColor={isDark ? "#000000" : "#FFFFFF"} dotColor="#ec028b" lineColor="236, 2, 139" density={20} />
                    </div>
                </div>
            )}
        </ShowcaseCard>
    );
};

// --- Visual FX Copy Component ---
const VisualFXCard = ({ bg, dot, line, label, code }: { bg: string, dot: string, line: string, label: string, code: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center group/vfx">
            <div
                className={`w-full aspect-video rounded-sm border border-[var(--border-color)] relative overflow-hidden mb-3 transition-transform group-hover/vfx:scale-[1.02]`}
                style={{ backgroundColor: bg }}
            >
                <PlexusShape
                    backgroundColor={bg}
                    dotColor={dot}
                    lineColor={line}
                    density={20}
                    className="h-full w-full"
                />
            </div>
            <p className="text-xs font-bold text-[var(--text-main)] mb-1">{label}</p>
            <SimpleTooltip content="Click to copy Component code">
                <button
                    onClick={handleCopy}
                    className={`text-[9px] font-mono text-[var(--text-muted)] hover:text-rhive-pink truncate max-w-full px-2 py-1 bg-[var(--bg-card-translucent)] border border-[var(--border-color)] rounded-sm transition-colors`}
                >
                    {copied ? 'COPIED!' : 'PRESET CODE'}
                </button>
            </SimpleTooltip>
        </div>
    );
};

const ThemeToggle = ({ isDark, onToggle }: { isDark: boolean, onToggle: () => void }) => {
    return (
        <button onClick={onToggle} className="relative w-40 h-10 group flex items-center justify-center">
            <div
                className="absolute inset-0 bg-[var(--bg-card-translucent)] transition-colors"
                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
            />
            {/* SVG Border overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                    d="M 10 0 L 160 0 L 160 30 L 150 40 L 0 40 L 0 10 Z"
                    fill="none"
                    stroke={isDark ? "#374151" : "#d1d5db"}
                    strokeWidth="1"
                    className="group-hover:stroke-rhive-pink transition-colors"
                />
            </svg>

            <div className="relative z-10 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-main)] group-hover:text-rhive-pink transition-colors">
                {isDark ? <Icons.Moon className="w-4 h-4" /> : <Icons.Sun className="w-4 h-4" />}
                {isDark ? 'Dark Mode' : 'Light Mode'}
            </div>
        </button>
    )
}

const MasterCopyButton = ({ isDark }: { isDark: boolean }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(MASTER_SYSTEM_PROMPT);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="group relative h-10 px-6 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
            {/* Background with Chamfer */}
            <div
                className={`absolute inset-0 transition-all duration-300 ${copied ? 'bg-rhive-pink' : 'bg-rhive-pink/10 group-hover:bg-rhive-pink/20'}`}
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
            />

            {/* Glowing Border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
                <path
                    d="M 8 0 L 200 0 L 200 32 L 192 40 L 0 40 L 0 8 Z"
                    fill="none"
                    stroke="#ec028b"
                    strokeWidth="1.5"
                    className={`${copied ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} transition-opacity`}
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            {/* Text & Icon */}
            <div className={`relative z-10 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.15em] transition-colors ${copied ? 'text-white' : 'text-rhive-pink'}`}>
                {copied ? <Icons.Check className="w-4 h-4" /> : <Icons.Zap className="w-4 h-4 animate-pulse" />}
                {copied ? 'SYSTEM INGESTED' : 'INGEST MASTER PROMPT'}
            </div>

            {/* Glow beneath */}
            <div className={`absolute inset-0 bg-rhive-pink/20 blur-xl transition-opacity duration-500 ${copied ? 'opacity-50' : 'opacity-0 group-hover:opacity-30'}`} />
        </button>
    );
};

const StyleShowcase: React.FC = () => {
    const [isCardActive, setIsCardActive] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Dynamic Theme Variables
    const themeStyles = isDarkMode ? {
        '--bg-main': '#000000',
        '--bg-card-solid': '#000000',
        '--bg-card-translucent': 'rgba(0,0,0,0.6)',
        '--bg-card-overlay': 'rgba(0,0,0,0.6)',
        '--bg-code': '#111827',
        '--text-main': '#FFFFFF',
        '--text-muted': '#9ca3af',
        '--border-color': '#374151',
        '--scrollbar-track': '#000000',
        '--scrollbar-thumb': '#333333',
        '--pac-invert': 'invert(1)',
    } as React.CSSProperties : {
        '--bg-main': '#F3F4F6',
        '--bg-card-solid': '#FFFFFF',
        '--bg-card-translucent': 'rgba(255,255,255,0.9)',
        '--bg-card-overlay': 'rgba(0,0,0,0.05)',
        '--bg-code': '#E5E7EB',
        '--text-main': '#000000',
        '--text-muted': '#4B5563',
        '--border-color': '#9CA3AF', // Higher contrast Gray-400
        '--scrollbar-track': '#F3F4F6',
        '--scrollbar-thumb': '#BCBDBE',
        '--pac-invert': 'none',
    } as React.CSSProperties;

    // Apply theme variables to root for global elements (scrollbars, etc)
    useEffect(() => {
        const root = document.documentElement;
        const previousValues: Record<string, string> = {};

        // Store previous values and set new ones
        Object.entries(themeStyles).forEach(([key, value]) => {
            if (key.startsWith('--')) {
                previousValues[key] = root.style.getPropertyValue(key);
                root.style.setProperty(key, value as string);
            }
        });

        // Cleanup function to restore previous values when component unmounts or theme changes
        return () => {
            Object.keys(previousValues).forEach((key) => {
                if (previousValues[key]) {
                    root.style.setProperty(key, previousValues[key]);
                } else {
                    root.style.removeProperty(key);
                }
            });
        };
    }, [isDarkMode, themeStyles]);

    return (
        <div className="min-h-screen p-4 sm:p-8 md:p-12 lg:p-16 animate-fade-in bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500">
            {/* Hidden System Context for Select All Copy */}
            <div className="absolute opacity-0 w-px h-px overflow-hidden pointer-events-none whitespace-pre-wrap select-text -z-50">
                {MASTER_SYSTEM_PROMPT}
            </div>

            <header className="text-center mb-16 relative z-10 flex flex-col items-center">
                <div className="flex w-full justify-between items-center mb-8">
                    <MasterCopyButton isDark={isDarkMode} />
                    <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
                </div>
                <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-gray-100 via-gray-300 to-rhive-pink' : 'from-gray-900 via-gray-600 to-rhive-pink'} pb-2`}>
                    RHIVE Design System
                </h1>
                <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto">
                    Master design reference for the "Digital Hive" UI. Use the specs below to maintain consistency across AI-generated applications.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto relative z-10">

                {/* Left Column */}
                <div className="space-y-8">
                    <ShowcaseCard
                        title="Typography"
                        icon={<Icons.DocumentTextIcon className="w-6 h-6" />}
                        code={TYPOGRAPHY_CODE}
                        description="Defines the hierarchy of fonts used throughout the application, pairing the technical authority of 'Rubik' with the formal elegance of 'EB Garamond'."
                        isDark={isDarkMode}
                    >
                        <div className="space-y-4 text-[var(--text-main)]">
                            <p className="text-4xl font-bold">Aa - Page Titles (Rubik)</p>
                            <p className="text-2xl font-semibold">Aa - Section Headings</p>
                            <p className="font-serif text-2xl italic text-[var(--text-muted)]">Aa - Formal Reports (EB Garamond)</p>
                            <p className="text-base">Aa - Body copy for descriptions and information.</p>
                            <p className="text-sm text-[var(--text-muted)]">Aa - Secondary text for labels and captions.</p>
                            <p className="font-mono text-rhive-pink">123.45 SQ - Monospaced for data.</p>
                        </div>
                    </ShowcaseCard>

                    {/* NEW: Image Link Builder */}
                    <ImageLinkBuilder isDark={isDarkMode} />

                    <ShowcaseCard
                        title="Master System Source (Copy for AI)"
                        icon={<Icons.Databases className="w-6 h-6" />}
                        description="The core configuration block that defines the global design variables, particle physics, and color themes for the AI."
                        isDark={isDarkMode}
                    >
                        <p className="text-[var(--text-muted)] mb-4">
                            Copy these blocks to provide an AI with the full context of the RHIVE design system (Particle background logic and Tailwind theme).
                        </p>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-[var(--text-muted)] mb-2">PlexusShape.tsx (Background Logic)</h4>
                                <CodeBlock code={PLEXUS_FULL_CODE} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[var(--text-muted)] mb-2">Tailwind Config (Theme)</h4>
                                <CodeBlock code={TAILWIND_FULL_CODE} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[var(--text-muted)] mb-2">Unified System Prompt</h4>
                                <CodeBlock code={MASTER_SYSTEM_PROMPT} />
                            </div>
                        </div>
                    </ShowcaseCard>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* NEW: Interactive Elements Showcase */}
                    <ShowcaseCard
                        title="Interactive Elements"
                        icon={<Icons.HomeIcon className="w-6 h-6" />}
                        code={NUMBER_SELECTOR_CODE}
                        description="Demonstrates complex interactive patterns for data entry, featuring dynamic state changes and glassmorphic overlays."
                        isDark={isDarkMode}
                    >
                        <EstimationPreview />
                    </ShowcaseCard>

                    <ShowcaseCard
                        title="Color Palette"
                        icon={<Icons.Settings className="w-6 h-6" />}
                        code={PALETTE_CODE}
                        description="The official color system, anchored by Rhive Pink (#ec028b) and accented with functional secondary tones."
                        isDark={isDarkMode}
                    >
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
                            <ColorSwatch name="Primary Pink" hex="#ec028b" />
                            <ColorSwatch name="Primary White" hex="#FFFFFF" />
                            <ColorSwatch name="Primary Black" hex="#000000" />
                            <ColorSwatch name="Secondary Gold" hex="#e2ab49" />
                            <ColorSwatch name="Secondary Blue" hex="#08137C" />
                            <ColorSwatch name="Secondary Gray" hex="#cccccc" />
                        </div>
                    </ShowcaseCard>

                    <ShowcaseCard
                        title="Visual FX (Plexus Styles)"
                        icon={<Icons.Grid className="w-6 h-6" />}
                        code={VISUAL_FX_CODE}
                        description="Configurable particle systems that add cinematic depth and motion to the background, available in multiple preset themes."
                        isDark={isDarkMode}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
                            <VisualFXCard
                                bg="#000000"
                                dot="#ec028b"
                                line="236, 2, 139"
                                label="Dark Pink"
                                code={`< PlexusShape backgroundColor = "#000000" dotColor = "#ec028b" lineColor = "236, 2, 139" /> `}
                            />
                            <VisualFXCard
                                bg="#FFFFFF"
                                dot="#ec028b"
                                line="236, 2, 139"
                                label="Light Pink"
                                code={`< PlexusShape backgroundColor = "#FFFFFF" dotColor = "#ec028b" lineColor = "236, 2, 139" /> `}
                            />
                            <VisualFXCard
                                bg="#FFFFFF"
                                dot="#e2ab49"
                                line="226, 171, 73"
                                label="Light Gold"
                                code={`< PlexusShape backgroundColor = "#FFFFFF" dotColor = "#e2ab49" lineColor = "226, 171, 73" /> `}
                            />
                        </div>
                    </ShowcaseCard>

                    <ShowcaseCard
                        title="Layout & Widget Architecture"
                        icon={<Icons.DocumentTextIcon className="w-6 h-6" />}
                        code={LAYOUT_CODE}
                        description="The structural blueprint for all widgets, layering Plexus effects beneath a content-focused glass pane."
                        isDark={isDarkMode}
                    >
                        <p className="text-[var(--text-muted)]">
                            The core architectural pattern for RHIVE widgets combines a reactive Plexus background with a glass-like content layer. This ensures the "Tech-Noir" aesthetic permeates every interface element while maintaining readability via the black overlay.
                        </p>
                        <div className="mt-4 p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card-overlay)] relative overflow-hidden">
                            <div className="absolute top-2 right-2 text-xs text-[var(--text-muted)] font-mono">Widget Preview</div>
                            <div className="h-20 flex items-center justify-center">
                                <span className="text-rhive-pink font-mono text-sm animate-pulse">Plexus Layer Active</span>
                            </div>
                        </div>
                    </ShowcaseCard>

                    {/* NEW: Icon Showcase Section */}
                    <IconShowcase isDark={isDarkMode} />
                </div>
            </div>
            <footer className="text-center text-[var(--text-muted)] mt-16 pb-8">
                <p>&copy; {new Date().getFullYear()} RHIVE Industries. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default StyleShowcase;
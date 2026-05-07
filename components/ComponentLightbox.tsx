
import React, { useRef, useEffect } from 'react';
import { ComponentDetail } from '../data/roofComponentsData';

interface ComponentLightboxProps {
    component: ComponentDetail | null;
    onClose: () => void;
}

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const PlexusBackground: React.FC<{ lineColor: string }> = ({ lineColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dots = useRef<Dot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const initDots = () => {
      dots.current = [];
      const numDots = 30;
      for (let i = 0; i < numDots; i++) {
        dots.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
    };

    initDots();

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      dots.current.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${lineColor}, 0.5)`;
        ctx.fill();
      });

      for (let i = 0; i < dots.current.length; i++) {
        for (let j = i + 1; j < dots.current.length; j++) {
          const dx = dots.current[i].x - dots.current[j].x;
          const dy = dots.current[i].y - dots.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(dots.current[i].x, dots.current[i].y);
            ctx.lineTo(dots.current[j].x, dots.current[j].y);
            ctx.strokeStyle = `rgba(${lineColor}, ${1 - dist / 100})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [lineColor]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export const ComponentLightbox: React.FC<ComponentLightboxProps> = ({ component, onClose }) => {
    if (!component) return null;

    const chamferSize = "24px";
    const clipPathValue = `polygon(
        ${chamferSize} 0,
        100% 0,
        100% calc(100% - ${chamferSize}),
        calc(100% - ${chamferSize}) 100%,
        0 100%,
        0 ${chamferSize}
    )`;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-fade-in" onClick={onClose} />
            
            <div 
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 shadow-[0_0_50px_rgba(236,2,139,0.1)] group"
                style={{ clipPath: clipPathValue }}
            >
                {/* Background effects */}
                <PlexusBackground lineColor="236, 2, 139" />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--rhive-pink)]/5 via-transparent to-transparent pointer-events-none" />

                {/* Content Container */}
                <div className="relative z-10 flex flex-col min-h-full">
                    
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="text-[var(--rhive-pink)] text-base font-bold uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                                <span className="w-1 h-1 bg-[var(--rhive-pink)] shadow-[0_0_5px_var(--rhive-pink)]" />
                                {component.category} Specification
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none font-sans">
                                {component.title}
                            </h2>
                            <p className="text-gray-500 font-mono text-base mt-2 uppercase tracking-widest bg-white/5 px-2 py-1 inline-block">
                                Standard ID: {component.id.toUpperCase()}
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="bg-white/5 hover:bg-[var(--rhive-pink)] text-white p-3 transition-colors group/close"
                            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Narrative */}
                        <div className="space-y-10">
                            <section>
                                <h3 className="text-white text-base font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-[1px] bg-[var(--rhive-pink)]" />
                                    Mission Parameters
                                </h3>
                                <div className="text-gray-400 font-serif leading-relaxed text-lg">
                                    {component.description}
                                </div>
                            </section>

                            {component.options && component.options.length > 0 && (
                                <section className="space-y-4">
                                    <h3 className="text-white text-base font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-[1px] bg-[var(--rhive-pink)]" />
                                        Available Options
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {component.options.map((option, i) => (
                                            <div 
                                                key={i} 
                                                className="group/opt bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-all duration-300"
                                                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                            >
                                                <div className="flex items-center gap-3 mb-1">
                                                    <div className="w-2 h-2 bg-[var(--rhive-pink)]/40 group-hover/opt:bg-[var(--rhive-pink)] transition-colors" />
                                                    <span className="text-base font-bold text-white uppercase tracking-tight">{option}</span>
                                                </div>
                                                {component.optionDescriptions && component.optionDescriptions[option] && (
                                                    <p className="text-base text-gray-500 font-serif ml-5 leading-relaxed">
                                                        {component.optionDescriptions[option]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section className="bg-white/5 p-6 border border-white/10" style={{ clipPath: 'polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)' }}>
                                <h3 className="text-[var(--rhive-pink)] text-base font-bold uppercase tracking-widest mb-6">RHIVE Core Commitment & Guarantee</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full border border-[var(--rhive-pink)]/30 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-[var(--rhive-pink)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m14.418 5.495A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-base text-gray-500 font-bold uppercase tracking-wider mb-1">Execution Warranty</p>
                                            <p className="text-white text-base font-medium">{component.guarantee.installation}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-base text-gray-500 font-bold uppercase tracking-wider mb-1">Asset Warranty</p>
                                            <p className="text-white text-base font-medium">{component.guarantee.materials}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Technical Blueprint */}
                        <div className="space-y-10">
                            <section>
                                <h3 className="text-white text-base font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-[1px] bg-[var(--rhive-pink)]" />
                                    Execution Blueprint & Materials
                                </h3>
                                <div className="space-y-1">
                                    {component.blueprint.map((step, i) => (
                                        <div key={i} className="flex items-center gap-4 group/item">
                                            <div className="text-base font-mono text-white/20 group-hover/item:text-[var(--rhive-pink)] transition-colors">0{i+1}</div>
                                            <div className="flex-1 border-b border-white/5 py-3 text-base text-gray-300 group-hover/item:text-white transition-colors">
                                                {step}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-black/40 border border-white/5 p-6">
                                <h4 className="text-base font-bold text-gray-500 uppercase tracking-widest mb-4">RHIVE Efficiency Standard</h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-black text-white tracking-tighter uppercase whitespace-pre">{component.standard}</span>
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-[var(--rhive-pink)]" />
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <p className="text-base text-gray-600 font-mono leading-relaxed uppercase">
                                        NOTE: All components listed above define the minimum material standard. 
                                        RHIVE will only substitute material in equivalent or superior quality 
                                        subject to availability and regional engineering requirements.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentLightbox;

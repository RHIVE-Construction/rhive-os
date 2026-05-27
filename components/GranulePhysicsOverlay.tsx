import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const GranulePhysicsOverlay: React.FC = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);

    useEffect(() => {
        if (!sceneRef.current) return;

        // Module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Events = Matter.Events;

        // create an engine
        const engine = Engine.create();
        engineRef.current = engine;

        // create a renderer
        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: sceneRef.current.clientWidth,
                height: sceneRef.current.clientHeight,
                wireframes: false,
                background: 'transparent',
                pixelRatio: window.devicePixelRatio
            }
        });
        renderRef.current = render;

        // run the renderer
        Render.run(render);

        // create runner
        const runner = Runner.create();
        runnerRef.current = runner;
        Runner.run(runner, engine);

        const cardBodies: Matter.Body[] = [];

        // Function to map DOM elements to Matter.js static bodies
        const updateCardBodies = () => {
            const elements = document.querySelectorAll('.tech-card-element');
            const containerBounds = sceneRef.current?.getBoundingClientRect();
            if (!containerBounds) return;

            // Remove old bodies
            if (cardBodies.length > 0) {
                Composite.remove(engine.world, cardBodies);
                cardBodies.length = 0;
            }

            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                
                // Calculate position relative to the canvas container
                const x = rect.left - containerBounds.left + rect.width / 2;
                const y = rect.top - containerBounds.top + rect.height / 2;

                // Create a static body for the card
                const body = Bodies.rectangle(x, y, rect.width, rect.height, {
                    isStatic: true,
                    render: {
                        visible: false // We only want the physics, not the rendered rectangle
                    },
                    friction: 0.8,
                    restitution: 0.2 // Slightly bouncy
                });
                cardBodies.push(body);
            });

            Composite.add(engine.world, cardBodies);
        };

        // Initial mapping
        setTimeout(updateCardBodies, 500);

        // Handle resize
        const handleResize = () => {
            if (sceneRef.current && render.canvas) {
                render.canvas.width = sceneRef.current.clientWidth;
                render.canvas.height = sceneRef.current.clientHeight;
                render.options.width = sceneRef.current.clientWidth;
                render.options.height = sceneRef.current.clientHeight;
                updateCardBodies();
            }
        };

        window.addEventListener('resize', handleResize);

        // Particle spawner
        let tick = 0;
        const spawnParticle = () => {
            if (!sceneRef.current) return;
            const width = sceneRef.current.clientWidth;
            
            // Random x position across the top
            const x = Math.random() * width;
            
            // Varied sizes for granules
            const radius = Math.random() * 2 + 1;
            
            // Varied colors (dark gray, charcoal, slight brown/black tint)
            const colors = ['#1f2937', '#374151', '#111827', '#4b5563', '#2d3748'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            const particle = Bodies.circle(x, -10, radius, {
                restitution: 0.4,
                friction: 0.1,
                density: 0.05,
                render: {
                    fillStyle: color
                }
            });

            Composite.add(engine.world, particle);
        };

        // Game loop events
        Events.on(engine, 'beforeUpdate', () => {
            tick += 1;
            
            // Spawn rate: e.g. every 2 ticks spawn a particle
            if (tick % 2 === 0) {
                spawnParticle();
            }

            // Cleanup particles that fall out of bounds to maintain performance
            const bodies = Composite.allBodies(engine.world);
            if (sceneRef.current) {
                const height = sceneRef.current.clientHeight;
                for (let i = 0; i < bodies.length; i++) {
                    const body = bodies[i];
                    if (!body.isStatic && body.position.y > height + 50) {
                        Composite.remove(engine.world, body);
                    }
                }
            }
            
            // Max particle limit (e.g., keep it under 400 for performance)
            const dynamicBodies = bodies.filter(b => !b.isStatic);
            if (dynamicBodies.length > 400) {
                // Remove oldest
                Composite.remove(engine.world, dynamicBodies[0]);
            }
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            if (renderRef.current) {
                Render.stop(renderRef.current);
                renderRef.current.canvas.remove();
            }
            if (runnerRef.current) {
                Runner.stop(runnerRef.current);
            }
            if (engineRef.current) {
                Engine.clear(engineRef.current);
            }
        };
    }, []);

    return (
        <div 
            ref={sceneRef} 
            className="absolute inset-0 z-[15] pointer-events-none overflow-hidden" 
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default GranulePhysicsOverlay;

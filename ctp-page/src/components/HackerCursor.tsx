'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * HackerCursor — Optimized version using CSS Variables & Transforms
 */
export default function HackerCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
    const [isDesktop, setIsDesktop] = useState(false);
    const cursorRef = useRef<HTMLDivElement>(null);
    const lastPos = useRef({ x: -100, y: -100 });

    useEffect(() => {
        const checkDesktop = () => {
            const desktop = window.innerWidth >= 1024 && window.matchMedia('(pointer: fine)').matches;
            setIsDesktop(desktop);
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const { clientX: x, clientY: y } = e;
        lastPos.current = { x, y };

        if (cursorRef.current) {
            cursorRef.current.style.setProperty('--cursor-x', `${x}px`);
            cursorRef.current.style.setProperty('--cursor-y', `${y}px`);
        }
        if (!isVisible) setIsVisible(true);
    }, [isVisible]);

    const handleMouseDown = useCallback(() => setIsClicking(true), []);
    const handleMouseUp = useCallback(() => setIsClicking(false), []);
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);
    const handleMouseEnter = useCallback(() => setIsVisible(true), []);

    useEffect(() => {
        if (!isDesktop) return;

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        document.documentElement.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isDesktop, handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseEnter]);

    useEffect(() => {
        if (!isDesktop) return;
        const timer = setTimeout(() => setIsActive(true), 600);
        return () => clearTimeout(timer);
    }, [isDesktop]);

    // Throttled trail effect
    useEffect(() => {
        if (!isDesktop || !isActive) return;

        const interval = setInterval(() => {
            const { x, y } = lastPos.current;
            const id = Date.now() + Math.random();
            setTrail(prev => [...prev.slice(-4), { x, y, id }]);
        }, 50);

        return () => clearInterval(interval);
    }, [isDesktop, isActive]);

    useEffect(() => {
        if (trail.length === 0) return;
        const timer = setTimeout(() => {
            setTrail(prev => prev.slice(1));
        }, 150);
        return () => clearTimeout(timer);
    }, [trail]);

    useEffect(() => {
        if (isDesktop && isActive) {
            document.documentElement.classList.add('hacker-cursor-active');
        } else {
            document.documentElement.classList.remove('hacker-cursor-active');
        }
        return () => document.documentElement.classList.remove('hacker-cursor-active');
    }, [isDesktop, isActive]);

    if (!isDesktop) return null;

    const cursorSize = isClicking ? 28 : 36;
    const dotSize = isClicking ? 6 : 4;

    return (
        <div
            ref={cursorRef}
            id="hacker-cursor-layer"
            className="fixed inset-0 pointer-events-none"
            style={{
                zIndex: 99999,
                opacity: isVisible && isActive ? 1 : 0,
                transition: 'opacity 0.5s ease',
                '--cursor-x': '-100px',
                '--cursor-y': '-100px'
            } as any}
        >
            {/* Trail particles */}
            {trail.map((point, i) => (
                <div
                    key={point.id}
                    className="absolute rounded-full"
                    style={{
                        transform: `translate3d(${point.x - 2}px, ${point.y - 2}px, 0)`,
                        width: 4,
                        height: 4,
                        background: '#00FF41',
                        opacity: (i + 1) / trail.length * 0.3,
                        filter: `blur(${(trail.length - i) * 1}px)`,
                        transition: 'opacity 0.2s ease-out',
                    }}
                />
            ))}

            {/* Main cursor — outer ring */}
            <div
                className="absolute will-change-transform"
                style={{
                    width: cursorSize,
                    height: cursorSize,
                    transform: `translate3d(calc(var(--cursor-x) - ${cursorSize / 2}px), calc(var(--cursor-y) - ${cursorSize / 2}px), 0) rotate(${isClicking ? '45deg' : '0deg'})`,
                    transition: 'width 0.1s ease, height 0.1s ease, transform 0.05s linear',
                }}
            >
                <svg
                    width={cursorSize}
                    height={cursorSize}
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(0, 255, 65, 0.4))' }}
                >
                    <circle cx="18" cy="18" r="14" stroke="#00FF41" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" className={isClicking ? '' : 'animate-[spin_4s_linear_infinite]'} style={{ transformOrigin: 'center' }} />
                    <circle cx="18" cy="18" r="10" stroke="#00FF41" strokeWidth="0.5" opacity="0.3" />
                    <line x1="18" y1="2" x2="18" y2="6" stroke="#00FF41" strokeWidth="1.5" />
                    <line x1="18" y1="30" x2="18" y2="34" stroke="#00FF41" strokeWidth="1.5" />
                    <line x1="2" y1="18" x2="6" y2="18" stroke="#00FF41" strokeWidth="1.5" />
                    <line x1="30" y1="18" x2="34" y2="18" stroke="#00FF41" strokeWidth="1.5" />
                </svg>
            </div>

            {/* Center dot */}
            <div
                className="absolute will-change-transform"
                style={{
                    width: dotSize,
                    height: dotSize,
                    background: '#00FF41',
                    boxShadow: '0 0 8px #00FF41',
                    transform: `translate3d(calc(var(--cursor-x) - ${dotSize / 2}px), calc(var(--cursor-y) - ${dotSize / 2}px), 0)`,
                    transition: 'width 0.1s ease, height 0.1s ease, transform 0.02s linear',
                }}
            />
        </div>
    );
}

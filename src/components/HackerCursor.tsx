'use client';

import React, { useState, useEffect, useCallback } from 'react';

/**
 * HackerCursor — Desktop-only animated cursor transition.
 * On site entry, the default OS cursor smoothly morphs into a hacker-themed
 * crosshair cursor with a glowing green trail. The component renders a custom
 * cursor overlay that follows mouse movement. On mobile viewports (< 1024px),
 * the component renders nothing and the native cursor is unaffected.
 */
export default function HackerCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isVisible, setIsVisible] = useState(false);
    const [isActive, setIsActive] = useState(false); // true after the intro animation completes
    const [isClicking, setIsClicking] = useState(false);
    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
    const [isDesktop, setIsDesktop] = useState(false);

    // Detect desktop viewport (1024px+)
    useEffect(() => {
        const checkDesktop = () => {
            const desktop = window.innerWidth >= 1024 && window.matchMedia('(pointer: fine)').matches;
            setIsDesktop(desktop);
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    // Mouse tracking
    const handleMouseMove = useCallback((e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
        if (!isVisible) setIsVisible(true);
    }, [isVisible]);

    const handleMouseDown = useCallback(() => setIsClicking(true), []);
    const handleMouseUp = useCallback(() => setIsClicking(false), []);
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);
    const handleMouseEnter = useCallback(() => setIsVisible(true), []);

    useEffect(() => {
        if (!isDesktop) return;

        document.addEventListener('mousemove', handleMouseMove);
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

    // Intro animation: fade in after a short delay
    useEffect(() => {
        if (!isDesktop) return;
        const timer = setTimeout(() => setIsActive(true), 600);
        return () => clearTimeout(timer);
    }, [isDesktop]);

    // Trail effect
    useEffect(() => {
        if (!isDesktop || !isActive) return;
        const id = Date.now() + Math.random();
        setTrail(prev => [...prev.slice(-6), { x: position.x, y: position.y, id }]);
    }, [position, isDesktop, isActive]);

    // Remove trail particles after decay
    useEffect(() => {
        if (trail.length === 0) return;
        const timer = setTimeout(() => {
            setTrail(prev => prev.slice(1));
        }, 120);
        return () => clearTimeout(timer);
    }, [trail]);

    // Apply/remove the custom cursor class to hide the OS cursor on desktop
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
            id="hacker-cursor-layer"
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 99999 }}
        >
            {/* Trail particles */}
            {trail.map((point, i) => (
                <div
                    key={point.id}
                    className="absolute rounded-full"
                    style={{
                        left: point.x - 2,
                        top: point.y - 2,
                        width: 4,
                        height: 4,
                        background: '#00FF41',
                        opacity: (i + 1) / trail.length * 0.4,
                        filter: `blur(${(trail.length - i) * 0.5}px)`,
                        transition: 'opacity 0.15s ease-out',
                    }}
                />
            ))}

            {/* Main cursor — outer ring */}
            <div
                style={{
                    position: 'absolute',
                    left: position.x - cursorSize / 2,
                    top: position.y - cursorSize / 2,
                    width: cursorSize,
                    height: cursorSize,
                    transition: 'width 0.15s ease, height 0.15s ease, left 0.08s ease-out, top 0.08s ease-out, opacity 0.5s ease',
                    opacity: isVisible && isActive ? 1 : 0,
                    transform: `rotate(${isClicking ? '45deg' : '0deg'})`,
                }}
            >
                <svg
                    width={cursorSize}
                    height={cursorSize}
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(0, 255, 65, 0.6))' }}
                >
                    {/* Tech Ring */}
                    <circle cx="18" cy="18" r="14" stroke="#00FF41" strokeWidth="1" strokeDasharray="4 6" opacity="0.8" className={isClicking ? '' : 'animate-[spin_4s_linear_infinite]'} style={{ transformOrigin: 'center' }} />
                    <circle cx="18" cy="18" r="10" stroke="#00FF41" strokeWidth="0.5" opacity="0.4" />

                    {/* Directional ticks */}
                    <line x1="18" y1="2" x2="18" y2="6" stroke="#00FF41" strokeWidth="1.5" />
                    <line x1="18" y1="30" x2="18" y2="34" stroke="#00FF41" strokeWidth="1.5" />
                    <line x1="2" y1="18" x2="6" y2="18" stroke="#00FF41" strokeWidth="1.5" />
                    <line x1="30" y1="18" x2="34" y2="18" stroke="#00FF41" strokeWidth="1.5" />
                </svg>
            </div>

            {/* Center dot */}
            <div
                style={{
                    position: 'absolute',
                    left: position.x - dotSize / 2,
                    top: position.y - dotSize / 2,
                    width: dotSize,
                    height: dotSize,
                    background: '#00FF41',
                    boxShadow: '0 0 8px #00FF41, 0 0 16px rgba(0,255,65,0.3)',
                    transition: 'width 0.15s ease, height 0.15s ease, opacity 0.5s ease, left 0.05s ease-out, top 0.05s ease-out',
                    opacity: isVisible && isActive ? 1 : 0,
                }}
            />

            {/* Click ripple */}
            {isClicking && (
                <div
                    style={{
                        position: 'absolute',
                        left: position.x - 24,
                        top: position.y - 24,
                        width: 48,
                        height: 48,
                        border: '1px solid #00FF41',
                        opacity: 0.4,
                        animation: 'cursor-ripple 0.4s ease-out forwards',
                    }}
                />
            )}
        </div>
    );
}

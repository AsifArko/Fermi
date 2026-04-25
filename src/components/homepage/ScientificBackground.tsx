'use client';

import { useEffect, useState } from 'react';

export function ScientificBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particlePositions, setParticlePositions] = useState<
    Array<{
      left: number;
      top: number;
      animationDuration: number;
      animationDelay: number;
    }>
  >([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Generate random particle positions only on client side
    const positions = [...Array(12)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDuration: 3 + Math.random() * 4,
      animationDelay: Math.random() * 2,
    }));
    setParticlePositions(positions);

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      {/* Subtle grid lines */}
      <div className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05]'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `
              linear-gradient(rgba(75, 85, 99, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(75, 85, 99, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        />
      </div>

      {/* Floating particles - only render on client side */}
      {isClient && (
        <div className='absolute inset-0'>
          {particlePositions.map(particle => (
            <div
              key={`particle-${particle.left}-${particle.top}-${particle.animationDuration}`}
              className='absolute w-1 h-1 bg-gray-400/20 rounded-full animate-pulse'
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDuration: `${particle.animationDuration}s`,
                animationDelay: `${particle.animationDelay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Subtle wave patterns */}
      <div className='absolute inset-0 opacity-[0.02] dark:opacity-[0.03]'>
        <div
          className='absolute inset-0'
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(75, 85, 99, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(75, 85, 99, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(75, 85, 99, 0.1) 0%, transparent 50%)
            `,
            filter: 'blur(40px)',
            transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
          }}
        />
      </div>

      {/* DNA-like helix pattern */}
      <div className='absolute inset-0 opacity-[0.015] dark:opacity-[0.025]'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(75, 85, 99, 0.05) 2px,
                rgba(75, 85, 99, 0.05) 4px
              )
            `,
            backgroundSize: '60px 60px',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* Quantum dots */}
      <div className='absolute inset-0'>
        {[...Array(8)].map((_unused, index) => (
          <div
            key={`dot-${15 + index * 10}-${20 + (index % 3) * 25}-${Date.now()}`}
            className='absolute w-2 h-2 bg-gray-400/30 rounded-full animate-ping'
            style={{
              left: `${15 + index * 10}%`,
              top: `${20 + (index % 3) * 25}%`,
              animationDuration: `${2 + index * 0.5}s`,
              animationDelay: `${index * 0.3}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTheme } from 'next-themes';
import DecryptedText from '@/components/DecryptedText';
import { cn } from '@/utils/utils';

interface HeroModernProps {
  className?: string;
}

export function HeroModern({ className }: HeroModernProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const { scrollY } = useScroll();
  const yTranslate = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Handle mouse move for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Pixel Grid Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const isDark = resolvedTheme === 'dark';

    const cellSize = 20;
    let columns = 0;
    let rows = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
    };

    window.addEventListener('resize', resize);
    resize();

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const foregroundColor = isDark ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,';

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * cellSize;
          const y = j * cellSize;

          // Distance to mouse
          const dx = x + cellSize / 2 - mousePos.x;
          const dy = y + cellSize / 2 - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Spotlight effect
          const spotlightRadius = 200;
          let alpha = 0.03; // Base alpha

          if (dist < spotlightRadius) {
            alpha = 0.03 + (1 - dist / spotlightRadius) * 0.15;
          }

          // Subtle pulse based on time and position
          const pulse = Math.sin(time * 0.002 + (i + j) * 0.5) * 0.01;
          alpha += pulse;

          ctx.fillStyle = `${foregroundColor}${Math.max(0, alpha)})`;

          // Draw a pixel
          const pixelSize = 2;
          ctx.fillRect(x + (cellSize - pixelSize) / 2, y + (cellSize - pixelSize) / 2, pixelSize, pixelSize);

          // Occasionally draw a larger "active" pixel
          const noise = Math.sin(i * 12.3 + j * 45.6 + time * 0.001);
          if (noise > 0.98) {
            ctx.fillStyle = `${foregroundColor}${alpha * 2})`;
            ctx.fillRect(x + (cellSize - 4) / 2, y + (cellSize - 4) / 2, 4, 4);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme, mousePos]);

  return (
    <section
      ref={containerRef}
      className={cn('relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-20', className)}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="h-full w-full opacity-60 transition-opacity duration-1000" />
        {/* Gradients for depth */}
        <div className="via-background/40 to-background absolute inset-0 bg-radial-[circle_at_50%_50%] from-transparent" />
      </div>

      {/* Content */}
      <motion.div style={{ y: yTranslate, opacity }} className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-pixel text-muted-foreground/80 mb-4 inline-block text-[10px] tracking-[0.2em] uppercase">
            Frontend Engineering & Creative Lab
          </span>
        </motion.div>

        <h1 className="font-mulmaru mb-8 text-5xl leading-[1.1] font-bold tracking-tight text-balance md:text-8xl">
          <DecryptedText
            text="Bit By Bit,"
            animateOn="view"
            sequential
            revealDirection="center"
            speed={100}
            className="text-foreground"
            encryptedClassName="text-primary/30"
          />
          <br />
          <span className="text-muted-foreground/40 mt-2 inline-block">
            <DecryptedText
              text="Refining Digital Reality."
              animateOn="view"
              sequential
              revealDirection="start"
              speed={60}
              className="text-muted-foreground"
              encryptedClassName="text-muted-foreground/20"
            />
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mx-auto max-w-2xl"
        >
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed text-balance md:text-xl">
            작은 고민과 선택의 조각들이 모여 견고한 소프트웨어를 만듭니다.
            <br />
            프론트엔드 아키텍처, 사용자 경험, 그리고 예술적 영감을 기록하는 공간입니다.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-foreground font-pixel text-background relative flex h-12 items-center justify-center overflow-hidden rounded-sm px-8 text-[11px] transition-all"
            >
              <span className="relative z-10">EXPLORE POSTS</span>
              <div className="from-primary to-primary/50 absolute inset-0 -translate-x-full bg-linear-to-r transition-transform duration-300 group-hover:translate-x-0" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-6"
            >
              <div className="bg-border/50 h-px w-12" />
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-foreground/20 h-1.5 w-1.5"
                    style={{
                      animation: `pulse 2s infinite ${i * 0.4}s`,
                    }}
                  />
                ))}
              </div>
              <div className="bg-border/50 h-px w-12" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 z-5">
        <div className="via-border absolute top-1/4 left-10 h-32 w-px bg-linear-to-b from-transparent to-transparent opacity-20" />
        <div className="via-border absolute top-1/3 right-12 h-48 w-px bg-linear-to-b from-transparent to-transparent opacity-20" />
        <div className="via-border absolute bottom-1/4 left-1/4 h-px w-32 bg-linear-to-r from-transparent to-transparent opacity-20" />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </section>
  );
}

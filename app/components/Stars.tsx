'use client';

import { useEffect, useRef } from 'react';

export default function Stars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    }
    resize();

    // Generate stars
    const STAR_COUNT = 160;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2,
      color: ['#fff', '#e0e7ff', '#fce7f3', '#ddd6fe'][Math.floor(Math.random() * 4)],
    }));

    // Shooting stars
    const shoots: { x: number; y: number; len: number; speed: number; alpha: number; angle: number; life: number }[] = [];
    function addShoot() {
      shoots.push({
        x: Math.random() * canvas!.width,
        y: Math.random() * (canvas!.height * 0.4),
        len: Math.random() * 80 + 60,
        speed: Math.random() * 6 + 4,
        alpha: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        life: 1,
      });
    }
    const shootInterval = setInterval(addShoot, 2800);

    let t = 0;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Twinkling stars
      for (const s of stars) {
        const a = (Math.sin(t * s.speed + s.phase) + 1) / 2 * 0.85 + 0.15;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = a;
        ctx.fill();

        // Glow for brighter stars
        if (s.r > 1.2) {
          ctx.beginPath();
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          g.addColorStop(0, s.color);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.globalAlpha = a * 0.3;
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Shooting stars
      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= 0.018;
        if (s.life <= 0) { shoots.splice(i, 1); continue; }

        const tail = { x: s.x - Math.cos(s.angle) * s.len, y: s.y - Math.sin(s.angle) * s.len };
        const grad = ctx.createLinearGradient(tail.x, tail.y, s.x, s.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, `rgba(255,255,255,${s.life * 0.9})`);
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = s.life;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      t++;
      animId = requestAnimationFrame(draw);
    }
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(shootInterval);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

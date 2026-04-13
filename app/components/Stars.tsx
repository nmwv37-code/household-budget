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

    const COLORS = ['#ffffff', '#e0e7ff', '#fce7f3', '#ddd6fe', '#bfdbfe', '#fef9c3'];

    // 일반 별
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseR: Math.random() * 1.8 + 0.4,       // 기본 반지름
      twinkleSpeed: Math.random() * 0.04 + 0.01, // 반짝임 속도 (빠르게)
      twinkleAmp: Math.random() * 0.7 + 0.3,   // 반짝임 진폭 (크게)
      phase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      isBright: Math.random() < 0.25,           // 25%는 밝은 별(십자 글로우)
    }));

    // 유성
    const shoots: {
      x: number; y: number; len: number; speed: number; angle: number; life: number;
    }[] = [];
    function addShoot() {
      shoots.push({
        x: Math.random() * canvas!.width,
        y: Math.random() * (canvas!.height * 0.35),
        len: Math.random() * 100 + 60,
        speed: Math.random() * 7 + 5,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
        life: 1,
      });
    }
    const shootInterval = setInterval(addShoot, 2500);

    // 십자(스파클) 그리기
    function drawSparkle(x: number, y: number, r: number, alpha: number, color: string) {
      const arms = r * 5;
      ctx!.save();
      ctx!.globalAlpha = alpha * 0.6;
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 0.8;
      ctx!.beginPath();
      ctx!.moveTo(x - arms, y); ctx!.lineTo(x + arms, y);
      ctx!.moveTo(x, y - arms); ctx!.lineTo(x, y + arms);
      // 45도 짧은 대각선
      const d = arms * 0.55;
      ctx!.moveTo(x - d, y - d); ctx!.lineTo(x + d, y + d);
      ctx!.moveTo(x + d, y - d); ctx!.lineTo(x - d, y + d);
      ctx!.stroke();
      ctx!.restore();
    }

    let t = 0;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        // 0~1 범위의 반짝임 값 (제곱으로 날카롭게)
        const raw = (Math.sin(t * s.twinkleSpeed + s.phase) + 1) / 2;
        const twinkle = Math.pow(raw, 1.5);          // 어두웠다가 확 밝아지는 느낌
        const alpha = twinkle * s.twinkleAmp + (1 - s.twinkleAmp) * 0.05;
        const r = s.baseR * (0.6 + twinkle * 0.7);  // 크기도 함께 변화

        // 글로우
        const glowR = r * 5;
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        glow.addColorStop(0, s.color);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // 별 본체
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();

        // 밝은 별: 십자 스파클
        if (s.isBright && alpha > 0.5) {
          drawSparkle(s.x, s.y, r, alpha, s.color);
        }
      }

      // 유성
      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= 0.016;
        if (s.life <= 0) { shoots.splice(i, 1); continue; }

        const tx = s.x - Math.cos(s.angle) * s.len;
        const ty = s.y - Math.sin(s.angle) * s.len;
        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.7, `rgba(200,210,255,${s.life * 0.6})`);
        grad.addColorStop(1, `rgba(255,255,255,${s.life})`);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = s.life;
        ctx.stroke();

        // 유성 머리 글로우
        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6);
        hg.addColorStop(0, 'rgba(255,255,255,0.8)');
        hg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = hg;
        ctx.globalAlpha = s.life * 0.8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
        ctx.fill();
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

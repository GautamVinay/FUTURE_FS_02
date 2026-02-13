import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    const lines = Array.from({ length: 5 }, (_, i) => ({
      y: (height / 6) * (i + 1),
      amplitude: 20 + Math.random() * 30,
      frequency: 0.001 + Math.random() * 0.002,
      phase: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.01,
      color: `hsla(${200 + i * 20}, 70%, 50%, 0.15)`
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const isDark = document.documentElement.classList.contains('dark');
      
      lines.forEach((line) => {
        ctx.beginPath();
        ctx.strokeStyle = isDark ? line.color.replace('0.15', '0.25') : line.color;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < width; x += 5) {
          const y = line.y + Math.sin(x * line.frequency + line.phase) * line.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
        line.phase += line.speed;

        // Draw flowing dots
        const dotX = (Date.now() * 0.05 + lines.indexOf(line) * 200) % width;
        const dotY = line.y + Math.sin(dotX * line.frequency + line.phase) * line.amplitude;
        
        ctx.beginPath();
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.15)';
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        if (isDark) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = line.color;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none opacity-50"
    />
  );
}

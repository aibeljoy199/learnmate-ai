import { useEffect, useRef } from 'react';

export default function ParticleBackground({ speed = 1, density = 80, style = 'nodes', accentColor = 'purple' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Color mapper
    const getColor = (alpha = 1) => {
      if (accentColor === 'green') return `rgba(16, 185, 129, ${alpha})`;
      if (accentColor === 'blue') return `rgba(59, 130, 246, ${alpha})`;
      return `rgba(139, 92, 246, ${alpha})`; // purple default
    };

    const getHexColor = () => {
      if (accentColor === 'green') return '#10b981';
      if (accentColor === 'blue') return '#3b82f6';
      return '#8b5cf6';
    };

    // Re-initialize particles when size or density changes
    let particles = [];
    const initParticles = () => {
      particles = [];
      const count = Math.floor((width * height) / 12000) * (density / 80);
      const limit = Math.min(count, 300); // safety cap

      for (let i = 0; i < limit; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed * 0.8,
          vy: (Math.random() - 0.5) * speed * 0.8,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.1,
          phase: Math.random() * Math.PI * 2, // for waves or twinkling
        });
      }
    };

    initParticles();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Dark solid background
      ctx.fillStyle = '#07080e';
      ctx.fillRect(0, 0, width, height);

      // Radial dark glow in center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, '#0d0f19');
      gradient.addColorStop(1, '#07080e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      if (style === 'nodes') {
        // Draw lines
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            const maxDist = 120;
            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.12;
              ctx.strokeStyle = getColor(alpha);
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        // Draw dots
        particles.forEach((p) => {
          ctx.fillStyle = getColor(p.alpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Move
          p.x += p.vx;
          p.y += p.vy;

          // Bounce boundaries
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        });
      } else if (style === 'stars') {
        // Twinkling drift stars
        particles.forEach((p) => {
          p.phase += 0.01 * speed;
          const currentAlpha = Math.max(0.1, p.alpha + Math.sin(p.phase) * 0.2);
          
          ctx.fillStyle = getColor(currentAlpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (1 + Math.sin(p.phase) * 0.2), 0, Math.PI * 2);
          ctx.fill();

          // Drifting upwards
          p.y -= Math.abs(p.vy) * 0.5 + 0.1 * speed;
          p.x += p.vx * 0.2;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10 || p.x > width + 10) {
            p.vx *= -1;
          }
        });
      } else if (style === 'waves') {
        // Wave-like flow lines
        ctx.strokeStyle = getColor(0.08);
        ctx.lineWidth = 1.5;
        
        const lineCount = 5;
        for (let l = 0; l < lineCount; l++) {
          ctx.beginPath();
          const wavePhase = Date.now() * 0.0005 * speed + l * 0.5;
          for (let x = 0; x < width; x += 20) {
            const y = height / 2 + Math.sin(x * 0.003 + wavePhase) * 120 * Math.sin(wavePhase * 0.5 + l) + (l - 2) * 50;
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }

        // Drifting wave particles
        particles.forEach((p) => {
          p.phase += 0.02 * speed;
          const yOffset = Math.sin(p.x * 0.005 + p.phase) * 30;
          
          ctx.fillStyle = getColor(p.alpha * 0.7);
          ctx.beginPath();
          ctx.arc(p.x, p.y + yOffset, p.radius, 0, Math.PI * 2);
          ctx.fill();

          p.x += Math.abs(p.vx) + 0.2 * speed;
          if (p.x > width + 10) {
            p.x = -10;
            p.y = Math.random() * height;
          }
        });
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [speed, density, style, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}

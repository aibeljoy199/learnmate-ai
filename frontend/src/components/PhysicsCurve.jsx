import { useEffect, useRef } from 'react';

export default function PhysicsCurve({ stiffness = 180, damping = 12, accentColor = 'purple' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Run a numerical integration of the spring system to get points
    const points = [];
    let x = 0; // current position
    let v = 0; // velocity
    const target = 1; // target position
    
    // Convert slider parameters to reasonable coefficients
    // Stiffness: 50 to 500, Damping: 5 to 40
    const k = stiffness;
    const c = damping;
    const mass = 1.0;
    
    const dt = 0.016; // 60fps time step
    const maxSteps = 120; // ~2 seconds of simulation
    
    let maxOvershoot = 0;
    let settledIndex = -1;
    const tolerance = 0.01;

    for (let step = 0; step < maxSteps; step++) {
      const forceSpring = -k * (x - target);
      const forceDamper = -c * v;
      const acceleration = (forceSpring + forceDamper) / mass;
      
      v += acceleration * dt;
      x += v * dt;
      
      points.push(x);

      if (x > target && x - target > maxOvershoot) {
        maxOvershoot = x - target;
      }

      // Check if settled (within 1% of target and speed is low)
      if (Math.abs(x - target) < tolerance && Math.abs(v) < 0.1) {
        if (settledIndex === -1) {
          settledIndex = step;
        }
      } else {
        settledIndex = -1; // reset if it leaves tolerance band again
      }
    }

    // Draw graph
    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // Draw horizontal grid lines
    const gridRows = 4;
    for (let r = 1; r < gridRows; r++) {
      const y = (height / gridRows) * r;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw target line (y = 1)
    // Target is mapped in our graph: 0 is at bottom (height * 0.8), 1 is at height * 0.45
    // This allows overshoot to be visible up to 2.0
    const zeroY = height * 0.8;
    const targetY = height * 0.45;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, targetY);
    ctx.lineTo(width, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw axes lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(width, zeroY);
    ctx.stroke();

    // Map point index to X (0 to width), point value to Y
    const getCoords = (index, val) => {
      const px = (index / (maxSteps - 1)) * width;
      // scale: val = 0 maps to zeroY, val = 1 maps to targetY
      const py = zeroY - (val * (zeroY - targetY));
      return { x: px, y: py };
    };

    // Plot Spring Curve
    ctx.beginPath();
    const start = getCoords(0, 0);
    ctx.moveTo(start.x, start.y);

    for (let i = 1; i < points.length; i++) {
      const pt = getCoords(i, points[i]);
      ctx.lineTo(pt.x, pt.y);
    }

    // Color gradient for the curve
    const getHexColor = () => {
      if (accentColor === 'green') return '#10b981';
      if (accentColor === 'blue') return '#3b82f6';
      return '#8b5cf6';
    };
    
    ctx.strokeStyle = getHexColor();
    ctx.lineWidth = 2.5;
    ctx.shadowColor = getHexColor();
    ctx.shadowBlur = 4;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    // Draw diagnostic text
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '9px var(--font-mono)';
    
    const overshootPercent = Math.round(maxOvershoot * 100);
    const settlingTimeS = settledIndex !== -1 ? (settledIndex * dt).toFixed(2) : '> 1.9';

    ctx.fillText(`Target (1.0)`, 5, targetY - 4);
    ctx.fillText(`Overshoot: +${overshootPercent}%`, width - 90, 15);
    ctx.fillText(`Settle: ${settlingTimeS}s`, width - 90, 27);
    ctx.fillText(`k=${stiffness} c=${damping}`, 5, height - 6);

  }, [stiffness, damping, accentColor]);

  return (
    <div className="physics-curve-container" style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={260}
        height={100}
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '6px',
          display: 'block',
          width: '100%',
        }}
      />
    </div>
  );
}

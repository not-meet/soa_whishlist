"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noiseRef = useRef(createNoise3D());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);
  const ntRef = useRef(0);

  const getSpeed = useCallback(() => {
    switch (speed) {
      case "slow":
        return 0.0005;
      case "fast":
        return 0.001;
      default:
        return 0.0005;
    }
  }, [speed]);

  // Dark theme colors: #161616, #181818 and complementary colors
  const waveColors = colors ?? [
    "#161616", // Dark base
    "#181818", // Slightly lighter dark
    "#2a2a2a", // Medium dark gray
    "#1a1a1a", // Very dark gray
    "#242424", // Light dark gray
    "#0d0d0d", // Almost black
  ];

  const drawWave = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, n: number) => {
    ntRef.current += getSpeed();
    
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      
      let firstPoint = true;
      for (let x = 0; x < w; x += 3) { // Reduced step for smoother curves
        const y = noiseRef.current(x / 800, 0.3 * i, ntRef.current) * 100;
        const yPos = y + h * 0.95; // Position waves in lower portion of canvas
        
        if (firstPoint) {
          ctx.moveTo(x, yPos);
          firstPoint = false;
        } else {
          ctx.lineTo(x, yPos);
        }
      }
      ctx.stroke();
      ctx.closePath();
    }
  }, [waveWidth, waveColors, getSpeed]);

  const render = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Clear canvas with background
    ctx.fillStyle = backgroundFill || "#000000";
    ctx.fillRect(0, 0, w, h);
    
    // Set wave opacity
    ctx.globalAlpha = waveOpacity || 0.5;
    
    // Draw waves
    drawWave(ctx, w, h, 5);
    
    // Continue animation
    animationIdRef.current = requestAnimationFrame(() => render(ctx, w, h));
  }, [backgroundFill, waveOpacity, drawWave]);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    
    // Apply blur filter
    ctx.filter = `blur(${blur}px)`;
    
    // Reset time
    ntRef.current = 0;

    // Handle resize
    const handleResize = () => {
      const newW = canvas.width = window.innerWidth;
      const newH = canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
      
      // Cancel current animation and restart with new dimensions
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      render(ctx, newW, newH);
    };

    window.addEventListener('resize', handleResize);
    
    // Start rendering
    render(ctx, w, h);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [blur, render]);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  const [isSafari, setIsSafari] = useState(false);
  
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full h-[120vh] pointer-events-none -z-10 overflow-hidden",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 w-full h-full"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
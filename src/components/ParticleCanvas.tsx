import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
}

const PARTICLE_COLOR_BASE = { l: 0.90, c: 0.00, h: 0 }
const CONNECTION_DISTANCE = 120
const MOUSE_REPEL_RADIUS = 150
const MOUSE_REPEL_FORCE = 0.8

function isMobile() {
  return window.innerWidth < 768
}

function getParticleCount() {
  const w = window.innerWidth
  if (w < 480) return 30
  if (w < 768) return 45
  if (w < 1280) return 70
  return 90
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const dimensionsRef = useRef({ w: 0, h: 0 })

  const initParticles = useCallback((w: number, h: number) => {
    const count = getParticleCount()
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        hue: PARTICLE_COLOR_BASE.h + (Math.random() - 0.5) * 20,
      })
    }
    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dimensionsRef.current = { w, h }

      if (particlesRef.current.length === 0 || Math.abs(w - dimensionsRef.current.w) > 200) {
        initParticles(w, h)
      }
    }

    resize()
    initParticles(dimensionsRef.current.w, dimensionsRef.current.h)
    window.addEventListener('resize', resize)

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    if (!isMobile()) {
      window.addEventListener('mousemove', onMouse)
      window.addEventListener('mouseleave', onMouseLeave)
    }
    window.addEventListener('touchmove', onTouch, { passive: true })

    const draw = () => {
      const { w, h } = dimensionsRef.current
      const mouse = mouseRef.current
      const particles = particlesRef.current

      ctx.clearRect(0, 0, w, h)

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_REPEL_RADIUS) * MOUSE_REPEL_FORCE
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Damping
        p.vx *= 0.98
        p.vy *= 0.98

        // Drift back to gentle velocity
        p.vx += (Math.random() - 0.5) * 0.01
        p.vy += (Math.random() - 0.5) * 0.01

        // Move
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `oklch(${PARTICLE_COLOR_BASE.l} ${PARTICLE_COLOR_BASE.c} ${p.hue} / ${p.opacity})`
        ctx.fill()
      }

      // Draw connections
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `oklch(${PARTICLE_COLOR_BASE.l} ${PARTICLE_COLOR_BASE.c} ${PARTICLE_COLOR_BASE.h} / ${alpha})`
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}

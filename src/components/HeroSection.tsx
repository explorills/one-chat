import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ParticleCanvas } from './ParticleCanvas'

const ease = [0.22, 1, 0.36, 1] as const

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

const TAGLINE = 'Every message finds its way.'
const SECONDARY_LINES = [
  'Real-time.',
  'Reactions.',
  'Replies.',
  'Mentions.',
  'ONE ecosystem.',
]

function TypeWriter({ text, delay = 0, speed = 50 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) return

    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(timeout)
  }, [displayed, started, text, speed])

  return (
    <span>
      {displayed}
      <span
        className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-middle"
        style={{ animation: displayed.length >= text.length ? 'blink 1s step-end infinite' : 'none' }}
      />
    </span>
  )
}

function RotatingWords({ words, interval = 2500 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(timer)
  }, [words.length, interval])

  return (
    <span className="relative inline-block h-[1.3em] overflow-hidden align-bottom min-w-[200px] sm:min-w-[220px]">
      {words.map((word, i) => (
        <motion.span
          key={word}
          className="absolute left-0 text-primary font-semibold"
          initial={false}
          animate={{
            y: i === index ? 0 : i === (index - 1 + words.length) % words.length ? -30 : 30,
            opacity: i === index ? 1 : 0,
            filter: i === index ? 'blur(0px)' : 'blur(4px)',
          }}
          transition={{ duration: 0.5, ease }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

function GlitchText({ children }: { children: string }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 text-primary/60 z-0"
        style={{ animation: 'glitch-1 4s linear infinite' }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className="absolute inset-0 text-accent/40 z-0"
        style={{ animation: 'glitch-2 4s linear infinite 0.1s' }}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  )
}

function MorphBlob() {
  return (
    <div className="relative w-[400px] h-[400px] sm:w-[440px] sm:h-[440px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px]">
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full opacity-20"
        style={{ animation: 'breathe 4s ease-in-out infinite' }}
      >
        <div className="absolute inset-[-20%] rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Ripple rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-[10%] rounded-full border border-primary/15"
          style={{
            animation: `ripple 3s ease-out infinite ${i * 1}s`,
          }}
        />
      ))}

      {/* Morphing blob */}
      <div
        className="absolute inset-[5%] backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, oklch(0.90 0.00 0 / 0.06), oklch(0.70 0.00 0 / 0.03), oklch(0.90 0.00 0 / 0.05))',
          border: '1px solid oklch(0.90 0.00 0 / 0.10)',
          animation: 'morph 12s ease-in-out infinite',
        }}
      />

      {/* Inner core glow */}
      <div
        className="absolute inset-[25%] rounded-full blur-2xl"
        style={{
          background: 'radial-gradient(circle, oklch(0.90 0.00 0 / 0.12), transparent 70%)',
          animation: 'breathe 3s ease-in-out infinite 0.5s',
        }}
      />

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden rounded-full opacity-10 pointer-events-none">
        <div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ animation: 'scanline 4s linear infinite' }}
        />
      </div>
    </div>
  )
}

function useMouseParallax() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), springConfig)
  const y = useSpring(useTransform(mouseY, [0, 1], [-15, 15]), springConfig)

  useEffect(() => {
    if (window.innerWidth < 768) return

    const handle = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [mouseX, mouseY])

  return { x, y }
}

export function HeroSection() {
  const { x, y } = useMouseParallax()
  const sectionRef = useRef<HTMLElement>(null)

  // Deeper parallax for the blob
  const springConfig = { damping: 30, stiffness: 120 }
  const blobX = useSpring(useTransform(x, v => v * -1.5), springConfig)
  const blobY = useSpring(useTransform(y, v => v * -1.5), springConfig)

  return (
    <section
      ref={sectionRef}
      className="relative h-full flex overflow-hidden pt-16 sm:pt-20 md:pt-16"
    >
      {/* Particle background */}
      <ParticleCanvas />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 flex flex-col h-full">
        {/* Mobile: text on top of blob, stacked vertically */}
        <div className="relative flex flex-col lg:flex-row lg:items-center flex-1">

          {/* Left: Text content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative z-20 flex-1 text-left space-y-2 sm:space-y-2.5 md:space-y-3 lg:pt-0 lg:flex-1 flex flex-col justify-center"
          >
            {/* Subtle descriptor — above title */}
            <motion.p
              variants={fadeUp}
              className="text-xs sm:text-sm text-muted-foreground/50"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              the messaging layer of the ONE ecosystem
            </motion.p>

            {/* Typed tagline — progressive fit, never wraps */}
            <motion.h1
              variants={fadeUp}
              className="font-light leading-none tracking-tight whitespace-nowrap"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.25rem, 5.5vw, 3rem)' }}
            >
              <TypeWriter text={TAGLINE} delay={1200} speed={60} />
            </motion.h1>

            {/* Rotating feature words */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg md:text-xl text-muted-foreground font-light"
            >
              <RotatingWords words={SECONDARY_LINES} interval={2200} />
            </motion.p>
          </motion.div>

          {/* Right: Morphing abstract shape — absolutely positioned so title overlays it */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.2 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center"
            style={{ x: blobX, y: blobY }}
          >
            <MorphBlob />
          </motion.div>

          {/* Mobile blob — directly below text, bigger, shifted up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.2 }}
            className="lg:hidden absolute bottom-[-15%] left-1/2 -translate-x-1/2 z-10"
            style={{ x: blobX, y: blobY }}
          >
            <MorphBlob />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  )
}

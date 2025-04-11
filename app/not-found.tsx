'use client'

import React, { useRef, useEffect, useState } from 'react'

export const _404_PATH = "M43.4221 41.3979L39.8443 41.4786L39.1125 58.8979L20.7353 60.5108L21.7111 41.8818L0 42.3657L6.0173 6.96245H21.3858L16.9135 31.6399L22.2803 31.4786L23.8253 0.914062H41.4706L40.2509 30.8334L43.4221 30.6721V41.3979Z M96.3988 31.8818C96.3988 34.2474 96.1277 36.5995 95.5856 38.9383C95.0706 41.277 94.3117 43.5216 93.3088 45.6721C92.3059 47.8227 91.0727 49.8254 89.609 51.6802C88.1724 53.535 86.519 55.1479 84.6488 56.5189C82.7785 57.8899 80.7186 58.9651 78.4689 59.7447C76.2462 60.5243 73.8475 60.9141 71.2725 60.9141C68.6704 60.9141 66.2445 60.5243 63.9948 59.7447C61.7451 58.9651 59.6851 57.8899 57.8149 56.5189C55.9717 55.1479 54.3183 53.535 52.8547 51.6802C51.391 49.8254 50.1577 47.8227 49.1548 45.6721C48.152 43.5216 47.3795 41.277 46.8374 38.9383C46.3224 36.5727 46.0649 34.2205 46.0649 31.8818C46.0649 29.5431 46.3224 27.1909 46.8374 24.8254C47.3795 22.4598 48.152 20.2017 49.1548 18.0512C50.1577 15.9006 51.391 13.8979 52.8547 12.0431C54.3183 10.1614 55.9717 8.53503 57.8149 7.16406C59.6851 5.79309 61.7451 4.71783 63.9948 3.93826C66.2716 3.15869 68.6975 2.7689 71.2725 2.7689C73.8475 2.7689 76.2462 3.15869 78.4689 3.93826C80.7186 4.71783 82.7785 5.79309 84.6488 7.16406C86.519 8.53503 88.1724 10.1614 89.609 12.0431C91.0727 13.8979 92.3059 15.9006 93.3088 18.0512C94.3117 20.2017 95.0706 22.4598 95.5856 24.8254C96.1277 27.1909 96.3988 29.5431 96.3988 31.8818ZM79.2413 33.0915C79.2413 31.9087 79.0787 30.5915 78.7535 29.1399C78.4282 27.6883 77.9268 26.3307 77.2491 25.0673C76.5715 23.8038 75.7041 22.742 74.6471 21.8818C73.59 21.0216 72.3296 20.5915 70.8659 20.5915C69.3751 20.5915 68.1012 21.0216 67.0441 21.8818C65.987 22.742 65.1061 23.8038 64.4014 25.0673C63.7238 26.3307 63.2223 27.6883 62.8971 29.1399C62.5718 30.5915 62.4092 31.9087 62.4092 33.0915C62.4092 34.2743 62.5718 35.5915 62.8971 37.0431C63.2223 38.4947 63.7238 39.8522 64.4014 41.1157C65.1061 42.3791 65.987 43.4409 67.0441 44.3012C68.1012 45.1614 69.3751 45.5915 70.8659 45.5915C72.3296 45.5915 73.59 45.1614 74.6471 44.3012C75.7041 43.4409 76.5715 42.3791 77.2491 41.1157C77.9268 39.8522 78.4282 38.4947 78.7535 37.0431C79.0787 35.5915 79.2413 34.2743 79.2413 33.0915Z M141 41.3979L137.422 41.4786L136.69 58.8979L118.313 60.5108L119.289 41.8818L97.5779 42.3657L103.595 6.96245H118.964L114.491 31.6399L119.858 31.4786L121.403 0.914062H139.048L137.829 30.8334L141 30.6721V41.3979Z"

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768) // Set mobile breakpoint
    }

    updateCanvasSize()

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      scatteredColor: string
      life: number
    }[] = []

    let textImageData: ImageData | null = null

    function createTextImage() {
      if (!ctx || !canvas) return 0

      ctx.fillStyle = 'white'
      ctx.save()

      const logoHeight = 280;
      const logoWidth = 280;

      ctx.translate(canvas.width / 2 - logoWidth / 2, canvas.height / 2 - logoHeight / 2)

      ctx.save()
      const awsScale = logoHeight / 140
      ctx.scale(awsScale, awsScale)
      const path = new Path2D(_404_PATH)
      ctx.fill(path)
      ctx.restore()

      ctx.restore()

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      return Math.max(awsScale)
    }

    function createParticle() {
      if (!ctx || !canvas || !textImageData) return null

      const data = textImageData.data
      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() + 0.5,
            color: 'white',
            scatteredColor: 'black',
            life: Math.random() * 100 + 50
          }
        }
      }

      return null
    }

    function createInitialParticles() {
      const baseParticleCount = 7000 // Increased base count for higher density
      if (!canvas) return;
      const particleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle()
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId: number

    function animate(scale: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 240

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && (isTouchingRef.current || !('ontouchstart' in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 60
          const moveY = Math.sin(angle) * force * 60
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY

          ctx.fillStyle = p.scatteredColor
        } else {
          p.x += (p.baseX - p.x) * 0.1
          p.y += (p.baseY - p.y) * 0.1
          ctx.fillStyle = 'black'
        }

        ctx.fillRect(p.x, p.y, p.size, p.size)

        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle()
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      const baseParticleCount = 7000
      const targetParticleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle()
        if (newParticle) particles.push(newParticle)
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    const scale = createTextImage()
    createInitialParticles()
    animate(scale)

    const handleResize = () => {
      updateCanvasSize()
      createTextImage();
      particles = []
      createInitialParticles()
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!('ontouchstart' in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile])

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label="404"
      />
    </div>
  )
}

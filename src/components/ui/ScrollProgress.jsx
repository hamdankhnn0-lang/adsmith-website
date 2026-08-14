import { useEffect, useRef } from 'react'

/**
 * Hairline reading indicator across the top of the page.
 *
 * Written straight to a CSS custom property inside a rAF, so scrolling never
 * triggers a React render. Hidden from assistive tech and from anyone who has
 * asked for reduced motion.
 */
export default function ScrollProgress() {
  const ref = useRef(null)

  useEffect(() => {
    const bar = ref.current
    if (!bar) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      bar.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
      <div
        ref={ref}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-jade-600 via-jade-400 to-jade-200"
      />
    </div>
  )
}

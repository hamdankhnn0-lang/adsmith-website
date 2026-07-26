import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Fades and lifts children into view once, when they enter the viewport.
 * Falls back to rendering visible content when motion is reduced or when
 * IntersectionObserver is unavailable.
 */
export default function Reveal({
  as: Tag = 'div',
  children,
  delay = 0,
  distance = 24,
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`transition-[opacity,transform] duration-[900ms] ease-out-quint will-change-transform ${
        visible ? 'translate-y-0 opacity-100' : 'opacity-0'
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? undefined : `translateY(${distance}px)`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

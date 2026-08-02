import { useEffect, useRef, useState } from 'react'

/**
 * Fades and lifts children into view once, when they enter the viewport.
 *
 * The transition itself lives in CSS (the `reveal` utility) so no animation
 * library ships to the browser. Staggering is done with a CSS custom property
 * rather than timers, which keeps groups in sync.
 *
 * Falls back to visible content when IntersectionObserver is missing; reduced
 * motion is handled in the stylesheet.
 */
export default function Reveal({
  as: Tag = 'div',
  children,
  delay = 0,
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
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
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      className={`reveal ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

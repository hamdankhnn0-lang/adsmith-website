/**
 * Page section wrapper. The brand commits to white, so bands alternate
 * between canvas and the barely tinted canvas soft. Dark is reserved for
 * cards and product panels, never a whole marketing band.
 */
const tones = {
  canvas: 'bg-canvas text-ink',
  soft: 'bg-canvas-soft text-ink',
}

export default function Section({
  id,
  tone = 'canvas',
  className = '',
  containerClassName = '',
  children,
}) {
  return (
    <section id={id} className={`relative ${tones[tone]} ${className}`}>
      <div
        className={`relative mx-auto w-full max-w-[1280px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24 ${containerClassName}`}
      >
        {children}
      </div>
    </section>
  )
}

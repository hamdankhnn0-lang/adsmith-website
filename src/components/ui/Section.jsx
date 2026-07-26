/**
 * Page section wrapper. `tone` flips the whole band between the light
 * editorial surface and the near-black surface used for visual rhythm.
 */
const tones = {
  light: 'bg-paper text-ink',
  mist: 'bg-mist text-ink',
  dark: 'bg-ink text-white',
  void: 'bg-void text-white',
}

export default function Section({
  id,
  tone = 'light',
  className = '',
  containerClassName = '',
  children,
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${tones[tone]} ${className}`}
    >
      <div
        className={`relative mx-auto w-full max-w-[1240px] px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32 ${containerClassName}`}
      >
        {children}
      </div>
    </section>
  )
}

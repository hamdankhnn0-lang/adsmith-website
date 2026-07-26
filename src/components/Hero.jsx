import Button from './ui/Button.jsx'
import Reveal from './ui/Reveal.jsx'
import { heroStats } from '../data/site.js'

/** Slow-drifting gradient orbs + hairline grid. No imagery, no stock photos. */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />

      <div className="absolute inset-0 hairline-grid opacity-70" />

      <div className="absolute -left-[16%] top-[-24%] h-[48rem] w-[48rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(47,91,255,0.55),transparent_62%)] blur-[10px] animate-drift" />
      <div
        className="absolute -right-[10%] top-[2%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(30,66,214,0.42),transparent_64%)] blur-[16px] animate-drift"
        style={{ animationDelay: '-9s', animationDuration: '28s' }}
      />
      <div
        className="absolute bottom-[-32%] left-[28%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(147,169,255,0.28),transparent_60%)] blur-[20px] animate-drift"
        style={{ animationDelay: '-15s', animationDuration: '34s' }}
      />

      {/* Sharpen the type by darkening the centre of the canvas. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(10,10,10,0.42),rgba(10,10,10,0.86)_74%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      <div className="absolute inset-0 grain-layer opacity-[0.16] mix-blend-overlay" />
    </div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink text-white">
      <HeroBackdrop />

      <div className="relative mx-auto w-full max-w-[1240px] px-6 pb-16 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pb-24 lg:pt-40">
        <Reveal delay={40}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forge-300 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-forge-500" />
            </span>
            Forged for Growth
          </span>
        </Reveal>

        <Reveal delay={120} as="h1" className="mt-8 max-w-[19ch] display-tight text-[clamp(2.8rem,8.2vw,6.6rem)] font-semibold">
          Precision marketing,{' '}
          <span className="serif-accent text-forge-300">masterfully</span> built.
        </Reveal>

        <Reveal
          delay={220}
          as="p"
          className="mt-7 max-w-[54ch] text-[1.05rem] leading-relaxed text-white/62 sm:text-[1.15rem]"
        >
          Adsmith builds high-performance advertising and automation systems for restaurants,
          hotels, local brands and premium SMEs — engineered like craft, measured like finance.
        </Reveal>

        <Reveal delay={300} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href="#contact" size="lg" withArrow>
            Book a call
          </Button>
          <Button href="#contact" size="lg" variant="outlineLight">
            Get a free audit
          </Button>
        </Reveal>

        <Reveal delay={420} className="mt-16 lg:mt-24">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 sm:gap-x-10 lg:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-[2.4rem]">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block text-[0.78rem] uppercase tracking-[0.14em] text-white/40">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

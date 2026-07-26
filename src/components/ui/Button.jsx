const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full text-[0.9rem] font-medium tracking-tight transition-all duration-300 ease-out-quint disabled:cursor-not-allowed disabled:opacity-60'

const sizes = {
  sm: 'h-10 px-5',
  md: 'h-12 px-6',
  lg: 'h-14 px-8 text-[0.95rem]',
}

const variants = {
  // Primary CTA — the one place blue is allowed to shout.
  primary:
    'bg-forge-500 text-white shadow-[0_8px_30px_-10px_rgba(47,91,255,0.85)] hover:bg-forge-600 hover:shadow-[0_14px_44px_-12px_rgba(47,91,255,0.95)] hover:-translate-y-0.5',
  ink: 'bg-ink text-white hover:bg-ink-700 hover:-translate-y-0.5',
  light: 'bg-white text-ink hover:bg-forge-50 hover:-translate-y-0.5',
  outline:
    'border border-ink/15 bg-transparent text-ink hover:border-forge-500 hover:text-forge-600 hover:bg-forge-50/60',
  outlineLight:
    'border border-white/20 bg-transparent text-white hover:border-white/60 hover:bg-white/5',
  ghost: 'text-ink hover:text-forge-600',
}

export default function Button({
  as = 'a',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  withArrow = false,
  ...rest
}) {
  const Tag = as

  return (
    <Tag className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      <span>{children}</span>
      {withArrow && (
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out-quint group-hover:translate-x-1"
        >
          <path
            d="M1 8h13M9 3l5 5-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Tag>
  )
}

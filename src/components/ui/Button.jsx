const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-all duration-300 ease-out-quint disabled:cursor-not-allowed disabled:opacity-60'

const sizes = {
  sm: 'h-10 px-5 text-[0.875rem]',
  md: 'h-11 px-6 text-[0.9rem]',
  lg: 'h-13 px-7 text-[0.95rem]',
}

const variants = {
  // The one loud surface on the page.
  primary:
    'bg-jade-500 text-on-jade shadow-[0_10px_34px_-14px_rgba(47,207,150,0.9)] hover:bg-jade-400 hover:shadow-[0_16px_44px_-14px_rgba(47,207,150,1)] hover:-translate-y-0.5',
  glass:
    'glass text-text edge-light hover:bg-white/[0.09] hover:border-white/20 hover:-translate-y-0.5',
  sand: 'bg-sand text-ground hover:bg-white hover:-translate-y-0.5',
  quiet: 'text-text-mute hover:text-text',
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
    <Tag
      className={`${base} ${variant === 'quiet' ? '' : sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
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
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Tag>
  )
}

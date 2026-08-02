const base =
  'group inline-flex items-center justify-center gap-2 rounded-sm text-[0.875rem] font-medium leading-none transition-colors duration-200 ease-out-quint disabled:cursor-not-allowed disabled:opacity-60'

const sizes = {
  sm: 'h-9 px-4',
  md: 'h-10 px-4',
  lg: 'h-11 px-5',
}

const variants = {
  // The signature CTA. Near black type on emerald, never white.
  primary: 'bg-primary text-on-primary hover:bg-primary-deep',
  outline:
    'border border-hairline-strong bg-canvas text-ink hover:bg-canvas-soft hover:border-ink-faint',
  dark: 'bg-canvas-night text-on-dark hover:bg-canvas-night-soft',
  link: 'text-ink underline-offset-4 hover:underline px-0',
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
      className={`${base} ${variant === 'link' ? '' : sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {withArrow && (
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5"
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

import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary: 'bg-rose-400 text-white hover:bg-rose-500 shadow-soft hover:shadow-card',
  secondary: 'bg-sage-200 text-charcoal-800 hover:bg-sage-100',
  outline: 'border border-charcoal-300/40 text-charcoal-800 hover:border-rose-300 hover:bg-blush-50',
  ghost: 'text-charcoal-700 hover:bg-charcoal-100/60',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm sm:text-base',
  lg: 'px-8 py-4 text-base sm:text-lg',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

interface ButtonAsButton extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  href?: undefined
}

interface ButtonAsLink extends CommonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
  href: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

    if ('href' in props && props.href) {
      const { href, ...rest } = props
      return (
        <Link
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)}
        >
          {children}
        </Link>
      )
    }

    const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>
    return (
      <button ref={ref as Ref<HTMLButtonElement>} className={classes} {...buttonProps}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

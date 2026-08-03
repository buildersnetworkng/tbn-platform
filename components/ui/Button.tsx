import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary';

interface BaseProps {
  variant?: ButtonVariant;
  loading?: boolean;
  className?: string;
}

interface ButtonAsButton extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
  children: ReactNode;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  children: ReactNode;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = 'primary', loading = false, children, className = '' } = props;

  const base =
    'inline-flex items-center justify-center rounded-md px-5 tablet:px-[22px] h-11 tablet:h-10 text-sm font-medium transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none disabled:opacity-40 disabled:pointer-events-none';

  const variantClasses =
    variant === 'primary'
      ? 'bg-accent text-background-primary hover:bg-accent-hover'
      : 'bg-transparent text-text-primary border border-border hover:border-hover hover:bg-white/[0.06]';

  const classes = `${base} ${variantClasses} ${className}`;

  const content = loading ? (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
  ) : (
    children
  );

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button {...buttonProps} disabled={loading || buttonProps.disabled} aria-busy={loading} className={classes}>
      {content}
    </button>
  );
}

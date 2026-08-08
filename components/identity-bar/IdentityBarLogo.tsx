import Link from 'next/link';

export function IdentityBarLogo() {
  return (
    <Link
      href="/"
      aria-label="THE BUILDERS NETWORK — Home"
      className="flex items-center gap-2.5 transition-opacity duration-150 hover:opacity-85"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="#C7D9FF" strokeWidth="2.4" />
      </svg>
      <span className="font-sans text-[15px] tablet:text-base font-bold tracking-tight text-accent">
        THE BUILDERS NETWORK
      </span>
    </Link>
  );
}

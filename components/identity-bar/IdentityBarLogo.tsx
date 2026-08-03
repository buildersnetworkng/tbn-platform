import Link from 'next/link';

export function IdentityBarLogo() {
  return (
    <Link href="/" aria-label="THE BUILDERS NETWORK — Home" className="font-sans text-[15px] tablet:text-base font-semibold tracking-tight text-text-primary transition-opacity duration-150 hover:opacity-85">
      THE BUILDERS NETWORK
    </Link>
  );
}

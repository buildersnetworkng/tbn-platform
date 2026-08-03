import Link from 'next/link';

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/thebuildersnet_/' },
  { label: 'X', href: 'https://x.com/thebuildersnet_' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/thebuildersnet/' },
  { label: 'WhatsApp', href: 'https://chat.whatsapp.com/DcmiH3z8h7QHIAY25Eu4Sw' },
];

const LINK_GROUPS = [
  {
    title: 'Platform',
    links: [
      { label: 'Builders', href: '/builders' },
      { label: 'Opportunities', href: '/opportunities' },
      { label: 'Organizations', href: '/organizations' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help & Docs', href: '/help' },
      { label: 'Guides', href: '/guides' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer aria-label="Footer navigation" className="mx-auto w-full max-w-content px-5 pb-14 pt-20 tablet:px-8 desktop:px-12">
      <div className="grid grid-cols-1 gap-10 tablet:grid-cols-4 tablet:gap-8">
        <div>
          <Link href="/" className="font-sans text-sm font-semibold text-text-primary">
            THE BUILDERS NETWORK
          </Link>
          <p className="mt-3 max-w-[220px] font-sans text-sm text-text-muted">Learn. Build. Collaborate.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs text-text-muted transition-colors duration-150 hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {LINK_GROUPS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <p className="font-sans text-xs uppercase tracking-[0.02em] text-text-muted">{group.title}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-sans text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-14 border-t border-hairline pt-6">
        <p className="font-sans text-xs text-text-muted">
          © {new Date().getFullYear()} THE BUILDERS NETWORK. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

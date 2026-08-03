'use client';

import { useState } from 'react';
import { useScrollState } from './useScrollState';
import { IdentityBarLogo } from './IdentityBarLogo';
import { IdentityBarNav } from './IdentityBarNav';
import { IdentityBarCTAs } from './IdentityBarCTAs';
import { MenuToggle } from './MenuToggle';
import { MobileMenu } from './MobileMenu';

export function IdentityBar() {
  const scrollState = useScrollState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header data-scroll-state={scrollState} className="identity-bar fixed top-0 left-0 right-0 z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto flex h-full max-w-content items-center justify-between px-5 tablet:px-8 desktop:px-12">
          <IdentityBarLogo />
          <IdentityBarNav />
          <IdentityBarCTAs />
          <MenuToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen((open) => !open)} />
        </div>
      </header>
      <div id="mobile-navigation">
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      </div>
    </>
  );
}

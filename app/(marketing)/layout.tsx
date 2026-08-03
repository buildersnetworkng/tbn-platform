import { IdentityBar } from '@/components/identity-bar/IdentityBar';
import { Footer } from '@/components/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <IdentityBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

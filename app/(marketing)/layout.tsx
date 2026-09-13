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
      <main className="relative z-10">{children}</main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}

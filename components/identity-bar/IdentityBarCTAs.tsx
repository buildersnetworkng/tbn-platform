import { Button } from '../ui/Button';

export function IdentityBarCTAs() {
  return (
    <div className="hidden desktop:flex items-center gap-3">
      <Button variant="secondary" href="/builders">Explore Builders</Button>
      <Button variant="primary" href="/apply">Apply</Button>
    </div>
  );
}

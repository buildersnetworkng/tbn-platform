interface MenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MenuToggle({ isOpen, onClick }: MenuToggleProps) {
  return (
    <button type="button" onClick={onClick} aria-expanded={isOpen} aria-controls="mobile-navigation" aria-label={isOpen ? 'Close menu' : 'Open menu'} className="desktop:hidden flex h-11 w-11 items-center justify-center">
      <span className="relative h-4 w-5" aria-hidden="true">
        <span className={`absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-text-primary transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'top-1/2 rotate-45' : ''}`} />
        <span className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-text-primary transition-opacity duration-150 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
        <span className={`absolute bottom-0 left-0 h-[1.5px] w-full rounded-full bg-text-primary transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'bottom-1/2 -rotate-45' : ''}`} />
      </span>
    </button>
  );
}

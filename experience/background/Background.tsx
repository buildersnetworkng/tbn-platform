import { LivingBackground } from '../../components/background/LivingBackground';
import { CalmBackground } from '../../components/background/CalmBackground';

export type BackgroundMode = 'living' | 'calm';

const BACKGROUND_IMPLEMENTATIONS: Record<BackgroundMode, () => React.ReactNode> = {
  living: () => <LivingBackground />,
  calm: () => <CalmBackground />,
};

interface BackgroundProps {
  mode: BackgroundMode;
}

export function Background({ mode }: BackgroundProps) {
  return <>{BACKGROUND_IMPLEMENTATIONS[mode]()}</>;
}

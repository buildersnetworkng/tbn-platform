import { LivingBackground } from '../../components/background/LivingBackground';
import { CalmBackground } from '../../components/background/CalmBackground';
import { ApplyBackground } from '../../components/background/ApplyBackground';

export type BackgroundMode = 'living' | 'calm' | 'apply';

const BACKGROUND_IMPLEMENTATIONS: Record<BackgroundMode, () => React.ReactNode> = {
  living: () => <LivingBackground />,
  calm: () => <CalmBackground />,
  apply: () => <ApplyBackground />,
};

interface BackgroundProps {
  mode: BackgroundMode;
}

export function Background({ mode }: BackgroundProps) {
  return <>{BACKGROUND_IMPLEMENTATIONS[mode]()}</>;
}

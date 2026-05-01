// import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import {
  BookOpen,
  Cloud,
  Code,
  Cpu,
  Database,
  HardDrive,
  Monitor,
  Server,
  Settings,
  Shield
} from 'lucide-react';
import { createElement } from 'react';

const iconMap = {
  cloud: Cloud,
  code: Code,
  monitor: Monitor,
  server: Server,
  database: Database,
  settings: Settings,
  'book-open': BookOpen,
  'hard-drive': HardDrive,
  shield: Shield,
  cpu: Cpu
};

export function getLucideIcon(
  iconName: string | undefined,
  props?: LucideProps
): React.ReactNode {
  const defaultProps: LucideProps = {
    className: 'h-12 w-12 text-sky-500',
    ...props
  };

  if (!iconName) return <Cloud {...defaultProps} />;

  if (iconName in iconMap) {
    return createElement(
      iconMap[iconName as keyof typeof iconMap],
      defaultProps
    );
  }

  return <Cloud {...defaultProps} />;
}

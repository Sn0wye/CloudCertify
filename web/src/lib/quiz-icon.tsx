// import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { Cloud } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';

// function toPascalCase(kebab: string): string {
//   return kebab
//     .split('-')
//     .map(s => s.charAt(0).toUpperCase() + s.slice(1))
//     .join('');
// }

export function getLucideIcon(
  iconName: string | undefined,
  props?: LucideProps
): React.ReactNode {
  const defaultProps: LucideProps = {
    className: 'h-12 w-12 text-sky-500',
    ...props
  };
  console.log('Icon name:', iconName);

  if (!iconName) return <Cloud {...defaultProps} />;

  // const pascalName = toPascalCase(iconName);
  // @ts-expect-error - DynamicIcon does not have proper typings for dynamic usage
  return <DynamicIcon name={iconName} {...defaultProps} />;

  // const IconComponent = (LucideIcons as Record<string, unknown>)[pascalName] as
  //   | React.ComponentType<LucideProps>
  //   | undefined;

  // if (!IconComponent || typeof IconComponent !== 'function') {
  //   return <Cloud {...defaultProps} />;
  // }

  // return <IconComponent {...defaultProps} />;
}

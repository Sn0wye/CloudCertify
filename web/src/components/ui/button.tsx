import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-hidden border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground border-primary hover:brightness-110',
        destructive:
          'bg-destructive text-destructive-foreground border-destructive hover:brightness-110',
        outline:
          'bg-transparent text-foreground border-border-strong hover:border-primary hover:text-primary',
        secondary:
          'bg-secondary text-secondary-foreground border-border-strong hover:border-primary hover:text-primary',
        ghost:
          'border-transparent text-foreground hover:bg-secondary hover:text-primary',
        link: 'border-transparent text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 gap-1.5 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'size-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

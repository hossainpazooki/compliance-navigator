import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/utils';

interface HelpIconProps extends HTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md';
}

export const HelpIcon = forwardRef<HTMLButtonElement, HelpIconProps>(
  ({ className, size = 'sm', ...props }, ref) => {
    const sizes = {
      sm: 'h-4 w-4 text-xs',
      md: 'h-5 w-5 text-sm',
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500',
          sizes[size],
          className
        )}
        aria-label="Help"
        {...props}
      >
        ?
      </button>
    );
  }
);

HelpIcon.displayName = 'HelpIcon';

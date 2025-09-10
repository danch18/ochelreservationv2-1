import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            className={cn(
              'w-full px-4 py-3 rounded-2xl border',
              'bg-white text-black placeholder-[#0A0A0A]/50',
              'outline-none transition-all duration-200',
              '[&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-0',
              'disabled:bg-gray-100 disabled:text-gray-400',
            error
              ? '!border-[#e54d2e] focus:!border-[#e54d2e] focus:border-[1px]'
              : '!border-[#F6F1F0] focus:!border-[#FF7043] focus:border-[1px]',
              icon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {icon}
            </div>
          )}
        </div>
        {helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
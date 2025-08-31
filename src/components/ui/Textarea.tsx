import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 border rounded-lg resize-y',
            'bg-input text-foreground placeholder-muted-foreground',
            'focus:outline-none',
            'autofill:!bg-input autofill:!text-foreground',
            'transition-colors duration-200',
            'disabled:bg-muted disabled:text-muted-foreground',
            error
              ? 'border-destructive focus:!border-[#EFE7D2]/50'
              : 'border-input focus:!border-[#EFE7D2]/50',
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
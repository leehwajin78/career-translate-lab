import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, id, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

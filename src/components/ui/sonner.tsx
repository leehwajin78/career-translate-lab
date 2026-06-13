import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-soft group-[.toaster]:rounded-2xl group-[.toaster]:font-sans",
          title:
            "group-[.toast]:text-primary group-[.toast]:font-bold group-[.toast]:text-sm",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-full group-[.toast]:text-xs group-[.toast]:font-bold group-[.toast]:px-4",
          cancelButton:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:bg-secondary",
          error:
            "group-[.toaster]:border-destructive/20 group-[.toaster]:bg-destructive/5 group-[.toaster]:text-destructive",
          success:
            "group-[.toaster]:border-accent/20 group-[.toaster]:bg-accent-soft group-[.toaster]:text-primary",
          warning:
            "group-[.toaster]:border-warning/30 group-[.toaster]:bg-warning-bg",
          info:
            "group-[.toaster]:border-primary/20 group-[.toaster]:bg-accent-soft",
        },
      }}
      {...props}
    />
  );
};


export { Toaster, toast };

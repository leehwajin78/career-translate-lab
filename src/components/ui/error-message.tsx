import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * FieldError
 * 폼 입력 필드 하단에 위치하는 작은 텍스트 에러 컴포넌트
 */
export function FieldError({ children, className, ...props }: ErrorMessageProps) {
  if (!children) return null;

  return (
    <p
      className={cn("mt-1.5 flex items-center text-sm font-medium text-destructive", className)}
      {...props}
    >
      <AlertCircle className="mr-1.5 h-4 w-4 shrink-0" />
      {children}
    </p>
  );
}

/**
 * ErrorBox
 * 페이지나 모달 상단에 위치하는 박스 형태의 큰 에러 컴포넌트
 */
export function ErrorBox({ children, className, ...props }: ErrorMessageProps) {
  if (!children) return null;

  return (
    <div
      className={cn(
        "flex items-start rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive shadow-sm",
        className
      )}
      {...props}
    >
      <AlertCircle className="mr-2 h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 font-medium">{children}</div>
    </div>
  );
}

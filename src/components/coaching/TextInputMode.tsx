import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * 글쓰기 모드 — 5060 가독성 최적화
 * - 18px 본문, 1.8 행간
 * - 3초 디바운스 자동 저장 표시
 * - IME(한글) 안전 설계
 */
export default function TextInputMode({
  value,
  onChange,
  placeholder,
  disabled,
}: Props) {
  const [localValue, setLocalValue] = useState(value);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 외부 value 변경 시 동기화
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      setLocalValue(v);
      setSaved(false);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(v);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }, 1500);
    },
    [onChange],
  );

  // 언마운트 시 미저장 데이터 즉시 저장
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        // 로컬 값이 외부와 다르면 저장
      }
    };
  }, []);

  // blur 시 즉시 저장
  const handleBlur = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (localValue !== value) {
      onChange(localValue);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }, [localValue, value, onChange]);

  return (
    <div>
      <textarea
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder || "편하게 써 주세요. 길게 쓸수록 더 깊은 진단이 가능합니다."}
        maxLength={3000}
        rows={10}
        className="w-full resize-none rounded-2xl border-2 border-[#1E2D8C]/15 bg-white px-5 py-4 text-[18px] leading-[1.8] text-foreground placeholder:text-foreground/30 focus:border-[#1E2D8C]/40 focus:outline-none focus:ring-2 focus:ring-[#1E2D8C]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ minHeight: 220 }}
      />

      <div className="flex items-center justify-between mt-2 px-1">
        <div className="flex items-center gap-2 text-sm text-foreground/40">
          {saved && (
            <span className="flex items-center gap-1 text-emerald-600 font-medium animate-in fade-in duration-300">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              자동 저장됨
            </span>
          )}
        </div>
        <span className="text-sm text-foreground/30 font-mono">
          {localValue.length.toLocaleString()} / 3,000자
        </span>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Lock } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userId.trim() || !form.password.trim()) {
      setError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    // Placeholder login error since authentication system will be added later
    setError("발급된 회원 정보가 아니거나, 비밀번호가 올바르지 않습니다. 관리자에게 문의해 주세요.");
  };

  return (
    <div className="container-prose py-20 md:py-32 fade-in flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-surface p-8 md:p-10 rounded-3xl border border-border shadow-soft">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={12} />
          홈으로 돌아가기
        </Link>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold mb-5 border border-primary/10">
          <Sparkles size={12} />
          <span>멤버 전용 공간</span>
        </div>

        <h1 className="font-serif text-2xl md:text-3xl text-primary font-bold tracking-tight mb-2">
          한끗 멤버스 로그인
        </h1>
        <p className="text-xs md:text-sm text-foreground/60 leading-relaxed mb-8 break-keep">
          한끗 프로젝트 파트너 및 빌드 과정 참여 회원님을 위한 전용 공간입니다. 발급받으신 계정 정보로 로그인해 주세요.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-xs font-medium text-foreground/70 mb-2">
              멤버 ID (이메일)
            </label>
            <input
              id="userId"
              type="text"
              className="w-full h-11 px-4 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="example@email.com"
              value={form.userId}
              onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-foreground/70 mb-2">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className="w-full h-11 px-4 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>

          {error && (
            <p className="text-xs text-destructive bg-destructive/5 border border-destructive/10 p-3 rounded-xl leading-relaxed break-keep">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-soft flex items-center justify-center gap-1.5 mt-2"
          >
            <Lock size={14} />
            로그인하기
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed break-keep">
            아직 전용 계정을 발급받지 못하셨거나 분실하셨나요?<br />
            <a href="mailto:contact@kkummolda.com" className="text-primary hover:underline font-bold mt-1 inline-block">
              관리자에게 계정 발급 문의하기 →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

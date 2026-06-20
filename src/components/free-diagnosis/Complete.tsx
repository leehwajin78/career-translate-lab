'use client';

import { useFreeDiagnosticStore } from "@/store/freeDiagnosticStore";
import Link from "next/link";
import { Check } from "lucide-react";

export default function Complete() {
  const { lead } = useFreeDiagnosticStore();

  return (
    <div className="container-prose py-24 md:py-32 fade-in">
      <div className="max-w-lg mx-auto text-center">
        {/* Check Icon */}
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto shadow-lg">
          <Check size={32} className="text-white" strokeWidth={3} />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-2xl md:text-3xl text-primary mt-8 leading-snug">
          레포트가 이메일로 발송됐습니다
        </h1>
        <p className="mt-4 text-muted-foreground">
          <span className="font-medium text-foreground">{lead?.email ?? "이메일"}</span>
          으로 발송됐어요.
          <br />
          스팸함도 확인해 주세요.
        </p>

        {/* Divider */}
        <div className="my-10 gold-rule" />

        {/* CTA */}
        <div className="bg-secondary/60 rounded-2xl p-8 text-center">
          <p className="text-foreground/80 font-medium mb-4">더 깊은 분석을 원하신다면</p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-bold hover:bg-primary/90 transition-colors shadow-soft"
          >
            한끗 진단 신청하기
          </Link>
        </div>

        {/* Bottom */}
        <p className="mt-8 text-xs text-muted-foreground/70">
          3일 후 추가 인사이트 이메일을 보내드릴게요
        </p>
      </div>
    </div>
  );
}

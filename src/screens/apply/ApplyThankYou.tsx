'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Phone, Mail } from "lucide-react";
import { APPLY_PRODUCTS, type ApplyProductKey } from "@/data/content";

export default function ApplyThankYou() {
  const searchParams = useSearchParams();
  const productKey = (searchParams.get("product") || "diagnosis") as ApplyProductKey;
  const product = APPLY_PRODUCTS[productKey];

  return (
    <div className="container-prose py-16 md:py-28">
      <div className="max-w-2xl mx-auto text-center">
        {/* 성공 아이콘 */}
        <div className="mx-auto w-20 h-20 bg-[#1E2D8C] rounded-full flex items-center justify-center mb-8 shadow-lg">
          <Check size={40} className="text-white" strokeWidth={3} />
        </div>

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1E2D8C] leading-tight mb-4">
          신청이 접수되었습니다
        </h1>

        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-3 break-keep">
          <strong className="text-[#1E2D8C]">{product.name}</strong> 신청서가 운영자에게 전달되었습니다.
        </p>

        <p className="text-base text-foreground/60 leading-[1.7] mb-10 break-keep">
          24시간 안에 운영자가 직접 연락드려
          <br className="hidden sm:block" /> 일정과 진행 방식을 안내해 드리겠습니다.
        </p>

        {/* 진행 안내 */}
        <div className="bg-[#F0EFFB] rounded-2xl p-6 md:p-8 text-left mb-10">
          <h2 className="font-serif text-lg md:text-xl font-extrabold text-[#1E2D8C] mb-5">
            앞으로 이렇게 진행됩니다
          </h2>
          <ol className="space-y-4 text-base text-foreground/80 leading-[1.7]">
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 bg-[#1E2D8C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span className="break-keep">
                <strong className="text-[#1E2D8C]">24시간 안에 운영자가 연락드립니다</strong>
                <br />
                요청하신 방법(전화/카카오톡/이메일)으로 연락드리겠습니다.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 bg-[#1E2D8C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span className="break-keep">
                <strong className="text-[#1E2D8C]">일정과 진행 방식을 함께 정합니다</strong>
                <br />
                통화 또는 카카오톡으로 편하게 상담합니다.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 bg-[#1E2D8C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span className="break-keep">
                <strong className="text-[#1E2D8C]">결제와 일정이 확정됩니다</strong>
                <br />
                충분히 대화한 뒤 본인이 결정하시면 됩니다.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 bg-[#1E2D8C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span className="break-keep">
                <strong className="text-[#1E2D8C]">첫 미팅 일정을 잡습니다</strong>
                <br />
                본격적인 {product.name} 과정이 시작됩니다.
              </span>
            </li>
          </ol>
        </div>

        {/* 링크들 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-[#1E2D8C] text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-[#1E2D8C]/90 transition-all shadow-lg w-full sm:w-auto"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/#packages"
            className="inline-flex items-center justify-center border-2 border-[#1E2D8C]/30 text-[#1E2D8C] px-8 py-4 rounded-2xl font-bold text-base hover:border-[#1E2D8C] transition-all w-full sm:w-auto"
          >
            단계별 상품 다시 보기
          </Link>
        </div>

        {/* 문의 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-foreground/50">
          <span className="flex items-center gap-1.5">
            <Phone size={14} className="shrink-0" />
            070-4090-2161
          </span>
          <span className="hidden sm:block text-foreground/30">/</span>
          <span className="flex items-center gap-1.5">
            <Mail size={14} className="shrink-0" />
            kkummolda@kkummolda.com
          </span>
        </div>
      </div>
    </div>
  );
}

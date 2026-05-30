import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import ProductConfirmCard from "@/components/site/ProductConfirmCard";
import ApplyForm from "@/components/site/ApplyForm";
import type { ApplyProductKey } from "@/data/content";

interface ApplyPageProps {
  productKey: ApplyProductKey;
}

export default function ApplyPage({ productKey }: ApplyPageProps) {
  return (
    <div className="container-prose py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        {/* 상단 네비 링크 */}
        <div className="flex justify-end mb-8">
          <Link
            to="/#packages"
            className="text-sm text-[#1E2D8C]/60 hover:text-[#1E2D8C] transition-colors underline underline-offset-4 font-medium"
          >
            ← 단계별 상품 다시 보기
          </Link>
        </div>

        {/* 섹션 2: 상품 확인 카드 */}
        <ProductConfirmCard productKey={productKey} />

        {/* 섹션 3: 신청 폼 */}
        <ApplyForm productKey={productKey} />

        {/* 섹션 4: 안내 박스 */}
        <section className="bg-[#F0EFFB] rounded-2xl p-6 md:p-8 lg:p-10">
          <h3 className="font-serif text-xl md:text-2xl font-extrabold text-[#1E2D8C] mb-6">
            신청 후 어떻게 진행되나요?
          </h3>

          <ol className="space-y-4 text-base text-foreground/80 leading-[1.7]">
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 bg-[#1E2D8C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span className="break-keep">
                신청서를 보내주시면, 운영자에게 자동으로 전달됩니다.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 bg-[#1E2D8C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span className="break-keep">
                <strong className="text-[#1E2D8C]">24시간 안에 운영자가 직접 연락드립니다.</strong>{" "}
                (요청하신 연락 방법으로)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 bg-[#1E2D8C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span className="break-keep">
                통화 또는 카카오톡으로 일정과 진행 방식을 함께 정합니다.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 bg-[#1E2D8C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span className="break-keep">
                결제와 일정이 확정된 후, 첫 미팅 일정을 잡습니다.
              </span>
            </li>
          </ol>

          <div className="mt-6 pt-5 border-t border-[#1E2D8C]/10">
            <p className="text-base text-foreground/70 leading-[1.7] break-keep">
              신청서를 보내신다고 해서 결제 의무가 생기지 않습니다.
              <br />
              충분히 대화한 뒤 본인이 결정하시면 됩니다.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-foreground/50">
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
        </section>
      </div>
    </div>
  );
}

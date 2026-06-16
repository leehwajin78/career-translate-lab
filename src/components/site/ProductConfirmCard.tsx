import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { APPLY_PRODUCTS, type ApplyProductKey } from "@/data/content";

interface ProductConfirmCardProps {
  productKey: ApplyProductKey;
}

export default function ProductConfirmCard({ productKey }: ProductConfirmCardProps) {
  const product = APPLY_PRODUCTS[productKey];

  return (
    <div className="mb-12">
      <div className="bg-product-confirm rounded-2xl overflow-hidden border-l-[5px] border-l-primary shadow-sm">
        <div className="p-6 md:p-8 lg:p-10">
          {/* STEP 라벨 */}
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary/70 mb-2">
            {product.step}
          </span>

          {/* 상품명 */}
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-primary mb-3 tracking-tight">
            {product.name}
          </h2>

          {/* 가격 */}
          <div className="flex items-baseline gap-1.5 mb-1">
            {product.pricePrefix && (
              <span className="text-lg text-foreground/70 font-medium">{product.pricePrefix}</span>
            )}
            <span className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
              {product.price}
            </span>
            <span className="text-base text-foreground/70 font-medium">{product.priceSuffix}</span>
          </div>

          {/* 기간 */}
          <p className="text-sm text-foreground/60 mb-4">{product.duration}</p>

          {/* 한 줄 약속 */}
          <p className="text-base md:text-lg text-foreground/80 font-medium leading-relaxed mb-6 break-keep">
            {product.tagline}
          </p>

          {/* 포함 내용 체크리스트 */}
          <div className="border-t border-primary/10 pt-5">
            <p className="text-sm font-bold text-primary/70 mb-3 tracking-wide">포함 내용</p>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {product.includes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-base text-foreground/80 font-medium">
                  <Check size={18} className="text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

import type { Lead } from "@/store/leads";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

// getApplyCategory logic aligned with Admin.tsx to identify categories exactly
const getApplyCategoryLabel = (lead: Omit<Lead, "id" | "createdAt" | "status" | "memo">) => {
  const outcomes = lead.outcomes || [];
  const memo = lead.memo || "";
  
  if (outcomes.includes("한끗 파트너") || memo.includes("한끗 파트너") || memo.includes("apply-partner")) {
    return "한끗 파트너";
  }
  if (outcomes.includes("한끗 론칭") || memo.includes("한끗 론칭") || memo.includes("apply-launch")) {
    return "한끗 론칭";
  }
  if (outcomes.includes("한끗 빌드") || memo.includes("한끗 빌드") || memo.includes("apply-build")) {
    return "한끗 빌드";
  }
  if (
    outcomes.includes("한끗 진단") || 
    memo.includes("한끗 진단") || 
    memo.includes("정식 유료 진단") || 
    memo.includes("apply-diagnosis")
  ) {
    return "한끗 진단";
  }
  
  return "무료상담";
};

const ASSET_LABELS: Record<string, string> = {
  oneliner: "나를 한 문장으로 소개하는 메시지 (한 문장 소개)",
  profile: "전문가 프로필 (A4 1장)",
  lecture: "대표 강의안",
  proposal: "기업·기관에 보낼 B2B 제안서",
  online: "온라인에 정리된 소개 페이지",
};

export async function notifyLead(lead: Lead): Promise<void> {
  const accessKey = import.meta.env.VITE_LEAD_NOTIFY_KEY;
  if (!accessKey) {
    console.warn("VITE_LEAD_NOTIFY_KEY environment variable is not defined. Skipping email notification.");
    return;
  }

  try {
    const category = getApplyCategoryLabel(lead);
    const subject = `[한끗 신규리드] ${category} - ${lead.name}님`;

    // Format output assets
    let assetStatusText = "입력 없음 (무료 진단을 거치지 않은 신청 리드)";
    if (lead.outputAssets) {
      const isNone = lead.outputAssets.includes("none") || lead.outputAssets.length === 0;
      if (isNone) {
        assetStatusText = "\n[보유 현황]: 없음\n[미보유 현황]:\n" + Object.values(ASSET_LABELS).map(l => `- ${l}`).join("\n");
      } else {
        const owned = lead.outputAssets.filter(key => key !== "none").map(key => `- ${ASSET_LABELS[key] || key}`);
        const unowned = Object.keys(ASSET_LABELS)
          .filter(key => !lead.outputAssets?.includes(key))
          .map(key => `- ${ASSET_LABELS[key]}`);

        assetStatusText = `\n[보유 현황]:\n${owned.length > 0 ? owned.join("\n") : "- 없음"}\n[미보유 현황]:\n${unowned.length > 0 ? unowned.join("\n") : "- 없음"}`;
      }
    }

    const message = `
========================================
한끗프로젝트 신규 리드 알림
========================================

■ 신청 구분 : ${category}
■ 신청자 성함 : ${lead.name}님
■ 연락처 : ${lead.phone}
■ 이메일 주소 : ${lead.email}
■ 현재 직함 / 분야 : ${lead.field}

■ 신청 일시 : ${new Date(lead.createdAt).toLocaleString("ko-KR")}

----------------------------------------
진단 정보 (해당 시)
----------------------------------------
- 진단 점수 : ${lead.diagnosticScore !== undefined ? `${lead.diagnosticScore}점` : "진단 이력 없음"}
- 진단 유형 : ${lead.diagnosticType || "진단 이력 없음"}

----------------------------------------
산출물 보유 현황 (Q8)
----------------------------------------
${assetStatusText}

----------------------------------------
상세 요구사항 및 메모
----------------------------------------
- 희망 연락 방법 / 희망 채널 : ${lead.channel || "선택 안 함"}
- 관심 목적 : ${lead.purposes?.join(", ") || "입력 없음"}
- 원하는 결과물 : ${lead.outcomes?.join(", ") || "입력 없음"}
- 상세 경력 사항 :
${lead.career || "입력 없음"}

- 현재 가장 어려운 고민 사항 :
${lead.challenge || "입력 없음"}

- 세부 저장 메모 :
${lead.memo || "저장된 메모 없음"}

========================================
본 메일은 한끗프로젝트 시스템에서 실시간으로 자동 발송되었습니다.
`;

    const response = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: subject,
        from_name: "한끗프로젝트 시스템",
        name: lead.name,
        email: lead.email,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Web3Forms API response status: ${response.status}`);
    }

    console.log(`Email notification successfully sent for lead: ${lead.name}`);
  } catch (error) {
    console.error("Failed to send email notification for lead:", error);
    // Graceful degradation: throw is caught or suppressed in lead store, ensuring site remains functional
  }
}

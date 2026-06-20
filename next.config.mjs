/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // 빌드 시 ESLint 차단 비활성화 (별도 lint 단계에서 검사)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 기존 Vite 빌드(`vite build`)는 tsc 타입체크를 수행하지 않았다.
    // 동일한 빌드 동작을 유지하기 위해 타입 에러로 빌드를 차단하지 않는다.
    // 타입 검사는 에디터/별도 단계에서 수행한다.
    ignoreBuildErrors: true,
  },
  // Prisma를 서버 컴포넌트/route handler에서 외부 패키지로 처리
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

export default nextConfig

// vitest 스텁: 'server-only' 패키지는 react-server 조건이 없는 환경(node/vitest)에서
// import 시 throw 한다. 서버 전용 모듈(예: lib/coachingAI)을 단위 테스트하기 위해
// 빈 모듈로 alias 한다. (실제 빌드에서는 Next 의 react-server 조건이 가드 역할 수행)
export {}

// PlayBoard 무결성 불변식 검사 — registry.js를 로드해 SoT 정합성을 강제한다.
// 실행: node hankkeut-playboard/scripts/check.mjs
import fs from 'node:fs';
import vm from 'node:vm';

const code = fs.readFileSync(new URL('../data/registry.js', import.meta.url), 'utf8');
const sandbox = { window: {}, location: { hostname: 'localhost', protocol: 'file:', search: '' }, console, Math, Date, Object, Array, RegExp, JSON };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const PB = sandbox.window.PB;

const fail = [];
const ok = (cond, msg) => { if (!cond) fail.push(msg); };

const screenKeys = new Set(PB.screens.map(s => s.plane + '/' + s.slug));
const screenIds = new Set(PB.screens.map(s => s.id));
const wiIds = new Set(PB.workItems.map(w => w.id));
const areaSet = new Set(PB.controlAreas.map(a => a.area));
const systemSlugs = new Set(PB.screensOfPlane('system').map(s => s.slug));

// 1. 화면 workItems[] ↔ 작업 screens[] 고아 참조 없음
PB.screens.forEach(s => (s.workItems || []).forEach(id => ok(wiIds.has(id), `Screen ${s.id} workItem 고아 참조: ${id}`)));
PB.workItems.forEach(w => (w.screens || []).forEach(k => ok(screenKeys.has(k), `WorkItem ${w.id} screen 고아 참조: ${k}`)));

// 2. 작업 DAG 비순환
{
  const state = {}; // 0=unseen 1=visiting 2=done
  const wi = Object.fromEntries(PB.workItems.map(w => [w.id, w]));
  let cyclic = false;
  const dfs = (id) => {
    if (state[id] === 1) { cyclic = true; return; }
    if (state[id] === 2) return;
    state[id] = 1;
    (wi[id].dependsOn || []).forEach(d => { if (wi[d]) dfs(d); else fail.push(`WorkItem ${id} dependsOn 고아: ${d}`); });
    state[id] = 2;
  };
  PB.workItems.forEach(w => dfs(w.id));
  ok(!cyclic, '작업 DAG에 사이클이 있습니다.');
}

// 3. exceptionStates[]는 system 평면의 실재 slug만
PB.screens.forEach(s => (s.engineering.exceptionStates || []).forEach(es =>
  ok(systemSlugs.has(es), `Screen ${s.id} exceptionState가 system 평면 slug 아님: ${es}`)));

// 4. merged/verified 화면은 implLocation 필수
PB.screens.forEach(s => { if (s.status === 'merged' || s.status === 'verified') ok(!!s.implLocation, `Screen ${s.id}(${s.status})에 implLocation 누락`); });

// 5. 흐름 screens[]는 같은 평면의 실재 slug
PB.flows.forEach(f => f.screens.forEach(sl => ok(screenKeys.has(f.plane + '/' + sl), `Flow ${f.id} screen이 평면 ${f.plane}에 없음: ${sl}`)));

// 6. 제어 영역 노트 키는 정의된 영역 집합 안
PB.screens.forEach(s => Object.keys(s.engineering.controlAreaNotes).forEach(a => ok(areaSet.has(a), `Screen ${s.id} controlAreaNote 미정의 영역 키: ${a}`)));

// 7. 제어 영역 workItems / standards 참조 정합
PB.controlAreas.forEach(a => (a.workItems || []).forEach(id => ok(wiIds.has(id), `ControlArea ${a.area} workItem 고아: ${id}`)));

// ── 파생 요약 출력 ───────────────────────────────────────────────────────
const sc = PB.screenStatusCounts();
const wc = PB.workStatusCounts();
const waves = PB.computeWaves();
console.log('── PlayBoard 레지스트리 요약 ─────────────────────────────');
console.log(`평면 ${PB.planes.length} · 화면 ${PB.screens.length} · 작업 ${PB.workItems.length} · 제어영역 ${PB.controlAreas.length} · 흐름 ${PB.flows.length}`);
console.log('화면 상태:', PB.screenStatuses.map(s => `${s.label} ${sc[s.id]}`).join(' / '));
console.log('작업 상태:', PB.workStatuses.map(s => `${s.label} ${wc[s.id]}`).join(' / '));
console.log('Wave:', waves.map(w => `W${w.index}(${w.startDate}, ${w.items.length}건: ${w.items.map(i => i.id).join(',')})`).join('  '));
console.log('영역 커버리지:', PB.controlAreas.map(a => { const c = PB.areaCoverage(a.area); return `${a.label} ${c.covered}/${c.total}`; }).join(' / '));
console.log('──────────────────────────────────────────────────────────');

if (fail.length) {
  console.error('\n❌ 무결성 불변식 위반 ' + fail.length + '건:');
  fail.forEach(f => console.error('  - ' + f));
  process.exit(1);
} else {
  console.log('\n✅ 무결성 불변식 전부 통과 (GO).');
}

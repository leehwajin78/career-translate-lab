/* ============================================================================
 * PlayBoard — 공유 셸 + 재사용 프리미티브 + 5개 클라이언트 위젯
 *   위젯(상호작용 섬): PlayBoardNav · ScreenBoard(토글) · SortableMatrix ·
 *   DiagramModal · MobileCarousel. 나머지는 정적 렌더.
 *   모든 데이터는 window.PB(레지스트리)에서 파생한다.
 * ========================================================================== */
window.PBUI = (function () {
  'use strict';
  var PB = window.PB;

  /* ── 유틸 ───────────────────────────────────────────────────────────── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function qs(name) {
    var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }
  function statusBadge(statusId, opts) {
    opts = opts || {};
    var st = PB.statusMeta(statusId) || PB.workStatusMeta(statusId);
    if (!st) return '';
    return '<span class="badge ' + st.tone + '" title="' + esc(st.label) + '">'
      + '<span class="dot"></span>' + esc(opts.short ? st.label.replace(/\(.*\)/, '') : st.label) + '</span>';
  }
  function mcBadge(sc) { return sc.isMissionCritical ? '<span class="badge mc" title="Mission-Critical">★ MC</span>' : ''; }

  /* ── 셸: 전역 바 + sticky PlayBoard 내비 ────────────────────────────── */
  var SECTIONS = [
    { id: 'index', label: '상황판', href: 'index.html' },
    { id: 'plan', label: '실행 계획', href: 'plan.html' },
    { id: 'schedule', label: '일정표', href: 'schedule.html' },
    { id: 'summary', label: '구현 통계', href: 'implement-summary.html' }
  ];
  function shell(opts) {
    opts = opts || {};
    if (!PB.isEnabled()) { document.body.innerHTML = '<div class="tile"><div class="inner"><h2>404</h2><p>이 보드는 production에서 비공개입니다.</p></div></div>'; return; }
    var crumbs = opts.crumbs || [];
    var crumbHtml = '<a href="index.html">PlayBoard</a>';
    crumbs.forEach(function (c, i) {
      crumbHtml += '<span class="sep">/</span>';
      crumbHtml += (i === crumbs.length - 1 || !c.href)
        ? '<span class="cur">' + esc(c.label) + '</span>'
        : '<a href="' + esc(c.href) + '">' + esc(c.label) + '</a>';
    });
    var tabs = SECTIONS.map(function (s) {
      var cur = s.id === opts.section ? ' aria-current="page"' : '';
      return '<a href="' + s.href + '"' + cur + '>' + s.label + '</a>';
    }).join('');
    var bar =
      '<div class="gbar"><span class="brand">' + esc(PB.meta.project) + '<small>' + esc(PB.meta.subtitle) + '</small></span>'
      + '<span class="ver">' + esc(PB.meta.version) + ' · ' + esc(PB.meta.lastUpdated) + '</span></div>'
      + '<nav class="pbnav"><div class="crumb">' + crumbHtml + '</div><div class="tabs">' + tabs + '</div></nav>';
    var host = document.getElementById('shell');
    if (host) host.innerHTML = bar;
    return bar;
  }
  function notFound(msg) {
    document.getElementById('main').innerHTML =
      '<div class="tile"><div class="inner"><span class="eyebrow">404</span><h2>찾을 수 없는 항목</h2>'
      + '<p class="lead">' + esc(msg || '레지스트리에 없는 파라미터입니다.') + '</p>'
      + '<p class="mt2"><a class="btn primary" href="index.html">상황판으로</a></p></div></div>';
  }

  /* ── 산출물 썸네일 카드 ─────────────────────────────────────────────── */
  function screenCard(sc, opts) {
    opts = opts || {};
    var demo = PB.demoPath(sc);
    var specHref = 'spec.html?plane=' + sc.plane + '&slug=' + sc.slug;
    var demoHref = 'screens.html?plane=' + sc.plane + '&slug=' + sc.slug;
    // 모든 화면은 프로토타입 목업(데모)을 가진다 — 구현됨/로드맵 무관하게 라이브 임베드.
    var thumb = '<iframe src="' + esc(demo) + '" loading="lazy" tabindex="-1" scrolling="no" title="' + esc(sc.title) + '"></iframe>';
    var ovl = opts.compact ? '<div class="ovl">' + statusBadge(sc.status, { short: true }) + '</div>' : '';
    var plane = PB.getPlane(sc.plane);
    return ''
      + '<div class="scard' + (opts.compact ? ' compact' : '') + '">'
      + '<a class="thumb" href="' + specHref + '">' + thumb + ovl + '</a>'
      + '<div class="meta">'
      + (opts.compact ? '' : '<div class="mrow"><span class="pl">' + esc(plane.title) + ' · ' + esc(sc.designSpecType) + '</span>' + statusBadge(sc.status, { short: true }) + '</div>')
      + '<div class="t"><a href="' + specHref + '">' + esc(sc.id) + ' · ' + esc(sc.title) + '</a> ' + mcBadge(sc) + '</div>'
      + '<div class="rt">' + esc(sc.route || '미등록 라우트') + '</div>'
      + '<div class="links"><a href="' + specHref + '">기술 스펙 →</a><a href="' + demoHref + '">화면 데모 ↗</a></div>'
      + '</div></div>';
  }

  /* ── 키-값 스펙 행 ──────────────────────────────────────────────────── */
  function specRows(rows) {
    return '<div class="spec">' + rows.map(function (r) {
      var v;
      if (Array.isArray(r.v)) {
        v = r.v.length ? '<ul>' + r.v.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '<span class="empty">' + (r.empty || '없음') + '</span>';
      } else { v = r.v || '<span class="empty">' + (r.empty || '없음') + '</span>'; }
      return '<div class="row"><div class="k">' + esc(r.k) + '</div><div class="v">' + v + '</div></div>';
    }).join('') + '</div>';
  }

  /* ── 위젯 1: ScreenBoard 타일/칸반 토글 ─────────────────────────────── */
  function screenBoard(host, list) {
    var mode = 'tile';
    function render() {
      var seg = '<div class="seg" role="tablist">'
        + '<button role="tab" aria-selected="' + (mode === 'tile') + '" data-m="tile" class="' + (mode === 'tile' ? 'on' : '') + '">타일</button>'
        + '<button role="tab" aria-selected="' + (mode === 'kanban') + '" data-m="kanban" class="' + (mode === 'kanban' ? 'on' : '') + '">칸반</button></div>';
      var body;
      if (mode === 'tile') {
        body = '<div class="grid cols-auto mt2">' + list.map(function (sc) { return screenCard(sc); }).join('') + '</div>';
      } else {
        body = '<div class="kanban mt2">' + PB.screenStatuses.map(function (st) {
          var col = list.filter(function (sc) { return sc.status === st.id; });
          return '<div class="col"><h4>' + statusBadge(st.id, { short: true }) + '<span class="ct">' + col.length + '</span></h4>'
            + (col.length ? col.map(function (sc) { return screenCard(sc, { compact: true }); }).join('') : '<div class="empty">해당 없음</div>')
            + '</div>';
        }).join('') + '</div>';
      }
      host.innerHTML = seg + body;
      Array.prototype.forEach.call(host.querySelectorAll('[data-m]'), function (b) {
        b.addEventListener('click', function () { mode = b.getAttribute('data-m'); render(); });
      });
    }
    render();
  }

  /* ── 위젯 2: SortableMatrix ─────────────────────────────────────────── */
  function sortableMatrix(host, list) {
    var areas = PB.controlAreas;
    var sortKey = 'status', dir = 1;
    function val(sc, key) {
      if (key === 'title') return sc.title;
      if (key === 'status') return PB.statusMeta(sc.status).rank;
      return sc.engineering.controlAreaNotes[key] ? 1 : 0;
    }
    function sorted() {
      return list.slice().sort(function (a, b) {
        var va = val(a, sortKey), vb = val(b, sortKey), c;
        if (typeof va === 'string') c = va.localeCompare(vb, 'ko'); else c = va - vb;
        if (c === 0) c = a.title.localeCompare(b.title, 'ko');
        return c * dir;
      });
    }
    function arrow(key) { return sortKey === key ? (dir === 1 ? ' ▲' : ' ▼') : ' ↕'; }
    function render() {
      var head = '<th data-k="title">화면<span class="ar">' + arrow('title') + '</span></th>'
        + '<th data-k="status">구현 현황<span class="ar">' + arrow('status') + '</span></th>'
        + areas.map(function (a) { return '<th data-k="' + a.area + '" title="' + esc(a.goal) + '">' + esc(a.label) + '<span class="ar">' + arrow(a.area) + '</span></th>'; }).join('');
      var rows = sorted().map(function (sc) {
        var cells = areas.map(function (a) {
          var n = sc.engineering.controlAreaNotes[a.area];
          return n ? '<td class="dot"><span class="on" title="' + esc(n.text) + '">●</span></td>' : '<td class="dot"><span class="off">·</span></td>';
        }).join('');
        return '<tr><td><a class="stitle" href="spec.html?plane=' + sc.plane + '&slug=' + sc.slug + '">' + esc(sc.id) + ' ' + esc(sc.title) + '</a> ' + mcBadge(sc)
          + '<div class="splane">' + esc(PB.getPlane(sc.plane).title) + '</div></td>'
          + '<td>' + statusBadge(sc.status, { short: true }) + '</td>' + cells + '</tr>';
      }).join('');
      var foot = '<td class="lbl">총 ' + list.length + '개 화면</td><td></td>'
        + areas.map(function (a) { return '<td><a href="control-area.html?area=' + a.area + '">' + PB.areaCoverage(a.area, list).covered + '</a></td>'; }).join('');
      host.innerHTML = '<div class="mwrap"><table class="matrix"><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody><tfoot><tr>' + foot + '</tr></tfoot></table></div>';
      Array.prototype.forEach.call(host.querySelectorAll('thead th'), function (th) {
        th.addEventListener('click', function () {
          var k = th.getAttribute('data-k');
          if (k === sortKey) dir = -dir; else { sortKey = k; dir = 1; }
          render();
        });
      });
    }
    render();
  }

  /* ── 위젯 3: DiagramModal (Mermaid) ─────────────────────────────────── */
  var mermaidReady = null;
  function loadMermaid() {
    if (mermaidReady) return mermaidReady;
    mermaidReady = new Promise(function (resolve) {
      var sc = document.createElement('script');
      sc.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      sc.onload = function () {
        window.mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose', flowchart: { useMaxWidth: false }, gantt: { useMaxWidth: false } });
        resolve(window.mermaid);
      };
      sc.onerror = function () { resolve(null); };
      document.head.appendChild(sc);
    });
    return mermaidReady;
  }
  var diagN = 0;
  function diagram(host, opt) {
    var id = 'd' + (++diagN);
    host.innerHTML = '<div class="diagram"><div class="prev" id="' + id + '_p">다이어그램 렌더링 중…</div>'
      + '<button class="btn primary sm open" id="' + id + '_b">⤢ 크게 보기</button></div>';
    loadMermaid().then(function (m) {
      if (!m) { document.getElementById(id + '_p').textContent = '다이어그램을 불러올 수 없습니다(오프라인).'; return; }
      m.render(id + '_svg', opt.code).then(function (res) {
        var svg = res.svg;
        document.getElementById(id + '_p').innerHTML = svg;
        var prevSvg = document.querySelector('#' + id + '_p svg');
        if (prevSvg) { prevSvg.style.maxWidth = '100%'; prevSvg.style.height = 'auto'; }
        document.getElementById(id + '_b').addEventListener('click', function () { openModal(opt.title, svg, opt.legend); });
      }).catch(function (e) { document.getElementById(id + '_p').textContent = '렌더 오류: ' + e.message; });
    });
  }
  function openModal(title, svgHtml, legendHtml) {
    var back = document.createElement('div'); back.className = 'modal-back';
    back.innerHTML = '<div class="modal-box"><header><h3>' + esc(title) + '</h3><div class="legend">' + (legendHtml || '') + '</div><button class="x" aria-label="닫기">✕</button></header><div class="body">' + svgHtml + '</div></div>';
    document.body.appendChild(back);
    document.body.style.overflow = 'hidden';
    function close() { document.body.removeChild(back); document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    back.addEventListener('click', function (e) { if (e.target === back) close(); });
    back.querySelector('.x').addEventListener('click', close);
    document.addEventListener('keydown', onKey);
  }
  function statusLegend() {
    return PB.screenStatuses.map(function (st) {
      var c = { gray: '#9aa0ad', warn: '#d97e2b', blue: '#3d5be0', ok: '#1e7f4f' }[st.tone];
      return '<span class="li"><span class="sw" style="background:' + c + '"></span>' + esc(st.label) + '</span>';
    }).join('');
  }
  function workLegend() {
    return PB.workStatuses.map(function (st) {
      var c = { gray: '#9aa0ad', warn: '#d97e2b', ok: '#1e7f4f' }[st.tone];
      return '<span class="li"><span class="sw" style="background:' + c + '"></span>' + esc(st.label) + '</span>';
    }).join('');
  }

  /* ── 위젯 5: MobileCarousel 오버레이 스크롤 힌트 (경량) ───────────────── */
  function mobileCarousel(host) { /* iframe 폰 프레임은 정적 마크업, 스냅 스크롤은 CSS가 처리 */ }

  return {
    esc: esc, qs: qs, shell: shell, notFound: notFound,
    statusBadge: statusBadge, mcBadge: mcBadge,
    screenCard: screenCard, specRows: specRows,
    screenBoard: screenBoard, sortableMatrix: sortableMatrix,
    diagram: diagram, openModal: openModal, statusLegend: statusLegend, workLegend: workLegend,
    mobileCarousel: mobileCarousel
  };
})();

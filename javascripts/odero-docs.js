/* Odero Developer Docs — interactions (no jQuery).
   Loads HTML fragments, adds copy buttons, scroll-spy nav, dark mode,
   mobile drawer, and a TOC filter. */
(function () {
  'use strict';

  var ICON_COPY =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var ICON_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  var LANG_LABELS = {
    swift: 'Swift', kotlin: 'Kotlin', java: 'Java',
    javascript: 'JavaScript', js: 'JavaScript', typescript: 'TypeScript', ts: 'TypeScript',
    tsx: 'TSX', jsx: 'JSX', bash: 'Shell', shell: 'Shell', sh: 'Shell', console: 'Shell',
    ruby: 'Ruby', gradle: 'Gradle', groovy: 'Gradle', json: 'JSON',
    xml: 'XML', html: 'HTML', plaintext: 'Text', text: 'Text', proguard: 'ProGuard',
  };

  // ---------- theme ----------
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('odero-docs-theme', theme); } catch (e) {}
    var label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    document.querySelectorAll('.js-theme-toggle').forEach(function (b) { b.setAttribute('aria-label', label); });
  }
  function initTheme() {
    var saved;
    try { saved = localStorage.getItem('odero-docs-theme'); } catch (e) {}
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
    document.querySelectorAll('.js-theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme');
        applyTheme(cur === 'dark' ? 'light' : 'dark');
      });
    });
  }

  // ---------- mobile drawer ----------
  function initDrawer() {
    var open = function () { document.body.classList.add('nav-open'); };
    var close = function () { document.body.classList.remove('nav-open'); };
    var burger = document.getElementById('nav-toggle');
    var backdrop = document.querySelector('.backdrop');
    if (burger) burger.addEventListener('click', open);
    if (backdrop) backdrop.addEventListener('click', close);
    // close after navigating
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('.sidebar a[href^="#"]');
      if (a) close();
    });
  }

  // ---------- fragment loading ----------
  function loadFragments() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
    return Promise.all(nodes.map(function (node) {
      var file = 'chapters/' + node.getAttribute('data-include');
      return fetch(file)
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (html) { node.innerHTML = html; })
        .catch(function () { /* leave empty on failure */ });
    }));
  }

  // ---------- code blocks: header + copy ----------
  function langOf(pre) {
    if (!pre) return '';
    var cls = (pre.className || '').split(/\s+/);
    for (var i = 0; i < cls.length; i++) {
      var c = cls[i];
      if (c && c !== 'highlight' && c.indexOf('tab-') !== 0) return c;
    }
    return '';
  }
  function enhanceCodeBlocks() {
    var blocks = document.querySelectorAll('.doc-body .highlight');
    blocks.forEach(function (block) {
      if (block.querySelector('.code-head')) return;
      var pre = block.querySelector('pre');
      if (!pre) return;
      var lang = langOf(pre);
      var label = LANG_LABELS[lang] || (lang ? lang.toUpperCase() : 'Code');

      var head = document.createElement('div');
      head.className = 'code-head';
      head.innerHTML = '<span class="code-dots"><i></i><i></i><i></i></span>';
      var span = document.createElement('span');
      span.className = 'code-lang';
      span.textContent = label;
      var spacer = document.createElement('span');
      spacer.className = 'spacer';
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.innerHTML = ICON_COPY + '<span>Copy</span>';
      head.appendChild(span);
      head.appendChild(spacer);
      head.appendChild(btn);
      block.insertBefore(head, block.firstChild);

      btn.addEventListener('click', function () {
        var code = pre.querySelector('code') || pre;
        var text = code.innerText.replace(/\n$/, '');
        var done = function () {
          btn.classList.add('copied');
          btn.innerHTML = ICON_CHECK + '<span>Copied</span>';
          setTimeout(function () {
            btn.classList.remove('copied');
            btn.innerHTML = ICON_COPY + '<span>Copy</span>';
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
        } else { fallbackCopy(text); done(); }
      });
    });
  }
  // ---------- heading anchor links ----------
  var ICON_LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  function addAnchors() {
    document.querySelectorAll('.doc-body h2[id], .doc-body h3[id], .doc-body h4[id]').forEach(function (h) {
      if (h.querySelector('.anchor')) return;
      var a = document.createElement('a');
      a.className = 'anchor';
      a.href = '#' + h.id;
      a.setAttribute('aria-label', 'Link to this section');
      a.innerHTML = ICON_LINK;
      h.insertBefore(a, h.firstChild);
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function headingText(el) {
    var clone = el.cloneNode(true);
    var a = clone.querySelector('.anchor');
    if (a) a.parentNode.removeChild(a);
    return clone.textContent.trim();
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- scroll-spy (left nav) + "On this page" rail ----------
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.sidebar .toc-link[href^="#"]'));
    var map = {}, targets = [];
    links.forEach(function (link) {
      var id = decodeURIComponent(link.getAttribute('href').slice(1));
      var el = document.getElementById(id);
      if (el) { map[id] = link; targets.push(el); }
    });
    targets.sort(function (a, b) { return a.offsetTop - b.offsetTop; });

    // collect all headings, grouped into per-chapter (h2) sub-heading lists
    var rail = document.getElementById('on-this-page');
    var heads = Array.prototype.slice.call(
      document.querySelectorAll('.doc-body h1[id], .doc-body h2[id], .doc-body h3[id], .doc-body h4[id]')
    ).map(function (el) { return { el: el, id: el.id, level: parseInt(el.tagName.charAt(1), 10) }; });
    var chapters = {}, cur = null;
    heads.forEach(function (h) {
      if (h.level <= 2) { cur = h.level === 2 ? h.id : null; if (cur) chapters[cur] = []; }
      else if (cur && (h.level === 3 || h.level === 4)) {
        chapters[cur].push({ id: h.id, text: headingText(h.el), sub: h.level === 4 });
      }
    });
    var scan = heads.slice().sort(function (a, b) { return a.el.offsetTop - b.el.offsetTop; });

    var railRendered, railLinks = [];
    function renderRail(chapterId) {
      if (!rail || railRendered === chapterId) return;
      railRendered = chapterId;
      var subs = chapterId ? chapters[chapterId] : null;
      if (!subs || !subs.length) { rail.className = 'doc-rail is-empty'; rail.innerHTML = ''; railLinks = []; return; }
      var html = '<div class="rail-title">On this page</div><ul class="rail-list">';
      subs.forEach(function (s) {
        html += '<li><a class="rail-link' + (s.sub ? ' rail-sub' : '') + '" href="#' + s.id + '">' + escapeHtml(s.text) + '</a></li>';
      });
      rail.innerHTML = html + '</ul>';
      rail.className = 'doc-rail';
      railLinks = Array.prototype.slice.call(rail.querySelectorAll('.rail-link'));
    }

    function setNavActive(id) {
      links.forEach(function (l) { l.classList.remove('active'); });
      var link = map[id];
      if (!link) return;
      link.classList.add('active');
      var sb = document.querySelector('.sidebar');
      if (sb) {
        var lr = link.getBoundingClientRect(), sr = sb.getBoundingClientRect();
        if (lr.top < sr.top + 60 || lr.bottom > sr.bottom - 20) link.scrollIntoView({ block: 'nearest' });
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var pos = window.scrollY + 110;
        var atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;

        var navCur = targets.length ? targets[0] : null;
        for (var i = 0; i < targets.length; i++) { if (targets[i].offsetTop <= pos) navCur = targets[i]; else break; }
        if (atBottom && targets.length) navCur = targets[targets.length - 1];
        if (navCur) setNavActive(navCur.id);

        var chapterId = null, activeSub = null;
        for (var j = 0; j < scan.length; j++) {
          var h = scan[j];
          if (h.el.offsetTop > pos) break;
          if (h.level === 2) { chapterId = h.id; activeSub = null; }
          else if (h.level === 1) { chapterId = null; activeSub = null; }
          else { activeSub = h.id; }
        }
        renderRail(chapterId);
        if (railLinks.length) {
          if (atBottom && chapterId && chapters[chapterId].length) {
            activeSub = chapters[chapterId][chapters[chapterId].length - 1].id;
          }
          railLinks.forEach(function (l) {
            l.classList.toggle('active', decodeURIComponent(l.getAttribute('href').slice(1)) === activeSub);
          });
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    if (location.hash) {
      var hid = decodeURIComponent(location.hash.slice(1));
      if (map[hid]) setNavActive(hid);
    }
  }

  // ---------- TOC filter ----------
  function initFilter() {
    var input = document.getElementById('nav-search');
    if (!input) return;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var groups = document.querySelectorAll('.sidebar .toc-list-h1 > li');
      groups.forEach(function (group) {
        var items = group.querySelectorAll('.toc-h2');
        var anyVisible = false;
        items.forEach(function (item) {
          var hit = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
          item.parentElement.classList.toggle('is-hidden', !hit);
          if (hit) anyVisible = true;
        });
        var h1 = group.querySelector('.toc-h1');
        if (h1) h1.style.display = (q && !anyVisible) ? 'none' : '';
      });
    });
  }

  // ---------- boot ----------
  function boot() {
    initTheme();
    initDrawer();
    initFilter();
    loadFragments().then(function () {
      enhanceCodeBlocks();
      addAnchors();
      initScrollSpy();
      // if landed on a hash, jump now that content height is final
      if (location.hash) {
        var el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (el) setTimeout(function () { el.scrollIntoView(); }, 30);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();

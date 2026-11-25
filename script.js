(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var MS_PER_DAY = 24 * 60 * 60 * 1000;

  var START = Date.UTC(2026, 11, 7); // 07/12/2026 — opening of Call 2027
  var END = Date.UTC(2028, 0, 15); // 15/01/2028 — just after the final notifications

  var PHASES = [
    {
      iso: '2026-12-07',
      short: 'Call opening',
      title: 'Opening of Call 2027',
      text: 'Call 2027 opens: pre-proposals can be submitted from this date.'
    },
    {
      iso: '2027-01-30',
      short: 'Pre-proposal deadline',
      title: 'Pre-proposals deadline',
      text: 'Final deadline to submit your pre-proposal for Call 2027.'
    },
    {
      iso: '2027-03-26',
      short: 'Selection + LOI start',
      title: 'Notification of selected pre-proposals + start of LOI phase',
      text: 'Applicants are notified whether their pre-proposal is selected. The Letter of Intent (LOI) phase starts.'
    },
    {
      iso: '2027-06-05',
      short: 'Full proposal deadline',
      title: 'Full proposals deadline',
      text: 'Final deadline to submit your full proposal.'
    },
    {
      iso: '2027-09-01',
      short: 'LOI deadline',
      title: 'LOI phase deadline',
      text: 'Deadline of the Letter of Intent (LOI) phase.'
    },
    {
      iso: '2027-11-30',
      label: 'End of November 2027',
      short: 'ESI results (HBC)',
      title: 'Notification of Early Stage Innovation results',
      text: 'Results of the Early Stage Innovation track are announced. These proposals are evaluated by HBC.'
    },
    {
      iso: '2028-01-10',
      label: 'End Dec 2027 – Begin Jan 2028',
      short: 'LSI results (Flemish Gov.)',
      title: 'Notification of Later Stage Innovation results',
      text: 'Results of the Later Stage Innovation track are announced. These proposals are evaluated by the Flemish Government.'
    }
  ];

  var ROCKET_IMAGE_OFFSET_DEG = 45; // assets/rocket.png points diagonally up-right

  var path = document.getElementById('trajectory');
  var progress = document.getElementById('progress');
  var phasesG = document.getElementById('phases');
  var starsG = document.getElementById('stars');
  var rocket = document.getElementById('rocket');
  var stage = document.getElementById('stage');
  var tooltip = document.getElementById('tooltip');
  var ttDate = tooltip.querySelector('.tt-date');
  var ttTitle = tooltip.querySelector('.tt-title');
  var ttText = tooltip.querySelector('.tt-text');
  var currentDateEl = document.getElementById('currentDate');

  var totalDays = Math.round((END - START) / MS_PER_DAY);
  var pathLength = path.getTotalLength();

  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var key in attrs) {
      node.setAttribute(key, attrs[key]);
    }
    return node;
  }

  function parseISO(s) {
    var p = s.split('-');
    return Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function formatDate(ts) {
    var d = new Date(ts);
    return pad(d.getUTCDate()) + '/' + pad(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear();
  }

  function todayLocal() {
    var n = new Date();
    return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function guardImage(src, imageEl, fallbackEl) {
    var test = new Image();
    test.onload = function () {
      imageEl.style.display = '';
      fallbackEl.style.display = 'none';
    };
    test.onerror = function () {
      imageEl.style.display = 'none';
      fallbackEl.style.display = '';
    };
    test.src = src;
  }

  guardImage('assets/moon.webp', document.getElementById('moonImage'), document.getElementById('moonFallback'));
  guardImage('assets/rocket.png', document.getElementById('rocketImage'), document.getElementById('rocketFallback'));

  // --- Stars ---
  for (var i = 0; i < 90; i++) {
    var star = el('circle', {
      class: 'star',
      cx: (Math.random() * 1200).toFixed(1),
      cy: (Math.random() * 720).toFixed(1),
      r: (0.6 + Math.random() * 1.2).toFixed(2)
    });
    star.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
    star.style.animationDuration = (2 + Math.random() * 3).toFixed(2) + 's';
    starsG.appendChild(star);
  }

  // --- Phase markers, labels and info badges ---
  var openAnchor = null;

  function hideTooltip() {
    tooltip.classList.remove('visible');
    tooltip.hidden = true;
    openAnchor = null;
  }

  function positionTooltip(anchor) {
    var r = anchor.getBoundingClientRect();
    var c = stage.getBoundingClientRect();
    tooltip.hidden = false;
    var half = tooltip.offsetWidth / 2;
    var left = r.left - c.left + r.width / 2;
    left = Math.max(half + 8, Math.min(left, c.width - half - 8));
    tooltip.style.left = left + 'px';
    tooltip.style.top = r.top - c.top - 10 + 'px';
  }

  function showTooltip(phase, anchor) {
    ttDate.textContent = phase.label || formatDate(parseISO(phase.iso));
    ttTitle.textContent = phase.title;
    ttText.textContent = phase.text;
    openAnchor = anchor;
    positionTooltip(anchor);
    tooltip.classList.add('visible');
  }

  PHASES.forEach(function (phase, i) {
    var f = (parseISO(phase.iso) - START) / (END - START);
    var len = Math.min(pathLength, Math.max(0, f * pathLength));
    var p = path.getPointAtLength(len);
    var p2 = path.getPointAtLength(Math.min(pathLength, len + 2));
    var tx = p2.x - p.x;
    var ty = p2.y - p.y;
    var m = Math.hypot(tx, ty) || 1;
    tx /= m;
    ty /= m;
    var nx = -ty;
    var ny = tx;
    var side = i % 2 === 0 ? 1 : -1;

    var g = el('g', { class: 'phase', transform: 'translate(' + p.x + ',' + p.y + ')' });
    g.appendChild(el('circle', { class: 'dot', cx: 0, cy: 0, r: 7 }));

    var info = el('g', {
      class: 'info',
      transform: 'translate(24,0)',
      tabindex: '0',
      role: 'button',
      'aria-label': phase.title + ' — ' + (phase.label || formatDate(parseISO(phase.iso)))
    });
    info.appendChild(el('circle', { cx: 0, cy: 0, r: 11 }));
    var iText = el('text', { x: 0, y: 4.6 });
    iText.textContent = 'i';
    info.appendChild(iText);
    g.appendChild(info);

    var dateText = el('text', {
      class: 'phase-date',
      x: nx * side * 46,
      y: ny * side * 46
    });
    dateText.textContent = phase.label || formatDate(parseISO(phase.iso));
    g.appendChild(dateText);

    var titleText = el('text', {
      class: 'phase-title',
      x: nx * side * 64,
      y: ny * side * 64
    });
    titleText.textContent = phase.short;
    g.appendChild(titleText);

    g.addEventListener('mouseenter', function () { showTooltip(phase, info); });
    g.addEventListener('mouseleave', hideTooltip);
    g.addEventListener('focus', function () { showTooltip(phase, info); });
    g.addEventListener('blur', hideTooltip);
    g.addEventListener('click', function () {
      if (openAnchor === info && tooltip.classList.contains('visible')) {
        hideTooltip();
      } else {
        showTooltip(phase, info);
      }
    });

    phasesG.appendChild(g);
  });

  window.addEventListener('resize', function () {
    if (openAnchor) {
      positionTooltip(openAnchor);
    }
  });

  // --- Rocket position from today's real date ---
  function update() {
    var today = todayLocal();
    var current = Math.max(0, Math.min(totalDays, Math.floor((today - START) / MS_PER_DAY)));
    var len = (current / totalDays) * pathLength;
    var p = path.getPointAtLength(len);
    var p2 = path.getPointAtLength(Math.min(pathLength, len + 2));
    var angle = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI;
    angle += ROCKET_IMAGE_OFFSET_DEG;
    rocket.setAttribute('transform', 'translate(' + p.x + ',' + p.y + ') rotate(' + angle + ')');
    progress.setAttribute('stroke-dasharray', len + ' ' + (pathLength + 10));
    currentDateEl.textContent = formatDate(today);
  }

  setInterval(update, 60000);
  update();
})();

/* ==========================================================
   FAS ADAM UI · Navigation only
   Handles: active menu link, mobile menu drawer, tabs,
   and on/off view switches. No app logic, no data.
   ========================================================== */
(function () {
  'use strict';

  /* 1. Highlight the current page in the menu.
        Each page sets <body data-page="...">.
        Each menu link sets data-nav="..." with the same word. */
  var page = document.body.getAttribute('data-page');
  document.querySelectorAll('[data-nav]').forEach(function (link) {
    if (link.getAttribute('data-nav') === page) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* 2. Mobile menu drawer (screens under 900px). */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var scrim = document.querySelector('.scrim');

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', String(open));
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
  }
  if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* 3. Tabs. Markup: role="tablist" > role="tab" with aria-controls="panel-id".
        Arrow keys move between tabs. */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));

    function select(index, moveFocus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (moveFocus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i, false); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
  });

  /* 4. View switches. Markup: <button data-switch="tech" aria-pressed="true">.
        When off, <body> gets the class "tech-off" so CSS can hide things. */
  document.querySelectorAll('[data-switch]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      document.body.classList.toggle(btn.getAttribute('data-switch') + '-off', !on);
    });
  });
})();

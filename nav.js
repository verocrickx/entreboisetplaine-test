// Soulignement du menu : il glisse sous l'onglet de la section affichée.
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var bar = document.createElement('span');
  bar.className = 'nav-ind';
  bar.setAttribute('aria-hidden', 'true');
  nav.appendChild(bar);

  // Sur l'accueil, chaque onglet pointe vers une section de la page.
  var spy = links
    .map(function (a) {
      var h = a.getAttribute('href') || '';
      return h.charAt(0) === '#' ? { a: a, el: document.getElementById(h.slice(1)) } : null;
    })
    .filter(function (x) { return x && x.el; });

  var active = nav.querySelector('a.is-current');

  function place(a) {
    if (!a) { bar.style.opacity = '0'; return; }
    bar.style.opacity = '1';
    bar.style.width = a.offsetWidth + 'px';
    bar.style.transform = 'translateX(' + a.offsetLeft + 'px)';
  }

  function setActive(a, center) {
    if (a === active && !center) return;
    if (active && spy.length) { active.classList.remove('is-active'); active.removeAttribute('aria-current'); }
    active = a;
    if (a && spy.length) { a.classList.add('is-active'); a.setAttribute('aria-current', 'location'); }
    place(a);
    if (a && nav.scrollWidth > nav.clientWidth) {
      try {
        nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
      } catch (e) { nav.scrollLeft = a.offsetLeft; }
    }
  }

  function onScroll() {
    if (!spy.length) return;
    var top = document.querySelector('.topbar');
    var limit = (top ? top.offsetHeight : 0) + 40;
    var found = null;
    for (var i = 0; i < spy.length; i++) {
      if (spy[i].el.getBoundingClientRect().top <= limit) found = spy[i].a;
    }
    // En bas de page, la dernière section est la section en cours.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      found = spy[spy.length - 1].a;
    }
    setActive(found, false);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; onScroll(); });
  }, { passive: true });
  window.addEventListener('resize', function () { place(active); });
  links.forEach(function (a) {
    a.addEventListener('click', function () { if (spy.length) setActive(a, true); });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { place(active); });
  onScroll();
  place(active);
})();

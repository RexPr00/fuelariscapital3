(function () {
  const body = document.body;

  // =========================================================
  // Drawer logic with focus trap, outside click, ESC close
  // =========================================================
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const openBtn = document.getElementById('burgerButton');
  const closeBtn = document.getElementById('drawerClose');
  let lastFocused = null;

  function getFocusable(container) {
    return [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((el) => el.offsetParent !== null);
  }

  function onDrawerKeydown(e) {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeDrawer();
      return;
    }
    if (e.key !== 'Tab') return;

    const focusable = getFocusable(drawer);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const isShift = e.shiftKey;

    if (isShift && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!isShift && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openDrawer() {
    lastFocused = document.activeElement;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    body.classList.add('drawer-open');
    const focusable = getFocusable(drawer);
    if (focusable[0]) focusable[0].focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    body.classList.remove('drawer-open');
    if (lastFocused) lastFocused.focus();
  }

  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', onDrawerKeydown);

  drawer?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', closeDrawer);
  });

  // =========================================================
  // Privacy modal with dual close controls + ESC + focus trap
  // =========================================================
  const modal = document.getElementById('privacyModal');
  const modalOpeners = document.querySelectorAll('[data-open-privacy]');
  const modalClosers = document.querySelectorAll('[data-close-privacy]');
  let modalLastFocused = null;

  function onModalKeydown(e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key !== 'Tab') return;

    const focusable = getFocusable(modal);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openModal() {
    modalLastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    const focusable = getFocusable(modal);
    if (focusable[0]) focusable[0].focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
    if (modalLastFocused) modalLastFocused.focus();
  }

  modalOpeners.forEach((btn) => btn.addEventListener('click', openModal));
  modalClosers.forEach((btn) => btn.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', onModalKeydown);

  // =========================================================
  // FAQ accordion (single open)
  // =========================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    btn?.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      faqItems.forEach((f) => {
        f.classList.remove('open');
        f.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // =========================================================
  // Scroll reveal with IntersectionObserver
  // =========================================================
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  reveals.forEach((el) => observer.observe(el));
})();

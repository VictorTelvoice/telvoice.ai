(() => {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    nav?.classList.toggle('is-open', !isOpen);
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Abrir menú');
      nav?.classList.remove('is-open');
    });
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => observer.observe(item));
  }

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const setStatus = (message, type = '') => {
    if (!status) return;
    status.textContent = message;
    status.className = `form-status${type ? ` is-${type}` : ''}`;
  };

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('');

    const controls = [...form.elements].filter((control) => 'checkValidity' in control);
    controls.forEach((control) => control.removeAttribute('aria-invalid'));

    const invalid = controls.find((control) => !control.checkValidity());
    if (invalid) {
      invalid.setAttribute('aria-invalid', 'true');
      invalid.focus();
      setStatus('Revisa los campos obligatorios antes de enviar.', 'error');
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    form.classList.add('is-loading');
    form.querySelector('button[type="submit"]')?.setAttribute('disabled', '');
    setStatus('Enviando solicitud…');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || 'No fue posible enviar la solicitud.');

      form.reset();
      setStatus('Solicitud recibida. El equipo de Telvoice AI revisará tu caso.', 'success');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No fue posible enviar la solicitud.', 'error');
    } finally {
      form.classList.remove('is-loading');
      form.querySelector('button[type="submit"]')?.removeAttribute('disabled');
    }
  });
})();

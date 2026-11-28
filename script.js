(() => {
  const cfg = window.AKSHARAS_CONFIG || {};
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open menu');
  }));
  document.addEventListener('click', e => {
    if (!nav || !toggle || !nav.classList.contains('open')) return;
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1120 && nav?.classList.contains('open')) {
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Contact Us CTAs open only the relevant franchise or corporate catering forms.
  document.querySelectorAll('[data-open-form]').forEach(button => {
    button.addEventListener('click', () => {
      const formId = button.getAttribute('data-open-form');
      const form = document.getElementById(formId);
      const dialog = form?.closest('dialog');
      if (dialog && !dialog.open) dialog.showModal();
    });
  });
  document.querySelectorAll('.close-dialog').forEach(button => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });
  document.querySelectorAll('dialog.enquiry-dialog').forEach(dialog => {
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  });

  // Save franchisee and corporate catering enquiries to the website Supabase project.
  document.querySelectorAll('.business-enquiry-form').forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const status = form.querySelector('.form-status');
      const submit = form.querySelector('button[type="submit"]');
      const data = Object.fromEntries(new FormData(form).entries());
      if (data.website) return; // honeypot
      const ready = cfg.supabaseUrl && !cfg.supabaseUrl.includes('YOUR-WEBSITE-PROJECT') &&
        cfg.supabasePublishableKey && !cfg.supabasePublishableKey.includes('YOUR_SUPABASE');
      if (!ready) {
        status.textContent = 'The enquiry service is not configured yet. Please call one of our branches.';
        status.className = 'form-status error';
        return;
      }
      submit.disabled = true;
      status.textContent = 'Submitting your enquiry…';
      status.className = 'form-status';
      try {
        const payload = {
          enquiry_type: form.dataset.enquiryType,
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          location: data.location,
          company: data.company || '',
          investment_range: data.investment_range || '',
          experience: data.experience || '',
          event_date: data.event_date || null,
          guest_count: data.guest_count ? Number(data.guest_count) : null,
          details: data.details || '',
          website: ''
        };
        const response = await fetch(`${cfg.supabaseUrl}/functions/v1/submit-business-enquiry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: cfg.supabasePublishableKey,
            Authorization: `Bearer ${cfg.supabasePublishableKey}`
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Could not submit your enquiry. Please try again.');
        status.textContent = `Thank you. Your enquiry has been submitted successfully. Reference: ${result.enquiry_id}`;
        status.className = 'form-status success';
        form.reset();
        setTimeout(() => form.closest('dialog')?.close(), 2200);
      } catch (error) {
        status.textContent = error.message || 'Something went wrong. Please try again.';
        status.className = 'form-status error';
      } finally {
        submit.disabled = false;
      }
    });
  });
})();


/* V26: hero slideshow - three images maximum, autoplay and manual dot controls */
(() => {
  const frame = document.querySelector('.hero-visual');
  if (!frame) return;
  const slides = Array.from(frame.querySelectorAll('.hero-slide')).slice(0, 3);
  const dots = Array.from(frame.querySelectorAll('.slider-dots button')).slice(0, slides.length);
  if (slides.length < 2) return;

  let active = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));
  let timer = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const show = index => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === active);
      slide.setAttribute('aria-hidden', String(i !== active));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('selected', i === active);
      dot.setAttribute('aria-pressed', String(i === active));
    });
  };
  const stop = () => { if (timer) window.clearInterval(timer); timer = null; };
  const start = () => {
    stop();
    if (!reducedMotion && !document.hidden) {
      timer = window.setInterval(() => show(active + 1), 9000);
    }
  };

  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    show(i);
    start();
  }));
  frame.addEventListener('mouseenter', stop);
  frame.addEventListener('mouseleave', start);
  frame.addEventListener('focusin', stop);
  frame.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  show(active);
  start();
})();


/* V34: Show the home-delivery notice instead of redirecting from Order Online. */
(() => {
  const dialog = document.getElementById('order-online-popup');
  if (!dialog) return;
  document.addEventListener('click', event => {
    const trigger = event.target.closest('.order-online-trigger');
    if (!trigger) return;
    event.preventDefault();
    if (typeof dialog.showModal === 'function') dialog.showModal();
  });
  dialog.querySelector('.delivery-notice-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
})();

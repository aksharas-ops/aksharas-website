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

  // Public reviews endpoint returns only published, exact five-star reviews with comments.
  async function loadPublishedReviews() {
    const grid = document.getElementById('review-grid');
    const empty = document.getElementById('review-empty');
    if (!grid || !empty) return;
    const ready = cfg.supabaseUrl && !cfg.supabaseUrl.includes('YOUR-WEBSITE-PROJECT') &&
      cfg.supabasePublishableKey && !cfg.supabasePublishableKey.includes('YOUR_SUPABASE');
    if (!ready) {
      empty.textContent = 'Customer testimonials will appear here once verified five-star reviews are connected.';
      return;
    }
    try {
      const response = await fetch(`${cfg.supabaseUrl}/functions/v1/get-published-reviews`, {
        headers: { apikey: cfg.supabasePublishableKey, Authorization: `Bearer ${cfg.supabasePublishableKey}` }
      });
      if (!response.ok) throw new Error('Reviews are temporarily unavailable.');
      const payload = await response.json();
      const reviews = (payload.reviews || []).filter(r => Number(r.star_rating) === 5 && String(r.comment || '').trim());
      grid.replaceChildren();
      reviews.slice(0, 3).forEach(r => {
        const card = document.createElement('article'); card.className = 'review-card';
        const stars = document.createElement('div'); stars.className = 'review-stars'; stars.textContent = '★★★★★';
        const quote = document.createElement('p'); quote.className = 'review-quote'; quote.textContent = `“${r.comment}”`;
        card.append(stars, quote);
        const attribution = document.createElement('small');
        attribution.textContent = [r.reviewer_name || 'Google customer', r.branch].filter(Boolean).join(' · ');
        card.append(attribution);
        grid.append(card);
      });
      empty.hidden = reviews.length > 0;
      if (!reviews.length) empty.textContent = 'Verified five-star customer comments will appear here after approval.';
    } catch (err) {
      empty.textContent = 'Customer testimonials are temporarily unavailable.';
    }
  }
  loadPublishedReviews();

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

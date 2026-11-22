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

  const dialog = document.getElementById('enquiry-dialog');
  document.querySelectorAll('[data-open-enquiry]').forEach(btn => btn.addEventListener('click', () => dialog?.showModal()));
  document.querySelector('.close-dialog')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

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

  // Save the enquiry through the Supabase Edge Function before opening WhatsApp.
  const partyForm = document.getElementById('party-form');
  const status = document.getElementById('party-form-status');
  partyForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(partyForm).entries());
    if (data.website) return; // honeypot: silently ignore automated submissions
    const ready = cfg.supabaseUrl && !cfg.supabaseUrl.includes('YOUR-WEBSITE-PROJECT') &&
      cfg.supabasePublishableKey && !cfg.supabasePublishableKey.includes('YOUR_SUPABASE');
    if (!ready) {
      status.textContent = 'The enquiry service is not configured yet. Please contact the selected branch by phone.';
      status.className = 'form-status error';
      return;
    }
    const submit = partyForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    status.textContent = 'Submitting your enquiry…';
    status.className = 'form-status';
    try {
      const response = await fetch(`${cfg.supabaseUrl}/functions/v1/submit-party-enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: cfg.supabasePublishableKey,
          Authorization: `Bearer ${cfg.supabasePublishableKey}`
        },
        body: JSON.stringify({
          name: data.name, phone: data.phone, event_type: data.event, branch: data.branch,
          event_date: data.date, guest_count: Number(data.guests), details: data.details || '', website: ''
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not save your enquiry. Please try again.');
      const body = `Party Order Enquiry\nEnquiry ID: ${result.enquiry_id}\nName: ${data.name}\nMobile: ${data.phone}\nEvent: ${data.event}\nBranch: ${data.branch}\nDate: ${data.date}\nGuests: ${data.guests}\nDetails: ${data.details || 'Not provided'}`;
      const branchPhones = cfg.branchPhones || {};
      const destination = branchPhones[data.branch] || branchPhones.Porur || '+919677186207';
      const waUrl = `https://wa.me/${destination.replace(/\D/g, '')}?text=${encodeURIComponent(body)}`;
      status.textContent = 'Your enquiry has been saved. Opening WhatsApp…';
      status.className = 'form-status success';
      window.open(waUrl, '_blank', 'noopener');
      partyForm.reset();
      setTimeout(() => dialog?.close(), 700);
    } catch (err) {
      status.textContent = err.message || 'Something went wrong. Please try again.';
      status.className = 'form-status error';
    } finally {
      submit.disabled = false;
    }
  });
})();

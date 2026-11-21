(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('click', e => {
    if (!nav || !toggle || !nav.classList.contains('open')) return;
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
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

  const reviews = (window.AKSHARAS_CONFIG?.reviews || []).filter(r => Number(r.rating) === 5 && String(r.comment || r.text || '').trim());
  const grid = document.getElementById('review-grid');
  const empty = document.getElementById('review-empty');
  if (reviews.length) {
    reviews.slice(0, 3).forEach(r => {
      const card = document.createElement('article'); card.className = 'review-card';
      const stars = document.createElement('div'); stars.className = 'review-stars'; stars.textContent = '★★★★★';
      const quote = document.createElement('p'); quote.className = 'review-quote'; quote.textContent = `“${r.comment || r.text}”`;
      card.append(stars, quote);
      if (r.author) { const author = document.createElement('small'); author.textContent = r.author; card.append(author); }
      grid.append(card);
    });
    empty.hidden = true;
  } else {
    empty.textContent = 'Customer testimonials will appear here once verified five-star reviews are connected.';
  }

  document.getElementById('party-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const body = `Party Order Enquiry\nName: ${data.name}\nMobile: ${data.phone}\nEvent: ${data.event}\nBranch: ${data.branch}\nDate: ${data.date}\nGuests: ${data.guests}\nDetails: ${data.details || 'Not provided'}`;
    const url = `https://wa.me/918925534938?text=${encodeURIComponent(body)}`;
    window.open(url, '_blank', 'noopener');
    dialog.close();
  });
})();

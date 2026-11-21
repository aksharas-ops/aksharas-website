const config = window.AKSHARAS_CONFIG || {};
const nav = document.querySelector('.main-nav');
const toggle = document.querySelector('.menu-toggle');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();
if (config.orderUrl) document.querySelectorAll('a[href="https://crossroads.dotpe.in"]').forEach(a => a.href = config.orderUrl);

const dialog = document.getElementById('enquiry-dialog');
document.getElementById('open-enquiry')?.addEventListener('click', () => dialog.showModal());
document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
const form = document.getElementById('party-form');
form?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const payload = Object.fromEntries(new FormData(form).entries());
  const endpoint = config.partyEnquiryEndpoint;
  if (!endpoint) {
    alert('The enquiry form design is ready. Connect the secure enquiry endpoint before accepting live submissions.');
    return;
  }
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true; submit.textContent = 'Submitting…';
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error('Request failed');
    alert('Thank you! Your party enquiry has been submitted.'); form.reset(); dialog.close();
  } catch (err) { alert('We could not submit your enquiry. Please call +91 89255 34938.'); }
  finally { submit.disabled = false; submit.innerHTML = 'Review Enquiry <span>→</span>'; }
});

async function loadFiveStarReviews() {
  const target = document.getElementById('reviews-list');
  if (!config.reviewsEndpoint) return; // No invented/sample reviews are displayed.
  try {
    const response = await fetch(config.reviewsEndpoint, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) throw new Error('Could not load reviews');
    const data = await response.json();
    const reviews = (Array.isArray(data) ? data : data.reviews || []).filter(r => Number(r.rating) === 5 && String(r.text || r.comment || '').trim());
    if (!reviews.length) { target.innerHTML = '<div class="reviews-empty">Customer feedback will appear here when verified five-star comments are available.</div>'; return; }
    target.innerHTML = '';
    reviews.slice(0, 6).forEach(review => {
      const card = document.createElement('article'); card.className = 'review-card';
      const stars = document.createElement('div'); stars.className = 'review-stars'; stars.textContent = '★★★★★';
      const quote = document.createElement('blockquote'); quote.textContent = review.text || review.comment;
      const author = document.createElement('div'); author.className = 'review-author'; author.textContent = review.author || review.authorName || 'Customer';
      card.append(stars, quote, author); target.append(card);
    });
  } catch (error) {
    target.innerHTML = '<div class="reviews-empty">Customer testimonials are temporarily unavailable.</div>';
  }
}
loadFiveStarReviews();

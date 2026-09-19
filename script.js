// script.js — typing name animation, project loading/filtering, mobile menu, mailto contact form

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Typing name animation ---------- */
async function typeName() {
  const el = document.getElementById('typedName');
  if (!el) return;
  const fullName = 'Farhan Ali';

  if (prefersReducedMotion) {
    el.textContent = fullName;
    return;
  }

  el.textContent = '';
  for (const char of fullName) {
    el.textContent += char;
    await sleep(90);
  }
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* ---------- Mobile menu toggle ---------- */
function setupMobileMenu() {
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* ---------- Projects: load, render, filter ---------- */
let allProjects = [];
let activeFilter = 'All';

async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error('Request failed');
    allProjects = await res.json();
    renderProjects();
  } catch (err) {
    grid.innerHTML = '<div class="projects-error">Couldn\'t load projects.json.</div>';
    console.error(err);
  }
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const filtered = activeFilter === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === activeFilter);

  const sorted = [...filtered].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (sorted.length === 0) {
    grid.innerHTML = '<div class="projects-empty">No projects in this category yet.</div>';
    return;
  }

  grid.innerHTML = sorted.map(projectCardHTML).join('');
}

function projectCardHTML(p) {
  const tags = (p.stack || []).map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join('');
  const liveLink = p.live
    ? `<a href="${escapeHTML(p.live)}" target="_blank" rel="noopener" class="project-link">Live demo →</a>`
    : '';
  const thumb = p.thumbnail
    ? `<img class="project-thumb" src="${escapeHTML(p.thumbnail)}" alt="${escapeHTML(p.title)} screenshot" loading="lazy">`
    : `<div class="project-thumb-placeholder">${escapeHTML(initials(p.title))}</div>`;

  return `
    <div class="project-card">
      ${thumb}
      <div class="project-body">
        <div class="project-tagline">${escapeHTML(p.tagline || '')}</div>
        <div class="project-title">${escapeHTML(p.title)}</div>
        <p class="project-desc">${escapeHTML(p.description)}</p>
        <div class="project-tags">${tags}</div>
        <a href="${escapeHTML(p.github)}" target="_blank" rel="noopener" class="project-link">View on GitHub →</a>
        ${liveLink}
      </div>
    </div>
  `;
}

function initials(title = '') {
  return title
    .split(' ')
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function escapeHTML(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setupFilterTabs() {
  const tabsContainer = document.getElementById('filterTabs');
  if (!tabsContainer) return;

  tabsContainer.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      renderProjects();
    });
  });
}

/* ---------- "Hire Me" button: jump to contact form, prefill a starter message ---------- */
function setupHireMe() {
  const btn = document.getElementById('hireMe');
  const message = document.getElementById('message');
  if (!btn || !message) return;

  btn.addEventListener('click', () => {
    if (!message.value.trim()) {
      message.value = "Hi Farhan, I came across your portfolio and would like to discuss a Flutter / full-stack opportunity with you.";
    }
    setTimeout(() => message.focus({ preventScroll: true }), 700);
  });
}

/* ---------- Contact form (Formspree — real submission, no backend to host) ---------- */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form-status';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || message.length < 10) {
      status.textContent = 'Please fill in every field (message: at least 10 characters).';
      status.className = 'form-status error';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (res.ok) {
        status.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
        status.className = 'form-status success';
        form.reset();
      } else {
        const data = await res.json().catch(() => null);
        throw new Error(data?.errors?.[0]?.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      status.textContent = `Error: ${err.message}`;
      status.className = 'form-status error';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  typeName();
  setupMobileMenu();
  loadProjects();
  setupFilterTabs();
  setupContactForm();
  setupHireMe();
});

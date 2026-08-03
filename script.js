// script.js — terminal hero animation, static project loading, mailto contact form

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Terminal typewriter ---------- */
const terminalLines = [
  { type: 'prompt', text: '$ whoami' },
  { type: 'plain', text: 'farhan-ali — mobile & full-stack developer' },
  { type: 'gap' },
  { type: 'prompt', text: '$ flutter build apk --release' },
  { type: 'muted', text: "Running Gradle task 'assembleRelease'..." },
  { type: 'success', text: '✓ Built app-release.apk' },
  { type: 'gap' },
  { type: 'prompt', text: '$ cat data/projects.json | jq length' },
  { type: 'success', text: '✓ 3 projects loaded' }
];

function renderLineHTML(line) {
  if (line.type === 'gap') return '\n';
  const cls = line.type === 'prompt' ? 'term-prompt'
    : line.type === 'success' ? 'term-success'
    : line.type === 'muted' ? 'term-muted'
    : '';
  return cls ? `<span class="${cls}">${line.text}</span>\n` : `${line.text}\n`;
}

async function typeTerminal() {
  const el = document.getElementById('terminalBody');
  if (!el) return;

  if (prefersReducedMotion) {
    el.innerHTML = terminalLines.map(renderLineHTML).join('');
    return;
  }

  el.innerHTML = '<span class="term-cursor"></span>';
  let output = '';

  for (const line of terminalLines) {
    if (line.type === 'gap') {
      output += '\n';
      el.innerHTML = output + '<span class="term-cursor"></span>';
      await sleep(180);
      continue;
    }
    const cls = line.type === 'prompt' ? 'term-prompt'
      : line.type === 'success' ? 'term-success'
      : line.type === 'muted' ? 'term-muted'
      : '';
    let typed = '';
    const speed = line.type === 'prompt' ? 34 : 10;
    for (const char of line.text) {
      typed += char;
      const wrapped = cls ? `<span class="${cls}">${typed}</span>` : typed;
      el.innerHTML = output + wrapped + '<span class="term-cursor"></span>';
      await sleep(speed);
    }
    output += (cls ? `<span class="${cls}">${line.text}</span>` : line.text) + '\n';
    await sleep(160);
  }

  el.innerHTML = output + '<span class="term-cursor"></span>';
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* ---------- Projects (loaded from a static JSON file) ---------- */
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error('Request failed');
    const projects = await res.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      grid.innerHTML = '<div class="projects-empty">No projects yet.</div>';
      return;
    }

    const sorted = [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    grid.innerHTML = sorted.map(projectCardHTML).join('');
  } catch (err) {
    grid.innerHTML = '<div class="projects-error">Couldn\'t load projects.json.</div>';
    console.error(err);
  }
}

function projectCardHTML(p) {
  const tags = (p.stack || []).map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join('');
  const liveLink = p.live
    ? `<a href="${escapeHTML(p.live)}" target="_blank" rel="noopener" class="project-link">Live demo →</a>`
    : '';
  return `
    <div class="project-card">
      <div class="project-tagline">${escapeHTML(p.tagline || '')}</div>
      <div class="project-title">${escapeHTML(p.title)}</div>
      <p class="project-desc">${escapeHTML(p.description)}</p>
      <div class="project-tags">${tags}</div>
      <a href="${escapeHTML(p.github)}" target="_blank" rel="noopener" class="project-link">View on GitHub →</a>
      ${liveLink}
    </div>
  `;
}

function escapeHTML(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ---------- Contact form (mailto — no backend on a static site) ---------- */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || message.length < 10) {
      status.textContent = 'Please fill in every field (message: at least 10 characters).';
      status.className = 'form-status error';
      return;
    }

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:farhanalifarhan57218140@gmail.com?subject=${subject}&body=${body}`;

    status.textContent = '$ opening your email client ✓';
    status.className = 'form-status success';
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  typeTerminal();
  loadProjects();
  setupContactForm();
});

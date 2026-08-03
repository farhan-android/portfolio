# Farhan Ali — Portfolio

A personal portfolio site, built as a static HTML/CSS/JS site so it runs
directly on GitHub Pages with no server required.

## Stack

- HTML, CSS, vanilla JavaScript — no framework, no build step
- Project list loaded dynamically from `data/projects.json` via `fetch()`
- Contact form opens the visitor's email client with the message pre-filled (no backend needed)

## Structure

```
portfolio/
├── index.html
├── style.css
├── script.js
├── data/
│   └── projects.json     # single source of truth for the projects section
└── assets/
    └── profile.jpeg
```

## Updating your projects

Edit `data/projects.json` — no code changes needed. Each entry looks like:

```json
{
  "id": "unique-id",
  "title": "Project Name",
  "tagline": "Short context line",
  "description": "One or two sentences about the project.",
  "stack": ["Flutter", "Firebase"],
  "github": "https://github.com/your-username/repo",
  "live": "",
  "order": 1
}
```

## Running locally

No build step needed — just open `index.html` in a browser, or serve it with
any static file server, e.g.:

```bash
npx serve .
```

## Deploying to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under "Build and deployment", set **Source: Deploy from a branch**
4. Branch: `main`, folder: `/ (root)`
5. Save — your site will be live at `https://<username>.github.io/<repo-name>`

## Author

**Farhan Ali** — Mobile & Full-Stack Developer
Multan, Pakistan · [github.com/farhan-android](https://github.com/farhan-android)

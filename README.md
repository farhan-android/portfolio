# Farhan Ali — Portfolio

A personal portfolio site — static HTML/CSS/JS, no build step, deploys directly on GitHub Pages.

## Features

- Typing animation on the hero name
- Phone-mockup visual in the hero showing a quick profile summary
- Stats row, tech stack badges, skill percentage bars, work-experience timeline
- Filterable project grid (All / Mobile / Backend) loaded from `data/projects.json`
- Contact form that opens the visitor's email client (no backend needed)

## Structure

```
portfolio/
├── index.html
├── style.css
├── script.js
├── data/
│   └── projects.json     # single source of truth for the projects section
└── assets/
    ├── profile.png
    └── projects/
        ├── lms-app/thumb.jpeg
        ├── weather-app/thumb.jpeg
        └── notes-app/thumb.jpeg
```

## Updating your projects

Edit `data/projects.json`. Each entry:

```json
{
  "id": "unique-id",
  "title": "Project Name",
  "tagline": "Short context line",
  "description": "One or two sentences.",
  "category": "Mobile",
  "stack": ["Flutter", "Firebase"],
  "github": "https://github.com/your-username/repo",
  "live": "",
  "thumbnail": "assets/projects/your-folder/thumb.jpg",
  "order": 1
}
```

`category` must be `"Mobile"` or `"Backend"` to work with the filter tabs. Leave `thumbnail` as an empty string to show an auto-generated initials placeholder instead of an image.

## Running locally

```bash
npx serve .
```

## Deploying to GitHub Pages

1. Push this repo to GitHub
2. Settings → Pages → Source: Deploy from a branch → `main` / root
3. Live at `https://<username>.github.io/<repo-name>`

## Author

**Farhan Ali** — Flutter Full-Stack Developer
Multan, Pakistan · [github.com/farhan-android](https://github.com/farhan-android)

# Custom Tab Generator

A small Next.js + TypeScript app I built to generate accessible tabs with a live preview and a one‑file HTML export. The site also includes a short About page and a few coursework playgrounds (Escape Room, Coding Races, Court Room).

---

## Features

- Tabs generator with keyboard support (ARIA roles, focus management)
- One‑click export to a standalone HTML file (inline CSS + JS; save as `Hello.html`)
- Light/dark theme toggle (saved in `localStorage`)
- Simple, responsive header with a mobile menu
- Footer shows name, student number and date
- Remembers the last visited menu and active tab

---

## Getting Started

Prerequisites: a recent Node.js LTS and npm.

1) Install dependencies

```bash
npm install
```

2) Start the dev server

```bash
npm run dev
```

Then open http://localhost:3000

### Database setup

If you need persistence for saved outputs or Court Room events, run:

```bash
npm run prisma:migrate -- --name init
npm run prisma:generate
```

This creates the local SQLite database at `./dev.db` and generates the Prisma client.

### Tests

```bash
npm test
```

Runs two tab-markup regression tests using Node's built-in test runner.

### Docker

Build and run the production image locally:

```bash
docker build -t tab-generator .
docker run -p 3000:3000 tab-generator
```

---

## Scripts

- `npm run dev` – run the app in development
- `npm run build` – build for production
- `npm start` – run the production build
- `npm run lint` – lint the code

---

## Project Layout

- `src/app/` – App Router pages (home, about, extras)
- `src/components/` – Header, Footer, Layout, Breadcrumbs
- `src/app/globals.css` – global styles; Tailwind via `@import "tailwindcss"`
- `public/` – icons and images

---

## Accessibility

- `tablist` / `tab` / `tabpanel` roles and keyboard navigation
- Arrow keys, Home, End to move focus
- Exported HTML keeps the same behavior without external CSS

---

## Credits

Developer: Rohan Khurana (21358295) – August 2025

---

## License

Provided as‑is for educational use.

If something is unclear or broken, please open an issue.

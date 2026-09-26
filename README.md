# Nelin — storefront design

A Next.js App Router storefront concept for nelinstyle.com. Persian `/fa`, English `/en`, Arabic `/ar`; the root redirects to Persian.

## Run

Node.js 20.9+ is required (Docker image uses Node 24 LTS). Install from the lockfile:

```sh
npm ci
npm run dev          # http://127.0.0.1:3000
npm run build && npm start
```

## Docker (home server / any container host)

`Dockerfile` is a multi-stage build using Next.js standalone output (enabled only when `NEXT_OUTPUT=standalone`, which the Dockerfile sets). It runs as non-root user `nextjs`, listens on `0.0.0.0`, and honours `PORT` (default 3000). No build secrets or env vars are needed; `.dockerignore` keeps `.env*`, `node_modules`, `.next` and `.git` out of the context.

```sh
docker build -t nelin .
docker run --rm -p 3000:3000 nelin
docker run --rm -p 8080:8080 -e PORT=8080 nelin
```

Put TLS/reverse proxy (Caddy, nginx, Traefik) in front for public hosting.

## Vercel

Vercel ignores the Dockerfile. Import the repo, Next.js preset, `npm run build`, no env vars. Add `nelinstyle.com` via Vercel Domains when ready. Nothing has been deployed.

## Current scope

Design prototype only. There are no displayed prices, payment flow, accounts or management system. Visitors select scarf designs and quantities, then preview a request-a-quote form. The form validates required name/contact fields but does not submit, transmit or store contact data. It explicitly explains this preview state. Selection and favourites persist only in browser local storage. Connect a server-side quote endpoint and choose a management system before launch.

The twelve displayed designs use supplied product artwork. Editorial design names are provisional, not verified supplier SKUs. Material, dimensions and inventory are deliberately not asserted. Catalogue data and all three translation sets live in `app/store.tsx`; shared styles in `app/globals.css`.

## Local assets

All images and fonts are served locally. Original image files were copied without pixel modifications; hero framing uses CSS cropping. Supplied Nelin logo is displayed in the brand section. Fonts: Ario and Arad from Mohammad Darvishi's official website; Vazirmatn from its official GitHub repository. Confirm commercial font licensing before production publication. See `ASSETS.md` for provenance.

## Design references

- https://threeui.com/browse — cinematic product presentation and restrained motion
- https://styles.refero.design/ — luxury commerce and editorial hierarchy

The site uses an original layout and CSS, without copying premium component source.

## Product galleries

Each displayed scarf has a matching supplied on-model photograph in its detail gallery. Thumbnails, previous/next controls, and keyboard arrow navigation are supported. The slideshow advances every 4.5 seconds, pauses on hover or a hidden tab, and stops after manual selection. Reduced-motion preferences disable autoplay by default. All gallery files are local; source mappings are in ASSETS.md.

## Handoff to Claude

Start with `CLAUDE_HANDOFF.md` (Persian). About pages are `/fa/about`, `/en/about`, `/ar/about`. The homepage includes a Three.js gift-box scene in `app/scarf-scene.tsx`, using the supplied scarf artwork on folded fabric geometry, with scroll/drag camera controls and a WebGL fallback. The actual brand logo is also used in the header and footer.

### Hosting plan limitation

The project is technically compatible with Vercel's Next.js preset, but the free Hobby plan is restricted to personal, non-commercial use. This is a commercial brand project; do not assume a client preview or quote-only catalogue qualifies. Confirm an eligible plan before publishing. No free-hosting entitlement is promised.

References checked 2026-09-26:
- https://vercel.com/docs/plans/hobby
- https://vercel.com/docs/limits/fair-use-guidelines

For Vercel import, choose the directory containing `package.json` as the root, use the Next.js preset and the standard build command `npm run build`. Let Next.js/Vercel manage the output directory; do not set it to `out`. Current code needs no environment variables. Configure credentials separately if a backend is added later.

## Images

Product, hero, gallery and 3D-texture images go through `next/image` (resized WebP via `sharp`, included in the Docker image). Originals in `public/images` stay untouched. Logo and flags are small and served as-is.

## Known limitations

- Pinch zoom in the 3D scene is verified with synthetic touch events in headless Chrome only, not on a physical phone.
- Quote form is a preview: nothing is sent or stored.

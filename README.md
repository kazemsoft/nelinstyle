# Nelin — storefront design

A Next.js App Router storefront concept for nelinstyle.com. Persian `/fa`, English `/en`, Arabic `/ar`; the root redirects to Persian.

## Run

Node.js 20.9+ is required.

```sh
npm ci
npm run dev
```

## Production / Vercel

```sh
npm run build
npm start
```

Import this folder into a Git repository and connect it to Vercel. Select the Next.js preset; no environment variables are required. Add `nelinstyle.com` through Vercel Domains when ready. No deployment or domain changes have been made by this delivery.

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

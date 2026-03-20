# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `carte-fft/`:

```bash
npm run dev      # Start dev server with HMR
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

**Stack:** React 19 + Vite + Leaflet/React-Leaflet + plain CSS. No TypeScript, no state management library.

**App entry:** `src/main.jsx` → `src/App.jsx`

**Data:** `src/data/etablissements.json` (~80+ institutions). Each record has `lat`/`lng` coordinates, `region` (code like "IDF", "ARA"), `filieres` (array), `type` ("universite" | "ecole_commerce"), `distanciel` (boolean), and contact fields (`referent`, `email`, `telephone`) that are multi-line strings (split on `\n` for multiple contacts).

**State lives in App.jsx:** Active filters (region, filière, type, niveau, distanciel) and selected institution. Filtered data is computed with `useMemo`.

**Components:**
- `MapView.jsx` — Leaflet map with Nominatim geocoding search, marker clustering, FlyTo on selection, color-coded markers (blue = université, red = école de commerce)
- `Filters.jsx` — Filter controls: 15 regions, 9 filières, type, SHN/SBN niveau, distanciel
- `EtablissementList.jsx` — Responsive card grid, click to select
- `DetailPanel.jsx` — Right-side overlay (460px drawer) showing full institution details

**Geocoding:** MapView uses the Nominatim API (OpenStreetMap) for the search bar — no API key required.

## Data Notes

- Institution coordinates (`lat`/`lng`) are stored directly in `etablissements.json`
- Region field uses short codes (e.g., "IDF" for Île-de-France, "ARA" for Auvergne-Rhône-Alpes)
- The `criteres`, `amenagements`, `referent`, `email`, `telephone` fields use `\n` as delimiter for multiple values corresponding to different departments/contacts within the same institution

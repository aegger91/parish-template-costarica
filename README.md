# Orthodox Parish Website Template

A blank, reusable parish website. All names, people, times, and photos are samples ("St. Example Orthodox Church") to be replaced with real parish content. React, Vite, TypeScript, and Tailwind CSS. English, Spanish, and Russian.

```bash
npm install
npm run dev        # local site at http://localhost:5173
npm run build      # static output in dist/
npm run typecheck && npm run lint
```

The build is a static single-page app. On any host, send unknown paths to `index.html` so links like `/about` load directly.

## Making it a parish's site

- **Content:** everything lives in `src/content/` as JSON. Translatable fields look like `{ "en": "...", "es": "...", "ru": "..." }`.
  - `site.json`: parish name, jurisdiction, diocese, address, email, phone, map link, OrthodoxConnect links
  - `services.json`, `clergy.json`, `gallery.json`, `news.json`, `giving.json`, `navigation.json`, `ui.json`
- **Logo:** set `logo.src` in `site.json` (for example `/images/logo.png`). When it is empty, an Orthodox cross is shown instead.
- **Theme:** colors, fonts, radii, and spacing are in `src/styles/tokens.css`. The file ends with a commented example of a full re-theme.
- **Sections:** each page is a file in `src/content/pages/` with an ordered `sections` list. Move sections to reorder them, or set `"enabled": false` to hide one.
- **Images:** placeholders are in `public/images/placeholder/`. Replace them, or point the content files at new images.
- **Head tags:** `index.html` and `public/site.webmanifest` hold the default title, description, and app name shown before the app loads.

Content strings can use `{time:sunday-liturgy}` to insert a service time and `{site.name}` or `{site.address.singleLine}` to insert a site field.

- `src/components/sections/`: page sections; `registry.ts` maps each section `type` to its component
- `src/lib/donate.ts`: the single donation handler (not connected to a payment provider yet, see the TODO)
- `src/lib/orthodoxConnect.ts`: OrthodoxConnect feed (shows labeled sample data until `feedUrl` is set)

## Adding a language

Add it to `src/content/languages.json`, then fill the new key in the content files by hand or with the optional script:

```bash
DEEPL_API_KEY=your-key npm run translate -- --to de
GOOGLE_TRANSLATE_API_KEY=your-key npm run translate -- --to fr --provider google
```

Missing translations fall back to the default language.

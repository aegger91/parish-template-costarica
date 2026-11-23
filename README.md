# Our Lady of Vladimir Church

Website for Our Lady of Vladimir Russian Orthodox Church in Vázquez de Coronado, San José, Costa Rica. React, Vite, TypeScript, and Tailwind CSS. English, Spanish, and Russian.

```bash
npm install
npm run dev        # local site at http://localhost:5173
npm run build      # static output in dist/
npm run typecheck && npm run lint
```

The build is a static single-page app. On any host, send unknown paths to `index.html` so links like `/about` load directly.

## Where things live

- `src/content/`: all text and data as JSON. Translatable fields look like `{ "en": "...", "es": "...", "ru": "..." }`.
  - `site.json`: parish name, logo, address, email, map link, OrthodoxConnect links
  - `services.json`, `clergy.json`, `gallery.json`, `news.json`, `giving.json`, `navigation.json`, `ui.json`
  - `pages/*.json`: one file per page with SEO and an ordered `sections` list. Reorder sections, or set `"enabled": false` to hide one.
  - `languages.json`: languages shown in the switcher
- `src/styles/tokens.css`: colors, fonts, radii, and spacing
- `src/components/sections/`: page sections; `registry.ts` maps each section `type` to its component
- `src/lib/donate.ts`: the single donation handler (not connected to a payment provider yet, see the TODO)
- `src/lib/orthodoxConnect.ts`: OrthodoxConnect feed (shows labeled sample data until `feedUrl` is set)

Content strings can use `{time:sunday-liturgy}` to insert a service time and `{site.name}` to insert a site field.

## Adding a language

Add it to `src/content/languages.json`, then fill the new key in the content files by hand or with the optional script:

```bash
DEEPL_API_KEY=your-key npm run translate -- --to de
GOOGLE_TRANSLATE_API_KEY=your-key npm run translate -- --to fr --provider google
```

Missing translations fall back to the default language.

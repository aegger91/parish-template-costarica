# Orthodox Parish Website Template

One design for an Orthodox parish website. Every name, person, time and photo is a sample ("St. Example Orthodox Church"). Text is short neutral placeholder copy: the parish adds its own welcome, story and any teaching pages later.

A parish can fill it in through the OrthodoxConnect website builder (simple content fields, sections switched on or off and reordered), or the Project Orthodox team can set it up for them. There are no theme presets or design modes.

React, Vite, TypeScript and Tailwind CSS. Sample content in English, Spanish and Russian.

```bash
npm install
npm run dev        # local site at http://localhost:5173
npm run build      # static site in dist/
npm run typecheck && npm run lint
```

`npm run build` writes an `index.html` for every page and every store product (for example `dist/parish/clergy/index.html`), each with its own title and description, plus `dist/404.html`. Upload the contents of `dist/` to any static host. No rewrite rules are needed.

## Content

Everything a parish edits is JSON in `src/content/`. Translatable fields look like `{ "en": "...", "es": "...", "ru": "..." }`. A missing translation falls back to the default language.

| File | What it holds |
| --- | --- |
| `site.json` | Parish name, jurisdiction, diocese, address, map, contact, time zone, calendar, logo, modules, livestream, form and OrthodoxConnect addresses, optional Slavonic font |
| `languages.json` | Languages offered (1 or more), the default, and right-to-left languages (`"dir": "rtl"`) |
| `navigation.json` | The menu tree and footer headings |
| `services.json` | Weekly and dated services. Mark a service `"streamed": true` to show "Live now" while it is on |
| `clergy.json`, `history.json`, `gallery.json`, `news.json`, `sermons.json` | Sample lists for those sections |
| `giving.json`, `payments.json` | Donation amounts, funds and projects; checkout address and currency |
| `store.json`, `requests.json`, `zapiski.json`, `connect.json` | Data for the optional modules below |
| `ui.json` | Button labels and short interface text in each language |
| `pages/*.json` | One file per page: its address, menu label, title, and ordered list of sections |

Content strings can use `{time:sunday-liturgy}` for a service time and `{site.name}` or `{site.address.singleLine}` for a site field.

### Pages and sections

Each page lists its sections in order. Move a section up or down to reorder it, or set `"enabled": false` to hide it. A whole page can be hidden with `"enabled": false` at the top of its file; it then leaves the menu too.

The available section types are listed in `src/components/sections/registry.ts`. The home page includes an optional `intro` section (a short Welcome or About block) that can be switched off.

Pages can be nested: give a page a path such as `/parish/choir` and add it under a group in `navigation.json`. Groups without their own page open on their first item.

### Settings in `site.json`

- **`logo.style`**: `seal`, `kiot`, `square` or `wordmark`. Set `logo.src` to use an image; when empty, the eight-pointed cross is drawn.
- **`calendar.style`**: `julian` (Old Calendar), `revised-julian` (New Calendar) or `gregorian`. Feasts, fasts and the schedule follow it everywhere.
- **`modules`**: switch each optional module on or off. A switched-off module removes its pages, menu entries and shortcuts.
- **`livestream`**: `watchUrl` and `embedUrl` for the parish channel.
- **`formsEndpoint`**: where contact messages and service requests are posted. When empty, forms show the parish email instead.
- **`orthodoxConnect`**: parish id, app address, events feed, sign-up address and the newsletter switch. The footer newsletter shows only when `newsletter.enabled` is true.
- **`slavonicFont`**: empty, or `old-standard`, `ponomar` or `triodion` (all SIL Open Font License, in `public/fonts/`) for headings, buttons and ornaments.

## Optional modules

| Module | Pages | Notes |
| --- | --- | --- |
| `livestream` | Livestream & Sermons | Embedded player, sermon list with filters |
| `store` | Store, product pages, Cart, Checkout | Variants, stock, shipping or pickup at the church |
| `serviceRequests` | Services > Request a Service | Card grid; each card opens a short request form |
| `zapiski` | Services > Zapiski and Candles | Health and repose slips, commemoration types, optional candle |
| `getInvolved` | Get Involved > Events, Volunteer and Needs | Read from OrthodoxConnect; sign-up and "create" links hand off to the app |

## Payments and forms

No payment keys are stored in this repository. Donations, store orders and zapiski all go through `submitPayment` in `src/lib/payments.ts`, which posts the order to `payments.json` `checkoutEndpoint`. That endpoint is expected to create a hosted payment page (for example Stripe Checkout or Authorize.net Accept Hosted) and return its address. See the `TODO(payments)` note in that file. When the endpoint is empty, the site says online payment is not connected yet and shows the parish email.

Contact messages and service requests use `site.json` `formsEndpoint` the same way (`src/lib/forms.ts`).

## Look and images

- Colors, type and spacing: `src/styles/tokens.css`. Fonts: `src/styles/fonts.css`.
- Placeholder images are in `public/images/`. Replace them, or point the content files at new ones. Use real photographs and canonical icons only; do not use generated images of Christ, the Theotokos or the saints.
- `public/site.webmanifest` holds the app name shown when the site is installed on a phone.

## Adding a language

Add it to `src/content/languages.json`, then fill the new key in the content files by hand or with the optional script:

```bash
DEEPL_API_KEY=your-key npm run translate -- --to de
GOOGLE_TRANSLATE_API_KEY=your-key npm run translate -- --to fr --provider google
```

Two or three languages show as buttons; more become a dropdown. With one language the switcher is hidden.

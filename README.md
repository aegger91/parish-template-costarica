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

- **`logo.style`**: `church` (default: a gold line drawing of a church with onion domes and three-bar crosses, `src/components/ui/ChurchMark.tsx`), or `seal`, `kiot`, `square` or `wordmark`. For the framed styles set `logo.src` to use an image; when empty, the eight-pointed cross is drawn.
- **`hours`**: one or two short lines of opening hours shown at the top left of the header, e.g. "Church open daily" and "8:00 AM to 7:00 PM". Leave out to hide.
- **`calendar.style`** (also called **calendarStyle**): `'old'` | `'new'`. Chosen by the builder or parish — there is no visitor toggle. Default: `'old'` (ROCOR / Julian). `'old'` uses Julian fixed feasts and shows civil dates with Old Style (e.g. `Dec 19 (Dec 6 O.S.)`). `'new'` is Revised Julian (fixed feasts on the civil date). Movable Pascha-based feasts follow the Orthodox Paschalion in both. A small “Old Calendar (Julian)” / “New Calendar” label appears in the schedule header.
- **`modules`**: switch each optional module on or off. A switched-off module removes its pages, menu entries and shortcuts.
- **`livestream`**: `watchUrl` and `embedUrl` for the parish channel.
- **`formsEndpoint`**: where contact messages and service requests are posted. When empty, forms show the parish email instead.
- **`orthodoxConnect`**: parish id, app address, events feed, sign-up address and the newsletter switch. The footer newsletter shows only when `newsletter.enabled` is true.
- **`slavonicFont`**: empty, or `old-standard`, `ponomar` or `triodion` (all SIL Open Font License, in `public/fonts/`) for headings.

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

- Colors, type and spacing: `src/styles/tokens.css` (olive frame, white header card, warm cream body, gold and ochre accents). Fonts: `src/styles/fonts.css`: Playfair Display for headings and Inter for text, self-hosted in `public/fonts/` with Latin, Latin Extended and Cyrillic subsets (EB Garamond Greek covers heading Greek glyphs). Optional Slavonic faces as below. No external font CDN.
- Home page: the `hero` section is a tile grid. `image`, `title`, `upcoming` and `primaryCta` fill the tall photo tile with the next services; `tiles` adds olive tiles and wide ochre tiles (`tone`, `title`, `text`, `page`, `button`, optional `image`, `module`, and `calendarNote` to show the Old or New Calendar label).
- Inner pages: each `pageHero` shows its `backgroundImage` (default `site.json` `pageHeroBackground`) under an olive tint; `backgroundPosition` moves the crop.
- Language fit: `npm run language-fit` (with `npm run preview` serving `dist/`) loads every page in every language at 360 / 768 / 1280 and fails if text overflows or overlaps.
- Schedule rows open a detail panel with Add to calendar (.ics + Google), Directions, and livestream when marked live.
- Giving and commemorations never enforce a minimum amount; suggested chips are optional. In English UI, “Zapiski” reads as “Commemoration names” (Spanish: “Nombres para conmemorar”; Russian: “Записки”).
- Sample photographs of Orthodox churches and icons are in `public/images/church/`, with authors and licenses in `CREDITS.md`. Replace them with the parish's own, or point the content files at new ones. Use real photographs and canonical icons only; do not use generated images of Christ, the Theotokos or the saints.
- `public/site.webmanifest` holds the app name shown when the site is installed on a phone.

## Adding a language

Add it to `src/content/languages.json`, then fill the new key in the content files by hand or with the optional script:

```bash
DEEPL_API_KEY=your-key npm run translate -- --to de
GOOGLE_TRANSLATE_API_KEY=your-key npm run translate -- --to fr --provider google
```

Two or three languages show as buttons; more become a dropdown. With one language the switcher is hidden.

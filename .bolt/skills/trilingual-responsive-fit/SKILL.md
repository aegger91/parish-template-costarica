---
name: trilingual-responsive-fit
description: >
  Ensure every page of this Orthodox parish site fits cleanly within its frame at
  every viewport (320px phones through widescreen) and in all three languages
  (English, Spanish, Russian). Use whenever building, editing, redesigning, or
  reviewing any page, header, footer, card, hero, or calendar — and especially
  whenever the user complains that content overflows, is cut off, wraps badly, or
  is hard to read or tap. Russian is the longest language here, so every change
  must be checked against Russian text, not just English.
---

# Trilingual Responsive Fit

This site ships in three languages: English (en), Spanish (es), and Russian (ru).
Russian is consistently the longest and must always be the sizing reference.
The hard requirement: nothing may overflow horizontally, be clipped, or become
unreadable at any viewport in any of the three languages. This matters more than
the desktop look, because a phone user with cut-off Russian text cannot use the
site at all.

## Rules to apply on every change

1. Check Russian first, always. When sizing a heading, button, card, or nav item,
   render the Russian string mentally. If Russian fits, English and Spanish will
   too. A width that only fits the English text is not done.

2. No horizontal overflow. `html, body { overflow-x: hidden; }` is a guard, not a
   fix. Find the element that actually sticks out and give it a real fix:
   smaller base text, `break-words` / `break-all` on long tokens (emails, URLs,
   long Russian compound words), `min-w-0` on flex children so they can shrink,
   and `flex-wrap` on rows of pills or buttons.

3. Headings scale from mobile up. Base (mobile) font sizes should be noticeably
   smaller than the desktop size, using responsive prefixes, e.g.
   `text-2xl sm:text-4xl` rather than a fixed `text-4xl`. Russian headlines are
   long, so the mobile size is the one that must fit first.

4. Long unbroken strings need wrapping. Emails, phone numbers, filenames, and long
   Russian words must have `break-words` (or `break-all` where appropriate). Do not
   rely on `truncate` alone to hide the problem unless hiding is actually desired
   (e.g. a logo lockup); truncating content the user needs to read is a bug.

5. Touch targets stay usable. Buttons and links should remain at least 44px tall
   on mobile. When padding shrinks on mobile, keep a `min-h-11`-style minimum so
   controls stay easy to tap.

6. Columns stack, not squish. Multi-column grids collapse to a single column on
   mobile (`grid` defaulting to one column, `sm:grid-cols-2 lg:grid-cols-3`, or
   `flex-col sm:flex-row`). Never let three columns squeeze onto a phone screen.

7. Section padding is smaller on mobile. Large vertical padding (`py-24`, `py-32`,
   `py-40`) reads as wasted space on a phone. Use a smaller base like `py-14` and
   restore the large value at `sm:` or `lg:`.

8. Verify before declaring done. After any change, re-read the edited JSX and
   mentally walk it at 320px in RU, ES, and EN. Run `npm run build` and
   `npx tsc --noEmit -p tsconfig.app.json`. If you could not visually verify the
   UI, say so plainly instead of claiming it fits.

## Concrete examples

Good (Russian-first, mobile-first, wraps long tokens):

```
<h1 className="font-serif text-3xl font-semibold leading-tight text-white sm:text-6xl">
  Храм Владимирской иконы Божией Матери
</h1>
```

```
<a className="block break-words text-sm" href={`mailto:${email}`}>{email}</a>
```

Bad (fixed desktop size, no shrink, or long token unbreakable):

```
<h1 className="font-serif text-6xl text-white">Храм Владимирской иконы Божией Матери</h1>
```

```
<div className="flex">
  <span className="max-w-none">{email}</span>
</div>
```

## Known trouble spots in this project

- Header logo lockup + the three EN/ES/RU buttons + hamburger on narrow phones.
- The parish calendar selects, month grid, and week rows — check the Russian month
  and weekday labels and the Sunday service line.
- Footer service-schedule rows and the long Russian diocese line.
- PageHero headings, especially the Russian page titles.
- Contact email reveal and clergy email addresses (long tokens).

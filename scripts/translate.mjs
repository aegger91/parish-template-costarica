#!/usr/bin/env node
/**
 * Optional helper: fills missing translations in src/content/**\/*.json.
 *
 *   DEEPL_API_KEY=... node scripts/translate.mjs --to de
 *   GOOGLE_TRANSLATE_API_KEY=... node scripts/translate.mjs --to fr --provider google
 *
 * Options:
 *   --to <code>        target language code (required)
 *   --from <code>      source language code (default: languages.json "default")
 *   --provider <name>  deepl | google (default: whichever key is set, DeepL first)
 *   --overwrite        replace existing translations instead of only filling gaps
 *   --dry-run          print what would change without writing files
 *
 * A translatable field is any object whose keys are language codes and whose values are
 * strings, e.g. { "en": "Welcome", "es": "Bienvenido" }. Placeholders such as {time:...},
 * {site.name}, and {amount} are kept as-is; [[highlighted]] words are translated.
 * Review machine translations with a native speaker before publishing.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'src', 'content');

function parseArgs(argv) {
  const args = { overwrite: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--overwrite') args.overwrite = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a.startsWith('--')) args[a.slice(2)] = argv[++i];
  }
  return args;
}

async function listJson(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listJson(full)));
    else if (entry.name.endsWith('.json')) out.push(full);
  }
  return out;
}

const LANG_KEY = /^[a-z]{2,3}(-[A-Za-z]{2,4})?$/;

function isLocalized(node, from) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return false;
  const keys = Object.keys(node);
  return (
    keys.includes(from) &&
    keys.every((k) => LANG_KEY.test(k) && typeof node[k] === 'string')
  );
}

function collect(node, from, to, overwrite, found) {
  if (Array.isArray(node)) {
    node.forEach((child) => collect(child, from, to, overwrite, found));
  } else if (node && typeof node === 'object') {
    if (isLocalized(node, from)) {
      if (node[from].trim() && (overwrite || !node[to])) found.push(node);
      return;
    }
    Object.values(node).forEach((child) => collect(child, from, to, overwrite, found));
  }
}

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const decodeEntities = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

function protect(text, provider) {
  const keep = provider === 'deepl' ? ['<x>', '</x>'] : ['<span translate="no">', '</span>'];
  return escapeXml(text)
    .replace(/\{[\w.:-]+\}/g, (m) => `${keep[0]}${m}${keep[1]}`)
    .replace(/\[\[/g, '<b>')
    .replace(/\]\]/g, '</b>');
}

function restore(text, provider) {
  const open = provider === 'deepl' ? /<x>/g : /<span translate="no">/g;
  const close = provider === 'deepl' ? /<\/x>/g : /<\/span>/g;
  return decodeEntities(
    text.replace(open, '').replace(close, '').replace(/<b>/g, '[[').replace(/<\/b>/g, ']]'),
  );
}

async function translateDeepl(texts, from, to, key) {
  const host = key.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
  const res = await fetch(`${host}/v2/translate`, {
    method: 'POST',
    headers: { Authorization: `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: texts,
      source_lang: from.toUpperCase(),
      target_lang: to.toUpperCase(),
      tag_handling: 'xml',
      ignore_tags: ['x'],
    }),
  });
  if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.translations.map((t) => t.text);
}

async function translateGoogle(texts, from, to, key) {
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: texts, source: from, target: to, format: 'html' }),
  });
  if (!res.ok) throw new Error(`Google ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.data.translations.map((t) => t.translatedText);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const languages = JSON.parse(await readFile(path.join(CONTENT, 'languages.json'), 'utf8'));
  const from = args.from ?? languages.default;
  const to = args.to;
  if (!to) throw new Error('Missing --to <language code>');

  const deeplKey = process.env.DEEPL_API_KEY;
  const googleKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  const provider = args.provider ?? (deeplKey ? 'deepl' : googleKey ? 'google' : null);
  const key = provider === 'deepl' ? deeplKey : provider === 'google' ? googleKey : null;
  if (!args.dryRun && !key) {
    throw new Error('Set DEEPL_API_KEY or GOOGLE_TRANSLATE_API_KEY (or use --dry-run).');
  }

  let total = 0;
  for (const file of await listJson(CONTENT)) {
    const json = JSON.parse(await readFile(file, 'utf8'));
    const fields = [];
    collect(json, from, to, args.overwrite, fields);
    if (fields.length === 0) continue;
    total += fields.length;
    const rel = path.relative(ROOT, file);

    if (args.dryRun) {
      console.log(`${rel}: ${fields.length} field(s)`);
      continue;
    }

    for (let i = 0; i < fields.length; i += 40) {
      const batch = fields.slice(i, i + 40);
      const input = batch.map((f) => protect(f[from], provider));
      const output =
        provider === 'deepl'
          ? await translateDeepl(input, from, to, key)
          : await translateGoogle(input, from, to, key);
      batch.forEach((f, j) => {
        f[to] = restore(output[j], provider);
      });
    }
    await writeFile(file, `${JSON.stringify(json, null, 2)}\n`);
    console.log(`${rel}: translated ${fields.length} field(s)`);
  }

  console.log(`${args.dryRun ? 'Would translate' : 'Translated'} ${total} field(s) from "${from}" to "${to}".`);
  if (!languages.languages.some((l) => l.code === to)) {
    console.log(`Add "${to}" to src/content/languages.json to show it in the language switcher.`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

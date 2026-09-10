// Title and meta-description builders.
//
// Google truncates titles past roughly 60 characters and descriptions past
// roughly 160. Before this existed, product titles were built as
// `name | price | The Buggies Express` and descriptions pasted the whole of
// key_specs in, so 52 of 61 product titles and every product description
// overflowed and were cut off in results.
//
// These helpers assemble from the longest option that still fits rather than
// truncating with an ellipsis, so nothing ever renders mid-word.

export const TITLE_MAX = 60;
export const DESC_MIN = 120;
export const DESC_MAX = 158;

const BRAND_SUFFIXES = [' | The Buggies Express', ' | Buggies Express', ''];

/**
 * Appends the longest brand suffix that keeps the title within TITLE_MAX.
 * A name long enough to leave no room simply stands on its own - the model
 * name matters more in a result listing than the brand tail does.
 */
export function buildTitle(name: string, max: number = TITLE_MAX): string {
  for (const suffix of BRAND_SUFFIXES) {
    if (name.length + suffix.length <= max) return name + suffix;
  }
  return name;
}

/**
 * Shortens text to fit a meta description without cutting mid-word.
 *
 * The blog previously did `excerpt.slice(0, 152) + '...'`, which left 18 of
 * 26 descriptions ending on a fragment like "windscreen protect...". This
 * prefers the last complete sentence, and falls back to the last whole word.
 */
export function clampDescription(text: string, max: number = DESC_MAX, min: number = DESC_MIN): string {
  if (text.length <= max) return text;

  const cut = text.slice(0, max);

  // A clean sentence end is best, but only if enough text survives.
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (lastStop + 1 >= min) return cut.slice(0, lastStop + 1);

  // Otherwise end on a whole word, dropping any dangling punctuation.
  const lastSpace = cut.lastIndexOf(' ');
  const body = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–—]+$/, '');
  return body + '…';
}

/**
 * Builds a description by adding whole clauses while they fit, so the result
 * always ends on a complete sentence. `specs` is trimmed on its own comma
 * boundaries rather than mid-item.
 */
export function buildDescription(
  core: string,
  specs: string,
  clauses: string[],
  max: number = DESC_MAX
): string {
  let out = core.trim();

  if (specs) {
    const items = specs.split(',').map((s) => s.trim()).filter(Boolean);
    let kept = '';
    for (const item of items) {
      const next = kept ? kept + ', ' + item : item;
      if ((out + ' ' + next + '.').length <= max) kept = next;
      else break;
    }
    if (kept) out += ' ' + kept + '.';
  }

  for (const clause of clauses) {
    const c = ' ' + clause.trim();
    if ((out + c).length <= max) out += c;
  }

  return out;
}

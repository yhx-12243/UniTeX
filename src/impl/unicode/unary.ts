
import type { Unary, UnaryOptional } from '../../macro-types.ts';
import { type char } from '../../parsec/string-iterator.ts';

import Proper from './proper.ts';
import Unicode from './unicode-table.ts';

const unchecked_accents = (unicode: char) => (x: char) => `${x}${unicode}`;

// oxlint-disable-next-line no-unused-vars
const unicode_convert = (codepoint: string): string => {
  const head = codepoint.charAt(0);
  const base = head == `"` ? 16 : head == `'` ? 8 : 10;
  const code = base == 10 ? codepoint : codepoint.substring(1); 
  return String.fromCodePoint(parseInt(code, base));
};

const Unary: Unary = {
  id: x => x,
  text: x => x,
  mathrm: x => x, 

  sqrt: x => '√' + Proper.paren(x),
  cbrt: x => '∛' + Proper.paren(x), // original
  furt: x => '∜' + Proper.paren(x), // original

  grave: unchecked_accents('\u0300'),
  '`': unchecked_accents('\u0300'),

  acute: unchecked_accents('\u0301'), 
  '\'': unchecked_accents('\u0301'),

  hat: unchecked_accents('\u0302'),
  '^': unchecked_accents('\u0302'),

  tilde: unchecked_accents('\u0303'),
  '~': unchecked_accents('\u0303'),

  bar: unchecked_accents('\u0304'),
  '=': unchecked_accents('\u0304'),

  overline: x => x + (Unicode.isLetterOrGreek(x) ? '\u0305' : '-underline'),
  breve: x => x + (Unicode.isLetterOrGreek(x) ? '\u0306' : '-breve'),
  u: unchecked_accents('\u0306'),

  dot: unchecked_accents('\u0307'),
  '.': unchecked_accents('\u0307'),

  ddot: unchecked_accents('\u0308'),
  '"': unchecked_accents('\u0308'),

  ovhook: unchecked_accents('\u0309'),

  ocirc: unchecked_accents('\u030A'),
  r: unchecked_accents('\u030A'),

  H: unchecked_accents('\u030B'),

  check: unchecked_accents('\u030C'),
  v: unchecked_accents('\u030C'),

  candra: unchecked_accents('\u0310'),
  oturnedcomma: unchecked_accents('\u0312'),
  ocommatopright: unchecked_accents('\u0315'),
  droang: unchecked_accents('\u031A'),

  utilde: unchecked_accents('\u0330'),
  mathunderbar: unchecked_accents('\u0332'),

  not: unchecked_accents('\u0338'),

  underleftrightarrow: unchecked_accents('\u034D'),

  leftharpoonaccent: unchecked_accents('\u20D0'),
  rightharpoonaccent: unchecked_accents('\u20D1'),
  vertoverlay: unchecked_accents('\u20D2'),
  overleftarrow: unchecked_accents('\u20D6'),
  overrightarrow: unchecked_accents('\u20D7'),
  vec: unchecked_accents('\u20D7'),
  dddot: unchecked_accents('\u20DB'),
  ddddot: unchecked_accents('\u20DC'),
  overleftrightarrow: unchecked_accents('\u20E1'),
  annuity: unchecked_accents('\u20E7'),
  threeunderdot: unchecked_accents('\u20E8'),
  widebridgeabove: unchecked_accents('\u20E9'),
  underrightharpoondown: unchecked_accents('\u20EC'),
  underleftharpoondown: unchecked_accents('\u20ED'),
  underleftarrow: unchecked_accents('\u20EE'),
  underrightarrow: unchecked_accents('\u20EF'),
  asteraccent: unchecked_accents('\u20F0'),

  kern: x => x.endsWith('em') ? ' '.repeat(+ x.substring(0, x.length - 2)) : ' ',
};
export default Unary;

const UnaryOptional: UnaryOptional = {
  sqrt: (n: string, x: string) => {
    switch (n) {
      case "2": return Unary.sqrt(x);
      case "3": return Unary.cbrt(x);
      case "4": return Unary.furt(x);
      default: return Unicode.suprender(n) + Unary.sqrt(x);
    }
  },
};

for (const key of ["mkern", "mskip", "hskip", "hspace"]) {
  Unary[key] = Unary.kern;
}

Unicode.typefaceNames.forEach(x => Unary[x] = s => Unicode.render_if_exists(s, x));

/* just for typeface: Parser */
const UnaryTypefaceNames = ['text', 'mathrm', ...Unicode.typefaceNames];
export { UnaryTypefaceNames };

export { UnaryOptional };

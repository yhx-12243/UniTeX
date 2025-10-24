
import { type char } from '../../parsec/string-iterator.ts';

import Proper from './proper.ts';
import "../../parsec/declare-global.ts";

type SMap = { [key: string]: string };

type Typeface = {
  mathbf: SMap;
  mathit: SMap;
  mathsf: SMap;
  mathscr: SMap;
  mathcal: SMap;
  mathfrak: SMap;
  mathbb: SMap;
  mathtt: SMap;
};

const Unicode = {
  typeface: {} as Typeface,

  isLetterOrGreek: (s: string) => s.boundedIn('a', 'z') || s.boundedIn('A', 'Z') || s.boundedIn('α', '϶') || s.boundedIn('Α', 'Ω'),

  /**
   * @returns string from code point `a` to `b`
   */
  series: (a: char, b: char) => {
    let [start, end] = [a.codePointAt(0)!, b.codePointAt(0)!];
    let length = end - start + 1;
    let codes = Array.from({ length: length }, (_, x) => x + start);
    return String.fromCodePoint(...codes);
  },

  make_smap: (from: string[], to: string[]) => {
    let map: SMap = Object.create(null);
    from.forEach((x: string, i: number) => map[x] = to[i]);
    return map;
  },

  merge_smap: (...smaps: SMap[]) => Object.assign(Object.create(null), ...smaps),

  alphabets: (...table: string[]) => Unicode.make_smap(Unicode["letterArray"], table),

  apply_smap: (s: string, smap: SMap) => Array.from(s).map(x => smap[x] || x).join(''),

  block: (a: char, b: char, names: string[]) => {
    let map = new Object();
    let data = Unicode.series(a, b);
    names.forEach((name, i) => name && (map[name] = data[i]));
    return map;
  },

  /**
   * Renders the given string if it exists, using the specified unicode typeface.
   *
   * @param {string} s - The string to render.
   * @param {string} name - The name of the Unicode typeface to use.
   * @return {string} - The rendered string.
   */
  render_if_exists: (s: string, name: string) => Unicode.apply_smap(s, Unicode.typeface[name]),

  /**
   * Checks if all characters in the given string are present in the charset object.
   *
   * @param {object} charset - The charset object containing the characters to check against.
   * @param {string} str - The string to be checked.
   * @param {function} otherwise - The callback function to be called if the characters are not present.
   * @return {string} Returns if all characters are present or the result of the otherwise callback.
   */
  render_if_forall: (
    charset: SMap,
    str: string,
    otherwise: (s: string) => string = x => x
  ): string => {
    const array = Array.from(str);
    let through = true;

    for (const element of array)
      through &&= !!charset[element];

    return through
      ? array.map(x => charset[x]).join('')
      : otherwise(str)
  },

  recover_placeholders: (s: string) => Unicode.apply_smap(s, recover),

  typefaceNames: [] as string[],

  suprender: (s: string) => Unicode.render_if_forall(Unicode["supscripts"], s, x => '^' + Proper.brace(x)),
  subrender: (s: string) => Unicode.render_if_forall(Unicode["subscripts"], s, x => '_' + Proper.brace(x)),

  supscripts: {} as SMap,
  subscripts: {} as SMap,

  greeks: {} as SMap,
};

Unicode["letterUppers"] = Unicode.series('A', 'Z');
Unicode["letterLowers"] = Unicode.series('a', 'z');
Unicode["letters"] = Unicode["letterUppers"] + Unicode["letterLowers"];
Unicode["letterArray"] = Array.from(Unicode["letters"]);

Unicode["greekUppers"] = Unicode.series('Α', 'Ρ') + Unicode.series('Σ', 'Ω');
Unicode["greekLowers"] = Unicode.series('α', 'ρ') + Unicode.series('σ', 'ω');
Unicode["greeks"] = Unicode["greekUppers"] + Unicode["greekLowers"];
Unicode["greekArray"] = Array.from(Unicode["greeks"]);

Unicode["digits"] = Unicode.series('0', '9');
Unicode["digitArray"] = Array.from(Unicode["digits"]);

// typeface (Mathematical Alphanumeric Symbols)
const series = Unicode.series;
const make_smap = Unicode.make_smap;
const merge_smap = Unicode.merge_smap;
const alphabets = Unicode.alphabets;

const typeface = function (name: string, alphabet: SMap) {
  Unicode.typeface[name] = alphabet;
}

const mathbf = [...series('𝐀', '𝐳')];
const mathit = [...series('𝐴', '𝑔'), 'ℎ', ...series('𝑖', '𝑧')];
const mathbfit = [...series('𝑨', '𝒛')];
const mathscr = [...'𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'];
const mathbfscr = [...series('𝓐', '𝔃')];
const mathfrak = [...'𝔄𝔅ℭ𝔇𝔈𝔉𝔊𝔉𝔊𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ', ...series('𝔞', '𝔷')];
const mathbb = [...'𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ', ...series('𝕒', '𝕫')];
const mathbffrak = [...series('𝕬', '𝖟')];
const mathsf = [...series('𝖠', '𝗓')];
const mathbfsf = [...series('𝗔', '𝘇')];
const mathitsf = [...series('𝘈', '𝘻')];
const mathbfitsf = [...series('𝘼', '𝙯')];
const mathtt = [...series('𝙰', '𝚣')];

const mathbf_greek = [...series('𝚨', '𝚸'), ...series('𝚺', '𝛀'), ...series('𝛂', '𝛒'), ...series('𝛔', '𝛚')];
const mathit_greek = [...series('𝛢', '𝛲'), ...series('𝛴', '𝛺'), ...series('𝛼', '𝜌'), ...series('𝜎', '𝜔')];
const mathbfit_greek = [...series('𝜜', '𝜬'), ...series('𝜮', '𝜴'), ...series('𝜶', '𝝆'), ...series('𝝈', '𝝎')];
const mathsf_greek_placeholder = [...series('\u{f0000}', '\u{f002f}')];
const mathbfsf_greek = [...series('𝝖', '𝝦'), ...series('𝝨', '𝝮'), ...series('𝝰', '𝞀'), ...series('𝞂', '𝞈')];
const mathitsf_greek_placeholder = [...series('\u{f0030}', '\u{f005f}')];
const mathbfitsf_greek = [...series('𝞐', '𝞠'), ...series('𝞢', '𝞨'), ...series('𝞪', '𝞺'), ...series('𝞼', '𝟂')];

const mathbf_digit = [...series('𝟎', '𝟗')];
const mathbb_digit = [...series('𝟘', '𝟡')];
const mathsf_digit = [...series('𝟢', '𝟫')];
const mathbfsf_digit = [...series('𝟬', '𝟵')];
const mathtt_digit = [...series('𝟶', '𝟿')];

const misc = [...'ϴ∇ς∂ϵϑϰϕϱϖ'];
const mathbf_misc = [...'𝚹𝛁𝛓', ...series('𝛛', '𝛡')];
const mathit_misc = [...'𝛳𝛻𝜍', ...series('𝜕', '𝜛')];
const mathsf_misc_placeholder = [...series('\u{f0060}', '\u{f0069}')];
const mathbfit_misc = [...'𝜭𝜵𝝇', ...series('𝝏', '𝝕')];
const mathbfsf_misc = [...'𝝧𝝯𝞁', ...series('𝞉', '𝞏')];
const mathitsf_misc_placeholder = [...series('\u{f006a}', '\u{f0073}')];
const mathbfitsf_misc = [...'𝞡𝞩𝞻', ...series('𝟃', '𝟉')];

typeface('mathbb', merge_smap(
  alphabets(...mathbb),

  make_smap(Unicode["digitArray"], mathbb_digit),
  make_smap([...'πγΓΠ∑𝐷𝑑𝑒𝑖𝑗'], [...'ℼℽℾℿ⅀ⅅⅆⅇⅈⅉ']),
));
typeface('mathfrak', merge_smap(
  alphabets(...mathfrak),
  make_smap(mathbf, mathbffrak),
));
typeface('mathscr', merge_smap(
  alphabets(...mathscr),
  make_smap(mathbf, mathbfscr),
));
typeface('mathcal', Unicode.typeface["mathscr"]); // remark
typeface('mathbf', merge_smap(
  alphabets(...mathbf),
  make_smap(mathit, mathbfit),
  make_smap(mathscr, mathbfscr),
  make_smap(mathfrak, mathbffrak),
  make_smap(mathsf, mathbfsf),
  make_smap(mathitsf, mathbfitsf),

  make_smap(Unicode["greekArray"], mathbf_greek),
  make_smap(mathit_greek, mathbfit_greek),
  make_smap(mathsf_greek_placeholder, mathbfsf_greek),
  make_smap(mathitsf_greek_placeholder, mathbfitsf_greek),

  make_smap(Unicode["digitArray"], mathbf_digit),
  make_smap(mathsf_digit, mathbfsf_digit),

  make_smap(misc, mathbf_misc),
  make_smap(mathit_misc, mathbfit_misc),
  make_smap(mathsf_misc_placeholder, mathbfsf_misc),
  make_smap(mathitsf_misc_placeholder, mathbfitsf_misc),
  make_smap(['Ϝ', 'ϝ'], ['𝟊', '𝟋'])
));
typeface('mathit', merge_smap(
  alphabets(...mathit),
  make_smap(mathbf, mathbfit),
  make_smap(mathsf, mathitsf),
  make_smap(mathbfsf, mathbfitsf),

  make_smap(Unicode["greekArray"], mathit_greek),
  make_smap(mathbf_greek, mathbfit_greek),
  make_smap(mathsf_greek_placeholder, mathitsf_greek_placeholder),
  make_smap(mathbfsf_greek, mathbfitsf_greek),

  make_smap(misc, mathit_misc),
  make_smap(mathbf_misc, mathbfit_misc),
  make_smap(mathsf_misc_placeholder, mathitsf_misc_placeholder),
  make_smap(mathbfsf_misc, mathbfitsf_misc),
  make_smap([...'ħıȷ𝔻𝕕𝕖𝕚𝕛'], [...'ℏ𝚤𝚥ⅅⅆⅇⅈⅉ'])
));
typeface('mathsf', merge_smap(
  alphabets(...mathsf),
  make_smap(mathbf, mathbfsf),
  make_smap(mathit, mathitsf),
  make_smap(mathbfit, mathbfitsf),

  make_smap(Unicode["greekArray"], mathsf_greek_placeholder),
  make_smap(mathbf_greek, mathbfsf_greek),
  make_smap(mathit_greek, mathitsf_greek_placeholder),
  make_smap(mathbfit_greek, mathbfitsf_greek),

  make_smap(Unicode["digitArray"], mathsf_digit),
  make_smap(mathbf_digit, mathbfsf_digit),

  make_smap(misc, mathsf_misc_placeholder),
  make_smap(mathbf_misc, mathbfsf_misc),
  make_smap(mathit_misc, mathitsf_misc_placeholder),
  make_smap(mathbfit_misc, mathbfitsf_misc),
));
typeface('mathtt', merge_smap(
  alphabets(...mathtt),

  make_smap(Unicode["digitArray"], mathtt_digit),
));

typeface('textbf', Unicode.typeface.mathbf);
typeface('textit', Unicode.typeface.mathit);
typeface('textsf', Unicode.typeface.mathsf);
typeface('texttt', Unicode.typeface.mathtt);

typeface('textscr', Unicode.typeface.mathscr); // original
typeface('textcal', Unicode.typeface.mathcal); // original

typeface('sf', Unicode.typeface.mathsf);
typeface('bf', Unicode.typeface.mathbf);
typeface('bold', Unicode.typeface.mathbf);

typeface('boldsymbol', Unicode.typeface.mathbf);
typeface('bm', Unicode.typeface.mathbf);

typeface('tt', Unicode.typeface.mathtt);
typeface('it', Unicode.typeface.mathit);

typeface('frak', Unicode.typeface.mathfrak);
typeface('cal', Unicode.typeface.mathcal);

typeface('Bbb', Unicode.typeface.mathbb);
// typeface('text', alphabets(...series('A', 'Z'), ...series('a', 'z')));

const recover = merge_smap(
  make_smap(mathsf_greek_placeholder, Unicode["greekArray"]),
  make_smap(mathitsf_greek_placeholder, mathit_greek),
  make_smap(mathsf_misc_placeholder, misc),
  make_smap(mathitsf_misc_placeholder, mathit_misc),
);

Unicode.typefaceNames = Object.keys(Unicode.typeface);

// supscript & subscript

Object.assign(Unicode.supscripts, {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³', // u00b3
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',

  'a': 'ᵃ',
  'b': 'ᵇ',
  'c': 'ᶜ',
  'd': 'ᵈ',
  'e': 'ᵉ',
  'f': 'ᶠ',
  'g': 'ᵍ',
  'h': 'ʰ',
  // 'i': '^i',
  'j': 'ʲ',
  'k': 'ᵏ',
  'l': 'ˡ',
  'm': 'ᵐ',
  'n': 'ⁿ', // u207f
  'o': 'ᵒ',
  'p': 'ᵖ',
  'r': 'ʳ',
  's': 'ˢ',
  't': 'ᵗ',
  'u': 'ᵘ',
  'v': 'ᵛ',
  'w': 'ʷ',
  'x': 'ˣ', // u02e3
  'y': 'ʸ',
  'z': 'ᶻ',

  '+': '⁺',
  '-': '⁻',
  '=': '⁼',
  '(': '⁽',
  ')': '⁾',

  // Unicode: Phonetic Extensions
  'A': 'ᴬ',
  'Æ': 'ᴭ',
  'B': 'ᴮ',
  'ᴃ': 'ᴯ',
  'D': 'ᴰ',
  'E': 'ᴱ',
  'Ǝ': 'ᴲ',
  'G': 'ᴳ',
  'H': 'ᴴ',
  'I': 'ᴵ',
  'J': 'ᴶ',
  'K': 'ᴷ',
  'L': 'ᴸ',
  'M': 'ᴹ',
  'N': 'ᴺ',
  'ᴎ': 'ᴻ',
  'α': 'ᵅ',
  '′': '′',
});


// subscripts

Object.assign(Unicode.subscripts, {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',

  'a': 'ₐ',
  'e': 'ₑ',
  'h': 'ₕ',
  'i': 'ᵢ', // u1d62
  'j': 'ⱼ',
  'k': 'ₖ',
  'l': 'ₗ',
  'm': 'ₘ',
  'n': 'ₙ',
  'o': 'ₒ',
  'p': 'ₚ', // u209a
  'r': 'ᵣ',
  's': 'ₛ',
  't': 'ₜ',
  'u': 'ᵤ',
  'v': 'ᵥ',
  'x': 'ₓ',

  '+': '₊',
  '-': '₋',
  '=': '₌',
  '(': '₍',
  ')': '₎',
});

export default Unicode;


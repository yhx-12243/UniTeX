
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
  texttt: SMap;
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

  alphabets: (...table: string[]) => {
    let map: SMap = Object.create(null);
    Unicode["letterArray"].forEach((x: string, i: number) => map[x] = table[i]);
    return map;
  },

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
  render_if_exists: (s: string, name: string): string =>
    Array.from(s).map(x => Unicode.typeface[name][x] || x).join(''),

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

Unicode["greekUppers"] = Unicode.series('Α', 'Ρ') + Unicode.series('Σ', 'Ω')
Unicode["greekLowers"] = Unicode.series('α', 'ρ') + Unicode.series('σ', 'ω')
Unicode["greeks"] = Unicode["greekUppers"] + Unicode["greekLowers"];


// typeface (Mathematical Alphanumeric Symbols)
const series = Unicode.series;
const alphabets = Unicode.alphabets;

const typeface = function (name: string, alphabet: SMap) {
  Unicode.typeface[name] = alphabet;
}

typeface('mathbb', alphabets(...'𝔸𝔹ℂ', ...series('𝔻', '𝔾'),
  'ℍ', ...series('𝕀', '𝕄'), ...'ℕ𝕆ℙℚℝ', ...series('𝕊', '𝕐'),
  'ℤ', ...series('𝕒', '𝕫'))
)
typeface('mathfrak', alphabets(...series('𝕬', '𝖟')))
typeface('mathscr', alphabets(...'𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ', ...series('𝒩', '𝒬'),
  'ℛ', ...series('𝒮', '𝒹'), 'ℯ', '𝒻', 'ℊ', ...series('𝒽', '𝓃'),
  'ℴ', ...series('𝓅', '𝓏'))
)
typeface('mathcal', Unicode.typeface["mathscr"]); // remark
typeface('mathbf', alphabets(...series('𝐀', '𝐳')));
typeface('mathit', alphabets(...series('𝐴', '𝑔'), 'h', ...series('𝑖', '𝑧')));
typeface('mathsf', alphabets(...series('𝖠', '𝗓')));

typeface('textbf', Unicode.typeface.mathbf);
typeface('textit', Unicode.typeface.mathit);
typeface('textsf', Unicode.typeface.mathsf);
typeface('texttt', alphabets(...series('𝙰', '𝚣')));

typeface('textscr', Unicode.typeface.mathscr); // original
typeface('textcal', Unicode.typeface.mathcal); // original

typeface('sf', Unicode.typeface.mathsf);
typeface('bf', Unicode.typeface.mathbf);
typeface('bold', Unicode.typeface.mathbf);

typeface('boldsymbol', Unicode.typeface.mathbf);
typeface('bm', Unicode.typeface.mathbf);

typeface('tt', Unicode.typeface.texttt);
typeface('it', Unicode.typeface.mathit);

typeface('frak', Unicode.typeface.mathfrak);
typeface('cal', Unicode.typeface.mathcal);

typeface('Bbb', Unicode.typeface.mathbb);
// typeface('text', alphabets(...series('A', 'Z'), ...series('a', 'z')));

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


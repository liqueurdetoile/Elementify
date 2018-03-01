/**
*  @file Hashing text utility function
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

/**
*  This function takes a string as argument
*  and returns its hash.
*
*  Probavility of collision is rather high
*
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*  @param {string} text Text to process
*  @returns {string} Hash
*/
export default function (text) {
  const verb = 'abcdefghijkl';
  var hash = 0, i, chr, ret;

  if (!text) return hash;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }

  ret = verb.charAt(10); // Convert the integer into string
  if (hash < 0) ret = verb.charAt(11);
  hash = Math.abs(hash);
  while (hash) {
    i = hash % 10;
    hash = (hash - i) / 10;
    ret += verb.charAt(i);
  }

  return ret;
}

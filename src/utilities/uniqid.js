/**
*  @file Hashing text utility function
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

/**
*  This function returns a unique identifier
*
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*  @param {string} [prefix] Prefix to prepend
*  @param {boolean} [moreEntropy] Add more entropy to generator (slower)
*  @see http://locutus.io/php/uniqid/
*  @returns {string} Hash
*/

export default function (prefix, moreEntropy) {
  var retId;
  var _formatSeed = function (seed, reqWidth) {
    seed = parseInt(seed, 10).toString(16); // to hex str
    if (reqWidth < seed.length) {
      // so long we split
      return seed.slice(seed.length - reqWidth);
    }
    if (reqWidth > seed.length) {
      // so short we pad
      return Array(1 + (reqWidth - seed.length)).join('0') + seed;
    }
    return seed;
  };
  var $global = (typeof window !== 'undefined' ? window : global);
  var $locutus = $global.$locutus || {};

  $locutus.php = $locutus.php || {};

  if (typeof prefix === 'undefined') {
    prefix = '';
  }

  if (!$locutus.php.uniqidSeed) {
    // init seed with big random int
    $locutus.php.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
  }
  $locutus.php.uniqidSeed++;
  // start with prefix, add current milliseconds hex string
  retId = prefix;
  retId += _formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
  // add seed hex string
  retId += _formatSeed($locutus.php.uniqidSeed, 5);
  if (moreEntropy) {
    // for more entropy we add a float lower to 10
    retId += (Math.random() * 10).toFixed(8).toString();
  }
  return retId;
}

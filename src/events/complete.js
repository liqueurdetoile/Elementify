/**
*  @file Complete event for elementify
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

/**
*  Returns a promise fullfilled when document is at complete state
*  meaning all assets have been loaded
*
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*  @returns {Promise}
*  @example
*  complete().then(function() { console.log('Assets loaded !') });
*/
export default function complete() {
  return new Promise((resolve, reject) => {
    if (document.readyState === 'complete') resolve(true);
    else {
      document.onreadystatechange = () => {
        if (document.readyState === 'complete') resolve(true);
      };
    }
  });
}

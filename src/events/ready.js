/**
*  @file Ready event for elementify
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

/**
*  Returns a promise fullfilled when document is at interactive state
*  meaning DOM is safe to manipulate
*
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*  @returns {Promise}
*  @example
*  ready().then(function() { console.log('Can manipulate DOM!') });
*/
export default function ready() {
  return new Promise((resolve, reject) => {
    if (document.readyState === 'interactive' || document.readyState === 'complete') resolve(true);
    else {
      document.onreadystatechange = () => {
        if (document.readyState === 'interactive') resolve(true);
      };
    }
  });
}

/**
*  @file Document ready event
*/

export default function (callback) {
  if (document.readyState === 'complete') callback();
  else {
    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'complete') callback();
    });
  }
}

/**
*  @file Window load event
*/

export default function (callback) {
  if (document.readyState === 'complete') callback();
  else window.onload = callback;
}

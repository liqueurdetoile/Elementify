/**
*  @file Document ready event
*/

export default function (callback) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') callback();
  else document.onreadystatechange = callback;
}

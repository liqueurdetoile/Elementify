/**
*  @file Document ready event
*/

export default function () {
  return new Promise((resolve, reject) => {
    if (document.readyState === 'interactive' || document.readyState === 'complete') resolve(true);
    else document.onreadystatechange = () => { resolve(true); };
  });
}

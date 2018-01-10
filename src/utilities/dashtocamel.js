/**
*  @see https://gist.github.com/jpetitcolas/4481778
*/

export default function (text) {
  return text.replace(/-([a-zA-Z])/g, (g) => g[1].toUpperCase());
}

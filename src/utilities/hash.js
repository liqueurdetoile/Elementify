export default function (text) {
  const verb = 'abcdefghijkl';
  var hash = 0, i, chr, ret;

  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }

  ret = verb.charAt(10); // Convert the integer into string
  if (hash < 0) ret = ret = verb.charAt(11);
  hash = Math.abs(hash);
  while (hash) {
    i = hash % 10;
    hash = (hash - i) / 10;
    ret += verb.charAt(i);
  }

  return ret;
}

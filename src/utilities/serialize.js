import foreach from 'lib/utilities/foreach';

export default function (t) {
  var ret = '';

  foreach(t, function (key, value) {
    if (ret !== '') ret += '&';
    ret += key + '=' + encodeURIComponent(value);
  });
  return ret;
}

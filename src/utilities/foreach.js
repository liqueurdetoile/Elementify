/**
*  @file Foreach like
*/

export default function (obj, callback) {
  if (obj instanceof Array) {
    for (let i = 0; i < obj.length; i++) callback(i, obj[i]);
  } else if (obj instanceof Object) {
    for (let key in obj) callback(key, obj[key]);
  }
}

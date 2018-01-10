/**
*  @file Ajax digest authentification
*/

import md5 from 'js-md5';

function xhr() {
  var x;

  if (window.XMLHttpRequest) {
    x = new window.XMLHttpRequest();
  } else if (window.ActiveXObject) {
    x = new window.ActiveXObject('Microsoft.XMLHTTP');
  }

  return x;
}

function cnonce() {
  const characters = 'abcdef0123456789';
  var token = '';

  for (let i = 0; i < 16; i++) {token += characters.substr(Math.round(Math.random() * characters.length), 1);}

  return token;
}

function response(username, password, parts) {
  let hash1 = md5(username + ':' + parts.realm + ':' + password);
  let hash2 = md5(parts.method + ':' + parts.url);

  return md5(hash1 + ':' + parts.nonce + ':' + parts.nc + ':' + parts.cnonce + ':' + parts.qop + ':' + hash2);
}

export default function (username, password, options) {

  options.method = options.method || 'POST';

  return new Promise((resolve, reject) => {
    var nc = 1;

    // First request to fetch digest header or get plain request
    new Promise((resolve, reject) => {
      const xhr1 = xhr();

      xhr1.open(options.method, options.url, true);
      xhr1.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      if (options.headers) {for (let key in options.headers) xhr1.setRequestHeader(key, options.headers[key]);}
      if (options.mimeType) xhr1.overrideMimeType(options.mimeType);
      if (options.responseType) xhr1.responseType = options.responseType;

      xhr1.onreadystatechange = function () {
        var ret;

        if (this.readyState === 2) {if (xhr1.status === 401) resolve(xhr1.getAllResponseHeaders());}
        if (this.readyState === 4) {
          if (xhr1.status >= 200 && xhr1.status < 400) {
            if (xhr1.responseText !== 'undefined' && xhr1.responseText.length > 0) {
              try {
                ret = JSON.parse(xhr1.responseText);
                resolve(ret);
              } catch (e) {
                resolve(ret);
              }
            } else resolve();
          } else reject(xhr1.status);
        }
      };

      xhr1.send(options.data);
    })
      .then(headers => {
        // Extract components from headers;
        const xhr2 = xhr();
        var scheme, auth, part, parts = {};
        var header;

        if (typeof headers.success !== 'undefined') resolve(headers); // No auth api access return

        nc++; // Increment nounce count

        auth = headers.match(/www-authenticate.+/im);

        if (auth === null) reject(500);

        scheme = 'Digest';

        let re = /([a-z]+)=['"](\w*)/g;

        while ((part = re.exec(auth[0])) !== null) {
          parts[part[1]] = part[2];
        }
        parts.cnonce = cnonce();
        parts.method = options.method;
        parts.nc = ('00000000' + nc).slice(-8);
        parts.url = options.url;

        header = scheme + ' ' +
                 'username="' + username + '", ' +
                 'realm="' + parts.realm + '", ' +
                 'nonce="' + parts.nonce + '", ' +
                 'uri="' + parts.url + '", ' +
                 'response="' + response(username, password, parts) + '", ' +
                 'opaque="' + parts.opaque + '", ' +
                 'qop=' + parts.qop + ', ' +
                 'nc=' + parts.nc + ', ' +
                 'cnonce="' + parts.cnonce + '"';

        xhr2.open(parts.method, options.url, true);
        xhr2.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr2.setRequestHeader('Authorization', header);

        if (options.headers) {for (let key in options.headers) xhr2.setRequestHeader(key, options.headers[key]);}
        if (options.mimeType) xhr2.overrideMimeType(options.mimeType);
        if (options.responseType) xhr2.responseType = options.responseType;

        xhr2.onload = () => {
          var ret;

          if (xhr2.status >= 200 && xhr2.status < 400) {
            nc++;
            if (xhr2.responseText !== 'undefined' && xhr2.responseText.length > 0) {
              try {
                ret = JSON.parse(xhr2.responseText);
                resolve(ret);
              } catch (e) {
                resolve(ret);
              }
            } else resolve();
          } else reject(xhr2.status);
        };

        xhr2.send(options.data);
      })
      ['catch'](code => { reject(code); });

  });
}

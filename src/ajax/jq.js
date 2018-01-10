/**
 *  @file Liqueur de Toile Jquery-like ajax request module
 *  @author Liqueur de Toile (https://liqueurdetoile.com)
 *  @version 1.0.0
 *  @copyright 2017, Liqueur de Toile
 *  @license Apache 2.0
 *
*/

import isset from 'lib/utilities/isset';

export default function (options) {

  return new Promise((resolve, reject) => {

    const method = options.method || 'GET';
    const url = options.url;
    var xhr;

    if (window.XMLHttpRequest) {
      xhr = new window.XMLHttpRequest();
    } else if (window.ActiveXObject) {
      xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
    } else {
      reject('Your browser does not support Ajax. Sadly to say, you cannot use this site');
    }

    xhr.open(method, url, true);

    // Additional parameters
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (options.headers) {for (let key in options.headers) xhr.setRequestHeader(key, options.headers[key]);}
    if (options.mimeType) xhr.overrideMimeType(options.mimeType);
    if (options.responseType) xhr.responseType = options.responseType;

    // Following request results
    xhr.onreadystatechange = function (e) {
      var response, jsonFail;

      if (xhr.readyState === XMLHttpRequest.DONE) {
        response = xhr.response;
        jsonFail = false;

        // Checking response and parsing data
        // Check for JSON valid data and IE fix
        if (xhr.status === 200 && options.responseType === 'json' && !isset(xhr.response)) jsonFail = true;

        // IE Hack
        if ((options.responseType === 'json' || xhr.getResponseHeader('Content-Type') === 'application/json') &&
            xhr.responseType !== 'json' && isset(xhr.responseText)) {
          try {
            response = JSON.parse(xhr.responseText);
          } catch (e) { jsonFail = true; }
        }

        if (xhr.status >= 200 && xhr.status < 400 && !jsonFail) {
          if (isset(options.success)) options.success(response);
          resolve(response);
        }

        // Calling callbacks before reject for digest
        if (options.statusCode) {
          if (options.statusCode[xhr.status]) {
            if (xhr.status >= 200 && xhr.status < 400 && !jsonFail) options.statusCode[xhr.status](response);
            else {
              options.statusCode[xhr.status](xhr,
                jsonFail ? xhr.statusText : 'Unable to parse JSON response from server',
                xhr.status);
            }
          }
        }

        if (xhr.status >= 400) {
          if (isset(options.error)) options.error(xhr, xhr.statusText, xhr.status);
          reject(xhr.status);
        }

        if (jsonFail) {
          if (isset(options.error)) options.error(xhr, 'Unable to parse JSON response from server', xhr.status);
          reject('Unable to parse JSON response from server');
        }

        if (isset(options.complete)) {
          options.complete(xhr,
            jsonFail ? xhr.statusText : 'Unable to parse JSON response from server',
            xhr.status);
        }
      }
    };

    // Running beforeSend callback
    if (options.beforeSend instanceof Function) options.beforeSend(xhr);
    xhr.send(isset(options.data) ? options.data : null);
  });
}

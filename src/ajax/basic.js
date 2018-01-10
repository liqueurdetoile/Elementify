/**
*  @file Ajax basic auth
*/

import ajax from 'lib/ajax/jq';

export default function (username, password, options) {
  const hash = btoa(username + ':' + password);

  options.method = options.method || 'GET';

  options.headers = options.headers || {};
  options.headers['Authorization'] = 'Basic ' + hash;

  return ajax(options);
}

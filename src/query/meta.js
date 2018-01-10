/**
*  @file meta reader snippet
*/

import $ from 'lib/query/q';
import Element from 'lib/elements/element';

export default (name, value = null) => {
  var m = $('*meta[name="' + name + '"]');
  var type;

  if (value === null) {
    if (!m.length) return null;
    if (!m.element.hasAttribute('data-type')) return m.element.content;
    if (m.data('type') === 'array') return JSON.parse(window.atob(m.element.content));
    return m.element.content;
  }

  if (typeof value === 'string') type = 'string';
  else {
    type = 'array';
    value = window.btoa(JSON.stringify(value));
  }

  if (!m.length) {
    $('=head').append(new Element('meta', {
      name: name,
      content: value,
      type: type
    }));
  } else {
    m.element.setAttribute('content', value);
    m.element.setAttribute('type', type);
  }

  return m;

};

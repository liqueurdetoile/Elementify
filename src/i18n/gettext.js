/**
*  I18n Translations Functions
*/

import $ from 'lib/query/q';
import ajax from 'lib/ajax/jq';
import Gettext from 'node-gettext';

const gt = new Gettext();
const attr = ['alt', 'title', 'lang', 'value', 'placeholder'];

export function translate() {
  var q, t;

  // Translate tags
  q = '*translate, [translate]';
  t = $(q);

  if (t.forEach) {
    t.forEach((tag) => {
      tag.element.innerHTML = gt.gettext(tag.element.innerHTML);
    });
  } else if (t.element) t.element.innerHTML = gt.gettext(t.element.innerHTML);

  // Translate attributes
  attr.forEach(a => {
    q = '*[translate-' + a + ']';
    t = $(q);
    if (t.forEach) {
      t.forEach((el) => {
        el.element.setAttribute(a, gt.gettext(el.element.getAttribute(a)));
      });
    } else if (t.element) t.element.setAttribute(a, gt.gettext(t.element.getAttribute(a)));
  });
}

export function setTranslations(systemLocale, translations, domain = 'translations') {
  // gt.on('error', error => console.log(error, gt));
  gt.addTranslations(systemLocale, domain, translations);
  gt.setTextDomain(domain);
  gt.setLocale(systemLocale);
}

export function loadTranslations(url, systemLocale, domain = 'translations') {
  return ajax({url: url}).then((data) => setTranslations(systemLocale, data, domain));
}

export function __(msgid) {
  return gt.gettext(msgid);
}

export function __spf(msgid) {
  var t = gt.gettext(msgid);

  for (let i = 1; i < arguments.length; i++) {
    let offset = t.indexOf('@%');

    switch (t[offset + 2]) {
      case 's' :
        t = t.substr(0, offset) + String(arguments[i]) + t.substr(offset + 3);
        break;
    }
  }

  return t;
}

/**
*  @file Modal UI
*/

import 'editor/ui/confirm.sss';
import $ from 'lib/query/q';
import Element from 'lib/elements/element';
import isset from 'lib/utilities/isset';

export default class Modal {
  constructor(options = {}) {
    this.options = options;

    this.build();
  }

  build() {
    if (isset(this.options.class)) {
      if (this.options.class instanceof Array) this.options.class.push('modal-container');
      else this.options.class += ' modal-container';
    } else this.options.class = 'modal-container';

    const window = new Element('div', {
      class: this.options.class,
      styles: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'none'
      }
    });

    const box = new Element('div', {
      class: 'modal-box',
      styles: {
        width: this.options.width || '',
        height: this.options.height || '',
        display: 'flex',
        'flex-direction': 'column'
      }
    });

    // HEADER
    const header = new Element('div', {
      class: 'modal-header',
      style: 'display:flex; flex-direction: row'
    });

    // Title
    const title = new Element('div', {
      class: 'modal-title',
      style: 'display: inline; flex: auto',
      innerHTML: (this.options.icon || '') + (this.options.title || '')
    });

    header.append(title);
    header.append(new Element('button', {
      class: 'modal-close',
      style: 'float:right',
      innerHTML: this.options.close || '',
      events: {
        click: this.close.bind(this)
      }
    }));

    const body = new Element('div', {
      class: 'modal-body',
      style: 'overflow: auto; flex: 2; height: 95%'
    });

    box.append(header).append(body);
    window.append(box);
    $('=body').append(window);
    this.window = window;
    this.box = box;
    this.title = title;
    this.body = body;
    this.window.node.style.opacity = 0;
  }

  show() {
    this.window.fadeIn().node.style.display = 'flex';
    this.window.element.style.zIndex = 1000;
    return this;
  }

  hide(callback = null) {
    this.window.fadeOut({
      complete: callback
    });
    return this;
  }

  unset() {
    this.window.remove();
  }

  close() {
    this.hide(this.unset.bind(this));
  }
}

/**
*  @file Notices module
*/

import 'lib/ui/notices.sss';
import $ from 'lib/query/q';
import Element from 'lib/elements/element';
import isset from 'lib/utilities/isset';
import uniqid from 'lib/utilities/uniqid';

/**
*  Class Notice
*  Builds and display a notice to the user. It could be set to be modal or not
*
*
*  @param {Object}    options           Options for the notice
*  @param {String}    options.type      Type of the notice
*  @param {Integer}   options.duration  Display duration (in ms). Set this to 0 for no timeout.
*  @param {Boolean}   options.modal     Set the modal display
*  @param {Boolean}   options.prompt    Display automatically the notice
*  @param {String}    options.before    Content displayed before message
*  @param {String}    options.after     Content displayed after message
*  @param {String}    options.fadeIn    Options for the fadeIn method
*  @param {String}    options.fadeOut   Options for the fadeOut method
*
*  @param {$type} htmlOptions Options for the underlying HtmlElement object
*  @returns {Notice} Return an object of class Notice
*/
export default class Notice {
  constructor(options = {}, htmlOptions = {}) {
    options.type = options.type || 'info';
    options.duration = isset(options.duration) ? options.duration : 2000;
    this.options = options;
    this.id = htmlOptions.id = uniqid();

    this.notice = new Element('div', htmlOptions);

    let content = '';

    if (isset(this.options.before)) content += '<div class="mlw-notice-before">' + this.options.before + '</div>';
    if (isset(this.options.message)) content += '<div class="mlw-notice-message">' + this.options.message + '</div>';
    if (isset(this.options.after)) content += '<div class="mlw-notice-after">' + this.options.after + '</div>';

    this.notice.element.innerHTML = content;
    this.notice.addClass(options.type).addClass('mlw-notice');
    if (this.options.modal) this.notice.addClass('mlw-notice-modal');

    this.container = $('#mlw-notices');

    if (!(this.container.length)) {
      this.container = new Element('<div id="mlw-notices" class="mlw-notices"></div>');
      this.container.appendTo(document.body);
    }
    this.wrapper = new Element('div');

    this.wrapper.append(this.notice);
    this.container.append(this.wrapper);

    if (options.prompt) this.fadeIn();
  }

  fadeIn() {
    if (this.options.modal) this.container.addClass('screen-lock');
    this.notice.fadeIn(this.options.fadeIn);
    if (this.options.duration) {
      setTimeout(() => this.fadeOut.call(this), this.options.duration);
    }
  }

  fadeOut() {
    const _this = this;

    this.notice.fadeOut(this.options.fadeOut, function () {
      if ($('#' + _this.id).parent) $('#' + _this.id).parent.remove();
      if (!$('.mlw-notice-modal').length) _this.container.removeClass('screen-lock');
    });
  }
}

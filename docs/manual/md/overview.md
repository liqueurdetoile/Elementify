<p align="center"><a href="https://liqueurdetoile.com" target="\_blank"><img src="https://hosting.liqueurdetoile.com/logo_lqdt.png" alt="Liqueur de Toile"></a></p>

# Elementify
Elementify is a vanilla JS library designed to be :
- powerful but still ultra-lightweight (39,2 KB minified and 8,32KB gzipped)
- cross-browser (IE9+)
- focused on DOM manipulation, events management and data validation
- focused on improving and adding functionnalities to vanilla JS, not shimming or replacing it.
- UMD pattern for easy integration

## Features
Elementify is not working by enhancing DOM objects but introduce a kind of new layer with new Objects
that ghosts actual DOM nodes and elements.

For obvious performance constraint, Elementify only create enhanced objects when required.
You can easily pass from one layer to another in order to dig the best of the two worlds.

This table presents the basic functionalities that have been ignored,
ghosted, improved, created and to do between vanilla and elementified layer.

This chart is subject to change at any time.

| Vanilla Object | Elementify Object | Ignored | Ghosted | Improved | created | Todo |
| --- | --- | --- | --- | --- | --- | --- |
| window | WindowElement | Nearly all | - | Events | - | Import metrics |
| Document | DocumentElement | Nearly All | - | Events | - | - |
| HTMLElement | HtmlElement | Nearly none | Nearly all with cross-browser polyfill | Positioning, Events | - |
| HTMLFormElement | FormElement | Nearly all | very few | - | Form validation and data serialize, json, formData exports | - |
| HTMLFormElement Element | InputElement | Nearly all | very few | Value/checked management for radio and checkbox | Validation rules and method | - |

## Usage

### Importing library modules in global scopes
To avoid polluting the global cope namespace, all modules will be accessible under elementify namespace. You can create
global var to hoist any module or mass importing them with `elementify.load()`.

### Create elements
```javascript
/**
*  All following asserts will lead to the same HtmlElement with a node
*  equal to <div class="div1 div2" id="div">DIV</div>
*/
var div = new Element('<div class="div1 div2" id="div">DIV</div>');
var div = new Element('div', {class: ['div1', 'div2'], id:'div', innerHTML: 'DIV'});
var div = new Element('div').addClass('div1 div2').attr('id', 'div').html('DIV');
var div = Q('+div', {class: ['div1', 'div2'], id:'div', innerHTML: 'DIV'});
var div = Q('+div').addClass('div1 div2').attr('id', 'div').html('DIV');
```
All properties setters are chainable for easing creation. The `Q` magic function is quite similar to the famous `$` one. It can query the DOM or create elements.

Both Element and Q will check the input and returns the appropriate Element (windowElement, DocumentElement, HtmlElement, FormElement or InputElement) or a Collection of these.

### Query DOM
```html
<div class="e1" data-rel="f1"></div>
<div class="e2" data-rel="f2"></div>
<div class="e3" data-rel="f3"></div>
```

```javascript
Q('.e1').data('rel') // returns 'f1'
Q('div').attr('class') // returns ['e1', 'e2', 'e3']
Q('[data-rel="f3"').node.className // returns 'e3'
```
The `Q` magic function is used to query the DOM and returned the appropriate Element/Collection.

When a method is called on a Collection, Elementify will try to apply it to each member of the Collection and returns an array of result with the same indexing.

To access the ghosted vanilla element, simply call the `element` or `node` property of the Elementify object.
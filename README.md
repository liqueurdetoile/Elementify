[![NPM](https://nodei.co/npm/elementify.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/elementify/)

[![GitHub release](https://img.shields.io/github/release/liqueurdetoile/elementify.svg)](https://www.npmjs.com/package/elementify)
[![Build Status](https://travis-ci.org/liqueurdetoile/Elementify.svg?branch=master)](https://travis-ci.org/liqueurdetoile/Elementify)
[![Coverage Status](https://coveralls.io/repos/github/liqueurdetoile/Elementify/badge.svg?branch=master)](https://coveralls.io/github/liqueurdetoile/Elementify?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Documentation](https://liqueurdetoile.github.io/Elementify/badge.svg)](https://liqueurdetoile.github.io/Elementify/)

[![bitHound Overall Score](https://www.bithound.io/github/liqueurdetoile/Elementify/badges/score.svg)](https://www.bithound.io/github/liqueurdetoile/Elementify)
[![bitHound Code](https://www.bithound.io/github/liqueurdetoile/Elementify/badges/code.svg)](https://www.bithound.io/github/liqueurdetoile/Elementify)
[![bitHound Dependencies](https://www.bithound.io/github/liqueurdetoile/Elementify/badges/dependencies.svg)](https://www.bithound.io/github/liqueurdetoile/Elementify/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/liqueurdetoile/Elementify/badges/devDependencies.svg)](https://www.bithound.io/github/liqueurdetoile/Elementify/master/dependencies/npm)
[![Known Vulnerabilities](https://snyk.io/test/github/liqueurdetoile/Elementify/badge.svg?targetFile=package.json)](https://snyk.io/test/github/liqueurdetoile/Elementify?targetFile=package.json)

<p align="center"><a href="https://liqueurdetoile.com" target="\_blank"><img src="https://hosting.liqueurdetoile.com/logo_lqdt.png" alt="Liqueur de Toile"></a></p>

# Elementify
Elementify is a vanilla JS library designed to be :
- powerful but still ultra-lightweight (39,2 KB minified and 8,32KB gzipped)
- cross-browser (IE9+)
- focused on DOM manipulation, events management and data validation
- focused on improving and adding functionnalities to vanilla JS, not shimming or replacing it.
- UMD pattern for easy integration

## Why Elementify ?
Oh no, again an other library to manipulate the DOM ! Really ?

Wait ! Elementify main purpose is not to shim the DOM across browsers. Most of the time, you'll have to rely on vanilla things to do your stuff.

You can see Elementify as the missing link between full vanilla JS and Jquery. Jquery or Mootools (or Underscore in its way)
are a **replacement** to browser's vanilla JS, even for things that are really common nowadays. They are **heavy** but complete
libraries.

On the other side, Elementify is a **lightweight** creates an abstraction layer to manage events, manipulate the DOM and validate data with ease. You can switch between
vanilla and elementified layers at will and choose the best - or the only one - layer able to do your stuff.

I follow three main goals when building Elementify :
- Have most of the great functionnalities we beloved on other heavy-weighted library for manipulating the DOM
- Easy event management and easy data validation client-side
- Syntax and lazyness friendly
- Focus to stay lightweight and low-memory. Not the **fastest** but the **smallest**
- Have an UMD compliant library for easing integration in other projects

So that's it. Elementify will simply, well, *elementify* the browser and the DOM.

## Installation
### As a module
```
npm install elementify
```
or
```
yarn add elementify
```
Then simply require/import it :
```javascript
import elementify from 'elementify';
// or for submodule
import {Collection, Element, Q, ready, complete} from 'elementify';
```

### In a browser
#### Bundle
```html
<script type="text/javascript" src="https://bundle.run/elementify@latest"></script>
```
#### JsDelivr
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/elementify@latest"></script>
```
#### Unpkg
```html
<script type="text/javascript" src="https://unpkg.com/elementify@latest"></script>
```
#### Local install
For browser install, you can simply fetch file `dist/objectarray.min.js` in this repo or clone it and load it :
```html
<script type="text/javascript" src="myJsFolder/elementify.min.js"></script>
```

The elementify library will be added to global (window) scope. If you wish to import its exported modules in global scope, simply call
```javascript
elementify.load()
```
It will monkey-patch the native Element class by adding the constructor for elementify objects.

## Usage
We will assume that the exported modules of elementify are in global running scope.
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

## Documentation
A nearly complete API reference is available here : [https://liqueurdetoile.github.io/Elementify](https://liqueurdetoile.github.io/Elementify/).

Wish I could spare some time to write examples and a manual.

## Bugs and features requests
Elementify is test-driven though it did not prevent all issues. Please report here any trouble or features request.

## Want to help ?
There is many more to do to implements othe features. Don't mind fork Elementify, tweak it and submit a pull request.

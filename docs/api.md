## Objects

<dl>
<dt><a href="#elementify">elementify</a> : <code>object</code></dt>
<dd><p>This is the main exported object enabled in browser mode and for modules import</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#keyValueObject">keyValueObject</a> : <code>object</code></dt>
<dd><p>Any vanilla object that is on the form of a paired key/value structure :</p>
</dd>
<dt><a href="#DocumentFragment">DocumentFragment</a></dt>
<dd></dd>
<dt><a href="#forEachCallback">forEachCallback</a> : <code>function</code></dt>
<dd><p>This callback is used in forEach callback.</p>
</dd>
</dl>

<a name="elementify"></a>

## elementify : <code>object</code>
This is the main exported object enabled in browser mode and for modules import

**Kind**: global namespace  
<a name="keyValueObject"></a>

## keyValueObject : <code>object</code>
Any vanilla object that is on the form of a paired key/value structure :

**Kind**: global typedef  
**Example**  
```js
{
  key1: value1,
  key2: value2,
  [...],
  keyN: valueN
 }
```
<a name="DocumentFragment"></a>

## DocumentFragment
**Kind**: global typedef  
**See**: https://developer.mozilla.org/fr/docs/Web/API/DocumentFragment  
<a name="forEachCallback"></a>

## forEachCallback : <code>function</code>
This callback is used in forEach callback.

**Kind**: global typedef  
**Since**: 1.0.0  
**Version**: 1.0.0  
**Author**: Liqueur de Toile <contact@liqueurdetoile.com>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Object</code> \| <code>Number</code> \| <code>String</code> \| <code>Array</code> \| <code>HtmlElement</code> | Value at the <tt>index</tt> offset |
| index | <code>Number</code> \| <code>String</code> | Index of the Element.  It will be a number for a [Collection](elementify.Collection)  or [HtmlElement](HtmlElement)  and the key for an [ObjectArray](ObjectArray) |
| offset | <code>Number</code> | Offset of the current value in an [ObjectArray](ObjectArray) |


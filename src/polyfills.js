/// Polyfills that aren't done using babel go here

import 'details-element-polyfill';

if (!String.prototype.trimStart) {
  String.prototype.trimStart = String.prototype.trimLeft;
}
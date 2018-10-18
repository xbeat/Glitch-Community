/// Polyfills that aren't done using babel go here
// In general we want to manage them with babel

import 'details-element-polyfill';

if (!String.prototype.trimStart) {
  String.prototype.trimStart = String.prototype.trimLeft;
}
if (!String.prototype.trimEnd) {
  String.prototype.trimEnd = String.prototype.trimRight;
}
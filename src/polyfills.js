// Polyfills that aren't done using babel go here
// In general we want to manage them with babel

/* eslint-disable no-extend-native */
import 'details-element-polyfill';
import 'core-js/fn/array/of';

if (!String.prototype.trimStart) {
  String.prototype.trimStart = String.prototype.trimLeft;
}
if (!String.prototype.trimEnd) {
  String.prototype.trimEnd = String.prototype.trimRight;
}
/* eslint-enable no-extend-native */

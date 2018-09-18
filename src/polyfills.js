/// Polyfills go here
// In general we shouldn't be using features not supported by browsers
// but some things are really convenient, or pretty much supported everywhere
// Make sure to re-evaluate these from time to time!

import 'details-element-polyfill';

if (!String.prototype.trimStart) {
  String.prototype.trimStart = String.prototype.trimLeft;
}
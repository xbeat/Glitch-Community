Style Guide
===========

General
-------

This is a codebase in transition.  What started as coffeescript/jadelet/Observables is making its way toward ES6/React.js.

We're not strict about enforcing the "latest styles" on any new code, we merely ask that new code heads in the right direction.  That direction being...

Prefer Dependency Injection
---------------------------
All modules receive their dependencies as arguments to their constructor.  This is most especially true for any modules that we write, but we make exceptions for stateless NPM modules and react components.

Most importantly we shouldn't pass state into a module by way of an import().

Make the Most of ES6
--------------------
We're using it, and it's sweet!  Enjoy destructuring, ES6 classes, import/export, string literals, etc. 

Here

Prefer Common React Patterns
----------------------------
[React Patterns](https://reactpatterns.com/) is a great guide.  For the most part, our React code can all be written using the *stateless function* pattern.  When we need state, we can use the *container component* pattern.  It's rare that we need to build something that can't be factored out into those patterns.

Avoid Components That Think Too Hard
------------------------------------
Think about React components like you do functions.  If the component its getting to complicated, it probably needs to be decomposed.

Use React Prop-Types
--------------------
Our rule for prop types use is this:

 - Any React Component that's not a stateless function should declare all of its parameters as prop types. This is done primarily as a form of documentation for the input parameters to the component.
 
 - Any Stateless Function should define prop-types for any props _which it itself uses_, but not for any props which it merely passes directly through to sub-components.  In this manner we achieve prop-types composition across our stateless functions and maintain prop-types coverage without redundancy.
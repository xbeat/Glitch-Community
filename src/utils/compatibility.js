
// Here's a bunch of browser support tests
// If any of them don't work we can't run the editor or embeds in this browser
export const getBrowserJSCompatibility = () => {
  try {
    /* eslint-disable no-unused-vars */
    let x = {a: 1, b: 2}; // Can we use let?
    const y = [1, 2, 3]; // Can we use const?
    const {a, ...aRest} = x; // Can we use object destructuring?
    const [b, ...bRest] = y; // Can we use array destructuring?
    const str = `${b}23`; // Can we use formatted strings?
    const func = (f, ...args) => f(...args); // Can we define arrow functions?
    func(async arg => await arg, Promise.resolve()); // Can we do async/await?
    new URLSearchParams(); // Do we have URLSearchParams? 
    /* eslint-enable no-unused-vars */

  return true;
  } catch (error) {
    console.log("Sorry, you don't have the necessary JS permissions to run Glitch code editors", error);
    return false;
  }
}

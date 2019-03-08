/* eslint-disable */

async function AsyncMap(array, asyncFunction) {
  return Promise.all(array.map(await asyncFunction));
}

export default AsyncMap;
/* eslint-disable */

async function AsyncMap(array, asyncFunction) {
  return await Promise.all(array.map(asyncFunction));
}

export default AsyncMap;
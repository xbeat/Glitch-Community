/// Api helper functions

const getFromApi = async (api, url) => {
  const { data } = await api.get(url);
  return data;
}

const getSingleItem = async (api, url, key) => {
  // The api is case insensitive when getting by url/login
  // but it'll return an object keyed using the correct case
  // for now do an icky hack so we can get the team page
  const data = getFromApi(api, url);
  if (data[key]) {
    return data[key];
  }
  const realKey = 
}

const getAllPages = async (api, url) => {
  let hasMore = true;
  let results = [];
  while (hasMore) {
    const data = await getFromApi(api, url);
    results.push(...data.items);
    hasMore = data.hasMore;
    url = data.nextPage;
  }
  return results;
};

module.exports = {
  getFromApi,
  getAllPages,
};
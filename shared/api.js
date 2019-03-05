/// Api helper functions

async function getFromApi(api, url) {
  const { data } = await api.get(url);
  return data;
}

const getAllPages = async (api, url) => {
  let hasMore = true;
  let results = [];
  while (hasMore) {
    const { data } = await api.get(url);
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
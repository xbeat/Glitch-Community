/// Api helper functions

async function getFromApi(api, url) {
  const { data } = await api.get(url);
  return data;
}

module.exports = {
  getFromApi,
};
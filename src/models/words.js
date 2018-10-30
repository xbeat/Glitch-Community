import axios from 'axios';

const api = axios.create({
  baseURL: 'https://friendly-words.glitch.me/',
});

const getData = async (name) => {
  const {data} = await api.get(name);
  return data;
};

export const getPredicates = () => getData('predicates');
export const getObjects = () => getData('objects');
export const getCollectionPairs = () => getData('collection-pairs');

const getFirst = async (name) => {
  const data = await getData(name);
  return data[0];
};

export const getWordPair = () => getFirst('word-pairs');
export const getTeamPair = () => getFirst('team-pairs');
export const getCollectionPair = () => getFirst('collection-pairs');
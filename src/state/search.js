/* eslint-disable prefer-default-export */
import algoliasearch from 'algoliasearch/lite';
import { useState, useEffect } from 'react';

const searchClient = algoliasearch('LAS7VGSQIQ', '27938e7e8e998224b9e1c3f61dd19160');

const searchIndex = searchClient.initIndex('search');

export function useSearch(query) {
  const [results, setResults] = useState({ hits: [], nbHits: 0 });
  useEffect(() => {
    searchIndex.search({ query, hitsPerPage: 100 }).then((res) => setResults(res));
  }, [query]);
  return results;
}

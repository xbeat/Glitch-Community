/* eslint-disable prefer-default-export */
import algoliasearch from 'algoliasearch/lite';
import { useState, useEffect } from 'react';

const searchClient = algoliasearch('LAS7VGSQIQ', '27938e7e8e998224b9e1c3f61dd19160');

const searchIndex = searchClient.initIndex('search');

// TODO: all this data really ought to be in the raw data

function formatUser (hit) {
  return {
    id: Number(hit.objectID.split('-')[1]),
    thanksCount: hit.thanks,
    hasCoverImage: false,
    ...hit,
  }
}

function formatHit(hit) {
  switch (hit.type) {
    case 'user':
      return formatUser(hit)
    default:
      return hit
  }
}


export function useSearch(query) {
  const [results, setResults] = useState({ hits: [], nbHits: 0 });
  useEffect(() => {
    searchIndex.search({ query, hitsPerPage: 100 }).then((res) => setResults(res));
  }, [query]);
  console.log(results.hits)
  return {
    hits: results.hits.map(formatHit),
  };
}

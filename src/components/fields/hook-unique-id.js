import React from 'react';

let counter = 0;

const useUniqueId = () => {
  const [uniqueId] = React.useState(() => {
    counter += 1;
    return counter;
  });
  return `input-${uniqueId}`;
};

export default useUniqueId;
import React from 'react';

let value = 0;

const useUniqueId = () => {
  const [uniqueId] = React.useState(() => {
    value += 1;
    return value;
  });
  return uniqueId;
};

export default useUniqueId;
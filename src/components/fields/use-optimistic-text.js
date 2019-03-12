import React from 'react';

import useOptimisticValue from './use-optimistic-value';

const useOptimisticText = (realValue, setRealValueAsync) => {
  return useOptimisticValue(realValue, newValue => setRealValueAsync(realValue.trim()));
};

export default useOptimisticText;
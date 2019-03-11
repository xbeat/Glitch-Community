import React from 'react';

import useDebouncedValue from './use-debounced-value';

const useOptimisticValue = (realValue, setValueAsync) => {
  const [stateValue, setStateValue] = React.useState({ value: undefined, error: null });
  
  const setStateIfMatches = (newState, valueToMatch) => {
    setStateValue(prevState => {
      if (prevState.value === valueToMatch) {
        return newState;
      }
      return prevState;
    });
  };
  
  const setValue = async (newValue) => {
    try {
      await setValueAsync(newValue);
      setStateIfMatches({ value: undefined, error: null }, newValue);
    } catch (error) {
      setStateIfMatches({ value: newValue, error }, newValue);
    }
  };
  
  const optimisticValue = stateValue === undefined ? realValue : stateValue;
  const setOptimisticValue = (newValue) => {
    setStateValue({ value: newValue, error: null });
    
  };
  
  return [optimisticValue, stateValue.error, setOptimisticValue];
};

export default useOptimisticValue;
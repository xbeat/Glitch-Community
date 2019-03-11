import React from 'react';

import useDebouncedValue from './use-debounced-value';

const useOptimisticValue = (realValue, setValueAsync) => {
  const [state, setState] = React.useState({ value: undefined, error: null });
  
  const optimisticValue = state.value !== undefined ? state.value : realValue;
  const setOptimisticValue = (newValue) => {
    setState({ value: newValue, error: null });
  };
  
  const debouncedValue = useDebouncedValue(optimisticValue);
  React.useEffect(() => {
    if (debouncedValue !== realValue) {
      
    }
  }, [debouncedValue, realValue]);
  
  return [optimisticValue, state.error, setOptimisticValue];
};
  
  const setStateIfMatches = (newState, valueToMatch) => {
    setState(prevState => {
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
  

export default useOptimisticValue;